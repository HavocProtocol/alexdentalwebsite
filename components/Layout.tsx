
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stethoscope, ShieldCheck, UserCog, GraduationCap, Scale, FileText, Lock } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');
  const isStudent = location.pathname.includes('/student');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-t-4 border-medical-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-medical-50 p-2 rounded-full group-hover:bg-medical-100 transition-colors">
                <Stethoscope className="h-8 w-8 text-medical-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 leading-none">عيادة الأسنان التعليمية</span>
                <span className="text-sm text-gray-500 mt-1">طلاب جامعة الإسكندرية</span>
              </div>
            </Link>

            <nav className="flex gap-4">
              {(!isAdmin && !isStudent) && (
                <>
                  <Link 
                    to="/submit" 
                    className="hidden md:inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-medical-600 hover:bg-medical-700 shadow-sm transition-all"
                  >
                    حجز موعد جديد
                  </Link>
                  <Link 
                    to="/student/login" 
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-medical-700 bg-medical-50 hover:bg-medical-100 rounded-md transition-colors"
                  >
                    <GraduationCap className="h-5 w-5" />
                    <span className="hidden sm:inline">بوابة الطلاب</span>
                  </Link>
                </>
              )}
              
              <Link 
                to="/admin/login" 
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-medical-600 transition-colors"
              >
                <UserCog className="h-5 w-5" />
                <span className="hidden sm:inline">الإدارة</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
             {/* Brand & Copyright */}
             <div className="md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="h-6 w-6 text-medical-600" />
                  <span className="font-bold text-gray-900">المنصة الآمنة</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  منصة تعليمية غير هادفة للربح. جميع الحقوق محفوظة &copy; {new Date().getFullYear()}.
                </p>
             </div>

             {/* Legal Links */}
             <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">قانوني</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link to="/legal/terms" className="text-base text-gray-500 hover:text-medical-600 flex items-center gap-2">
                        <Scale className="h-4 w-4" /> الشروط والأحكام
                      </Link>
                    </li>
                    <li>
                      <Link to="/legal/privacy" className="text-base text-gray-500 hover:text-medical-600 flex items-center gap-2">
                         <Lock className="h-4 w-4" /> سياسة الخصوصية
                      </Link>
                    </li>
                    <li>
                      <Link to="/legal/disclaimer" className="text-base text-gray-500 hover:text-medical-600 flex items-center gap-2">
                         <FileText className="h-4 w-4" /> إخلاء المسؤولية
                      </Link>
                    </li>
                  </ul>
                </div>
                
                <div>
                   <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">للمرضى</h3>
                   <ul className="space-y-3">
                      <li>
                        <Link to="/legal/consent" className="text-base text-gray-500 hover:text-medical-600">
                          إقرار الإفصاح الطبي
                        </Link>
                      </li>
                      <li>
                        <Link to="/submit" className="text-base text-gray-500 hover:text-medical-600">
                          تسجيل حالة جديدة
                        </Link>
                      </li>
                   </ul>
                </div>

                <div>
                   <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">للطلاب</h3>
                   <ul className="space-y-3">
                      <li>
                        <Link to="/legal/student-liability" className="text-base text-gray-500 hover:text-medical-600">
                          حدود المسؤولية
                        </Link>
                      </li>
                      <li>
                        <Link to="/student/register" className="text-base text-gray-500 hover:text-medical-600">
                          تسجيل طالب جديد
                        </Link>
                      </li>
                   </ul>
                </div>
             </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-8 text-center">
            <p className="text-xs text-gray-400">
              هذه المنصة صممت لخدمة المجتمع التعليمي والمرضى في الإسكندرية. إخلاء مسؤولية: الإدارة غير مسؤولة عن أي اتفاقات تتم خارج نطاق المنصة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
