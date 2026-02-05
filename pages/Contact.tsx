
import React, { useEffect } from 'react';
import { MapPin, Clock, Phone, AlertTriangle } from 'lucide-react';

export const Contact: React.FC = () => {
  useEffect(() => {
    document.title = "تواصل معنا | عيادة طب الأسنان التعليمية";
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-medical-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-4">نحن هنا لخدمتك</h1>
          <p className="text-xl text-medical-100">بيانات التواصل ومواعيد العمل</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Info Cards */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm flex items-start gap-4">
                    <div className="bg-medical-50 p-3 rounded-full">
                        <MapPin className="h-6 w-6 text-medical-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">العنوان</h3>
                        <p className="text-gray-600">
                            كلية طب الأسنان، جامعة الإسكندرية<br/>
                            شارع شامبليون، الأزاريطة، الإسكندرية
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm flex items-start gap-4">
                    <div className="bg-medical-50 p-3 rounded-full">
                        <Clock className="h-6 w-6 text-medical-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">مواعيد العمل</h3>
                        <p className="text-gray-600">من الأحد إلى الخميس</p>
                        <p className="text-gray-600">من الساعة 9:00 صباحاً حتى 2:00 ظهراً</p>
                    </div>
                </div>

                <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 flex items-start gap-4">
                    <div className="bg-yellow-100 p-3 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-yellow-700" />
                    </div>
                    <div>
                        <h3 className="font-bold text-yellow-800 text-lg mb-1">تنبيه هام</h3>
                        <p className="text-yellow-700 text-sm leading-relaxed">
                            الحضور بأسبقية الحجز الإلكتروني. يرجى التأكد من التسجيل عبر الموقع قبل الحضور لتسهيل دخولك. هذه العيادات لا تقدم خدمات الطوارئ الليلية.
                        </p>
                    </div>
                </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white p-2 rounded-xl shadow-sm h-full min-h-[300px]">
                <iframe 
                    src="https://maps.google.com/maps?q=14%20Chompolion%20St%2C%20Al%20Mesallah%20Sharq%2C%20Al%20Attarin%2C%20Alexandria%20Governorate%2021131&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                    width="100%" 
                    height="100%" 
                    style={{border:0, borderRadius: '0.75rem', minHeight: '350px'}} 
                    allowFullScreen={true} 
                    loading="lazy"
                    title="Faculty Location"
                ></iframe>
            </div>
        </div>
      </div>
    </div>
  );
};
