import { useState } from 'react';
import {
  Mic,
  ScanLine,
  Share2,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Clock,
  CheckCircle2,
  FileText,
  Activity,
  Layers,
  Sparkles,
  HeartPulse
} from 'lucide-react';
import { Patient, LanguageCode } from '../../types';
import { db } from '../../services/db';

export interface LandingViewProps {
  onStart?: () => void;
  onStartCheckIn?: () => void;
  onDoctorClick?: () => void;
  onSelectPresetPatient?: (patient: Patient) => void;
  demoPatients?: Patient[];
  language?: LanguageCode;
  onLanguageClick?: () => void;
}

export function LandingView({
  onStart,
  onStartCheckIn,
  onDoctorClick,
  onSelectPresetPatient,
  demoPatients
}: LandingViewProps) {
  const startHandler = onStart || onStartCheckIn || (() => {});
  const patientsList = demoPatients || db.getPatients();

  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [aboutImgFailed, setAboutImgFailed] = useState(false);
  const [featureImgErrors, setFeatureImgErrors] = useState<Record<string, boolean>>({});

  const handleFeatureImgError = (key: string) => {
    setFeatureImgErrors(prev => ({ ...prev, [key]: true }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-12 sm:space-y-16">
      {/* 1. Hero Section */}
      <section className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-10 lg:p-12 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text & Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F3EEFC] border border-[#6C3FC5]/20 text-xs font-semibold text-[#6C3FC5]">
              <span className="w-2 h-2 rounded-full bg-[#6C3FC5] animate-pulse"></span>
              Intelligent Clinical History & Patient Intake
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#171717] tracking-tight leading-[1.18]">
              Your health history,{' '}
              <span className="text-[#6C3FC5]">ready before your consultation.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#666666] font-normal leading-relaxed max-w-xl">
              MediKiosk assists patients in recording their symptoms in their native tongue, uploading past records, and delivering an AI-synthesized clinical summary to their doctor.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={startHandler}
                className="px-8 py-4 bg-[#6C3FC5] hover:bg-[#4B238C] text-white font-bold text-base sm:text-lg rounded-xl shadow-sm transition-all flex items-center justify-center gap-3 active:scale-[0.99] min-h-[52px]"
              >
                <span>Start Patient Check-in</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {onDoctorClick && (
                <button
                  type="button"
                  onClick={onDoctorClick}
                  className="px-6 py-4 bg-white hover:bg-[#F3EEFC] text-[#171717] hover:text-[#6C3FC5] font-semibold text-base rounded-xl border border-neutral-200 transition-colors flex items-center justify-center gap-2 min-h-[52px]"
                >
                  <Stethoscope className="w-5 h-5 text-[#6C3FC5]" />
                  <span>I'm a Doctor</span>
                </button>
              )}
            </div>

            {/* Micro badges */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#666666] pt-1">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-[#6C3FC5]" /> Takes 8–12 minutes
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#6C3FC5]" /> Hindi, Bengali, Nepali & English
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#6C3FC5]" /> Verified by Doctor
              </span>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-md border border-neutral-200 bg-[#F3EEFC] aspect-[4/3] sm:aspect-[16/11]">
              {!heroImgFailed ? (
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80"
                  alt="Doctor with digital tablet consulting with patient"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform hover:scale-[1.02] transition-transform duration-500"
                  onError={() => setHeroImgFailed(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#F3EEFC]">
                  <HeartPulse className="w-12 h-12 text-[#6C3FC5] mb-3" />
                  <div className="font-bold text-[#171717] text-sm">Empowering Clinical Consultations</div>
                  <div className="text-xs text-[#666666] mt-1">AI-assisted history intake for high-volume hospitals</div>
                </div>
              )}

              {/* Float badge */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs px-3.5 py-2.5 rounded-xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6C3FC5]" />
                  <span className="text-xs font-bold text-[#171717]">High-Volume OPD Flow</span>
                </div>
                <span className="text-[11px] font-semibold text-[#6C3FC5] bg-[#F3EEFC] px-2 py-0.5 rounded">
                  Save 15 min / patient
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Feature Section with Small Supporting Images / Visual Cards */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717]">
            Designed for Comprehensive Hospital Intake
          </h2>
          <p className="text-sm sm:text-base text-[#666666]">
            Four core capabilities streamlining the patient journey from OPD queue to physician sign-off.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: AI-Assisted History */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:border-[#6C3FC5]/40 transition-all flex flex-col group">
            <div className="h-36 bg-[#F3EEFC] overflow-hidden relative">
              {!featureImgErrors['history'] ? (
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80"
                  alt="Doctor listening intently to patient during clinical history"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => handleFeatureImgError('history')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#F3EEFC]">
                  <Mic className="w-8 h-8 text-[#6C3FC5]" />
                </div>
              )}
              <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs p-1.5 rounded-lg border border-neutral-200">
                <Mic className="w-4 h-4 text-[#6C3FC5]" />
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-base font-bold text-[#171717] mb-1">AI-Assisted History</h3>
              <p className="text-xs text-[#666666] leading-relaxed flex-1">
                Conversational symptom elicitation with SOCRATES scoring, red flag safety alerts, and multi-language voice support.
              </p>
              <div className="mt-3 pt-2.5 border-t border-neutral-100 text-[11px] font-semibold text-[#6C3FC5] flex items-center gap-1">
                <span>Adaptive Questions</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Card 2: Medical Document Scanning */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:border-[#6C3FC5]/40 transition-all flex flex-col group">
            <div className="h-36 bg-[#F3EEFC] overflow-hidden relative">
              {!featureImgErrors['scan'] ? (
                <img
                  src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80"
                  alt="Medical chart and laboratory diagnostic report review"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => handleFeatureImgError('scan')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#F3EEFC]">
                  <ScanLine className="w-8 h-8 text-[#6C3FC5]" />
                </div>
              )}
              <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs p-1.5 rounded-lg border border-neutral-200">
                <ScanLine className="w-4 h-4 text-[#6C3FC5]" />
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-base font-bold text-[#171717] mb-1">Document Scanning</h3>
              <p className="text-xs text-[#666666] leading-relaxed flex-1">
                Instant OCR extraction for previous prescriptions, laboratory results, discharge summaries, and radiology reports.
              </p>
              <div className="mt-3 pt-2.5 border-t border-neutral-100 text-[11px] font-semibold text-[#6C3FC5] flex items-center gap-1">
                <span>Multi-stage OCR</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Card 3: Patient Records & Timeline */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:border-[#6C3FC5]/40 transition-all flex flex-col group">
            <div className="h-36 bg-[#F3EEFC] overflow-hidden relative">
              {!featureImgErrors['records'] ? (
                <img
                  src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80"
                  alt="Digital patient health record timeline on tablet"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => handleFeatureImgError('records')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#F3EEFC]">
                  <Layers className="w-8 h-8 text-[#6C3FC5]" />
                </div>
              )}
              <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs p-1.5 rounded-lg border border-neutral-200">
                <Layers className="w-4 h-4 text-[#6C3FC5]" />
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-base font-bold text-[#171717] mb-1">Structured Records</h3>
              <p className="text-xs text-[#666666] leading-relaxed flex-1">
                Chronological timeline synthesis, past condition tracking, and standardized medication reconciliation.
              </p>
              <div className="mt-3 pt-2.5 border-t border-neutral-100 text-[11px] font-semibold text-[#6C3FC5] flex items-center gap-1">
                <span>Longitudinal View</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Card 4: Doctor Dashboard */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:border-[#6C3FC5]/40 transition-all flex flex-col group">
            <div className="h-36 bg-[#F3EEFC] overflow-hidden relative">
              {!featureImgErrors['doctor'] ? (
                <img
                  src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=600&q=80"
                  alt="Doctor workstation and clinical decision assistance"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => handleFeatureImgError('doctor')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#F3EEFC]">
                  <Stethoscope className="w-8 h-8 text-[#6C3FC5]" />
                </div>
              )}
              <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs p-1.5 rounded-lg border border-neutral-200">
                <Stethoscope className="w-4 h-4 text-[#6C3FC5]" />
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-base font-bold text-[#171717] mb-1">Doctor Dashboard</h3>
              <p className="text-xs text-[#666666] leading-relaxed flex-1">
                One-click review with ICD-10 suggestions, red flag badges, FHIR R4 exports, and digital signing.
              </p>
              <div className="mt-3 pt-2.5 border-t border-neutral-100 text-[11px] font-semibold text-[#6C3FC5] flex items-center gap-1">
                <span>OPD Integration</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. About / Information Section with High-Quality Healthcare Image */}
      <section className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 order-2 md:order-1">
            <div className="rounded-xl overflow-hidden border border-neutral-200 shadow-xs aspect-[4/3] bg-[#F3EEFC] relative">
              {!aboutImgFailed ? (
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80"
                  alt="Modern clean hospital environment and reception"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={() => setAboutImgFailed(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#F3EEFC]">
                  <Activity className="w-12 h-12 text-[#6C3FC5]" />
                </div>
              )}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/90 backdrop-blur-xs p-2.5 rounded-lg border border-neutral-200 text-xs text-[#171717] font-semibold">
                Bridging OPD Intake & Physician Decision-Making
              </div>
            </div>
          </div>

          <div className="md:col-span-7 order-1 md:order-2 space-y-4">
            <div className="text-xs font-bold text-[#6C3FC5] uppercase tracking-wider">
              Clinical Governance & Ethics
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717] leading-snug">
              Assisting physicians, not replacing them.
            </h2>
            <p className="text-sm text-[#666666] leading-relaxed">
              MediKiosk is engineered specifically for tertiary hospitals, public health institutes, and AYUSH clinics facing high patient volumes. By collecting comprehensive history and digitizing previous records in the waiting area, physicians receive an organized draft summary before the consultation begins.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#F3EEFC]/60 rounded-lg border border-[#6C3FC5]/15">
                <div className="font-bold text-xs text-[#171717] mb-0.5">Doctor In Control</div>
                <div className="text-[11px] text-[#666666]">
                  Every draft summary requires explicit physician review and digital signature.
                </div>
              </div>
              <div className="p-3 bg-[#F3EEFC]/60 rounded-lg border border-[#6C3FC5]/15">
                <div className="font-bold text-xs text-[#171717] mb-0.5">Patient Data Privacy</div>
                <div className="text-[11px] text-[#666666]">
                  Informed consent captured at registration, zero third-party advertising or profiling.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Quick Demo Patient Scenarios Panel */}
      {onSelectPresetPatient && (
        <section className="bg-[#F3EEFC]/40 rounded-2xl p-6 sm:p-8 border border-[#6C3FC5]/15 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#171717] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6C3FC5]" />
                Explore Real Hospital Demo Scenarios (8 Cases)
              </h3>
              <p className="text-xs text-[#666666] mt-0.5">
                Click any patient below to view their journey, uploaded documents, clinical history, and physician review.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-white border border-[#6C3FC5]/20 rounded-md text-[#6C3FC5] self-start shadow-2xs">
              Simulated Clinical Data
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {patientsList.map(patient => (
              <button
                key={patient.id}
                type="button"
                onClick={() => onSelectPresetPatient(patient)}
                className="text-left bg-white p-4 rounded-xl border border-neutral-200 hover:border-[#6C3FC5] hover:shadow-xs transition-all group"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-[#6C3FC5] group-hover:underline font-mono">{patient.token}</span>
                  <span className="text-[10px] font-semibold text-[#666666] uppercase bg-[#F3EEFC] px-1.5 py-0.5 rounded">
                    {patient.consultationType}
                  </span>
                </div>
                <div className="font-bold text-[#171717] text-sm group-hover:text-[#6C3FC5] transition-colors">
                  {patient.fullName}
                </div>
                <div className="text-xs text-[#666666]">
                  {patient.age}y • {patient.gender} • {patient.city}
                </div>
                <div className="mt-2.5 text-xs font-medium text-[#171717] truncate border-t border-neutral-100 pt-2 flex items-center justify-between">
                  <span className="truncate">{patient.department}</span>
                  {patient.isPriority && (
                    <span className="text-[10px] font-bold text-[#4B238C] bg-[#F3EEFC] px-1.5 py-0.5 rounded ml-1 flex-shrink-0">
                      Priority
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 5. Trust & Privacy Footer Banner */}
      <footer className="max-w-2xl mx-auto text-center space-y-2 pt-2">
        <div className="flex items-center justify-center gap-2 text-[#171717] font-semibold text-xs sm:text-sm">
          <ShieldCheck className="w-4 h-4 text-[#6C3FC5]" />
          <span>Patient data handled securely according to ABDM and hospital clinical privacy protocols.</span>
        </div>
        <p className="text-xs text-[#666666] leading-relaxed">
          MediKiosk is designed to assist clinical workflows and does not replace medical consultation. All generated summaries require verification by an authorized healthcare provider.
        </p>
      </footer>
    </div>
  );
}
