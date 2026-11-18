import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { X, Megaphone, Send, AlertTriangle } from 'lucide-react';
import { Button } from '../common/Button';
import { Announcement } from '../../types';

export const NewAnnouncementModal: React.FC = () => {
  const { isNewAnnouncementOpen, setIsNewAnnouncementOpen, addAnnouncement } = useSchool();

  const [title, setTitle] = useState('');
  const [circularRefNumber, setCircularRefNumber] = useState('MVN/ACAD/2026/CIR-');
  const [category, setCategory] = useState<Announcement['category']>('Academic');
  const [targetAudience, setTargetAudience] = useState<Announcement['targetAudience']>('All');
  const [content, setContent] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [author, setAuthor] = useState('Academic Coordinator');

  if (!isNewAnnouncementOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addAnnouncement({
      title: title.trim(),
      circularRefNumber: circularRefNumber.trim(),
      category,
      targetAudience,
      content: content.trim(),
      isUrgent,
      author: author.trim(),
    });

    setIsNewAnnouncementOpen(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Publish Campus Notice</h3>
              <p className="text-xs text-slate-500">Post announcement to institutional board</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewAnnouncementOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notice Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Schedule for Periodic Assessment & Syllabus Coverage"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reference ID
              </label>
              <input
                type="text"
                placeholder="MVN/ACAD/2026/CIR-01"
                value={circularRefNumber}
                onChange={(e) => setCircularRefNumber(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Announcement['category'])}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Official Notice">Official Notice</option>
                <option value="Academic">Academic</option>
                <option value="Co-Curricular">Co-Curricular</option>
                <option value="Administrative">Administrative</option>
                <option value="Advisory">Advisory</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as Announcement['targetAudience'])}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="All">All School</option>
                <option value="Class 10 & 12">Class 10 & 12</option>
                <option value="Students (9-12)">Secondary & Sr. Sec (9-12)</option>
                <option value="Teachers">Faculty & Staff</option>
                <option value="Parents">Parents & Guardians</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Issuing Authority
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notice Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Enter full notification details, instructions, or advisories..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60">
            <input
              type="checkbox"
              id="urgentNotice"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="w-4 h-4 text-rose-600 rounded cursor-pointer"
            />
            <label
              htmlFor="urgentNotice"
              className="text-xs font-medium text-amber-900 cursor-pointer flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Mark as High Priority / Urgent Notice
            </label>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsNewAnnouncementOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Send className="w-3.5 h-3.5" />}
            >
              Broadcast Notice
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
