
import React, { useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export const BeforeAfter: React.FC = () => {
  useEffect(() => {
    document.title = "قبل وبعد | عيادة طب الأسنان التعليمية";
  }, []);

  const cases = [
    {
      id: 1,
      title: "تجميل الأسنان الأمامية المكسورة",
      desc: "حالة لمريض يعاني من كسر في القواطع الأمامية العلوية نتيجة حادث بسيط. تم استعادة الشكل الطبيعي للسن باستخدام حشوات الكومبوزيت التجميلية عالية الجودة، مع مطابقة دقيقة للون وملمس الأسنان المجاورة لابتسامة طبيعية تماماً.",
      before: "https://images.unsplash.com/photo-1609607847926-6d91557d9b87?auto=format&fit=crop&q=80&w=500",
      after: "https://images.unsplash.com/photo-1606811971618-4486d14f3f72?auto=format&fit=crop&q=80&w=500"
    },
    {
      id: 2,
      title: "إزالة الجير العميق وتلميع الأسنان",
      desc: "مريض يعاني من تراكم شديد للجير والتهابات في اللثة مع تصبغات ناتجة عن التدخين والشاي. تم إجراء جلسة تنظيف شاملة (Scaling) وتلميع (Polishing)، مما أدى إلى استعادة اللون الطبيعي للأسنان وتوقف نزيف اللثة.",
      before: "https://plus.unsplash.com/premium_photo-1661777196224-bfda51e61172?auto=format&fit=crop&q=80&w=500",
      after: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=500"
    },
    {
      id: 3,
      title: "علاج تسوس عميق وحشو ضوئي",
      desc: "تسوس عميق في الضرس السفلي كاد يصل إلى العصب. تم إزالة التسوس بالكامل تحت التخدير الموضعي، ووضع حشوة ضوئية (ليزر) تعيد للضرس وظيفته في المضغ وتمنع حساسية الأسنان.",
      before: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=500",
      after: "https://images.unsplash.com/photo-1588776813186-6f4d5d6f469a?auto=format&fit=crop&q=80&w=500"
    },
    {
      id: 4,
      title: "إعادة بناء سن متهدم",
      desc: "سن متهدم بشكل كبير نتيجة تسوس قديم وإهمال. تم عمل علاج جذور (حشو عصب) ثم بناء السن باستخدام دعامات فايبر وحشوة تجميلية، مما أنقذ السن من الخلع.",
      before: "https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?auto=format&fit=crop&q=80&w=500",
      after: "https://images.unsplash.com/photo-1570303345332-e3e7df5d1658?auto=format&fit=crop&q=80&w=500"
    }
  ];

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
           <div className="inline-block p-3 bg-medical-50 rounded-full mb-4">
             <Sparkles className="h-8 w-8 text-medical-600" />
           </div>
           <h1 className="text-4xl font-extrabold text-gray-900 mb-4">معرض الحالات: قبل وبعد</h1>
           <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
             شاهد نتائج العلاج الحقيقية التي قام بها طلابنا تحت إشراف الأساتذة. هذه الصور توضح جودة العمل والدقة في استعادة وظيفة وجمال الأسنان.
           </p>
        </div>

        <div className="space-y-20">
           {cases.map((c, idx) => (
             <div key={c.id} className="flex flex-col lg:flex-row gap-10 items-center bg-gray-50 rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100">
                {/* Description */}
                <div className="lg:w-1/3 text-center lg:text-right order-2 lg:order-1">
                   <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{c.title}</h2>
                   <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                     {c.desc}
                   </p>
                   <div className="inline-flex items-center gap-2 text-medical-700 font-bold bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200">
                      <span>النتيجة النهائية</span>
                      <ArrowRight className="h-5 w-5" />
                   </div>
                </div>

                {/* Images */}
                <div className="lg:w-2/3 w-full order-1 lg:order-2">
                   <div className="flex flex-col sm:flex-row gap-6">
                     <div className="flex-1 relative group overflow-hidden rounded-2xl shadow-md border-4 border-white">
                        <img src={c.before} alt="قبل العلاج" className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
                          قبل العلاج
                        </div>
                     </div>
                     
                     <div className="hidden sm:flex items-center justify-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg z-10 text-medical-500">
                          <ArrowRight className="h-6 w-6" />
                        </div>
                     </div>
                     
                     <div className="flex-1 relative group overflow-hidden rounded-2xl shadow-md border-4 border-white">
                        <img src={c.after} alt="بعد العلاج" className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute top-4 right-4 bg-medical-600/90 text-white px-4 py-1 rounded-full text-sm font-bold backdrop-blur-sm shadow-lg">
                          بعد العلاج
                        </div>
                     </div>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
