
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, CheckCircle, Clock, Search, Phone, MapPin, 
  Activity, User, LogOut, ChevronDown, X, Lock, EyeOff
} from 'lucide-react';
import { getCases, updateCaseStatus } from '../services/dataService';
import { PatientCase, Student, CaseStatus } from '../types';
import { STATUS_LABELS, STATUS_COLORS } from '../constants';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [myCases, setMyCases] = useState<PatientCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<PatientCase | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // PERSISTENCE CHECK: Look in both LocalStorage (Remember Me) and SessionStorage
    const localSession = localStorage.getItem('student_session');
    const sessionSession = sessionStorage.getItem('student_session');
    
    const session = localSession || sessionSession;

    if (!session) {
      navigate('/student/login');
      return;
    }

    try {
      const parsed = JSON.parse(session);
      // Normalize data in case of DB case mismatch
      const normalizedStudent = {
         ...parsed,
         fullName: parsed.fullName || parsed.fullname,
         universityId: parsed.universityId || parsed.universityid
      };
      setStudent(normalizedStudent);
    } catch (e) {
      // If data is corrupted, clear everything and redirect
      handleLogout();
    }
  }, [navigate]);

  useEffect(() => {
    if (student) {
      loadCases();
    }
  }, [student]);

  const loadCases = async () => {
    if (!student) return;
    const allCases = await getCases();
    
    // STRICT FILTER: Only show cases assigned to this student.
    // 'assignedStudentId' stores ID. 'assignedStudent' stores Name/Username (legacy/bot).
    // We check against ID and Name to ensure TG bot assignments show up.
    const myFilteredCases = allCases.filter(c => 
        c.assignedStudentId === student.id || 
        (c.assignedStudent && (c.assignedStudent === student.fullName || c.assignedStudent.includes(student.fullName)))
    );

    setMyCases(myFilteredCases);
  };

  const handleLogout = () => {
    // Explicit Logout: Clear ALL storage to ensure no ghost sessions remain
    localStorage.removeItem('student_session');
    sessionStorage.removeItem('student_session');
    setStudent(null);
    navigate('/student/login');
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedCase) return;
    
    const success = await updateCaseStatus(selectedCase.id, newStatus as CaseStatus);
    if (success) {
      setSelectedCase({...selectedCase, status: newStatus as CaseStatus});
      loadCases();
    }
  };

  if (!student) return null;

  const filteredCases = myCases.filter(c => 
    (c.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCasesCount = myCases.filter(c => c.status !== CaseStatus.COMPLETED && c.status !== CaseStatus.CANCELLED).length;
  const completedCasesCount = myCases.filter(c => c.status === CaseStatus.COMPLETED).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white shadow border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-medical-100 p-2 rounded-full">
                <User className="h-6 w-6 text-medical-700" />
             </div>
             <div>
               <h1 className="text-lg font-bold text-gray-900">مرحباً، د/ {student.fullName}</h1>
               <span className="text-xs text-gray-500">الرقم الجامعي: {student.universityId}</span>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm font-bold px-4 py-2 rounded hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            تسجيل خروج
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">إجمالي الحالات المستلمة</p>
              <p className="text-3xl font-bold text-gray-900">{myCases.length}</p>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">حالات قيد العلاج</p>
              <p className="text-3xl font-bold text-orange-600">{activeCasesCount}</p>
            </div>
            <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">حالات مكتملة</p>
              <p className="text-3xl font-bold text-green-600">{completedCasesCount}</p>
            </div>
            <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Telegram Privacy Note */}
        <div className="mb-8 bg-indigo-50 border border-indigo-200 rounded-lg p-5 flex items-start gap-3 shadow-sm">
             <div className="p-2 bg-indigo-100 rounded-full text-indigo-600 mt-1">
                <Lock className="h-5 w-5" />
             </div>
             <div>
                <h3 className="text-indigo-900 font-bold text-lg">تنبيه هام بخصوص الخصوصية</h3>
                <p className="text-indigo-800 mt-1 leading-relaxed">
                   للحفاظ على سرية بيانات المرضى، لا تظهر هنا إلا الحالات التي قمت باستلامها رسمياً. 
                   لاستلام حالات جديدة، يرجى متابعة قناة التيليجرام الخاصة بالكلية والضغط على زر <strong>"استلام الحالة"</strong> عند توفر إشعار جديد.
                </p>
             </div>
        </div>

        {/* Search & Cases List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">حالاتي المسجلة</h2>
            <div className="relative w-full md:w-96">
               <input
                type="text"
                placeholder="بحث برقم الحالة أو اسم المريض..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-medical-500 focus:border-medical-500 transition-colors"
               />
               <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">رقم الحالة</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">المريض</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">الهاتف</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">المشكلة</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">الحالة</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-medical-700 bg-gray-50/50">{c.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono" dir="ltr">{c.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{c.problems[0]}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${STATUS_COLORS[c.status]}`}>
                        {STATUS_LABELS[c.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <button 
                        onClick={() => setSelectedCase(c)}
                        className="text-white bg-medical-600 hover:bg-medical-700 px-4 py-2 rounded-md shadow-sm transition-all"
                      >
                        عرض التفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredCases.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <EyeOff className="h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-lg font-medium">لا توجد حالات مسندة إليك حالياً</p>
                        <p className="text-sm mt-1">استخدم بوت التيليجرام لاستلام الحالات الجديدة</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Case Details Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75" onClick={() => setSelectedCase(null)}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-xl text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
              
              {/* Modal Header */}
              <div className="bg-medical-600 px-4 py-4 sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <User className="h-5 w-5" />
                    ملف المريض: {selectedCase.fullName}
                  </h3>
                  <button onClick={() => setSelectedCase(null)} className="text-white/80 hover:text-white transition-colors">
                    <X className="h-6 w-6" />
                  </button>
              </div>

              <div className="px-4 py-6 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Personal Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-700">{selectedCase.age} سنة - {selectedCase.gender}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span dir="ltr" className="font-bold text-gray-900">{selectedCase.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{selectedCase.district}</span>
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <h4 className="text-sm font-bold text-yellow-900 mb-3 flex items-center gap-2">
                       <Activity className="h-4 w-4" /> التشخيص المبدئي
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCase.problems.map((p, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-yellow-200 rounded-full text-sm font-bold text-yellow-800 shadow-sm">{p}</span>
                      ))}
                    </div>
                    {selectedCase.additionalNotes && (
                      <div className="mt-4 text-sm text-gray-700 border-t border-yellow-200 pt-3 bg-white/50 p-2 rounded">
                        <span className="font-bold block mb-1">ملاحظات:</span>
                        {selectedCase.additionalNotes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Update Control */}
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-inner">
                  <label className="block text-base font-bold text-blue-900 mb-3">تحديث حالة العلاج (أنت المسؤول)</label>
                  <div className="relative">
                    <select 
                      value={selectedCase.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="block w-full pl-3 pr-10 py-3 text-base border-blue-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg shadow-sm"
                    >
                       <option value={CaseStatus.IN_TREATMENT}>🛠 قيد العلاج (الوضع الحالي)</option>
                       <option value={CaseStatus.APPROVED_FOR_TREATMENT}>📅 تم الحجز (بانتظار الموعد)</option>
                       <option value={CaseStatus.CONTACTED_PATIENT}>📞 تم التواصل مع المريض</option>
                       <option value={CaseStatus.COMPLETED}>✅ تم الانتهاء من العلاج</option>
                       <option value={CaseStatus.CANCELLED}>❌ إلغاء الحالة</option>
                    </select>
                    <ChevronDown className="absolute left-3 top-3.5 h-5 w-5 text-blue-500 pointer-events-none" />
                  </div>
                  <p className="text-xs text-blue-600 mt-2 pr-1">يرجى تحديث الحالة دورياً لضمان دقة السجلات.</p>
                </div>

              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-6 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none sm:w-auto sm:text-sm transition-colors"
                  onClick={() => setSelectedCase(null)}
                >
                  إغلاق النافذة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
