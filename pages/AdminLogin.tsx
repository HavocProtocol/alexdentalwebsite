import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this goes to backend auth
    if (password === 'admin') {
      localStorage.setItem('admin_token', 'valid');
      navigate('/admin/dashboard');
    } else {
      setError('كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-medical-100 rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-medical-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">تسجيل دخول المشرفين</h2>
          <p className="mt-2 text-sm text-gray-600">لوحة التحكم الخاصة بإدارة الحالات</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password" className="sr-only">كلمة المرور</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md rounded-b-md focus:outline-none focus:ring-medical-500 focus:border-medical-500 focus:z-10 sm:text-sm"
                placeholder="أدخل كلمة المرور"
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm font-medium text-center">{error}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-medical-600 hover:bg-medical-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-medical-500 group-hover:text-medical-400" />
              </span>
              دخول
            </button>
          </div>
          <div className="text-center">
            <span className="text-xs text-gray-400">ملحوظة: كلمة المرور للتجربة هي "admin"</span>
          </div>
        </form>
      </div>
    </div>
  );
};