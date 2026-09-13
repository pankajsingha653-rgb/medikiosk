import { Calendar, FileText, Activity, Stethoscope, Pill } from 'lucide-react';
import { TimelineEvent } from '../../types';

interface TimelineViewProps {
  events: TimelineEvent[];
  onSelectEvent?: (event: TimelineEvent) => void;
}

export function TimelineView({ events, onSelectEvent }: TimelineViewProps) {
  if (events.length === 0) {
    return (
      <div className="p-8 text-center bg-white border border-neutral-200 rounded-lg text-neutral-500 text-sm">
        No medical timeline events recorded yet. Uploaded prescriptions and consultations will appear chronologically here.
      </div>
    );
  }

  // Group events by year
  const grouped = events.reduce((acc, ev) => {
    const y = ev.year || '2026';
    if (!acc[y]) acc[y] = [];
    acc[y].push(ev);
    return acc;
  }, {} as Record<string, TimelineEvent[]>);

  const years = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6">
      {years.map(year => (
        <div key={year} className="relative">
          {/* Year Marker Header */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base font-extrabold text-neutral-900 bg-neutral-100 border border-neutral-300 px-3 py-1 rounded-md">
              {year}
            </span>
            <div className="h-px bg-neutral-200 flex-1" />
          </div>

          {/* Timeline Items */}
          <div className="relative pl-6 space-y-4 border-l-2 border-neutral-200 ml-4">
            {grouped[year].map(ev => {
              const icon =
                ev.type === 'investigation' ? (
                  <Activity className="w-4 h-4 text-[#6C3FC5]" />
                ) : ev.type === 'prescription' ? (
                  <Pill className="w-4 h-4 text-[#6C3FC5]" />
                ) : (
                  <Stethoscope className="w-4 h-4 text-[#6C3FC5]" />
                );

              return (
                <div
                  key={ev.id}
                  onClick={() => onSelectEvent && onSelectEvent(ev)}
                  className="relative group bg-white border border-neutral-200 rounded-lg p-4 shadow-2xs hover:border-[#6C3FC5] cursor-pointer transition-colors"
                >
                  {/* Left Circle Node on Line */}
                  <div className="absolute -left-[31px] top-4 w-4 h-4 rounded-full bg-white border-2 border-[#6C3FC5] flex items-center justify-center shadow-2xs" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-neutral-100 flex items-center justify-center flex-shrink-0">
                        {icon}
                      </div>
                      <span className="font-bold text-neutral-900 text-sm">{ev.title}</span>
                    </div>
                    <span className="text-xs text-neutral-500 font-medium">
                      {ev.dateStr}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-600 pl-8">
                    <span className="font-semibold text-neutral-700">{ev.institution}</span>: {ev.summary}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
