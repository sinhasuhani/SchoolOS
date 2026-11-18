import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { RecentAdmissionsTable } from '../dashboard/RecentAdmissionsTable';
import { Button } from '../common/Button';
import { UserPlus, Download } from 'lucide-react';

export const StudentsView: React.FC = () => {
  const { setIsNewStudentModalOpen, exportStudentsCSV, students } = useSchool();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Student Master Directory</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {students.length} Pupils
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete pupil enrollment records, category classification, contact dossiers & roll call tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={exportStudentsCSV}
          >
            Export Directory CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<UserPlus className="w-4 h-4" />}
            onClick={() => setIsNewStudentModalOpen(true)}
          >
            Admit New Student
          </Button>
        </div>
      </div>

      <RecentAdmissionsTable />
    </div>
  );
};
