import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { X, Check, Users, Save, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';
import { Student } from '../../types';

export const QuickAttendanceModal: React.FC = () => {
  const {
    isQuickAttendanceOpen,
    setIsQuickAttendanceOpen,
    students,
    classes,
    markClassAttendanceSession,
    addToast,
  } = useSchool();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'CLS-10A');
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  // Get students of selected class
  const classStudents = students.filter(
    (s) => s.class === selectedClass?.grade && s.section === selectedClass?.section
  );

  const [localStatuses, setLocalStatuses] = useState<Record<string, Student['attendanceStatus']>>({});

  if (!isQuickAttendanceOpen) return null;

  const getStatus = (student: Student) => {
    return localStatuses[student.id] || student.attendanceStatus;
  };

  const handleToggle = (studentId: string, current: Student['attendanceStatus']) => {
    const nextStatus: Record<Student['attendanceStatus'], Student['attendanceStatus']> = {
      Present: 'Absent',
      Absent: 'Late',
      Late: 'Leave',
      Leave: 'Present',
    };
    setLocalStatuses((prev) => ({
      ...prev,
      [studentId]: nextStatus[current],
    }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, Student['attendanceStatus']> = {};
    classStudents.forEach((s) => {
      updated[s.id] = 'Present';
    });
    setLocalStatuses(updated);
    addToast('info', 'Batch Updated', `Marked all students in ${selectedClass?.name} as Present.`);
  };

  const handleSaveAttendance = () => {
    if (!selectedClass) return;

    const studentRecords = classStudents.map((s) => ({
      studentId: s.id,
      status: getStatus(s),
    }));

    markClassAttendanceSession(
      selectedClass.id,
      attendanceDate,
      studentRecords,
      selectedClass.classTeacher || 'Class Teacher'
    );

    setIsQuickAttendanceOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Mark Daily Attendance Session</h3>
              <p className="text-xs text-slate-500">Record daily class roll call & update student logs</p>
            </div>
          </div>
          <button
            onClick={() => setIsQuickAttendanceOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Class Section
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => {
                  setSelectedClassId(e.target.value);
                  setLocalStatuses({});
                }}
                className="w-full font-bold text-sm text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    Class {cls.name} ({cls.wing})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Attendance Date
              </label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full font-bold text-sm text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Enrolled Students ({classStudents.length})
            </span>
            <Button
              variant="outline"
              size="sm"
              icon={<Check className="w-3.5 h-3.5" />}
              onClick={handleMarkAllPresent}
            >
              Mark All Present
            </Button>
          </div>

          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-60 overflow-y-auto">
            {classStudents.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No students enrolled in this section. Add students or choose another section.
              </div>
            ) : (
              classStudents.map((student) => {
                const status = getStatus(student);
                const statusColor = {
                  Present: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
                  Absent: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
                  Late: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
                  Leave: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100',
                };

                return (
                  <div
                    key={student.id}
                    className="flex items-center justify-between px-3.5 py-2.5 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-xs font-mono text-slate-400">
                        #{student.rollNo}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{student.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{student.admissionNo}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggle(student.id, status)}
                      className={`text-xs font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${statusColor[status]}`}
                    >
                      {status}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Saves permanently to attendance history</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsQuickAttendanceOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Save className="w-3.5 h-3.5" />}
              onClick={handleSaveAttendance}
            >
              Record Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
