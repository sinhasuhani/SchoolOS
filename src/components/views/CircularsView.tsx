import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Plus, Search, Filter, Trash2, Megaphone } from 'lucide-react';
import { Announcement } from '../../types';

export const CircularsView: React.FC = () => {
  const { announcements, deleteAnnouncement, setIsNewAnnouncementOpen, requestConfirm } = useSchool();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Official Notice', 'Academic', 'Co-Curricular', 'Administrative', 'Advisory'];

  const filtered = useMemo(() => {
    return announcements.filter((a) => {
      const matchCat = selectedCategory === 'All' || a.category === selectedCategory;
      const q = searchTerm.toLowerCase();
      const matchSearch =
        a.title.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        (a.circularRefNumber && a.circularRefNumber.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [announcements, selectedCategory, searchTerm]);

  const handleDelete = (anc: Announcement) => {
    requestConfirm({
      title: `Delete Notice: ${anc.title}?`,
      message: `Are you sure you want to remove this circular from the noticeboard?`,
      confirmText: 'Delete Notice',
      variant: 'danger',
      onConfirm: () => deleteAnnouncement(anc.id),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Institutional Notices & Circulars</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              {announcements.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Campus communications, academic datesheets, regulatory advisories & student circulars
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search circulars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-44"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsNewAnnouncementOpen(true)}
          >
            Post Circular
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
            No circulars found matching your filter criteria.
          </div>
        ) : (
          filtered.map((anc) => (
            <div
              key={anc.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {anc.title}
                      </h3>
                      {anc.isUrgent && (
                        <Badge variant="danger" size="sm" dot>
                          High Priority
                        </Badge>
                      )}
                      <Badge variant="neutral" size="sm">
                        {anc.category}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {anc.content}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(anc)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Delete Notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-500 font-medium">
                    {anc.circularRefNumber || 'Ref N/A'}
                  </span>
                  <span>•</span>
                  <span>Audience: {anc.targetAudience}</span>
                  <span>•</span>
                  <span>Issued By: {anc.author}</span>
                </div>
                <span>Published: {anc.publishedDate}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
