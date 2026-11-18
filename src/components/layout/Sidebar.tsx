import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { NavigationTab } from '../../types';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  BookOpen,
  FileSpreadsheet,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    schoolProfile,
    dashboardStats,
    setIsSchoolProfileModalOpen,
  } = useSchool();

  const navItems: {
    id: NavigationTab;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Admin Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'students',
      label: 'Students & Admissions',
      icon: GraduationCap,
      badge: dashboardStats.totalStudents,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      id: 'staff',
      label: 'Faculty & Roster',
      icon: Users,
      badge: `${dashboardStats.totalTeachers} Staff`,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'attendance',
      label: 'Attendance Register',
      icon: CalendarCheck,
      badge: `${dashboardStats.todayStudentAttendancePercentage}%`,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'classes',
      label: 'Academics & Wings',
      icon: BookOpen,
      badge: `${dashboardStats.totalClassSections} Sec`,
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'examinations',
      label: 'Examinations & CBSE',
      icon: FileSpreadsheet,
      badge: 'Active',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'circulars',
      label: 'Circulars & Notices',
      icon: Bell,
      badge: dashboardStats.activeCircularsCount,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      id: 'settings',
      label: 'School Configuration',
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-[#0B1528] text-slate-300 border-r border-[#17253D] transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-18 flex items-center justify-between px-4 border-b border-[#182640] shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-900/30 shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-white tracking-tight">SchoolOS</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  CBSE
                </span>
              </div>
              <span className="text-[11px] text-slate-400 truncate">
                Affiliation #{schoolProfile.affiliationNumber}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#15233c] transition-colors cursor-pointer"
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* School Name Pill Banner (When expanded) */}
      {!isSidebarCollapsed && (
        <div className="px-4 py-3 mx-3 my-2 rounded-xl bg-[#101F38] border border-[#1C2F52] flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{schoolProfile.name}</p>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
              <span>Code: {schoolProfile.schoolCode}</span>
              <span>•</span>
              <span className="text-emerald-400">Affiliated</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {!isSidebarCollapsed ? 'Core Management' : '•••'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-700/40 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-[#13223B]'
              }`}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                }`}
              />
              {!isSidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                        isActive
                          ? 'bg-white/20 text-white border-white/30'
                          : item.badgeColor || 'bg-slate-700/50 text-slate-300 border-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Offline-First Demo Cache Indicator */}
      {!isSidebarCollapsed && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Simulated CBSE Demo</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Persistent browser localStorage active. Sample data for demonstration & testing.
          </p>
        </div>
      )}

      {/* Admin Profile Footer */}
      <div className="p-3 border-t border-[#182640] shrink-0 bg-[#08101E]">
        <button
          onClick={() => setIsSchoolProfileModalOpen(true)}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[#13223B] transition-colors cursor-pointer text-left"
          title="Click to view & edit CBSE school profile"
        >
          <div className="w-9 h-9 rounded-full bg-blue-700/80 border border-blue-400/40 flex items-center justify-center text-white font-semibold text-xs shrink-0 shadow-sm">
            AS
          </div>
          {!isSidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Dr. Anandita Sen</p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="truncate">Principal & Admin</span>
              </div>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
