
import { CaseStatus, StudentStatus } from './types';

export const DENTAL_PROBLEMS = [
  "حشو عصب (Root Canal)",
  "خلع الأسنان (Extraction)",
  "تنظيف جير (Scaling)",
  "تركيبات متحركة (Dentures)",
  "حشوات تجميلية",
  "علاج لثة",
  "طقم كامل",
  "تقويم أسنان",
  "أخرى"
];

export const CHRONIC_DISEASES = [
  "أمراض القلب (Heart Disease)",
  "مرض السكري (Diabetes)",
  "ارتفاع ضغط الدم (Hypertension)",
  "أمراض الكبد (Liver Disease)",
  "أمراض الكلى (Kidney Disease)",
  "أمراض الجهاز التنفسي (Respiratory Disease)",
  "أمراض مناعية (Autoimmune Disease)",
  "أمراض معدية (Infectious Diseases)",
  "التهاب الكبد الوبائي (Hepatitis)",
  "فيروس نقص المناعة البشرية (HIV/AIDS)",
  "اضطرابات النزيف / سيولة الدم (Bleeding Disorders)",
  "الحمل (Pregnancy)",
  "الحساسية من الأدوية (Drug Allergies)",
  "أمراض عصبية (Neurological Disorders)",
  "أمراض نفسية (Psychiatric Disorders)",
  "لا أعاني من أمراض مزمنة"
];

export const STATUS_LABELS: Record<CaseStatus, string> = {
  [CaseStatus.RECEIVED]: "تم استلام الطلب",
  [CaseStatus.UNDER_REVIEW]: "قيد المراجعة",
  [CaseStatus.SENT_TO_STUDENTS]: "متاح للطلاب",
  [CaseStatus.WAITING_ADMIN_APPROVAL]: "بانتظار موافقة الإدارة",
  [CaseStatus.APPROVED_FOR_TREATMENT]: "تمت الموافقة (قيد التواصل)",
  [CaseStatus.CONTACTED_PATIENT]: "تم التواصل مع المريض",
  [CaseStatus.IN_TREATMENT]: "قيد العلاج الفعلي",
  [CaseStatus.COMPLETED]: "تم الانتهاء من الحالة",
  [CaseStatus.CANCELLED]: "تم إلغاء الحالة",
};

export const STATUS_COLORS: Record<CaseStatus, string> = {
  [CaseStatus.RECEIVED]: "bg-gray-100 text-gray-800",
  [CaseStatus.UNDER_REVIEW]: "bg-yellow-100 text-yellow-800",
  [CaseStatus.SENT_TO_STUDENTS]: "bg-blue-100 text-blue-800",
  [CaseStatus.WAITING_ADMIN_APPROVAL]: "bg-purple-100 text-purple-800",
  [CaseStatus.APPROVED_FOR_TREATMENT]: "bg-indigo-100 text-indigo-800",
  [CaseStatus.CONTACTED_PATIENT]: "bg-teal-100 text-teal-800",
  [CaseStatus.IN_TREATMENT]: "bg-orange-100 text-orange-800",
  [CaseStatus.COMPLETED]: "bg-green-100 text-green-800",
  [CaseStatus.CANCELLED]: "bg-red-100 text-red-800",
};

export const STUDENT_STATUS_LABELS: Record<StudentStatus, string> = {
  [StudentStatus.PENDING]: "قيد المراجعة",
  [StudentStatus.APPROVED]: "نشط",
  [StudentStatus.REJECTED]: "مرفوض"
};

export const ALEXANDRIA_DISTRICTS = [
  "أبو قير",
  "المعمورة",
  "المندرة (بحري/قبلي)",
  "العصافرة (بحري/قبلي)",
  "ميامي",
  "سيدي بشر",
  "فيكتوريا",
  "السيوف",
  "لوران",
  "سان ستيفانو",
  "جليم",
  "سابا باشا",
  "بولكلي",
  "رشدي",
  "كفر عبده",
  "مصطفى كامل",
  "سيدي جابر",
  "سموحة",
  "سبورتنج",
  "كليوباترا",
  "كامب شيزار",
  "الإبراهيمية",
  "الشاطبي",
  "الأزاريطة",
  "محطة الرمل",
  "المنشية",
  "بحري / الأنفوشي",
  "محرم بك",
  "كرموز",
  "غيط العنب",
  "مينا البصل",
  "القباري",
  "الورديان",
  "المكس",
  "الدخيلة",
  "العجمي (البيطاش/الهانوفيل)",
  "أبيس",
  "العامرية",
  "برج العرب",
  "كينج مريوط"
];
