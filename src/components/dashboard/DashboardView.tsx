import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { StatOverview } from './StatOverview';
import { QuickActionsBar } from './QuickActionsBar';
import { AttendanceTrendChart } from './AttendanceTrendChart';
import { ClassDistributionChart } from './ClassDistributionChart';
import { TodayScheduleWidget } from './TodayScheduleWidget';
import { RecentAnnouncementsWidget } from './RecentAnnouncementsWidget';
import { RecentAdmissionsTable } from './RecentAdmissionsTable';
import { ShieldCheck, Calendar, Bell, Sparkles } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { schoolProfile, academicYear } = useSchool();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Institutional Welcome & Hero Bar */}
      <div className="bg-gradient-to-r from-[#0F1D33] via-[#142644] to-[#1E3A63] rounded-2xl p-6 text-white shadow-md border border-[#233D6B] relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/40 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                Affiliation #{schoolProfile.affiliationNumber} • Code: {schoolProfile.schoolCode}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30">
                Simulated Demo Institution
              </span>
              <span className="text-xs text-slate-300">
                Session {academicYear}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {schoolProfile.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Executive Institutional Command Center • Principal: {schoolProfile.principalName}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-right">
              <div className="text-[11px] text-slate-300 font-medium">Campus Operational Mode</div>
              <div className="text-sm font-bold text-white flex items-center gap-2 justify-end mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Full Session Regular
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Commands */}
      <QuickActionsBar />

      {/* KPI Stat Cards */}
      <StatOverview />

      {/* Charts Grid: Attendance Trends & Student Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceTrendChart />
        <ClassDistributionChart />
      </div>

      {/* Live Operational Widgets: Today's Schedule & Official Circulars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayScheduleWidget />
        <RecentAnnouncementsWidget />
      </div>

      {/* Interactive Student Directory Table */}
      <RecentAdmissionsTable />
    </div>
  );
};
