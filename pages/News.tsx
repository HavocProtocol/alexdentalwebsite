
import React, { useEffect } from 'react';
import { Calendar, ArrowLeft } from 'lucide-react';

export const News: React.FC = () => {
  useEffect(() => {
    document.title = "أخبارنا | عيادة طب الأسنان التعليمية";
  }, []);

  const newsItems = [
    {
      id: 1,
      title: "تحديث نظام الحجز الإلكتروني",
      date: "2024-03-15",
      summary: "تم إطلاق النسخة الجديدة من المنصة لتسهيل عملية تسجيل المرضى وتسريع وصولهم للخدمات العلاجية. يتضمن التحديث تحسينات في واجهة المستخدم وتسريع عملية ربط المريض بالطالب.",
      image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 2,
      title: "حملة التوعية بصحة الفم في المدارس",
      date: "2024-03-12",
      summary: "شارك طلاب الفرقة الرابعة في حملة توعوية لزيارة المدارس الابتدائية بالإسكندرية، حيث تم فحص أسنان الأطفال وتوزيع فرش ومعجون أسنان مجاناً لنشر ثقافة الوقاية.",
      image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 3,
      title: "نصائح طبية لشهر رمضان المبارك",
      date: "2024-03-10",
      summary: "نصائح هامة للحفاظ على صحة الفم والأسنان أثناء الصيام، وكيفية تجنب جفاف الفم ورائحة الفم الكريهة، وأفضل الأوقات لغسيل الأسنان خلال الشهر الفضيل.",
      image: "https://images.unsplash.com/photo-1618423691167-1f4a56c49605?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 4,
      title: "وصول أجهزة تعقيم حديثة للعيادات",
      date: "2024-02-25",
      summary: "حرصاً على سلامة المرضى ومكافحة العدوى، تم دعم العيادات التعليمية بأحدث أجهزة التعقيم (Autoclaves) من الفئة B التي تضمن تعقيماً كاملاً للأدوات الدقيقة.",
      image: "https://images.unsplash.com/photo-1584036561566-b93a901668d7?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 5,
      title: "ندوة علمية حول زراعة الأسنان",
      date: "2024-02-15",
      summary: "نظمت الكلية ندوة علمية لطلاب السنوات النهائية حول أحدث تقنيات زراعة الأسنان الرقمية، حاضر فيها نخبة من أساتذة القسم لرفع كفاءة الطلاب العلمية.",
      image: "https://images.unsplash.com/photo-1588776813186-6f4d5d6f469a?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 6,
      title: "افتتاح عيادات تخصصية جديدة",
      date: "2024-01-30",
      summary: "تم توسيع قسم العلاج التحفظي بإضافة 10 وحدات أسنان جديدة لاستيعاب عدد أكبر من المرضى وتقليل قوائم الانتظار للحشوات وعلاج الجذور.",
      image: "https://images.unsplash.com/photo-1516574187841-693083f049ce?auto=format&fit=crop&q=80&w=600"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
           <h1 className="text-4xl font-extrabold text-gray-900 mb-4">أخبار وأنشطة الكلية</h1>
           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
             تابع أحدث المستجدات، الأنشطة الطلابية، والمبادرات المجتمعية التي نقدمها.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {newsItems.map(item => (
             <div key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col h-full">
                <div className="h-56 overflow-hidden relative">
                   <img 
                     src={item.image} 
                     alt={item.title} 
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                     loading="lazy"
                   />
                   <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 flex items-center gap-1.5 shadow-md">
                      <Calendar className="h-3.5 w-3.5 text-medical-600" />
                      {new Date(item.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                   </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                   <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{item.title}</h3>
                   <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                     {item.summary}
                   </p>
                   <div className="mt-auto pt-4 border-t border-gray-50">
                     <button className="text-medical-600 text-sm font-bold hover:text-medical-800 flex items-center gap-1 transition-colors">
                       اقرأ المزيد <ArrowLeft className="h-4 w-4" />
                     </button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
