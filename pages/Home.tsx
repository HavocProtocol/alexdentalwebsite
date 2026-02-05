
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, UserCheck, Calendar, Activity, ChevronLeft, Star, Quote } from 'lucide-react';

export const Home: React.FC = () => {
  
  useEffect(() => {
    document.title = "الرئيسية | خدمات طب الأسنان - جامعة الإسكندرية";
  }, []);

  const testimonials = [
    {
      name: "أحمد محمود",
      location: "الإسكندرية",
      text: "تجربة رائعة بكل المقاييس! كنت متخوفاً في البداية من فكرة العلاج على يد طالب، لكن الإشراف الأكاديمي المتميز والاهتمام بأدق التفاصيل جعلني أشعر بالاطمئنان التام."
    },
    {
      name: "فاطمة السيد",
      location: "المنتزه",
      text: "زرت العيادة لعلاج تسوس في عدة أسنان، وكانت المعاملة راقية جداً. الطالب الذي عالجني كان محترفاً ودقيقاً تحت إشراف أستاذ متخصص."
    },
    {
      name: "محمد عبد الرحمن",
      location: "سيدي جابر",
      text: "أفضل قرار اتخذته هو الحجز من خلال هذه المنصة. حصلت على تنظيف أسنان وحشو عصب بجودة عالية جداً وبدون أي تكلفة."
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative bg-medical-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="lg:w-2/3">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              علاج أسنان مجاني <br/>
              <span className="text-medical-500">تحت إشراف أكاديمي متخصص</span>
            </h1>
            <p className="mt-4 text-xl text-gray-300 max-w-2xl leading-relaxed">
              منصة رسمية تربط مرضى الأسنان بطلاب جامعة الإسكندرية. نلتزم بأعلى معايير السلامة ومكافحة العدوى، مع إشراف كامل من أعضاء هيئة التدريس لضمان جودة العلاج.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/submit"
                className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-lg font-bold rounded-lg text-medical-900 bg-white hover:bg-gray-50 shadow-lg transition-transform transform hover:-translate-y-1"
              >
                سجل بياناتك (للمرضى)
                <ChevronLeft className="mr-2 h-5 w-5" />
              </Link>
              <Link
                to="/services"
                className="inline-flex justify-center items-center px-8 py-4 border border-white text-lg font-bold rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                تعرف على الخدمات
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-medical-600 font-semibold tracking-wide uppercase">نظام العمل</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              إجراءات دقيقة لضمان سلامتك
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-medical-100 text-medical-600 mb-6">
                <ClipboardList className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">1. التسجيل والإفصاح الطبي</h3>
              <p className="text-gray-600">
                تسجيل دقيق للبيانات والتاريخ المرضي لضمان توجيهك للطالب المناسب لحالتك الصحية.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-medical-100 text-medical-600 mb-6">
                <UserCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">2. مراجعة الإدارة</h3>
              <p className="text-gray-600">
                يقوم المشرفون بمراجعة طلبات الطلاب لاستلام الحالات للتأكد من كفاءة الطالب في التعامل مع حالتك.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-medical-100 text-medical-600 mb-6">
                <Activity className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">3. العلاج الآمن</h3>
              <p className="text-gray-600">
                يتم العلاج داخل عيادات الكلية المجهزة بأحدث وسائل التعقيم وتحت إشراف الأساتذة.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section (New) */}
      <div className="py-20 bg-medical-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              ثقة المرضى هي شهادتنا الحقيقية
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              نفتخر بخدمة آلاف المرضى من أهالي الإسكندرية. إليكم بعض آراء من خاضوا تجربة العلاج في عياداتنا.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm relative">
                <Quote className="h-10 w-10 text-medical-100 absolute top-6 left-6" />
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3 border-t pt-4">
                  <div className="h-10 w-10 rounded-full bg-medical-100 flex items-center justify-center text-medical-700 font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-4 mb-6 md:mb-0">
            <Calendar className="h-10 w-10 text-medical-600" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">مواعيد العمل</h3>
              <p className="text-gray-600">طوال أيام الأسبوع عدا الجمعة والعطلات الرسمية</p>
            </div>
          </div>
          <div className="text-gray-500 text-sm max-w-md text-center md:text-left">
            * الإفصاح عن الأمراض المزمنة واجب لسلامتك وسلامة الفريق الطبي. جميع البيانات سرية.
          </div>
        </div>
      </div>
    </div>
  );
};
