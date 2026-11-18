import React from 'react';
import { Student } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import { X, Phone, Mail, MapPin, Edit3, Trash2, Shield, User } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, onClose }) => {
  const { setEditingStudent, deleteStudent, requestConfirm } = useSchool();

  if (!student) return null;

  const handleDelete = () => {
    requestConfirm({
      title: `Delete Student Record: ${student.name}?`,
      message: `Are you sure you want to delete ${student.name} (Admission No: ${student.admissionNo}) from Class ${student.class}-${student.section}? This action cannot be undone.`,
      confirmText: 'Delete Student',
      variant: 'danger',
      onConfirm: () => {
        deleteStudent(student.id);
        onClose();
      },
    });
  };

  const handleEdit = () => {
    setEditingStudent(student);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Top Header Card */}
        <div className="relative bg-gradient-to-r from-[#0F1D33] via-[#142644] to-[#1E3A63] text-white p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-xl shadow-inner">
              {student.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{student.name}</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/40 text-blue-200 font-mono">
                  Roll #{student.rollNo}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Class {student.class}-{student.section} • {student.wing}
              </p>
              {student.stream && student.stream !== 'General' && (
                <p className="text-[11px] font-medium text-blue-300 mt-1">
                  Stream: {student.stream}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Dossier Body */}
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* Status & Metrics strip */}
          <div className="grid grid-cols-3 gap-3 text-center bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Attendance</span>
              <div
                className={`text-sm font-bold mt-0.5 ${
                  student.attendanceRate < 75 ? 'text-rose-600' : 'text-slate-900'
                }`}
              >
                {student.attendanceRate}%
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Status Today</span>
              <div className="mt-0.5">
                <Badge
                  variant={
                    student.attendanceStatus === 'Present'
                      ? 'success'
                      : student.attendanceStatus === 'Absent'
                      ? 'danger'
                      : 'warning'
                  }
                  size="sm"
                  dot
                >
                  {student.attendanceStatus}
                </Badge>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">House</span>
              <div className="text-sm font-bold text-indigo-700 mt-0.5">{student.house}</div>
            </div>
          </div>

          {/* Institutional Info */}
          <div className="space-y-2 text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Institutional Registry Details
            </span>
            <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400">Admission No:</span>
                <p className="font-mono font-medium text-slate-800">{student.admissionNo}</p>
              </div>
              <div>
                <span className="text-slate-400">Registration ID:</span>
                <p className="font-mono font-medium text-slate-800">{student.cbseRegNo || 'Pending'}</p>
              </div>
              <div>
                <span className="text-slate-400">Category:</span>
                <p className="font-medium text-slate-800">{student.category}</p>
              </div>
              <div>
                <span className="text-slate-400">Blood Group:</span>
                <p className="font-medium text-slate-800">{student.bloodGroup}</p>
              </div>
            </div>
          </div>

          {/* Parental & Contact */}
          <div className="space-y-2 text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Parent & Guardian Contact
            </span>
            <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Father&apos;s Name:</span>
                <span className="font-medium text-slate-800">{student.fatherName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Mother&apos;s Name:</span>
                <span className="font-medium text-slate-800">{student.motherName}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                <span className="text-slate-400 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-blue-600" /> Phone:
                </span>
                <span className="font-medium text-slate-800 font-mono">{student.contactNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-blue-600" /> Email:
                </span>
                <span className="font-medium text-slate-800 truncate max-w-[200px]">
                  {student.email}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> Address:
                </span>
                <span className="font-medium text-slate-800 text-right max-w-[220px]">
                  {student.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Edit and Delete Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 className="w-4 h-4 text-rose-600" />}
            onClick={handleDelete}
            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          >
            Delete Student
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Edit3 className="w-3.5 h-3.5" />}
              onClick={handleEdit}
            >
              Edit Record
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
