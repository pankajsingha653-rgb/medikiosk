import { ArrowRight, Clock, Shield, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { Patient } from '../../types';

interface PatientDashboardViewProps {
  patient: Patient;
  onStartHistory: () => void;
  onGoToDocuments?: () => void;
  hasCaseHistory?: boolean;
}

export function PatientDashboardView({
  patient,
  onStartHistory,
  onGoToDocuments,
  hasCaseHistory = false
}: PatientDashboardViewProps) {
  const steps = [
    { num: 1, label: 'Ident', done: true },
    { num: 2, label: 'History', active: !hasCaseHistory, done: hasCaseHistory },
    { num: 3, label: 'Docs', active: hasCaseHistory, done: false },
    { num: 4, label: 'Review', done: false },
    { num: 5, label: 'Done', done: false }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Patient Header Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#F3EEFC] text-[#6C3FC5] border border-[#6C3FC5]/20 font-mono">
              Token {patient.token}
            </span>
            <span className="text-xs text-[#666666] font-mono">ID: {patient.id}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717]">
            Welcome, {patient.fullName}
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] mt-0.5">
            {patient.age} years • {patient.gender} • {patient.department}
          </p>
        </div>

        <div className="flex sm:flex-col items-start sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100">
          <div className="flex items-center gap-1.5 text-xs text-[#666666]">
            <Clock className="w-4 h-4 text-[#6C3FC5]" />
            <span className="font-medium">Estimated time:</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-[#171717]">8–12 minutes</div>
        </div>
      </div>

      {/* 5-Step Purple Progress Bar */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div className="flex items-center justify-between mb-3 text-xs font-semibold">
          <span className="text-[#6C3FC5] font-bold">Kiosk Clinical Intake Journey</span>
          <span className="text-[#666666]">Step 2 of 5</span>
        </div>

        {/* Visual Step Indicator */}
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          {steps.map(step => (
            <div key={step.num} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 transition-all ${
                  step.done
                    ? 'bg-[#6C3FC5] text-white'
                    : step.active
                    ? 'border-2 border-[#6C3FC5] text-[#6C3FC5] bg-[#F3EEFC]'
                    : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                }`}
              >
                {step.done ? <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> : step.num}
              </div>
              <span className={`text-[11px] truncate w-full ${step.active || step.done ? 'font-bold text-[#171717]' : 'text-neutral-400'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Progress Bar Line */}
        <div className="w-full bg-[#F3EEFC] h-2 rounded-full overflow-hidden mt-3">
          <div className="bg-[#6C3FC5] h-full rounded-full transition-all duration-300 w-[40%]" />
        </div>
      </div>

      {/* Main Action Card */}
      <div className="bg-white rounded-2xl border-2 border-[#6C3FC5] p-6 sm:p-10 shadow-xs text-center space-y-6">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#F3EEFC] flex items-center justify-center mx-auto border border-[#6C3FC5]/20">
          <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-[#6C3FC5]" />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717]">
            Let's start with what's bothering you today.
          </h3>
          <p className="text-[#666666] text-xs sm:text-sm leading-relaxed">
            Answer a few quick questions about your symptoms. You can tap choices or speak naturally into the microphone in your preferred language.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onStartHistory}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#6C3FC5] hover:bg-[#4B238C] text-white font-bold text-base rounded-xl shadow-xs transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] min-h-[48px]"
          >
            <span>Start History</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {hasCaseHistory && onGoToDocuments && (
            <button
              type="button"
              onClick={onGoToDocuments}
              className="w-full sm:w-auto px-6 py-3.5 bg-white border border-neutral-200 hover:bg-[#F3EEFC] hover:text-[#6C3FC5] text-[#171717] font-semibold text-sm sm:text-base rounded-xl flex items-center justify-center gap-2 min-h-[48px] transition-colors"
            >
              <FileText className="w-5 h-5 text-[#6C3FC5]" />
              <span>Upload Medical Documents</span>
            </button>
          )}
        </div>

        <div className="text-xs text-[#666666] flex items-center justify-center gap-1.5 pt-2">
          <Shield className="w-3.5 h-3.5 text-[#6C3FC5] flex-shrink-0" />
          <span>All answers will be prepared for the physician and can be edited prior to final submission.</span>
        </div>
      </div>
    </div>
  );
}
