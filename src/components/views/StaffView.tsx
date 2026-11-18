import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Staff } from '../../types';
import { Search, Filter, Phone, Mail, UserPlus, Edit3, Trash2 } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const StaffView: React.FC = () => {
  const { staff, updateStaffStatus, setEditingStaff, deleteStaff, setIsNewStaffModalOpen, requestConfirm } = useSchool();
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const departments = [
    'All',
    'Administration',
    'Sciences',
    'Mathematics',
    'Languages',
    'Social Sciences',
    'Commerce & Economics',
    'Computer Science & AI',
    'Physical Education',
  ];

  const filteredStaff = useMemo(() => {
    return staff.filter((st) => {
      const matchesDept = selectedDept === 'All' || st.department === selectedDept;
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        st.name.toLowerCase().includes(q) ||
        st.designation.toLowerCase().includes(q) ||
        st.employeeCode.toLowerCase().includes(q);
      return matchesDept && matchesSearch;
    });
  }, [staff, selectedDept, searchTerm]);

  const toggleStaffStatus = (st: Staff) => {
    const cycle: Record<Staff['status'], Staff['status']> = {
      Present: 'On Leave',
      'On Leave': 'Substituted',
      Substituted: 'Present',
      Absent: 'Present',
    };
    updateStaffStatus(st.id, cycle[st.status]);
  };

  const handleDelete = (teacher: Staff) => {
    requestConfirm({
      title: `Remove Faculty Member: ${teacher.name}?`,
      message: `Are you sure you want to remove ${teacher.name} (${teacher.employeeCode} - ${teacher.designation}) from the faculty roster?`,
      confirmText: 'Remove Faculty',
      variant: 'danger',
      onConfirm: () => deleteStaff(teacher.id),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Faculty & Staff Roster</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {staff.length} Educators
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            PGT, TGT educators, departmental leads, class teacher allocations & daily duty status
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-44"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:outline-none"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<UserPlus className="w-4 h-4" />}
            onClick={() => setIsNewStaffModalOpen(true)}
          >
            Add Faculty
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
            No faculty members found matching your search.
          </div>
        ) : (
          filteredStaff.map((teacher) => {
            const statusBadge = {
              Present: 'success',
              'On Leave': 'warning',
              Substituted: 'info',
              Absent: 'danger',
            } as const;

            return (
              <div
                key={teacher.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold text-sm flex items-center justify-center shrink-0 font-mono">
                        {teacher.name.split(' ').slice(1, 3).map((n) => n[0]).join('') || 'ED'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {teacher.name}
                        </h4>
                        <p className="text-[11px] font-mono text-slate-400">{teacher.employeeCode}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleStaffStatus(teacher)}
                      title="Click to cycle status (Present → On Leave → Substituted)"
                      className="cursor-pointer"
                    >
                      <Badge variant={statusBadge[teacher.status]} size="sm" dot>
                        {teacher.status}
                      </Badge>
                    </button>
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs">
                    <div className="text-slate-800 font-semibold">{teacher.designation}</div>
                    <div className="text-slate-500">{teacher.qualification}</div>
                    <div className="text-blue-600 font-medium text-[11px] pt-1">
                      Dept: {teacher.department} • {teacher.wing}
                    </div>
                    {teacher.assignedClasses.length > 0 && (
                      <div className="text-slate-600 text-[11px]">
                        Assigned Classes: <span className="font-mono font-medium text-slate-800">{teacher.assignedClasses.join(', ')}</span>
                      </div>
                    )}
                    {teacher.substituteAssigned && (
                      <div className="text-amber-800 text-[11px] font-medium bg-amber-50 p-2 rounded-lg border border-amber-200 mt-2">
                        Substitution Assigned: {teacher.substituteAssigned}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {teacher.phone}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingStaff(teacher)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Faculty Record"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(teacher)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove Faculty Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
