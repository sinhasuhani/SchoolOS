import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { MetricCard } from '../common/MetricCard';
import {
  GraduationCap,
  Users,
  CalendarCheck,
  Award,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

export const StatOverview: React.FC = () => {
  const { dashboardStats, setActiveTab, setIsQuickAttendanceOpen, students } = useSchool();

  const lowAttendanceStudents = students.filter((s) => s.attendanceRate < 75);

  return (
    <div className="space-y-4">
      {/* Administrative Low Attendance Alert Banner if any students below 75% */}
      {lowAttendanceStudents.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <p className="text-xs font-bold">
                {lowAttendanceStudents.length} Student{lowAttendanceStudents.length > 1 ? 's' : ''} with Low Attendance (&lt; 75%)
              </p>
              <p className="text-[11px] text-amber-800/80 mt-0.5">
                {lowAttendanceStudents.map((s) => `${s.name} (${s.attendanceRate}%)`).join(', ')} — CBSE criteria requires minimum 75% presence.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('attendance')}
            className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 self-start sm:self-auto cursor-pointer underline shrink-0"
          >
            <span>Review Register</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Enrolled Students */}
        <MetricCard
          title="Total Enrolled Students"
          value={dashboardStats.totalStudents}
          subtitle={`${dashboardStats.totalBoys} Boys · ${dashboardStats.totalGirls} Girls`}
          trend={{
            value: `${dashboardStats.totalClassSections} Sections`,
            isPositive: true,
            label: 'Active',
          }}
          icon={GraduationCap}
          iconBgColor="bg-blue-50"
          iconTextColor="text-blue-600"
          onClick={() => setActiveTab('students')}
          badgeText="Live Count"
        />

        {/* Metric 2: Today's Student Attendance */}
        <MetricCard
          title="Daily Attendance Rate"
          value={`${dashboardStats.todayStudentAttendancePercentage}%`}
          subtitle={`${dashboardStats.todayStudentsPresent} Present · ${dashboardStats.todayStudentsAbsent} Absent`}
          trend={{
            value: `${dashboardStats.todayStudentsPresent}/${dashboardStats.totalStudents}`,
            isPositive: dashboardStats.todayStudentAttendancePercentage >= 75,
            label: 'Present Today',
          }}
          icon={CalendarCheck}
          iconBgColor="bg-emerald-50"
          iconTextColor="text-emerald-600"
          onClick={() => setIsQuickAttendanceOpen(true)}
          badgeText="Session Today"
        />

        {/* Metric 3: Faculty Roster */}
        <MetricCard
          title="Faculty on Duty"
          value={`${dashboardStats.todayTeachersPresent} / ${dashboardStats.totalTeachers}`}
          subtitle={`${dashboardStats.totalTeachers} Appointed Educators`}
          trend={{
            value: `${dashboardStats.totalTeachers - dashboardStats.todayTeachersPresent} On Leave`,
            isPositive: dashboardStats.todayTeachersPresent === dashboardStats.totalTeachers,
            label: 'Status',
          }}
          icon={Users}
          iconBgColor="bg-indigo-50"
          iconTextColor="text-indigo-600"
          onClick={() => setActiveTab('staff')}
          badgeText="Staff Register"
        />

        {/* Metric 4: Academic Performance */}
        <MetricCard
          title="Academic Evaluation Average"
          value={`${dashboardStats.academicAveragePercentage}%`}
          subtitle="Computed across recorded assessments"
          trend={{
            value: 'CBSE Grading',
            isPositive: true,
            label: 'Scale A1-D',
          }}
          icon={Award}
          iconBgColor="bg-amber-50"
          iconTextColor="text-amber-600"
          onClick={() => setActiveTab('examinations')}
          badgeText="Assessment Cell"
        />
      </div>
    </div>
  );
};
