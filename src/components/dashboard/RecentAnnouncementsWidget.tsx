import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Bell, Plus, Trash2, ArrowRight, FileText } from 'lucide-react';
import { Badge } from '../common/Badge';

export const RecentAnnouncementsWidget: React.FC = () => {
  const { announcements, deleteAnnouncement, setIsNewAnnouncementOpen, setActiveTab, requestConfirm } = useSchool();

  const handleDelete = (id: string, title: string) => {
    requestConfirm({
      title: 'Remove Circular Notice?',
      message: `Are you sure you want to remove "${title}" from the noticeboard?`,
      confirmText: 'Remove Notice',
      variant: 'danger',
      onConfirm: () => deleteAnnouncement(id),
    });
  };



  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Official CBSE Circulars & Notices</h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {announcements.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Board notifications, exam advisories and institution circulars
          </p>
        </div>

        <button
          onClick={() => setIsNewAnnouncementOpen(true)}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post Circular</span>
        </button>
      </div>

      {/* List */}
      <div className="mt-3 divide-y divide-slate-100 overflow-y-auto flex-1 pr-1 max-h-96">
        {announcements.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No active circulars on the noticeboard. Click &ldquo;Post Circular&rdquo; to broadcast a notice.
          </div>
        ) : (
          announcements.map((anc) => (
            <div key={anc.id} className="py-3 group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {anc.title}
                    </span>
                    {anc.isUrgent && (
                      <Badge variant="danger" size="sm" dot>
                        Urgent
                      </Badge>
                    )}
                    <Badge variant="neutral" size="sm">
                      {anc.category}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {anc.content}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                    <span className="font-mono text-slate-500">
                      {anc.circularRefNumber || 'School Ref'}
                    </span>
                    <span>•</span>
                    <span>Audience: {anc.targetAudience}</span>
                    <span>•</span>
                    <span>{anc.publishedDate}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(anc.id, anc.title)}
                  title="Remove circular from noticeboard"
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-blue-500" />
          Synchronized across School Web App & Parent Portal
        </span>
        <button
          onClick={() => setActiveTab('circulars')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
        >
          <span>Noticeboard Archive</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
