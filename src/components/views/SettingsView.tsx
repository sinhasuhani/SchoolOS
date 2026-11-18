import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Building2, RotateCcw, Calendar, Check, Info } from 'lucide-react';
import { Button } from '../common/Button';

export const SettingsView: React.FC = () => {
  const {
    schoolProfile,
    academicYear,
    setAcademicYear,
    setIsSchoolProfileModalOpen,
    resetDataToDefaults,
    requestConfirm,
  } = useSchool();

  const handleReset = () => {
    requestConfirm({
      title: 'Reset All Data to Factory Defaults?',
      message: 'This will reset all students, faculty members, class allocations, exam marks, and attendance history back to the original consistent demo dataset. Any custom records created in localStorage will be cleared.',
      confirmText: 'Restore Defaults',
      variant: 'danger',
      onConfirm: resetDataToDefaults,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
        <h2 className="text-xl font-bold text-slate-900">Institutional Configuration & Settings</h2>
        <p className="text-xs text-slate-500 mt-1">
          School parameters, active academic calendar session, and persistent storage management
        </p>
      </div>

      {/* Demo notice pill */}
      <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200/70 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <span className="font-bold">Simulated Institutional Dataset:</span> SchoolOS uses an internally consistent demo environment representing a CBSE-pattern school. All data is cached in your browser&apos;s localStorage without requiring external server dependencies.
        </div>
      </div>

      {/* School Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{schoolProfile.name}</h3>
              <p className="text-xs text-slate-500">{schoolProfile.board}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSchoolProfileModalOpen(true)}
          >
            Edit School Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400">Affiliation Reference Number:</span>
            <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">
              {schoolProfile.affiliationNumber}
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400">Institutional School Code:</span>
            <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">
              {schoolProfile.schoolCode}
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400">Principal:</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{schoolProfile.principalName}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400">Vice Principal:</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {schoolProfile.vicePrincipalName}
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 sm:col-span-2">
            <span className="text-slate-400">Campus Address:</span>
            <p className="text-sm font-medium text-slate-900 mt-0.5">
              {schoolProfile.address}, {schoolProfile.city}, {schoolProfile.state} -{' '}
              {schoolProfile.pinCode}
            </p>
          </div>
        </div>
      </div>

      {/* Academic Session Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          Active Academic Session
        </h3>
        <p className="text-xs text-slate-500">
          The active session controls current enrollment filters and report headings.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {['2025-2026', '2024-2025', '2026-2027'].map((year) => {
            const isActive = academicYear === year;
            return (
              <button
                key={year}
                onClick={() => setAcademicYear(year)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Session {year}</span>
                  {isActive && <Check className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {isActive ? 'Currently Active' : 'Switch Session'}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset & Storage info */}
      <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-2xs space-y-3">
        <h3 className="text-base font-bold text-rose-900 flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-rose-600" />
          Reset Demo Data
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Restore the initial consistent fictional dataset with Modern Vidya Niketan metadata, student roster, faculty roster, and sample evaluations.
        </p>
        <div className="pt-2">
          <Button
            variant="danger"
            size="sm"
            onClick={handleReset}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            Reset All Data to Demo Defaults
          </Button>
        </div>
      </div>
    </div>
  );
};
