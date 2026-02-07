
import React, { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle, ShieldAlert, Clock, UserCheck, FileText } from 'lucide-react';

export const FAQ: React.FC = () => {
  useEffect(() => {
    document.title = "الأسئلة الشائعة | عيادة طب الأسنان التعليمية";
  }, []);

  const faqs = [
    {
      category: "العلاج والأمان",
      questions: [
        {
          q: "هل العلاج آمن على يد طلاب؟",
          a: "نعم، آمن تماماً. الطلاب لا يعملون بمفردهم أبداً. كل خطوة، بدءاً من التشخيص وحتى العلاج النهائي، تتم تحت إشراف دقيق ومباشر من أساتذة الكلية المتخصصين. لا يُسمح للطالب بالانتقال للخطوة التالية إلا بعد اعتماد الخطوة السابقة من المشرف."
        },
        {
          q: "ما هي المواد المستخدمة في العلاج؟",
          a: "نستخدم أفضل الخامات الطبية المعتمدة عالمياً والمطابقة للمواصفات القياسية، وهي نفس المواد المستخدمة في العيادات الخاصة، ولكنها توفر مجاناً أو بسعر التكلفة في العيادات التعليمية."
        },
        {
          q: "كيف تضمنون التعقيم؟",
          a: "نطبق بروتوكولات صارمة لمكافحة العدوى. يتم تعقيم جميع الأدوات في وحدة تعقيم مركزية حديثة، ويتم تغليف الأدوات وتطهير وحدات الأسنان بالكامل بين كل مريض وآخر."
        }
      ]
    },
    {
      category: "الحجز والمواعيد",
      questions: [
        {
          q: "كم تستغرق الجلسة؟",
          a: "جلسات العلاج التعليمي عادة ما تستغرق وقتاً أطول من العيادات الخاصة (من ساعة إلى ساعتين)، وذلك لأن الطالب يحتاج لعرض عمله على المشرف في كل خطوة لضمان الدقة والجودة. نرجو من المرضى تفهم ذلك وسعة الصدر."
        },
        {
          q: "كيف يتم تحديد الموعد؟",
          a: "بعد تسجيل بياناتك على الموقع، يتم إضافتك لقائمة الانتظار. عندما يتوفر طالب يحتاج لعلاج حالتك كجزء من متطلباته الدراسية، سيقوم بالتواصل معك هاتفياً لتنسيق الموعد المناسب."
        },
        {
          q: "ماذا أفعل إذا أردت إلغاء الموعد؟",
          a: "يرجى التواصل مع الطالب المعالج قبل الموعد بـ 24 ساعة على الأقل. تغيبك بدون عذر يضر بمستقبل الطالب الدراسي وقد يؤدي لمنعك من الاستفادة من خدمات المنصة مستقبلاً."
        }
      ]
    },
    {
      category: "التكاليف والخدمات",
      questions: [
        {
          q: "هل العلاج مجاني بالكامل؟",
          a: "معظم الخدمات مجانية تماماً (مثل الكشف، التنظيف، الخلع). بعض الخدمات المتقدمة قد تتطلب دفع رسوم رمزية جداً لتغطية تكلفة المواد فقط (مثل التركيبات الثابتة أو الزراعة)، وسيتم إخبارك بذلك مسبقاً."
        },
        {
          q: "هل تعالجون الأطفال؟",
          a: "نعم، يوجد قسم خاص بطب أسنان الأطفال يقدم خدمات الحشوات، الخلع، وحافظات المسافة، مع مراعاة الحالة النفسية للطفل."
        },
        {
          q: "هل يوجد علاج تقويم؟",
          a: "علاج التقويم متوفر ولكن بقوائم انتظار طويلة نظراً للطلب الكبير ومحدودية المقاعد. يتم قبول الحالات بناءً على درجة التعقيد وحاجة الطلاب التعليمية."
        }
      ]
    }
  ];

  const [openIndex, setOpenIndex] = useState<string | null>("0-0");

  const toggleFAQ = (catIdx: number, qIdx: number) => {
    const key = `${catIdx}-${qIdx}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
           <div className="mx-auto w-20 h-20 bg-medical-100 rounded-full flex items-center justify-center mb-6">
             <HelpCircle className="h-10 w-10 text-medical-600" />
           </div>
           <h1 className="text-4xl font-extrabold text-gray-900">مركز المساعدة والأسئلة الشائعة</h1>
           <p className="mt-4 text-xl text-gray-600">كل ما تحتاج معرفته عن رحلة العلاج معنا</p>
        </div>

        <div className="space-y-12">
           {faqs.map((category, catIdx) => (
             <div key={catIdx}>
               <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-r-4 border-medical-500 pr-4">
                 {catIdx === 0 && <ShieldAlert className="h-6 w-6 text-medical-600" />}
                 {catIdx === 1 && <Clock className="h-6 w-6 text-medical-600" />}
                 {catIdx === 2 && <FileText className="h-6 w-6 text-medical-600" />}
                 {category.category}
               </h3>
               
               <div className="space-y-4">
                 {category.questions.map((faq, qIdx) => {
                   const isOpen = openIndex === `${catIdx}-${qIdx}`;
                   return (
                     <div key={qIdx} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300">
                        <button 
                          onClick={() => toggleFAQ(catIdx, qIdx)}
                          className={`w-full flex justify-between items-center p-6 text-right transition-colors ${isOpen ? 'bg-medical-50' : 'bg-white hover:bg-gray-50'}`}
                        >
                          <span className="font-bold text-lg text-gray-900">{faq.q}</span>
                          <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-medical-600' : ''}`} />
                        </button>
                        <div 
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                           <div className="p-6 pt-0 bg-medical-50 border-t border-medical-100 text-gray-700 leading-relaxed text-lg">
                             {faq.a}
                           </div>
                        </div>
                     </div>
                   );
                 })}
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
