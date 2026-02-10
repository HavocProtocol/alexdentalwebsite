
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, FileText, Lock, AlertTriangle, UserCheck, Scale, Printer, ChevronLeft, ShieldAlert } from 'lucide-react';

export const LegalDocs: React.FC = () => {
  const { docId } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [docId]);

  const handlePrint = () => {
    window.print();
  };

  const renderContent = () => {
    switch (docId) {
      case 'terms':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">الشروط والأحكام العامة</h1>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <h3 className="flex items-center gap-2 text-medical-700">
                <Scale className="h-6 w-6" /> 1. طبيعة المنصة (وسيط تقني)
              </h3>
              <p>
                هذه المنصة هي أداة تقنية تنظيمية فقط تهدف إلى الربط بين المرضى المتطوعين وطلاب طب الأسنان بجامعة الإسكندرية لأغراض تعليمية. 
                <strong>إدارة المنصة والمشرفون عليها ليسوا مقدمي خدمة طبية مباشرين</strong> عبر هذا الموقع، ولا يتحملون مسؤولية أي اتفاقات تتم بين الطالب والمريض خارج نطاق التنظيم الإداري.
              </p>

              <h3 className="flex items-center gap-2 text-medical-700">
                <UserCheck className="h-6 w-6" /> 2. صفة مقدمي الخدمة (الطلاب)
              </h3>
              <p>
                يقر المستخدم بأن جميع العلاجات تقدم بواسطة <strong>"طلاب" تحت التدريب</strong> وليسوا أطباء ممارسين مستقلين. يتم العمل تحت إشراف أعضاء هيئة التدريس بالكلية، ولكن الطالب هو المنفذ المباشر للإجراءات الطبية كجزء من متطلباته الدراسية.
              </p>

              <h3 className="flex items-center gap-2 text-medical-700">
                <AlertTriangle className="h-6 w-6" /> 3. عدم ضمان النتائج
              </h3>
              <p>
                نظراً للطبيعة التعليمية للخدمة المجانية، <strong>لا تقدم المنصة أو إدارتها أي ضمانات صريحة أو ضمنية بخصوص نتائج العلاج</strong>. قد تستغرق الجلسات وقتاً أطول من المعتاد في العيادات الخاصة، وقد تتطلب الحالة تحويلاً لمستويات أعلى من الخبرة حسب تقدير المشرف.
              </p>

              <h3 className="flex items-center gap-2 text-medical-700">
                <Shield className="h-6 w-6" /> 4. حدود المسؤولية الإدارية
              </h3>
              <p>
                تنحصر مسؤولية إدارة المنصة في التحقق الأولي من قيد الطالب بالجامعة وتسهيل عملية التواصل. الإدارة غير مسؤولة مدنياً أو جنائياً عن:
              </p>
              <ul className="list-disc list-inside mr-4 space-y-2">
                <li>القرارات الطبية التي يتخذها الطالب أو المشرف أثناء العلاج.</li>
                <li>أي مضاعفات طبية تنتج عن العلاج (تخضع لقوانين المسؤولية الطبية المعتادة داخل المستشفيات الجامعية).</li>
                <li>أي نزاع شخصي ينشأ بين الطالب والمريض.</li>
              </ul>
            </div>
          </div>
        );

      case 'disclaimer':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">إخلاء المسؤولية الطبية</h1>
            <div className="bg-red-50 border-r-4 border-red-500 p-6 rounded-lg mb-8">
              <p className="font-bold text-red-800 text-lg">
                تحذير: هذه المنصة لا تقدم خدمات الطوارئ. في حالة وجود ألم شديد غير محتمل، نزيف حاد، أو تورم يهدد التنفس، يجب التوجه فوراً إلى طوارئ مستشفى الجامعة أو أقرب مستشفى.
              </p>
            </div>
            
            <div className="prose prose-lg text-gray-700 max-w-none">
              <h3 className="text-gray-900 font-bold">1. الطبيعة الأكاديمية للعلاج</h3>
              <p>
                يوافق المريض على أن العلاج يتم في سياق أكاديمي تعليمي. هذا يعني أن الإجراءات قد تستغرق وقتاً أطول، وقد يشترك أكثر من طالب في العلاج، ويخضع كل إجراء لمراجعة المشرف، مما قد يتطلب تكرار بعض الخطوات لضمان الجودة.
              </p>

              <h3 className="text-gray-900 font-bold">2. قبول المخاطر</h3>
              <p>
                كما هو الحال في أي تدخل طبي أو جراحي، توجد مخاطر محتملة. بقبولك التسجيل، أنت تقر بمعرفتك بأن مقدم الخدمة طالب تحت التدريب، وتقبل المخاطر المرتبطة بذلك طالما تم الالتزام بمعايير الإشراف الجامعي.
              </p>

              <h3 className="text-gray-900 font-bold">3. الاستشارات الطبية</h3>
              <p>
                المعلومات المقدمة عبر المنصة أو رسائل التيليجرام لا تعتبر "استشارة طبية" نهائية ولا تغني عن الفحص السريري المباشر داخل العيادة. التشخيص النهائي يتم فقط على كرسي الأسنان.
              </p>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">سياسة الخصوصية وحماية البيانات</h1>
            
            <div className="prose prose-lg text-gray-700 max-w-none">
              <h3 className="flex items-center gap-2 text-medical-700">
                <Lock className="h-6 w-6" /> 1. جمع البيانات والغرض منه
              </h3>
              <p>
                نقوم بجمع البيانات الشخصية (الاسم، الهاتف، العمر، المنطقة) والبيانات الطبية (التاريخ المرضي، الشكوى) لغرض وحيد وهو: <strong>توفير فرص علاجية تعليمية مناسبة لحالتك</strong>. لا نستخدم البيانات لأي أغراض تسويقية أو تجارية.
              </p>

              <h3 className="flex items-center gap-2 text-medical-700">
                <FileText className="h-6 w-6" /> 2. مشاركة البيانات
              </h3>
              <p>
                بياناتك الحساسة (رقم الهاتف، التفاصيل الطبية الدقيقة) لا تظهر للعامة. يتم مشاركتها حصرياً مع:
              </p>
              <ul className="list-disc list-inside mr-4 space-y-2">
                <li>إدارة المنصة (لأغراض المراجعة والتدقيق).</li>
                <li>الطالب المعالج الذي يتم قبول حالتك من قبله رسمياً.</li>
              </ul>

              <h3 className="flex items-center gap-2 text-medical-700">
                <AlertTriangle className="h-6 w-6" /> 3. تقنيات النقل (تيليجرام)
              </h3>
              <p>
                يتم استخدام تطبيق تيليجرام لإرسال الإشعارات وتنسيق الحالات. على الرغم من أننا نستخدم قنوات خاصة ومشفرة، إلا أن نقل البيانات عبر الإنترنت يحمل دائماً نسبة من المخاطرة. باستخدامك للمنصة، أنت توافق على استخدام تيليجرام كوسيلة تواصل أساسية.
              </p>

              <h3 className="flex items-center gap-2 text-medical-700">
                <Shield className="h-6 w-6" /> 4. الاحتفاظ بالبيانات وحذفها
              </h3>
              <p>
                يتم الاحتفاظ بسجلات الحالات لأغراض المتابعة الطبية والإدارية. يحق للمريض طلب حذف بياناته من قاعدة بيانات المنصة الإلكترونية (وليس السجلات الطبية الورقية بالكلية) في أي وقت عبر التواصل مع الإدارة.
              </p>
            </div>
          </div>
        );
      
      case 'consent':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">موافقة المريض وإقرار الإفصاح الطبي</h1>
            <div className="bg-yellow-50 border-r-4 border-yellow-500 p-6 rounded-lg">
              <p className="font-bold text-gray-900">
                هذا الإقرار وثيقة قانونية ملزمة تحمي حقوقك وحقوق الطاقم الطبي.
              </p>
            </div>
            
            <div className="prose prose-lg text-gray-700 max-w-none mt-6">
              <h3 className="text-gray-900 font-bold">1. الموافقة على مشاركة المعلومات</h3>
              <p>
                أوافق بموجب هذا المستند على مشاركة بياناتي الطبية والشخصية مع طلاب ومشرفي كلية طب الأسنان بجامعة الإسكندرية لغرض تقييم حالتي وتلقي العلاج.
              </p>

              <h3 className="text-gray-900 font-bold">2. التعهد بصحة البيانات (هام جداً)</h3>
              <p>
                أتعهد بأنني قد أفصحت عن تاريخي المرضي بالكامل وبكل دقة، بما في ذلك الأمراض المزمنة (مثل السكر، الضغط، القلب)، الأمراض المعدية (مثل فيروس سي، الإيدز)، وأي أدوية أتناولها.
              </p>

              <h3 className="text-gray-900 font-bold">3. تحمل المسؤولية</h3>
              <p>
                أقر بمسؤوليتي الكاملة عن أي مضاعفات صحية قد تحدث نتيجة لإخفائي أي معلومات طبية أو تقديم بيانات غير صحيحة. وأخلي طرف الطالب المعالج وإدارة المنصة والجامعة من أي مسؤولية ناتجة عن عدم إفصاحي عن هذه المعلومات.
              </p>
            </div>
          </div>
        );

      case 'student-liability':
        return (
          <div className="space-y-6">
             <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">حدود مسؤولية الطلاب وحقوقهم</h1>
             
             <div className="prose prose-lg text-gray-700 max-w-none">
              <h3 className="text-gray-900 font-bold">1. النطاق التعليمي</h3>
              <p>
                الطالب ممارس للطب تحت التدريب. لا يحق للطالب ممارسة أي إجراء طبي خارج أسوار الكلية أو بدون إشراف، ولا يحق له تقاضي أجر مادي من المريض مقابل العلاج المجاني المقدم عبر الكلية.
              </p>

              <h3 className="text-gray-900 font-bold">2. حماية الطالب</h3>
              <p>
                تلتزم إدارة المنصة بحماية الطالب من أي ادعاءات قانونية تنتج عن:
              </p>
              <ul className="list-disc list-inside mr-4 space-y-2">
                <li>عدم إفصاح المريض عن أمراضه المزمنة أو المعدية.</li>
                <li>عدم التزام المريض بالتعليمات الطبية أو المواعيد.</li>
                <li>المضاعفات الطبية الواردة الحدوث والمذكورة في المراجع العلمية، طالما اتبع الطالب بروتوكول العلاج الصحيح تحت الإشراف.</li>
              </ul>

              <h3 className="text-gray-900 font-bold">3. حق الرفض</h3>
              <p>
                يحق للطالب (بعد استشارة المشرف) الاعتذار عن استكمال علاج حالة إذا تبين أن المريض غير متعاون، أو إذا كانت الحالة تفوق المستوى الأكاديمي للطالب، مع التزام الطالب بتوجيه المريض للقناة الصحيحة.
              </p>
             </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">الوثيقة غير موجودة</h2>
            <Link to="/" className="text-medical-600 hover:underline mt-4 block">العودة للصفحة الرئيسية</Link>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6 flex justify-between items-center print:hidden">
          <Link to="/" className="flex items-center text-gray-600 hover:text-medical-600 transition-colors">
            <ChevronLeft className="h-5 w-5 ml-1" />
            العودة للرئيسية
          </Link>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            <Printer className="h-5 w-5" />
            طباعة الوثيقة
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden print:shadow-none">
          <div className="flex flex-col md:flex-row min-h-[600px]">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-gray-50 border-l border-gray-200 p-6 print:hidden">
              <h3 className="font-bold text-gray-900 mb-4">الوثائق القانونية</h3>
              <nav className="space-y-2">
                <Link to="/legal/terms" className={`block px-3 py-2 rounded-md text-sm font-medium ${docId === 'terms' ? 'bg-medical-100 text-medical-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                  الشروط والأحكام
                </Link>
                <Link to="/legal/disclaimer" className={`block px-3 py-2 rounded-md text-sm font-medium ${docId === 'disclaimer' ? 'bg-medical-100 text-medical-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                  إخلاء المسؤولية الطبية
                </Link>
                <Link to="/legal/privacy" className={`block px-3 py-2 rounded-md text-sm font-medium ${docId === 'privacy' ? 'bg-medical-100 text-medical-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                  سياسة الخصوصية
                </Link>
                <Link to="/legal/consent" className={`block px-3 py-2 rounded-md text-sm font-medium ${docId === 'consent' ? 'bg-medical-100 text-medical-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                  موافقة المريض والإفصاح
                </Link>
                <Link to="/legal/student-liability" className={`block px-3 py-2 rounded-md text-sm font-medium ${docId === 'student-liability' ? 'bg-medical-100 text-medical-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                  حدود مسؤولية الطلاب
                </Link>
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 md:p-12">
              
              {/* HUGE DISCLAIMER BANNER */}
              <div className="bg-red-50 border-4 border-red-600 p-8 mb-10 rounded-xl shadow-lg print:border-red-600">
                <div className="flex flex-col items-center text-center">
                    <ShieldAlert className="h-16 w-16 text-red-600 mb-4" />
                    <h2 className="text-2xl md:text-3xl font-extrabold text-red-900 mb-4 underline decoration-red-400 decoration-4 underline-offset-8">
                        تنويه قانوني هام جداً
                    </h2>
                    <p className="text-xl md:text-2xl font-bold text-red-800 leading-relaxed">
                        هذا الموقع الإلكتروني هو مشروع طلابي مستقل تماماً، ولا يمت بصلة رسمية أو قانونية لجامعة الإسكندرية أو إدارة كلية طب الأسنان.
                        <br className="my-2" />
                        الجامعة غير مسؤولة عن أي محتوى أو خدمات أو اتفاقات تتم عبر هذه المنصة.
                    </p>
                </div>
              </div>

              {renderContent()}
              
              <div className="mt-12 pt-8 border-t text-sm text-gray-400 print:block hidden">
                <p>تم استخراج هذه الوثيقة من منصة عيادة الأسنان التعليمية - جامعة الإسكندرية.</p>
                <p>التاريخ: {new Date().toLocaleDateString('ar-EG')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
