import { LanguageCode, SocratesHistory, ExtractedDocumentData } from '../types';

// Speech synthesis and recognition abstraction
export class AudioService {
  private static synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static recognition: any = null;

  public static speak(text: string, lang: LanguageCode = 'en'): void {
    if (!this.synth) return;
    try {
      this.synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      switch (lang) {
        case 'hi':
          utterance.lang = 'hi-IN';
          break;
        case 'bn':
          utterance.lang = 'bn-IN';
          break;
        case 'ne':
          utterance.lang = 'ne-NP';
          break;
        default:
          utterance.lang = 'en-IN';
          break;
      }
      utterance.rate = 0.95;
      this.synth.speak(utterance);
    } catch {
      // Audio fallback silent
    }
  }

  public static stopSpeaking(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public static isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as any;
    return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
  }

  public static startListening(
    lang: LanguageCode,
    onResult: (text: string) => void,
    onError: (err: any) => void
  ): () => void {
    if (typeof window === 'undefined') return () => {};
    const win = window as any;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      // Fallback simulation: simulated voice input after 2.5s
      const timer = setTimeout(() => {
        const fallbacks: Record<LanguageCode, string> = {
          en: 'I have severe chest discomfort since 6 in the morning with heavy sweating.',
          hi: 'मुझे सुबह से सीने में बहुत भारी दर्द और पसीना आ रहा है।',
          bn: 'আমার সকাল থেকে বুকে খুব ব্যথা এবং অস্বস্তি হচ্ছে।',
          ne: 'मलाई बिहानदेखि छातीमा धेरै दुखाइ र असजिलो महसुस भइरहेको छ।'
        };
        onResult(fallbacks[lang] || fallbacks.en);
      }, 2500);
      return () => clearTimeout(timer);
    }

    try {
      const rec = new SpeechRecognitionClass();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = lang === 'hi' ? 'hi-IN' : lang === 'bn' ? 'bn-IN' : lang === 'ne' ? 'ne-NP' : 'en-IN';

      rec.onresult = (e: any) => {
        const transcript = e.results[0][0]?.transcript;
        if (transcript) {
          onResult(transcript);
        }
      };
      rec.onerror = (e: any) => {
        onError(e);
      };
      rec.start();
      return () => {
        try {
          rec.stop();
        } catch {}
      };
    } catch (e) {
      onError(e);
      return () => {};
    }
  }
}

// AI Clinical Processing Service Abstraction
export class ClinicalAiService {
  // Red flag detection logic (safety rules)
  public static checkRedFlags(complaint: string, socrates?: Partial<SocratesHistory>): { hasRedFlag: boolean; reason?: string } {
    const text = (complaint + ' ' + (socrates?.radiation || '') + ' ' + (socrates?.associations?.join(' ') || '')).toLowerCase();

    if (
      text.includes('chest pain') ||
      text.includes('chest discomfort') ||
      text.includes('crushing') ||
      text.includes('heart attack') ||
      text.includes('सीने में दर्द') ||
      text.includes('বুকে ব্যথা') ||
      (socrates?.severityScore && socrates.severityScore >= 8 && socrates?.site?.toLowerCase().includes('chest'))
    ) {
      return {
        hasRedFlag: true,
        reason: 'Potential Acute Coronary Syndrome (ACS) or Severe Cardiac Ischemia indicator. Requires immediate triage review.'
      };
    }

    if (
      text.includes('breathing difficulty') ||
      text.includes('shortness of breath') ||
      text.includes('cannot breathe') ||
      text.includes('gasping') ||
      text.includes('सांस लेने में तकलीफ')
    ) {
      return {
        hasRedFlag: true,
        reason: 'Severe respiratory distress suspected. Requires immediate oxygen saturation and triage check.'
      };
    }

    if (
      text.includes('sudden weakness') ||
      text.includes('difficulty speaking') ||
      text.includes('slurred speech') ||
      text.includes('facial drooping') ||
      text.includes('loss of consciousness') ||
      text.includes('fainted')
    ) {
      return {
        hasRedFlag: true,
        reason: 'Acute focal neurological deficit or syncope indicator (FAST Stroke warning). Immediate clinical attention required.'
      };
    }

    return { hasRedFlag: false };
  }

  // Simulated OCR & Clinical Entity Extraction (with realistic multi-step parsing)
  public static async simulateOcrExtraction(documentType: string, filename: string): Promise<ExtractedDocumentData> {
    await new Promise(res => setTimeout(res, 2200));

    if (documentType === 'Prescription') {
      return {
        diagnoses: ['Essential Hypertension (Stage 1)', 'Mild Dyslipidemia'],
        medications: [
          { name: 'Tab Telmisartan', dosage: '40 mg OD morning' },
          { name: 'Tab Atorvastatin', dosage: '10 mg HS bedtime' }
        ],
        investigations: [
          { test: 'Serum Creatinine', result: '1.02', unit: 'mg/dL' },
          { test: 'Lipid Profile', result: 'Total Cholesterol 228', unit: 'mg/dL' }
        ],
        procedures: ['Advised BP monitoring log'],
        confidenceScore: 95
      };
    } else if (documentType === 'Laboratory Report') {
      return {
        diagnoses: ['Platelet count reduction / Suspected viral thrombopathy'],
        medications: [],
        investigations: [
          { test: 'Platelet Count', result: '62,000', unit: '/mcL (Low)' },
          { test: 'Hemoglobin', result: '11.8', unit: 'g/dL' },
          { test: 'Total WBC', result: '3,800', unit: '/cumm' }
        ],
        procedures: ['Complete Blood Count (Automated Analyzer)'],
        confidenceScore: 97
      };
    } else if (documentType === 'Discharge Summary') {
      return {
        diagnoses: ['Acute Appendicitis (Resolved)', 'Post-operative Day 5'],
        medications: [
          { name: 'Tab Cefuroxime Axetil', dosage: '500 mg BD x 5 days' },
          { name: 'Tab Pantoprazole', dosage: '40 mg OD before breakfast' }
        ],
        investigations: [
          { test: 'Ultrasound Abdomen', result: 'Inflamed tubular structure in RIF', unit: '' }
        ],
        procedures: ['Laparoscopic Appendectomy under GA'],
        confidenceScore: 92
      };
    } else {
      return {
        diagnoses: ['Clinical review required'],
        medications: [
          { name: 'Tab Paracetamol', dosage: '650 mg SOS' }
        ],
        investigations: [
          { test: 'Blood Pressure', result: '136/84', unit: 'mmHg' }
        ],
        procedures: ['Routine Vital Check'],
        confidenceScore: 89
      };
    }
  }
}
