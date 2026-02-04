
import { PatientCase, CaseStatus, Student } from '../types';
import { STATUS_LABELS } from '../constants';

// Only for client-side demo simulation logs
export const formatNewCaseMessage = (patientCase: PatientCase): string => {
  // PRIVACY: Do NOT include medical history or phone in public group
  return `
📢 *حالة جديدة متاحة* 🦷

🆔 *رقم الحالة:* ${patientCase.id}
🎂 *العمر:* ${patientCase.age}
⚧ *الجنس:* ${patientCase.gender}
📍 *المنطقة:* ${patientCase.district}

🛑 *الشكوى الرئيسية:*
${patientCase.problems.map(p => `- ${p}`).join('\n')}

⚠️ *تنبيه:* البيانات الطبية التفصيلية متاحة فقط للطالب المعالج بعد موافقة الإدارة.

حالة الطلب: *${STATUS_LABELS[CaseStatus.RECEIVED]}*
  `.trim();
};

export const formatPrivateStudentMessage = (patientCase: PatientCase): string => {
  // FULL DETAILS for Private DM after approval
  return `
✅ *تمت الموافقة على استلام الحالة*

🆔 *رقم الحالة:* ${patientCase.id}
👤 *اسم المريض:* ${patientCase.fullName}
📞 *رقم الهاتف:* ${patientCase.phone}

🏥 *التاريخ المرضي (هام جداً):*
${patientCase.medicalHistory.length > 0 ? patientCase.medicalHistory.map(m => `⚠️ ${m}`).join('\n') : "لا توجد أمراض مزمنة معلنة"}

📝 *ملاحظات طبية:*
${patientCase.medicalNotes || "لا يوجد"}

⚠️ *تذكير قانوني:*
أنت المسؤول طبياً وقانونياً عن هذه الحالة أمام الكلية. يرجى التواصل مع المريض فوراً والالتزام بمعايير مكافحة العدوى.
  `.trim();
};

export const formatStatusUpdateMessage = (patientCase: PatientCase, newStatus: CaseStatus): string => {
  let header = "🔄 *تحديث حالة*";
  let body = "";

  if (newStatus === CaseStatus.SENT_TO_STUDENTS) {
    header = "🚀 *حالة متاحة للطلاب*";
    body = `يرجى مراجعة تفاصيل الحالة رقم *${patientCase.id}* واختيارها من لوحة التحكم.`;
  } else if (newStatus === CaseStatus.COMPLETED) {
    header = "🎉 *تم الانتهاء*";
    body = `تم استكمال علاج الحالة رقم *${patientCase.id}* بنجاح. شكراً لجهودكم.`;
  } else if (newStatus === CaseStatus.CANCELLED) {
    header = "❌ *تم إلغاء الحالة*";
    body = `تم إلغاء الحالة رقم *${patientCase.id}*.`;
  } else {
    body = `تغيرت حالة الطلب رقم *${patientCase.id}* إلى: ${STATUS_LABELS[newStatus]}`;
  }

  return `
${header}
🆔 ${patientCase.id}
${body}
  `.trim();
};

export const formatAssignmentMessage = (patientCase: PatientCase, student: Student): string => {
  return `
⏳ *طلب استلام حالة*

الطالب: *${student.fullName}*
الرقم الجامعي: *${student.universityId}*
يطلب استلام الحالة رقم: *${patientCase.id}*

الحالة الآن: *بانتظار موافقة المشرف*
  `.trim();
};

export const sendToTelegram = async (message: string): Promise<boolean> => {
  console.log("%c 📤 Sending to Telegram Group... ", "background: #229ED9; color: white; padding: 4px; border-radius: 4px;");
  console.log(message);
  await new Promise(resolve => setTimeout(resolve, 800));
  return true;
};

export const sendPrivateTelegramMessage = async (message: string, studentName: string): Promise<boolean> => {
  console.log(`%c 🔒 Sending Private DM to ${studentName}... `, "background: #10b981; color: white; padding: 4px; border-radius: 4px;");
  console.log(message);
  await new Promise(resolve => setTimeout(resolve, 800));
  return true;
}
