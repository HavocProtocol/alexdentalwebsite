
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, LogIn, AlertCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { loginStudent } from '../services/dataService';

export const StudentLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await loginStudent(formData.email, formData.password);
    setLoading(false);
    
    if (result.success && result.student) {
      localStorage.setItem('student_session', JSON.stringify(result.student));
      navigate('/student/dashboard');
    } else {
      setError(result.message || 'حدث خطأ غير متوقع');
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
