import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../common/Toast';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { QuickSearchModal } from '../modals/QuickSearchModal';
import { QuickAttendanceModal } from '../modals/QuickAttendanceModal';
import { NewAnnouncementModal } from '../modals/NewAnnouncementModal';
import { NewStudentModal } from '../modals/NewStudentModal';
import { EditStudentModal } from '../modals/EditStudentModal';
import { NewStaffModal } from '../modals/NewStaffModal';
import { EditStaffModal } from '../modals/EditStaffModal';
import { ClassSectionModal } from '../modals/ClassSectionModal';
import { NewExamModal } from '../modals/NewExamModal';
import { ExamMarksEntryModal } from '../modals/ExamMarksEntryModal';
import { SchoolProfileModal } from '../modals/SchoolProfileModal';

import { DashboardView } from '../dashboard/DashboardView';
import { StudentsView } from '../views/StudentsView';
import { StaffView } from '../views/StaffView';
import { AttendanceView } from '../views/AttendanceView';
import { ClassesView } from '../views/ClassesView';
import { ExamsView } from '../views/ExamsView';
import { CircularsView } from '../views/CircularsView';
import { SettingsView } from '../views/SettingsView';

export const Layout: React.FC = () => {
  const { activeTab, isSidebarCollapsed, schoolProfile, confirmState, closeConfirm } = useSchool();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'students':
        return <StudentsView />;
      case 'staff':
        return <StaffView />;
      case 'attendance':
        return <AttendanceView />;
      case 'classes':
        return <ClassesView />;
      case 'examinations':
        return <ExamsView />;
      case 'circulars':
        return <CircularsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'pl-20' : 'pl-72'
        }`}
      >
        <Header />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200/80 bg-white py-4 px-6 md:px-8 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">SchoolOS</span>
            <span>•</span>
            <span>CBSE School Enterprise Operating System</span>
            <span>•</span>
            <span className="font-mono text-slate-400">Affiliation #{schoolProfile.affiliationNumber}</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            Compliant with NEP 2020 & CBSE Affiliation Bye-Laws • LocalStorage Cached
          </div>
        </footer>
      </div>

      {/* Modals & Toasts */}
      <QuickSearchModal />
      <QuickAttendanceModal />
      <NewAnnouncementModal />
      <NewStudentModal />
      <EditStudentModal />
      <NewStaffModal />
      <EditStaffModal />
      <ClassSectionModal />
      <NewExamModal />
      <ExamMarksEntryModal />
      <SchoolProfileModal />
      <ToastContainer />

      {/* Global Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        variant={confirmState.variant}
        onConfirm={() => {
          confirmState.onConfirm();
          closeConfirm();
        }}
        onCancel={closeConfirm}
      />
    </div>
  );
};
