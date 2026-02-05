
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stethoscope, ShieldCheck, UserCog, GraduationCap, Scale, FileText, Lock, Menu, X } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');
  const isStudent = location.pathname.includes('/student');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-t-4 border-medical-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group z-10">
              <div className="bg-medical-50 p-2 rounded-full group-hover:bg-medical-100 transition-colors">
                <Stethoscope className="h-8 w-8 text-medical-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 leading-none">عيادة الأسنان التعليمية</span>
                <span className="text-sm text-gray-500 mt-1">طلاب جامعة الإسكندرية</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {!isAdmin && !isStudent && (
                <>
                  <Link to="/" className="text-gray-600 hover:text-medical-600 font-medium">الرئيسية</Link>
                  <Link to="/about" className="text-gray-600 hover:text-medical-600 font-medium">من نحن</Link>
                  <Link to="/services" className="text-gray-600 hover:text-medical-600 font-medium">خدماتنا</Link>
                  <Link to="/contact" className="text-gray-600 hover:text-medical-600 font-medium">تواصل معنا</Link>
                  
                  <div className="h-6 w-px bg-gray-300 mx-2"></div>

                  <Link 
                    to="/submit" 
                    className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-medical-600 hover:bg-medical-700 shadow-sm transition-all"
                  >
                    حجز موعد جديد
                  </Link>
                </>
              )}
              
              <div className="flex items-center gap-3">
                {!isAdmin && !isStudent && (
                  <Link 
                    to="/student/login" 
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-medical-700 bg-medical-50 hover:bg-medical-100 rounded-md transition-colors"
                  >
                    <GraduationCap className="h-4 w-4" />
                    <span>الطلاب</span>
                  </Link>
                )}
                <Link 
                  to="/admin/login" 
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 hover:text-medical-600 transition-colors"
                >
                  <UserCog className="h-4 w-4" />
                  <span>الإدارة</span>
                </Link>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 p-2"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 top-20 shadow-lg py-4 px-4 flex flex-col gap-4 animate-slide-up">
            {!isAdmin && !isStudent && (
              <>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-gray-700 font-medium">الرئيسية</Link>
                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-gray-700 font-medium">من نحن</Link>
                <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-gray-700 font-medium">خدماتنا</Link>
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-gray-700 font-medium">تواصل معنا</Link>
                <Link to="/submit" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-center rounded-lg bg-medical-600 text-white font-bold">حجز موعد جديد</Link>
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <Link to="/student/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 py-2 text-medical-700">
                    <GraduationCap className="h-5 w-5" /> بوابة الطلاب
                  </Link>
                </div>
              </>
            )}
             <Link to="/admin/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 py-2 text-gray-500">
                <UserCog className="h-5 w-5" /> دخول الإدارة
             </Link>
          </div>
        )}
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
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  منصة تعليمية غير هادفة للربح تابعة لكلية طب الأسنان - جامعة الإسكندرية.
                </p>
                <p className="text-xs text-gray-400">
                  جميع الحقوق محفوظة &copy; {new Date().getFullYear()}.
                </p>
             </div>

             {/* Links */}
             <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">روابط سريعة</h3>
                  <ul className="space-y-3">
                    <li><Link to="/about" className="text-gray-500 hover:text-medical-600">من نحن</Link></li>
                    <li><Link to="/services" className="text-gray-500 hover:text-medical-600">الخدمات العلاجية</Link></li>
                    <li><Link to="/contact" className="text-gray-500 hover:text-medical-600">تواصل معنا</Link></li>
                    <li><Link to="/submit" className="text-gray-500 hover:text-medical-600">حجز موعد</Link></li>
                  </ul>
                </div>

                <div>
                   <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">قانوني</h3>
                   <ul className="space-y-3">
                      <li>
                        <Link to="/legal/terms" className="text-gray-500 hover:text-medical-600 flex items-center gap-2">
                          <Scale className="h-4 w-4" /> الشروط والأحكام
                        </Link>
                      </li>
                      <li>
                        <Link to="/legal/privacy" className="text-gray-500 hover:text-medical-600 flex items-center gap-2">
                           <Lock className="h-4 w-4" /> سياسة الخصوصية
                        </Link>
                      </li>
                      <li>
                        <Link to="/legal/disclaimer" className="text-gray-500 hover:text-medical-600 flex items-center gap-2">
                           <FileText className="h-4 w-4" /> إخلاء المسؤولية
                        </Link>
                      </li>
                   </ul>
                </div>

                <div>
                   <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">للطلاب</h3>
                   <ul className="space-y-3">
                      <li>
                        <Link to="/legal/student-liability" className="text-gray-500 hover:text-medical-600">
                          حدود المسؤولية
                        </Link>
                      </li>
                      <li>
                        <Link to="/student/register" className="text-gray-500 hover:text-medical-600">
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
