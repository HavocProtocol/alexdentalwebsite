
import { PatientCase, CaseStatus, Student, StudentStatus } from '../types';

// Global notification dispatcher
const notify = (type: 'success' | 'error', message: string) => {
  window.dispatchEvent(new CustomEvent('app-notification', { detail: { type, message } }));
};

// Wrapper for Fetch to handle errors globally
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || data.message || 'حدث خطأ في الخادم');
    }
    return data;
  } catch (error: any) {
    console.error(`API Error (${url}):`, error);
    // Don't notify for 404s if handled locally, but generally notify for failures
    if (!url.includes('/api/cases') || options?.method !== 'GET') {
       // Only notify if not a 404 (handled specifically in UI sometimes)
       if (!error.message.includes('غير صالح')) {
         notify('error', error.message || 'فشل الاتصال بالخادم.');
       }
    }
    throw error;
  }
}

// Helper to ensure we always work with arrays
const ensureArray = (val: any): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    return val.split(',').map(item => item.trim()).filter(item => item.length > 0);
  }
  return [];
};

// Helper to map DB Case (lowercase keys) to Frontend Case (CamelCase)
const mapDBCaseToFrontend = (dbCase: any): PatientCase => {
  return {
    id: dbCase.id,
    fullName: dbCase.fullname || dbCase.fullName || '', // Handle both casings
    phone: dbCase.phone,
    age: dbCase.age,
    gender: dbCase.gender,
    district: dbCase.district,
    problems: ensureArray(dbCase.problems || dbCase.problem),
    medicalHistory: ensureArray(dbCase.medicalHistory || dbCase.medicalhistory), 
    medicalNotes: dbCase.notes || dbCase.medicalNotes || '', 
    additionalNotes: dbCase.notes || dbCase.additionalNotes || '',
    isMedicalHistoryDeclared: true, 
    status: dbCase.status,
    submissionDate: dbCase.submissiondate || dbCase.submissionDate,
    assignedStudentId: dbCase.assignedStudentId || dbCase.assignedstudentid,
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
    const data: { cases: any[] } = await request('/api/cases');
    return (data.cases || []).map(mapDBCaseToFrontend);
  } catch (error) {
    return [];
  }
};

export const saveCase = async (newCase: PatientCase): Promise<void> => {
  await request('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCase)
  });
};

export const publishCase = async (id: string): Promise<{ success: boolean; message?: string }> => {
  try {
    await request('/api/cases/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });
    return { success: true };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
};

export const updateCaseStatus = async (id: string, newStatus: CaseStatus): Promise<boolean> => {
  try {
    await request('/api/cases/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
    });
    notify('success', 'تم تحديث حالة المريض بنجاح');
    return true;
  } catch (e) {
      return false;
  }
};

export const deleteCase = async (id: string): Promise<boolean> => {
  try {
      await request(`/api/cases?id=${id}`, { method: 'DELETE' });
      notify('success', 'تم حذف الحالة بنجاح');
      return true;
  } catch (e) {
      return false;
  }
};

export const approveCaseAssignment = async (caseId: string): Promise<boolean> => {
    // Legacy function, kept for compatibility
    return true; 
};

export const generateCaseId = (): string => {
  return 'CS-' + Math.floor(1000 + Math.random() * 9000).toString();
};

// --- CLAIMING LOGIC ---

export const verifyClaimToken = async (token: string): Promise<{ success: boolean, case?: Partial<PatientCase>, message?: string }> => {
    try {
        const data: any = await request(`/api/cases/claim-info/${token}`);
        return { success: true, case: data.case };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};

export const confirmClaim = async (token: string, studentId: string, studentName: string): Promise<{ success: boolean, message?: string }> => {
    try {
        await request('/api/cases/confirm-claim', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, studentId, studentName })
        });
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}

// --- STUDENTS ---

export const getStudents = async (): Promise<Student[]> => {
    try {
        const data: { students: any[] } = await request('/api/students');
        return (data.students || []).map(mapDBStudentToFrontend);
    } catch (error) {
        return [];
    }
};

export const registerStudent = async (studentData: Omit<Student, 'id' | 'status' | 'registrationDate'>): Promise<{ success: boolean, message: string }> => {
    try {
        await request('/api/student/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });
        return { success: true, message: 'تم التسجيل بنجاح' };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};

export const loginStudent = async (email: string, password: string): Promise<{ success: boolean, student?: Student, message?: string }> => {
    try {
        const data: any = await request('/api/student/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (data.success && data.student) {
            data.student = mapDBStudentToFrontend(data.student);
        }
        return data;
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};

export const updateStudentStatus = async (studentId: string, newStatus: StudentStatus): Promise<void> => {
    await request('/api/students/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: studentId, status: newStatus })
    });
    notify('success', 'تم تحديث حالة الطالب');
};

export const deleteStudent = async (id: string): Promise<boolean> => {
  try {
      await request(`/api/students?id=${id}`, { method: 'DELETE' });
      notify('success', 'تم حذف حساب الطالب');
      return true;
  } catch (e) {
      return false;
  }
};
