import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { FileSpreadsheet, Calendar, Award, CheckCircle2, Plus, Download, Edit3, Trash2 } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ExamRecord } from '../../types';

export const ExamsView: React.FC = () => {
  const { exams, deleteExam, setIsNewExamModalOpen, setActiveExamForMarks, exportExamMarksCSV, requestConfirm } = useSchool();

  const handleDelete = (exam: ExamRecord) => {
    requestConfirm({
      title: `Delete Assessment: ${exam.title}?`,
      message: `Are you sure you want to delete this examination record? Any recorded student marks for this exam will also be removed.`,
      confirmText: 'Delete Exam',
      variant: 'danger',
      onConfirm: () => deleteExam(exam.id),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Examinations & Assessment Cell</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              {exams.length} Assessments
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Periodic tests, terminal assessments, marks entry & CBSE 9-point grading evaluations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsNewExamModalOpen(true)}
          >
            Schedule Assessment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {exams.map((exam) => {
          const statusBadge = {
            Scheduled: 'primary',
            Draft: 'warning',
            'In Progress': 'info',
            Completed: 'success',
          } as const;

          const resultsCount = exam.results ? exam.results.length : 0;
          const avgScore =
            resultsCount > 0
              ? Math.round(
                  (exam.results!.reduce((acc, r) => acc + r.percentage, 0) / resultsCount) * 10
                ) / 10
              : null;

          return (
            <div
              key={exam.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={statusBadge[exam.status]} size="sm">
                    {exam.status}
                  </Badge>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(exam)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Examination"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-3">{exam.title}</h3>
                <p className="text-xs text-blue-600 font-medium mt-0.5">{exam.examType}</p>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {exam.startDate} to {exam.endDate}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400">Target Classes:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{exam.classes.join(', ')}</p>
                  </div>

                  <div>
                    <span className="text-slate-400">Subjects ({exam.subjects.length}):</span>
                    <p className="text-slate-700 mt-0.5 text-[11px] truncate">
                      {exam.subjects.join(', ')}
                    </p>
                  </div>

                  {avgScore !== null && (
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 flex items-center justify-between">
                      <span className="font-medium">Class Average:</span>
                      <span className="font-bold text-sm">{avgScore}%</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Award className="w-3.5 h-3.5" />}
                  onClick={() => setActiveExamForMarks(exam)}
                  className="w-full text-xs"
                >
                  {resultsCount > 0 ? `View / Edit Marks (${resultsCount})` : 'Enter Student Marks'}
                </Button>

                {resultsCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Download className="w-3.5 h-3.5" />}
                    onClick={() => exportExamMarksCSV(exam)}
                    title="Export Marks Sheet CSV"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
