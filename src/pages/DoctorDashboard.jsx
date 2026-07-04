import { useState, useEffect } from "react";
import api from "../services/api";
import { 
  Activity, Calendar, FileText, Send, User, LogOut, 
  PlusCircle, CheckCircle, Clock, Heart, Users
} from "lucide-react";

export default function DoctorDashboard({ user, onLogout }) {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Write Prescription Form
  const [selectedApptId, setSelectedApptId] = useState("");
  const [medicines, setMedicines] = useState("");
  const [dosageInstructions, setDosageInstructions] = useState("");
  const [prescriptionMessage, setPrescriptionMessage] = useState("");
  const [submittingPrescription, setSubmittingPrescription] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const apptsRes = await api.get("/appointments");
      setAppointments(apptsRes.data.data || []);

      const rxRes = await api.get("/appointments/prescriptions");
      setPrescriptions(rxRes.data.data || []);
    } catch (err) {
      console.error("Error fetching doctor data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApptId || !medicines.trim() || !dosageInstructions.trim()) {
      setPrescriptionMessage("Please fill in all prescription fields.");
      return;
    }

    setSubmittingPrescription(true);
    setPrescriptionMessage("");

    try {
      await api.post("/appointments/prescription", {
        appointmentId: parseInt(selectedApptId),
        medicines,
        dosageInstructions
      });
      setPrescriptionMessage("Prescription created and appointment completed!");
      setMedicines("");
      setDosageInstructions("");
      setSelectedApptId("");
      fetchData(); // refresh lists
    } catch (err) {
      setPrescriptionMessage(err.response?.data?.message || "Failed to create prescription.");
    } finally {
      setSubmittingPrescription(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 py-4 px-6 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 p-2 rounded-xl border border-blue-500/30">
              <Activity className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide text-white">CareLink</h1>
              <p className="text-xs text-slate-400">Doctor Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-full border border-slate-700">
              <User className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-slate-200">Dr. {user.name}</span>
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

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Appointment Queue */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calendar className="text-blue-400 h-5 w-5" />
                Your Appointment Schedule
              </h2>
              <button 
                onClick={fetchData}
                className="text-xs text-blue-400 hover:underline"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <p className="text-slate-400 text-sm py-8 text-center">Loading appointments...</p>
            ) : appointments.length === 0 ? (
              <p className="text-slate-500 text-sm py-8 text-center">No appointments scheduled for you.</p>
            ) : (
              <div className="space-y-4">
                {appointments.map((appt) => (
                  <div key={appt.id} className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{appt.Patient?.User?.name || "Patient"}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          appt.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                            : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20'
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">Date: {appt.appointmentDate} | Slot: {appt.timeSlot}</p>
                      {appt.notes && (
                        <p className="text-xs text-slate-500 italic mt-1">"{appt.notes}"</p>
                      )}
                    </div>
                    
                    {appt.status !== 'Completed' && (
                      <button
                        onClick={() => setSelectedApptId(appt.id.toString())}
                        className="self-start md:self-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Write Prescription
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Side: Write Prescription and Prescription History */}
        <div className="space-y-6">
          
          {/* Write Prescription Form */}
          {selectedApptId && (
            <section className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="text-amber-400 h-5 w-5" />
                New Prescription
              </h2>

              {prescriptionMessage && (
                <div className={`p-3 rounded-lg text-xs font-semibold mb-4 ${
                  prescriptionMessage.includes("success") 
                    ? "bg-emerald-500/10 text-emerald-400" 
                    : "bg-rose-500/10 text-rose-400"
                }`}>
                  {prescriptionMessage}
                </div>
              )}

              <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Appointment ID</label>
                  <input
                    type="text"
                    value={selectedApptId}
                    readOnly
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-slate-500 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Medicines</label>
                  <textarea
                    value={medicines}
                    onChange={(e) => setMedicines(e.target.value)}
                    placeholder="Amoxicillin 500mg, Paracetamol 500mg"
                    className="w-full h-20 px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-slate-200 placeholder-slate-600 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Dosage Instructions</label>
                  <input
                    type="text"
                    value={dosageInstructions}
                    onChange={(e) => setDosageInstructions(e.target.value)}
                    placeholder="Three times a day after meals for 5 days"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-slate-200 placeholder-slate-600 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={submittingPrescription}
                    className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-sm transition"
                  >
                    {submittingPrescription ? "Submitting..." : "Issue Prescription"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedApptId("")}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* Past Prescriptions History */}
          <section className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="text-indigo-400 h-5 w-5" />
              Prescription History
            </h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {prescriptions.length === 0 ? (
                <p className="text-slate-500 text-sm py-4">No past prescriptions found.</p>
              ) : (
                prescriptions.map((rx) => (
                  <div key={rx.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-left">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] text-slate-500">
                        {new Date(rx.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded font-bold uppercase">
                        {rx.status}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm text-slate-200 mt-1">
                      Patient: {rx.Patient?.User?.name || "Patient"}
                    </h4>
                    <p className="text-xs text-amber-400 font-medium mt-1">Medicines: {rx.medicines}</p>
                    <p className="text-[11px] text-slate-400">Instructions: {rx.dosageInstructions}</p>
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
