import React, { useState, useRef, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Search,
  Bell,
  Calendar,
  RotateCcw,
  Plus,
  UserPlus,
  ClipboardCheck,
  Megaphone,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../common/Button';

export const Header: React.FC = () => {
  const {
    schoolProfile,
    academicYear,
    setAcademicYear,
    announcements,
    setIsSearchModalOpen,
    setIsQuickAttendanceOpen,
    setIsNewAnnouncementOpen,
    setIsNewStudentModalOpen,
    resetDataToDefaults,
  } = useSchool();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const quickMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (quickMenuRef.current && !quickMenuRef.current.contains(e.target as Node)) {
        setIsQuickMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-18 bg-white border-b border-slate-200/80 sticky top-0 z-20 px-6 flex items-center justify-between gap-4">
      {/* Left Area: Search trigger & Affiliation Badge */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="w-full max-w-md flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:bg-slate-100/60 transition-all text-sm cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span className="truncate">Search students, faculty, circulars, classes...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-medium text-slate-500 bg-white border border-slate-200 rounded shadow-2xs">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50/70 border border-blue-100 text-xs text-blue-800 font-medium shrink-0">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span>CBSE Affiliation: {schoolProfile.affiliationNumber}</span>
        </div>
      </div>

      {/* Right Area: Actions, Session selector, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Academic Session Switcher */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-500">Session:</span>
          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="bg-transparent font-semibold text-slate-900 border-none outline-none cursor-pointer pr-1"
          >
            <option value="2025-2026">2025-2026 (Active)</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2026-2027">2026-2027 (Upcoming)</option>
          </select>
        </div>

        {/* Reset Demo State button */}
        <button
          onClick={resetDataToDefaults}
          title="Reset to original CBSE demo data"
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Quick Actions Dropdown */}
        <div className="relative" ref={quickMenuRef}>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsQuickMenuOpen((prev) => !prev)}
          >
            <span className="hidden sm:inline">Quick Action</span>
          </Button>

          {isQuickMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                School Quick Actions
              </div>
              <button
                onClick={() => {
                  setIsQuickMenuOpen(false);
                  setIsQuickAttendanceOpen(true);
                }}
                className="w-full px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
              >
                <ClipboardCheck className="w-4 h-4 text-blue-600" />
                <span>Mark Quick Attendance</span>
              </button>
              <button
                onClick={() => {
                  setIsQuickMenuOpen(false);
                  setIsNewStudentModalOpen(true);
                }}
                className="w-full px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
              >
                <UserPlus className="w-4 h-4 text-emerald-600" />
                <span>New Student Admission</span>
              </button>
              <button
                onClick={() => {
                  setIsQuickMenuOpen(false);
                  setIsNewAnnouncementOpen(true);
                }}
                className="w-full px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
              >
                <Megaphone className="w-4 h-4 text-amber-600" />
                <span>Publish CBSE Circular</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Institutional Notifications & Circulars"
          >
            <Bell className="w-5 h-5" />
            {announcements.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Official Circulars</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {announcements.length} Active
                  </span>
                </div>
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {announcements.slice(0, 4).map((anc) => (
                  <div
                    key={anc.id}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100 text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                        {anc.title}
                      </span>
                      {anc.isUrgent && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 shrink-0">
                          URGENT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {anc.content}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-400">
                      <span>{anc.circularRefNumber || 'School Ref'}</span>
                      <span>{anc.publishedDate}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Synced with CBSE Portal
                </span>
                <button
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    setIsNewAnnouncementOpen(true);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>New Circular</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
