import { useState } from 'react';
import { UserCheck, UserPlus, Search, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, CheckCircle } from 'lucide-react';
import { Patient, LanguageCode } from '../../types';
import { db } from '../../services/db';

export interface PatientIdentViewProps {
  currentPatient?: Patient;
  onPatientIdentified: (patient: Patient) => void;
  onBack: () => void;
  demoPatients?: Patient[];
  language?: LanguageCode;
}

export function PatientIdentView({
  currentPatient,
  onPatientIdentified,
  onBack,
  demoPatients,
  language = 'hi'
}: PatientIdentViewProps) {
  const patientList = demoPatients || db.getPatients();
  const effectivePatient = currentPatient || patientList[0];
  const [mode, setMode] = useState<'existing' | 'new'>('existing');

  // Existing patient search state
  const [searchId, setSearchId] = useState('');
  const [searchAbha, setSearchAbha] = useState('');
  const [selectedDemoId, setSelectedDemoId] = useState(effectivePatient.id || 'P-10241');
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);

  // New patient registration form state
  const [formData, setFormData] = useState({
    fullName: effectivePatient.fullName || '',
    age: effectivePatient.age ? String(effectivePatient.age) : '45',
    gender: effectivePatient.gender || 'Male',
    phone: effectivePatient.phone || '+91 98765 43210',
    city: effectivePatient.city || 'New Delhi',
    department: effectivePatient.department || 'General Medicine'
  });

  const handleDemoSelect = (p: Patient) => {
    setSelectedDemoId(p.id);
    setSearchId(p.id);
    setSearchAbha(p.abhaId || '');
    setLookupMessage(`Found record for ${p.fullName} (${p.token}, ${p.department})`);
  };

  const handleContinue = () => {
    if (mode === 'existing') {
      const target = patientList.find(p => p.id === selectedDemoId) || patientList[0];
      onPatientIdentified(target);
    } else {
      // New patient
      const newPatient: Patient = {
        id: `P-${Math.floor(10000 + Math.random() * 90000)}`,
        token: `T-${Math.floor(10 + Math.random() * 90)}`,
        abhaId: searchAbha || `91-0000-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        fullName: formData.fullName.trim() || 'New Patient',
        age: parseInt(formData.age, 10) || 35,
        gender: formData.gender as any,
        phone: formData.phone.trim() || '+91 98000 00000',
        city: formData.city.trim() || 'General OPD',
        language,
        consultationType: 'modern',
        department: formData.department,
        isRegisteredNew: true,
        status: 'waiting',
        isPriority: false,
        counterNumber: 'Counter 02',
        estimatedWaitMinutes: 15,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      onPatientIdentified(newPatient);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Progress Bar (Step 2 of 5) */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-[#666666] mb-2">
          <span className="text-[#6C3FC5] font-bold">Step 2 of 5: Patient Identification</span>
          <span>Estimated total time: 8–12 minutes</span>
        </div>
        <div className="w-full bg-[#F3EEFC] h-2 rounded-full overflow-hidden">
          <div className="bg-[#6C3FC5] h-full rounded-full transition-all duration-300 w-[40%]" />
        </div>
      </div>

      {/* Screen Title */}
      <div className="text-center space-y-2 mb-6 sm:mb-8">
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#171717] tracking-tight">
          Let's find your patient record
        </h2>
        <p className="text-xs sm:text-sm text-[#666666]">
          Enter your Patient ID, ABHA number, or register as a first-time visitor.
        </p>
      </div>

      {/* Mode Switch Tabs */}
      <div className="flex rounded-xl border border-neutral-200 p-1 bg-[#F3EEFC]/70 max-w-md mx-auto mb-6 sm:mb-8">
        <button
          type="button"
          onClick={() => setMode('existing')}
          className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all min-h-[44px] ${
            mode === 'existing'
              ? 'bg-white text-[#6C3FC5] shadow-xs'
              : 'text-[#666666] hover:text-[#171717]'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Existing Patient</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('new')}
          className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all min-h-[44px] ${
            mode === 'new'
              ? 'bg-white text-[#6C3FC5] shadow-xs'
              : 'text-[#666666] hover:text-[#171717]'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>New Patient</span>
        </button>
      </div>

      {/* Mode Content */}
      {mode === 'existing' ? (
        <div className="space-y-6">
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-neutral-200 shadow-xs space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Patient ID */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#171717] mb-1.5">
                  Hospital Patient ID / UHID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchId}
                    onChange={e => setSearchId(e.target.value)}
                    placeholder="e.g. P-10241"
                    className="w-full pl-3.5 pr-10 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#6C3FC5] focus:border-[#6C3FC5] text-sm sm:text-base"
                  />
                  <Search className="w-5 h-5 text-neutral-400 absolute right-3 top-3.5" />
                </div>
                <span className="text-[11px] text-[#666666] mt-1 block">Printed on your hospital registration card.</span>
              </div>

              {/* ABHA ID */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs sm:text-sm font-bold text-[#171717]">
                    ABHA / Ayushman Bharat Account
                  </label>
                  <span className="text-[10px] font-semibold text-[#6C3FC5] bg-[#F3EEFC] px-2 py-0.5 rounded border border-[#6C3FC5]/20">
                    ABDM Enabled
                  </span>
                </div>
                <input
                  type="text"
                  value={searchAbha}
                  onChange={e => setSearchAbha(e.target.value)}
                  placeholder="e.g. 91-4829-1024-5512"
                  className="w-full px-3.5 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#6C3FC5] text-sm sm:text-base font-mono"
                />
                <span className="text-[11px] text-[#666666] mt-1 block">Aadhaar / ABHA placeholder for hospital record linking.</span>
              </div>
            </div>

            {/* Quick Demo Pickers */}
            <div className="pt-3 border-t border-neutral-100">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#6C3FC5]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                  Select a Demonstration Record (Click to test):
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {patientList.map(p => {
                  const isSelected = selectedDemoId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleDemoSelect(p)}
                      className={`p-3 text-left rounded-xl border text-xs transition-all ${
                        isSelected
                          ? 'border-[#6C3FC5] bg-[#F3EEFC]/60 ring-1 ring-[#6C3FC5]'
                          : 'border-neutral-200 hover:border-[#6C3FC5]/40 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-[#171717] mb-0.5">
                        <span className="truncate">{p.fullName}</span>
                        <span className="text-[#6C3FC5] font-mono text-[11px] ml-1">{p.token}</span>
                      </div>
                      <div className="text-[#666666] text-[11px]">{p.age} yrs • {p.gender}</div>
                      <div className="text-[#171717] font-medium truncate mt-1 text-[11px]">{p.department}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {lookupMessage && (
              <div className="p-3 bg-[#F3EEFC] border border-[#6C3FC5]/20 rounded-xl text-xs font-medium text-[#171717] flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#6C3FC5] flex-shrink-0" />
                <span>{lookupMessage}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* New Patient Registration Form */
        <div className="bg-white p-5 sm:p-7 rounded-2xl border border-neutral-200 shadow-xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#171717] mb-1.5">
                Patient Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter patient full name"
                className="w-full px-3.5 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#6C3FC5] text-sm sm:text-base"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#171717] mb-1.5">
                  Age (Years) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={e => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#6C3FC5] text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#171717] mb-1.5">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#6C3FC5] text-sm sm:text-base bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#171717] mb-1.5">
                Contact Mobile Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#6C3FC5] text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#171717] mb-1.5">
                City / Village of Residence
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. New Delhi"
                className="w-full px-3.5 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#6C3FC5] text-sm sm:text-base"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs sm:text-sm font-bold text-[#171717] mb-1.5">
                OPD Department
              </label>
              <select
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#6C3FC5] text-sm sm:text-base bg-white"
              >
                <option value="General Medicine">General Medicine</option>
                <option value="Cardiology / Acute Medicine">Cardiology / Acute Medicine</option>
                <option value="Pulmonology / Chest Clinic">Pulmonology / Chest Clinic</option>
                <option value="General Surgery">General Surgery</option>
                <option value="Neurology OPD">Neurology OPD</option>
                <option value="Endocrinology & Diabetology">Endocrinology & Diabetology</option>
                <option value="AYUSH / Kayachikitsa OPD">AYUSH / Kayachikitsa (Ayurveda) OPD</option>
                <option value="Geriatric Medicine">Geriatric Medicine</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Safety / Compliance Note */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#666666] text-center">
        <ShieldCheck className="w-4 h-4 text-[#6C3FC5] flex-shrink-0" />
        <span>In compliance with clinical privacy: No real biometric data is collected on this kiosk.</span>
      </div>

      {/* Bottom Navigation */}
      <div className="mt-8 flex items-center justify-between gap-3 pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={onBack}
          className="px-5 sm:px-6 py-3 bg-white border border-neutral-200 hover:bg-[#F3EEFC] hover:text-[#6C3FC5] text-[#171717] font-semibold rounded-xl flex items-center gap-2 transition-colors min-h-[48px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className="px-7 sm:px-8 py-3 bg-[#6C3FC5] hover:bg-[#4B238C] text-white font-bold text-sm sm:text-base rounded-xl shadow-xs flex items-center gap-2 transition-all active:scale-[0.99] min-h-[48px]"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
