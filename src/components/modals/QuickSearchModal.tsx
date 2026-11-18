import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Search, X, GraduationCap, Users, BookOpen, Bell, ArrowRight, FileSpreadsheet } from 'lucide-react';
import { Badge } from '../common/Badge';

export const QuickSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    students,
    staff,
    classes,
    announcements,
    exams,
    setActiveTab,
  } = useSchool();

  const [query, setQuery] = useState('');

  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      return {
        students: students.slice(0, 3),
        staff: staff.slice(0, 3),
        classes: classes.slice(0, 3),
        announcements: announcements.slice(0, 2),
        exams: exams.slice(0, 2),
      };
    }

    const q = query.toLowerCase();

    return {
      students: students.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.admissionNo.toLowerCase().includes(q) ||
          `class ${s.class} ${s.section}`.toLowerCase().includes(q)
      ),
      staff: staff.filter(
        (st) =>
          st.name.toLowerCase().includes(q) ||
          st.designation.toLowerCase().includes(q) ||
          st.department.toLowerCase().includes(q) ||
          st.employeeCode.toLowerCase().includes(q)
      ),
      classes: classes.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.wing.toLowerCase().includes(q) ||
          c.classTeacher.toLowerCase().includes(q)
      ),
      announcements: announcements.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q) ||
          a.circularRefNumber?.toLowerCase().includes(q)
      ),
      exams: exams.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.examType.toLowerCase().includes(q) ||
          e.classes.some((c) => c.toLowerCase().includes(q))
      ),
    };
  }, [query, students, staff, classes, announcements, exams]);

  if (!isSearchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Type student name, admission ID, teacher, class, circular or exam..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-slate-900 text-sm placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="text-xs font-medium text-slate-400 hover:text-slate-700 px-2 py-1 bg-white border border-slate-200 rounded-md cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {/* Students Section */}
          {filteredResults.students.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                  Students ({filteredResults.students.length})
                </span>
                <button
                  onClick={() => {
                    setIsSearchModalOpen(false);
                    setActiveTab('students');
                  }}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  View All Students <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1">
                {filteredResults.students.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => {
                      setIsSearchModalOpen(false);
                      setActiveTab('students');
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-semibold text-xs flex items-center justify-center">
                        {student.rollNo}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {student.name}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2">
                          <span>
                            Class {student.class}-{student.section}
                          </span>
                          <span>•</span>
                          <span className="font-mono">{student.admissionNo}</span>
                          {student.stream && student.stream !== 'General' && (
                            <>
                              <span>•</span>
                              <span className="text-blue-600">{student.stream}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        student.attendanceStatus === 'Present'
                          ? 'success'
                          : student.attendanceStatus === 'Absent'
                          ? 'danger'
                          : 'warning'
                      }
                      size="sm"
                      dot
                    >
                      {student.attendanceStatus}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Staff Section */}
          {filteredResults.staff.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  Faculty & Staff ({filteredResults.staff.length})
                </span>
                <button
                  onClick={() => {
                    setIsSearchModalOpen(false);
                    setActiveTab('staff');
                  }}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  View All Faculty <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1">
                {filteredResults.staff.map((teacher) => (
                  <div
                    key={teacher.id}
                    onClick={() => {
                      setIsSearchModalOpen(false);
                      setActiveTab('staff');
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-all group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {teacher.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {teacher.designation} • {teacher.department}
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {teacher.employeeCode}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exams Section */}
          {filteredResults.exams.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                <span className="flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
                  Examinations ({filteredResults.exams.length})
                </span>
                <button
                  onClick={() => {
                    setIsSearchModalOpen(false);
                    setActiveTab('examinations');
                  }}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  Assessment Cell <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1">
                {filteredResults.exams.map((ex) => (
                  <div
                    key={ex.id}
                    onClick={() => {
                      setIsSearchModalOpen(false);
                      setActiveTab('examinations');
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-all"
                  >
                    <div className="text-xs font-semibold text-slate-900 line-clamp-1">
                      {ex.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {ex.examType} • Classes: {ex.classes.join(', ')} • {ex.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Circulars Section */}
          {filteredResults.announcements.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                <span className="flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-rose-600" />
                  Notices & Circulars ({filteredResults.announcements.length})
                </span>
                <button
                  onClick={() => {
                    setIsSearchModalOpen(false);
                    setActiveTab('circulars');
                  }}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  Noticeboard <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1">
                {filteredResults.announcements.map((anc) => (
                  <div
                    key={anc.id}
                    onClick={() => {
                      setIsSearchModalOpen(false);
                      setActiveTab('circulars');
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-all"
                  >
                    <div className="text-xs font-semibold text-slate-900 line-clamp-1">
                      {anc.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {anc.circularRefNumber || 'School Ref'} • {anc.publishedDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredResults.students.length === 0 &&
            filteredResults.staff.length === 0 &&
            filteredResults.exams.length === 0 &&
            filteredResults.announcements.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm">
                No matching institutional records found for &ldquo;{query}&rdquo;.
              </div>
            )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border rounded">↑↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border rounded">↵</kbd> Select
            </span>
          </div>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
