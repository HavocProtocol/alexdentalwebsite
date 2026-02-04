
import { PatientCase, CaseStatus, Student, StudentStatus } from '../types';

// Helper to map DB Case (lowercase keys) to Frontend Case (CamelCase)
const mapDBCaseToFrontend = (dbCase: any): PatientCase => {
  return {
    id: dbCase.id,
    fullName: dbCase.fullname || dbCase.fullName || '', // Handle both casings
    phone: dbCase.phone,
    age: dbCase.age,
    gender: dbCase.gender,
    district: dbCase.district,
    problems: dbCase.problems || (dbCase.problem ? dbCase.problem.split(',') : []),
    medicalHistory: dbCase.medicalhistory || (dbCase.medicalHistory ? (Array.isArray(dbCase.medicalHistory) ? dbCase.medicalHistory : dbCase.medicalHistory.split(',')) : []),
    medicalNotes: dbCase.notes || dbCase.medicalNotes || '', // DB might use 'notes' for medical notes or additional notes, assuming mapping logic here
    additionalNotes: dbCase.notes || dbCase.additionalNotes || '',
    isMedicalHistoryDeclared: true, // Assumed true if saved
    status: dbCase.status,
    submissionDate: dbCase.submissiondate || dbCase.submissionDate,
    assignedStudentId: dbCase.assignedStudentId || dbCase.assignedstudentid || (dbCase.assignedstudentchatid ? 'LINKED' : null),
    assignedStudent: dbCase.assignedStudent || dbCase.assignedstudent,
    statusHistory: dbCase.statusHistory || [],
    legalConsents: {
        termsAccepted: true,
        privacyAccepted: true,
        medicalDisclaimerAccepted: true,
        timestamp: dbCase.submissiondate || new Date().toISOString()
    }
  };
};

// Helper to map DB Student to Frontend Student
const mapDBStudentToFrontend = (dbStudent: any): Student => {
    return {
        id: dbStudent.id,
        fullName: dbStudent.fullname || dbStudent.fullName,
        universityId: dbStudent.universityid || dbStudent.universityId,
        email: dbStudent.email,
        password: dbStudent.password,
        status: dbStudent.status,
        registrationDate: dbStudent.registrationdate || dbStudent.registrationDate,
        telegramChatId: dbStudent.telegramchatid || dbStudent.telegramChatId,
        legalConsent: {
            termsAccepted: true,
            liabilityAccepted: true,
            timestamp: dbStudent.registrationdate || new Date().toISOString()
        }
    };
};

// --- CASES ---

export const getCases = async (): Promise<PatientCase[]> => {
  try {
    const res = await fetch('/api/cases');
    const data = await res.json();
    return (data.cases || []).map(mapDBCaseToFrontend);
  } catch (error) {
    console.error("Failed to fetch cases", error);
    return [];
  }
};

export const saveCase = async (newCase: PatientCase): Promise<void> => {
  await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCase)
  });
};

export const updateCaseStatus = async (id: string, newStatus: CaseStatus): Promise<boolean> => {
  try {
    await fetch('/api/cases/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
    });
    return true;
  } catch (e) {
      return false;
  }
};

// Admin approves the assignment
export const approveCaseAssignment = async (caseId: string): Promise<boolean> => {
    try {
        await fetch('/api/approve-assignment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ caseId })
        });
        return true;
    } catch (e) {
        return false;
    }
};

export const assignCaseToStudent = async (caseId: string, studentId: string): Promise<boolean> => {
    return updateCaseStatus(caseId, CaseStatus.APPROVED_FOR_TREATMENT);
};

export const generateCaseId = (): string => {
  return 'CS-' + Math.floor(1000 + Math.random() * 9000).toString();
};

// --- STUDENTS ---

export const getStudents = async (): Promise<Student[]> => {
    try {
        const res = await fetch('/api/students');
        const data = await res.json();
        return (data.students || []).map(mapDBStudentToFrontend);
    } catch (error) {
        return [];
    }
};

export const registerStudent = async (studentData: Omit<Student, 'id' | 'status' | 'registrationDate'>): Promise<{ success: boolean, message: string }> => {
    try {
        const res = await fetch('/api/student/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });
        const data = await res.json();
        if (data.success) return { success: true, message: 'تم التسجيل بنجاح' };
        return { success: false, message: data.error || 'فشل التسجيل' };
    } catch (e) {
        return { success: false, message: 'خطأ في الاتصال' };
    }
};

export const loginStudent = async (email: string, password: string): Promise<{ success: boolean, student?: Student, message?: string }> => {
    try {
        const res = await fetch('/api/student/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success && data.student) {
            // Map the single student object before returning
            data.student = mapDBStudentToFrontend(data.student);
        }
        return data;
    } catch (e) {
        return { success: false, message: 'خطأ في الاتصال' };
    }
};

export const updateStudentStatus = async (studentId: string, newStatus: StudentStatus): Promise<void> => {
    await fetch('/api/students/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: studentId, status: newStatus })
    });
};
