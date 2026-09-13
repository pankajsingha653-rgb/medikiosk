import { useState, useEffect } from 'react';
import {
  Stethoscope,
  Search,
  AlertTriangle,
  Clock,
  RefreshCw,
  ChevronRight,
  User,
  ShieldAlert
} from 'lucide-react';
import { Patient } from '../../types';
import { db } from '../../services/db';

interface PhysicianQueueViewProps {
  onSelectPatient: (patient: Patient) => void;
}

export function PhysicianQueueView({ onSelectPatient }: PhysicianQueueViewProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'priority' | 'waiting' | 'completed'>('all');
  const [deptFilter] = useState<string>('all');

  const reloadData = () => {
    setPatients(db.getPatients());
  };

  useEffect(() => {
    reloadData();
    const unsub = db.subscribe(reloadData);
    return unsub;
  }, []);

  const filteredPatients = patients.filter(p => {
    // Search query matches name, token, id
    const matchSearch =
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;

    // Status filter
    if (statusFilter === 'priority' && !p.isPriority) return false;
    if (statusFilter === 'waiting' && p.status !== 'waiting') return false;
    if (statusFilter === 'completed' && p.status !== 'completed') return false;

    // Dept filter
    if (deptFilter !== 'all' && p.department !== deptFilter) return false;

    return true;
  });

  const priorityCount = patients.filter(p => p.isPriority).length;
  const waitingCount = patients.filter(p => p.status === 'waiting').length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#F3EEFC] flex items-center justify-center text-[#6C3FC5] border border-[#6C3FC5]/20 flex-shrink-0 shadow-xs">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
                  Physician Clinical Workstation
                </h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F3EEFC] text-[#6C3FC5] border border-[#6C3FC5]/20">
                  Room 104 • OPD Block B
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#666666] mt-0.5">
                Dr. Sneha Roy, MD (Internal Medicine) • High-Volume OPD Queue
              </p>
            </div>
          </div>

          {/* Stat Badges */}
          <div className="flex items-center gap-2.5">
            <div className="px-3.5 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-center min-w-[70px]">
              <div className="text-[11px] text-[#666666] font-medium">In Queue</div>
              <div className="text-base sm:text-lg font-bold text-[#171717]">{waitingCount}</div>
            </div>

            <div className="px-3.5 py-2 bg-[#F3EEFC] rounded-xl border border-[#6C3FC5]/20 text-center min-w-[80px]">
              <div className="text-[11px] text-[#6C3FC5] font-bold">Red Flags</div>
              <div className="text-base sm:text-lg font-extrabold text-[#6C3FC5]">{priorityCount}</div>
            </div>

            <button
              type="button"
              onClick={reloadData}
              className="p-2.5 bg-white border border-neutral-200 hover:bg-[#F3EEFC] hover:text-[#6C3FC5] rounded-xl text-[#666666] transition-colors"
              title="Refresh queue"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by token, name, or ID..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6C3FC5]"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold border transition-colors min-h-[36px] ${
              statusFilter === 'all'
                ? 'bg-[#6C3FC5] text-white border-[#6C3FC5]'
                : 'bg-white text-[#666666] border-neutral-200 hover:bg-[#F3EEFC] hover:text-[#6C3FC5]'
            }`}
          >
            All ({patients.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('priority')}
            className={`px-3 py-1.5 rounded-lg font-bold border flex items-center gap-1.5 transition-colors min-h-[36px] ${
              statusFilter === 'priority'
                ? 'bg-[#6C3FC5] text-white border-[#6C3FC5]'
                : 'bg-white text-[#6C3FC5] border-[#6C3FC5]/30 hover:bg-[#F3EEFC]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Priority ({priorityCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('waiting')}
            className={`px-3 py-1.5 rounded-lg font-bold border transition-colors min-h-[36px] ${
              statusFilter === 'waiting'
                ? 'bg-[#6C3FC5] text-white border-[#6C3FC5]'
                : 'bg-white text-[#666666] border-neutral-200 hover:bg-[#F3EEFC] hover:text-[#6C3FC5]'
            }`}
          >
            Waiting ({waitingCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-lg font-bold border transition-colors min-h-[36px] ${
              statusFilter === 'completed'
                ? 'bg-[#6C3FC5] text-white border-[#6C3FC5]'
                : 'bg-white text-[#666666] border-neutral-200 hover:bg-[#F3EEFC] hover:text-[#6C3FC5]'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* MOBILE VIEW: Responsive Patient Cards (< md) */}
      <div className="md:hidden space-y-3">
        {filteredPatients.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center text-[#666666] text-xs">
            No patients match your search or filter.
          </div>
        ) : (
          filteredPatients.map(patient => {
            const cCase = db.getCaseByPatientId(patient.id);
            const isRedFlag = patient.isPriority || cCase?.hasRedFlags;

            return (
              <div
                key={patient.id}
                className={`bg-white rounded-2xl border p-4 shadow-xs space-y-3 transition-all ${
                  isRedFlag
                    ? 'border-[#6C3FC5] ring-1 ring-[#6C3FC5]/30 bg-[#F3EEFC]/20'
                    : 'border-neutral-200'
                }`}
              >
                {/* Top Row: Token & Priority */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-extrabold text-[#171717] bg-[#F3EEFC] px-3 py-1 rounded-xl border border-[#6C3FC5]/20">
                    Token {patient.token}
                  </span>

                  {isRedFlag ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#F3EEFC] text-[#6C3FC5] border border-[#6C3FC5]/40">
                      <ShieldAlert className="w-3.5 h-3.5 text-[#6C3FC5]" />
                      Priority Red Flag
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#666666] font-medium">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      ~{patient.estimatedWaitMinutes || 10} min wait
                    </span>
                  )}
                </div>

                {/* Patient Name & Details */}
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#171717]">
                    {patient.fullName}
                  </h3>
                  <p className="text-xs text-[#666666]">
                    {patient.age}y • {patient.gender} • UHID: {patient.id}
                  </p>
                </div>

                {/* Department & Chief Complaint */}
                <div className="bg-neutral-50 p-2.5 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-medium text-[#171717]">
                    <span>{patient.department}</span>
                    <span className="text-[10px] font-bold capitalize text-[#6C3FC5]">
                      {patient.status.replace('_', ' ')}
                    </span>
                  </div>
                  {cCase?.chiefComplaints?.[0]?.complaint && (
                    <p className="text-[#666666] truncate text-[11px]">
                      Complaint: <strong className="text-[#171717]">{cCase.chiefComplaints[0].complaint}</strong>
                    </p>
                  )}
                </div>

                {/* Action Button: Open Record */}
                <button
                  type="button"
                  onClick={() => onSelectPatient(patient)}
                  className="w-full py-3 bg-[#6C3FC5] hover:bg-[#4B238C] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 active:scale-[0.99] transition-all min-h-[44px]"
                >
                  <span>Open Record</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP VIEW: Full Patient Table (>= md) */}
      <div className="hidden md:block bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F3EEFC]/60 border-b border-neutral-200 text-[#171717] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Token</th>
                <th className="py-3 px-4">Patient Information</th>
                <th className="py-3 px-4">Department / Intake</th>
                <th className="py-3 px-4">Chief Complaint</th>
                <th className="py-3 px-4">Wait Time</th>
                <th className="py-3 px-4">Clinical Priority</th>
                <th className="py-3 px-4">Intake Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#666666]">
                    No patients match your current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPatients.map(patient => {
                  const cCase = db.getCaseByPatientId(patient.id);
                  const isRedFlag = patient.isPriority || cCase?.hasRedFlags;

                  return (
                    <tr
                      key={patient.id}
                      className={`hover:bg-[#F3EEFC]/30 transition-colors ${
                        isRedFlag ? 'bg-[#F3EEFC]/20' : ''
                      }`}
                    >
                      {/* Token */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs font-bold text-[#171717] bg-[#F3EEFC] border border-[#6C3FC5]/20 px-2.5 py-1 rounded-lg">
                          {patient.token}
                        </span>
                      </td>

                      {/* Patient info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#171717] text-sm">{patient.fullName}</div>
                        <div className="text-[#666666] text-[11px]">
                          {patient.age}y / {patient.gender} • ID: {patient.id}
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-[#171717]">{patient.department}</span>
                        {patient.consultationType === 'ayush' && (
                          <span className="block text-[10px] text-[#6C3FC5] font-bold">Ayurveda OPD</span>
                        )}
                      </td>

                      {/* Chief Complaint */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="truncate font-medium text-[#171717]">
                          {cCase?.chiefComplaints?.[0]?.complaint || 'Pending intake completion'}
                        </div>
                        {cCase?.chiefComplaints?.[0]?.duration && (
                          <div className="text-[10px] text-[#666666]">
                            Duration: {cCase.chiefComplaints[0].duration} • Sev: {cCase.chiefComplaints[0].severity}/10
                          </div>
                        )}
                      </td>

                      {/* Wait Time */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-[#666666] font-medium">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" />
                          <span>~{patient.estimatedWaitMinutes || 10} min</span>
                        </div>
                      </td>

                      {/* Red-flag Priority Indicator */}
                      <td className="py-3.5 px-4">
                        {isRedFlag ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#F3EEFC] text-[#6C3FC5] border border-[#6C3FC5]/30">
                            <AlertTriangle className="w-3.5 h-3.5 text-[#6C3FC5]" />
                            Red Flag
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium text-[#666666] bg-neutral-100">
                            Standard
                          </span>
                        )}
                      </td>

                      {/* Intake Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-bold capitalize ${
                            patient.status === 'completed'
                              ? 'bg-neutral-100 text-[#666666] border border-neutral-200'
                              : patient.status === 'in_consultation'
                              ? 'bg-[#6C3FC5] text-white'
                              : 'bg-[#F3EEFC] text-[#6C3FC5] border border-[#6C3FC5]/20'
                          }`}
                        >
                          {patient.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => onSelectPatient(patient)}
                          className="px-3.5 py-1.5 bg-[#6C3FC5] hover:bg-[#4B238C] text-white font-bold rounded-lg shadow-xs inline-flex items-center gap-1 text-xs transition-colors"
                        >
                          <span>Open Record</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
