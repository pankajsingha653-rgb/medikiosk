export type ConsultationType = 'modern' | 'ayush';

export type UserRole = 'patient' | 'physician' | 'admin' | 'kiosk';

export type LanguageCode = 'en' | 'hi' | 'bn' | 'ne';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  pronunciation: string;
}

export interface AccessibilitySettings {
  language: LanguageCode;
  textSize: 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
  audioAssistance: boolean;
  screenReader: boolean;
}

export interface Patient {
  id: string; // e.g. P-10241
  token: string; // e.g. T-42
  abhaId?: string; // e.g. 91-4829-1024-5512
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  city: string;
  language: LanguageCode;
  consultationType: ConsultationType;
  department: string;
  isRegisteredNew: boolean;
  createdAt: string;
  status: 'waiting' | 'in_consultation' | 'completed';
  isPriority?: boolean;
  counterNumber?: string;
  estimatedWaitMinutes?: number;
}

export interface ConsentRecord {
  id: string;
  patientId: string;
  clinicalInfoCollection: boolean;
  documentProcessing: boolean;
  staffSharing: boolean;
  futureAbdmIntegration: boolean;
  signedAt: string;
  ipOrKioskId: string;
}

export interface ChiefComplaint {
  complaint: string;
  duration: string;
  severity: number; // 1-10
  details?: string;
}

export interface SocratesHistory {
  site: string;
  onset: string;
  character: string;
  radiation: string;
  associations: string[];
  timing: string;
  exacerbatingFactors: string;
  relievingFactors: string;
  severityScore: number;
}

export interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  duration: string;
  prescribedFor?: string;
}

export interface Allergy {
  id: string;
  category: 'drug' | 'food' | 'environmental' | 'other';
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe';
}

export interface PastCondition {
  id: string;
  condition: string;
  diagnosedYear?: string;
  status: 'active' | 'managed' | 'resolved';
  notes?: string;
}

export interface PastSurgery {
  id: string;
  procedure: string;
  approxDate: string;
  hospitalOrReason: string;
}

export interface PersonalHistory {
  diet: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Eggetarian' | 'Mixed';
  sleepHours: string;
  exercise: 'Sedentary' | 'Light' | 'Moderate' | 'Heavy';
  tobacco: 'Never' | 'Former' | 'Current Smoker' | 'Chewing Tobacco';
  alcohol: 'Never' | 'Occasional' | 'Moderate' | 'Heavy';
  occupation: string;
}

export interface FamilyHistoryItem {
  relation: string;
  condition: string;
  ageOfOnset?: string;
}

export interface ReviewOfSystems {
  general: string[];
  cardiovascular: string[];
  respiratory: string[];
  gastrointestinal: string[];
  neurological: string[];
  genitourinary: string[];
  musculoskeletal: string[];
  dermatological: string[];
}

export interface AyushAssessment {
  id: string;
  patientId: string;
  // Dashavidha Pariksha
  prakriti: 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha' | 'Tridoshaja';
  vikriti: string;
  sara: 'Pravara' | 'Madhyama' | 'Avara';
  samhanana: 'Susamhata (Compact)' | 'Madhyama (Moderate)' | 'Heena (Poor)';
  pramana: 'Madhyama (Proportionate)' | 'Ati-Sthula (Obese)' | 'Ati-Krisha (Emaciated)';
  satmya: 'Sarva Rasa Satmya' | 'Vyayamadi Satmya' | 'Eka Rasa Satmya';
  sattva: 'Pravara (High Mental Strength)' | 'Madhyama (Moderate)' | 'Avara (Weak)';
  aharaShakti: 'Abhyavaharana Shakti Uttama' | 'Madhyama' | 'Manda (Low Intake & Digestion)';
  vyayamaShakti: 'Uttama (High)' | 'Madhyama' | 'Heena (Low)';
  vaya: 'Balya (Childhood)' | 'Madhyama (Adult)' | 'Vriddha (Geriatric)';
  // Agni, Koshtha, etc.
  agni: 'Vishamagni' | 'Tikshnagni' | 'Mandagni' | 'Samagni';
  koshtha: 'Krura' | 'Mrida' | 'Madhyama';
  ahara: string;
  vihara: string;
  nidana: string;
  sampraptiSummary: string;
}

export interface RedFlagAlert {
  id: string;
  patientId: string;
  patientName: string;
  token: string;
  triggerCondition: string;
  symptomTrigger?: string;
  department?: string;
  detectedAt: string;
  timestamp?: string;
  status: 'active' | 'acknowledged' | 'triaged' | 'resolved';
  physicianNote?: string;
}

export interface ClinicalCase {
  id: string;
  patientId: string;
  consultationType: ConsultationType;
  status: 'intake_pending' | 'intake_completed' | 'with_physician' | 'consulted' | 'reviewed_by_physician';
  chiefComplaints: ChiefComplaint[];
  hpiNarrative: string;
  socrates?: SocratesHistory;
  pastMedicalHistory: PastCondition[];
  pastSurgicalHistory: PastSurgery[];
  medications: Medication[];
  allergies: Allergy[];
  familyHistory: FamilyHistoryItem[];
  personalHistory: PersonalHistory;
  reviewOfSystems: ReviewOfSystems;
  ayushAssessment?: AyushAssessment;
  hasRedFlags: boolean;
  redFlagReason?: string;
  aiDraftGeneratedAt: string;
  physicianReviewed: boolean;
  physicianReviewedBy?: string;
  physicianNotes?: string;
}

export interface TestResult {
  id: string;
  patientId: string;
  testName: string;
  date: string;
  result: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
  clinicalSignificance?: string;
}

export interface ExtractedDocumentData {
  diagnoses: string[];
  medications: Array<{ name: string; dosage: string }>;
  investigations: Array<{ test: string; result: string; unit?: string }>;
  procedures: string[];
  confidenceScore: number;
}

export interface MedicalDocument {
  id: string;
  patientId: string;
  title: string;
  documentType: 'Prescription' | 'Laboratory Report' | 'Discharge Summary' | 'Imaging Report' | 'Previous Consultation';
  documentDate: string;
  fileUrl: string;
  status: 'uploading' | 'processing' | 'processed' | 'verified' | 'error';
  extractedData?: ExtractedDocumentData;
  isVerifiedByPhysician: boolean;
  thumbnailPlaceholder?: string;
}

export interface TimelineEvent {
  id: string;
  patientId: string;
  year: string;
  month: string;
  dateStr: string;
  type: 'investigation' | 'consultation' | 'prescription' | 'discharge' | 'surgery';
  title: string;
  institution: string;
  summary: string;
  documentId?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  patientId?: string;
  actor: string;
  action: string;
  details: string;
}
