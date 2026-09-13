import { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { KioskBar } from './components/common/KioskBar';
import { LandingView } from './components/patient/LandingView';
import { LanguageView } from './components/patient/LanguageView';
import { PatientIdentView } from './components/patient/PatientIdentView';
import { ConsentView } from './components/patient/ConsentView';
import { ConsultationTypeView } from './components/patient/ConsultationTypeView';
import { PatientDashboardView } from './components/patient/PatientDashboardView';
import { HistoryInterviewView } from './components/patient/HistoryInterviewView';
import { AyushModuleView } from './components/patient/AyushModuleView';
import { DocumentUploadView } from './components/patient/DocumentUploadView';
import { SummaryReviewView } from './components/patient/SummaryReviewView';
import { CompletionView } from './components/patient/CompletionView';
import { PhysicianQueueView } from './components/physician/PhysicianQueueView';
import { PatientRecordView } from './components/physician/PatientRecordView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import {
  Patient,
  ClinicalCase,
  MedicalDocument,
  LanguageCode,
  AccessibilitySettings,
  ConsultationType
} from './types';
import { db } from './services/db';
import { AudioService } from './services/ai';

export type AppView =
  | 'landing'
  | 'language'
  | 'patient_ident'
  | 'consent'
  | 'consult_type'
  | 'patient_dash'
  | 'history_interview'
  | 'ayush_module'
  | 'document_upload'
  | 'summary_review'
  | 'completion'
  | 'physician_queue'
  | 'physician_record'
  | 'admin_dashboard';

export default function App() {
  // Current role mode: 'patient' | 'physician' | 'admin'
  const [roleMode, setRoleMode] = useState<'patient' | 'physician' | 'admin'>('patient');

  // Sub-view within patient or physician flow
  const [currentView, setCurrentView] = useState<AppView>('landing');

  // Active Patient state for kiosk journey
  const [activePatient, setActivePatient] = useState<Patient>(() => {
    const patients = db.getPatients();
    return patients[0];
  });

  // Active clinical case
  const [activeCase, setActiveCase] = useState<ClinicalCase | undefined>(() =>
    db.getCaseByPatientId(activePatient.id)
  );

  // Active documents
  const [patientDocuments, setPatientDocuments] = useState<MedicalDocument[]>(() =>
    db.getDocumentsByPatientId(activePatient.id)
  );

  // Selected patient for physician record view
  const [selectedPhysicianPatient, setSelectedPhysicianPatient] = useState<Patient | null>(null);

  // Global accessibility state
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    language: 'hi',
    textSize: 'normal',
    highContrast: false,
    audioAssistance: false,
    screenReader: false
  });

  // Keep accessibility & audio synchronized
  const handleAccessibilityChange = (newSettings: AccessibilitySettings) => {
    setAccessibility(newSettings);
  };

  // Switch role tabs from top navigation
  const handleRoleChange = (role: 'patient' | 'physician' | 'admin') => {
    setRoleMode(role);
    AudioService.stopSpeaking();

    if (role === 'patient') {
      setCurrentView('landing');
    } else if (role === 'physician') {
      setCurrentView('physician_queue');
    } else if (role === 'admin') {
      setCurrentView('admin_dashboard');
    }
  };

  // Text size classes
  const textSizeClass =
    accessibility.textSize === 'large'
      ? 'text-lg'
      : accessibility.textSize === 'extra-large'
      ? 'text-xl'
      : 'text-base';

  const highContrastClass = accessibility.highContrast ? 'contrast-125 saturate-150' : '';

  return (
    <div
      className={`min-h-screen flex flex-col bg-white text-[#171717] font-sans selection:bg-[#6C3FC5] selection:text-white ${textSizeClass} ${highContrastClass}`}
    >
      {/* 1. Global Navigation Header */}
      <Header
        activeRole={roleMode}
        onSelectRole={handleRoleChange}
        kioskId="KIOSK-01"
      />

      {/* 2. Accessible Kiosk Bar (Language, Zoom, Audio, Emergency Alert) */}
      <KioskBar
        settings={accessibility}
        onSettingsChange={handleAccessibilityChange}
      />

      {/* 3. Main Stage Content */}
      <main className="flex-1 flex flex-col bg-white">
        {/* ================= PATIENT JOURNEY FLOW ================= */}
        {roleMode === 'patient' && (
          <>
            {/* Step 1: Landing Page */}
            {currentView === 'landing' && (
              <LandingView
                language={accessibility.language}
                onStart={() => setCurrentView('language')}
                onLanguageClick={() => setCurrentView('language')}
              />
            )}

            {/* Step 2: Language Selector */}
            {currentView === 'language' && (
              <LanguageView
                currentLanguage={accessibility.language}
                onSelectLanguage={lang => {
                  setAccessibility({ ...accessibility, language: lang });
                }}
                onContinue={() => setCurrentView('patient_ident')}
                onBack={() => setCurrentView('landing')}
              />
            )}

            {/* Step 3: Patient Identification & Registration */}
            {currentView === 'patient_ident' && (
              <PatientIdentView
                language={accessibility.language}
                onPatientIdentified={patient => {
                  setActivePatient(patient);
                  const c = db.getCaseByPatientId(patient.id);
                  setActiveCase(c);
                  setPatientDocuments(db.getDocumentsByPatientId(patient.id));
                  setCurrentView('consent');
                }}
                onBack={() => setCurrentView('language')}
              />
            )}

            {/* Step 4: Informed Consent */}
            {currentView === 'consent' && (
              <ConsentView
                patientId={activePatient.id}
                patientName={activePatient.fullName}
                language={accessibility.language}
                onConsentAgreed={_consentRecord => {
                  setCurrentView('consult_type');
                }}
                onBack={() => setCurrentView('patient_ident')}
              />
            )}

            {/* Step 5: Department & Consultation Type (Modern vs AYUSH) */}
            {currentView === 'consult_type' && (
              <ConsultationTypeView
                consultationType={activePatient.consultationType}
                onSelectType={type => {
                  const updated = { ...activePatient, consultationType: type };
                  setActivePatient(updated);
                  db.updatePatientStatus(activePatient.id, activePatient.status);
                }}
                onContinue={() => setCurrentView('patient_dash')}
                onBack={() => setCurrentView('consent')}
                patientName={activePatient.fullName}
              />
            )}

            {/* Step 6: Patient Intake Welcome & Progress */}
            {currentView === 'patient_dash' && (
              <PatientDashboardView
                patient={activePatient}
                hasCaseHistory={!!activeCase}
                onStartHistory={() => setCurrentView('history_interview')}
                onGoToDocuments={() => setCurrentView('document_upload')}
              />
            )}

            {/* Step 7: AI Clinical History Interview (Voice + Text + SOCRATES) */}
            {currentView === 'history_interview' && (
              <HistoryInterviewView
                patient={activePatient}
                existingCase={activeCase}
                language={accessibility.language}
                onCompleteHistory={cCase => {
                  setActiveCase(cCase);
                  if (activePatient.consultationType === 'ayush') {
                    setCurrentView('ayush_module');
                  } else {
                    setCurrentView('document_upload');
                  }
                }}
                onBack={() => setCurrentView('patient_dash')}
              />
            )}

            {/* Step 8 (Optional for AYUSH): Ayurvedic Dashavidha Pariksha Module */}
            {currentView === 'ayush_module' && (
              <AyushModuleView
                patient={activePatient}
                initialAssessment={activeCase?.ayushAssessment}
                onSave={_assessment => {
                  const c = db.getCaseByPatientId(activePatient.id);
                  setActiveCase(c);
                  setCurrentView('document_upload');
                }}
                onBack={() => setCurrentView('history_interview')}
              />
            )}

            {/* Step 9: Medical Document Upload & Simulated AI OCR */}
            {currentView === 'document_upload' && (
              <DocumentUploadView
                patient={activePatient}
                documents={patientDocuments}
                onDocumentsUpdated={docs => {
                  setPatientDocuments(docs);
                }}
                onContinue={() => setCurrentView('summary_review')}
                onBack={() => {
                  if (activePatient.consultationType === 'ayush') {
                    setCurrentView('ayush_module');
                  } else {
                    setCurrentView('history_interview');
                  }
                }}
              />
            )}

            {/* Step 10: Structured Clinical History Review */}
            {currentView === 'summary_review' && activeCase && (
              <SummaryReviewView
                patient={activePatient}
                clinicalCase={activeCase}
                documents={patientDocuments}
                testResults={db.getTestResultsByPatientId(activePatient.id)}
                onConfirm={() => {
                  db.updatePatientStatus(activePatient.id, 'waiting');
                  setCurrentView('completion');
                }}
                onEdit={() => setCurrentView('history_interview')}
                onBack={() => setCurrentView('document_upload')}
              />
            )}

            {/* Step 11: Intake Completion & Waiting Pass */}
            {currentView === 'completion' && (
              <CompletionView
                patient={activePatient}
                clinicalCase={activeCase}
                onDone={() => {
                  setCurrentView('landing');
                }}
              />
            )}
          </>
        )}

        {/* ================= PHYSICIAN WORKSTATION ================= */}
        {roleMode === 'physician' && (
          <>
            {currentView === 'physician_queue' && (
              <PhysicianQueueView
                onSelectPatient={patient => {
                  setSelectedPhysicianPatient(patient);
                  setCurrentView('physician_record');
                }}
              />
            )}

            {currentView === 'physician_record' && selectedPhysicianPatient && (
              <PatientRecordView
                patient={selectedPhysicianPatient}
                onBackToQueue={() => {
                  setSelectedPhysicianPatient(null);
                  setCurrentView('physician_queue');
                }}
              />
            )}
          </>
        )}

        {/* ================= ADMIN & TRIAGE OPERATIONS ================= */}
        {roleMode === 'admin' && <AdminDashboardView />}
      </main>

      {/* Global Footer with Compliance and Non-Diagnostic Disclaimer */}
      <footer className="border-t border-neutral-200 py-4 px-6 bg-neutral-50 text-xs text-neutral-600 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#6C3FC5]" />
          <span className="font-bold text-[#171717]">MediKiosk</span>
          <span>• AI Clinical History-Taking & Patient Intake Platform</span>
        </div>

        <div className="text-[11px] text-neutral-500 text-center sm:text-right">
          ABDM Sandbox & FHIR R4 Compliant • Designed for Indian OPDs & AYUSH Institutions
        </div>
      </footer>
    </div>
  );
}
