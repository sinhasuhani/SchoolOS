import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Clock, UserCheck, AlertCircle, ArrowRight, UserPlus, Check } from 'lucide-react';
import { Badge } from '../common/Badge';

export const TodayScheduleWidget: React.FC = () => {
  const { periods, staff, updatePeriodSubstitution, setActiveTab } = useSchool();
  const [activeSubstitutePeriodId, setActiveSubstitutePeriodId] = useState<string | null>(null);
  const [selectedSubstitute, setSelectedSubstitute] = useState<string>(staff[0]?.name || '');

  const handleAssignSubstitution = (periodId: string) => {
    if (!selectedSubstitute) return;
    updatePeriodSubstitution(periodId, selectedSubstitute);
    setActiveSubstitutePeriodId(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Today&apos;s Live Timetable</h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            CBSE 8-Period Daily Bell Schedule • Real-time substitutions
          </p>
        </div>

        <button
          onClick={() => setActiveTab('classes')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
        >
          <span>All Classes</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Schedule Items */}
      <div className="mt-3 divide-y divide-slate-100 overflow-y-auto flex-1 pr-1 max-h-96">
        {periods.map((period) => {
          const isAssigning = activeSubstitutePeriodId === period.id;

          return (
            <div
              key={period.id}
              className={`py-3 transition-colors ${
                period.status === 'In Progress' ? 'bg-blue-50/40 -mx-2 px-2 rounded-xl' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center shrink-0 text-xs font-bold ${
                      period.status === 'In Progress'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : period.status === 'Completed'
                        ? 'bg-slate-100 text-slate-500'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    <span>P{period.periodNumber}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{period.subject}</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        Class {period.classSection}
                      </span>
                      {period.isSubstitution && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5" />
                          Substituted
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {period.timeSlot}
                      </span>
                      <span>•</span>
                      <span className="text-slate-700 font-medium">{period.roomNumber}</span>
                    </div>

                    <p className="text-xs text-slate-600 mt-0.5">
                      Teacher: <span className="font-semibold text-slate-800">{period.teacherName}</span>
                      {period.substitutedBy && (
                        <span className="text-[11px] text-amber-600 block sm:inline sm:ml-1">
                          ({period.substitutedBy})
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <Badge
                    variant={
                      period.status === 'In Progress'
                        ? 'primary'
                        : period.status === 'Completed'
                        ? 'neutral'
                        : 'info'
                    }
                    size="sm"
                  >
                    {period.status}
                  </Badge>

                  {/* Substitution Trigger Button */}
                  {!isAssigning ? (
                    <button
                      onClick={() => {
                        setActiveSubstitutePeriodId(period.id);
                        setSelectedSubstitute(staff[0]?.name || '');
                      }}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer flex items-center gap-1 mt-1"
                      title="Assign a substitute teacher for this period"
                    >
                      <UserPlus className="w-3 h-3" />
                      Substitute
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Inline Substitution Selector */}
              {isAssigning && (
                <div className="mt-3 p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 animate-in fade-in duration-150">
                  <span className="text-xs font-bold text-amber-900 block mb-1">
                    Assign Substitute Faculty for Period {period.periodNumber}:
                  </span>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedSubstitute}
                      onChange={(e) => setSelectedSubstitute(e.target.value)}
                      className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      {staff
                        .filter((s) => s.status === 'Present')
                        .map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name} ({s.department})
                          </option>
                        ))}
                    </select>
                    <button
                      onClick={() => handleAssignSubstitution(period.id)}
                      className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Assign
                    </button>
                    <button
                      onClick={() => setActiveSubstitutePeriodId(null)}
                      className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
          Period bell synchronized with school master chime
        </span>
        <span className="font-mono text-[11px]">Period 4 Next</span>
      </div>
    </div>
  );
};
