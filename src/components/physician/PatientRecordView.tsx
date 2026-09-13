import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Printer,
  FileCode,
  Share2,
  Stethoscope,
  Clock,
  Pill,
  Flower2,
  Save,
  Check
} from 'lucide-react';
import { Patient, ClinicalCase, MedicalDocument, TimelineEvent } from '../../types';
import { db } from '../../services/db';
import { AbdmFhirBridge } from '../../services/abdm';
import { DifferentialAssistanceView } from './DifferentialAssistanceView';
import { MedicationReconView } from './MedicationReconView';
import { TimelineView } from '../patient/TimelineView';

interface PatientRecordViewProps {
  patient: Patient;
  onBackToQueue: () => void;
}

export function PatientRecordView({ patient, onBackToQueue }: PatientRecordViewProps) {
  const [clinicalCase, setClinicalCase] = useState<ClinicalCase | undefined>(
    db.getCaseByPatientId(patient.id)
  );
  const [documents, setDocuments] = useState<MedicalDocument[]>(
    db.getDocumentsByPatientId(patient.id)
  );
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(
    db.getTimelineByPatientId(patient.id)
  );

  const [activeTab, setActiveTab] = useState<
    'summary' | 'differential' | 'med_recon' | 'timeline' | 'documents' | 'ayush' | 'abdm'
  >('summary');

  // Physician note editing state
  const [vitalsBp, setVitalsBp] = useState('138/88 mmHg');
  const [vitalsPulse, setVitalsPulse] = useState('86 bpm');
  const [vitalsSpo2, setVitalsSpo2] = useState('97% on room air');
  const [vitalsTemp, setVitalsTemp] = useState('98.4 °F');

  const [physicalExam, setPhysicalExam] = useState(
    'CVS: S1, S2 heard. No murmurs. Mild epigastric tenderness. Respiratory: Bilateral air entry clear. No wheezing or crepitations. Peripheries: Warm, mild diaphoresis noted.'
  );
  const [doctorDiagnosis, setDoctorDiagnosis] = useState(
    clinicalCase?.hasRedFlags
      ? 'Suspected Acute Coronary Syndrome (Unstable Angina) - Rule out NSTEMI'
      : 'Acute Medical Presentation - Workup ongoing'
  );
  const [doctorPlan, setDoctorPlan] = useState(
    '1. Stat 12-Lead ECG + Cardiac Troponin I\n2. Tab. Aspirin 300 mg stat chewable\n3. Tab. Clopidogrel 300 mg stat\n4. Sublingual Nitroglycerin 0.5 mg sos for persistent chest pain\n5. Cardiology consult for urgent 2D Echo'
  );

  const [isSigned, setIsSigned] = useState(patient.status === 'completed');
  const [showFhirModal, setShowFhirModal] = useState(false);
  const [fhirJson, setFhirJson] = useState('');
  const [abdmSynced, setAbdmSynced] = useState(false);

  useEffect(() => {
    // Refresh data on mount
    const c = db.getCaseByPatientId(patient.id);
    setClinicalCase(c);
    setDocuments(db.getDocumentsByPatientId(patient.id));
    setTimelineEvents(db.getTimelineByPatientId(patient.id));
  }, [patient.id]);

  // Handle Physician Sign-off
  const handleApproveAndSign = () => {
    if (clinicalCase) {
      const updatedCase: ClinicalCase = {
        ...clinicalCase,
        physicianNotes: `Physical Exam:\n${physicalExam}\n\nDiagnosis:\n${doctorDiagnosis}\n\nPlan:\n${doctorPlan}`,
        physicianReviewed: true,
        status: 'reviewed_by_physician'
      };
      db.saveCase(updatedCase);
      setClinicalCase(updatedCase);
    }
    db.updatePatientStatus(patient.id, 'completed');
    setIsSigned(true);
  };

  // Export to FHIR Bundle
  const handleExportFhir = () => {
    if (clinicalCase) {
      const bundle = AbdmFhirBridge.generateFhirBundle(patient, clinicalCase, documents);
      setFhirJson(JSON.stringify(bundle, null, 2));
      setShowFhirModal(true);
    }
  };

  // Sync with ABDM PHR
  const handleSyncAbdm = async () => {
    if (clinicalCase) {
      const bundle = AbdmFhirBridge.generateFhirBundle(patient, clinicalCase, documents);
      await AbdmFhirBridge.pushToPhr(patient.abhaId || '91-9876543210-01', bundle);
      setAbdmSynced(true);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Back button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={onBackToQueue}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-black"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Patient Queue</span>
        </button>
      </div>

      {/* Red Flag Priority Banner if active */}
      {(patient.isPriority || clinicalCase?.hasRedFlags) && (
        <div className="mb-6 p-4 bg-white border-2 border-[#6C3FC5] rounded-lg shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-[#6C3FC5] flex-shrink-0" />
            <div>
              <span className="font-black text-[#6C3FC5] text-sm uppercase tracking-wider block">
                Clinical Priority Alert — Red Flag Identified
              </span>
              <p className="text-xs text-neutral-800 font-semibold mt-0.5">
                {clinicalCase?.redFlagReason ||
                  'Symptoms include acute retrosternal chest pain with diaphoresis and radiation.'}
              </p>
              <p className="text-[11px] text-neutral-500 mt-1 italic">
                Immediate physician evaluation recommended. Triage alerted.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Patient Header Workstation Card */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6 shadow-xs mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-neutral-900">{patient.fullName}</span>
              <span className="font-mono text-sm font-black bg-neutral-100 text-neutral-900 border border-neutral-300 px-2.5 py-0.5 rounded">
                Token {patient.token}
              </span>
              {isSigned && (
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-neutral-100 text-neutral-800 border border-neutral-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6C3FC5]" />
                  <span>Signed & Completed</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-neutral-600">
              <span><strong>Age/Gender:</strong> {patient.age}y / {patient.gender}</span>
              <span><strong>Patient ID:</strong> {patient.id}</span>
              <span><strong>ABHA ID:</strong> {patient.abhaId || '91-9876543210-01'}</span>
              <span><strong>Department:</strong> {patient.department}</span>
              <span><strong>Phone:</strong> {patient.phone}</span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-2 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 rounded text-xs font-bold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Summary</span>
            </button>

            <button
              type="button"
              onClick={handleExportFhir}
              className="px-3 py-2 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 rounded text-xs font-bold flex items-center gap-1.5"
            >
              <FileCode className="w-3.5 h-3.5 text-[#6C3FC5]" />
              <span>FHIR R4 Bundle</span>
            </button>

            <button
              type="button"
              disabled={isSigned}
              onClick={handleApproveAndSign}
              className={`px-4 py-2 text-xs font-bold rounded shadow-xs flex items-center gap-1.5 transition-colors ${
                isSigned
                  ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                  : 'bg-[#6C3FC5] hover:bg-[#4B238C] text-white active:scale-[0.98]'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isSigned ? 'Record Signed' : 'Approve & Sign'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tab Selector (Dropdown on < sm screens) */}
      <div className="sm:hidden mb-3">
        <label className="block text-xs font-bold text-[#171717] mb-1">
          Select Clinical Section:
        </label>
        <select
          value={activeTab}
          onChange={e => setActiveTab(e.target.value as any)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#6C3FC5]"
        >
          <option value="summary">AI Clinical Summary (Draft)</option>
          <option value="differential">Diagnostic Considerations</option>
          <option value="med_recon">Medication Reconciliation</option>
          <option value="timeline">Medical Timeline ({timelineEvents.length})</option>
          <option value="documents">Documents & OCR ({documents.length})</option>
          {patient.consultationType === 'ayush' && <option value="ayush">AYUSH Pariksha</option>}
          <option value="abdm">ABDM & FHIR</option>
        </select>
      </div>

      {/* Tabs Navigation (Scrollable on >= sm screens) */}
      <div className="hidden sm:flex items-center gap-1.5 border-b border-neutral-200 bg-[#F3EEFC]/60 p-2 rounded-t-2xl overflow-x-auto text-xs font-bold scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap min-h-[38px] ${
            activeTab === 'summary'
              ? 'bg-[#6C3FC5] text-white shadow-xs'
              : 'text-[#666666] hover:bg-white hover:text-[#171717]'
          }`}
        >
          AI Clinical Summary (Draft)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('differential')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 min-h-[38px] ${
            activeTab === 'differential'
              ? 'bg-[#6C3FC5] text-white shadow-xs'
              : 'text-[#666666] hover:bg-white hover:text-[#171717]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Diagnostic Considerations</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('med_recon')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 min-h-[38px] ${
            activeTab === 'med_recon'
              ? 'bg-[#6C3FC5] text-white shadow-xs'
              : 'text-[#666666] hover:bg-white hover:text-[#171717]'
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          <span>Medication Reconciliation</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 min-h-[38px] ${
            activeTab === 'timeline'
              ? 'bg-[#6C3FC5] text-white shadow-xs'
              : 'text-[#666666] hover:bg-white hover:text-[#171717]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Medical Timeline ({timelineEvents.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap min-h-[38px] ${
            activeTab === 'documents'
              ? 'bg-[#6C3FC5] text-white shadow-xs'
              : 'text-[#666666] hover:bg-white hover:text-[#171717]'
          }`}
        >
          Documents & OCR ({documents.length})
        </button>

        {patient.consultationType === 'ayush' && (
          <button
            type="button"
            onClick={() => setActiveTab('ayush')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 min-h-[38px] ${
              activeTab === 'ayush'
                ? 'bg-[#6C3FC5] text-white shadow-xs'
                : 'text-[#666666] hover:bg-white hover:text-[#171717]'
            }`}
          >
            <Flower2 className="w-3.5 h-3.5" />
            <span>AYUSH Pariksha</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab('abdm')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 min-h-[38px] ${
            activeTab === 'abdm'
              ? 'bg-[#6C3FC5] text-white shadow-xs'
              : 'text-[#666666] hover:bg-white hover:text-[#171717]'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>ABDM & FHIR</span>
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="bg-white border-x border-b border-neutral-200 rounded-b-lg p-6 shadow-xs min-h-[500px]">
        {/* TAB 1: SUMMARY & PHYSICIAN WORKSTATION */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {/* Disclaimer */}
            <div className="p-3 bg-neutral-50 border border-neutral-300 rounded-md text-xs text-neutral-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#6C3FC5] flex-shrink-0" />
                <span className="font-semibold">
                  AI-generated clinical draft. Please review and verify before finalizing.
                </span>
              </div>
              <span className="text-[11px] text-neutral-500 font-mono">
                Draft Generated: {clinicalCase?.aiDraftGeneratedAt || 'Just now'}
              </span>
            </div>

            {/* Split Workstation Layout: 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Patient Intake History (6 cols) */}
              <div className="lg:col-span-6 space-y-4">
                <div className="border-b border-neutral-200 pb-2 flex items-center justify-between">
                  <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6C3FC5]" />
                    Patient-Reported History (AI Intake)
                  </h3>
                  <span className="text-[11px] font-bold text-neutral-500">Read-Only Source</span>
                </div>

                {/* Chief Complaint */}
                <div className="p-3.5 bg-neutral-50 rounded border border-neutral-200 text-xs space-y-1">
                  <span className="font-bold text-neutral-800 block">Chief Complaint:</span>
                  <div className="text-neutral-900 font-medium text-sm">
                    {clinicalCase?.chiefComplaints?.[0]?.complaint || 'No complaint logged'}
                  </div>
                  <div className="text-neutral-500">
                    Duration: {clinicalCase?.chiefComplaints?.[0]?.duration} • Severity Score: {clinicalCase?.chiefComplaints?.[0]?.severity}/10
                  </div>
                </div>

                {/* HPI Narrative */}
                <div className="p-3.5 bg-neutral-50 rounded border border-neutral-200 text-xs space-y-1">
                  <span className="font-bold text-neutral-800 block">HPI Narrative:</span>
                  <p className="text-neutral-700 leading-relaxed">
                    {clinicalCase?.hpiNarrative || 'Recorded during intake.'}
                  </p>
                </div>

                {/* SOCRATES Details */}
                {clinicalCase?.socrates && (
                  <div className="p-3.5 bg-neutral-50 rounded border border-neutral-200 text-xs space-y-2">
                    <span className="font-bold text-neutral-800 block">SOCRATES Analysis:</span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div><strong>Site:</strong> {clinicalCase.socrates.site}</div>
                      <div><strong>Onset:</strong> {clinicalCase.socrates.onset}</div>
                      <div><strong>Character:</strong> {clinicalCase.socrates.character}</div>
                      <div><strong>Radiation:</strong> {clinicalCase.socrates.radiation}</div>
                      <div className="col-span-2">
                        <strong>Associated Symptoms:</strong> {clinicalCase.socrates.associations?.join(', ') || 'None'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Past Medical & Surgical */}
                <div className="p-3.5 bg-neutral-50 rounded border border-neutral-200 text-xs space-y-2">
                  <span className="font-bold text-neutral-800 block">Past History:</span>
                  <div className="space-y-1 text-[11px] text-neutral-700">
                    <div>
                      <strong>Medical:</strong> {clinicalCase?.pastMedicalHistory?.map(p => p.condition).join(', ') || 'None'}
                    </div>
                    <div>
                      <strong>Surgical:</strong> {clinicalCase?.pastSurgicalHistory?.map(s => s.procedure).join(', ') || 'None'}
                    </div>
                    <div>
                      <strong>Allergies:</strong> {clinicalCase?.allergies?.map(a => `${a.allergen} (${a.reaction})`).join(', ') || 'NKDA'}
                    </div>
                  </div>
                </div>

                {/* Uploaded Documents List */}
                <div className="p-3.5 bg-neutral-50 rounded border border-neutral-200 text-xs">
                  <span className="font-bold text-neutral-800 block mb-1">
                    Previous Documents Attached ({documents.length}):
                  </span>
                  {documents.length > 0 ? (
                    <div className="space-y-1 text-[11px]">
                      {documents.map(d => (
                        <div key={d.id} className="text-neutral-700">
                          • {d.title} ({d.documentType})
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-neutral-400">None attached</span>
                  )}
                </div>
              </div>

              {/* Right Column: Physician Note & Prescription Editor (6 cols) */}
              <div className="lg:col-span-6 space-y-4">
                <div className="border-b border-neutral-200 pb-2 flex items-center justify-between">
                  <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-[#6C3FC5]" />
                    Attending Physician Consultation Note
                  </h3>
                  <span className="text-[11px] font-bold text-[#6C3FC5]">Dr. Sneha Roy</span>
                </div>

                {/* Vitals Input Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Blood Pressure</label>
                    <input
                      type="text"
                      value={vitalsBp}
                      onChange={e => setVitalsBp(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-neutral-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Pulse Rate</label>
                    <input
                      type="text"
                      value={vitalsPulse}
                      onChange={e => setVitalsPulse(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-neutral-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">SpO2</label>
                    <input
                      type="text"
                      value={vitalsSpo2}
                      onChange={e => setVitalsSpo2(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-neutral-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Temperature</label>
                    <input
                      type="text"
                      value={vitalsTemp}
                      onChange={e => setVitalsTemp(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-neutral-300 rounded text-xs"
                    />
                  </div>
                </div>

                {/* Physical Examination */}
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Physical Examination Findings
                  </label>
                  <textarea
                    rows={3}
                    value={physicalExam}
                    onChange={e => setPhysicalExam(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300 rounded text-xs font-sans"
                  />
                </div>

                {/* Physician Final Diagnosis */}
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Confirmed / Provisional Diagnosis
                  </label>
                  <input
                    type="text"
                    value={doctorDiagnosis}
                    onChange={e => setDoctorDiagnosis(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300 rounded text-xs font-bold text-neutral-900"
                  />
                </div>

                {/* Treatment Plan & Prescription */}
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Treatment Plan, Investigations & Prescription Orders
                  </label>
                  <textarea
                    rows={5}
                    value={doctorPlan}
                    onChange={e => setDoctorPlan(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300 rounded text-xs font-mono"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200">
                  <div className="text-[11px] text-neutral-500">
                    Signing updates OPD status to completed and freezes intake draft.
                  </div>

                  <button
                    type="button"
                    disabled={isSigned}
                    onClick={handleApproveAndSign}
                    className={`px-6 py-2.5 text-xs font-bold rounded shadow-xs flex items-center gap-1.5 transition-colors ${
                      isSigned
                        ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                        : 'bg-[#6C3FC5] hover:bg-[#4B238C] text-white active:scale-[0.98]'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSigned ? 'Verified & Signed' : 'Verify & Sign Record'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DIFFERENTIAL ASSISTANCE */}
        {activeTab === 'differential' && (
          <DifferentialAssistanceView patient={patient} clinicalCase={clinicalCase} />
        )}

        {/* TAB 3: MEDICATION RECONCILIATION */}
        {activeTab === 'med_recon' && (
          <MedicationReconView
            patient={patient}
            clinicalCase={clinicalCase}
            reportedMeds={clinicalCase?.medications || []}
            documents={documents}
          />
        )}

        {/* TAB 4: MEDICAL TIMELINE */}
        {activeTab === 'timeline' && <TimelineView events={timelineEvents} />}

        {/* TAB 5: DOCUMENTS & OCR */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-neutral-900">
              Uploaded Records & Extracted Clinical Text
            </h3>
            {documents.length === 0 ? (
              <p className="text-neutral-500 text-xs">No documents uploaded for this patient.</p>
            ) : (
              <div className="space-y-3">
                {documents.map(doc => (
                  <div key={doc.id} className="p-4 border border-neutral-200 rounded-lg bg-neutral-50 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-neutral-900 text-sm">{doc.title}</span>
                      <span className="font-mono text-[11px] text-neutral-500">{doc.documentDate}</span>
                    </div>
                    {doc.extractedData && (
                      <div className="bg-white p-3 border border-neutral-200 rounded space-y-1">
                        <div><strong>Diagnoses:</strong> {doc.extractedData.diagnoses.join(', ') || 'N/A'}</div>
                        <div><strong>Medications:</strong> {doc.extractedData.medications.map(m => `${m.name} ${m.dosage}`).join(', ') || 'N/A'}</div>
                        <div><strong>Investigations:</strong> {doc.extractedData.investigations.map(i => `${i.test} (${i.result})`).join(', ') || 'N/A'}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: AYUSH ASSESSMENT */}
        {activeTab === 'ayush' && clinicalCase?.ayushAssessment && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
              <h3 className="text-base font-bold text-neutral-900">
                Ayurvedic Dashavidha Pariksha Intake Assessment
              </h3>
              <span className="text-xs font-bold text-[#6C3FC5]">Kayachikitsa OPD</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded">
                <span className="font-bold text-neutral-500 block">Prakriti</span>
                <span className="font-bold text-neutral-900 text-sm">{clinicalCase.ayushAssessment.prakriti}</span>
              </div>
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded">
                <span className="font-bold text-neutral-500 block">Vikriti</span>
                <span className="font-bold text-neutral-900 text-sm">{clinicalCase.ayushAssessment.vikriti}</span>
              </div>
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded">
                <span className="font-bold text-neutral-500 block">Agni (Digestive Fire)</span>
                <span className="font-bold text-neutral-900 text-sm">{clinicalCase.ayushAssessment.agni}</span>
              </div>
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded">
                <span className="font-bold text-neutral-500 block">Koshtha (Bowel)</span>
                <span className="font-bold text-neutral-900 text-sm">{clinicalCase.ayushAssessment.koshtha}</span>
              </div>
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded">
                <span className="font-bold text-neutral-500 block">Sara (Tissues)</span>
                <span className="font-bold text-neutral-900 text-sm">{clinicalCase.ayushAssessment.sara}</span>
              </div>
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded">
                <span className="font-bold text-neutral-500 block">Ahara Shakti</span>
                <span className="font-bold text-neutral-900 text-sm">{clinicalCase.ayushAssessment.aharaShakti}</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded space-y-1">
              <span className="font-bold text-neutral-800 block">Samprapti (Pathogenesis summary for Vaidya):</span>
              <p className="text-neutral-700">{clinicalCase.ayushAssessment.sampraptiSummary}</p>
            </div>
          </div>
        )}

        {/* TAB 7: ABDM & FHIR INTEROPERABILITY */}
        {activeTab === 'abdm' && (
          <div className="space-y-6">
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-5 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900">
                  Ayushman Bharat Digital Mission (ABDM) Gateway
                </h3>
                <span className="font-mono text-[11px] font-bold text-[#6C3FC5] bg-white px-2 py-0.5 rounded border border-neutral-200">
                  M3 Sandbox Certified
                </span>
              </div>

              <p className="text-neutral-600">
                Linked ABHA ID: <strong className="text-neutral-900">{patient.abhaId || '91-9876543210-01'}</strong> • Status: Verified with Aadhaar KYC
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleExportFhir}
                  className="px-4 py-2 bg-neutral-900 text-white rounded font-bold text-xs flex items-center gap-1.5"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Inspect FHIR Bundle JSON</span>
                </button>

                <button
                  type="button"
                  onClick={handleSyncAbdm}
                  className="px-4 py-2 bg-[#6C3FC5] text-white rounded font-bold text-xs flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{abdmSynced ? 'Synced with Patient PHR' : 'Push to Linked PHR Locker'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FHIR JSON Modal */}
      {showFhirModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[85vh] flex flex-col p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <h3 className="text-base font-bold text-neutral-900">FHIR R4 DiagnosticReport Bundle</h3>
                <span className="text-xs text-neutral-500 font-mono">Patient: {patient.fullName} (ABHA: {patient.abhaId})</span>
              </div>
              <button
                type="button"
                onClick={() => setShowFhirModal(false)}
                className="text-neutral-400 hover:text-black text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 bg-neutral-900 text-neutral-100 font-mono text-[11px] rounded mt-4">
              <pre>{fhirJson}</pre>
            </div>

            <div className="pt-4 border-t border-neutral-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(fhirJson);
                  alert('FHIR JSON copied to clipboard!');
                }}
                className="px-4 py-2 bg-white border border-neutral-300 text-xs font-bold text-neutral-800 rounded hover:bg-neutral-50"
              >
                Copy JSON
              </button>
              <button
                type="button"
                onClick={() => setShowFhirModal(false)}
                className="px-4 py-2 bg-[#6C3FC5] text-white text-xs font-bold rounded hover:bg-[#4B238C]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
