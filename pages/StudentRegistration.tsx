
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, UserPlus, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { registerStudent } from '../services/dataService';

export const StudentRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    universityId: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }
    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    if (!formData.termsAccepted) {
      setError('يجب الموافقة على شروط الطالب وحدود المسؤولية');
      return;
    }

    setLoading(true);
    const result = await registerStudent({
      fullName: formData.fullName,
      universityId: formData.universityId,
      email: formData.email,
      password: formData.password,
      // Track legal consent
      legalConsent: {
        termsAccepted: true,
        liabilityAccepted: true,
        timestamp: new Date().toISOString()
      }
    });
    setLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.message);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">تم إرسال طلبك بنجاح</h2>
          <p className="text-gray-600 mb-8">
            حسابك الآن <strong>قيد المراجعة</strong>. سيتم تفعيله بعد التحقق من بياناتك الجامعية من قبل الإدارة.
          </p>
          <Link 
            to="/student/login" 
            className="inline-block w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-medical-600 hover:bg-medical-700"
          >
            العودة لصفحة الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-medical-100 rounded-full flex items-center justify-center">
            <UserPlus className="h-8 w-8 text-medical-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">تسجيل طالب جديد</h2>
          <p className="mt-2 text-sm text-gray-600">انضم لفريق طب الأسنان بجامعة الإسكندرية</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">الاسم الكامل</label>
              <input name="fullName" type="text" required value={formData.fullName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-medical-500 focus:border-medical-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">الرقم الجامعي</label>
              <input name="universityId" type="text" required value={formData.universityId} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-medical-500 focus:border-medical-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">البريد الجامعي</label>
              <input name="email" type="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-medical-500 focus:border-medical-500" placeholder="student@alexu.edu.eg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">كلمة المرور</label>
              <input name="password" type="password" required value={formData.password} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-medical-500 focus:border-medical-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">تأكيد كلمة المرور</label>
              <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-medical-500 focus:border-medical-500" />
            </div>
            
            {/* Legal Checkbox */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
               <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                    className="mt-1 h-5 w-5 text-medical-600 rounded border-gray-300 focus:ring-medical-500"
                  />
                  <div className="flex-1 text-sm text-gray-700">
                     أقر بأنني طالب حالي بجامعة الإسكندرية، وأوافق على <Link to="/legal/student-liability" target="_blank" className="text-medical-600 hover:underline">حدود المسؤولية</Link> و <Link to="/legal/terms" target="_blank" className="text-medical-600 hover:underline">الشروط والأحكام</Link>.
                  </div>
               </label>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-medical-600 hover:bg-medical-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-500 disabled:bg-gray-400">
            {loading ? 'جاري التسجيل...' : 'تسجيل حساب'}
          </button>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-500">لديك حساب بالفعل؟ </span>
          <Link to="/student/login" className="font-medium text-medical-600 hover:text-medical-500">
            سجل دخولك من هنا
          </Link>
        </div>
      </div>
    </div>
  );
};
