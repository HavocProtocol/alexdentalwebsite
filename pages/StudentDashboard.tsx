
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, CheckCircle, Clock, Search, Phone, MapPin, 
  Activity, User, Calendar, LogOut, ChevronDown, X 
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
    const session = localStorage.getItem('student_session');
    if (!session) {
      navigate('/student/login');
      return;
    }
    try {
      const parsed = JSON.parse(session);
      // Fallback for legacy data with lowercase keys in local storage
      const normalizedStudent = {
         ...parsed,
         fullName: parsed.fullName || parsed.fullname,
         universityId: parsed.universityId || parsed.universityid
      };
      setStudent(normalizedStudent);
    } catch (e) {
      localStorage.removeItem('student_session');
      navigate('/student/login');
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
    // For this demo, we are showing all cases or cases that are relevant
    // In a real scenario, we'd filter by student ID, but we want to show the list for the demo flow
    setMyCases(allCases);
  };

  const handleLogout = () => {
    localStorage.removeItem('student_session');
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
            className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            خروج
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">إجمالي الحالات</p>
              <p className="text-3xl font-bold text-gray-900">{myCases.length}</p>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">حالات نشطة</p>
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

        {/* Search & List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-bold text-gray-900">قائمة المرضى</h2>
            <div className="relative w-full md:w-96">
               <input
                type="text"
                placeholder="بحث برقم الحالة أو اسم المريض..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-medical-500 focus:border-medical-500"
               />
               <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">رقم الحالة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المريض</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الهاتف</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المشكلة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{c.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" dir="ltr">{c.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{c.problems[0]}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[c.status]}`}>
                        {STATUS_LABELS[c.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => setSelectedCase(c)}
                        className="text-medical-600 hover:text-medical-900"
                      >
                        عرض التفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredCases.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      لا توجد حالات مسندة إليك حالياً.
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
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setSelectedCase(null)}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                  <h3 className="text-xl font-bold text-gray-900">ملف المريض: {selectedCase.fullName}</h3>
                  <button onClick={() => setSelectedCase(null)} className="text-gray-400 hover:text-gray-500">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="h-5 w-5 text-gray-400" />
                      <span>{selectedCase.age} سنة - {selectedCase.gender}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span dir="ltr" className="font-bold">{selectedCase.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span>{selectedCase.district}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                       <Activity className="h-4 w-4" /> التشخيص المبدئي
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCase.problems.map((p, i) => (
                        <span key={i} className="px-2 py-1 bg-white border border-gray-300 rounded text-sm text-gray-700">{p}</span>
                      ))}
                    </div>
                    {selectedCase.additionalNotes && (
                      <p className="mt-2 text-sm text-gray-600 border-t border-gray-200 pt-2">
                        {selectedCase.additionalNotes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Update Section */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <label className="block text-sm font-medium text-blue-900 mb-2">تحديث حالة العلاج</label>
                  <div className="flex gap-3">
                    <div className="relative flex-grow">
                      <select 
                        value={selectedCase.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-medical-500 focus:border-medical-500 sm:text-sm rounded-md"
                      >
                         <option value={CaseStatus.APPROVED_FOR_TREATMENT}>{STATUS_LABELS[CaseStatus.APPROVED_FOR_TREATMENT]}</option>
                         <option value={CaseStatus.CONTACTED_PATIENT}>{STATUS_LABELS[CaseStatus.CONTACTED_PATIENT]}</option>
                         <option value={CaseStatus.IN_TREATMENT}>{STATUS_LABELS[CaseStatus.IN_TREATMENT]}</option>
                         <option value={CaseStatus.COMPLETED}>{STATUS_LABELS[CaseStatus.COMPLETED]}</option>
                         <option value={CaseStatus.CANCELLED}>{STATUS_LABELS[CaseStatus.CANCELLED]}</option>
                      </select>
                      <ChevronDown className="absolute left-3 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-blue-700">
                    * يرجى تحديث الحالة بانتظام. عند الانتهاء من العلاج، اختر "تم الانتهاء من الحالة".
                  </p>
                </div>

                {/* History */}
                <div className="mt-6">
                   <h4 className="text-sm font-bold text-gray-900 mb-3">سجل المتابعة</h4>
                   <div className="max-h-40 overflow-y-auto space-y-3">
                     {selectedCase.statusHistory.slice().reverse().map((log, i) => (
                       <div key={i} className="flex gap-3 text-sm">
                         <span className="text-gray-400 font-mono text-xs whitespace-nowrap">
                           {new Date(log.timestamp).toLocaleDateString('ar-EG')}
                         </span>
                         <span className={`font-medium ${STATUS_COLORS[log.status].split(' ')[1]}`}>
                           {STATUS_LABELS[log.status]}
                         </span>
                         {log.note && <span className="text-gray-500">- {log.note}</span>}
                       </div>
                     ))}
                   </div>
                </div>

              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedCase(null)}
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
