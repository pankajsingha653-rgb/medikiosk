import { useState } from 'react';
import {
  CheckCircle2,
  Printer,
  Smartphone,
  Check,
  Building2,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  QrCode,
  ShieldCheck
} from 'lucide-react';
import { Patient, ClinicalCase } from '../../types';

interface CompletionViewProps {
  patient: Patient;
  clinicalCase?: ClinicalCase;
  onDone: () => void;
}

export function CompletionView({ patient, clinicalCase, onDone }: CompletionViewProps) {
  const [isPrinted, setIsPrinted] = useState(false);
  const [mobileSent, setMobileSent] = useState(false);

  const handlePrint = () => {
    window.print();
    setIsPrinted(true);
  };

  const handleSendMobile = () => {
    setMobileSent(true);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="text-center space-y-3 mb-8">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto border border-neutral-200">
          <CheckCircle2 className="w-10 h-10 text-[#6C3FC5]" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
          Intake Complete
        </h2>
        <p className="text-base sm:text-lg text-neutral-600 max-w-lg mx-auto">
          Your clinical information has been organized and sent securely to your attending doctor's queue.
        </p>
      </div>

      {/* Primary Token & OPD Pass Card */}
      <div className="bg-white rounded-lg border-2 border-[#6C3FC5] p-6 sm:p-8 shadow-sm space-y-6">
        {/* Token Badge Display */}
        <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-6 text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6C3FC5]">
            Your Consultation Token
          </span>
          <div className="text-5xl sm:text-6xl font-black text-neutral-900 font-mono tracking-tight">
            {patient.token}
          </div>
          <div className="text-sm font-semibold text-neutral-700">
            {patient.fullName} • Age {patient.age} ({patient.gender})
          </div>
        </div>

        {/* Location & Routing Instructions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-neutral-50 rounded border border-neutral-200 flex items-start gap-3">
            <Building2 className="w-5 h-5 text-[#6C3FC5] flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-neutral-500 uppercase block">Consultation Location</span>
              <span className="font-extrabold text-neutral-900 text-base">
                {patient.counterNumber || 'OPD Room 104, Block B'}
              </span>
              <p className="text-xs text-neutral-600 mt-0.5">{patient.department}</p>
            </div>
          </div>

          <div className="p-4 bg-neutral-50 rounded border border-neutral-200 flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#6C3FC5] flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-neutral-500 uppercase block">Estimated Wait Time</span>
              <span className="font-extrabold text-neutral-900 text-base">
                {patient.estimatedWaitMinutes || 12} minutes
              </span>
              <p className="text-xs text-neutral-600 mt-0.5">3 patients ahead of you in queue</p>
            </div>
          </div>
        </div>

        {/* Waiting Instructions Banner */}
        <div className="p-4 bg-neutral-100 rounded-md border border-neutral-200 text-center">
          <p className="text-sm font-bold text-neutral-900">
            Please proceed to Waiting Area B. Your token will be called on the display screen.
          </p>
          <p className="text-xs text-neutral-600 mt-1">
            Keep your hospital slip with you. The doctor already has your AI-organized history and documents ready.
          </p>
        </div>

        {/* Action Buttons: Print, Send to Mobile, Done */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-neutral-200">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Print Slip Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4 text-[#6C3FC5]" />
              <span>{isPrinted ? 'Printed' : 'Print Summary Slip'}</span>
            </button>

            {/* Send to Mobile Button */}
            <button
              type="button"
              onClick={handleSendMobile}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors"
            >
              {mobileSent ? (
                <>
                  <Check className="w-4 h-4 text-[#6C3FC5]" />
                  <span>Sent to {patient.phone.slice(-4)}</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 text-[#6C3FC5]" />
                  <span>Send to Mobile (SMS/WhatsApp)</span>
                </>
              )}
            </button>
          </div>

          {/* Done Button */}
          <button
            type="button"
            onClick={onDone}
            className="w-full sm:w-auto px-8 py-3 bg-[#6C3FC5] hover:bg-[#4B238C] text-white font-bold text-sm rounded shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] transition-colors"
          >
            <span>Finish & Return Home</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
