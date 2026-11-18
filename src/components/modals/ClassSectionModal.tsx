import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { X, BookOpen, Check, Save } from 'lucide-react';
import { Button } from '../common/Button';
import { ClassSection, StreamType, WingType } from '../../types';

export const ClassSectionModal: React.FC = () => {
  const { isClassModalOpen, setIsClassModalOpen, editingClass, setEditingClass, addClass, updateClass, staff } = useSchool();

  const [grade, setGrade] = useState('10');
  const [section, setSection] = useState('A');
  const [stream, setStream] = useState<StreamType>('General');
  const [classTeacher, setClassTeacher] = useState(staff[0]?.name || 'Teacher');
  const [roomNumber, setRoomNumber] = useState('Room 101');
  const [maxCapacity, setMaxCapacity] = useState(40);

  useEffect(() => {
    if (editingClass) {
      setGrade(editingClass.grade);
      setSection(editingClass.section);
      setStream(editingClass.stream || 'General');
      setClassTeacher(editingClass.classTeacher);
      setRoomNumber(editingClass.roomNumber);
      setMaxCapacity(editingClass.maxCapacity || 40);
    } else {
      setGrade('10');
      setSection('C');
      setStream('General');
      setClassTeacher(staff[0]?.name || 'Teacher');
      setRoomNumber('Room 105');
      setMaxCapacity(40);
    }
  }, [editingClass, isClassModalOpen, staff]);

  if (!isClassModalOpen && !editingClass) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let wing: WingType = 'Secondary (IX-X)';
    const numGrade = parseInt(grade);
    if (numGrade >= 1 && numGrade <= 5) wing = 'Primary (I-V)';
    else if (numGrade >= 6 && numGrade <= 8) wing = 'Middle (VI-VIII)';
    else if (numGrade >= 9 && numGrade <= 10) wing = 'Secondary (IX-X)';
    else if (numGrade >= 11 && numGrade <= 12) wing = 'Senior Secondary (XI-XII)';

    const name = `${grade}-${section}`;

    if (editingClass) {
      updateClass(editingClass.id, {
        grade,
        section,
        name,
        wing,
        stream: numGrade >= 11 ? stream : 'General',
        classTeacher,
        roomNumber,
        maxCapacity,
      });
      setEditingClass(null);
    } else {
      const success = addClass({
        name,
        grade,
        section,
        wing,
        stream: numGrade >= 11 ? stream : 'General',
        classTeacher,
        roomNumber,
        maxCapacity,
      });
      if (success) {
        setIsClassModalOpen(false);
      }
    }
  };

  const handleClose = () => {
    setIsClassModalOpen(false);
    setEditingClass(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {editingClass ? `Edit Class ${editingClass.name}` : 'Add Class Section'}
              </h3>
              <p className="text-xs text-slate-500">Academic wing & homeroom teacher allocation</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Class Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-bold"
              >
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((g) => (
                  <option key={g} value={g}>
                    Class {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Section</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-bold"
              >
                {['A', 'B', 'C', 'D'].map((s) => (
                  <option key={s} value={s}>
                    Section {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {parseInt(grade) >= 11 && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Senior Secondary Stream
              </label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value as StreamType)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Science (PCM)">Science (PCM)</option>
                <option value="Science (PCB)">Science (PCB)</option>
                <option value="Commerce">Commerce</option>
                <option value="Humanities">Humanities</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Class Homeroom Teacher
            </label>
            <select
              value={classTeacher}
              onChange={(e) => setClassTeacher(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
            >
              {staff.map((st) => (
                <option key={st.id} value={st.name}>
                  {st.name} ({st.designation})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Room Number
              </label>
              <input
                type="text"
                required
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Max Seat Capacity
              </label>
              <input
                type="number"
                min={15}
                max={60}
                required
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(parseInt(e.target.value) || 40)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
            <Button type="button" variant="outline" size="sm" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={editingClass ? <Save className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            >
              {editingClass ? 'Save Changes' : 'Create Section'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
