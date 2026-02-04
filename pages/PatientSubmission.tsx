
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, Send, Loader2, User, FileText, ChevronRight, Activity, ShieldAlert, Scale, ExternalLink } from 'lucide-react';
import { DENTAL_PROBLEMS, ALEXANDRIA_DISTRICTS, CHRONIC_DISEASES } from '../constants';
import { saveCase, generateCaseId } from '../services/dataService';
import { formatNewCaseMessage, sendToTelegram } from '../services/telegramService';
import { CaseStatus, PatientCase } from '../types';

export const PatientSubmission: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Contact, 2: Medical, 3: Success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Form State
  const [contactData, setContactData] = useState({
    fullName: '',
    phone: '',
    gender: 'ذكر' as 'ذكر' | 'أنثى',
    age: '',
    district: '',
  });

  const [medicalData, setMedicalData] = useState({
    problems: [] as string[],
    medicalHistory: [] as string[],
    medicalNotes: '',
    additionalNotes: '',
    // Legal & Consents
    declaration: false, // Disease Disclosure
    termsAccepted: false, // Terms & Conditions
    privacyAccepted: false, // Privacy Policy
    disclaimerAccepted: false // Medical Disclaimer
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedUser = localStorage.getItem('alex_dental_patient');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setContactData(prev => ({ ...prev, ...parsed }));
        setStep(2); 
      } catch (e) {
        console.error("Failed to parse saved patient data");
      }
    }
  }, []);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => { const n = {...prev}; delete n[name]; return n; });
  };

  const handleMedicalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMedicalData(prev => ({ ...prev, [name]: value }));
  };

  const toggleProblem = (problem: string) => {
    setMedicalData(prev => {
      const exists = prev.problems.includes(problem);
      const updated = exists 
        ? prev.problems.filter(p => p !== problem)
        : [...prev.problems, problem];
      return { ...prev, problems: updated };
    });
    if (errors.problems) setErrors(prev => { const n = {...prev}; delete n.problems; return n; });
  };

  const toggleDisease = (disease: string) => {
    setMedicalData(prev => {
      // If choosing "None", clear others
      if (disease === "لا أعاني من أمراض مزمنة") {
        return { ...prev, medicalHistory: ["لا أعاني من أمراض مزمنة"] };
      }
      
      let updated = [...prev.medicalHistory];
      if (updated.includes("لا أعاني من أمراض مزمنة")) {
        updated = []; // Clear "None" if selecting a disease
      }

      if (updated.includes(disease)) {
        updated = updated.filter(d => d !== disease);
      } else {
        updated.push(disease);
      }
      return { ...prev, medicalHistory: updated };
    });
    if (errors.medicalHistory) setErrors(prev => { const n = {...prev}; delete n.medicalHistory; return n; });
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!contactData.fullName.trim()) newErrors.fullName = 'يرجى إدخال الاسم بالكامل';
    if (!contactData.phone.trim() || contactData.phone.length < 10) newErrors.phone = 'يرجى إدخال رقم هاتف صحيح';
    if (!contactData.age || parseInt(contactData.age) < 5 || parseInt(contactData.age) > 100) newErrors.age = 'عمر غير صحيح';
    if (!contactData.district) newErrors.district = 'يرجى اختيار المنطقة';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      localStorage.setItem('alex_dental_patient', JSON.stringify(contactData));
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (medicalData.problems.length === 0) newErrors.problems = 'يرجى اختيار مشكلة واحدة على الأقل';
    
    // Safety Validation
    if (medicalData.medicalHistory.length === 0) newErrors.medicalHistory = 'يرجى تحديد حالتك الصحية أو اختيار "لا أعاني من أمراض"';
    
    // Require notes if diseases are selected (excluding "None")
    const hasDiseases = medicalData.medicalHistory.length > 0 && !medicalData.medicalHistory.includes("لا أعاني من أمراض مزمنة");
    if (hasDiseases && !medicalData.medicalNotes.trim()) {
      newErrors.medicalNotes = 'يرجى كتابة تفاصيل الأدوية التي تتناولها أو تفاصيل المرض';
    }

    if (!medicalData.declaration) newErrors.declaration = 'يجب الإقرار بصحة البيانات للمتابعة';
    
    // Legal Checkboxes Validation
    if (!medicalData.termsAccepted) newErrors.termsAccepted = 'يجب الموافقة على الشروط والأحكام';
    if (!medicalData.privacyAccepted) newErrors.privacyAccepted = 'يجب الموافقة على سياسة الخصوصية';
    if (!medicalData.disclaimerAccepted) newErrors.disclaimerAccepted = 'يجب الموافقة على إخلاء المسؤولية الطبية';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) {
      const firstError = document.querySelector('.error-scroll-target');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      const newCase: PatientCase = {
        id: generateCaseId(),
        ...contactData,
        age: parseInt(contactData.age),
        email: '', 
        problems: medicalData.problems,
        medicalHistory: medicalData.medicalHistory,
        medicalNotes: medicalData.medicalNotes,
        isMedicalHistoryDeclared: medicalData.declaration,
        additionalNotes: medicalData.additionalNotes,
        status: CaseStatus.RECEIVED,
        submissionDate: new Date().toISOString(),
        statusHistory: [{
          status: CaseStatus.RECEIVED,
          timestamp: new Date().toISOString(),
          note: 'تم إنشاء الطلب (مع الإقرار الطبي والقانوني)'
        }],
        legalConsents: {
          termsAccepted: medicalData.termsAccepted,
          privacyAccepted: medicalData.privacyAccepted,
          medicalDisclaimerAccepted: medicalData.disclaimerAccepted,
          timestamp: new Date().toISOString()
        }
      };

      saveCase(newCase);
      const telegramMsg = formatNewCaseMessage(newCase);
      await sendToTelegram(telegramMsg);

      setSubmittedId(newCase.id);
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء الإرسال.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 3 && submittedId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl p-10 border-t-8 border-green-500">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">تم إرسال طلبك بنجاح!</h2>
          <p className="text-xl text-gray-600 mb-8">
            رقم الملف: <span className="font-mono font-bold text-medical-700 bg-gray-100 px-3 py-1 rounded">{submittedId}</span>
          </p>
          <div className="bg-blue-50 p-6 rounded-lg text-right">
            <h3 className="font-bold text-blue-800 mb-2">الخطوات القادمة:</h3>
            <ul className="list-disc list-inside text-blue-700 space-y-2">
              <li>ستتم مراجعة حالتك من قبل الإدارة الطبية.</li>
              <li>سيتم التواصل معك عبر الهاتف ({contactData.phone}) عند قبول الحالة.</li>
              <li>يرجى إحضار أي تحاليل أو أشعة سابقة معك في الموعد الأول.</li>
            </ul>
          </div>
          <button 
            onClick={() => {
              setMedicalData({ 
                problems: [], medicalHistory: [], medicalNotes: '', 
                additionalNotes: '', declaration: false, 
                termsAccepted: false, privacyAccepted: false, disclaimerAccepted: false 
              });
              setSubmittedId(null);
              setStep(2); 
            }}
            className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-medical-600 hover:bg-medical-700"
          >
            تسجيل حالة أخرى
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500">
        
        {/* Header */}
        <div className="bg-medical-600 py-6 px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {step === 1 ? 'تسجيل بيانات المريض' : 'التاريخ الطبي والشكوى'}
            </h1>
            <p className="text-medical-100 mt-2 text-sm">
              {step === 1 ? 'خطوة 1 من 2: البيانات الشخصية' : 'خطوة 2 من 2: الإفصاح الطبي والقانوني'}
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-white' : 'bg-medical-400'}`}></div>
            <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-white' : 'bg-medical-400'}`}></div>
          </div>
        </div>

        <div className="p-8">
          
          {/* --- STEP 1: CONTACT INFO --- */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              {/* Same as before */}
              <div className="flex items-center gap-2 mb-4 text-medical-700 bg-medical-50 p-3 rounded-lg">
                <User className="h-5 w-5" />
                <span className="font-bold">من فضلك أدخل بياناتك للتواصل (سرية وتستخدم للعلاج فقط)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الثلاثي</label>
                  <input
                    type="text"
                    name="fullName"
                    value={contactData.fullName}
                    onChange={handleContactChange}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-500 focus:ring-medical-500 px-4 py-3 border ${errors.fullName ? 'border-red-500' : ''}`}
                    placeholder="مثال: أحمد محمد علي"
                  />
                  {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف (واتساب متاح)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactData.phone}
                    onChange={handleContactChange}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-500 focus:ring-medical-500 px-4 py-3 border ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="01xxxxxxxxx"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">العمر</label>
                    <input
                      type="number"
                      name="age"
                      value={contactData.age}
                      onChange={handleContactChange}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-500 focus:ring-medical-500 px-4 py-3 border ${errors.age ? 'border-red-500' : ''}`}
                    />
                     {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الجنس</label>
                    <select
                      name="gender"
                      value={contactData.gender}
                      onChange={handleContactChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-500 focus:ring-medical-500 px-4 py-3 border"
                    >
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المنطقة السكنية</label>
                  <select
                    name="district"
                    value={contactData.district}
                    onChange={handleContactChange}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-500 focus:ring-medical-500 px-4 py-3 border ${errors.district ? 'border-red-500' : ''}`}
                  >
                    <option value="">-- اختر المنطقة --</option>
                    {ALEXANDRIA_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {errors.district && <p className="mt-1 text-sm text-red-600">{errors.district}</p>}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleNextStep}
                  className="flex items-center gap-2 px-8 py-3 bg-medical-600 text-white rounded-lg hover:bg-medical-700 transition-colors shadow-sm font-bold"
                >
                  التالي: الإفصاح الطبي
                  <ChevronRight className="h-5 w-5 rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* --- STEP 2: MEDICAL INFO & LEGAL --- */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
              
              {/* Medical History Section */}
              <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                  <Activity className="h-6 w-6 text-red-600" />
                  الإفصاح عن الأمراض المزمنة (إلزامي لسلامتك)
                </h3>
                
                {errors.medicalHistory && (
                  <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md text-sm font-bold error-scroll-target">
                    {errors.medicalHistory}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  {CHRONIC_DISEASES.map(disease => (
                    <label 
                      key={disease}
                      className={`
                        flex items-center p-3 rounded-lg border cursor-pointer transition-all
                        ${medicalData.medicalHistory.includes(disease) 
                          ? 'bg-red-100 border-red-300 shadow-sm' 
                          : 'bg-white border-gray-200 hover:bg-gray-50'}
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={medicalData.medicalHistory.includes(disease)}
                        onChange={() => toggleDisease(disease)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded ml-2"
                      />
                      <span className="text-sm font-medium text-gray-800">{disease}</span>
                    </label>
                  ))}
                </div>

                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <label className="block text-sm font-medium text-red-900 mb-2">
                    تفاصيل إضافية عن حالتك الصحية / الأدوية التي تتناولها (إلزامي في حالة وجود أمراض):
                  </label>
                  <textarea
                    name="medicalNotes"
                    value={medicalData.medicalNotes}
                    onChange={handleMedicalChange}
                    rows={3}
                    className={`block w-full rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 px-4 py-2 border ${errors.medicalNotes ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="أذكر هنا أسماء الأدوية، العمليات السابقة، أو تفاصيل المرض..."
                  />
                  {errors.medicalNotes && <p className="mt-1 text-sm text-red-600 font-bold">{errors.medicalNotes}</p>}
                </div>
              </div>

              {/* Dental Complaint */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-medical-600" />
                  الشكوى الخاصة بالأسنان
                </h3>
                
                {errors.problems && (
                   <div className="mb-4 p-2 text-red-600 text-sm font-bold">{errors.problems}</div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DENTAL_PROBLEMS.map(problem => (
                    <div 
                      key={problem}
                      onClick={() => toggleProblem(problem)}
                      className={`
                        cursor-pointer p-4 rounded-lg border-2 transition-all flex items-center justify-between
                        ${medicalData.problems.includes(problem) 
                          ? 'border-medical-500 bg-medical-50 text-medical-800 shadow-md' 
                          : 'border-gray-200 hover:border-medical-200 hover:bg-gray-50 text-gray-700'}
                      `}
                    >
                      <span className="font-medium">{problem}</span>
                      {medicalData.problems.includes(problem) && <CheckCircle className="h-5 w-5 text-medical-600" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات إضافية عن الشكوى (اختياري)</label>
                <textarea
                  name="additionalNotes"
                  value={medicalData.additionalNotes}
                  onChange={handleMedicalChange}
                  rows={2}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-500 focus:ring-medical-500 px-4 py-2 border"
                  placeholder="مثال: الألم يزداد مع المشروبات الباردة..."
                />
              </div>

              {/* LEGAL & SAFETY DECLARATIONS (MANDATORY) */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 pb-2 border-b">
                   <Scale className="h-5 w-5 text-medical-600" />
                   الموافقات القانونية والطبية
                </h3>

                {/* 1. Disease Declaration */}
                <div className={`p-4 rounded-lg border ${errors.declaration ? 'bg-red-50 border-red-300' : 'bg-white border-gray-300'}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="declaration"
                      checked={medicalData.declaration}
                      onChange={(e) => {
                         setMedicalData(prev => ({ ...prev, declaration: e.target.checked }));
                         if (e.target.checked && errors.declaration) setErrors(prev => { const n = {...prev}; delete n.declaration; return n; });
                      }}
                      className="mt-1 h-5 w-5 text-medical-600 rounded border-gray-300 focus:ring-medical-500"
                    />
                    <div className="flex-1">
                       <span className="font-bold text-gray-900 flex items-center gap-2">
                         <ShieldAlert className="h-5 w-5 text-red-600" />
                         إقرار صحة البيانات (إلزامي)
                       </span>
                       <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                         أقر أنا المريض بأن جميع البيانات الطبية المذكورة أعلاه صحيحة، وأنني لم أخفِ أي أمراض مزمنة أو معدية. 
                         أفهم أن عدم الإفصاح قد يعرضني ويعرض الطبيب المعالج للخطر، وأتحمل المسؤولية الكاملة عن ذلك.
                       </p>
                    </div>
                  </label>
                  {errors.declaration && <p className="mt-2 text-sm text-red-600 font-bold px-8">{errors.declaration}</p>}
                </div>

                {/* 2. Terms & Conditions */}
                <div className={`p-4 rounded-lg border ${errors.termsAccepted ? 'bg-red-50 border-red-300' : 'bg-white border-gray-300'}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={medicalData.termsAccepted}
                      onChange={(e) => {
                         setMedicalData(prev => ({ ...prev, termsAccepted: e.target.checked }));
                         if (e.target.checked && errors.termsAccepted) setErrors(prev => { const n = {...prev}; delete n.termsAccepted; return n; });
                      }}
                      className="mt-1 h-5 w-5 text-medical-600 rounded border-gray-300 focus:ring-medical-500"
                    />
                    <div className="flex-1">
                       <span className="font-bold text-gray-900">الموافقة على الشروط والأحكام</span>
                       <div className="text-sm text-gray-700 mt-1">
                         أوافق على أن المنصة هي وسيط تقني فقط، وأن العلاج يتم بواسطة طلاب تحت الإشراف، ولا تضمن المنصة نتائج العلاج.
                         <Link to="/legal/terms" target="_blank" className="text-medical-600 hover:underline mr-1 inline-flex items-center">
                           (قراءة التفاصيل <ExternalLink className="h-3 w-3 mr-1"/>)
                         </Link>
                       </div>
                    </div>
                  </label>
                  {errors.termsAccepted && <p className="mt-2 text-sm text-red-600 font-bold px-8">{errors.termsAccepted}</p>}
                </div>

                {/* 3. Privacy Policy */}
                <div className={`p-4 rounded-lg border ${errors.privacyAccepted ? 'bg-red-50 border-red-300' : 'bg-white border-gray-300'}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={medicalData.privacyAccepted}
                      onChange={(e) => {
                         setMedicalData(prev => ({ ...prev, privacyAccepted: e.target.checked }));
                         if (e.target.checked && errors.privacyAccepted) setErrors(prev => { const n = {...prev}; delete n.privacyAccepted; return n; });
                      }}
                      className="mt-1 h-5 w-5 text-medical-600 rounded border-gray-300 focus:ring-medical-500"
                    />
                    <div className="flex-1">
                       <span className="font-bold text-gray-900">سياسة الخصوصية</span>
                       <div className="text-sm text-gray-700 mt-1">
                         أوافق على جمع بياناتي ومعالجتها ومشاركتها مع الطالب المعالج وفقاً لسياسة الخصوصية.
                         <Link to="/legal/privacy" target="_blank" className="text-medical-600 hover:underline mr-1 inline-flex items-center">
                           (قراءة التفاصيل <ExternalLink className="h-3 w-3 mr-1"/>)
                         </Link>
                       </div>
                    </div>
                  </label>
                  {errors.privacyAccepted && <p className="mt-2 text-sm text-red-600 font-bold px-8">{errors.privacyAccepted}</p>}
                </div>

                 {/* 4. Medical Disclaimer */}
                 <div className={`p-4 rounded-lg border ${errors.disclaimerAccepted ? 'bg-red-50 border-red-300' : 'bg-white border-gray-300'}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={medicalData.disclaimerAccepted}
                      onChange={(e) => {
                         setMedicalData(prev => ({ ...prev, disclaimerAccepted: e.target.checked }));
                         if (e.target.checked && errors.disclaimerAccepted) setErrors(prev => { const n = {...prev}; delete n.disclaimerAccepted; return n; });
                      }}
                      className="mt-1 h-5 w-5 text-medical-600 rounded border-gray-300 focus:ring-medical-500"
                    />
                    <div className="flex-1">
                       <span className="font-bold text-gray-900">إخلاء المسؤولية الطبية</span>
                       <div className="text-sm text-gray-700 mt-1">
                         أقر بعلمي بأن مقدم الخدمة طالب تحت التدريب، وأن الحالات الطارئة جداً يجب أن تتوجه للمستشفى فوراً.
                         <Link to="/legal/disclaimer" target="_blank" className="text-medical-600 hover:underline mr-1 inline-flex items-center">
                           (قراءة التفاصيل <ExternalLink className="h-3 w-3 mr-1"/>)
                         </Link>
                       </div>
                    </div>
                  </label>
                  {errors.disclaimerAccepted && <p className="mt-2 text-sm text-red-600 font-bold px-8">{errors.disclaimerAccepted}</p>}
                </div>

              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-lg text-lg font-bold text-white shadow-md transition-all
                    ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-medical-600 hover:bg-medical-700 hover:shadow-lg transform hover:-translate-y-0.5'}
                  `}
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Send className="h-5 w-5 ml-2" />}
                  {isSubmitting ? 'جاري الإرسال' : 'إرسال الطلب'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
