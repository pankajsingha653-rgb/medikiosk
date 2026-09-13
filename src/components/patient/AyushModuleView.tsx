import { useState } from 'react';
import { Flower2, ArrowRight, ArrowLeft, Shield } from 'lucide-react';
import { AyushAssessment, Patient } from '../../types';
import { db } from '../../services/db';

interface AyushModuleViewProps {
  patient: Patient;
  initialAssessment?: AyushAssessment;
  onSave: (assessment: AyushAssessment) => void;
  onBack: () => void;
}

export function AyushModuleView({
  patient,
  initialAssessment,
  onSave,
  onBack
}: AyushModuleViewProps) {
  const [assessment, setAssessment] = useState<AyushAssessment>(
    initialAssessment || {
      id: `ayush-${Date.now()}`,
      patientId: patient.id,
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
      ahara: 'Viruddha ahara, Guru, Sheeta, Dadhi consumption',
      vihara: 'Diwaswapna (day sleeping), sedentary desk job',
      nidana: 'Aharaja (unwholesome diet) and Viharaja (lack of movement)',
      sampraptiSummary: 'Ama produced due to Agnimandya gets carried by aggravated Vata to Kapha sthana (joints) causing pain and swelling.'
    }
  );

  const handleSave = () => {
    // Update active clinical case
    const c = db.getCaseByPatientId(patient.id);
    if (c) {
      c.ayushAssessment = assessment;
      db.saveCase(c);
    }
    onSave(assessment);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm mb-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-md bg-neutral-100 flex items-center justify-center text-[#6C3FC5] border border-neutral-200 flex-shrink-0">
          <Flower2 className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-neutral-900">
              AYUSH & Ayurveda Clinical Assessment
            </h2>
            <span className="text-xs font-bold text-[#6C3FC5] bg-neutral-100 px-2.5 py-0.5 rounded border border-neutral-200">
              Dashavidha Pariksha
            </span>
          </div>
          <p className="text-sm text-neutral-600 mt-1">
            Structured Ayurvedic intake data for Kayachikitsa. Note: MediKiosk does not generate autonomous Ayurvedic diagnoses; all data assists the Vaidya/physician.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm space-y-6">
        {/* Section A: Dashavidha Pariksha Grid */}
        <div>
          <h3 className="text-base font-bold text-neutral-900 pb-2 border-b border-neutral-200 mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6C3FC5]" />
            1. Dashavidha Pariksha (10-fold Assessment)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Prakriti */}
            <div>
              <label className="block font-bold text-neutral-800 mb-1">
                Prakriti (Body Constitution):
              </label>
              <select
                value={assessment.prakriti}
                onChange={e => setAssessment({ ...assessment, prakriti: e.target.value as any })}
                className="w-full p-2.5 border border-neutral-300 rounded bg-white text-xs"
              >
                <option value="Vata">Vata</option>
                <option value="Pitta">Pitta</option>
                <option value="Kapha">Kapha</option>
                <option value="Vata-Pitta">Vata-Pitta</option>
                <option value="Pitta-Kapha">Pitta-Kapha</option>
                <option value="Vata-Kapha">Vata-Kapha</option>
                <option value="Tridoshaja">Tridoshaja (Sannipata)</option>
              </select>
            </div>

            {/* Vikriti */}
            <div>
              <label className="block font-bold text-neutral-800 mb-1">
                Vikriti (Current Morbidity State):
              </label>
              <input
                type="text"
                value={assessment.vikriti}
                onChange={e => setAssessment({ ...assessment, vikriti: e.target.value })}
                className="w-full p-2.5 border border-neutral-300 rounded text-xs"
              />
            </div>

            {/* Sara */}
            <div>
              <label className="block font-bold text-neutral-800 mb-1">
                Sara (Tissue Excellence):
              </label>
              <select
                value={assessment.sara}
                onChange={e => setAssessment({ ...assessment, sara: e.target.value as any })}
                className="w-full p-2.5 border border-neutral-300 rounded bg-white text-xs"
              >
                <option value="Pravara">Pravara (Superior / High Vitality)</option>
                <option value="Madhyama">Madhyama (Moderate / Medium)</option>
                <option value="Avara">Avara (Inferior / Poor)</option>
              </select>
            </div>

            {/* Samhanana */}
            <div>
              <label className="block font-bold text-neutral-800 mb-1">
                Samhanana (Body Compactness):
              </label>
              <select
                value={assessment.samhanana}
                onChange={e => setAssessment({ ...assessment, samhanana: e.target.value as any })}
                className="w-full p-2.5 border border-neutral-300 rounded bg-white text-xs"
              >
                <option value="Susamhata (Compact)">Susamhata (Well-built / Compact)</option>
                <option value="Madhyama (Moderate)">Madhyama (Moderate)</option>
                <option value="Heena (Poor)">Heena (Weak / Loose)</option>
              </select>
            </div>

            {/* Pramana */}
            <div>
              <label className="block font-bold text-neutral-800 mb-1">
                Pramana (Body Anthropometry):
              </label>
              <select
                value={assessment.pramana}
                onChange={e => setAssessment({ ...assessment, pramana: e.target.value as any })}
                className="w-full p-2.5 border border-neutral-300 rounded bg-white text-xs"
              >
                <option value="Madhyama (Proportionate)">Madhyama (Proportionate)</option>
                <option value="Ati-Sthula (Obese)">Ati-Sthula (Obese / Heavy)</option>
                <option value="Ati-Krisha (Emaciated)">Ati-Krisha (Emaciated / Thin)</option>
              </select>
            </div>

            {/* Satmya */}
            <div>
              <label className="block font-bold text-neutral-800 mb-1">
                Satmya (Adaptability / Suitability):
              </label>
              <select
                value={assessment.satmya}
                onChange={e => setAssessment({ ...assessment, satmya: e.target.value as any })}
                className="w-full p-2.5 border border-neutral-300 rounded bg-white text-xs"
              >
                <option value="Sarva Rasa Satmya">Sarva Rasa Satmya (All 6 tastes habituated)</option>
                <option value="Vyayamadi Satmya">Vyayamadi Satmya (Exercise habituated)</option>
                <option value="Eka Rasa Satmya">Eka Rasa Satmya (Specific taste habituated)</option>
              </select>
            </div>

            {/* Sattva */}
            <div>
              <label className="block font-bold text-neutral-800 mb-1">
                Sattva (Mental Endurance / Strength):
              </label>
              <select
                value={assessment.sattva}
                onChange={e => setAssessment({ ...assessment, sattva: e.target.value as any })}
                className="w-full p-2.5 border border-neutral-300 rounded bg-white text-xs"
              >
                <option value="Pravara (High Mental Strength)">Pravara (High Mental Strength)</option>
                <option value="Madhyama (Moderate)">Madhyama (Moderate)</option>
                <option value="Avara (Weak)">Avara (Weak Mental Tolerance)</option>
              </select>
            </div>

            {/* Ahara Shakti */}
            <div>
              <label className="block font-bold text-neutral-800 mb-1">
                Ahara Shakti (Digestive Capacity):
              </label>
              <select
                value={assessment.aharaShakti}
                onChange={e => setAssessment({ ...assessment, aharaShakti: e.target.value as any })}
                className="w-full p-2.5 border border-neutral-300 rounded bg-white text-xs"
              >
                <option value="Abhyavaharana Shakti Uttama">Abhyavaharana Shakti Uttama (High intake & digestion)</option>
                <option value="Madhyama">Madhyama (Moderate)</option>
                <option value="Manda (Low Intake & Digestion)">Manda (Low Intake & Slow Digestion)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section B: Agni, Koshtha, Nidana, Samprapti */}
        <div className="pt-2">
          <h3 className="text-base font-bold text-neutral-900 pb-2 border-b border-neutral-200 mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6C3FC5]" />
            2. Agni, Koshtha & Etiology (Nidana - Samprapti)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-neutral-800 mb-1">
                Agni (Digestive Fire):
              </label>
              <select
                value={assessment.agni}
                onChange={e => setAssessment({ ...assessment, agni: e.target.value as any })}
                className="w-full p-2.5 border border-neutral-300 rounded bg-white text-xs"
              >
                <option value="Mandagni">Mandagni (Sluggish / Low metabolism)</option>
                <option value="Vishamagni">Vishamagni (Irregular / Variable)</option>
                <option value="Tikshnagni">Tikshnagni (Hyper-intense / Acidity)</option>
                <option value="Samagni">Samagni (Balanced)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1">
                Koshtha (Bowel Habit):
              </label>
              <select
                value={assessment.koshtha}
                onChange={e => setAssessment({ ...assessment, koshtha: e.target.value as any })}
                className="w-full p-2.5 border border-neutral-300 rounded bg-white text-xs"
              >
                <option value="Krura">Krura (Constipated / Hard stools)</option>
                <option value="Madhyama">Madhyama (Regular / Normal)</option>
                <option value="Mrida">Mrida (Soft / Tendency to loose motions)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-neutral-800 mb-1">
                Ahara & Vihara Patterns (Dietary & Lifestyle factors):
              </label>
              <input
                type="text"
                value={assessment.ahara}
                onChange={e => setAssessment({ ...assessment, ahara: e.target.value })}
                className="w-full p-2.5 border border-neutral-300 rounded text-xs mb-2"
                placeholder="Dietary triggers..."
              />
              <input
                type="text"
                value={assessment.vihara}
                onChange={e => setAssessment({ ...assessment, vihara: e.target.value })}
                className="w-full p-2.5 border border-neutral-300 rounded text-xs"
                placeholder="Lifestyle habits..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-neutral-800 mb-1">
                Samprapti Ghataka Summary (Pathogenesis Note for Vaidya):
              </label>
              <textarea
                rows={2}
                value={assessment.sampraptiSummary}
                onChange={e => setAssessment({ ...assessment, sampraptiSummary: e.target.value })}
                className="w-full p-2.5 border border-neutral-300 rounded text-xs"
              />
            </div>
          </div>
        </div>

        <div className="p-3 bg-neutral-50 rounded border border-neutral-200 text-xs text-neutral-600 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#6C3FC5] flex-shrink-0" />
          <span>Ayurvedic clinical details will be appended directly into the doctor's consultation view.</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-4 pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-semibold rounded-md flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="px-8 py-3.5 bg-[#6C3FC5] hover:bg-[#4B238C] text-white font-bold text-base rounded-md shadow-sm flex items-center gap-2 active:scale-[0.99]"
        >
          <span>Save AYUSH Assessment</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
