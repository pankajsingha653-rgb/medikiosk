import { useState } from 'react';
import { ArrowRightLeft, AlertTriangle } from 'lucide-react';
import { Patient, ClinicalCase } from '../../types';

interface MedicationReconProps {
  patient?: Patient;
  clinicalCase?: ClinicalCase;
  reportedMeds?: any[];
  documents?: any[];
}

interface ReconRow {
  id: string;
  name: string;
  patientDose: string;
  docDose: string;
  docSource: string;
  status: 'matched' | 'interaction_alert' | 'duplicate_warning';
  interactionNote?: string;
  decision: 'continue' | 'modify' | 'discontinue';
}

export function MedicationReconView(_props: MedicationReconProps) {
  const [rows, setRows] = useState<ReconRow[]>([
    {
      id: 'm1',
      name: 'Telmisartan 40mg',
      patientDose: '1 tablet once daily (morning)',
      docDose: 'Tab. Telmisartan 40mg OD',
      docSource: 'Govt Hospital OPD Card (2024-08-12)',
      status: 'matched',
      decision: 'continue'
    },
    {
      id: 'm2',
      name: 'Amlodipine 5mg',
      patientDose: '1 tablet daily (evening)',
      docDose: 'Tab. Amlodipine 5mg OD HS',
      docSource: 'Discharge Summary (Apollo/Max 2023)',
      status: 'matched',
      decision: 'continue'
    },
    {
      id: 'm3',
      name: 'Metformin 500mg',
      patientDose: '1 tab twice daily with meals',
      docDose: 'Not found in uploaded papers (patient self-reported)',
      docSource: 'Self-reported at kiosk intake',
      status: 'duplicate_warning',
      interactionNote: 'Check Serum Creatinine and eGFR before confirming dosage',
      decision: 'modify'
    },
    {
      id: 'm4',
      name: 'Aspirin 75mg + Clopidogrel 75mg',
      patientDose: 'None currently reported',
      docDose: 'Tab. Ecosprin-AV 75/20',
      docSource: 'Old prescription slip from 2022',
      status: 'interaction_alert',
      interactionNote: 'Potential antiplatelet therapy indicated given acute chest pain symptoms today',
      decision: 'modify'
    }
  ]);

  const handleDecisionChange = (id: string, newDecision: 'continue' | 'modify' | 'discontinue') => {
    setRows(rows.map(r => (r.id === id ? { ...r, decision: newDecision } : r)));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#171717] flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-[#6C3FC5]" />
            Medication Reconciliation & Cross-Verification
          </h3>
          <p className="text-xs text-[#666666] mt-0.5">
            Cross-checking patient-reported medications against extracted prescription documents and known drug interactions.
          </p>
        </div>
      </div>

      {/* Warnings & Alerts */}
      <div className="p-3.5 bg-[#F3EEFC]/60 border border-[#6C3FC5]/20 rounded-xl text-xs text-[#171717] flex items-center gap-2.5">
        <AlertTriangle className="w-4 h-4 text-[#6C3FC5] flex-shrink-0" />
        <span>
          <strong>2 reconciliation advisories detected.</strong> Telmisartan and Amlodipine confirmed in legacy records; Metformin self-reported without prior prescription scan.
        </span>
      </div>

      {/* MOBILE VIEW: Cards (< md) */}
      <div className="md:hidden space-y-3">
        {rows.map(row => (
          <div
            key={row.id}
            className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-sm text-[#171717]">{row.name}</h4>
                <div className="text-[11px] text-[#666666] mt-0.5">
                  Reported: <strong className="text-[#171717]">{row.patientDose}</strong>
                </div>
              </div>

              {row.status === 'interaction_alert' ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F3EEFC] text-[#6C3FC5] border border-[#6C3FC5]/30">
                  Alert
                </span>
              ) : row.status === 'duplicate_warning' ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-[#171717] border border-neutral-200">
                  Verify Lab
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F3EEFC] text-[#6C3FC5]">
                  Matched
                </span>
              )}
            </div>

            <div className="text-[11px] bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
              <span className="text-[#666666] block">Document: {row.docDose}</span>
              <span className="text-neutral-400 block text-[10px] mt-0.5">{row.docSource}</span>
            </div>

            {row.interactionNote && (
              <div className="text-[11px] text-[#6C3FC5] font-medium bg-[#F3EEFC]/50 p-2 rounded-lg border border-[#6C3FC5]/20">
                ⚠ {row.interactionNote}
              </div>
            )}

            {/* Decision button group */}
            <div className="pt-2 border-t border-neutral-100">
              <div className="text-[11px] font-bold text-[#171717] mb-1.5">Action:</div>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleDecisionChange(row.id, 'continue')}
                  className={`py-2 rounded-lg font-bold text-xs transition-colors min-h-[36px] ${
                    row.decision === 'continue'
                      ? 'bg-[#6C3FC5] text-white shadow-xs'
                      : 'bg-neutral-100 text-[#666666] hover:bg-neutral-200'
                  }`}
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={() => handleDecisionChange(row.id, 'modify')}
                  className={`py-2 rounded-lg font-bold text-xs transition-colors min-h-[36px] ${
                    row.decision === 'modify'
                      ? 'bg-[#171717] text-white shadow-xs'
                      : 'bg-neutral-100 text-[#666666] hover:bg-neutral-200'
                  }`}
                >
                  Modify
                </button>
                <button
                  type="button"
                  onClick={() => handleDecisionChange(row.id, 'discontinue')}
                  className={`py-2 rounded-lg font-bold text-xs transition-colors min-h-[36px] ${
                    row.decision === 'discontinue'
                      ? 'bg-neutral-300 text-[#171717] font-black'
                      : 'bg-neutral-100 text-[#666666] hover:bg-neutral-200'
                  }`}
                >
                  Stop
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP VIEW: Table (>= md) */}
      <div className="hidden md:block bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F3EEFC]/60 border-b border-neutral-200 text-[#171717] font-bold uppercase text-[11px]">
                <th className="py-3 px-4">Medication</th>
                <th className="py-3 px-4">Patient Reported</th>
                <th className="py-3 px-4">Legacy Record / OCR</th>
                <th className="py-3 px-4">Reconciliation Status</th>
                <th className="py-3 px-4 text-right">Physician Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map(row => (
                <tr key={row.id} className="hover:bg-[#F3EEFC]/20">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#171717] text-sm">{row.name}</div>
                    {row.interactionNote && (
                      <div className="text-[11px] text-[#6C3FC5] mt-1 font-medium">
                        ⚠ {row.interactionNote}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-medium text-[#171717]">
                    {row.patientDose}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-[#171717]">{row.docDose}</div>
                    <div className="text-[10px] text-[#666666]">{row.docSource}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    {row.status === 'interaction_alert' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F3EEFC] text-[#6C3FC5] border border-[#6C3FC5]/30">
                        Caution Alert
                      </span>
                    ) : row.status === 'duplicate_warning' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-100 text-[#171717] border border-neutral-200">
                        Verify Renal Labs
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F3EEFC] text-[#6C3FC5] border border-[#6C3FC5]/20">
                        Matched in OCR
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex rounded-xl shadow-xs border border-neutral-200 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => handleDecisionChange(row.id, 'continue')}
                        className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                          row.decision === 'continue'
                            ? 'bg-[#6C3FC5] text-white'
                            : 'bg-white text-[#666666] hover:bg-[#F3EEFC] hover:text-[#6C3FC5]'
                        }`}
                      >
                        Continue
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDecisionChange(row.id, 'modify')}
                        className={`px-3 py-1.5 text-xs font-bold border-l border-neutral-200 transition-colors ${
                          row.decision === 'modify'
                            ? 'bg-[#171717] text-white'
                            : 'bg-white text-[#666666] hover:bg-neutral-100'
                        }`}
                      >
                        Modify
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDecisionChange(row.id, 'discontinue')}
                        className={`px-3 py-1.5 text-xs font-bold border-l border-neutral-200 transition-colors ${
                          row.decision === 'discontinue'
                            ? 'bg-neutral-200 text-[#171717] font-black'
                            : 'bg-white text-[#666666] hover:bg-neutral-100'
                        }`}
                      >
                        Stop
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
