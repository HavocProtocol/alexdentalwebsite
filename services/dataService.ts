
import { PatientCase, CaseStatus, Student, StudentStatus } from '../types';

// --- CASES ---

export const getCases = async (): Promise<PatientCase[]> => {
  try {
    const res = await fetch('/api/cases');
    const data = await res.json();
    // Ensure statusHistory is present (DB might not store it fully in simple setup, we mock it for UI safety)
    return (data.cases || []).map((c: any) => ({
      ...c,
      assignedStudent: c.assignedStudent || c.assignedstudent,
      statusHistory: c.statusHistory || []
    }));
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
    // For manual assignment, we'll just treat it as an update or approval
    // Ideally backend should handle this specific logic.
    // For now, we reuse update status or implement a specific one if backend supported it.
    // Fallback to update status:
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
        return data.students || [];
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
