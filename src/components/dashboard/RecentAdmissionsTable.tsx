import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Student } from '../../types';
import { Search, Filter, ExternalLink, Download, Edit3, Trash2, UserCheck } from 'lucide-react';
import { Badge } from '../common/Badge';
import { StudentDetailModal } from '../modals/StudentDetailModal';

export const RecentAdmissionsTable: React.FC = () => {
  const {
    students,
    updateStudentAttendance,
    exportStudentsCSV,
    setActiveTab,
    setEditingStudent,
    deleteStudent,
    requestConfirm,
  } = useSchool();

  const [filterWing, setFilterWing] = useState<string>('All');
  const [filterGender, setFilterGender] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const wings: string[] = [
    'All',
    'Primary (I-V)',
    'Middle (VI-VIII)',
    'Secondary (IX-X)',
    'Senior Secondary (XI-XII)',
  ];

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesWing = filterWing === 'All' || s.wing === filterWing;
      const matchesGender = filterGender === 'All' || s.gender === filterGender;
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        s.name.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q) ||
        s.fatherName.toLowerCase().includes(q) ||
        `class ${s.class}`.toLowerCase().includes(q) ||
        `roll ${s.rollNo}`.toLowerCase().includes(q);
      return matchesWing && matchesGender && matchesSearch;
    });
  }, [students, filterWing, filterGender, searchTerm]);

  const toggleStudentStatus = (e: React.MouseEvent, student: Student) => {
    e.stopPropagation();
    const cycle: Record<Student['attendanceStatus'], Student['attendanceStatus']> = {
      Present: 'Absent',
      Absent: 'Late',
      Late: 'Leave',
      Leave: 'Present',
    };
    updateStudentAttendance(student.id, cycle[student.attendanceStatus]);
  };

  const handleDelete = (e: React.MouseEvent, student: Student) => {
    e.stopPropagation();
    requestConfirm({
      title: `Delete Student Record: ${student.name}?`,
      message: `Are you sure you want to delete ${student.name} (${student.admissionNo}) from Class ${student.class}-${student.section}?`,
      confirmText: 'Delete Student',
      variant: 'danger',
      onConfirm: () => deleteStudent(student.id),
    });
  };

  const handleEdit = (e: React.MouseEvent, student: Student) => {
    e.stopPropagation();
    setEditingStudent(student);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      {/* Table Header and Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Student Enrolment & Attendance Directory</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {filteredStudents.length} Students
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional candidate records with roll call status & contact dossiers
          </p>
        </div>

        {/* Search, Filter, and Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick search input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by name, admission no, roll..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
            />
          </div>

          {/* Wing Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterWing}
              onChange={(e) => setFilterWing(e.target.value)}
              className="text-xs py-1.5 px-2 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:outline-none"
            >
              {wings.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="text-xs py-1.5 px-2 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:outline-none"
          >
            <option value="All">All Genders</option>
            <option value="Male">Boys</option>
            <option value="Female">Girls</option>
          </select>

          {/* Export CSV */}
          <button
            onClick={exportStudentsCSV}
            title="Download student master directory CSV"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Student & Roll</th>
              <th className="py-3 px-4">Class & Stream</th>
              <th className="py-3 px-4">Admission ID</th>
              <th className="py-3 px-4">Guardian Contact</th>
              <th className="py-3 px-4 text-center">Attendance Rate</th>
              <th className="py-3 px-4 text-center">Today&apos;s Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  No students found matching your search or filter criteria.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => {
                const statusBadgeVariant = {
                  Present: 'success',
                  Absent: 'danger',
                  Late: 'warning',
                  Leave: 'info',
                } as const;

                return (
                  <tr
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                  >
                    {/* Student Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-700 font-bold text-xs flex items-center justify-center transition-colors shrink-0 font-mono">
                          {student.rollNo}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {student.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {student.gender} • House: {student.house}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Class & Stream */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">
                        Class {student.class}-{student.section}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {student.stream && student.stream !== 'General' ? (
                          <span className="text-blue-600 font-medium">{student.stream}</span>
                        ) : (
                          student.wing
                        )}
                      </div>
                    </td>

                    {/* Admission ID */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-slate-800 font-medium">{student.admissionNo}</div>
                      <div className="text-[10px] text-slate-400">
                        Cat: {student.category}
                      </div>
                    </td>

                    {/* Guardian & Phone */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{student.fatherName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{student.contactNumber}</div>
                    </td>

                    {/* Attendance Rate */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 font-bold text-slate-800">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            student.attendanceRate >= 95
                              ? 'bg-emerald-500'
                              : student.attendanceRate >= 75
                              ? 'bg-blue-500'
                              : 'bg-rose-500'
                          }`}
                        />
                        <span className={student.attendanceRate < 75 ? 'text-rose-600' : ''}>
                          {student.attendanceRate}%
                        </span>
                      </div>
                    </td>

                    {/* Today's Status with interactive toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => toggleStudentStatus(e, student)}
                        title="Click to cycle attendance (Present → Absent → Late → Leave)"
                        className="cursor-pointer"
                      >
                        <Badge variant={statusBadgeVariant[student.attendanceStatus]} size="sm" dot>
                          {student.attendanceStatus}
                        </Badge>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => handleEdit(e, student)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Student"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, student)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudent(student);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="View Full Profile Dossier"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
          Click row to view full dossier • Use edit/delete icons for immediate record management
        </span>
        <button
          onClick={() => setActiveTab('students')}
          className="font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
        >
          Open Master Registry →
        </button>
      </div>

      {/* Student Dossier Modal */}
      <StudentDetailModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
};
