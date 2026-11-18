import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { X, FileSpreadsheet, Check } from 'lucide-react';
import { Button } from '../common/Button';
import { ExamRecord } from '../../types';

export const NewExamModal: React.FC = () => {
  const { isNewExamModalOpen, setIsNewExamModalOpen, addExam, classes } = useSchool();

  const [title, setTitle] = useState('');
  const [examType, setExamType] = useState<ExamRecord['examType']>('Periodic Test 2');
  const [selectedClasses, setSelectedClasses] = useState<string[]>(['10-A', '10-B']);
  const [subjectsInput, setSubjectsInput] = useState('English, Mathematics, Science, Social Science, Hindi');
  const [maxMarksPerSubject, setMaxMarksPerSubject] = useState(50);
  const [startDate, setStartDate] = useState('2026-11-20');
  const [endDate, setEndDate] = useState('2026-11-28');
  const [status] = useState<ExamRecord['status']>('Scheduled');

  if (!isNewExamModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedClasses.length === 0) return;

    const subjects = subjectsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    addExam({
      title: title.trim(),
      examType,
      classes: selectedClasses,
      subjects,
      maxMarksPerSubject,
      startDate,
      endDate,
      status,
    });

    setIsNewExamModalOpen(false);
    setTitle('');
  };

  const toggleClass = (clsName: string) => {
    setSelectedClasses((prev) =>
      prev.includes(clsName) ? prev.filter((c) => c !== clsName) : [...prev, clsName]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Schedule Examination</h3>
              <p className="text-xs text-slate-500">Create academic assessment schedule & subject list</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewExamModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assessment Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Periodic Assessment Test - 2 (Classes 9 & 10)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assessment Type</label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value as ExamRecord['examType'])}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Periodic Test 1">Periodic Test 1</option>
                <option value="Mid-Term / Half Yearly">Mid-Term / Half Yearly</option>
                <option value="Periodic Test 2">Periodic Test 2</option>
                <option value="Pre-Board I">Pre-Board I</option>
                <option value="Pre-Board II">Pre-Board II</option>
                <option value="Annual Evaluation">Annual Evaluation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Max Marks per Subject
              </label>
              <input
                type="number"
                min={20}
                max={100}
                required
                value={maxMarksPerSubject}
                onChange={(e) => setMaxMarksPerSubject(parseInt(e.target.value) || 50)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Candidate Classes (select all that apply)
            </label>
            <div className="flex flex-wrap gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 max-h-28 overflow-y-auto">
              {classes.map((cls) => {
                const isSelected = selectedClasses.includes(cls.name);
                return (
                  <button
                    type="button"
                    key={cls.id}
                    onClick={() => toggleClass(cls.name)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Class {cls.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subjects (comma separated) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={subjectsInput}
              onChange={(e) => setSubjectsInput(e.target.value)}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsNewExamModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Check className="w-4 h-4" />}
            >
              Schedule Exam
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
