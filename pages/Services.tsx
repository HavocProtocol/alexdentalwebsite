
import React, { useEffect } from 'react';
import { Stethoscope, HeartPulse, Sparkles, Smile, Scissors, Baby, Activity, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Services: React.FC = () => {
  useEffect(() => {
    document.title = "خدماتنا | عيادة طب الأسنان التعليمية";
  }, []);

  const services = [
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "الحشوات وعلاج التسوس",
      desc: "علاج تسوس الأسنان باستخدام أحدث مواد الحشو التجميلي التي تعيد للسن شكله ووظيفته الطبيعية.",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: <Activity className="h-8 w-8" />,
      title: "علاج الجذور وحشو العصب",
      desc: "علاج آلام الأسنان الشديدة والتهابات العصب باستخدام أحدث التقنيات للحفاظ على الأسنان الطبيعية.",
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      icon: <HeartPulse className="h-8 w-8" />,
      title: "علاج اللثة وتنظيف الجير",
      desc: "جلسات تنظيف وإزالة الجير للحفاظ على صحة اللثة ومنع النزيف والروائح الكريهة.",
      color: "text-red-600",
      bg: "bg-red-50"
    },
    {
      icon: <Smile className="h-8 w-8" />,
      title: "التركيبات المتحركة",
      desc: "تعويض الأسنان المفقودة بتركيبات جزئية أو أطقم كاملة لتحسين المضغ والمظهر العام.",
      color: "text-orange-600",
      bg: "bg-orange-50"
    },
    {
      icon: <Scissors className="h-8 w-8" />,
      title: "خلع الأسنان والجراحات البسيطة",
      desc: "إزالة الأسنان المتضررة أو بقايا الجذور بأمان تام وتحت تعقيم صارم.",
      color: "text-gray-600",
      bg: "bg-gray-50"
    },
    {
      icon: <Baby className="h-8 w-8" />,
      title: "طب أسنان الأطفال",
      desc: "رعاية خاصة بأسنان الأطفال، تشمل الحشوات، الخلع، وجلسات الفلورايد الوقائية.",
      color: "text-green-600",
      bg: "bg-green-50"
    }
  ];

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-medical-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold mb-4">خدمات طبية شاملة</h1>
          <p className="text-xl text-medical-100 max-w-2xl mx-auto">
            نقدم مجموعة واسعة من خدمات طب الأسنان الأساسية والمتقدمة مجاناً أو بتكلفة رمزية، تحت إشراف أكاديمي صارم.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className={`w-14 h-14 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mb-4`}>
                {s.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">هل تعاني من إحدى هذه المشاكل؟</h2>
          <p className="text-lg text-gray-600 mb-8">
            لا تتردد في تسجيل بياناتك الآن. سيقوم فريقنا بمراجعة حالتك وتوجيهك للطالب المناسب لبدء العلاج.
          </p>
          <Link
            to="/submit"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-medical-600 hover:bg-medical-700 shadow-md"
          >
            حجز موعد جديد
            <ChevronLeft className="mr-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
