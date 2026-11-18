import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { X, Save, Download, Award, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';
import { StudentExamResult } from '../../types';

export const ExamMarksEntryModal: React.FC = () => {
  const { activeExamForMarks, setActiveExamForMarks, students, saveExamMarks, exportExamMarksCSV } = useSchool();

  const [selectedClass, setSelectedClass] = useState<string>('');
  const [localMarks, setLocalMarks] = useState<Record<string, Record<string, number>>>({});

  useEffect(() => {
    if (activeExamForMarks) {
      const defaultCls = activeExamForMarks.classes[0] || '10-A';
      setSelectedClass(defaultCls);

      // Pre-fill localMarks from existing exam results if available
      const initial: Record<string, Record<string, number>> = {};
      if (activeExamForMarks.results) {
        activeExamForMarks.results.forEach((r) => {
          initial[r.studentId] = { ...r.marks };
        });
      }
      setLocalMarks(initial);
    }
  }, [activeExamForMarks]);

  if (!activeExamForMarks) return null;

  // Filter students belonging to selected class (e.g. "10-A" -> grade "10", section "A")
  const [grade, section] = selectedClass.split('-');
  const candidateStudents = students.filter((s) => s.class === grade && s.section === section);

  const calculateGrade = (pct: number): string => {
    if (pct >= 91) return 'A1';
    if (pct >= 81) return 'A2';
    if (pct >= 71) return 'B1';
    if (pct >= 61) return 'B2';
    if (pct >= 51) return 'C1';
    if (pct >= 41) return 'C2';
    if (pct >= 33) return 'D';
    return 'E';
  };

  const handleScoreChange = (studentId: string, subject: string, val: string) => {
    const num = Math.min(
      activeExamForMarks.maxMarksPerSubject,
      Math.max(0, parseInt(val) || 0)
    );
    setLocalMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [subject]: num,
      },
    }));
  };

  const computeStudentRow = (studentId: string) => {
    const studentScoreMap = localMarks[studentId] || {};
    let totalObtained = 0;
    activeExamForMarks.subjects.forEach((sub) => {
      totalObtained += studentScoreMap[sub] || 0;
    });
    const totalMax = activeExamForMarks.subjects.length * activeExamForMarks.maxMarksPerSubject;
    const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 1000) / 10 : 0;
    const grade = calculateGrade(percentage);
    const passed = percentage >= 33;

    return { totalObtained, totalMax, percentage, grade, passed, marks: studentScoreMap };
  };

  const handleSaveAll = () => {
    // Generate results for candidate students
    const newResults: StudentExamResult[] = candidateStudents.map((st) => {
      const computed = computeStudentRow(st.id);
      return {
        studentId: st.id,
        studentName: st.name,
        rollNo: st.rollNo,
        class: st.class,
        section: st.section,
        marks: computed.marks,
        totalObtained: computed.totalObtained,
        totalMax: computed.totalMax,
        percentage: computed.percentage,
        grade: computed.grade,
        passed: computed.passed,
      };
    });

    // Merge with any existing results for other classes in this exam
    const otherClassResults = (activeExamForMarks.results || []).filter(
      (r) => !(r.class === grade && r.section === section)
    );

    const merged = [...otherClassResults, ...newResults];
    saveExamMarks(activeExamForMarks.id, merged);
    setActiveExamForMarks(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{activeExamForMarks.title}</h3>
              <p className="text-xs text-slate-500">
                Evaluation Marks Entry & CBSE Grading Scale (Max: {activeExamForMarks.maxMarksPerSubject} marks/subject)
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveExamForMarks(null)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Picker & Info Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Select Section:</span>
            <div className="flex items-center gap-1.5">
              {activeExamForMarks.classes.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedClass(c)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    selectedClass === c
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Class {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={() => exportExamMarksCSV(activeExamForMarks)}
            >
              Export CSV
            </Button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100/80 text-slate-600 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Roll</th>
                <th className="py-2.5 px-3">Student Name</th>
                {activeExamForMarks.subjects.map((sub) => (
                  <th key={sub} className="py-2.5 px-3 text-center">
                    {sub}
                  </th>
                ))}
                <th className="py-2.5 px-3 text-center">Total</th>
                <th className="py-2.5 px-3 text-center">% Score</th>
                <th className="py-2.5 px-3 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {candidateStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={activeExamForMarks.subjects.length + 5}
                    className="py-12 text-center text-slate-400"
                  >
                    No candidate students enrolled in Class {selectedClass}.
                  </td>
                </tr>
              ) : (
                candidateStudents.map((st) => {
                  const computed = computeStudentRow(st.id);
                  const studentScoreMap = localMarks[st.id] || {};

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-3 font-mono font-bold text-slate-700">#{st.rollNo}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{st.name}</td>

                      {activeExamForMarks.subjects.map((sub) => (
                        <td key={sub} className="py-2 px-2 text-center">
                          <input
                            type="number"
                            min={0}
                            max={activeExamForMarks.maxMarksPerSubject}
                            value={studentScoreMap[sub] ?? ''}
                            onChange={(e) => handleScoreChange(st.id, sub, e.target.value)}
                            placeholder="0"
                            className="w-14 text-center font-mono text-xs font-semibold py-1 px-1.5 rounded-lg border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                      ))}

                      <td className="py-2 px-3 text-center font-mono font-bold text-slate-800">
                        {computed.totalObtained} / {computed.totalMax}
                      </td>

                      <td className="py-2 px-3 text-center font-bold text-slate-800">
                        {computed.percentage}%
                      </td>

                      <td className="py-2 px-3 text-center">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            computed.grade.startsWith('A')
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : computed.grade.startsWith('B')
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : computed.grade.startsWith('C')
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {computed.grade}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>CBSE 9-Point Scale: A1 (91-100) • A2 (81-90) • B1 (71-80) • B2 (61-70)</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setActiveExamForMarks(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Save className="w-4 h-4" />}
              onClick={handleSaveAll}
            >
              Save Marks Evaluation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
