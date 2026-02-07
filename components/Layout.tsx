
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stethoscope, ShieldCheck, UserCog, GraduationCap, Scale, FileText, Lock, Menu, X, Facebook, Instagram, Send, ChevronDown, User, Info, HelpCircle, FileImage, Newspaper } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');
  const isStudent = location.pathname.includes('/student');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    if (openDropdown === name) setOpenDropdown(null);
    else setOpenDropdown(name);
  };

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
                <span className="text-sm text-gray-500 mt-1">منصة الخدمات الطبية</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {!isAdmin && !isStudent && (
                <>
                  <Link to="/" className="text-gray-600 hover:text-medical-600 font-medium">الرئيسية</Link>
                  
                  {/* Info Dropdown */}
                  <div className="relative group">
                    <button className="flex items-center gap-1 text-gray-600 hover:text-medical-600 font-medium py-2">
                      عن المنصة <ChevronDown className="h-4 w-4" />
                    </button>
                    <div className="absolute right-0 top-full w-48 bg-white shadow-lg rounded-lg py-2 hidden group-hover:block border border-gray-100 animate-fade-in">
                      <Link to="/about" className="block px-4 py-2 text-gray-700 hover:bg-medical-50 hover:text-medical-600">من نحن</Link>
                      <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-medical-50 hover:text-medical-600">كلمة المدير</Link>
                      <Link to="/news" className="block px-4 py-2 text-gray-700 hover:bg-medical-50 hover:text-medical-600">أخبارنا</Link>
                    </div>
                  </div>

                  {/* Patient Dropdown */}
                  <div className="relative group">
                    <button className="flex items-center gap-1 text-gray-600 hover:text-medical-600 font-medium py-2">
                      للمرضى <ChevronDown className="h-4 w-4" />
                    </button>
                    <div className="absolute right-0 top-full w-48 bg-white shadow-lg rounded-lg py-2 hidden group-hover:block border border-gray-100 animate-fade-in">
                      <Link to="/services" className="block px-4 py-2 text-gray-700 hover:bg-medical-50 hover:text-medical-600">خدماتنا</Link>
                      <Link to="/before-after" className="block px-4 py-2 text-gray-700 hover:bg-medical-50 hover:text-medical-600">قبل وبعد</Link>
                      <Link to="/education" className="block px-4 py-2 text-gray-700 hover:bg-medical-50 hover:text-medical-600">تثقيف صحي</Link>
                      <Link to="/faq" className="block px-4 py-2 text-gray-700 hover:bg-medical-50 hover:text-medical-600">الأسئلة الشائعة</Link>
                    </div>
                  </div>

                  <Link to="/contact" className="text-gray-600 hover:text-medical-600 font-medium">اتصل بنا</Link>
                  
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
            <div className="lg:hidden flex items-center">
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
          <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full left-0 top-20 shadow-lg py-4 px-4 flex flex-col gap-2 h-[calc(100vh-80px)] overflow-y-auto animate-slide-up">
            {!isAdmin && !isStudent && (
              <>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-2 text-gray-700 font-medium hover:bg-gray-50 rounded">الرئيسية</Link>
                
                {/* Mobile Dropdown 1 */}
                <button onClick={() => toggleDropdown('info')} className="flex items-center justify-between w-full py-3 px-2 text-gray-700 font-medium hover:bg-gray-50 rounded">
                  <span>عن المنصة</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === 'info' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'info' && (
                  <div className="mr-4 space-y-2 border-r-2 border-medical-100 pr-2">
                    <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-gray-600 text-sm">من نحن</Link>
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-gray-600 text-sm">كلمة المدير</Link>
                    <Link to="/news" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-gray-600 text-sm">أخبارنا</Link>
                  </div>
                )}

                {/* Mobile Dropdown 2 */}
                <button onClick={() => toggleDropdown('patients')} className="flex items-center justify-between w-full py-3 px-2 text-gray-700 font-medium hover:bg-gray-50 rounded">
                  <span>للمرضى</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === 'patients' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'patients' && (
                  <div className="mr-4 space-y-2 border-r-2 border-medical-100 pr-2">
                    <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-gray-600 text-sm">خدماتنا</Link>
                    <Link to="/before-after" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-gray-600 text-sm">قبل وبعد</Link>
                    <Link to="/education" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-gray-600 text-sm">تثقيف صحي</Link>
                    <Link to="/faq" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-gray-600 text-sm">الأسئلة الشائعة</Link>
                  </div>
                )}

                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-2 text-gray-700 font-medium hover:bg-gray-50 rounded">اتصل بنا</Link>
                <Link to="/submit" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-center rounded-lg bg-medical-600 text-white font-bold mt-2">حجز موعد جديد</Link>
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <Link to="/student/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 py-3 px-2 text-medical-700 hover:bg-medical-50 rounded">
                    <GraduationCap className="h-5 w-5" /> بوابة الطلاب
                  </Link>
                </div>
              </>
            )}
             <Link to="/admin/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 py-3 px-2 text-gray-500 hover:bg-gray-50 rounded">
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
                  منصة تعليمية غير هادفة للربح تهدف لتقديم خدمات طبية متميزة للمجتمع.
                </p>
                {/* Social Media Icons */}
                <div className="flex items-center gap-4 mt-4">
                  <a href="#" className="bg-gray-100 p-2 rounded-full text-blue-600 hover:bg-blue-50 transition-colors" title="Facebook">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="bg-gray-100 p-2 rounded-full text-pink-600 hover:bg-pink-50 transition-colors" title="Instagram">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="bg-gray-100 p-2 rounded-full text-blue-400 hover:bg-blue-50 transition-colors" title="Telegram">
                    <Send className="h-5 w-5" />
                  </a>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  جميع الحقوق محفوظة &copy; {new Date().getFullYear()}.
                </p>
             </div>

             {/* Links */}
             <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">روابط سريعة</h3>
                  <ul className="space-y-3">
                    <li><Link to="/about" className="text-gray-500 hover:text-medical-600">من نحن</Link></li>
                    <li><Link to="/education" className="text-gray-500 hover:text-medical-600">تثقيف صحي</Link></li>
                    <li><Link to="/news" className="text-gray-500 hover:text-medical-600">آخر الأخبار</Link></li>
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
                   <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">الدعم</h3>
                   <ul className="space-y-3">
                      <li>
                        <Link to="/faq" className="text-gray-500 hover:text-medical-600">
                          الأسئلة الشائعة
                        </Link>
                      </li>
                      <li>
                        <Link to="/contact" className="text-gray-500 hover:text-medical-600">
                          اتصل بنا
                        </Link>
                      </li>
                   </ul>
                </div>
             </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-8 text-center">
            <p className="text-xs text-gray-400">
              هذه المنصة صممت لخدمة المجتمع التعليمي والمرضى. إخلاء مسؤولية: الإدارة غير مسؤولة عن أي اتفاقات تتم خارج نطاق المنصة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
