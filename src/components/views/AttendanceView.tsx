import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { ClipboardCheck, Download, Calendar, Users, History, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const AttendanceView: React.FC = () => {
  const {
    classes,
    students,
    attendanceSessions,
    updateStudentAttendance,
    markClassAttendanceSession,
    setIsQuickAttendanceOpen,
    exportAttendanceReportCSV,
  } = useSchool();

  const [activeSubTab, setActiveSubTab] = useState<'register' | 'history'>('register');
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'CLS-10A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter(
    (s) => s.class === selectedClass?.grade && s.section === selectedClass?.section
  );

  const presentCount = classStudents.filter((s) => s.attendanceStatus === 'Present').length;
  const absentCount = classStudents.filter((s) => s.attendanceStatus === 'Absent').length;
  const leaveCount = classStudents.filter(
    (s) => s.attendanceStatus === 'Leave' || s.attendanceStatus === 'Late'
  ).length;

  const handleMarkAll = () => {
    const studentRecords = classStudents.map((s) => ({
      studentId: s.id,
      status: 'Present' as const,
    }));
    markClassAttendanceSession(
      selectedClass.id,
      selectedDate,
      studentRecords,
      selectedClass.classTeacher || 'Class Teacher'
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Attendance Register & Audit</h2>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveSubTab('register')}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeSubTab === 'register'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Daily Roll Call
              </button>
              <button
                onClick={() => setActiveSubTab('history')}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeSubTab === 'history'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Session History ({attendanceSessions.length})
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Section-wise presence records, historical session audits & CBSE 75% eligibility compliance
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={exportAttendanceReportCSV}
          >
            Download CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<ClipboardCheck className="w-4 h-4" />}
            onClick={() => setIsQuickAttendanceOpen(true)}
          >
            Take Attendance
          </Button>
        </div>
      </div>

      {activeSubTab === 'register' ? (
        <>
          {/* Class Selector & Stat Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Class Section
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full text-sm font-bold text-slate-900 border border-slate-200 rounded-xl p-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    Class {cls.name} ({cls.wing})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-2 truncate">
                Teacher: {selectedClass?.classTeacher}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Enrolled Strength
              </span>
              <div className="text-2xl font-bold text-slate-900">{classStudents.length} Students</div>
              <p className="text-[11px] text-slate-400 mt-1">
                {selectedClass?.boysCount} Boys · {selectedClass?.girlsCount} Girls
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Present Today
              </span>
              <div className="text-2xl font-bold text-emerald-600">{presentCount} Present</div>
              <p className="text-[11px] text-emerald-600/80 mt-1">
                {classStudents.length > 0 ? Math.round((presentCount / classStudents.length) * 100) : 0}% Roll Call
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Absent & Leaves
              </span>
              <div className="text-2xl font-bold text-rose-600">{absentCount} Absent</div>
              <p className="text-[11px] text-amber-600 mt-1">{leaveCount} On Leave / Late</p>
            </div>
          </div>

          {/* Roster Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Attendance Sheet: Class {selectedClass?.name} ({selectedClass?.roomNumber})
                </h3>
                <span className="text-xs text-slate-400">
                  Class Teacher: {selectedClass?.classTeacher}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAll}
                >
                  Mark All Present
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Roll No</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Admission ID</th>
                    <th className="py-3 px-4 text-center">Eligibility Rate</th>
                    <th className="py-3 px-4 text-center">Status Today</th>
                    <th className="py-3 px-4 text-right">Cycle Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No students enrolled in Class {selectedClass?.name}. Use the Student Admission form to enroll pupils.
                      </td>
                    </tr>
                  ) : (
                    classStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-700 font-mono">#{st.rollNo}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{st.name}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{st.admissionNo}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`font-bold ${
                              st.attendanceRate < 75 ? 'text-rose-600' : 'text-slate-800'
                            }`}
                          >
                            {st.attendanceRate}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                            variant={
                              st.attendanceStatus === 'Present'
                                ? 'success'
                                : st.attendanceStatus === 'Absent'
                                ? 'danger'
                                : 'warning'
                            }
                            size="sm"
                            dot
                          >
                            {st.attendanceStatus}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              const next: Record<any, any> = {
                                Present: 'Absent',
                                Absent: 'Late',
                                Late: 'Leave',
                                Leave: 'Present',
                              };
                              updateStudentAttendance(st.id, next[st.attendanceStatus]);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline cursor-pointer"
                          >
                            Toggle
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Attendance History Sessions View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Historical Attendance Sessions</h3>
              <p className="text-xs text-slate-500">Audit trail of submitted class registers</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {attendanceSessions.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No past attendance sessions recorded. Take attendance using &ldquo;Take Attendance&rdquo; to begin logging history.
              </div>
            ) : (
              attendanceSessions.map((session) => (
                <div key={session.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {session.className}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            Class {session.className} Session
                          </h4>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {session.date}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Marked by {session.markedBy} • {session.totalStudents} Students Recorded
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-right">
                        <span className="font-bold text-slate-900">
                          {session.attendancePercentage}% Present
                        </span>
                        <p className="text-[11px] text-slate-400">
                          {session.presentCount} Present · {session.absentCount} Absent
                        </p>
                      </div>

                      <Badge
                        variant={session.attendancePercentage >= 80 ? 'success' : 'warning'}
                        size="sm"
                      >
                        {session.attendancePercentage >= 80 ? 'Good Presence' : 'Review Required'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
