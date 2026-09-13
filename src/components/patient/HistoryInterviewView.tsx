import { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Volume2,
  CheckCircle2,
  Stethoscope,
  Plus,
  Trash2,
  ShieldAlert
} from 'lucide-react';
import {
  Patient,
  ClinicalCase,
  SocratesHistory,
  Medication,
  Allergy,
  PastCondition,
  PastSurgery,
  PersonalHistory,
  ReviewOfSystems,
  LanguageCode
} from '../../types';
import { AudioService, ClinicalAiService } from '../../services/ai';
import { db } from '../../services/db';

interface HistoryInterviewViewProps {
  patient: Patient;
  existingCase?: ClinicalCase;
  language: LanguageCode;
  onCompleteHistory: (clinicalCase: ClinicalCase) => void;
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'patient';
  text: string;
  time: string;
  options?: string[];
  module?: string;
}

export function HistoryInterviewView({
  patient,
  existingCase,
  language,
  onCompleteHistory,
  onBack
}: HistoryInterviewViewProps) {
  // Clinical modules in order
  const MODULES = [
    'Chief Complaint',
    'Present Illness (HPI)',
    'Past Medical & Surgical',
    'Medications & Allergies',
    'Personal & Family History',
    'Review of Systems'
  ];

  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [micActiveStopFn, setMicActiveStopFn] = useState<(() => void) | null>(null);

  // Red Flag Alert state
  const [showRedFlagAlert, setShowRedFlagAlert] = useState(false);
  const [redFlagReason, setRedFlagReason] = useState('');
  const [triageNotified, setTriageNotified] = useState(false);

  // Structured clinical state
  const [chiefComplaint, setChiefComplaint] = useState(
    existingCase?.chiefComplaints?.[0]?.complaint || 'Chest discomfort and tightness'
  );
  const [duration, setDuration] = useState(existingCase?.chiefComplaints?.[0]?.duration || '3 hours');
  const [severity, setSeverity] = useState(existingCase?.chiefComplaints?.[0]?.severity || 8);

  // SOCRATES for chest pain or detailed HPI
  const [socrates, setSocrates] = useState<SocratesHistory>(
    existingCase?.socrates || {
      site: 'Retrosternal (center of chest)',
      onset: 'Sudden, morning while walking',
      character: 'Heavy crushing pressure and squeezing',
      radiation: 'Left shoulder, jaw, and inner arm',
      associations: ['Profuse sweating', 'Shortness of breath'],
      timing: 'Constant for 3 hours, worsening with exertion',
      exacerbatingFactors: 'Walking, exertion, lying flat',
      relievingFactors: 'Rest gives partial relief',
      severityScore: 8
    }
  );

  // Past Medical Conditions
  const [pastConditions, setPastConditions] = useState<PastCondition[]>(
    existingCase?.pastMedicalHistory || [
      { id: '1', condition: 'Hypertension', diagnosedYear: '2020', status: 'managed' }
    ]
  );
  const [newConditionInput, setNewConditionInput] = useState('');

  // Past Surgeries
  const [pastSurgeries, setPastSurgeries] = useState<PastSurgery[]>(
    existingCase?.pastSurgicalHistory || []
  );

  // Medications
  const [medications, setMedications] = useState<Medication[]>(
    existingCase?.medications || [
      { id: 'm1', name: 'Telmisartan', dose: '40 mg', frequency: 'Once daily', duration: '4 years' }
    ]
  );
  const [newMedName, setNewMedName] = useState('');
  const [newMedDose, setNewMedDose] = useState('');

  // Allergies
  const [allergies, setAllergies] = useState<Allergy[]>(
    existingCase?.allergies || [
      { id: 'a1', category: 'drug', allergen: 'Penicillin', reaction: 'Skin rash', severity: 'moderate' }
    ]
  );
  const [newAllergen, setNewAllergen] = useState('');

  // Personal History
  const [personalHistory, setPersonalHistory] = useState<PersonalHistory>(
    existingCase?.personalHistory || {
      diet: 'Mixed',
      sleepHours: '6-7 hours',
      exercise: 'Sedentary',
      tobacco: 'Former',
      alcohol: 'Occasional',
      occupation: 'Clerk / Desk work'
    }
  );

  // Review of Systems
  const [ros, setRos] = useState<ReviewOfSystems>(
    existingCase?.reviewOfSystems || {
      general: ['Fatigue', 'Cold sweating'],
      cardiovascular: ['Chest heaviness', 'Palpitations'],
      respiratory: ['Shortness of breath on exertion'],
      gastrointestinal: ['Mild nausea'],
      neurological: ['No dizziness'],
      genitourinary: ['Normal urination'],
      musculoskeletal: ['Left shoulder pain'],
      dermatological: ['Diaphoretic (sweaty) skin']
    }
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize initial welcome question
  useEffect(() => {
    if (messages.length === 0) {
      const initialGreeting: ChatMessage = {
        id: 'msg-1',
        sender: 'ai',
        text: 'What brings you to the hospital today?',
        time: 'Just now',
        options: [
          'Chest pain / Discomfort',
          'High Fever & Chills',
          'Cough & Breathing Issue',
          'Severe Abdominal Pain',
          'Headache / Dizziness',
          'Joint Pain / Stiffness',
          'Diabetes / Routine Follow-up',
          'Other Symptom'
        ],
        module: 'Chief Complaint'
      };
      setMessages([initialGreeting]);
      // Speak greeting
      AudioService.speak('What brings you to the hospital today? You can tap an option or speak into the microphone.', language);
    }
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Red flag safety monitor check
  const checkSafety = (complaintText: string, currentSocrates: SocratesHistory) => {
    const check = ClinicalAiService.checkRedFlags(complaintText, currentSocrates);
    if (check.hasRedFlag) {
      setRedFlagReason(check.reason || 'Priority clinical red flag detected.');
      setShowRedFlagAlert(true);
    }
  };

  // Handle Speech-to-Text toggle
  const toggleSpeechInput = () => {
    if (isListening) {
      if (micActiveStopFn) micActiveStopFn();
      setIsListening(false);
      setMicActiveStopFn(null);
    } else {
      setIsListening(true);
      const stopFn = AudioService.startListening(
        language,
        transcript => {
          setIsListening(false);
          setInputText(transcript);
          handlePatientSubmit(transcript);
        },
        err => {
          setIsListening(false);
        }
      );
      setMicActiveStopFn(() => stopFn);
    }
  };

  // Process Patient answer in conversation
  const handlePatientSubmit = (textToSubmit?: string) => {
    const content = (textToSubmit || inputText).trim();
    if (!content) return;

    const patientMsg: ChatMessage = {
      id: `p-${Date.now()}`,
      sender: 'patient',
      text: content,
      time: 'Just now'
    };

    const updated = [...messages, patientMsg];
    setMessages(updated);
    setInputText('');

    // Update Chief Complaint or HPI
    if (activeModuleIndex === 0) {
      setChiefComplaint(content);
      checkSafety(content, socrates);

      // AI follow up for onset & duration
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Understood. When did this ${content} begin, and how long has it lasted?`,
          time: 'Just now',
          options: ['Less than 3 hours ago', 'Since this morning', 'Past 2–3 days', 'More than a week'],
          module: 'Chief Complaint'
        };
        setMessages(prev => [...prev, aiMsg]);
        AudioService.speak(`When did this ${content} begin, and how long has it lasted?`, language);
      }, 700);
    } else if (activeModuleIndex === 1) {
      // Socrates drilldown
      setSocrates(prev => ({ ...prev, onset: content }));
      checkSafety(chiefComplaint, { ...socrates, onset: content });
    }
  };

  // Predefined choice tap
  const handleSelectOption = (opt: string) => {
    handlePatientSubmit(opt);
    if (opt.toLowerCase().includes('chest')) {
      setChiefComplaint('Chest pain / Discomfort');
      setActiveModuleIndex(1); // Jump to HPI Socrates
      checkSafety('Chest pain', socrates);
    }
  };

  // Notify Triage Staff Action
  const handleNotifyTriage = () => {
    db.triggerRedFlag(patient, redFlagReason);
    setTriageNotified(true);
  };

  // Finish and compile complete clinical case
  const handleProceedToReview = () => {
    const finalCase: ClinicalCase = {
      id: existingCase?.id || `CASE-${patient.id}`,
      patientId: patient.id,
      consultationType: patient.consultationType,
      status: 'intake_completed',
      chiefComplaints: [
        {
          complaint: chiefComplaint,
          duration,
          severity,
          details: socrates.character
        }
      ],
      hpiNarrative: `Patient reports ${chiefComplaint} of ${duration} duration (severity ${severity}/10). Site: ${socrates.site}. Character: ${socrates.character}. Radiation: ${socrates.radiation}. Aggravated by: ${socrates.exacerbatingFactors}. Relieved by: ${socrates.relievingFactors}.`,
      socrates,
      pastMedicalHistory: pastConditions,
      pastSurgicalHistory: pastSurgeries,
      medications,
      allergies,
      familyHistory: existingCase?.familyHistory || [
        { relation: 'Father', condition: 'Heart Disease / CAD' }
      ],
      personalHistory,
      reviewOfSystems: ros,
      ayushAssessment: existingCase?.ayushAssessment,
      hasRedFlags: showRedFlagAlert,
      redFlagReason: showRedFlagAlert ? redFlagReason : undefined,
      aiDraftGeneratedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      physicianReviewed: false
    };

    db.saveCase(finalCase);
    onCompleteHistory(finalCase);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Red Flag Alert Banner if detected */}
      {showRedFlagAlert && (
        <div className="mb-6 p-4 bg-white border-2 border-[#6C3FC5] rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0 text-[#6C3FC5] border border-[#6C3FC5]/20">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#6C3FC5] text-base uppercase tracking-wide">
                    Priority Attention Required
                  </span>
                  <span className="text-[11px] font-semibold bg-neutral-100 px-2 py-0.5 rounded text-neutral-700 border border-neutral-200">
                    Clinical Safety Alert
                  </span>
                </div>
                <p className="text-neutral-800 text-sm font-medium mt-0.5">
                  Some of your answers may require prompt attention from hospital staff.
                </p>
                <p className="text-xs text-neutral-500 mt-1 italic">
                  "Potential clinical red flag detected. Please have a healthcare professional review this information."
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {triageNotified ? (
                <div className="flex items-center gap-1.5 px-4 py-2 bg-neutral-100 border border-neutral-300 rounded text-xs font-bold text-neutral-800">
                  <CheckCircle2 className="w-4 h-4 text-[#6C3FC5]" />
                  <span>Triage Staff Notified</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleNotifyTriage}
                  className="px-4 py-2.5 bg-[#6C3FC5] hover:bg-[#4B238C] text-white font-bold text-sm rounded shadow-sm flex items-center gap-2 transition-colors active:scale-[0.98]"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Notify Triage Staff</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Main Area: Conversational AI History Interface (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden h-[500px] sm:h-[580px] lg:h-[640px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#6C3FC5] text-white flex items-center justify-center font-bold text-sm">
                MK
              </div>
              <div>
                <div className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <span>MediKiosk Clinical Assistant</span>
                  <span className="text-[10px] bg-white border border-neutral-300 px-1.5 py-0.5 rounded text-neutral-600 font-semibold">
                    Interactive
                  </span>
                </div>
                <div className="text-xs text-neutral-500">
                  Patient: {patient.fullName} ({patient.token})
                </div>
              </div>
            </div>

            <span className="text-xs font-semibold text-[#6C3FC5] bg-white px-2.5 py-1 rounded border border-neutral-200">
              {MODULES[activeModuleIndex]}
            </span>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'patient' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3.5 text-sm ${
                    msg.sender === 'patient'
                      ? 'bg-[#6C3FC5] text-white rounded-tr-none'
                      : 'bg-neutral-100 text-neutral-900 border border-neutral-200 rounded-tl-none'
                  }`}
                >
                  <p className="leading-relaxed font-normal">{msg.text}</p>
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 px-1">{msg.time}</span>

                {/* Predefined Quick Choice Buttons */}
                {msg.options && msg.options.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%]">
                    {msg.options.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelectOption(opt)}
                        className="text-xs font-semibold px-3 py-2 bg-white text-neutral-800 border border-neutral-300 rounded-md hover:border-[#6C3FC5] hover:text-[#6C3FC5] hover:bg-neutral-50 transition-colors shadow-2xs text-left"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Controls */}
          <div className="p-3 border-t border-neutral-200 bg-neutral-50">
            {/* Quick helper tip */}
            <div className="text-[11px] text-neutral-500 mb-2 flex items-center justify-between">
              <span>Type or speak naturally • Every question can be answered by tap or voice</span>
              <span className="text-[#6C3FC5] font-semibold">Voice not mandatory</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Large Microphone Button: Tap to Speak */}
              <button
                type="button"
                onClick={toggleSpeechInput}
                className={`h-12 px-4 rounded-md font-bold text-xs flex items-center gap-2 transition-all select-none flex-shrink-0 ${
                  isListening
                    ? 'bg-[#6C3FC5] text-white animate-pulse'
                    : 'bg-white text-neutral-800 border border-neutral-300 hover:border-[#6C3FC5]'
                }`}
                title="Tap to speak your symptoms"
              >
                {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-[#6C3FC5]" />}
                <span className="hidden sm:inline">{isListening ? 'Listening...' : 'Tap to speak'}</span>
              </button>

              {/* Text Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handlePatientSubmit()}
                  placeholder="Type symptoms or select choices above..."
                  className="w-full h-12 px-3.5 pr-10 rounded-md border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#6C3FC5] focus:border-[#6C3FC5]"
                />
              </div>

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handlePatientSubmit()}
                disabled={!inputText.trim()}
                className={`h-12 w-12 rounded-md flex items-center justify-center transition-colors flex-shrink-0 ${
                  inputText.trim()
                    ? 'bg-[#6C3FC5] text-white hover:bg-[#4B238C]'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Area: Structured Clinical Modules Tabs (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden h-[500px] sm:h-[580px] lg:h-[640px]">
          {/* Module Selector Navigation Tabs */}
          <div className="border-b border-neutral-200 bg-neutral-50 px-3 py-2 flex items-center gap-1.5 overflow-x-auto text-xs">
            {MODULES.map((m, idx) => (
              <button
                key={m}
                type="button"
                onClick={() => setActiveModuleIndex(idx)}
                className={`px-2.5 py-1.5 rounded font-bold whitespace-nowrap transition-colors ${
                  activeModuleIndex === idx
                    ? 'bg-[#6C3FC5] text-white'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {idx + 1}. {m}
              </button>
            ))}
          </div>

          {/* Module Content Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* 1. Chief Complaint Module */}
            {activeModuleIndex === 0 && (
              <div className="space-y-4">
                <div className="border-b border-neutral-100 pb-2">
                  <h4 className="font-bold text-neutral-900 text-base">Chief Complaint Details</h4>
                  <p className="text-xs text-neutral-500">Record the main reason for hospital presentation.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Primary Symptom
                  </label>
                  <input
                    type="text"
                    value={chiefComplaint}
                    onChange={e => {
                      setChiefComplaint(e.target.value);
                      checkSafety(e.target.value, socrates);
                    }}
                    className="w-full px-3 py-2 border border-neutral-300 rounded text-sm focus:ring-1 focus:ring-[#6C3FC5]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={e => setDuration(e.target.value)}
                      placeholder="e.g. 3 hours / 2 days"
                      className="w-full px-3 py-2 border border-neutral-300 rounded text-sm focus:ring-1 focus:ring-[#6C3FC5]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Severity (1–10)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={severity}
                        onChange={e => setSeverity(parseInt(e.target.value, 10))}
                        className="w-full accent-[#6C3FC5]"
                      />
                      <span className="font-bold text-sm text-[#6C3FC5] w-6">{severity}/10</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModuleIndex(1)}
                    className="w-full py-2.5 bg-neutral-900 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <span>Next: SOCRATES Symptom Breakdown</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* 2. HPI / SOCRATES Adaptive Module */}
            {activeModuleIndex === 1 && (
              <div className="space-y-4">
                <div className="border-b border-neutral-100 pb-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-neutral-900 text-base">SOCRATES Pain & HPI</h4>
                    <span className="text-[11px] font-semibold text-[#6C3FC5] bg-neutral-100 px-2 py-0.5 rounded">
                      Adaptive Logic
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">Structured clinical assessment for chest pain & acute symptoms.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-neutral-700 block mb-0.5">Site (Where exactly is it?):</span>
                    <input
                      type="text"
                      value={socrates.site}
                      onChange={e => setSocrates({ ...socrates, site: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-neutral-300 rounded text-xs"
                    />
                  </div>

                  <div>
                    <span className="font-bold text-neutral-700 block mb-0.5">Onset (When and how did it begin?):</span>
                    <input
                      type="text"
                      value={socrates.onset}
                      onChange={e => setSocrates({ ...socrates, onset: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-neutral-300 rounded text-xs"
                    />
                  </div>

                  <div>
                    <span className="font-bold text-neutral-700 block mb-0.5">Character (What does it feel like?):</span>
                    <input
                      type="text"
                      value={socrates.character}
                      onChange={e => setSocrates({ ...socrates, character: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-neutral-300 rounded text-xs"
                    />
                  </div>

                  <div>
                    <span className="font-bold text-neutral-700 block mb-0.5">Radiation (Does it spread anywhere?):</span>
                    <input
                      type="text"
                      value={socrates.radiation}
                      onChange={e => setSocrates({ ...socrates, radiation: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-neutral-300 rounded text-xs"
                    />
                  </div>

                  <div>
                    <span className="font-bold text-neutral-700 block mb-0.5">Associated Symptoms:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {['Sweating / Diaphoresis', 'Shortness of breath', 'Nausea / Vomiting', 'Palpitations', 'Dizziness'].map(s => {
                        const has = socrates.associations.includes(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              const next = has
                                ? socrates.associations.filter(x => x !== s)
                                : [...socrates.associations, s];
                              setSocrates({ ...socrates, associations: next });
                              checkSafety(chiefComplaint, { ...socrates, associations: next });
                            }}
                            className={`px-2 py-1 rounded text-[11px] font-semibold border ${
                              has
                                ? 'bg-[#6C3FC5] text-white border-[#6C3FC5]'
                                : 'bg-white text-neutral-700 border-neutral-300'
                            }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModuleIndex(2)}
                    className="w-full py-2 bg-neutral-900 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <span>Next: Past Medical History</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* 3. Past Medical & Surgical */}
            {activeModuleIndex === 2 && (
              <div className="space-y-4 text-xs">
                <div className="border-b border-neutral-100 pb-2">
                  <h4 className="font-bold text-neutral-900 text-base">Past Medical & Surgical History</h4>
                  <p className="text-neutral-500">Select chronic conditions or previous operations.</p>
                </div>

                <div>
                  <span className="font-bold text-neutral-800 block mb-1">Common Conditions:</span>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {['Hypertension', 'Type 2 Diabetes', 'Asthma / COPD', 'Heart Disease', 'Kidney Disease', 'Thyroid Disorder'].map(cond => {
                      const exists = pastConditions.some(c => c.condition.toLowerCase().includes(cond.toLowerCase()));
                      return (
                        <button
                          key={cond}
                          type="button"
                          onClick={() => {
                            if (exists) {
                              setPastConditions(pastConditions.filter(c => !c.condition.toLowerCase().includes(cond.toLowerCase())));
                            } else {
                              setPastConditions([...pastConditions, { id: `pmh-${Date.now()}`, condition: cond, diagnosedYear: '2021', status: 'managed' }]);
                            }
                          }}
                          className={`px-2.5 py-1 rounded border text-[11px] font-semibold ${
                            exists ? 'bg-[#6C3FC5] text-white border-[#6C3FC5]' : 'bg-white text-neutral-700 border-neutral-300'
                          }`}
                        >
                          {cond}
                        </button>
                      );
                    })}
                  </div>

                  {/* Add other condition */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newConditionInput}
                      onChange={e => setNewConditionInput(e.target.value)}
                      placeholder="Add other diagnosed illness..."
                      className="flex-1 px-2.5 py-1.5 border border-neutral-300 rounded text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newConditionInput.trim()) {
                          setPastConditions([...pastConditions, { id: `pmh-${Date.now()}`, condition: newConditionInput.trim(), status: 'active' }]);
                          setNewConditionInput('');
                        }
                      }}
                      className="px-3 py-1.5 bg-neutral-900 text-white rounded font-semibold text-xs"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Active List */}
                <div className="space-y-1.5 pt-2">
                  <span className="font-bold text-neutral-800 block">Logged Past Conditions:</span>
                  {pastConditions.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-2 bg-neutral-50 rounded border border-neutral-200 text-xs">
                      <div>
                        <span className="font-bold text-neutral-900">{c.condition}</span>
                        {c.diagnosedYear && <span className="text-neutral-500 ml-2">(Since {c.diagnosedYear})</span>}
                      </div>
                      <button
                        type="button"
                        onClick={() => setPastConditions(pastConditions.filter(x => x.id !== c.id))}
                        className="text-neutral-400 hover:text-[#6C3FC5]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModuleIndex(3)}
                    className="w-full py-2 bg-neutral-900 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <span>Next: Medications & Allergies</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* 4. Medications & Allergies */}
            {activeModuleIndex === 3 && (
              <div className="space-y-4 text-xs">
                <div className="border-b border-neutral-100 pb-2">
                  <h4 className="font-bold text-neutral-900 text-base">Medications & Allergies</h4>
                  <p className="text-neutral-500">Record active prescription medicines and known allergic reactions.</p>
                </div>

                {/* Medications */}
                <div>
                  <span className="font-bold text-neutral-800 block mb-1">Current Medications:</span>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      value={newMedName}
                      onChange={e => setNewMedName(e.target.value)}
                      placeholder="Medication name (e.g. Amlodipine)"
                      className="px-2.5 py-1.5 border border-neutral-300 rounded text-xs"
                    />
                    <input
                      type="text"
                      value={newMedDose}
                      onChange={e => setNewMedDose(e.target.value)}
                      placeholder="Dose & Freq (e.g. 5mg OD)"
                      className="px-2.5 py-1.5 border border-neutral-300 rounded text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (newMedName.trim()) {
                        setMedications([
                          ...medications,
                          {
                            id: `m-${Date.now()}`,
                            name: newMedName.trim(),
                            dose: newMedDose.trim() || 'Standard dose',
                            frequency: 'Daily',
                            duration: 'Ongoing'
                          }
                        ]);
                        setNewMedName('');
                        setNewMedDose('');
                      }
                    }}
                    className="w-full py-1.5 bg-neutral-900 text-white rounded text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Medication</span>
                  </button>

                  <div className="space-y-1.5 mt-2.5">
                    {medications.map(m => (
                      <div key={m.id} className="p-2 bg-neutral-50 border border-neutral-200 rounded flex items-center justify-between">
                        <div>
                          <div className="font-bold text-neutral-900">{m.name} {m.dose}</div>
                          <div className="text-[11px] text-neutral-500">{m.frequency} • {m.duration}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMedications(medications.filter(x => x.id !== m.id))}
                          className="text-neutral-400 hover:text-[#6C3FC5]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div className="pt-2 border-t border-neutral-100">
                  <span className="font-bold text-[#6C3FC5] block mb-1">Known Allergies (Drug & Food):</span>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newAllergen}
                      onChange={e => setNewAllergen(e.target.value)}
                      placeholder="Allergen (e.g. Sulfa, NSAIDs, Peanuts)"
                      className="flex-1 px-2.5 py-1.5 border border-neutral-300 rounded text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newAllergen.trim()) {
                          setAllergies([
                            ...allergies,
                            {
                              id: `alg-${Date.now()}`,
                              category: 'drug',
                              allergen: newAllergen.trim(),
                              reaction: 'Rash / Swelling',
                              severity: 'moderate'
                            }
                          ]);
                          setNewAllergen('');
                        }
                      }}
                      className="px-3 py-1.5 bg-[#6C3FC5] text-white rounded text-xs font-bold"
                    >
                      Add
                    </button>
                  </div>

                  <div className="space-y-1">
                    {allergies.map(a => (
                      <div key={a.id} className="p-1.5 bg-neutral-50 border border-neutral-200 rounded flex items-center justify-between text-xs">
                        <span className="font-bold text-[#6C3FC5]">{a.allergen} ({a.reaction})</span>
                        <button
                          type="button"
                          onClick={() => setAllergies(allergies.filter(x => x.id !== a.id))}
                          className="text-neutral-400 hover:text-[#6C3FC5]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModuleIndex(4)}
                    className="w-full py-2 bg-neutral-900 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <span>Next: Personal & Family History</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* 5. Personal & Family */}
            {activeModuleIndex === 4 && (
              <div className="space-y-4 text-xs">
                <div className="border-b border-neutral-100 pb-2">
                  <h4 className="font-bold text-neutral-900 text-base">Personal & Family History</h4>
                  <p className="text-neutral-500">Habits, lifestyle, and inherited disease risks.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="font-bold text-neutral-700 block mb-1">Diet:</span>
                    <select
                      value={personalHistory.diet}
                      onChange={e => setPersonalHistory({ ...personalHistory, diet: e.target.value as any })}
                      className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                    >
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                      <option value="Mixed">Mixed</option>
                      <option value="Eggetarian">Eggetarian</option>
                    </select>
                  </div>

                  <div>
                    <span className="font-bold text-neutral-700 block mb-1">Tobacco:</span>
                    <select
                      value={personalHistory.tobacco}
                      onChange={e => setPersonalHistory({ ...personalHistory, tobacco: e.target.value as any })}
                      className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                    >
                      <option value="Never">Never</option>
                      <option value="Former">Former User</option>
                      <option value="Current Smoker">Current Smoker</option>
                      <option value="Chewing Tobacco">Chewing Tobacco</option>
                    </select>
                  </div>

                  <div>
                    <span className="font-bold text-neutral-700 block mb-1">Alcohol:</span>
                    <select
                      value={personalHistory.alcohol}
                      onChange={e => setPersonalHistory({ ...personalHistory, alcohol: e.target.value as any })}
                      className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                    >
                      <option value="Never">Never</option>
                      <option value="Occasional">Occasional</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Heavy">Heavy</option>
                    </select>
                  </div>

                  <div>
                    <span className="font-bold text-neutral-700 block mb-1">Exercise:</span>
                    <select
                      value={personalHistory.exercise}
                      onChange={e => setPersonalHistory({ ...personalHistory, exercise: e.target.value as any })}
                      className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                    >
                      <option value="Sedentary">Sedentary</option>
                      <option value="Light">Light</option>
                      <option value="Moderate">Moderate</option>
                    </select>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-neutral-700 block mb-1">Family Medical History:</span>
                  <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded text-xs text-neutral-700 space-y-1">
                    <div>• <strong>Father:</strong> Myocardial Infarction at age 56</div>
                    <div>• <strong>Brother:</strong> Coronary artery stenting at age 50</div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModuleIndex(5)}
                    className="w-full py-2 bg-neutral-900 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <span>Next: Review of Systems</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* 6. Review of Systems */}
            {activeModuleIndex === 5 && (
              <div className="space-y-4 text-xs">
                <div className="border-b border-neutral-100 pb-2">
                  <h4 className="font-bold text-neutral-900 text-base">Review of Systems (ROS)</h4>
                  <p className="text-neutral-500">Systemic screening across bodily functions.</p>
                </div>

                <div className="space-y-2.5">
                  <div className="p-2 bg-neutral-50 border border-neutral-200 rounded">
                    <span className="font-bold text-neutral-900 block mb-1">Cardiovascular & Respiratory:</span>
                    <div className="text-neutral-700">Chest pressure, dyspnea on walking, diaphoresis. No orthopnea.</div>
                  </div>
                  <div className="p-2 bg-neutral-50 border border-neutral-200 rounded">
                    <span className="font-bold text-neutral-900 block mb-1">Gastrointestinal & Neurological:</span>
                    <div className="text-neutral-700">Mild nausea, no vomiting. No motor loss, slurred speech, or syncope.</div>
                  </div>
                  <div className="p-2 bg-neutral-50 border border-neutral-200 rounded">
                    <span className="font-bold text-neutral-900 block mb-1">Musculoskeletal & General:</span>
                    <div className="text-neutral-700">Left shoulder ache. Profuse cold sweating, general fatigue.</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100">
                  <div className="p-3 bg-neutral-100 rounded text-neutral-700 text-xs mb-3">
                    All clinical modules completed. Ready to proceed to document upload & clinical summary.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Module Action Footer */}
          <div className="p-3 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveModuleIndex(Math.max(0, activeModuleIndex - 1))}
              disabled={activeModuleIndex === 0}
              className={`px-3 py-1.5 rounded text-xs font-semibold ${
                activeModuleIndex === 0 ? 'text-neutral-300' : 'text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Previous Section
            </button>

            <button
              type="button"
              onClick={handleProceedToReview}
              className="px-4 py-2 bg-[#6C3FC5] hover:bg-[#4B238C] text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Finish History & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar Controls */}
      <div className="mt-8 flex items-center justify-between gap-4 pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-semibold rounded-md flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Patient Profile</span>
        </button>

        <button
          type="button"
          onClick={handleProceedToReview}
          className="px-8 py-3.5 bg-[#6C3FC5] hover:bg-[#4B238C] text-white font-bold text-base rounded-md shadow-sm flex items-center gap-2 active:scale-[0.99]"
        >
          <span>Continue to Document Upload</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
