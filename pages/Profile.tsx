
import React, { useEffect } from 'react';
import { User, Award, BookOpen, GraduationCap } from 'lucide-react';

export const Profile: React.FC = () => {
  useEffect(() => {
    document.title = "الملف الشخصي | عيادة طب الأسنان التعليمية";
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Cover */}
          <div className="h-48 bg-medical-900 relative">
             <div className="absolute inset-0 bg-medical-600 opacity-50"></div>
          </div>
          
          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="relative flex justify-center md:justify-start">
               <div className="-mt-16 bg-white p-2 rounded-full shadow-md">
                 <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                    <User className="h-16 w-16" />
                 </div>
               </div>
            </div>
            
            <div className="mt-6 text-center md:text-right">
               <h1 className="text-3xl font-bold text-gray-900">الاسم: [اسم الطالب المسؤول]</h1>
               <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                 <GraduationCap className="h-5 w-5 text-medical-600" />
                 <p className="text-medical-600 font-bold text-lg">طالب بالفرقة الرابعة - كلية طب الأسنان</p>
               </div>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
                      <User className="h-5 w-5 text-medical-600" /> نبذة تعريفية
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      أنا طالب بالفرقة الرابعة بكلية طب الأسنان، جامعة الإسكندرية. قمت بإنشاء هذه المنصة كجزء من نشاطي الطلابي والمجتمعي بهدف تسهيل وصول المرضى لخدمات العلاج المجاني التي نقدمها في العيادات التعليمية، ولتنظيم عملية حجز الحالات لزملائي الطلاب، كل ذلك تحت الإشراف الكامل لأساتذة الكلية.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
                        <Award className="h-5 w-5 text-medical-600" /> الدراسة الحالية
                      </h2>
                      <ul className="space-y-2 text-gray-600">
                         <li className="flex items-center gap-2"><div className="w-2 h-2 bg-medical-400 rounded-full"></div> طالب مقيد بالفرقة الرابعة</li>
                         <li className="flex items-center gap-2"><div className="w-2 h-2 bg-medical-400 rounded-full"></div> دراسة المناهج الإكلينيكية (جراحة، علاج جذور، حشوات، تركيبات)</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
                        <BookOpen className="h-5 w-5 text-medical-600" /> الهدف من المنصة
                      </h2>
                      <p className="text-gray-600">
                         المساهمة في خدمة المجتمع السكندري وتوفير وقت وجهد المرضى في البحث عن علاج، مع ضمان حصول الطلاب على التدريب العملي اللازم لمتطلبات التخرج.
                      </p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
