
import { PatientCase, CaseStatus, Student, StudentStatus } from '../types';

const CASES_KEY = 'alex_dental_cases_v2';
const STUDENTS_KEY = 'alex_dental_students_v2';

// --- CASES ---

export const getCases = (): PatientCase[] => {
  const data = localStorage.getItem(CASES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveCase = (newCase: PatientCase): void => {
  const cases = getCases();
  cases.push(newCase);
  localStorage.setItem(CASES_KEY, JSON.stringify(cases));
};

export const updateCaseStatus = (id: string, newStatus: CaseStatus): PatientCase | null => {
  const cases = getCases();
  const caseIndex = cases.findIndex(c => c.id === id);
  
  if (caseIndex === -1) return null;

  const updatedCase = { ...cases[caseIndex] };
  
  updatedCase.statusHistory.push({
    status: newStatus,
    timestamp: new Date().toISOString(),
    note: `تحديث الحالة إلى: ${newStatus}`
  });

  updatedCase.status = newStatus;
  
  cases[caseIndex] = updatedCase;
  localStorage.setItem(CASES_KEY, JSON.stringify(cases));
  
  return updatedCase;
};

// Modified: When student picks a case, it goes to WAITING_ADMIN_APPROVAL first
export const requestCaseAssignment = (caseId: string, studentId: string): PatientCase | null => {
  const cases = getCases();
  const caseIndex = cases.findIndex(c => c.id === caseId);
  if (caseIndex === -1) return null;

  const students = getStudents();
  const student = students.find(s => s.id === studentId);
  if (!student) return null;

  const updatedCase = { ...cases[caseIndex] };
  updatedCase.assignedStudentId = studentId;
  updatedCase.status = CaseStatus.WAITING_ADMIN_APPROVAL;
  
  updatedCase.statusHistory.push({
    status: CaseStatus.WAITING_ADMIN_APPROVAL,
    timestamp: new Date().toISOString(),
    note: `طلب استلام الحالة بواسطة الطالب: ${student.fullName}`
  });

  cases[caseIndex] = updatedCase;
  localStorage.setItem(CASES_KEY, JSON.stringify(cases));
  return updatedCase;
};

// New: Admin confirms the assignment
export const approveCaseAssignment = (caseId: string): PatientCase | null => {
  const cases = getCases();
  const caseIndex = cases.findIndex(c => c.id === caseId);
  if (caseIndex === -1) return null;

  const updatedCase = { ...cases[caseIndex] };
  updatedCase.status = CaseStatus.APPROVED_FOR_TREATMENT;
  
  updatedCase.statusHistory.push({
    status: CaseStatus.APPROVED_FOR_TREATMENT,
    timestamp: new Date().toISOString(),
    note: `تمت الموافقة الإدارية على إسناد الحالة`
  });

  cases[caseIndex] = updatedCase;
  localStorage.setItem(CASES_KEY, JSON.stringify(cases));
  return updatedCase;
};

export const assignCaseToStudent = (caseId: string, studentId: string): PatientCase | null => {
    // Legacy direct assignment (if needed manually by admin)
    const cases = getCases();
    const caseIndex = cases.findIndex(c => c.id === caseId);
    if (caseIndex === -1) return null;
  
    const students = getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) return null;
  
    const updatedCase = { ...cases[caseIndex] };
    updatedCase.assignedStudentId = studentId;
    updatedCase.status = CaseStatus.APPROVED_FOR_TREATMENT; // Admin manual assign implies approval
    
    updatedCase.statusHistory.push({
      status: CaseStatus.APPROVED_FOR_TREATMENT,
      timestamp: new Date().toISOString(),
      note: `إسناد يدوي مباشر للطالب: ${student.fullName}`
    });
  
    cases[caseIndex] = updatedCase;
    localStorage.setItem(CASES_KEY, JSON.stringify(cases));
    return updatedCase;
};

export const generateCaseId = (): string => {
  return 'CS-' + Math.floor(1000 + Math.random() * 9000).toString();
};

// --- STUDENTS ---

export const getStudents = (): Student[] => {
  const data = localStorage.getItem(STUDENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const registerStudent = (studentData: Omit<Student, 'id' | 'status' | 'registrationDate'>): { success: boolean, message: string } => {
  const students = getStudents();
  
  if (students.some(s => s.email === studentData.email)) {
    return { success: false, message: 'البريد الإلكتروني مستخدم بالفعل' };
  }
  if (students.some(s => s.universityId === studentData.universityId)) {
    return { success: false, message: 'الرقم الجامعي مسجل بالفعل' };
  }

  const newStudent: Student = {
    ...studentData,
    id: 'ST-' + Math.floor(10000 + Math.random() * 90000),
    status: StudentStatus.PENDING,
    registrationDate: new Date().toISOString()
  };

  students.push(newStudent);
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  return { success: true, message: 'تم التسجيل بنجاح' };
};

export const loginStudent = (email: string, password: string): { success: boolean, student?: Student, message?: string } => {
  const students = getStudents();
  const student = students.find(s => s.email === email && s.password === password);

  if (!student) {
    return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
  }

  if (student.status === StudentStatus.PENDING) {
    return { success: false, message: 'حسابك لا يزال قيد المراجعة. لا يمكنك الدخول حتى تتم الموافقة من قبل الإدارة.' };
  }

  if (student.status === StudentStatus.REJECTED) {
    return { success: false, message: 'تم رفض طلب تسجيلك. يرجى مراجعة شؤون الطلاب للحصول على التفاصيل.' };
  }

  return { success: true, student };
};

export const updateStudentStatus = (studentId: string, newStatus: StudentStatus): void => {
  const students = getStudents();
  const index = students.findIndex(s => s.id === studentId);
  if (index !== -1) {
    students[index].status = newStatus;
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  }
};
