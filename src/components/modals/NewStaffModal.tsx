import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { X, UserPlus, Check } from 'lucide-react';
import { Button } from '../common/Button';
import { Staff, WingType } from '../../types';

export const NewStaffModal: React.FC = () => {
  const { isNewStaffModalOpen, setIsNewStaffModalOpen, addStaff } = useSchool();

  const [name, setName] = useState('');
  const [employeeCode, setEmployeeCode] = useState(`MVN-T0${Math.floor(20 + Math.random() * 80)}`);
  const [designation, setDesignation] = useState('TGT Mathematics');
  const [department, setDepartment] = useState<Staff['department']>('Mathematics');
  const [qualification, setQualification] = useState('M.Sc, B.Ed');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 98112 00099');
  const [wing, setWing] = useState<WingType | 'Administrative'>('Secondary (IX-X)');
  const [assignedClassInput, setAssignedClassInput] = useState('10-A');
  const [status, setStatus] = useState<Staff['status']>('Present');

  if (!isNewStaffModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !employeeCode.trim()) return;

    const assignedClasses = assignedClassInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const success = addStaff({
      employeeCode: employeeCode.trim(),
      name: name.trim(),
      designation: designation.trim(),
      department,
      qualification: qualification.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@mvn-demo.edu.in`,
      phone: phone.trim(),
      wing,
      assignedClasses,
      status,
    });

    if (success) {
      setIsNewStaffModalOpen(false);
      setName('');
      setQualification('');
      setEmail('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add Faculty Member</h3>
              <p className="text-xs text-slate-500">Register teacher or administrative personnel</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewStaffModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Ramesh Chander"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Employee Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Staff['department'])}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Sciences">Sciences</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Languages">Languages</option>
                <option value="Social Sciences">Social Sciences</option>
                <option value="Commerce & Economics">Commerce & Economics</option>
                <option value="Computer Science & AI">Computer Science & AI</option>
                <option value="Physical Education">Physical Education</option>
                <option value="Administration">Administration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                required
                placeholder="e.g. PGT Physics"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Qualifications
              </label>
              <input
                type="text"
                placeholder="e.g. M.Sc, M.Ed"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Wing</label>
              <select
                value={wing}
                onChange={(e) => setWing(e.target.value as any)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Primary (I-V)">Primary (I-V)</option>
                <option value="Middle (VI-VIII)">Middle (VI-VIII)</option>
                <option value="Secondary (IX-X)">Secondary (IX-X)</option>
                <option value="Senior Secondary (XI-XII)">Senior Secondary (XI-XII)</option>
                <option value="Administrative">Administrative</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Classes (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. 10-A, 12-A"
                value={assignedClassInput}
                onChange={(e) => setAssignedClassInput(e.target.value)}
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsNewStaffModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Check className="w-4 h-4" />}
            >
              Add Faculty
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
