import {
  Patient,
  ClinicalCase,
  TestResult,
  MedicalDocument,
  TimelineEvent,
  RedFlagAlert,
  AuditLog,
  ConsentRecord
} from '../types';

// Initial Demo Patients
const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'P-10241',
    token: 'T-01',
    abhaId: '91-4829-1024-5512',
    fullName: 'Rajesh Kumar',
    age: 52,
    gender: 'Male',
    phone: '+91 98451 22301',
    city: 'New Delhi',
    language: 'hi',
    consultationType: 'modern',
    department: 'Cardiology / Acute Medicine',
    isRegisteredNew: false,
    status: 'waiting',
    isPriority: true,
    counterNumber: 'Counter 01 (Urgent Triage)',
    estimatedWaitMinutes: 5,
    createdAt: '2026-09-11 08:30'
  },
  {
    id: 'P-10242',
    token: 'T-02',
    abhaId: '91-2294-8831-4190',
    fullName: 'Sunita Devi',
    age: 46,
    gender: 'Female',
    phone: '+91 97110 33492',
    city: 'Patna',
    language: 'hi',
    consultationType: 'modern',
    department: 'General Medicine / Infectious Disease',
    isRegisteredNew: false,
    status: 'waiting',
    isPriority: false,
    counterNumber: 'Counter 04',
    estimatedWaitMinutes: 14,
    createdAt: '2026-09-11 08:45'
  },
  {
    id: 'P-10243',
    token: 'T-03',
    abhaId: '91-3310-9941-7721',
    fullName: 'Amitav Roy',
    age: 38,
    gender: 'Male',
    phone: '+91 98301 44520',
    city: 'Kolkata',
    language: 'bn',
    consultationType: 'modern',
    department: 'General Surgery / Acute Abdomen',
    isRegisteredNew: false,
    status: 'waiting',
    isPriority: false,
    counterNumber: 'Counter 02',
    estimatedWaitMinutes: 20,
    createdAt: '2026-09-11 09:00'
  },
  {
    id: 'P-10244',
    token: 'T-04',
    abhaId: '91-5521-7733-1102',
    fullName: 'Meera Patel',
    age: 29,
    gender: 'Female',
    phone: '+91 99042 11983',
    city: 'Ahmedabad',
    language: 'en',
    consultationType: 'modern',
    department: 'Neurology OPD',
    isRegisteredNew: false,
    status: 'in_consultation',
    isPriority: false,
    counterNumber: 'Counter 05',
    estimatedWaitMinutes: 25,
    createdAt: '2026-09-11 09:15'
  },
  {
    id: 'P-10245',
    token: 'T-05',
    abhaId: '91-6644-3322-8819',
    fullName: 'Rameshwar Prasad',
    age: 64,
    gender: 'Male',
    phone: '+91 94310 88231',
    city: 'Varanasi',
    language: 'hi',
    consultationType: 'modern',
    department: 'Endocrinology & Diabetology',
    isRegisteredNew: false,
    status: 'waiting',
    isPriority: false,
    counterNumber: 'Counter 03',
    estimatedWaitMinutes: 30,
    createdAt: '2026-09-11 09:30'
  },
  {
    id: 'P-10246',
    token: 'T-06',
    abhaId: '91-1188-4422-9901',
    fullName: 'Priya Sen',
    age: 34,
    gender: 'Female',
    phone: '+91 98319 77241',
    city: 'Siliguri',
    language: 'bn',
    consultationType: 'modern',
    department: 'Pulmonology / Chest Clinic',
    isRegisteredNew: false,
    status: 'waiting',
    isPriority: false,
    counterNumber: 'Counter 06',
    estimatedWaitMinutes: 35,
    createdAt: '2026-09-11 09:40'
  },
  {
    id: 'P-10247',
    token: 'T-07',
    abhaId: '91-7711-2299-4433',
    fullName: 'Harish Joshi',
    age: 58,
    gender: 'Male',
    phone: '+91 94120 55182',
    city: 'Haridwar',
    language: 'hi',
    consultationType: 'ayush',
    department: 'AYUSH / Kayachikitsa OPD',
    isRegisteredNew: false,
    status: 'waiting',
    isPriority: false,
    counterNumber: 'AYUSH Room 12',
    estimatedWaitMinutes: 10,
    createdAt: '2026-09-11 09:50'
  },
  {
    id: 'P-10248',
    token: 'T-08',
    abhaId: '91-8822-1144-7766',
    fullName: 'Lakshmi Bai',
    age: 71,
    gender: 'Female',
    phone: '+91 98480 33190',
    city: 'Hyderabad',
    language: 'en',
    consultationType: 'modern',
    department: 'Geriatric Medicine',
    isRegisteredNew: false,
    status: 'completed',
    isPriority: false,
    counterNumber: 'Counter 07',
    estimatedWaitMinutes: 0,
    createdAt: '2026-09-11 10:00'
  }
];

// Initial Clinical Cases
const INITIAL_CASES: Record<string, ClinicalCase> = {
  'P-10241': {
    id: 'CASE-10241',
    patientId: 'P-10241',
    consultationType: 'modern',
    status: 'intake_completed',
    chiefComplaints: [
      { complaint: 'Retrosternal chest discomfort & heaviness', duration: '3 hours', severity: 8 }
    ],
    hpiNarrative: 'Patient reports sudden onset retrosternal crushing tightness radiating to left shoulder and jaw, accompanied by profuse diaphoresis and mild dyspnea upon climbing stairs this morning.',
    socrates: {
      site: 'Retrosternal (central chest)',
      onset: 'Sudden, during morning walk at 06:30 AM',
      character: 'Heavy crushing pressure and squeezing sensation',
      radiation: 'Radiates to left shoulder, medial arm, and lower jaw',
      associations: ['Profuse sweating (diaphoresis)', 'Shortness of breath', 'Nausea'],
      timing: 'Continuous for 3 hours, worsening with exertion',
      exacerbatingFactors: 'Walking, physical effort, lying flat',
      relievingFactors: 'Rest gives partial relief but dull ache persists',
      severityScore: 8
    },
    pastMedicalHistory: [
      { id: 'pmh-1', condition: 'Essential Hypertension', diagnosedYear: '2019', status: 'managed', notes: 'On Telmisartan 40mg' },
      { id: 'pmh-2', condition: 'Dyslipidemia', diagnosedYear: '2022', status: 'active', notes: 'Irregular compliance with statins' }
    ],
    pastSurgicalHistory: [
      { id: 'psh-1', procedure: 'Left inguinal hernia repair', approxDate: '2018', hospitalOrReason: 'District Hospital' }
    ],
    medications: [
      { id: 'med-1', name: 'Telmisartan', dose: '40 mg', frequency: 'Once daily (OD)', duration: '5 years' },
      { id: 'med-2', name: 'Atorvastatin', dose: '10 mg', frequency: 'At bedtime (HS)', duration: '2 years (irregular)' }
    ],
    allergies: [
      { id: 'alg-1', category: 'drug', allergen: 'Penicillin', reaction: 'Urticarial skin rash & facial swelling', severity: 'moderate' }
    ],
    familyHistory: [
      { relation: 'Father', condition: 'Myocardial Infarction at age 56' },
      { relation: 'Brother', condition: 'Coronary Artery Disease with stenting at age 50' }
    ],
    personalHistory: {
      diet: 'Mixed',
      sleepHours: '6 hours',
      exercise: 'Sedentary',
      tobacco: 'Former',
      alcohol: 'Occasional',
      occupation: 'Government Office Clerk'
    },
    reviewOfSystems: {
      general: ['Fatigue', 'Cold sweats'],
      cardiovascular: ['Chest pressure', 'Palpitations'],
      respiratory: ['Mild shortness of breath'],
      gastrointestinal: ['Mild nausea', 'No vomiting'],
      neurological: ['Mild dizziness'],
      genitourinary: ['No complaints'],
      musculoskeletal: ['Left shoulder ache'],
      dermatological: ['Pale, diaphoretic skin']
    },
    hasRedFlags: true,
    redFlagReason: 'Severe crushing chest pain radiating to left arm/jaw with diaphoresis (ACS suspect)',
    aiDraftGeneratedAt: '2026-09-11 08:35',
    physicianReviewed: false
  },
  'P-10247': {
    id: 'CASE-10247',
    patientId: 'P-10247',
    consultationType: 'ayush',
    status: 'intake_completed',
    chiefComplaints: [
      { complaint: 'Sandhishoola (multiple joint pain with early morning stiffness)', duration: '4 months', severity: 7 }
    ],
    hpiNarrative: 'Patient presents with progressive pain and swelling in bilateral knee joints, metacarpophalangeal joints, and morning stiffness lasting over 60 minutes. Associated with heaviness of body (Gourava) and loss of appetite (Aruchi).',
    pastMedicalHistory: [
      { id: 'pmh-71', condition: 'Amavata (suspected rheumatoid arthritis)', diagnosedYear: '2025', status: 'active' },
      { id: 'pmh-72', condition: 'Mandagni & Ajeerna (chronic indigestion)', diagnosedYear: '2024', status: 'active' }
    ],
    pastSurgicalHistory: [],
    medications: [
      { id: 'med-71', name: 'Yograj Guggulu', dose: '2 tablets', frequency: 'Twice daily after meals', duration: '2 months' },
      { id: 'med-72', name: 'Rasnasaptaka Kwatha', dose: '15 ml with warm water', frequency: 'Twice daily before meals', duration: '1 month' }
    ],
    allergies: [],
    familyHistory: [
      { relation: 'Mother', condition: 'Sandhivata (Joint disorders)' }
    ],
    personalHistory: {
      diet: 'Vegetarian',
      sleepHours: '5-6 hours (disturbed due to joint ache)',
      exercise: 'Light',
      tobacco: 'Never',
      alcohol: 'Never',
      occupation: 'School Teacher'
    },
    reviewOfSystems: {
      general: ['Aruchi (Anorexia)', 'Gourava (Body heaviness)', 'Angamarda (Body ache)'],
      cardiovascular: ['Normal'],
      respiratory: ['Normal'],
      gastrointestinal: ['Vibandha (Constipation)', 'Adhmana (Abdominal fullness)'],
      neurological: ['Normal'],
      genitourinary: ['Normal'],
      musculoskeletal: ['Sandhishotha (Joint swelling)', 'Stabdhadha (Stiffness)'],
      dermatological: ['Normal']
    },
    ayushAssessment: {
      id: 'ayush-1',
      patientId: 'P-10247',
      prakriti: 'Vata-Kapha',
      vikriti: 'Vata-Kapha with Sama Lakshana (Ama involvement)',
      sara: 'Madhyama',
      samhanana: 'Madhyama (Moderate)',
      pramana: 'Madhyama (Proportionate)',
      satmya: 'Vyayamadi Satmya',
      sattva: 'Madhyama (Moderate)',
      aharaShakti: 'Manda (Low Intake & Digestion)',
      vyayamaShakti: 'Heena (Low)',
      vaya: 'Madhyama (Adult)',
      agni: 'Mandagni',
      koshtha: 'Krura',
      ahara: 'Guru, Snigdha, Sheeta, Dadhi, Viruddha Ahara',
      vihara: 'Diwaswapna (daytime sleep), lack of physical activity',
      nidana: 'Viruddha Ahara sevana, Sheeta vatasevana, Mandagni',
      sampraptiSummary: 'Ama produced due to Agnimandya gets propelled by aggravated Vata into Shleshma sthana (joints) causing Amavata.'
    },
    hasRedFlags: false,
    aiDraftGeneratedAt: '2026-09-11 09:55',
    physicianReviewed: false
  }
};

// Initial Test Results
const INITIAL_TESTS: TestResult[] = [
  {
    id: 't-101',
    patientId: 'P-10241',
    testName: 'High-Sensitivity Troponin I',
    date: '11 Sep 2026',
    result: '142.5',
    unit: 'ng/L',
    referenceRange: '< 14.0',
    isAbnormal: true,
    clinicalSignificance: 'Elevated cardiac biomarker indicative of myocardial injury / ACS'
  },
  {
    id: 't-102',
    patientId: 'P-10241',
    testName: '12-Lead Electrocardiogram (ECG)',
    date: '11 Sep 2026',
    result: 'ST elevation 2mm in V2-V4, T wave inversion aVL',
    unit: 'Lead trace',
    referenceRange: 'Normal Sinus Rhythm',
    isAbnormal: true,
    clinicalSignificance: 'Acute Anterior STEMI pattern; urgent catheterization review recommended'
  },
  {
    id: 't-103',
    patientId: 'P-10241',
    testName: 'Serum Creatinine',
    date: '11 Sep 2026',
    result: '1.02',
    unit: 'mg/dL',
    referenceRange: '0.70 - 1.20',
    isAbnormal: false
  },
  {
    id: 't-104',
    patientId: 'P-10241',
    testName: 'Random Blood Glucose (RBG)',
    date: '11 Sep 2026',
    result: '148',
    unit: 'mg/dL',
    referenceRange: '70 - 140',
    isAbnormal: true,
    clinicalSignificance: 'Mild stress hyperglycemia'
  },
  {
    id: 't-201',
    patientId: 'P-10242',
    testName: 'Platelet Count',
    date: '10 Sep 2026',
    result: '62,000',
    unit: '/mcL',
    referenceRange: '150,000 - 450,000',
    isAbnormal: true,
    clinicalSignificance: 'Marked thrombocytopenia; correlate with Dengue NS1 / IgM'
  },
  {
    id: 't-202',
    patientId: 'P-10242',
    testName: 'Dengue NS1 Antigen ELISA',
    date: '10 Sep 2026',
    result: 'POSITIVE',
    unit: 'Index',
    referenceRange: 'Negative',
    isAbnormal: true,
    clinicalSignificance: 'Acute Dengue Viral Infection confirmation'
  },
  {
    id: 't-501',
    patientId: 'P-10245',
    testName: 'Glycated Hemoglobin (HbA1c)',
    date: '02 Sep 2026',
    result: '8.6',
    unit: '%',
    referenceRange: '< 5.7 (Normal), < 7.0 (Target)',
    isAbnormal: true,
    clinicalSignificance: 'Suboptimal glycemic control; titration of anti-diabetic regimen needed'
  },
  {
    id: 't-502',
    patientId: 'P-10245',
    testName: 'Fasting Plasma Glucose',
    date: '02 Sep 2026',
    result: '174',
    unit: 'mg/dL',
    referenceRange: '70 - 100',
    isAbnormal: true
  },
  {
    id: 't-701',
    patientId: 'P-10247',
    testName: 'Erythrocyte Sedimentation Rate (ESR)',
    date: '05 Sep 2026',
    result: '48',
    unit: 'mm/1st hr',
    referenceRange: '0 - 15',
    isAbnormal: true,
    clinicalSignificance: 'Elevated inflammatory marker corresponding with Amavata shotha'
  },
  {
    id: 't-702',
    patientId: 'P-10247',
    testName: 'Rheumatoid Factor (RA Factor Quantitative)',
    date: '05 Sep 2026',
    result: '54.2',
    unit: 'IU/mL',
    referenceRange: '< 14.0',
    isAbnormal: true,
    clinicalSignificance: 'Seropositive finding'
  }
];

// Initial Documents
const INITIAL_DOCUMENTS: MedicalDocument[] = [
  {
    id: 'DOC-10241-1',
    patientId: 'P-10241',
    title: 'Previous Cardiology Consultation & Rx',
    documentType: 'Prescription',
    documentDate: '14 Jul 2026',
    fileUrl: '/docs/rx_cardio_10241.pdf',
    status: 'verified',
    extractedData: {
      diagnoses: ['Essential Hypertension Stage 1', 'Borderline Hyperlipidemia'],
      medications: [
        { name: 'Tab Telmisartan', dosage: '40 mg OD' },
        { name: 'Tab Atorvastatin', dosage: '10 mg HS' }
      ],
      investigations: [
        { test: 'Total Cholesterol', result: '228', unit: 'mg/dL' },
        { test: 'LDL-C', result: '146', unit: 'mg/dL' }
      ],
      procedures: [],
      confidenceScore: 94
    },
    isVerifiedByPhysician: true
  },
  {
    id: 'DOC-10241-2',
    patientId: 'P-10241',
    title: 'Emergency 12-Lead ECG Report',
    documentType: 'Imaging Report',
    documentDate: '11 Sep 2026',
    fileUrl: '/docs/ecg_emergency_10241.pdf',
    status: 'verified',
    extractedData: {
      diagnoses: ['Hyperacute Anterior Wall ST Elevation Myocardial Infarction'],
      medications: [],
      investigations: [
        { test: 'Heart Rate', result: '98', unit: 'bpm' },
        { test: 'PR Interval', result: '160', unit: 'ms' },
        { test: 'QRS Duration', result: '92', unit: 'ms' }
      ],
      procedures: ['12-Lead Electrocardiography'],
      confidenceScore: 98
    },
    isVerifiedByPhysician: true
  },
  {
    id: 'DOC-10247-1',
    patientId: 'P-10247',
    title: 'Previous Ayurvedic Chikitsa Patra',
    documentType: 'Previous Consultation',
    documentDate: '12 Aug 2026',
    fileUrl: '/docs/ayush_rx_10247.pdf',
    status: 'verified',
    extractedData: {
      diagnoses: ['Amavata (Shleshma sthana dushti)', 'Agnimandya'],
      medications: [
        { name: 'Yograj Guggulu', dosage: '2 Tab BD' },
        { name: 'Rasnasaptaka Kwatha', dosage: '15 ml BD with ushna jala' }
      ],
      investigations: [
        { test: 'ESR', result: '48', unit: 'mm/hr' }
      ],
      procedures: ['Valuka Sweda (Sandhi pradesha) recommended'],
      confidenceScore: 91
    },
    isVerifiedByPhysician: true
  }
];

// Initial Timeline
const INITIAL_TIMELINE: TimelineEvent[] = [
  {
    id: 'tl-1',
    patientId: 'P-10241',
    year: '2026',
    month: 'September',
    dateStr: '11 Sep 2026',
    type: 'investigation',
    title: 'Emergency ECG & Cardiac Biomarker Panel',
    institution: 'District Hospital Triage',
    summary: 'Elevated Troponin I (142.5 ng/L) with V2-V4 ST elevation.',
    documentId: 'DOC-10241-2'
  },
  {
    id: 'tl-2',
    patientId: 'P-10241',
    year: '2026',
    month: 'July',
    dateStr: '14 Jul 2026',
    type: 'prescription',
    title: 'Cardiology Follow-up Prescription',
    institution: 'Civil Hospital OPD',
    summary: 'Telmisartan 40mg OD and Atorvastatin 10mg HS prescribed for BP control.',
    documentId: 'DOC-10241-1'
  },
  {
    id: 'tl-3',
    patientId: 'P-10241',
    year: '2025',
    month: 'December',
    dateStr: '19 Dec 2025',
    type: 'consultation',
    title: 'Routine Health Check & Lipid Profile',
    institution: 'Primary Health Centre (PHC)',
    summary: 'Borderline lipid elevation noted; lifestyle modification advised.'
  }
];

// Initial Red Flags
const INITIAL_RED_FLAGS: RedFlagAlert[] = [
  {
    id: 'rf-101',
    patientId: 'P-10241',
    patientName: 'Rajesh Kumar',
    token: 'T-01',
    triggerCondition: 'Severe chest discomfort (8/10) radiating to jaw/left arm with diaphoresis (ACS suspect)',
    detectedAt: '2026-09-11 08:35',
    status: 'active'
  }
];

// Initial Audit Logs
const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-11 08:30:12',
    patientId: 'P-10241',
    actor: 'Kiosk-Terminal-01',
    action: 'Patient Identification',
    details: 'Patient scanned ABHA card or verified via phone OTP'
  },
  {
    id: 'log-2',
    timestamp: '2026-09-11 08:32:04',
    patientId: 'P-10241',
    actor: 'Patient (Rajesh Kumar)',
    action: 'Consent Granted',
    details: 'Digital informed consent for AI history intake & doc OCR processing'
  },
  {
    id: 'log-3',
    timestamp: '2026-09-11 08:35:19',
    patientId: 'P-10241',
    actor: 'MediKiosk Clinical Rules Engine',
    action: 'RED_FLAG_TRIGGERED',
    details: 'Severe acute retrosternal chest pain -> Triage team notification queued'
  }
];

// Reactive In-Memory Database Store with SessionStorage Persistence
class RelationalDatabaseService {
  private patients: Patient[] = [];
  private clinicalCases: Record<string, ClinicalCase> = {};
  private tests: TestResult[] = [];
  private documents: MedicalDocument[] = [];
  private timeline: TimelineEvent[] = [];
  private redFlags: RedFlagAlert[] = [];
  private auditLogs: AuditLog[] = [];
  private consents: Record<string, ConsentRecord> = {};
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const saved = sessionStorage.getItem('medikiosk_db_state_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.patients = parsed.patients || INITIAL_PATIENTS;
        this.clinicalCases = parsed.clinicalCases || INITIAL_CASES;
        this.tests = parsed.tests || INITIAL_TESTS;
        this.documents = parsed.documents || INITIAL_DOCUMENTS;
        this.timeline = parsed.timeline || INITIAL_TIMELINE;
        this.redFlags = parsed.redFlags || INITIAL_RED_FLAGS;
        this.auditLogs = parsed.auditLogs || INITIAL_AUDIT_LOGS;
        this.consents = parsed.consents || {};
        return;
      }
    } catch {
      // fallback
    }
    this.resetToDefaults();
  }

  private saveState() {
    try {
      const payload = {
        patients: this.patients,
        clinicalCases: this.clinicalCases,
        tests: this.tests,
        documents: this.documents,
        timeline: this.timeline,
        redFlags: this.redFlags,
        auditLogs: this.auditLogs,
        consents: this.consents
      };
      sessionStorage.setItem('medikiosk_db_state_v1', JSON.stringify(payload));
    } catch {
      // quota or private mode
    }
    this.notify();
  }

  public resetToDefaults() {
    this.patients = [...INITIAL_PATIENTS];
    this.clinicalCases = { ...INITIAL_CASES };
    this.tests = [...INITIAL_TESTS];
    this.documents = [...INITIAL_DOCUMENTS];
    this.timeline = [...INITIAL_TIMELINE];
    this.redFlags = [...INITIAL_RED_FLAGS];
    this.auditLogs = [...INITIAL_AUDIT_LOGS];
    this.consents = {};
    this.saveState();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // --- Patients ---
  public getPatients(): Patient[] {
    return [...this.patients];
  }

  public getPatientById(id: string): Patient | undefined {
    return this.patients.find(p => p.id === id);
  }

  public addOrUpdatePatient(patient: Patient): Patient {
    const idx = this.patients.findIndex(p => p.id === patient.id);
    if (idx >= 0) {
      this.patients[idx] = patient;
    } else {
      this.patients.unshift(patient);
    }
    this.logAudit(patient.id, 'Patient Registered / Updated', `ID: ${patient.id}, Name: ${patient.fullName}`);
    this.saveState();
    return patient;
  }

  public updatePatientStatus(patientId: string, status: 'waiting' | 'in_consultation' | 'completed'): void {
    const p = this.patients.find(pt => pt.id === patientId);
    if (p) {
      p.status = status;
      this.logAudit(patientId, 'Patient Status Updated', `Status changed to ${status}`);
      this.saveState();
    }
  }

  // --- Clinical Cases ---
  public getCaseByPatientId(patientId: string): ClinicalCase | undefined {
    return this.clinicalCases[patientId];
  }

  public saveCase(clinicalCase: ClinicalCase): ClinicalCase {
    this.clinicalCases[clinicalCase.patientId] = clinicalCase;
    this.logAudit(clinicalCase.patientId, 'Case History Updated', `Draft timestamp: ${clinicalCase.aiDraftGeneratedAt}`);
    this.saveState();
    return clinicalCase;
  }

  public markCaseReviewed(patientId: string, doctorName: string, doctorNotes: string): void {
    const c = this.clinicalCases[patientId];
    if (c) {
      c.physicianReviewed = true;
      c.physicianReviewedBy = doctorName;
      c.physicianNotes = doctorNotes;
      c.status = 'consulted';
      this.logAudit(patientId, 'Physician Review Completed', `Signed by Dr. ${doctorName}`);
      this.saveState();
    }
  }

  // --- Consents ---
  public saveConsent(consent: ConsentRecord): void {
    this.consents[consent.patientId] = consent;
    this.logAudit(consent.patientId, 'Consent Captured', `Signed at: ${consent.signedAt}`);
    this.saveState();
  }

  public getConsent(patientId: string): ConsentRecord | undefined {
    return this.consents[patientId];
  }

  // --- Red Flags ---
  public getRedFlags(): RedFlagAlert[] {
    return [...this.redFlags];
  }

  public triggerRedFlag(patient: Patient, triggerCondition: string): RedFlagAlert {
    const existing = this.redFlags.find(rf => rf.patientId === patient.id && rf.status === 'active');
    if (existing) return existing;

    const alert: RedFlagAlert = {
      id: `rf-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.fullName,
      token: patient.token,
      triggerCondition,
      detectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'active'
    };
    this.redFlags.unshift(alert);
    this.logAudit(patient.id, 'PRIORITY_RED_FLAG_RAISED', triggerCondition);
    this.saveState();
    return alert;
  }

  public acknowledgeRedFlag(alertId: string, physicianNote?: string): void {
    const rf = this.redFlags.find(r => r.id === alertId);
    if (rf) {
      rf.status = 'triaged';
      if (physicianNote) rf.physicianNote = physicianNote;
      this.logAudit(rf.patientId, 'Red Flag Triaged', physicianNote || 'Acknowledged by physician');
      this.saveState();
    }
  }

  // --- Tests & Investigations ---
  public getTestsByPatientId(patientId: string): TestResult[] {
    return this.tests.filter(t => t.patientId === patientId);
  }

  public getTestResultsByPatientId(patientId: string): TestResult[] {
    return this.getTestsByPatientId(patientId);
  }

  public addTestResult(test: TestResult): void {
    this.tests.push(test);
    this.saveState();
  }

  // --- Documents & OCR ---
  public getDocumentsByPatientId(patientId: string): MedicalDocument[] {
    return this.documents.filter(d => d.patientId === patientId);
  }

  public addDocument(doc: MedicalDocument): void {
    this.documents.unshift(doc);
    this.logAudit(doc.patientId, 'Document Uploaded', `${doc.documentType} - ${doc.title}`);
    this.saveState();
  }

  public updateDocumentExtraction(docId: string, verified: boolean): void {
    const doc = this.documents.find(d => d.id === docId);
    if (doc) {
      doc.isVerifiedByPhysician = verified;
      doc.status = verified ? 'verified' : 'processed';
      this.saveState();
    }
  }

  // --- Timeline ---
  public getTimelineByPatientId(patientId: string): TimelineEvent[] {
    return this.timeline.filter(tl => tl.patientId === patientId);
  }

  public addTimelineEvent(ev: TimelineEvent): void {
    this.timeline.unshift(ev);
    this.saveState();
  }

  // --- Audit Logs ---
  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  private logAudit(patientId: string | undefined, action: string, details: string) {
    const entry: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      patientId,
      actor: 'MediKiosk System / User',
      action,
      details
    };
    this.auditLogs.unshift(entry);
    if (this.auditLogs.length > 200) this.auditLogs.pop();
  }

  // --- SQL Schema Generator for Supabase PostgreSQL ---
  public getPostgresSchemaSql(): string {
    return this.generateSqlSchema();
  }

  public generateSqlSchema(): string {
    return `-- ====================================================================
-- MediKiosk PostgreSQL Database Schema for Supabase
-- Target: Supabase Cloud PostgreSQL 15+ / ABDM & FHIR-ready Clinical Intake
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Enumerations
CREATE TYPE user_role AS ENUM ('patient', 'physician', 'nurse_triage', 'admin');
CREATE TYPE consultation_type AS ENUM ('modern', 'ayush');
CREATE TYPE red_flag_status AS ENUM ('active', 'acknowledged', 'triaged', 'resolved');
CREATE TYPE case_status AS ENUM ('intake_pending', 'intake_completed', 'with_physician', 'consulted');
CREATE TYPE doc_type AS ENUM ('Prescription', 'Laboratory Report', 'Discharge Summary', 'Imaging Report', 'Previous Consultation');

-- 3. Users Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  full_name TEXT NOT NULL,
  role user_role DEFAULT 'patient',
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Patients Table
CREATE TABLE IF NOT EXISTS public.patients (
  id TEXT PRIMARY KEY, -- e.g. 'P-10241'
  token TEXT NOT NULL,
  abha_id TEXT,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT,
  language TEXT DEFAULT 'en',
  consultation_type consultation_type DEFAULT 'modern',
  department TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Consents Table
CREATE TABLE IF NOT EXISTS public.consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
  clinical_info_collection BOOLEAN DEFAULT TRUE,
  document_processing BOOLEAN DEFAULT TRUE,
  staff_sharing BOOLEAN DEFAULT TRUE,
  future_abdm_integration BOOLEAN DEFAULT TRUE,
  signed_at TIMESTAMPTZ DEFAULT NOW(),
  kiosk_id TEXT
);

-- 6. Clinical Cases Table
CREATE TABLE IF NOT EXISTS public.clinical_cases (
  id TEXT PRIMARY KEY,
  patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
  consultation_type consultation_type NOT NULL,
  status case_status DEFAULT 'intake_pending',
  chief_complaints JSONB DEFAULT '[]'::jsonb,
  hpi_narrative TEXT,
  socrates JSONB,
  has_red_flags BOOLEAN DEFAULT FALSE,
  red_flag_reason TEXT,
  ai_draft_generated_at TIMESTAMPTZ DEFAULT NOW(),
  physician_reviewed BOOLEAN DEFAULT FALSE,
  physician_reviewed_by TEXT,
  physician_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. History Sections (Sub-tables or normalized structures)
CREATE TABLE IF NOT EXISTS public.medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id TEXT REFERENCES public.clinical_cases(id) ON DELETE CASCADE,
  patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dose TEXT,
  frequency TEXT,
  duration TEXT
);

CREATE TABLE IF NOT EXISTS public.allergies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id TEXT REFERENCES public.clinical_cases(id) ON DELETE CASCADE,
  patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  allergen TEXT NOT NULL,
  reaction TEXT,
  severity TEXT
);

CREATE TABLE IF NOT EXISTS public.ayush_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id TEXT REFERENCES public.clinical_cases(id) ON DELETE CASCADE,
  patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
  prakriti TEXT,
  vikriti TEXT,
  sara TEXT,
  samhanana TEXT,
  pramana TEXT,
  satmya TEXT,
  sattva TEXT,
  ahara_shakti TEXT,
  vyayama_shakti TEXT,
  vaya TEXT,
  agni TEXT,
  koshtha TEXT,
  samprapti_summary TEXT
);

-- 8. Tests & Results
CREATE TABLE IF NOT EXISTS public.test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
  test_name TEXT NOT NULL,
  test_date DATE NOT NULL,
  result TEXT NOT NULL,
  unit TEXT,
  reference_range TEXT,
  is_abnormal BOOLEAN DEFAULT FALSE,
  clinical_significance TEXT
);

-- 9. Documents & OCR Extractions
CREATE TABLE IF NOT EXISTS public.documents (
  id TEXT PRIMARY KEY,
  patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  document_type doc_type NOT NULL,
  document_date DATE,
  storage_path TEXT,
  status TEXT DEFAULT 'processed',
  extracted_data JSONB,
  is_verified_by_physician BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Red Flags / Triage Alert Queue
CREATE TABLE IF NOT EXISTS public.red_flags (
  id TEXT PRIMARY KEY,
  patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  token TEXT NOT NULL,
  trigger_condition TEXT NOT NULL,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  status red_flag_status DEFAULT 'active',
  physician_note TEXT
);

-- 11. Audit Logs (Compliance & Security)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id TEXT,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.red_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public kiosk intake inserts" ON public.patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow clinical staff full access" ON public.patients FOR ALL USING (true);
CREATE POLICY "Allow case read for active encounters" ON public.clinical_cases FOR ALL USING (true);
`;
  }
}

export const db = new RelationalDatabaseService();
