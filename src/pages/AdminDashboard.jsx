import { useState, useEffect } from "react";
import api from "../services/api";
import { 
  Activity, Users, LogOut, Shield, Database, Calendar,
  TrendingUp, ActivitySquare, ShieldCheck, RefreshCw, BarChart2
} from "lucide-react";

export default function AdminDashboard({ user, onLogout }) {
  const [stats, setStats] = useState(null);
  const [admissions, setAdmissions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get("/admin/stats");
      setStats(statsRes.data.stats || null);

      const admRes = await api.get("/admin/admissions");
      setAdmissions(admRes.data.data || []);

      const apptRes = await api.get("/appointments");
      setAppointments(apptRes.data.data || []);
    } catch (err) {
      console.error("Error fetching admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 py-4 px-6 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/10 p-2 rounded-xl border border-indigo-500/30">
              <Shield className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide text-white">CareLink</h1>
              <p className="text-xs text-slate-400">Admin Control Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-full border border-slate-700">
              <ShieldCheck className="h-4 w-4 text-indigo-400" />
              <span className="text-sm font-medium text-slate-200">Admin {user.name}</span>
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

      {/* Main Stats Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">
        
        {/* Title row */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">System Diagnostics</h2>
            <p className="text-xs text-slate-400">Real-time health center operations and database metrics</p>
          </div>
          <button 
            onClick={fetchAdminData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-xs transition font-semibold"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            Sync Stats
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Users</span>
            <span className="text-2xl font-bold text-white mt-2">{stats?.totalUsers ?? '-'}</span>
          </div>

          <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Patients</span>
            <span className="text-2xl font-bold text-emerald-400 mt-2">{stats?.totalPatients ?? '-'}</span>
          </div>

          <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Doctors</span>
            <span className="text-2xl font-bold text-blue-400 mt-2">{stats?.totalDoctors ?? '-'}</span>
          </div>

          <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Appointments</span>
            <span className="text-2xl font-bold text-indigo-400 mt-2">{stats?.totalAppointments ?? '-'}</span>
          </div>

          <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pending Triages</span>
            <span className="text-2xl font-bold text-amber-400 mt-2">{stats?.pendingTriages ?? '-'}</span>
          </div>

          <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Admitted Wards</span>
            <span className="text-2xl font-bold text-teal-400 mt-2">{stats?.activeAdmissions ?? '-'}</span>
          </div>

        </div>

        {/* Operational Records */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Recent Appointments */}
          <section className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="text-indigo-400 h-5 w-5" />
              All Appointments Logs
            </h3>
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {appointments.length === 0 ? (
                <p className="text-slate-500 text-sm py-8 text-center">No appointment logs found.</p>
              ) : (
                appointments.map((appt) => (
                  <div key={appt.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-200">
                        Patient: {appt.Patient?.User?.name || "Patient"}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Doctor: Dr. {appt.Doctor?.User?.name || "Specialist"}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Date: {appt.appointmentDate} | Slot: {appt.timeSlot}
                      </p>
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                      appt.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : appt.status === 'Cancelled'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Active Admissions */}
          <section className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Database className="text-teal-400 h-5 w-5" />
              Current Ward Admissions
            </h3>
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {admissions.length === 0 ? (
                <p className="text-slate-500 text-sm py-8 text-center">No active ward admissions.</p>
              ) : (
                admissions.map((adm) => (
                  <div key={adm.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm text-slate-200">{adm.patientName}</h4>
                      <p className="text-[11px] text-slate-400">
                        Admitted: {new Date(adm.admittedAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-slate-500 italic">"Notes: {adm.nurseNotes}"</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-teal-500/25 text-teal-300 border border-teal-500/30 rounded font-semibold uppercase">
                      {adm.ward}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>

      </main>
    </div>
  );
}
