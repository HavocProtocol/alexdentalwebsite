
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyClaimToken, confirmClaim } from '../services/dataService';
import { PatientCase, Student } from '../types';
import { CheckCircle, AlertTriangle, ShieldCheck, MapPin, User, Activity, XCircle, ArrowRight } from 'lucide-react';

export const ClaimCase: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [caseData, setCaseData] = useState<Partial<PatientCase> | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    // 1. Check Auth
    const localSession = localStorage.getItem('student_session');
    const sessionSession = sessionStorage.getItem('student_session');
    const session = localSession || sessionSession;

    if (!session) {
      // Redirect to login with return URL
      navigate(`/student/login?redirect=/claim/${token}`);
      return;
    }

    try {
        setStudent(JSON.parse(session));
    } catch (e) {
        navigate('/student/login');
        return;
    }

    // 2. Verify Token
    if (token) {
        verifyClaimToken(token).then((result) => {
            setLoading(false);
            if (result.success && result.case) {
                setCaseData(result.case);
            } else {
                setError(result.message || "الرابط غير صالح أو منتهي الصلاحية");
            }
        });
    }
  }, [token, navigate]);

  const handleAccept = async () => {
      if (!student || !token) return;
      setClaiming(true);
      
      const result = await confirmClaim(token, student.id, student.fullName);
      
      if (result.success) {
          // Success! Redirect to dashboard
          navigate('/student/dashboard');
      } else {
          setError(result.message || "حدث خطأ أثناء قبول الحالة");
          setClaiming(false);
      }
  };

  const handleRefuse = () => {
      navigate('/student/dashboard');
  };

  if (loading) {
      return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center">
                  <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
              </div>
          </div>
      );
  }

  if (error) {
      return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
              <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                  <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">عذراً، لا يمكن قبول الحالة</h2>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <button onClick={() => navigate('/student/dashboard')} className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                      العودة للوحة التحكم
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <ShieldCheck className="h-8 w-8 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">مراجعة وقبول الحالة</h1>
                <p className="text-gray-600 mt-2">يرجى مراجعة البيانات المتاحة قبل تأكيد الحجز</p>
            </div>

            {/* Case Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <User className="h-5 w-5" />
                        ملف حالة رقم: {caseData?.id}
                    </h2>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
                        متاح للحجز
                    </span>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <User className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">العمر / الجنس</p>
                                <p className="font-bold text-gray-900">{caseData?.age} سنة - {caseData?.gender}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <MapPin className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">المنطقة</p>
                                <p className="font-bold text-gray-900">{caseData?.district}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-blue-600" />
                            الشكوى الرئيسية
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {caseData?.problems?.map((p, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-100 font-bold">
                                    {p}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 mb-8">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div className="text-sm text-yellow-800">
                                <p className="font-bold mb-1">تنبيه هام:</p>
                                <p>بضغطك على "قبول الحالة"، أنت تتعهد بالالتزام الأخلاقي والمهني بعلاج هذا المريض تحت إشراف الكلية. سيتم إرسال كافة بيانات التواصل والتاريخ المرضي لك في رسالة خاصة.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={handleAccept}
                            disabled={claiming}
                            className={`flex-1 py-4 rounded-xl text-lg font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2
                                ${claiming ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
                            `}
                        >
                            {claiming ? 'جاري التأكيد...' : (
                                <>
                                    <CheckCircle className="h-5 w-5" />
                                    قبول الحالة وبدء العلاج
                                </>
                            )}
                        </button>
                        <button 
                            onClick={handleRefuse}
                            disabled={claiming}
                            className="flex-1 py-4 bg-white border-2 border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                        >
                            تجاهل (العودة للرئيسية)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
