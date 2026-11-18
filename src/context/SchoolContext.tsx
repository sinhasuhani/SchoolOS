import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  NavigationTab,
  SchoolProfile,
  Student,
  Staff,
  ClassSection,
  PeriodSchedule,
  Announcement,
  ExamRecord,
  StudentExamResult,
  AttendanceHistorySession,
  DashboardStats,
} from '../types';
import { storageService } from '../services/storageService';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

export interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
}

interface SchoolContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;

  schoolProfile: SchoolProfile;
  updateSchoolProfile: (profile: SchoolProfile) => void;

  // Student CRUD
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'attendanceRate' | 'joinedDate'>) => boolean;
  updateStudent: (studentId: string, updatedData: Partial<Student>) => boolean;
  deleteStudent: (studentId: string) => void;
  updateStudentAttendance: (studentId: string, status: Student['attendanceStatus']) => void;

  // Staff CRUD
  staff: Staff[];
  addStaff: (staffData: Omit<Staff, 'id' | 'joiningDate'>) => boolean;
  updateStaff: (staffId: string, updatedData: Partial<Staff>) => boolean;
  deleteStaff: (staffId: string) => void;
  updateStaffStatus: (staffId: string, status: Staff['status'], substitute?: string) => void;

  // Classes & Live Section Allocation
  classes: (ClassSection & {
    totalStudents: number;
    boysCount: number;
    girlsCount: number;
    presentToday: number;
  })[];
  addClass: (classData: Omit<ClassSection, 'id'>) => boolean;
  updateClass: (classId: string, updatedData: Partial<ClassSection>) => boolean;
  deleteClass: (classId: string) => void;

  // Periods Timetable
  periods: PeriodSchedule[];
  updatePeriodSubstitution: (periodId: string, substituteTeacher: string) => void;

  // Circulars / Noticeboard
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'publishedDate'>) => void;
  updateAnnouncement: (id: string, updatedData: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;

  // Examinations & Marks
  exams: ExamRecord[];
  addExam: (examData: Omit<ExamRecord, 'id' | 'results'>) => void;
  updateExam: (examId: string, updatedData: Partial<ExamRecord>) => void;
  deleteExam: (examId: string) => void;
  saveExamMarks: (examId: string, results: StudentExamResult[]) => void;

  // Attendance Sessions & History
  attendanceSessions: AttendanceHistorySession[];
  markClassAttendanceSession: (
    classId: string,
    date: string,
    studentRecords: { studentId: string; status: Student['attendanceStatus'] }[],
    markedBy: string
  ) => void;

  academicYear: string;
  setAcademicYear: (year: string) => void;

  // Live Statistics
  dashboardStats: DashboardStats;

  // Notifications & Confirmations
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;

  confirmState: ConfirmState;
  requestConfirm: (params: Omit<ConfirmState, 'isOpen'>) => void;
  closeConfirm: () => void;

  // Modal Controls
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isQuickAttendanceOpen: boolean;
  setIsQuickAttendanceOpen: (open: boolean) => void;
  isNewAnnouncementOpen: boolean;
  setIsNewAnnouncementOpen: (open: boolean) => void;
  isNewStudentModalOpen: boolean;
  setIsNewStudentModalOpen: (open: boolean) => void;
  isNewStaffModalOpen: boolean;
  setIsNewStaffModalOpen: (open: boolean) => void;
  isClassModalOpen: boolean;
  setIsClassModalOpen: (open: boolean) => void;
  isNewExamModalOpen: boolean;
  setIsNewExamModalOpen: (open: boolean) => void;
  isSchoolProfileModalOpen: boolean;
  setIsSchoolProfileModalOpen: (open: boolean) => void;

  // Active edit selections
  editingStudent: Student | null;
  setEditingStudent: (student: Student | null) => void;
  editingStaff: Staff | null;
  setEditingStaff: (staff: Staff | null) => void;
  editingClass: ClassSection | null;
  setEditingClass: (cls: ClassSection | null) => void;
  activeExamForMarks: ExamRecord | null;
  setActiveExamForMarks: (exam: ExamRecord | null) => void;

  // Exports & Resets
  resetDataToDefaults: () => void;
  exportAttendanceReportCSV: () => void;
  exportStudentsCSV: () => void;
  exportExamMarksCSV: (exam: ExamRecord) => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [schoolProfile, setSchoolProfileState] = useState<SchoolProfile>(() => storageService.getSchoolProfile());
  const [students, setStudentsState] = useState<Student[]>(() => storageService.getStudents());
  const [staff, setStaffState] = useState<Staff[]>(() => storageService.getStaff());
  const [rawClasses, setRawClassesState] = useState<ClassSection[]>(() => storageService.getClasses());
  const [periods, setPeriodsState] = useState<PeriodSchedule[]>(() => storageService.getPeriods());
  const [announcements, setAnnouncementsState] = useState<Announcement[]>(() => storageService.getAnnouncements());
  const [exams, setExamsState] = useState<ExamRecord[]>(() => storageService.getExams());
  const [attendanceSessions, setAttendanceSessionsState] = useState<AttendanceHistorySession[]>(() =>
    storageService.getAttendanceSessions()
  );
  const [academicYear, setAcademicYearState] = useState<string>(() => storageService.getAcademicYear());

  // Toasts & Confirmation modal
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Modal dialog states
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isQuickAttendanceOpen, setIsQuickAttendanceOpen] = useState(false);
  const [isNewAnnouncementOpen, setIsNewAnnouncementOpen] = useState(false);
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);
  const [isNewStaffModalOpen, setIsNewStaffModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isNewExamModalOpen, setIsNewExamModalOpen] = useState(false);
  const [isSchoolProfileModalOpen, setIsSchoolProfileModalOpen] = useState(false);

  // Edit targets
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [editingClass, setEditingClass] = useState<ClassSection | null>(null);
  const [activeExamForMarks, setActiveExamForMarks] = useState<ExamRecord | null>(null);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const requestConfirm = (params: Omit<ConfirmState, 'isOpen'>) => {
    setConfirmState({ ...params, isOpen: true });
  };

  const closeConfirm = () => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  };

  // Profile update
  const updateSchoolProfile = (profile: SchoolProfile) => {
    setSchoolProfileState(profile);
    storageService.saveSchoolProfile(profile);
    addToast('success', 'Profile Updated', 'School institutional details saved.');
  };

  // ===================== STUDENT CRUD =====================
  const addStudent = (studentData: Omit<Student, 'id' | 'attendanceRate' | 'joinedDate'>): boolean => {
    // Validation: duplicate admission number
    if (storageService.isAdmissionNoTaken(studentData.admissionNo)) {
      addToast('error', 'Admission Number Conflict', `Admission No. "${studentData.admissionNo}" is already allocated.`);
      return false;
    }
    // Validation: duplicate roll number in same class and section
    if (storageService.isRollNoTakenInSection(studentData.class, studentData.section, studentData.rollNo)) {
      addToast('error', 'Roll Number Conflict', `Roll No. ${studentData.rollNo} already exists in Class ${studentData.class}-${studentData.section}.`);
      return false;
    }

    const newStudent: Student = {
      ...studentData,
      id: `STU-${Date.now().toString().slice(-4)}`,
      attendanceRate: 100,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    const updated = [newStudent, ...students];
    setStudentsState(updated);
    storageService.saveStudents(updated);
    addToast('success', 'Student Enrolled', `${newStudent.name} admitted to Class ${newStudent.class}-${newStudent.section}`);
    return true;
  };

  const updateStudent = (studentId: string, updatedData: Partial<Student>): boolean => {
    // Check duplicate admission number if changing
    if (updatedData.admissionNo && storageService.isAdmissionNoTaken(updatedData.admissionNo, studentId)) {
      addToast('error', 'Admission Number Conflict', `Admission No. "${updatedData.admissionNo}" is already in use.`);
      return false;
    }

    const current = students.find((s) => s.id === studentId);
    if (!current) return false;

    const targetClass = updatedData.class || current.class;
    const targetSection = updatedData.section || current.section;
    const targetRoll = updatedData.rollNo !== undefined ? updatedData.rollNo : current.rollNo;

    if (
      (updatedData.class || updatedData.section || updatedData.rollNo !== undefined) &&
      storageService.isRollNoTakenInSection(targetClass, targetSection, targetRoll, studentId)
    ) {
      addToast('error', 'Roll Number Conflict', `Roll No. ${targetRoll} already exists in Class ${targetClass}-${targetSection}.`);
      return false;
    }

    const updated = students.map((s) => (s.id === studentId ? { ...s, ...updatedData } : s));
    setStudentsState(updated);
    storageService.saveStudents(updated);
    addToast('success', 'Student Updated', 'Student profile record updated successfully.');
    return true;
  };

  const deleteStudent = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    const updated = students.filter((s) => s.id !== studentId);
    setStudentsState(updated);
    storageService.saveStudents(updated);
    addToast('info', 'Student Removed', `${student ? student.name : 'Student'} has been removed from registry.`);
  };

  const updateStudentAttendance = (studentId: string, status: Student['attendanceStatus']) => {
    const updated = students.map((s) => (s.id === studentId ? { ...s, attendanceStatus: status } : s));
    setStudentsState(updated);
    storageService.saveStudents(updated);
  };

  // ===================== STAFF CRUD =====================
  const addStaff = (staffData: Omit<Staff, 'id' | 'joiningDate'>): boolean => {
    if (storageService.isEmployeeCodeTaken(staffData.employeeCode)) {
      addToast('error', 'Employee Code Conflict', `Employee code "${staffData.employeeCode}" is already registered.`);
      return false;
    }

    const newStaff: Staff = {
      ...staffData,
      id: `STF-${Date.now().toString().slice(-4)}`,
      joiningDate: new Date().toISOString().split('T')[0],
    };

    const updated = [...staff, newStaff];
    setStaffState(updated);
    storageService.saveStaff(updated);
    addToast('success', 'Faculty Added', `${newStaff.name} appointed to ${newStaff.department}.`);
    return true;
  };

  const updateStaff = (staffId: string, updatedData: Partial<Staff>): boolean => {
    if (updatedData.employeeCode && storageService.isEmployeeCodeTaken(updatedData.employeeCode, staffId)) {
      addToast('error', 'Employee Code Conflict', `Employee code "${updatedData.employeeCode}" is already in use.`);
      return false;
    }

    const updated = staff.map((st) => (st.id === staffId ? { ...st, ...updatedData } : st));
    setStaffState(updated);
    storageService.saveStaff(updated);
    addToast('success', 'Faculty Updated', 'Teacher profile record updated.');
    return true;
  };

  const deleteStaff = (staffId: string) => {
    const target = staff.find((s) => s.id === staffId);
    const updated = staff.filter((s) => s.id !== staffId);
    setStaffState(updated);
    storageService.saveStaff(updated);
    addToast('info', 'Faculty Removed', `${target ? target.name : 'Teacher'} has been removed from faculty roster.`);
  };

  const updateStaffStatus = (staffId: string, status: Staff['status'], substitute?: string) => {
    const updated = staff.map((st) =>
      st.id === staffId ? { ...st, status, substituteAssigned: substitute } : st
    );
    setStaffState(updated);
    storageService.saveStaff(updated);
    addToast('info', 'Roster Status Updated', 'Daily faculty presence updated.');
  };

  // ===================== CLASSES & ALLOCATION =====================
  // Dynamic computed classes
  const classes = useMemo(() => {
    return rawClasses.map((cls) => {
      const enrolled = students.filter((s) => s.class === cls.grade && s.section === cls.section);
      const boys = enrolled.filter((s) => s.gender === 'Male').length;
      const girls = enrolled.filter((s) => s.gender === 'Female').length;
      const present = enrolled.filter((s) => s.attendanceStatus === 'Present' || s.attendanceStatus === 'Late').length;

      return {
        ...cls,
        totalStudents: enrolled.length,
        boysCount: boys,
        girlsCount: girls,
        presentToday: present,
      };
    });
  }, [rawClasses, students]);

  const addClass = (classData: Omit<ClassSection, 'id'>): boolean => {
    const exists = rawClasses.some((c) => c.name.toLowerCase() === classData.name.toLowerCase());
    if (exists) {
      addToast('error', 'Duplicate Class Section', `Class Section "${classData.name}" already exists.`);
      return false;
    }

    const newClass: ClassSection = {
      ...classData,
      id: `CLS-${classData.name.replace(/\s+/g, '').toUpperCase()}`,
    };

    const updated = [...rawClasses, newClass];
    setRawClassesState(updated);
    storageService.saveClasses(updated);
    addToast('success', 'Class Section Created', `Class ${newClass.name} added to ${newClass.wing}.`);
    return true;
  };

  const updateClass = (classId: string, updatedData: Partial<ClassSection>): boolean => {
    const updated = rawClasses.map((c) => (c.id === classId ? { ...c, ...updatedData } : c));
    setRawClassesState(updated);
    storageService.saveClasses(updated);
    addToast('success', 'Class Updated', 'Class section allocation saved.');
    return true;
  };

  const deleteClass = (classId: string) => {
    const target = rawClasses.find((c) => c.id === classId);
    if (!target) return;
    const enrolledCount = students.filter((s) => s.class === target.grade && s.section === target.section).length;
    if (enrolledCount > 0) {
      addToast('error', 'Cannot Delete Class', `Class ${target.name} has ${enrolledCount} enrolled students. Reallocate students first.`);
      return;
    }

    const updated = rawClasses.filter((c) => c.id !== classId);
    setRawClassesState(updated);
    storageService.saveClasses(updated);
    addToast('info', 'Class Removed', `Class section ${target.name} removed.`);
  };

  // ===================== PERIODS =====================
  const updatePeriodSubstitution = (periodId: string, substituteTeacher: string) => {
    const updated = periods.map((p) =>
      p.id === periodId
        ? {
            ...p,
            isSubstitution: true,
            substitutedBy: `${p.teacherName} (Substituted by ${substituteTeacher})`,
            teacherName: substituteTeacher,
          }
        : p
    );
    setPeriodsState(updated);
    storageService.savePeriods(updated);
    addToast('info', 'Period Substituted', `Class period re-assigned to ${substituteTeacher}`);
  };

  // ===================== CIRCULARS =====================
  const addAnnouncement = (item: Omit<Announcement, 'id' | 'publishedDate'>) => {
    const newAnc: Announcement = {
      ...item,
      id: `ANC-${Date.now().toString().slice(-4)}`,
      publishedDate: new Date().toISOString().split('T')[0],
    };
    const updated = [newAnc, ...announcements];
    setAnnouncementsState(updated);
    storageService.saveAnnouncements(updated);
    addToast('success', 'Circular Published', 'Notice added to institutional board.');
  };

  const updateAnnouncement = (id: string, updatedData: Partial<Announcement>) => {
    const updated = announcements.map((a) => (a.id === id ? { ...a, ...updatedData } : a));
    setAnnouncementsState(updated);
    storageService.saveAnnouncements(updated);
    addToast('success', 'Circular Updated', 'Circular notice updated.');
  };

  const deleteAnnouncement = (id: string) => {
    const updated = announcements.filter((a) => a.id !== id);
    setAnnouncementsState(updated);
    storageService.saveAnnouncements(updated);
    addToast('info', 'Circular Removed', 'Notice removed from board.');
  };

  // ===================== EXAMS & MARKS =====================
  const addExam = (examData: Omit<ExamRecord, 'id' | 'results'>) => {
    const newExam: ExamRecord = {
      ...examData,
      id: `EXM-${Date.now().toString().slice(-4)}`,
      results: [],
    };
    const updated = [newExam, ...exams];
    setExamsState(updated);
    storageService.saveExams(updated);
    addToast('success', 'Exam Scheduled', `${newExam.title} created.`);
  };

  const updateExam = (examId: string, updatedData: Partial<ExamRecord>) => {
    const updated = exams.map((ex) => (ex.id === examId ? { ...ex, ...updatedData } : ex));
    setExamsState(updated);
    storageService.saveExams(updated);
    addToast('success', 'Exam Updated', 'Examination details saved.');
  };

  const deleteExam = (examId: string) => {
    const updated = exams.filter((ex) => ex.id !== examId);
    setExamsState(updated);
    storageService.saveExams(updated);
    addToast('info', 'Exam Removed', 'Examination schedule deleted.');
  };

  const saveExamMarks = (examId: string, results: StudentExamResult[]) => {
    const updated = exams.map((ex) =>
      ex.id === examId ? { ...ex, results, status: 'Completed' as const } : ex
    );
    setExamsState(updated);
    storageService.saveExams(updated);
    addToast('success', 'Marks Recorded', `Evaluations entered for ${results.length} students.`);
  };

  // ===================== ATTENDANCE SESSIONS =====================
  const markClassAttendanceSession = (
    classId: string,
    date: string,
    studentRecords: { studentId: string; status: Student['attendanceStatus'] }[],
    markedBy: string
  ) => {
    const targetClass = rawClasses.find((c) => c.id === classId);
    const className = targetClass ? targetClass.name : 'Class';

    const present = studentRecords.filter((r) => r.status === 'Present').length;
    const absent = studentRecords.filter((r) => r.status === 'Absent').length;
    const late = studentRecords.filter((r) => r.status === 'Late').length;
    const leave = studentRecords.filter((r) => r.status === 'Leave').length;
    const total = studentRecords.length;
    const pct = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    const detailedRecords = studentRecords.map((r) => {
      const st = students.find((s) => s.id === r.studentId);
      return {
        studentId: r.studentId,
        studentName: st ? st.name : 'Unknown',
        rollNo: st ? st.rollNo : 0,
        status: r.status,
      };
    });

    const session: AttendanceHistorySession = {
      id: `ATT-${date}-${classId}`,
      date,
      classId,
      className,
      totalStudents: total,
      presentCount: present,
      absentCount: absent,
      lateCount: late,
      leaveCount: leave,
      attendancePercentage: pct,
      markedBy,
      timestamp: new Date().toISOString(),
      studentRecords: detailedRecords,
    };

    // Replace or prepend session for that class and date
    const updatedSessions = [
      session,
      ...attendanceSessions.filter((s) => !(s.date === date && s.classId === classId)),
    ];
    setAttendanceSessionsState(updatedSessions);
    storageService.saveAttendanceSessions(updatedSessions);

    // If date is today, update student records live
    const todayStr = new Date().toISOString().split('T')[0];
    if (date === todayStr) {
      const updatedStudents = students.map((s) => {
        const found = studentRecords.find((r) => r.studentId === s.id);
        return found ? { ...s, attendanceStatus: found.status } : s;
      });
      setStudentsState(updatedStudents);
      storageService.saveStudents(updatedStudents);
    }

    addToast('success', 'Attendance Saved', `Register marked for Class ${className} on ${date}.`);
  };

  const setAcademicYear = (year: string) => {
    setAcademicYearState(year);
    storageService.saveAcademicYear(year);
    addToast('info', 'Academic Session Changed', `Switched active session to ${year}`);
  };

  // ===================== RESET TO DEFAULTS =====================
  const resetDataToDefaults = () => {
    storageService.resetToDefault();
    setSchoolProfileState(storageService.getSchoolProfile());
    setStudentsState(storageService.getStudents());
    setStaffState(storageService.getStaff());
    setRawClassesState(storageService.getClasses());
    setPeriodsState(storageService.getPeriods());
    setAnnouncementsState(storageService.getAnnouncements());
    setExamsState(storageService.getExams());
    setAttendanceSessionsState(storageService.getAttendanceSessions());
    setAcademicYearState('2025-2026');
    addToast('success', 'Data Restored', 'Factory demo dataset restored.');
  };

  // ===================== CSV EXPORTS =====================
  const exportAttendanceReportCSV = () => {
    const headers = 'Roll No,Student Name,Class,Section,Wing,Gender,Today Status,Overall Rate,Contact\n';
    const rows = students
      .map(
        (s) =>
          `${s.rollNo},"${s.name}","${s.class}","${s.section}","${s.wing}","${s.gender}","${s.attendanceStatus}",${s.attendanceRate}%,"${s.contactNumber}"`
      )
      .join('\n');
    downloadBlob(headers + rows, `SchoolOS_Attendance_${new Date().toISOString().split('T')[0]}.csv`);
    addToast('success', 'Export Ready', 'Attendance CSV has been downloaded.');
  };

  const exportStudentsCSV = () => {
    const headers =
      'Admission No,Roll No,Name,Class,Section,Wing,Stream,Gender,DOB,Father Name,Mother Name,Contact,Email,Blood Group,House,Category,Attendance Rate\n';
    const rows = students
      .map(
        (s) =>
          `"${s.admissionNo}",${s.rollNo},"${s.name}","${s.class}","${s.section}","${s.wing}","${s.stream || 'General'}","${s.gender}","${s.dob}","${s.fatherName}","${s.motherName}","${s.contactNumber}","${s.email}","${s.bloodGroup}","${s.house}","${s.category}",${s.attendanceRate}%`
      )
      .join('\n');
    downloadBlob(headers + rows, `SchoolOS_Students_Master_${new Date().toISOString().split('T')[0]}.csv`);
    addToast('success', 'Export Ready', 'Student Master Directory CSV downloaded.');
  };

  const exportExamMarksCSV = (exam: ExamRecord) => {
    if (!exam.results || exam.results.length === 0) {
      addToast('warning', 'No Marks Found', 'No evaluation marks recorded for this exam yet.');
      return;
    }

    const subjectHeaders = exam.subjects.map((s) => `"${s}"`).join(',');
    const headers = `Roll No,Student Name,Class,Section,${subjectHeaders},Total Obtained,Max Marks,Percentage,CBSE Grade,Status\n`;

    const rows = exam.results
      .map((r) => {
        const subjectScores = exam.subjects.map((sub) => r.marks[sub] ?? 0).join(',');
        return `${r.rollNo},"${r.studentName}","${r.class}","${r.section}",${subjectScores},${r.totalObtained},${r.totalMax},${r.percentage}%,${r.grade},${r.passed ? 'Passed' : 'Needs Improvement'}`;
      })
      .join('\n');

    downloadBlob(
      headers + rows,
      `SchoolOS_Exam_${exam.title.replace(/\s+/g, '_')}_Marks.csv`
    );
    addToast('success', 'Export Ready', `Marks sheet downloaded for ${exam.title}.`);
  };

  const downloadBlob = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ===================== DYNAMIC DASHBOARD STATS =====================
  const dashboardStats: DashboardStats = useMemo(() => {
    const totalStudents = students.length;
    const totalBoys = students.filter((s) => s.gender === 'Male').length;
    const totalGirls = students.filter((s) => s.gender === 'Female').length;
    const presentToday = students.filter(
      (s) => s.attendanceStatus === 'Present' || s.attendanceStatus === 'Late'
    ).length;
    const absentToday = students.filter((s) => s.attendanceStatus === 'Absent').length;
    const todayPct = totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0;

    const totalTeachers = staff.length;
    const teachersPresent = staff.filter((s) => s.status === 'Present').length;
    const totalClassSections = rawClasses.length;

    // Academic average computed from all completed exams that have results
    const examsWithResults = exams.filter((e) => e.results && e.results.length > 0);
    let totalPctSum = 0;
    let totalResultCount = 0;
    examsWithResults.forEach((ex) => {
      ex.results?.forEach((r) => {
        totalPctSum += r.percentage;
        totalResultCount++;
      });
    });
    const academicAveragePercentage =
      totalResultCount > 0 ? Math.round((totalPctSum / totalResultCount) * 10) / 10 : 85.5;

    const lowAttendanceCount = students.filter((s) => s.attendanceRate < 75).length;

    return {
      totalStudents,
      totalBoys,
      totalGirls,
      todayStudentAttendancePercentage: todayPct,
      todayStudentsPresent: presentToday,
      todayStudentsAbsent: absentToday,
      totalTeachers,
      todayTeachersPresent: teachersPresent,
      totalStaff: totalTeachers,
      totalClassSections,
      academicAveragePercentage,
      activeCircularsCount: announcements.length,
      lowAttendanceCount,
    };
  }, [students, staff, rawClasses, exams, announcements.length]);

  return (
    <SchoolContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        schoolProfile,
        updateSchoolProfile,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        updateStudentAttendance,
        staff,
        addStaff,
        updateStaff,
        deleteStaff,
        updateStaffStatus,
        classes,
        addClass,
        updateClass,
        deleteClass,
        periods,
        updatePeriodSubstitution,
        announcements,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        exams,
        addExam,
        updateExam,
        deleteExam,
        saveExamMarks,
        attendanceSessions,
        markClassAttendanceSession,
        academicYear,
        setAcademicYear,
        dashboardStats,
        toasts,
        addToast,
        removeToast,
        confirmState,
        requestConfirm,
        closeConfirm,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isQuickAttendanceOpen,
        setIsQuickAttendanceOpen,
        isNewAnnouncementOpen,
        setIsNewAnnouncementOpen,
        isNewStudentModalOpen,
        setIsNewStudentModalOpen,
        isNewStaffModalOpen,
        setIsNewStaffModalOpen,
        isClassModalOpen,
        setIsClassModalOpen,
        isNewExamModalOpen,
        setIsNewExamModalOpen,
        isSchoolProfileModalOpen,
        setIsSchoolProfileModalOpen,
        editingStudent,
        setEditingStudent,
        editingStaff,
        setEditingStaff,
        editingClass,
        setEditingClass,
        activeExamForMarks,
        setActiveExamForMarks,
        resetDataToDefaults,
        exportAttendanceReportCSV,
        exportStudentsCSV,
        exportExamMarksCSV,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
