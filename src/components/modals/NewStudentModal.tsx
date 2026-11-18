import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { X, UserPlus, Check } from 'lucide-react';
import { Button } from '../common/Button';
import { StreamType, WingType } from '../../types';

export const NewStudentModal: React.FC = () => {
  const { isNewStudentModalOpen, setIsNewStudentModalOpen, addStudent, students, classes } = useSchool();

  const [name, setName] = useState('');
  const [admissionNo, setAdmissionNo] = useState('');
  const [grade, setGrade] = useState('10');
  const [section, setSection] = useState('A');
  const [rollNo, setRollNo] = useState<number>(1);
  const [stream, setStream] = useState<StreamType>('General');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [dob, setDob] = useState('2010-05-15');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [contactNumber, setContactNumber] = useState('+91 98100 12345');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('Sector 14, Gurugram, Haryana');
  const [house, setHouse] = useState<'Aravali' | 'Himalayas' | 'Nilgiri' | 'Vindhyas'>('Aravali');
  const [category, setCategory] = useState<'General' | 'OBC' | 'SC' | 'ST' | 'EWS'>('General');
  const [bloodGroup, setBloodGroup] = useState('B+');

  // Auto-generate admission number & next roll number when class/section change
  useEffect(() => {
    if (isNewStudentModalOpen) {
      setAdmissionNo(`MVN-2025-${Math.floor(100 + Math.random() * 900)}`);
    }
  }, [isNewStudentModalOpen]);

  useEffect(() => {
    const existingInClass = students.filter((s) => s.class === grade && s.section === section);
    const maxRoll = existingInClass.reduce((max, s) => Math.max(max, s.rollNo), 0);
    setRollNo(maxRoll + 1);
  }, [grade, section, students]);

  if (!isNewStudentModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !fatherName.trim() || !admissionNo.trim()) return;

    let wing: WingType = 'Secondary (IX-X)';
    const numGrade = parseInt(grade);
    if (numGrade >= 1 && numGrade <= 5) wing = 'Primary (I-V)';
    else if (numGrade >= 6 && numGrade <= 8) wing = 'Middle (VI-VIII)';
    else if (numGrade >= 9 && numGrade <= 10) wing = 'Secondary (IX-X)';
    else if (numGrade >= 11 && numGrade <= 12) wing = 'Senior Secondary (XI-XII)';

    const success = addStudent({
      admissionNo: admissionNo.trim(),
      cbseRegNo: `DEMO/25/75124/${Math.floor(1000 + Math.random() * 9000)}`,
      rollNo,
      name: name.trim(),
      class: grade,
      section,
      wing,
      stream: parseInt(grade) >= 11 ? stream : 'General',
      gender,
      dob,
      fatherName: fatherName.trim(),
      motherName: motherName.trim() || 'Parent',
      contactNumber: contactNumber.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@student.mvn.edu.in`,
      address: address.trim(),
      bloodGroup,
      attendanceStatus: 'Present',
      category,
      house,
    });

    if (success) {
      setIsNewStudentModalOpen(false);
      setName('');
      setFatherName('');
      setMotherName('');
      setEmail('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">New Student Admission</h3>
              <p className="text-xs text-slate-500">Register new pupil into institutional master registry</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewStudentModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Vivaan Saxena"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admission No <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={admissionNo}
                onChange={(e) => setAdmissionNo(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Class</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {['5', '8', '9', '10', '11', '12'].map((g) => (
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
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {['A', 'B', 'C'].map((s) => (
                  <option key={s} value={s}>
                    Section {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Roll No</label>
              <input
                type="number"
                min={1}
                required
                value={rollNo}
                onChange={(e) => setRollNo(parseInt(e.target.value) || 1)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">House</label>
              <select
                value={house}
                onChange={(e) => setHouse(e.target.value as any)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Aravali">Aravali</option>
                <option value="Himalayas">Himalayas</option>
                <option value="Nilgiri">Nilgiri</option>
                <option value="Vindhyas">Vindhyas</option>
              </select>
            </div>
          </div>

          {parseInt(grade) >= 11 && (
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
              <label className="block text-xs font-bold text-blue-900 mb-1">
                Senior Secondary Academic Stream
              </label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value as StreamType)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Science (PCM)">Science (PCM - Physics, Chemistry, Mathematics)</option>
                <option value="Science (PCB)">Science (PCB - Physics, Chemistry, Biology)</option>
                <option value="Commerce">Commerce (Accountancy, Business Studies, Economics)</option>
                <option value="Humanities">Humanities (History, Political Science, Psychology)</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Father&apos;s / Primary Guardian Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alok Saxena"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mother&apos;s Name
              </label>
              <input
                type="text"
                placeholder="e.g. Shalini Saxena"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Residential Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsNewStudentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Check className="w-4 h-4" />}
            >
              Admit Student
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
