import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  ClipboardCheck,
  UserPlus,
  Users,
  FileSpreadsheet,
  Download,
  RotateCcw,
} from 'lucide-react';

export const QuickActionsBar: React.FC = () => {
  const {
    setIsQuickAttendanceOpen,
    setIsNewStudentModalOpen,
    setIsNewStaffModalOpen,
    setIsNewExamModalOpen,
    exportStudentsCSV,
    resetDataToDefaults,
    requestConfirm,
  } = useSchool();

  const handleReset = () => {
    requestConfirm({
      title: 'Restore Default Demo Data?',
      message: 'This will reset all students, teachers, classes, exams, and attendance records back to the original consistent demo dataset. Any custom records created in localStorage will be replaced.',
      confirmText: 'Reset Demo Data',
      variant: 'danger',
      onConfirm: resetDataToDefaults,
    });
  };

  const actions = [
    {
      label: 'Mark Attendance',
      sublabel: 'Class-wise roll call',
      icon: ClipboardCheck,
      color: 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200/80',
      onClick: () => setIsQuickAttendanceOpen(true),
    },
    {
      label: 'New Student Admission',
      sublabel: 'Enrol pupil into registry',
      icon: UserPlus,
      color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200/80',
      onClick: () => setIsNewStudentModalOpen(true),
    },
    {
      label: 'Add Faculty Member',
      sublabel: 'Appoint teacher to roster',
      icon: Users,
      color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-indigo-200/80',
      onClick: () => setIsNewStaffModalOpen(true),
    },
    {
      label: 'Schedule Examination',
      sublabel: 'Create assessment test',
      icon: FileSpreadsheet,
      color: 'text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-200/80',
      onClick: () => setIsNewExamModalOpen(true),
    },
    {
      label: 'Download Students CSV',
      sublabel: 'Export master directory',
      icon: Download,
      color: 'text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200/80',
      onClick: exportStudentsCSV,
    },
    {
      label: 'Restore Demo Data',
      sublabel: 'Factory reset storage',
      icon: RotateCcw,
      color: 'text-rose-600 bg-rose-50 hover:bg-rose-100 border-rose-200/80',
      onClick: handleReset,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
      <div className="flex items-center justify-between mb-3 px-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Executive Administrative Actions
        </h4>
        <span className="text-[11px] text-slate-400">All actions persist automatically in local storage</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((act, index) => {
          const Icon = act.icon;
          return (
            <button
              key={index}
              onClick={act.onClick}
              className={`p-3 rounded-xl border flex flex-col items-start gap-2 transition-all duration-150 cursor-pointer text-left group hover:scale-[1.02] shadow-2xs hover:shadow-xs ${act.color}`}
            >
              <div className="p-2 rounded-lg bg-white/80 shadow-2xs shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">{act.label}</p>
                <p className="text-[11px] opacity-75 mt-0.5 truncate">{act.sublabel}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
