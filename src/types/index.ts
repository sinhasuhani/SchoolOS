export type StreamType = 'General' | 'Science (PCM)' | 'Science (PCB)' | 'Commerce' | 'Humanities';

export type WingType = 'Primary (I-V)' | 'Middle (VI-VIII)' | 'Secondary (IX-X)' | 'Senior Secondary (XI-XII)';

export interface Student {
  id: string;
  admissionNo: string;
  cbseRegNo?: string;
  rollNo: number;
  name: string;
  class: string; // e.g. "10"
  section: string; // e.g. "A"
  wing: WingType;
  stream?: StreamType;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  fatherName: string;
  motherName: string;
  contactNumber: string;
  email: string;
  address: string;
  bloodGroup: string;
  attendanceStatus: 'Present' | 'Absent' | 'Late' | 'Leave';
  attendanceRate: number; // e.g. 96.5%
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  house: 'Aravali' | 'Himalayas' | 'Vindhyas' | 'Nilgiri';
  joinedDate: string;
}

export interface Staff {
  id: string;
  employeeCode: string; // e.g. "MVN-T001"
  name: string;
  designation: string; // e.g. "PGT Physics & HOD Science"
  department: 'Sciences' | 'Mathematics' | 'Languages' | 'Social Sciences' | 'Commerce & Economics' | 'Computer Science & AI' | 'Physical Education' | 'Administration';
  qualification: string;
  email: string;
  phone: string;
  wing: WingType | 'Administrative';
  assignedClasses: string[]; // e.g. ["11-A", "12-A"]
  status: 'Present' | 'On Leave' | 'Substituted' | 'Absent';
  substituteAssigned?: string;
  joiningDate: string;
}

export interface ClassSection {
  id: string;
  name: string; // "10-A"
  grade: string; // "10"
  section: string; // "A"
  wing: WingType;
  stream?: StreamType;
  classTeacher: string;
  roomNumber: string;
  maxCapacity?: number;
}

export interface PeriodSchedule {
  id: string;
  periodNumber: number;
  timeSlot: string; // "06:45AM - 07:20 AM"
  subject: string;
  classSection: string;
  teacherName: string;
  roomNumber: string;
  isSubstitution?: boolean;
  substitutedBy?: string;
  status: 'Upcoming' | 'In Progress' | 'Completed';
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Official Notice' | 'Academic' | 'Co-Curricular' | 'Administrative' | 'Advisory';
  publishedDate: string;
  targetAudience: 'All' | 'Teachers' | 'Students (9-12)' | 'Parents' | 'Class 10 & 12';
  content: string;
  circularRefNumber?: string; // e.g. "SCH/ACAD/2026/CIR-01"
  isUrgent?: boolean;
  author: string;
}

export interface StudentSubjectMark {
  subject: string;
  marksObtained: number;
  maxMarks: number;
}

export interface StudentExamResult {
  studentId: string;
  studentName: string;
  rollNo: number;
  class: string;
  section: string;
  marks: Record<string, number>; // subject -> score
  totalObtained: number;
  totalMax: number;
  percentage: number;
  grade: string; // A1, A2, B1, B2, C1, C2, D, E
  passed: boolean;
}

export interface ExamRecord {
  id: string;
  title: string;
  examType: 'Periodic Test 1' | 'Mid-Term / Half Yearly' | 'Periodic Test 2' | 'Pre-Board I' | 'Pre-Board II' | 'Annual Evaluation';
  classes: string[]; // classes taking this exam, e.g. ["10-A", "10-B"]
  subjects: string[]; // e.g. ["English Core", "Mathematics", "Science", "Social Science", "Hindi / Sanskrit"]
  maxMarksPerSubject: number; // e.g. 100 or 50
  startDate: string;
  endDate: string;
  status: 'Draft' | 'Scheduled' | 'In Progress' | 'Completed';
  results?: StudentExamResult[];
}

export interface AttendanceHistorySession {
  id: string;
  date: string; // "YYYY-MM-DD"
  classId: string;
  className: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  leaveCount: number;
  attendancePercentage: number;
  markedBy: string;
  timestamp: string;
  studentRecords: {
    studentId: string;
    studentName: string;
    rollNo: number;
    status: 'Present' | 'Absent' | 'Late' | 'Leave';
  }[];
}

export interface SchoolProfile {
  name: string;
  affiliationNumber: string;
  schoolCode: string;
  board: 'Central Board of Secondary Education (CBSE Pattern - Simulated)';
  establishedYear: number;
  academicSession: string; // "2025-2026"
  principalName: string;
  vicePrincipalName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  totalCapacity: number;
  motto: string;
  isDemoSample: boolean;
}

export interface DashboardStats {
  totalStudents: number;
  totalBoys: number;
  totalGirls: number;
  todayStudentAttendancePercentage: number;
  todayStudentsPresent: number;
  todayStudentsAbsent: number;
  totalTeachers: number;
  todayTeachersPresent: number;
  totalStaff: number;
  totalClassSections: number;
  academicAveragePercentage: number;
  activeCircularsCount: number;
  lowAttendanceCount: number;
}

export type NavigationTab =
  | 'dashboard'
  | 'students'
  | 'staff'
  | 'attendance'
  | 'classes'
  | 'examinations'
  | 'circulars'
  | 'settings';
