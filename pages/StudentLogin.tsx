
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { GraduationCap, LogIn, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { loginStudent } from '../services/dataService';

export const StudentLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Extract redirect URL from query params
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect');

  // Effect: Check for existing session and redirect if valid
  useEffect(() => {
    const checkSession = () => {
      const localSession = localStorage.getItem('student_session');
      const sessionSession = sessionStorage.getItem('student_session');
      
      if (localSession || sessionSession) {
        try {
           // Verify JSON integrity
           if (localSession) JSON.parse(localSession);
           if (sessionSession) JSON.parse(sessionSession);
           
           // Valid session found, redirect to dashboard or requested URL
           navigate(redirectUrl || '/student/dashboard');
        } catch (e) {
           // Corrupted session data, clear it
           localStorage.removeItem('student_session');
           sessionStorage.removeItem('student_session');
        }
      }
    };
    
    checkSession();
  }, [navigate, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await loginStudent(formData.email, formData.password);
      setLoading(false);
      
      if (result.success && result.student) {
        const sessionData = JSON.stringify(result.student);
        
        try {
          if (rememberMe) {
            // Persistent Session
            localStorage.setItem('student_session', sessionData);
            // Ensure no conflicting session exists in session storage
            sessionStorage.removeItem('student_session'); 
          } else {
            // Temporary Session
            sessionStorage.setItem('student_session', sessionData);
            // Ensure no conflicting persistent session exists
            localStorage.removeItem('student_session'); 
          }
          
          // Navigate to redirect URL (Claim Page) or Dashboard
          navigate(redirectUrl || '/student/dashboard');
        } catch (storageError) {
          console.error("Storage write error:", storageError);
          setError('فشل حفظ بيانات الجلسة. قد تكون مساحة التخزين ممتلئة أو ملفات تعريف الارتباط محظورة.');
        }
      } else {
        setError(result.message || 'حدث خطأ غير متوقع');
      }
    } catch (err) {
      setLoading(false);
      setError('تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-medical-100 rounded-full flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-medical-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">دخول الطلاب</h2>
          <p className="mt-2 text-sm text-gray-600">بوابة طلاب طب الأسنان - جامعة الإسكندرية</p>
          
          {redirectUrl && (
              <div className="mt-4 bg-blue-50 text-blue-700 text-sm p-2 rounded border border-blue-100">
                  يرجى تسجيل الدخول أولاً لقبول الحالة
              </div>
          )}
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className={`p-4 rounded-md text-sm flex items-start gap-3 ${error.includes('قيد المراجعة') ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-800'}`}>
              {error.includes('قيد المراجعة') ? <Clock className="h-5 w-5 mt-0.5" /> : <AlertCircle className="h-5 w-5 mt-0.5" />}
              <div className="leading-relaxed font-medium">{error}</div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">البريد الإلكتروني</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-medical-500 focus:border-medical-500 sm:text-sm"
                placeholder="البريد الجامعي"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">كلمة المرور</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-medical-500 focus:border-medical-500 sm:text-sm"
                placeholder="كلمة المرور"
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-medical-600 focus:ring-medical-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="remember_me" className="mr-2 block text-sm text-gray-900 cursor-pointer select-none font-medium">
                تذكرني على هذا الجهاز
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-medical-600 hover:bg-medical-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-500 disabled:bg-gray-400"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
            <>
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <LogIn className="h-5 w-5 text-medical-500 group-hover:text-medical-400" />
            </span>
            دخول
            </>
            )}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-500">ليس لديك حساب؟ </span>
            <Link to="/student/register" className="font-medium text-medical-600 hover:text-medical-500">
              سجل حساب جديد
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
