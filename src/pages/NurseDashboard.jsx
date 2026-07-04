import { useState, useEffect } from "react";
import api from "../services/api";
import { 
  Activity, Users, LogOut, FileText, Send, User, 
  Bed, ClipboardList, PlusCircle, CheckCircle, ShieldAlert
} from "lucide-react";

export default function NurseDashboard({ user, onLogout }) {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Admission Form
  const [patientName, setPatientName] = useState("");
  const [ward, setWard] = useState("");
  const [nurseNotes, setNurseNotes] = useState("");
  const [admissionMessage, setAdmissionMessage] = useState("");
  const [submittingAdmission, setSubmittingAdmission] = useState(false);

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/admissions");
      setAdmissions(res.data.data || []);
    } catch (err) {
      console.error("Error fetching admissions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdmissionSubmit = async (e) => {
    e.preventDefault();
    if (!patientName.trim() || !ward.trim() || !nurseNotes.trim()) {
      setAdmissionMessage("Please fill in all admission fields.");
      return;
    }

    setSubmittingAdmission(true);
    setAdmissionMessage("");

    try {
      await api.post("/admin/admissions", {
        patientName,
        ward,
        nurseNotes
      });
      setAdmissionMessage("Patient admitted successfully!");
      setPatientName("");
      setWard("");
      setNurseNotes("");
      fetchAdmissions(); // refresh admissions list
    } catch (err) {
      setAdmissionMessage(err.response?.data?.message || "Failed to admit patient.");
    } finally {
      setSubmittingAdmission(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 py-4 px-6 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500/10 p-2 rounded-xl border border-teal-500/30">
              <Activity className="h-6 w-6 text-teal-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide text-white">CareLink</h1>
              <p className="text-xs text-slate-400">Nursing & Admission Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-full border border-slate-700">
              <User className="h-4 w-4 text-teal-400" />
              <span className="text-sm font-medium text-slate-200">Nurse {user.name}</span>
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-lg border border-rose-500/20 transition duration-150"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Create Admission Form */}
        <div className="lg:col-span-1">
          <section className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Bed className="text-teal-400 h-5 w-5" />
              Admit New Patient
            </h2>

            {admissionMessage && (
              <div className={`p-3 rounded-lg text-xs font-semibold mb-4 ${
                admissionMessage.includes("successfully") 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}>
                {admissionMessage}
              </div>
            )}

            <form onSubmit={handleAdmissionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Patient Full Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-slate-200 placeholder-slate-600 text-sm focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Ward / Room Assignment</label>
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder="e.g. ICU Ward A, Room 302"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-slate-200 placeholder-slate-600 text-sm focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Initial Nursing Notes</label>
                <textarea
                  value={nurseNotes}
                  onChange={(e) => setNurseNotes(e.target.value)}
                  placeholder="Patient status, heart rate, symptoms on arrival, allergy warnings..."
                  className="w-full h-24 px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-slate-200 placeholder-slate-600 text-sm focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingAdmission}
                className="w-full py-2 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-sm transition"
              >
                {submittingAdmission ? "Registering..." : "Confirm Ward Admission"}
              </button>
            </form>
          </section>
        </div>

        {/* Right Side: Active Admissions Log */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <ClipboardList className="text-teal-400 h-5 w-5" />
                Active Ward Admissions Log
              </h2>
              <button 
                onClick={fetchAdmissions}
                className="text-xs text-teal-400 hover:underline"
              >
                Refresh Log
              </button>
            </div>

            {loading ? (
              <p className="text-slate-400 text-sm py-8 text-center">Loading admissions...</p>
            ) : admissions.length === 0 ? (
              <p className="text-slate-500 text-sm py-8 text-center">No active admissions recorded.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {admissions.map((adm) => (
                  <div key={adm.id} className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-white text-sm">{adm.patientName}</h3>
                        <span className="text-[10px] px-2 py-0.5 bg-teal-500/20 text-teal-300 rounded font-bold uppercase">
                          {adm.ward}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Admitted: {new Date(adm.admittedAt).toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-300 italic bg-slate-900/50 p-2 rounded mt-2 border border-slate-850">
                        Notes: {adm.nurseNotes}
                      </p>
                    </div>
                    
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                      <span>ID: {adm.id}</span>
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <CheckCircle className="h-3 w-3" /> Status: Admitted
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

      </main>
    </div>
  );
}
