
import { PatientCase, CaseStatus, Student } from '../types';
import { STATUS_LABELS } from '../constants';

// For Admin Dashboard simulation and logs

// 1. Group Message (Sanitized)
export const formatNewCaseMessage = (patientCase: PatientCase): string => {
  return `
📢 *حالة جديدة متاحة* 🦷

🆔 *رقم الحالة:* ${patientCase.id}
🎂 *العمر:* ${patientCase.age}
⚧ *الجنس:* ${patientCase.gender}
📍 *المنطقة:* ${patientCase.district}

🛑 *الشكوى الرئيسية:*
${patientCase.problems.map(p => `- ${p}`).join('\n')}

⚠️ *تنبيه:* بيانات المريض مخفية حفاظاً على الخصوصية. ستظهر فقط للطالب الذي يقوم بالحجز أولاً.

حالة الطلب: *بانتظار الحجز*
  `.trim();
};

// 2. Private Message to Student (Full Details)
export const formatPrivateStudentMessage = (patientCase: PatientCase): string => {
  return `
✅ *تم إسناد الحالة لك بنجاح!*

📝 *بيانات المريض:*
🆔 الرقم: ${patientCase.id}
👤 الاسم: ${patientCase.fullName}
📞 الهاتف: ${patientCase.phone}

🏥 *التاريخ المرضي:*
${patientCase.medicalHistory.length > 0 ? patientCase.medicalHistory.map(m => `⚠️ ${m}`).join('\n') : "لا توجد أمراض مزمنة معلنة"}

📝 *ملاحظات:*
${patientCase.medicalNotes || "لا يوجد"}

يرجى التواصل مع المريض فوراً. أنت المسؤول الوحيد عن هذه الحالة الآن.
  `.trim();
};

export const formatStatusUpdateMessage = (patientCase: PatientCase, newStatus: CaseStatus): string => {
  return `🔄 تحديث: حالة رقم ${patientCase.id} أصبحت ${STATUS_LABELS[newStatus]}`;
};

export const formatAssignmentMessage = (patientCase: PatientCase, student: Student): string => {
  return `🔒 تم حجز الحالة رقم ${patientCase.id} بواسطة ${student.fullName}`;
};

export const sendToTelegram = async (message: string): Promise<boolean> => {
  console.log("%c 📤 Sending to Telegram Group... ", "background: #229ED9; color: white; padding: 4px; border-radius: 4px;");
  console.log(message);
  return true;
};

export const sendPrivateTelegramMessage = async (message: string, studentName: string): Promise<boolean> => {
  console.log(`%c 🔒 Sending Private DM to ${studentName}... `, "background: #10b981; color: white; padding: 4px; border-radius: 4px;");
  console.log(message);
  return true;
}
