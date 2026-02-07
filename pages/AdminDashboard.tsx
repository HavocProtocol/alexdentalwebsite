
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Eye, X, User, Phone, MapPin, 
  Activity, CheckCircle, GraduationCap, Send,
  UserCheck, XCircle, Calendar, ClipboardList, ShieldAlert
} from 'lucide-react';
import { 
  getCases, updateCaseStatus, getStudents, updateStudentStatus, assignCaseToStudent, approveCaseAssignment, publishCase 
} from '../services/dataService';
import { PatientCase, CaseStatus, Student, StudentStatus } from '../types';
import { STATUS_LABELS, STATUS_COLORS, STUDENT_STATUS_LABELS } from '../constants';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'NEW_REQUESTS' | 'CASES' | 'STUDENTS'>('NEW_REQUESTS');

  // Data
  const [cases, setCases] = useState<PatientCase[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  
  // UI State
  const [filteredCases, setFilteredCases] = useState<PatientCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<PatientCase | null>(null);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'CASES' || activeTab === 'NEW_REQUESTS') {
      let result = cases;
      
      // Strict Tab Filtering
      if (activeTab === 'NEW_REQUESTS') {
          // Show RECEIVED (Not published)
          result = result.filter(c => c.status === CaseStatus.RECEIVED);
      } else {
          // Show published, claimed, etc.
          result = result.filter(c => c.status !== CaseStatus.RECEIVED);
      }

      if (statusFilter !== 'ALL' && activeTab === 'CASES') {
        result = result.filter(c => c.status === statusFilter);
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(c => 
          c.fullName.toLowerCase().includes(term) || 
          c.id.toLowerCase().includes(term) ||
          c.phone.includes(term)
        );
      }
      
      // Sort: Date
      result.sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
      setFilteredCases(result);
    } else {
      let result = students;
      if (statusFilter !== 'ALL') {
        result = result.filter(s => s.status === statusFilter);
      }
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(s => 
          s.fullName.toLowerCase().includes(term) || 
          s.universityId.toLowerCase().includes(term) || 
          s.email.toLowerCase().includes(term)
        );
      }
      setFilteredStudents(result);
    }
  }, [cases, students, activeTab, statusFilter, searchTerm]);

  const loadData = async () => {
    const [c, s] = await Promise.all([getCases(), getStudents()]);
    setCases(c);
    setStudents(s);
  };

  const handlePublishCase = async (id: string) => {
    const success = await publishCase(id);
    if (success) {
      setSelectedCase(null);
      loadData();
      alert("تم نشر الحالة للطلاب وإرسال الإشعار على تيليجرام بنجاح");
    } else {
      alert("حدث خطأ أثناء النشر");
    }
  };

  const handleRejectNewRequest = async (id: string) => {
      const success = await updateCaseStatus(id, CaseStatus.CANCELLED);
      if (success) {
          setSelectedCase(null);
          loadData();
      }
  }

  const handleStudentAction = async (studentId: string, action: StudentStatus) => {
    await updateStudentStatus(studentId, action);
    loadData();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">لوحة تحكم المشرف</h1>
          <button 
            onClick={() => { localStorage.removeItem('admin_token'); navigate('/admin/login'); }}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            تسجيل خروج
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 mt-2">
          <button 
            onClick={() => { setActiveTab('NEW_REQUESTS'); setStatusFilter('ALL'); setSearchTerm(''); }}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'NEW_REQUESTS' ? 'border-medical-600 text-medical-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            طلبات جديدة (للمراجعة)
            {cases.filter(c => c.status === CaseStatus.RECEIVED).length > 0 && (
              <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full animate-pulse">
                {cases.filter(c => c.status === CaseStatus.RECEIVED).length}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => { setActiveTab('CASES'); setStatusFilter('ALL'); setSearchTerm(''); }}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'CASES' ? 'border-medical-600 text-medical-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            إدارة الحالات النشطة
          </button>
          <button 
             onClick={() => { setActiveTab('STUDENTS'); setStatusFilter('ALL'); setSearchTerm(''); }}
             className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'STUDENTS' ? 'border-medical-600 text-medical-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            إدارة الطلاب ({students.length})
            {students.some(s => s.status === StudentStatus.PENDING) && (
              <span className="mr-2 bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full animate-pulse">
                {students.filter(s => s.status === StudentStatus.PENDING).length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pr-10 rounded-md border-gray-300 shadow-sm focus:ring-medical-500 focus:border-medical-500 p-2 border"
              placeholder={activeTab === 'STUDENTS' ? "بحث باسم الطالب..." : "بحث بالاسم، الرقم، أو الهاتف..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
             {activeTab === 'CASES' && (
             <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-medical-500 focus:border-medical-500 p-2 border appearance-none"
                >
                  <option value="ALL">الكل</option>
                  {Object.keys(STATUS_LABELS)
                     .filter(s => s !== 'RECEIVED') // Hide RECEIVED from active cases filter
                     .map((status) => (
                        <option key={status} value={status}>{STATUS_LABELS[status as CaseStatus]}</option>
                      ))
                  }
                </select>
                <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
             </div>
             )}
          </div>
        </div>

        {/* Content based on Tab */}
        {activeTab === 'STUDENTS' ? (
           <div className="bg-white shadow rounded-lg overflow-hidden">
             {/* Students Table */}
             <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الاسم</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الرقم الجامعي</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{s.universityId}</div>
                        <div className="text-xs text-gray-400">{s.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${s.status === StudentStatus.APPROVED ? 'bg-green-100 text-green-800' : ''} ${s.status === StudentStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : ''} ${s.status === StudentStatus.REJECTED ? 'bg-red-100 text-red-800' : ''}`}>
                         {STUDENT_STATUS_LABELS[s.status]}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                      {s.status === StudentStatus.PENDING && (
                        <>
                          <button onClick={() => handleStudentAction(s.id, StudentStatus.APPROVED)} className="text-green-600 hover:text-green-900 bg-green-50 px-2 py-1 rounded shadow-sm border border-green-100">قبول التسجيل</button>
                          <button onClick={() => handleStudentAction(s.id, StudentStatus.REJECTED)} className="text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded shadow-sm border border-red-100">رفض</button>
                        </>
                      )}
                      {s.status === StudentStatus.APPROVED && (
                          <button onClick={() => handleStudentAction(s.id, StudentStatus.REJECTED)} className="text-red-600 hover:text-red-900 text-xs">تجميد الحساب</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">رقم الحالة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المريض</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المشكلة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الطالب المعالج</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCases.map((c) => {
                  const assignedStudent = students.find(s => s.id === c.assignedStudentId) || (c.assignedStudentId === 'LINKED' ? { fullName: c.assignedStudent } : null);
                  return (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="font-bold">{c.fullName}</div>
                        <div className="text-xs">{c.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{c.problems[0]}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[c.status]}`}>
                          {STATUS_LABELS[c.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                         {assignedStudent ? (
                           <div className="flex items-center gap-1 text-medical-700 font-medium">
                             <User className="h-3 w-3" /> {assignedStudent.fullName}
                           </div>
                         ) : (
                           <span className="text-gray-400">-</span>
                         )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => setSelectedCase(c)} 
                          className="text-medical-600 hover:text-medical-900 flex items-center gap-1 border px-3 py-1 rounded hover:bg-white"
                        >
                          <Eye className="h-4 w-4" /> 
                          {activeTab === 'NEW_REQUESTS' ? 'مراجعة ونشر' : 'عرض'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredCases.length === 0 && (
                    <tr>
                        <td colSpan={6} className="text-center py-10 text-gray-500">لا توجد حالات في هذا القسم</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Case Detail Modal (Admin View) */}
      {selectedCase && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedCase(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
              
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* Modal Header */}
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                  <div>
                     <h3 className="text-xl leading-6 font-bold text-gray-900 flex items-center gap-2">
                       <User className="h-5 w-5 text-medical-600" />
                       ملف الحالة: {selectedCase.id}
                     </h3>
                     <div className="mt-2 flex gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full inline-block ${STATUS_COLORS[selectedCase.status]}`}>
                            {STATUS_LABELS[selectedCase.status]}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1" dir="ltr">
                           <Calendar className="h-3 w-3" /> 
                           {new Date(selectedCase.submissionDate).toLocaleDateString()}
                        </span>
                     </div>
                  </div>
                  <button onClick={() => setSelectedCase(null)} className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Patient Information Grid */}
                <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">البيانات الشخصية</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <label className="text-xs text-gray-500 block mb-1">اسم المريض</label>
                            <div className="font-bold text-gray-900">{selectedCase.fullName}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <label className="text-xs text-gray-500 block mb-1">رقم الهاتف</label>
                            <div className="font-bold text-gray-900 flex items-center gap-2" dir="ltr">
                                {selectedCase.phone} <Phone className="h-3 w-3 text-medical-600" />
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex gap-4">
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 block mb-1">العمر</label>
                                <div className="font-bold text-gray-900">{selectedCase.age} سنة</div>
                            </div>
                            <div className="w-px bg-gray-300 mx-2"></div>
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 block mb-1">الجنس</label>
                                <div className="font-bold text-gray-900">{selectedCase.gender}</div>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <label className="text-xs text-gray-500 block mb-1">المنطقة السكنية</label>
                            <div className="font-bold text-gray-900 flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-medical-600" /> {selectedCase.district}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Medical History Display */}
                <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Activity className="h-4 w-4" /> التاريخ المرضي
                    </h4>
                    <div className={`p-4 rounded-lg border ${selectedCase.medicalHistory.length > 0 && !selectedCase.medicalHistory.includes("لا أعاني من أمراض مزمنة") ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                         {selectedCase.medicalHistory.length > 0 ? (
                             <div className="space-y-2">
                                 {selectedCase.medicalHistory.map((d, i) => (
                                     <div key={i} className="flex items-center gap-2 font-bold text-gray-800">
                                         <ShieldAlert className="h-4 w-4" /> {d}
                                     </div>
                                 ))}
                                 {selectedCase.medicalNotes && (
                                     <div className="text-sm text-gray-700 mt-2 border-t border-gray-200 pt-2">
                                         {selectedCase.medicalNotes}
                                     </div>
                                 )}
                             </div>
                         ) : (
                             <span className="text-green-800 font-medium">لا توجد أمراض مزمنة</span>
                         )}
                    </div>
                </div>

                {/* Dental Complaints */}
                <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <ClipboardList className="h-4 w-4" /> الشكوى السنية
                    </h4>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div className="flex flex-wrap gap-2 mb-3">
                            {selectedCase.problems.map((p, idx) => (
                                <span key={idx} className="bg-white text-blue-800 px-3 py-1 rounded-full text-sm font-medium border border-blue-200 shadow-sm">
                                    {p}
                                </span>
                            ))}
                        </div>
                        {selectedCase.additionalNotes && (
                            <div className="text-sm text-gray-700 mt-2 pt-2 border-t border-blue-200">
                                <span className="font-bold">ملاحظات إضافية:</span> {selectedCase.additionalNotes}
                            </div>
                        )}
                        {!selectedCase.additionalNotes && <div className="text-sm text-gray-500 italic">لا توجد ملاحظات إضافية</div>}
                    </div>
                </div>

                {/* Action: PUBLISH (For New Requests) */}
                {selectedCase.status === CaseStatus.RECEIVED && (
                    <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200 shadow-inner">
                        <h4 className="font-bold text-yellow-900 mb-2">إجراءات القبول</h4>
                        <p className="text-sm text-yellow-800 mb-4">
                            مراجعة البيانات قبل النشر. عند الموافقة، سيتم إرسال إشعار للطلاب على تيليجرام.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => handlePublishCase(selectedCase.id)}
                                className="flex-1 bg-medical-600 text-white px-4 py-2 rounded-md hover:bg-medical-700 flex items-center justify-center gap-2 shadow-sm font-bold"
                            >
                                <Send className="h-4 w-4" /> الموافقة ونشر للطلاب
                            </button>
                            <button 
                                onClick={() => handleRejectNewRequest(selectedCase.id)}
                                className="flex-1 bg-white text-red-600 border border-red-200 px-4 py-2 rounded-md hover:bg-red-50 flex items-center justify-center gap-2 shadow-sm"
                            >
                                <XCircle className="h-4 w-4" /> رفض الطلب
                            </button>
                        </div>
                    </div>
                )}

              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
