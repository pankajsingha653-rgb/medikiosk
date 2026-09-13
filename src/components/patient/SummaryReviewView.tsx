import { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  FileText,
  Activity,
  Heart,
  Pill,
  Flower2,
  Clock,
  Printer
} from 'lucide-react';
import { Patient, ClinicalCase, MedicalDocument, TestResult } from '../../types';

interface SummaryReviewViewProps {
  patient: Patient;
  clinicalCase: ClinicalCase;
  documents: MedicalDocument[];
  testResults: TestResult[];
  onConfirm: () => void;
  onEdit: () => void;
  onBack: () => void;
}

export function SummaryReviewView({
  patient,
  clinicalCase,
  documents,
  testResults,
  onConfirm,
  onEdit,
  onBack
}: SummaryReviewViewProps) {
  const [isConfirmedInUI, setIsConfirmedInUI] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Progress Bar (Step 4 of 5) */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 mb-2">
          <span className="text-[#6C3FC5] font-bold">Step 4 of 5: Clinical History Review</span>
          <span>Estimated total time: 8–12 minutes</span>
        </div>
        <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
          <div className="bg-[#6C3FC5] h-full rounded-full transition-all duration-300 w-[90%]" />
        </div>
      </div>

      {/* Screen Title & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-neutral-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Your Clinical History
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
            Review your structured intake summary before finalizing. You may edit any field.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-900 border border-neutral-200">
            <Sparkles className="w-3.5 h-3.5 text-[#6C3FC5]" />
            AI Generated
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-[#6C3FC5] border border-neutral-200">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6C3FC5]" />
            Needs Physician Verification
          </span>
        </div>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="mb-6 p-3 bg-neutral-50 border border-neutral-300 rounded-md text-xs text-neutral-700 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-[#6C3FC5] flex-shrink-0" />
        <span className="font-semibold">
          AI-generated draft. Requires verification by a healthcare professional. MediKiosk does not autonomously diagnose or prescribe medication.
        </span>
      </div>

      {/* Patient Information Card */}
      <div className="bg-white rounded-lg border border-neutral-200 p-5 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-neutral-900">{patient.fullName}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-neutral-100 text-[#6C3FC5] border border-neutral-200">
                Token {patient.token}
              </span>
            </div>
            <div className="text-xs text-neutral-600 flex flex-wrap gap-4">
              <span><strong>Patient ID:</strong> {patient.id}</span>
              <span><strong>Age/Gender:</strong> {patient.age}y / {patient.gender}</span>
              <span><strong>Contact:</strong> {patient.phone}</span>
              <span><strong>City:</strong> {patient.city}</span>
            </div>
          </div>

          <div className="text-right sm:border-l sm:pl-4 border-neutral-200">
            <div className="text-xs font-semibold text-neutral-500">Department</div>
            <div className="text-sm font-bold text-neutral-900">{patient.department}</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">
              ABHA: {patient.abhaId || 'Demo ID'}
            </div>
          </div>
        </div>
      </div>

      {/* Structured Sections Grid */}
      <div className="space-y-4">
        {/* 1. Chief Complaint & HPI */}
        <div className="bg-white rounded-lg border border-neutral-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6C3FC5]" />
              Chief Complaint & History of Present Illness (HPI)
            </h3>
            <button
              type="button"
              onClick={onEdit}
              className="text-xs font-semibold text-[#6C3FC5] hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-neutral-700 block mb-0.5">Chief Complaint:</span>
              <p className="text-neutral-900 text-sm font-medium">
                {clinicalCase.chiefComplaints?.[0]?.complaint || 'General presentation'}
              </p>
              <span className="text-neutral-500">
                Duration: {clinicalCase.chiefComplaints?.[0]?.duration || 'N/A'} • Severity: {clinicalCase.chiefComplaints?.[0]?.severity || 8}/10
              </span>
            </div>

            <div>
              <span className="font-bold text-neutral-700 block mb-0.5">HPI Narrative:</span>
              <p className="text-neutral-700 leading-relaxed">
                {clinicalCase.hpiNarrative || 'Recorded during intake.'}
              </p>
            </div>
          </div>

          {/* SOCRATES Details if Chest Pain / Specific */}
          {clinicalCase.socrates && (
            <div className="pt-2 border-t border-neutral-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-neutral-50 p-2.5 rounded">
              <div>
                <span className="font-bold text-neutral-500 block">Site:</span>
                <span className="text-neutral-900 font-medium">{clinicalCase.socrates.site}</span>
              </div>
              <div>
                <span className="font-bold text-neutral-500 block">Character:</span>
                <span className="text-neutral-900 font-medium">{clinicalCase.socrates.character}</span>
              </div>
              <div>
                <span className="font-bold text-neutral-500 block">Radiation:</span>
                <span className="text-neutral-900 font-medium">{clinicalCase.socrates.radiation}</span>
              </div>
              <div>
                <span className="font-bold text-neutral-500 block">Associations:</span>
                <span className="text-neutral-900 font-medium">{clinicalCase.socrates.associations?.join(', ') || 'None'}</span>
              </div>
            </div>
          )}
        </div>

        {/* 2. Past Medical & Surgical History */}
        <div className="bg-white rounded-lg border border-neutral-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6C3FC5]" />
              Past Medical & Surgical History
            </h3>
            <button
              type="button"
              onClick={onEdit}
              className="text-xs font-semibold text-[#6C3FC5] hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-neutral-700 block mb-1">Medical Conditions:</span>
              {clinicalCase.pastMedicalHistory?.length > 0 ? (
                <div className="space-y-1">
                  {clinicalCase.pastMedicalHistory.map(pmh => (
                    <div key={pmh.id} className="text-neutral-800">
                      • <strong>{pmh.condition}</strong> {pmh.diagnosedYear && `(Since ${pmh.diagnosedYear})`} - {pmh.notes || pmh.status}
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-neutral-400">None reported</span>
              )}
            </div>

            <div>
              <span className="font-bold text-neutral-700 block mb-1">Past Surgeries / Procedures:</span>
              {clinicalCase.pastSurgicalHistory?.length > 0 ? (
                <div className="space-y-1">
                  {clinicalCase.pastSurgicalHistory.map(psh => (
                    <div key={psh.id} className="text-neutral-800">
                      • <strong>{psh.procedure}</strong> ({psh.approxDate}) - {psh.hospitalOrReason}
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-neutral-400">No major surgeries reported</span>
              )}
            </div>
          </div>
        </div>

        {/* 3. Medications & Allergies */}
        <div className="bg-white rounded-lg border border-neutral-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6C3FC5]" />
              Medications & Allergies
            </h3>
            <button
              type="button"
              onClick={onEdit}
              className="text-xs font-semibold text-[#6C3FC5] hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-neutral-700 block mb-1">Current Medications:</span>
              {clinicalCase.medications?.length > 0 ? (
                <div className="space-y-1">
                  {clinicalCase.medications.map(m => (
                    <div key={m.id} className="text-neutral-800">
                      • <strong>{m.name}</strong> {m.dose} ({m.frequency})
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-neutral-400">No active medications logged</span>
              )}
            </div>

            <div>
              <span className="font-bold text-[#6C3FC5] block mb-1">Known Allergies:</span>
              {clinicalCase.allergies?.length > 0 ? (
                <div className="space-y-1">
                  {clinicalCase.allergies.map(a => (
                    <div key={a.id} className="text-neutral-800 font-medium">
                      • <span className="text-[#6C3FC5] font-bold">{a.allergen}</span>: {a.reaction} ({a.severity})
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-neutral-500">No known drug/food allergies (NKDA)</span>
              )}
            </div>
          </div>
        </div>

        {/* 4. Personal & Family History & Review of Systems */}
        <div className="bg-white rounded-lg border border-neutral-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6C3FC5]" />
              Personal, Family History & Review of Systems
            </h3>
            <button
              type="button"
              onClick={onEdit}
              className="text-xs font-semibold text-[#6C3FC5] hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="font-bold text-neutral-700 block mb-1">Personal Habits:</span>
              <p className="text-neutral-600">
                Diet: {clinicalCase.personalHistory?.diet} • Tobacco: {clinicalCase.personalHistory?.tobacco} • Alcohol: {clinicalCase.personalHistory?.alcohol} • Sleep: {clinicalCase.personalHistory?.sleepHours}
              </p>
            </div>
            <div>
              <span className="font-bold text-neutral-700 block mb-1">Family History:</span>
              <p className="text-neutral-600">
                {clinicalCase.familyHistory?.map(f => `${f.relation}: ${f.condition}`).join(', ') || 'No significant history'}
              </p>
            </div>
            <div>
              <span className="font-bold text-neutral-700 block mb-1">Review of Systems (ROS):</span>
              <p className="text-neutral-600">
                Cardio/Resp: {clinicalCase.reviewOfSystems?.cardiovascular?.join(', ')}. General: {clinicalCase.reviewOfSystems?.general?.join(', ')}.
              </p>
            </div>
          </div>
        </div>

        {/* 5. AYUSH Assessment (Conditional on AYUSH Mode) */}
        {patient.consultationType === 'ayush' && clinicalCase.ayushAssessment && (
          <div className="bg-white rounded-lg border-2 border-neutral-300 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
              <div className="flex items-center gap-2">
                <Flower2 className="w-4 h-4 text-[#6C3FC5]" />
                <h3 className="font-bold text-neutral-900 text-sm">
                  AYUSH Dashavidha Pariksha Summary
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase bg-neutral-100 px-2 py-0.5 rounded text-[#6C3FC5]">
                Ayurveda OPD
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="font-bold text-neutral-500 block">Prakriti:</span>
                <span className="text-neutral-900 font-semibold">{clinicalCase.ayushAssessment.prakriti}</span>
              </div>
              <div>
                <span className="font-bold text-neutral-500 block">Agni:</span>
                <span className="text-neutral-900 font-semibold">{clinicalCase.ayushAssessment.agni}</span>
              </div>
              <div>
                <span className="font-bold text-neutral-500 block">Koshtha:</span>
                <span className="text-neutral-900 font-semibold">{clinicalCase.ayushAssessment.koshtha}</span>
              </div>
              <div>
                <span className="font-bold text-neutral-500 block">Sara & Sattva:</span>
                <span className="text-neutral-900 font-semibold">{clinicalCase.ayushAssessment.sara} / {clinicalCase.ayushAssessment.sattva}</span>
              </div>
            </div>
          </div>
        )}

        {/* 6. Uploaded Documents & Test Investigations */}
        <div className="bg-white rounded-lg border border-neutral-200 p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2 border-b border-neutral-100 pb-2">
            <span className="w-2 h-2 rounded-full bg-[#6C3FC5]" />
            Previous Investigations & Uploaded Documents ({documents.length})
          </h3>

          {documents.length > 0 ? (
            <div className="flex flex-wrap gap-2 text-xs">
              {documents.map(d => (
                <div key={d.id} className="p-2 bg-neutral-50 border border-neutral-200 rounded flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#6C3FC5]" />
                  <span className="font-bold text-neutral-900">{d.title}</span>
                  <span className="text-neutral-500 font-medium">({d.documentDate})</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-500">No previous documents attached.</p>
          )}
        </div>
      </div>

      {/* Confirmation Checkbox */}
      <div className="mt-6 p-4 bg-neutral-50 border border-neutral-200 rounded-md">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isConfirmedInUI}
            onChange={e => setIsConfirmedInUI(e.target.checked)}
            className="w-5 h-5 accent-[#6C3FC5] mt-0.5 rounded cursor-pointer"
          />
          <span className="text-xs sm:text-sm text-neutral-800 leading-relaxed">
            I confirm that the above information accurately reflects my symptoms and medical history. I understand that my doctor will review this summary during consultation.
          </span>
        </label>
      </div>

      {/* Bottom Navigation */}
      <div className="mt-8 flex items-center justify-between gap-4 pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-semibold rounded-md flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <button
          type="button"
          disabled={!isConfirmedInUI}
          onClick={onConfirm}
          className={`px-8 py-3.5 font-bold text-base rounded-md shadow-sm flex items-center gap-2 transition-colors ${
            isConfirmedInUI
              ? 'bg-[#6C3FC5] hover:bg-[#4B238C] text-white active:scale-[0.99]'
              : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
          }`}
        >
          <span>Confirm & Submit History</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
