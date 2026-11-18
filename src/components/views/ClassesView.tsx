import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Plus, Edit3, Trash2, ArrowRight, DoorClosed, Users, BookOpen } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const ClassesView: React.FC = () => {
  const { classes, setActiveTab, setEditingClass, deleteClass, setIsClassModalOpen, requestConfirm } = useSchool();
  const [selectedWing, setSelectedWing] = useState<string>('All');

  const wings = [
    'All',
    'Primary (I-V)',
    'Middle (VI-VIII)',
    'Secondary (IX-X)',
    'Senior Secondary (XI-XII)',
  ];

  const filtered = classes.filter((c) => selectedWing === 'All' || c.wing === selectedWing);

  const handleDelete = (cls: any) => {
    requestConfirm({
      title: `Delete Class Section ${cls.name}?`,
      message: `Are you sure you want to delete Class ${cls.name}? Classes with enrolled students cannot be deleted until pupils are reallocated.`,
      confirmText: 'Delete Section',
      variant: 'danger',
      onConfirm: () => deleteClass(cls.id),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Academic Wings & Sections</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-mono">
              {classes.length} Sections
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Section management, homeroom educator allocations, capacity & student distribution
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {wings.map((w) => (
              <button
                key={w}
                onClick={() => setSelectedWing(w)}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedWing === w
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {w.split(' ')[0]}
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsClassModalOpen(true)}
          >
            Add Section
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">Class {cls.name}</h3>
                    {cls.stream && cls.stream !== 'General' && (
                      <Badge variant="primary" size="sm">
                        {cls.stream}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{cls.wing}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingClass(cls)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit Section"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cls)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Section"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">Class Teacher:</span>
                  <span className="font-semibold text-slate-800">{cls.classTeacher}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 flex items-center gap-1">
                    <DoorClosed className="w-3.5 h-3.5" /> Room:
                  </span>
                  <span className="font-medium text-slate-800">{cls.roomNumber}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-100">
                  <span className="text-slate-400">Live Strength:</span>
                  <span className="font-bold text-slate-900">
                    {cls.totalStudents} ({cls.boysCount} Boys · {cls.girlsCount} Girls)
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">Seat Capacity:</span>
                  <span className="font-mono text-slate-700">
                    {cls.totalStudents} / {cls.maxCapacity || 40} ({Math.round((cls.totalStudents / (cls.maxCapacity || 40)) * 100)}% filled)
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600">
                {cls.presentToday} Present Today
              </span>
              <button
                onClick={() => setActiveTab('attendance')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Roll Call</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
