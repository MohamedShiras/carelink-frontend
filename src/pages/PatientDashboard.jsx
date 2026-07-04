import { useState, useEffect } from "react";
import api from "../services/api";
import { 
  Activity, Calendar, CheckCircle2, Circle, Clock, FileText, LogOut, 
  AlertTriangle, ArrowRight, ShieldCheck, Stethoscope, Trash2, User 
} from "lucide-react";

const symptomOptions = [
  { id: "high_fever", label: "High Fever" },
  { id: "mild_fever", label: "Mild Fever" },
  { id: "chills", label: "Chills" },
  { id: "joint_pain", label: "Joint Pain" },
  { id: "muscle_wasting", label: "Muscle Wasting" },
  { id: "fatigue", label: "Fatigue" },
  { id: "headache", label: "Headache" },
  { id: "cough", label: "Cough" },
  { id: "breathlessness", label: "Breathlessness" },
  { id: "chest_pain", label: "Chest Pain" },
  { id: "nausea", label: "Nausea" },
  { id: "vomiting", label: "Vomiting" },
  { id: "diarrhoea", label: "Diarrhoea" },
  { id: "abdominal_pain", label: "Abdominal Pain" },
  { id: "skin_rash", label: "Skin Rash" },
  { id: "loss_of_appetite", label: "Loss of Appetite" },
  { id: "dizziness", label: "Dizziness" },
  { id: "sweating", label: "Sweating" },
  { id: "weight_loss", label: "Weight Loss" },
  { id: "anxiety", label: "Anxiety" },
  { id: "weakness_in_limbs", label: "Weakness in Limbs" },
  { id: "back_pain", label: "Back Pain" },
  { id: "constipation", label: "Constipation" },
  { id: "yellowish_skin", label: "Yellowish Skin" },
  { id: "dark_urine", label: "Dark Urine" },
  { id: "loss_of_balance", label: "Loss of Balance" },
  { id: "blurred_and_distorted_vision", label: "Blurred or Distorted Vision" },
  { id: "dehydration", label: "Dehydration" },
  { id: "sore_throat", label: "Sore Throat" },
  { id: "runny_nose", label: "Runny Nose" },
  { id: "congestion", label: "Nasal Congestion" },
];

export default function PatientDashboard({ user, onLogout }) {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [triageResult, setTriageResult] = useState(null);
  const [loadingTriage, setLoadingTriage] = useState(false);
  
  const [doctors, setDoctors] = useState([]);
  const [recommendedSpec, setRecommendedSpec] = useState("");

  // Appointment Form
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [loadingBooking, setLoadingBooking] = useState(false);

  // Lists
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [triageHistory, setTriageHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
    fetchInitialDoctors();
  }, []);

  const fetchHistory = async () => {
    try {
      const apptsRes = await api.get("/appointments");
      setAppointments(apptsRes.data.data || []);

      const rxRes = await api.get("/appointments/prescriptions");
      setPrescriptions(rxRes.data.data || []);

      const triageRes = await api.get("/triage/history");
      setTriageHistory(triageRes.data.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const fetchInitialDoctors = async () => {
    try {
      const res = await api.get("/triage/recommend-doctors");
      setDoctors(res.data.data || []);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const handleTriageSubmit = async (e) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) return;

    setLoadingTriage(true);
    setTriageResult(null);

    try {
      const triageRes = await api.post("/triage/diagnose", {
        symptoms: selectedSymptoms,
      });
      setTriageResult(triageRes.data.data || triageRes.data);

      const docsRes = await api.get(`/triage/recommend-doctors?symptomsText=${encodeURIComponent(selectedSymptoms.join(", "))}`);
      setDoctors(docsRes.data.data || []);
      setRecommendedSpec(docsRes.data.recommendedSpecialization || "");
      
      // Select the first doctor if available
      if (docsRes.data.data && docsRes.data.data.length > 0) {
        setSelectedDoctorId(docsRes.data.data[0].id);
      }

      fetchHistory(); // refresh triage history list
    } catch (err) {
      console.error("Triage assessment failed", err);
    } finally {
      setLoadingTriage(false);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId || !appointmentDate || !timeSlot) {
      setBookingMessage("Please fill in all booking fields.");
      return;
    }

    setLoadingBooking(true);
    setBookingMessage("");

    try {
      await api.post("/appointments", {
        doctorId: parseInt(selectedDoctorId),
        appointmentDate,
        timeSlot,
        notes
      });
      setBookingMessage("Appointment booked successfully!");
      setAppointmentDate("");
      setTimeSlot("");
      setNotes("");
      fetchHistory(); // refresh appointment list
    } catch (err) {
      setBookingMessage(err.response?.data?.message || "Booking failed.");
    } finally {
      setLoadingBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 py-4 px-6 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/30">
              <Activity className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide text-white">CareLink</h1>
              <p className="text-xs text-slate-400">Patient Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-full border border-slate-700">
              <User className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-200">{user.name}</span>
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

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Triage, Doctor recs, Booking */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Triage Tool */}
          <section className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Activity className="text-emerald-400 h-5 w-5" />
              Symptom Selection & Disease Diagnosis
            </h2>
            <p className="text-slate-400 text-sm mb-4">
              Select the symptoms that match your condition exactly. The diagnosis request uses the same symptom IDs as the training data.
            </p>

            <form onSubmit={handleTriageSubmit} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {symptomOptions.map((symptom) => {
                  const selected = selectedSymptoms.includes(symptom.id);

                  return (
                    <button
                      key={symptom.id}
                      type="button"
                      onClick={() => {
                        setTriageResult(null);
                        setSelectedSymptoms((current) =>
                          current.includes(symptom.id)
                            ? current.filter((id) => id !== symptom.id)
                            : [...current, symptom.id]
                        );
                      }}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                        selected
                          ? "border-emerald-500/50 bg-emerald-500/10 text-white"
                          : "border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                      }`}
                    >
                      <span className="text-sm font-medium">{symptom.label}</span>
                      <span className={selected ? "text-emerald-400" : "text-slate-500"}>
                        {selected ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedSymptoms(symptomOptions.map((symptom) => symptom.id))}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-900"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Select all
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSymptoms([]);
                    setTriageResult(null);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-900"
                >
                  <Trash2 className="h-4 w-4 text-rose-400" />
                  Clear
                </button>
                <div className="text-xs text-slate-500">
                  Selected: {selectedSymptoms.length} symptom{selectedSymptoms.length === 1 ? "" : "s"}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loadingTriage || selectedSymptoms.length === 0}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition disabled:opacity-50"
                >
                  {loadingTriage ? "Analyzing..." : "Diagnose Disease"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Triage Output */}
            {triageResult && (
              <div className={`mt-6 p-4 rounded-xl border ${
                (triageResult.triagePriority === 'Critical' || triageResult.severityScore >= 8)
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-200' 
                  : (triageResult.triagePriority === 'Moderate' || triageResult.severityScore >= 5)
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
              }`}>
                <div className="flex items-start gap-3">
                  {triageResult.triagePriority === 'Critical' || triageResult.severityScore >= 8 ? (
                    <AlertTriangle className="h-6 w-6 text-rose-400 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-wider">
                      Disease Diagnosis: {triageResult.predictedDisease || triageResult.disease || triageResult.prediction || triageResult.triagePriority || 'Unknown'}
                    </h3>
                    <p className="text-sm mt-1 text-slate-300">
                      Severity Score: {triageResult.severityScore ?? '-'} / 10
                    </p>
                    <p className="text-sm mt-1 text-slate-300">{triageResult.aiRecommendation || triageResult.recommendation || triageResult.message || "Diagnosis completed."}</p>
                    {(triageResult.triagePriority === 'Critical' || triageResult.severityScore >= 8) && (
                      <p className="text-xs mt-2 text-rose-400 font-semibold">
                        ⚠️ EMERGENCY DETECTED: Please seek immediate emergency medical care or call 911/199.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Doctor Recommendations & Appointment Booking */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Recommended Doctors */}
            <section className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col">
              <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Stethoscope className="text-blue-400 h-5 w-5" />
                Doctors List
              </h2>
              {recommendedSpec && (
                <span className="text-xs px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 font-medium mb-3 self-start">
                  Recommended Specialty: {recommendedSpec}
                </span>
              )}
              
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-1">
                {doctors.length === 0 ? (
                  <p className="text-slate-500 text-sm">No doctors found.</p>
                ) : (
                  doctors.map((doc) => (
                    <div 
                      key={doc.id}
                      onClick={() => setSelectedDoctorId(doc.id.toString())}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                        selectedDoctorId === doc.id.toString()
                          ? 'bg-blue-500/10 border-blue-500/50'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-sm text-white">Dr. {doc.User?.name || "Specialist"}</h4>
                          <p className="text-xs text-slate-400">{doc.specialization}</p>
                          <p className="text-[11px] text-slate-500 mt-1">{doc.User?.email}</p>
                        </div>
                        {selectedDoctorId === doc.id.toString() && (
                          <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded font-semibold">
                            Selected
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Quick Book Appointment */}
            <section className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="text-indigo-400 h-5 w-5" />
                Book Consultation
              </h2>
              
              {bookingMessage && (
                <div className={`p-3 rounded-lg text-xs font-semibold mb-4 ${
                  bookingMessage.includes("success") 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}>
                  {bookingMessage}
                </div>
              )}

              <form onSubmit={handleBookAppointment} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Select Doctor</label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-slate-200 text-sm focus:ring-1 focus:ring-indigo-500"
                    required
                  >
                    <option value="">-- Choose Doctor --</option>
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        Dr. {doc.User?.name || "Specialist"} ({doc.specialization})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-slate-200 text-sm focus:ring-1 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Time Slot</label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-slate-200 text-sm focus:ring-1 focus:ring-indigo-500"
                      required
                    >
                      <option value="">-- Slot --</option>
                      <option value="09:00 AM - 10:00 AM">09:00 AM</option>
                      <option value="10:30 AM - 11:30 AM">10:30 AM</option>
                      <option value="02:00 PM - 03:00 PM">02:00 PM</option>
                      <option value="04:00 PM - 05:00 PM">04:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Notes / Symptoms</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="E.g., Follow up checkup"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-slate-200 text-sm focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingBooking}
                  className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-sm transition"
                >
                  {loadingBooking ? "Booking..." : "Schedule Appointment"}
                </button>
              </form>
            </section>
          </div>

        </div>

        {/* Right 1 Column: History & Prescriptions */}
        <div className="space-y-6">
          
          {/* Triage & Assessment History */}
          <section className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="text-teal-400 h-5 w-5" />
              Symptom Log History
            </h2>
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
              {triageHistory.length === 0 ? (
                <p className="text-slate-500 text-sm py-4">No assessments logged yet.</p>
              ) : (
                triageHistory.map((th) => (
                  <div key={th.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        th.triagePriority === 'Critical' 
                          ? 'bg-rose-500/20 text-rose-400' 
                          : th.triagePriority === 'Moderate'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {th.triagePriority} (Severity: {th.severityScore})
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(th.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 italic line-clamp-2">"{th.symptomsText}"</p>
                    <p className="text-[11px] text-slate-400 mt-1">{th.aiRecommendation}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Appointments List */}
          <section className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="text-indigo-400 h-5 w-5" />
              My Appointments
            </h2>
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
              {appointments.length === 0 ? (
                <p className="text-slate-500 text-sm py-4">No appointments scheduled.</p>
              ) : (
                appointments.map((appt) => (
                  <div key={appt.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-sm text-slate-200">
                          Dr. {appt.Doctor?.User?.name || "Specialist"}
                        </h4>
                        <p className="text-xs text-slate-400">{appt.appointmentDate}</p>
                        <p className="text-[11px] text-slate-500">{appt.timeSlot}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        appt.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : appt.status === 'Cancelled'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-indigo-500/20 text-indigo-400'
                      }`}>
                        {appt.status}
                      </span>
                    </div>
                    {appt.notes && (
                      <p className="text-[11px] text-slate-500 mt-2 bg-slate-900/60 p-1.5 rounded italic">
                        Notes: {appt.notes}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Prescriptions List */}
          <section className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="text-amber-400 h-5 w-5" />
              Medications & Prescriptions
            </h2>
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
              {prescriptions.length === 0 ? (
                <p className="text-slate-500 text-sm py-4">No prescriptions issued yet.</p>
              ) : (
                prescriptions.map((rx) => (
                  <div key={rx.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-sm text-slate-200">
                        Prescription #{rx.id}
                      </h4>
                      <span className="text-[10px] text-slate-500">
                        {new Date(rx.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-amber-400 font-medium">Medicines: {rx.medicines}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Instructions: {rx.dosageInstructions}</p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Doctor: Dr. {rx.Doctor?.User?.name || "Specialist"}
                    </p>
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
