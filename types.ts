
export enum CaseStatus {
  RECEIVED = 'RECEIVED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  SENT_TO_STUDENTS = 'SENT_TO_STUDENTS',
  WAITING_ADMIN_APPROVAL = 'WAITING_ADMIN_APPROVAL', // New status for student claim
  APPROVED_FOR_TREATMENT = 'APPROVED_FOR_TREATMENT', // Approved by admin
  CONTACTED_PATIENT = 'CONTACTED_PATIENT',
  IN_TREATMENT = 'IN_TREATMENT',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum StudentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Student {
  id: string;
  fullName: string;
  universityId: string;
  email: string;
  password: string; // stored plainly for demo only
  status: StudentStatus;
  registrationDate: string;
  telegramChatId?: string; // To send private messages
  legalConsent: {
    termsAccepted: boolean;
    liabilityAccepted: boolean;
    timestamp: string;
  };
}

export interface StatusHistoryLog {
  status: CaseStatus;
  timestamp: string; // ISO date string
  note?: string;
}

export interface PatientCase {
  id: string;
  fullName: string;
  age: number;
  gender: 'ذكر' | 'أنثى';
  phone: string;
  email?: string;
  district: string;
  problems: string[];
  medicalHistory: string[]; // New: List of chronic diseases
  medicalNotes: string; // New: Specific notes about diseases
  isMedicalHistoryDeclared: boolean; // New: Legal declaration
  additionalNotes: string;
  status: CaseStatus;
  submissionDate: string; // ISO date string
  assignedStudentId?: string | null;
  assignedStudent?: string; // Name of the student who claimed the case
  statusHistory: StatusHistoryLog[];
  legalConsents: {
    termsAccepted: boolean;
    privacyAccepted: boolean;
    medicalDisclaimerAccepted: boolean;
    timestamp: string;
  };
}

export interface TelegramMessagePayload {
  chat_id: string;
  text: string;
  parse_mode: 'Markdown' | 'HTML';
}
