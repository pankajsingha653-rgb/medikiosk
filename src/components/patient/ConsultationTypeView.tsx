import { Stethoscope, Flower2, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { ConsultationType } from '../../types';

interface ConsultationTypeViewProps {
  consultationType: ConsultationType;
  onSelectType: (type: ConsultationType) => void;
  onContinue: () => void;
  onBack: () => void;
  patientName: string;
}

export function ConsultationTypeView({
  consultationType,
  onSelectType,
  onContinue,
  onBack,
  patientName
}: ConsultationTypeViewProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Progress Bar (Step 4 of 5) */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-[#666666] mb-2">
          <span className="text-[#6C3FC5] font-bold">Step 4 of 5: Consultation Department</span>
          <span>Estimated total time: 8–12 minutes</span>
        </div>
        <div className="w-full bg-[#F3EEFC] h-2 rounded-full overflow-hidden">
          <div className="bg-[#6C3FC5] h-full rounded-full transition-all duration-300 w-[80%]" />
        </div>
      </div>

      <div className="text-center space-y-2 mb-6 sm:mb-8">
        <span className="text-xs font-bold text-[#6C3FC5] uppercase tracking-wider bg-[#F3EEFC] px-3 py-1 rounded-full border border-[#6C3FC5]/20">
          Patient: {patientName}
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#171717] tracking-tight">
          Select consultation type
        </h2>
        <p className="text-xs sm:text-sm text-[#666666] max-w-xl mx-auto">
          Choose whether your visit today is for General / Allopathic Medicine or an AYUSH / Ayurvedic OPD consultation.
        </p>
      </div>

      {/* Two Large Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Modern Medicine */}
        <div
          onClick={() => onSelectType('modern')}
          className={`p-6 sm:p-7 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between min-h-[190px] select-none ${
            consultationType === 'modern'
              ? 'border-[#6C3FC5] bg-[#F3EEFC]/60 shadow-xs ring-1 ring-[#6C3FC5]'
              : 'border-neutral-200 bg-white hover:border-[#6C3FC5]/40 hover:bg-[#F3EEFC]/20'
          }`}
        >
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-[#6C3FC5] shadow-xs">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${
                  consultationType === 'modern'
                    ? 'border-[#6C3FC5] bg-[#6C3FC5] text-white'
                    : 'border-neutral-300 bg-white'
                }`}
              >
                {consultationType === 'modern' && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#171717] mb-2">
              General / Modern Medicine
            </h3>
            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
              Standard clinical history for General Medicine, Cardiology, Pulmonology, Surgery, and Pediatrics. Captures Chief Complaints, SOCRATES symptom progression, and review of systems.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-neutral-100 text-[11px] text-[#666666] font-medium">
            Standard OPD Questionnaire • 8–10 questions
          </div>
        </div>

        {/* AYUSH / Ayurveda */}
        <div
          onClick={() => onSelectType('ayush')}
          className={`p-6 sm:p-7 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between min-h-[190px] select-none ${
            consultationType === 'ayush'
              ? 'border-[#6C3FC5] bg-[#F3EEFC]/60 shadow-xs ring-1 ring-[#6C3FC5]'
              : 'border-neutral-200 bg-white hover:border-[#6C3FC5]/40 hover:bg-[#F3EEFC]/20'
          }`}
        >
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-[#6C3FC5] shadow-xs">
                <Flower2 className="w-6 h-6" />
              </div>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${
                  consultationType === 'ayush'
                    ? 'border-[#6C3FC5] bg-[#6C3FC5] text-white'
                    : 'border-neutral-300 bg-white'
                }`}
              >
                {consultationType === 'ayush' && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg sm:text-xl font-bold text-[#171717]">
                AYUSH / Ayurveda OPD
              </h3>
              <span className="text-[10px] font-bold text-[#6C3FC5] bg-[#F3EEFC] px-2 py-0.5 rounded border border-[#6C3FC5]/20">
                Traditional Medicine
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
              Tailored intake for Kayachikitsa and Panchakarma. Activates structured <strong className="text-[#171717]">Dashavidha Pariksha</strong> (Prakriti, Agni, Koshtha, Sara, Satmya, Ahara, Vihara & Nidana) documentation for Ayurvedic Vaidyas.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-neutral-100 text-[11px] text-[#666666] font-medium">
            Ayurvedic Pariksha Module included • Non-diagnostic
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 sm:mt-10 flex items-center justify-between gap-3 pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={onBack}
          className="px-5 sm:px-6 py-3 bg-white border border-neutral-200 hover:bg-[#F3EEFC] hover:text-[#6C3FC5] text-[#171717] font-semibold rounded-xl flex items-center gap-2 transition-colors min-h-[48px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="px-7 sm:px-8 py-3 bg-[#6C3FC5] hover:bg-[#4B238C] text-white font-bold text-sm sm:text-base rounded-xl shadow-xs flex items-center gap-2 transition-all active:scale-[0.99] min-h-[48px]"
        >
          <span>Continue to Intake</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
