import { useState } from 'react';
import { Volume2, VolumeX, CheckSquare, Square, ArrowRight, ArrowLeft, Shield, CheckCircle2 } from 'lucide-react';
import { ConsentRecord, LanguageCode } from '../../types';
import { AudioService } from '../../services/ai';

interface ConsentViewProps {
  patientId: string;
  patientName: string;
  language: LanguageCode;
  onConsentAgreed: (consent: ConsentRecord) => void;
  onBack: () => void;
}

export function ConsentView({
  patientId,
  language,
  onConsentAgreed,
  onBack
}: ConsentViewProps) {
  const [clinicalInfo, setClinicalInfo] = useState(true);
  const [docProcessing, setDocProcessing] = useState(true);
  const [staffSharing, setStaffSharing] = useState(true);
  const [futureAbdm, setFutureAbdm] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const audioScript =
    'Before we begin. MediKiosk will ask questions about your health and allow you to upload previous medical documents. Your answers will be used to prepare a clinical history for your healthcare provider. You have complete control and can decline optional digital health sharing at any time.';

  const handleToggleAudio = () => {
    if (isAudioPlaying) {
      AudioService.stopSpeaking();
      setIsAudioPlaying(false);
    } else {
      AudioService.speak(audioScript, language);
      setIsAudioPlaying(true);
    }
  };

  const handleAgree = () => {
    AudioService.stopSpeaking();
    const record: ConsentRecord = {
      id: `consent-${Date.now()}`,
      patientId,
      clinicalInfoCollection: clinicalInfo,
      documentProcessing: docProcessing,
      staffSharing: staffSharing,
      futureAbdmIntegration: futureAbdm,
      signedAt: new Date().toISOString(),
      ipOrKioskId: 'KIOSK-TERMINAL-01'
    };
    onConsentAgreed(record);
  };

  const allMandatoryConsented = clinicalInfo && staffSharing;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-8">
      {/* Progress Bar (Step 3 of 5) */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-[#666666] mb-2">
          <span className="text-[#6C3FC5] font-bold">Step 3 of 5: Informed Consent</span>
          <span>Estimated total time: 8–12 minutes</span>
        </div>
        <div className="w-full bg-[#F3EEFC] h-2 rounded-full overflow-hidden">
          <div className="bg-[#6C3FC5] h-full rounded-full transition-all duration-300 w-[60%]" />
        </div>
      </div>

      {/* Screen Title */}
      <div className="text-center space-y-3 mb-6 sm:mb-8">
        <div className="w-12 h-12 bg-[#F3EEFC] rounded-2xl flex items-center justify-center mx-auto border border-[#6C3FC5]/20">
          <Shield className="w-6 h-6 text-[#6C3FC5]" />
        </div>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#171717] tracking-tight">
          Before we begin
        </h2>
        <p className="text-sm sm:text-base text-[#666666] max-w-xl mx-auto leading-relaxed">
          MediKiosk will ask questions about your health and allow you to upload previous medical documents. Your answers will be used to prepare a clinical history for your healthcare provider.
        </p>

        {/* Audio Explanation Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleToggleAudio}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs sm:text-sm font-semibold transition-colors ${
              isAudioPlaying
                ? 'bg-[#6C3FC5] text-white border-[#6C3FC5]'
                : 'bg-white text-[#171717] border-neutral-200 hover:bg-[#F3EEFC] hover:text-[#6C3FC5]'
            }`}
          >
            {isAudioPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#6C3FC5]" />}
            <span>{isAudioPlaying ? 'Stop Audio Explanation' : 'Play Audio Explanation'}</span>
          </button>
        </div>
      </div>

      {/* Consent Checkboxes */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs divide-y divide-neutral-100 overflow-hidden">
        {/* Item 1 */}
        <div
          onClick={() => setClinicalInfo(!clinicalInfo)}
          className="p-4 sm:p-5 flex items-start gap-4 cursor-pointer hover:bg-[#F3EEFC]/30 transition-colors select-none"
        >
          <div className="mt-0.5 text-[#6C3FC5]">
            {clinicalInfo ? <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6" /> : <Square className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-300" />}
          </div>
          <div>
            <div className="font-bold text-[#171717] text-sm sm:text-base flex items-center gap-2">
              <span>Collection of clinical information</span>
              <span className="text-[10px] font-bold text-[#6C3FC5] bg-[#F3EEFC] px-2 py-0.5 rounded">Required</span>
            </div>
            <p className="text-xs sm:text-sm text-[#666666] mt-0.5">
              I agree to answer questions regarding my chief complaints, medical history, current medications, and allergies.
            </p>
          </div>
        </div>

        {/* Item 2 */}
        <div
          onClick={() => setDocProcessing(!docProcessing)}
          className="p-4 sm:p-5 flex items-start gap-4 cursor-pointer hover:bg-[#F3EEFC]/30 transition-colors select-none"
        >
          <div className="mt-0.5 text-[#6C3FC5]">
            {docProcessing ? <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6" /> : <Square className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-300" />}
          </div>
          <div>
            <div className="font-bold text-[#171717] text-sm sm:text-base">
              Processing of uploaded medical documents
            </div>
            <p className="text-xs sm:text-sm text-[#666666] mt-0.5">
              I permit automated text extraction (OCR) of my previous prescriptions, laboratory results, and discharge cards for clinical review.
            </p>
          </div>
        </div>

        {/* Item 3 */}
        <div
          onClick={() => setStaffSharing(!staffSharing)}
          className="p-4 sm:p-5 flex items-start gap-4 cursor-pointer hover:bg-[#F3EEFC]/30 transition-colors select-none"
        >
          <div className="mt-0.5 text-[#6C3FC5]">
            {staffSharing ? <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6" /> : <Square className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-300" />}
          </div>
          <div>
            <div className="font-bold text-[#171717] text-sm sm:text-base flex items-center gap-2">
              <span>Sharing information with hospital clinical staff</span>
              <span className="text-[10px] font-bold text-[#6C3FC5] bg-[#F3EEFC] px-2 py-0.5 rounded">Required</span>
            </div>
            <p className="text-xs sm:text-sm text-[#666666] mt-0.5">
              I authorize the attending physician, triage nurses, and medical staff in this hospital OPD to view this preliminary intake summary.
            </p>
          </div>
        </div>

        {/* Item 4 */}
        <div
          onClick={() => setFutureAbdm(!futureAbdm)}
          className="p-4 sm:p-5 flex items-start gap-4 cursor-pointer hover:bg-[#F3EEFC]/30 transition-colors select-none"
        >
          <div className="mt-0.5 text-[#6C3FC5]">
            {futureAbdm ? <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6" /> : <Square className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-300" />}
          </div>
          <div>
            <div className="font-bold text-[#171717] text-sm sm:text-base flex items-center gap-2">
              <span>Optional future digital health (ABDM / FHIR) record linking</span>
              <span className="text-[10px] font-semibold text-[#666666] bg-neutral-100 px-2 py-0.5 rounded">Optional</span>
            </div>
            <p className="text-xs sm:text-sm text-[#666666] mt-0.5">
              Allow future export of this consultation note to my linked Ayushman Bharat Health Account (ABHA) locker once verified by the doctor.
            </p>
          </div>
        </div>
      </div>

      {/* Trust reassurance */}
      <div className="mt-4 p-3.5 bg-[#F3EEFC]/60 border border-[#6C3FC5]/20 rounded-xl text-xs text-[#666666] flex items-center gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-[#6C3FC5] flex-shrink-0" />
        <span>You can ask hospital volunteers or nursing staff at any time to assist or revoke these permissions.</span>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex items-center justify-between gap-3 pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={onBack}
          className="px-5 sm:px-6 py-3 bg-white border border-neutral-200 hover:bg-[#F3EEFC] hover:text-[#6C3FC5] text-[#171717] font-semibold rounded-xl flex items-center gap-2 transition-colors min-h-[48px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>

        <button
          type="button"
          disabled={!allMandatoryConsented}
          onClick={handleAgree}
          className={`px-7 sm:px-8 py-3 font-bold text-sm sm:text-base rounded-xl shadow-xs flex items-center gap-2 transition-all min-h-[48px] ${
            allMandatoryConsented
              ? 'bg-[#6C3FC5] hover:bg-[#4B238C] text-white active:scale-[0.99]'
              : 'bg-neutral-200 text-[#666666] cursor-not-allowed'
          }`}
        >
          <span>I Understand & Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
