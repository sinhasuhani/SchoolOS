import {
  SchoolProfile,
  Student,
  Staff,
  ClassSection,
  PeriodSchedule,
  Announcement,
  ExamRecord,
  AttendanceHistorySession,
} from '../types';
import {
  initialSchoolProfile,
  initialStudents,
  initialStaff,
  initialClasses,
  initialPeriods,
  initialAnnouncements,
  initialExams,
  initialAttendanceSessions,
} from '../data/mockData';

const KEYS = {
  PROFILE: 'schoolos_mvn_profile_v2',
  STUDENTS: 'schoolos_mvn_students_v2',
  STAFF: 'schoolos_mvn_staff_v2',
  CLASSES: 'schoolos_mvn_classes_v2',
  PERIODS: 'schoolos_mvn_periods_v2',
  ANNOUNCEMENTS: 'schoolos_mvn_announcements_v2',
  EXAMS: 'schoolos_mvn_exams_v2',
  ATTENDANCE_SESSIONS: 'schoolos_mvn_att_sessions_v2',
  ACADEMIC_YEAR: 'schoolos_mvn_academic_year_v2',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (err) {
    console.error(`Failed to parse localStorage key "${key}":`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save to localStorage key "${key}":`, err);
  }
}

export const storageService = {
  getSchoolProfile: (): SchoolProfile => safeGet(KEYS.PROFILE, initialSchoolProfile),
  saveSchoolProfile: (profile: SchoolProfile) => safeSet(KEYS.PROFILE, profile),

  getStudents: (): Student[] => safeGet(KEYS.STUDENTS, initialStudents),
  saveStudents: (students: Student[]) => safeSet(KEYS.STUDENTS, students),

  getStaff: (): Staff[] => safeGet(KEYS.STAFF, initialStaff),
  saveStaff: (staff: Staff[]) => safeSet(KEYS.STAFF, staff),

  getClasses: (): ClassSection[] => safeGet(KEYS.CLASSES, initialClasses),
  saveClasses: (classes: ClassSection[]) => safeSet(KEYS.CLASSES, classes),

  getPeriods: (): PeriodSchedule[] => safeGet(KEYS.PERIODS, initialPeriods),
  savePeriods: (periods: PeriodSchedule[]) => safeSet(KEYS.PERIODS, periods),

  getAnnouncements: (): Announcement[] => safeGet(KEYS.ANNOUNCEMENTS, initialAnnouncements),
  saveAnnouncements: (announcements: Announcement[]) => safeSet(KEYS.ANNOUNCEMENTS, announcements),

  getExams: (): ExamRecord[] => safeGet(KEYS.EXAMS, initialExams),
  saveExams: (exams: ExamRecord[]) => safeSet(KEYS.EXAMS, exams),

  getAttendanceSessions: (): AttendanceHistorySession[] => safeGet(KEYS.ATTENDANCE_SESSIONS, initialAttendanceSessions),
  saveAttendanceSessions: (sessions: AttendanceHistorySession[]) => safeSet(KEYS.ATTENDANCE_SESSIONS, sessions),

  getAcademicYear: (): string => safeGet(KEYS.ACADEMIC_YEAR, '2025-2026'),
  saveAcademicYear: (year: string) => safeSet(KEYS.ACADEMIC_YEAR, year),

  // Validation helpers to prevent duplicates & bad state
  isAdmissionNoTaken: (admissionNo: string, excludeId?: string): boolean => {
    const students = storageService.getStudents();
    return students.some(
      (s) => s.admissionNo.trim().toLowerCase() === admissionNo.trim().toLowerCase() && s.id !== excludeId
    );
  },

  isEmployeeCodeTaken: (employeeCode: string, excludeId?: string): boolean => {
    const staff = storageService.getStaff();
    return staff.some(
      (st) => st.employeeCode.trim().toLowerCase() === employeeCode.trim().toLowerCase() && st.id !== excludeId
    );
  },

  isRollNoTakenInSection: (className: string, section: string, rollNo: number, excludeId?: string): boolean => {
    const students = storageService.getStudents();
    return students.some(
      (s) => s.class === className && s.section === section && s.rollNo === rollNo && s.id !== excludeId
    );
  },

  resetToDefault: () => {
    try {
      localStorage.removeItem(KEYS.PROFILE);
      localStorage.removeItem(KEYS.STUDENTS);
      localStorage.removeItem(KEYS.STAFF);
      localStorage.removeItem(KEYS.CLASSES);
      localStorage.removeItem(KEYS.PERIODS);
      localStorage.removeItem(KEYS.ANNOUNCEMENTS);
      localStorage.removeItem(KEYS.EXAMS);
      localStorage.removeItem(KEYS.ATTENDANCE_SESSIONS);
      localStorage.removeItem(KEYS.ACADEMIC_YEAR);
    } catch (e) {
      console.error('Error resetting localStorage:', e);
    }
  },
};
