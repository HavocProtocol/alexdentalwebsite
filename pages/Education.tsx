
import React, { useState, useEffect } from 'react';
import { Search, BookOpen, HeartPulse, Sparkles, AlertCircle, Apple, Smile, X, Baby, Cigarette, Scissors, Anchor, Sun, Wind, Stethoscope } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  category: string;
  summary: string;
  details: string;
  icon: React.ReactNode;
}

export const Education: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('الكل');

  useEffect(() => {
    document.title = "تثقيف صحي | عيادة طب الأسنان التعليمية";
  }, []);

  const articles: Article[] = [
    {
      id: 1,
      title: "الطريقة الصحيحة لتنظيف الأسنان",
      category: "وقاية",
      summary: "تعرف على الطريقة الصحيحة لتفريش الأسنان واستخدام الخيط الطبي لمنع التسوس.",
      details: "يجب تنظيف الأسنان مرتين يومياً على الأقل بمعجون يحتوي على الفلورايد. استخدم فرشاة ناعمة وقم بتحريكها بحركة دائرية بزاوية 45 درجة على اللثة. لا تنس تنظيف اللسان واستخدام الخيط الطبي مرة يومياً لإزالة بقايا الطعام من بين الأسنان حيث لا تصل الفرشاة. استبدل الفرشاة كل 3 أشهر أو عند تلف شعيراتها.",
      icon: <Sparkles className="h-6 w-6" />
    },
    {
      id: 2,
      title: "أعراض التهاب اللثة وعلاجه",
      category: "أمراض اللثة",
      summary: "نزيف اللثة، التورم، والروائح الكريهة.. علامات تحذيرية لا يجب تجاهلها.",
      details: "التهاب اللثة هو المرحلة الأولى من أمراض اللثة. الأعراض تشمل احمراراً، تورماً، ونزيفاً عند الغسيل. السبب الرئيسي هو تراكم الجير (البلاك). العلاج يبدأ بتنظيف الجير عند الطبيب والالتزام بنظافة الفم. إهمال العلاج قد يؤدي لتآكل العظم وفقدان الأسنان (Periodontitis).",
      icon: <HeartPulse className="h-6 w-6" />
    },
    {
      id: 3,
      title: "ما هو حشو العصب (علاج الجذور)؟",
      category: "علاجات",
      summary: "شرح مبسط لعملية علاج الجذور ومتى يحتاج المريض إليها لإنقاذ السن.",
      details: "عندما يصل التسوس إلى عصب السن، يسبب ألماً شديداً والتهاباً أو خراجاً. علاج الجذور يتضمن إزالة العصب الملتهب، تنظيف القنوات بدقة باستخدام أدوات دقيقة، وحشوها بمادة خاصة (Gutta-percha). هذا الإجراء ينقذ السن من الخلع ويسمح لك باستخدامه في المضغ بشكل طبيعي بعد وضع التلبيسة (التاج) لحمايته من الكسر.",
      icon: <BookOpen className="h-6 w-6" />
    },
    {
      id: 4,
      title: "تأثير السكري على صحة الفم",
      category: "صحة عامة",
      summary: "علاقة مرض السكري بمشاكل الأسنان وكيفية الوقاية من المضاعفات.",
      details: "مرضى السكري أكثر عرضة لالتهابات اللثة وفقدان الأسنان وجفاف الفم وتأخر التئام الجروح. ارتفاع السكر يضعف مناعة اللثة ويزيد من نمو البكتيريا. يجب على مريض السكر ضبط مستويات السكر، زيارة طبيب الأسنان كل 6 أشهر، وإخبار الطبيب بحالته الصحية قبل أي إجراء جراحي.",
      icon: <AlertCircle className="h-6 w-6" />
    },
    {
      id: 5,
      title: "التغذية السليمة لأسنان قوية",
      category: "تغذية",
      summary: "الأطعمة التي تقوي الأسنان وتلك التي تضرها وتسبب التسوس.",
      details: "تناول الأطعمة الغنية بالكالسيوم (الألبان، الجبن) وفيتامين د. الخضروات والفواكه المقرمشة (مثل التفاح والجزر) تساعد في تنظيف الأسنان طبيعياً وتحفيز اللعاب. قلل من السكريات والمشروبات الغازية والحمضية التي تؤدي لتآكل المينا وتسوس الأسنان. شرب الماء بكثرة هو أفضل وسيلة لمعادلة حموضة الفم.",
      icon: <Apple className="h-6 w-6" />
    },
    {
      id: 6,
      title: "حساسية الأسنان: الأسباب والحلول",
      category: "مشاكل شائعة",
      summary: "لماذا تشعر بلسعة عند شرب الماء البارد؟ وكيف تعالجها؟",
      details: "حساسية الأسنان تحدث عند انكشاف طبقة العاج الحساسة نتيجة تراجع اللثة أو تآكل المينا بسبب الفرشاة العنيفة أو الأحماض. الحلول تشمل استخدام معجون أسنان مخصص للحساسية، استخدام فرشاة ناعمة جداً، وتجنب الأطعمة شديدة الحموضة. في الحالات الشديدة، يضع الطبيب مواد خاصة لسد المسام الحساسة.",
      icon: <Smile className="h-6 w-6" />
    },
    {
      id: 7,
      title: "العناية بأسنان الأطفال والرضع",
      category: "أطفال",
      summary: "متى تبدأ العناية بأسنان طفلك؟ وكيف تحميه من تسوس الرضاعة؟",
      details: "يجب مسح لثة الرضيع بقطعة شاش مبللة بعد الرضاعة. عند ظهور أول سن، استخدم فرشاة صغيرة جداً. تجنب نوم الطفل وفي فمه زجاجة الحليب لمنع 'تسوس الرضاعة'. ينصح بزيارة طبيب الأسنان لأول مرة عند عمر سنة. تطبيق جلسات الفلورايد الموضعي في العيادة يقوي الأسنان ويحميها.",
      icon: <Baby className="h-6 w-6" />
    },
    {
      id: 8,
      title: "التدخين وصحة الفم",
      category: "عادات ضارة",
      summary: "أضرار التدخين على اللثة، تصبغ الأسنان، ومخاطر سرطان الفم.",
      details: "التدخين هو العدو الأول لصحة اللثة، حيث يقلل تدفق الدم ويؤخر الشفاء، مما يزيد خطر فقدان الأسنان وفشل زراعة الأسنان. يسبب التدخين تصبغات صفراء وسوداء يصعب إزالتها، ورائحة فم كريهة دائمة. الأخطر هو ارتباطه الوثيق بسرطان الفم واللسان.",
      icon: <Cigarette className="h-6 w-6" />
    },
    {
      id: 9,
      title: "ضرس العقل: متى يجب خلعه؟",
      category: "جراحة",
      summary: "مشاكل ضرس العقل المدفون والالتهابات المصاحبة له.",
      details: "ضرس العقل هو آخر الأضراس بزوغاً (بين 17-25 سنة). غالباً ما لا يجد مساحة كافية، فينمو مائلاً أو يظل مدفوناً، مسبباً ألماً، تورماً، أو تضرراً للأسنان المجاورة. في هذه الحالات يجب خلعه جراحياً. إذا ظهر بشكل سليم ولا يسبب مشاكل، يمكن الاحتفاظ به مع العناية الجيدة.",
      icon: <Scissors className="h-6 w-6" />
    },
    {
      id: 10,
      title: "زراعة الأسنان: الحل الأمثل",
      category: "جراحة",
      summary: "كيف تعوض الأسنان المفقودة بشكل دائم وطبيعي؟",
      details: "زراعة الأسنان هي غرس وتد من التيتانيوم في عظم الفك ليعمل كجذر بديل، ثم تركيب تاج عليه. تعتبر الحل الأفضل لأنها تحافظ على عظم الفك ولا تتطلب برد الأسنان المجاورة (عكس الكوبري). نسبة نجاحها تتعدى 95% وتعيش لسنوات طويلة مع العناية.",
      icon: <Anchor className="h-6 w-6" />
    },
    {
      id: 11,
      title: "تبييض الأسنان: حقائق وخرافات",
      category: "تجميل",
      summary: "الفرق بين التبييض المنزلي والعيادة، وهل هو آمن؟",
      details: "تبييض الأسنان عند الطبيب يستخدم مواد آمنة وفعالة لتفتيح لون الأسنان عدة درجات. الوصفات المنزلية (مثل الليمون والفحم) قد تضر طبقة المينا وتسبب حساسية. التبييض لا يغير لون الحشوات أو التركيبات القديمة، لذا قد تحتاج لتغييرها بعد التبييض لتطابق اللون الجديد.",
      icon: <Sun className="h-6 w-6" />
    },
    {
      id: 12,
      title: "رائحة الفم الكريهة (البخر)",
      category: "مشاكل شائعة",
      summary: "أسبابها المحرجة وكيفية التخلص منها نهائياً.",
      details: "85% من أسباب الرائحة الكريهة تأتي من الفم بسبب البكتيريا المتراكمة على اللسان وبين الأسنان. الحل يكمن في تنظيف الأسنان والخيط، واستخدام كاشط اللسان، وعلاج التسوس والتهاب اللثة. أسباب أخرى تشمل الجيوب الأنفية ومشاكل المعدة، أو جفاف الفم.",
      icon: <Wind className="h-6 w-6" />
    },
    {
      id: 13,
      title: "الحمل وصحة الأسنان",
      category: "صحة عامة",
      summary: "هل علاج الأسنان آمن للحامل؟ وما هو التهاب لثة الحمل؟",
      details: "تغير الهرمونات أثناء الحمل يزيد من استجابة اللثة للبكتيريا، مما يسبب 'التهاب لثة الحمل' (نزيف وتورم). تنظيف الأسنان عند الطبيب آمن وضروري أثناء الحمل. الثلث الثاني (الشهور 4-6) هو الوقت الأنسب للعلاج. يجب تجنب الأشعة السينية إلا للضرورة القصوى مع استخدام واقي الرصاص.",
      icon: <Baby className="h-6 w-6" />
    },
    {
      id: 14,
      title: "التقويم: ليس مجرد شكل جمالي",
      category: "تجميل",
      summary: "أهمية تقويم الأسنان لوظيفة المضغ ومخارج الحروف.",
      details: "تزاحم الأسنان أو سوء الإطباق يسبب صعوبة في التنظيف (مما يزيد التسوس) ومشاكل في مفصل الفك. التقويم يعالج هذه المشاكل ويحسن المظهر. يوجد أنواع متعددة: معدني، شفاف، وخزفي. مدة العلاج تختلف حسب الحالة، وغالباً ما يحتاج المريض لمثبت بعد انتهاء العلاج.",
      icon: <Smile className="h-6 w-6" />
    },
    {
      id: 15,
      title: "جفاف الفم: أسبابه ومخاطره",
      category: "مشاكل شائعة",
      summary: "عندما يقل اللعاب، تزيد مشاكل الأسنان. كيف نعالج ذلك؟",
      details: "اللعاب هو خط الدفاع الأول ضد التسوس لأنه يغسل بقايا الطعام ويعادل الأحماض. جفاف الفم قد ينتج عن الأدوية، السكري، أو التقدم في العمر. يزيد الجفاف من خطر التسوس السريع والتهاب الفطريات. ينصح بشرب الماء، مضغ علكة خالية من السكر، واستخدام بدائل اللعاب.",
      icon: <Wind className="h-6 w-6" />
    }
  ];

  const categories = ['الكل', ...new Set(articles.map(a => a.category))];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.includes(searchTerm) || article.summary.includes(searchTerm);
    const matchesCategory = activeCategory === 'الكل' || article.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="mx-auto w-16 h-16 bg-medical-100 rounded-full flex items-center justify-center mb-4">
             <Stethoscope className="h-8 w-8 text-medical-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">الموسوعة الطبية المبسطة</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            معلومات طبية موثوقة لمساعدتك وعائلتك في الحفاظ على ابتسامة صحية وجميلة مدى الحياة.
          </p>
        </div>

        {/* Controls: Search & Filter */}
        <div className="max-w-4xl mx-auto mb-12">
           {/* Search Bar */}
           <div className="relative mb-8">
             <input 
               type="text" 
               placeholder="ابحث عن موضوع (مثال: تسوس، لثة، تنظيف...)" 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 shadow-sm focus:ring-4 focus:ring-medical-100 focus:border-medical-500 text-lg transition-all"
             />
             <div className="absolute left-4 top-4 text-gray-400">
               <Search className="h-6 w-6" />
             </div>
           </div>

           {/* Categories */}
           <div className="flex flex-wrap justify-center gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    activeCategory === cat 
                    ? 'bg-medical-600 text-white shadow-md transform scale-105' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredArticles.map(article => (
             <div key={article.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group">
                <div className="p-6 flex-grow">
                   <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-medical-700 bg-medical-50 px-3 py-1 rounded-full border border-medical-100">
                        {article.category}
                      </span>
                      <div className="text-medical-500 bg-gray-50 p-2.5 rounded-xl group-hover:bg-medical-50 group-hover:text-medical-600 transition-colors">
                        {article.icon}
                      </div>
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-medical-600 transition-colors">{article.title}</h3>
                   <p className="text-gray-600 leading-relaxed text-sm line-clamp-3">
                      {article.summary}
                   </p>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 mt-auto">
                   <button 
                     onClick={() => setSelectedArticle(article)}
                     className="w-full text-center bg-white border border-gray-200 text-gray-700 py-2 rounded-lg font-bold hover:bg-medical-600 hover:text-white hover:border-transparent transition-all text-sm flex items-center justify-center gap-2"
                   >
                     <BookOpen className="h-4 w-4" />
                     اقرأ التفاصيل الكاملة
                   </button>
                </div>
             </div>
           ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
             <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                <Search className="h-8 w-8 text-gray-400" />
             </div>
             <h3 className="text-lg font-bold text-gray-900">لا توجد نتائج مطابقة</h3>
             <p className="text-gray-500">جرب البحث بكلمات مختلفة أو اختر تصنيفاً آخر.</p>
          </div>
        )}

      </div>

      {/* Details Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedArticle(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-fade-in scale-100 transform transition-transform" onClick={e => e.stopPropagation()}>
             {/* Modal Header */}
             <div className="bg-medical-600 p-6 text-white flex justify-between items-start">
                <div className="flex items-center gap-4">
                   <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                      {React.cloneElement(selectedArticle.icon as React.ReactElement<any>, { className: "h-8 w-8 text-white" })}
                   </div>
                   <div>
                     <h3 className="text-2xl font-bold">{selectedArticle.title}</h3>
                     <span className="inline-block mt-1 text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full text-medical-50">{selectedArticle.category}</span>
                   </div>
                </div>
                <button onClick={() => setSelectedArticle(null)} className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg p-1 transition-colors">
                  <X className="h-6 w-6" />
                </button>
             </div>
             
             {/* Modal Body */}
             <div className="p-8 max-h-[60vh] overflow-y-auto">
                <h4 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">الملخص</h4>
                <p className="text-gray-600 mb-6 italic bg-gray-50 p-4 rounded-lg border-r-4 border-medical-400">
                   {selectedArticle.summary}
                </p>

                <h4 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">التفاصيل والشرح</h4>
                <p className="text-gray-800 leading-loose text-lg text-justify">
                  {selectedArticle.details}
                </p>
             </div>

             {/* Modal Footer */}
             <div className="p-6 bg-gray-50 border-t border-gray-100 text-left flex justify-end">
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                >
                  إغلاق
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
