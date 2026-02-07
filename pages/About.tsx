
import React, { useEffect } from 'react';
import { GraduationCap, ShieldCheck, UserCheck, CheckCircle, User, Award } from 'lucide-react';

export const About: React.FC = () => {
  useEffect(() => {
    document.title = "من نحن | عيادة طب الأسنان التعليمية";
  }, []);

  const supervisors = [
    { 
      name: "أ.د. أحمد محمود", 
      title: "أستاذ دكتور - قسم جراحة الفم",
      desc: "خبرة أكثر من 25 عاماً في الجراحات الدقيقة وزراعة الأسنان. يشرف على الحالات الجراحية المعقدة لضمان أعلى معايير السلامة."
    },
    { 
      name: "د. منى السيد", 
      title: "مدرس - قسم العلاج التحفظي",
      desc: "متخصصة في تجميل الأسنان والحشوات الضوئية. تقوم بمراجعة خطوات الطلاب للتأكد من دقة الترميمات والناحية الجمالية."
    },
    { 
      name: "د. كريم حسن", 
      title: "مدرس مساعد - قسم علاج الجذور",
      desc: "يشرف على حالات علاج العصب، مع التركيز على استخدام أحدث تقنيات الميكروسكوب والأجهزة الدوارة."
    }
  ];

  const students = [
    { name: "علي كمال", role: "طالب بالفرقة الرابعة" },
    { name: "سارة علي", role: "طالبة امتياز" },
    { name: "عمر خالد", role: "طبيب مقيم (دراسات عليا)" },
    { name: "ليلى حسن", role: "طالبة بالفرقة الرابعة" },
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-medical-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold mb-6">رعاية طبية وأكاديمية.. يد بيد</h1>
          <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">
            مهمتنا تقديم خدمة مجتمعية راقية، وتخريج جيل من أطباء الأسنان على أعلى مستوى من الكفاءة والأخلاق المهنية.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Section 1: Who treats you? */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
          <div className="md:w-1/2">
            <div className="bg-medical-50 p-6 rounded-2xl">
                <GraduationCap className="h-12 w-12 text-medical-600 mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">من يقوم بالعلاج؟</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                في عياداتنا التعليمية، يقوم بالعلاج طلاب السنوات النهائية (الفرقة الرابعة والخامسة) وأطباء الامتياز. هؤلاء الطلاب قد اجتازوا سنوات من الدراسة النظرية والتدريب العملي المكثف على النماذج الصناعية قبل السماح لهم بالتعامل مع المرضى لضمان أعلى مستويات الأمان.
                </p>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800" 
              alt="Dental Student" 
              className="rounded-2xl shadow-lg w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Section 2: Supervision */}
        <div className="mb-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">دور الإشراف الأكاديمي (صمام الأمان)</h2>
                <p className="mt-4 text-xl text-gray-600">لا يتم اتخاذ أي خطوة علاجية دون موافقة المشرف</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="border border-gray-200 p-8 rounded-xl hover:border-medical-500 transition-colors">
                    <UserCheck className="h-10 w-10 text-medical-600 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">1. الفحص والتشخيص</h3>
                    <p className="text-gray-600">يقوم الأستاذ المشرف بمراجعة تشخيص الطالب وخطة العلاج المقترحة واعتمادها قبل البدء.</p>
                </div>
                <div className="border border-gray-200 p-8 rounded-xl hover:border-medical-500 transition-colors">
                    <ShieldCheck className="h-10 w-10 text-medical-600 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">2. أثناء العلاج</h3>
                    <p className="text-gray-600">يتابع المشرف خطوات الطالب مرحلة بمرحلة، خاصة في الإجراءات الدقيقة لضمان الدقة والسلامة.</p>
                </div>
                <div className="border border-gray-200 p-8 rounded-xl hover:border-medical-500 transition-colors">
                    <CheckCircle className="h-10 w-10 text-medical-600 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">3. الاستلام النهائي</h3>
                    <p className="text-gray-600">لا يغادر المريض العيادة إلا بعد تأكد المشرف من جودة العلاج المقدم ومطابقته للمواصفات.</p>
                </div>
            </div>
        </div>

        {/* Section 3: Academic Supervisors */}
        <div className="mb-20 bg-gray-50 rounded-3xl p-8 md:p-12">
           <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">هيئة الإشراف الأكاديمي</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">نخبة من أساتذة الكلية المتخصصين الذين يشرفون بشكل مباشر على سير العملية العلاجية والتعليمية.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {supervisors.map((prof, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-medical-600 text-center">
                  <div className="w-20 h-20 bg-medical-50 rounded-full mx-auto flex items-center justify-center mb-4">
                     <Award className="h-10 w-10 text-medical-700" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">{prof.name}</h3>
                  <p className="text-sm font-semibold text-medical-600 mt-1 mb-3">{prof.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{prof.desc}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Section 4: Students Team */}
        <div>
           <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900">فريق الطلاب المشاركين</h2>
              <p className="mt-2 text-gray-600">نماذج مشرفة من طلابنا المتميزين</p>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {students.map((member, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                     <User className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="font-bold text-gray-900">{member.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 bg-gray-100 inline-block px-2 py-1 rounded-full">{member.role}</p>
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};
