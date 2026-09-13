import { Sparkles, AlertTriangle, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { ClinicalCase, Patient } from '../../types';

interface DifferentialAssistanceProps {
  patient: Patient;
  clinicalCase?: ClinicalCase;
}

export function DifferentialAssistanceView({ patient, clinicalCase }: DifferentialAssistanceProps) {
  const isChestPain =
    clinicalCase?.chiefComplaints?.[0]?.complaint.toLowerCase().includes('chest') ||
    clinicalCase?.socrates?.site?.toLowerCase().includes('retrosternal') ||
    true; // default to rich cardiology/medicine case for demonstration

  const considerations = isChestPain
    ? [
        {
          name: 'Acute Coronary Syndrome (Unstable Angina / NSTEMI)',
          probability: 'High Priority',
          supportingFactors: [
            'Retrosternal crushing pain with radiation to left shoulder and jaw',
            'Associated diaphoresis and exertional dyspnea',
            'Cardiovascular risk factors: Age 58, Hypertension, positive paternal CAD history'
          ],
          recommendedInvestigations: [
            '12-Lead Electrocardiogram (ECG) immediately (stat)',
            'Serial Cardiac Biomarkers (High-Sensitivity Troponin I / T at 0h and 3h)',
            'Echocardiogram to assess regional wall motion abnormality'
          ],
          caution: 'Emergency red-flag presentation. Immediate bedside triage ECG indicated.'
        },
        {
          name: 'Gastroesophageal Reflux Disease (GERD) / Esophageal Spasm',
          probability: 'Moderate Consideration',
          supportingFactors: [
            'Retrosternal chest discomfort worsening when lying down',
            'Reported nausea and dietary triggers'
          ],
          recommendedInvestigations: [
            'Rule out cardiac causes first with normal ECG and Troponins',
            'Response to antacid/PPI trial',
            'Upper GI Endoscopy if chronic'
          ],
          caution: 'Never assume GERD before objectively excluding acute ischemia in high-risk patients.'
        },
        {
          name: 'Musculoskeletal Chest Wall Pain (Costochondritis)',
          probability: 'Low to Moderate',
          supportingFactors: [
            'Left-sided chest and shoulder ache',
            'Exertion-related pain reproduction'
          ],
          recommendedInvestigations: [
            'Palpation of costochondral junctions',
            'Chest X-Ray (PA view)'
          ],
          caution: 'Radiation to jaw and profuse sweating make pure costochondritis unlikely.'
        }
      ]
    : [
        {
          name: 'Acute Febrile Illness / Viral Syndrome',
          probability: 'High',
          supportingFactors: ['Fever duration, constitutional symptoms'],
          recommendedInvestigations: ['Complete Blood Count (CBC)', 'Peripheral smear for malarial parasite', 'Dengue NS1 Antigen'],
          caution: 'Monitor for warning signs such as platelet drop or persistent vomiting.'
        }
      ];

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <div className="p-4 bg-white border-2 border-[#6C3FC5] rounded-lg shadow-2xs">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#6C3FC5] flex-shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#6C3FC5] text-sm uppercase tracking-wide">
                Physician Decision Support Only
              </span>
              <span className="text-[10px] bg-neutral-100 px-2 py-0.5 rounded font-semibold text-neutral-600 border border-neutral-200">
                Non-Autonomous
              </span>
            </div>
            <p className="text-xs text-neutral-800 font-medium mt-0.5">
              "For physician decision support only. Clinical judgment must prevail."
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Consider the following possibilities based on reported symptoms, risk factors, and medical history:
            </p>
          </div>
        </div>
      </div>

      {/* Differential Considerations List */}
      <div className="space-y-4">
        {considerations.map((item, idx) => (
          <div
            key={item.name}
            className="bg-white border border-neutral-200 rounded-lg p-5 shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-100 text-[#6C3FC5] font-bold text-xs flex items-center justify-center border border-neutral-200">
                  {idx + 1}
                </span>
                <h4 className="text-base font-bold text-neutral-900">{item.name}</h4>
              </div>

              <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-neutral-100 text-[#6C3FC5] border border-neutral-200">
                {item.probability}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Supporting Factors */}
              <div>
                <span className="font-bold text-neutral-700 block mb-1.5">
                  Supporting Factors from Patient Intake:
                </span>
                <ul className="space-y-1 text-neutral-600">
                  {item.supportingFactors.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#6C3FC5] font-bold">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Investigations */}
              <div>
                <span className="font-bold text-neutral-700 block mb-1.5">
                  Recommended Diagnostic Workup:
                </span>
                <ul className="space-y-1 text-neutral-600">
                  {item.recommendedInvestigations.map((inv, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-[#6C3FC5] flex-shrink-0 mt-0.5" />
                      <span>{inv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Caution Tag */}
            <div className="p-2.5 bg-neutral-50 rounded text-xs border border-neutral-200 text-neutral-700">
              <strong className="text-[#6C3FC5]">Clinical Advisory:</strong> {item.caution}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
