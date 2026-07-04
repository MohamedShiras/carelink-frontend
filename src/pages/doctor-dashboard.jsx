import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    LayoutDashboard, Users, UploadCloud, BrainCircuit, ClipboardList, 
    LogOut, Search, Plus, Check, X, Activity, FileText, AlertTriangle, 
    HeartPulse, Clock, FileSpreadsheet, Eye, UserMinus, ShieldAlert
} from "lucide-react";

export default function DoctorDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    
    // Modal state for register patient
    const [newPatient, setNewPatient] = useState({
        name: "",
        age: "",
        gender: "Male",
        room: "",
        diagnosis: "",
        allergies: "",
        warnings: "None",
        history: ""
    });

    // Report upload form state
    const [uploadForm, setUploadForm] = useState({
        patientId: "",
        name: "",
        type: "Lab Report",
        fileSize: "1.5 MB"
    });

    // Mock Patients State
    const [patients, setPatients] = useState([
        { 
            id: "P101", 
            name: "Sarah Jenkins", 
            age: 42, 
            gender: "Female", 
            room: "Ward 3A - Bed 4", 
            diagnosis: "Chronic Hypertension & CKD Stage 3", 
            doctor: "Dr. Alexander Ross", 
            status: "Active", 
            allergies: "Penicillin, Sulfa drugs", 
            warnings: "High Risk for Acute Kidney Injury", 
            history: "Admitted on June 10, history of congestive heart failure. Blood pressure consistently high. GFR has been declining over the last quarter." 
        },
        { 
            id: "P102", 
            name: "David Miller", 
            age: 58, 
            gender: "Male", 
            room: "ICU - Bed 2", 
            diagnosis: "Post-op Coronary Artery Bypass", 
            doctor: "Dr. Alexander Ross", 
            status: "Active", 
            allergies: "Lisinopril", 
            warnings: "Arrhythmia Alert, Troponin Anomaly", 
            history: "Admitted on June 12 for emergency CABG surgery. Recovering under close observation. Frequent PVCs observed on telemetry." 
        },
        { 
            id: "P103", 
            name: "Elena Rostova", 
            age: 29, 
            gender: "Female", 
            room: "Ward 2B - Bed 12", 
            diagnosis: "Acute Lobar Pneumonia", 
            doctor: "Dr. Alexander Ross", 
            status: "Active", 
            allergies: "None", 
            warnings: "None", 
            history: "Admitted on June 14, presenting with high fever and productive cough. Chest X-Ray confirmed consolidated right lower lobe. Responding well to IV antibiotics." 
        },
        { 
            id: "P104", 
            name: "Marcus Thompson", 
            age: 67, 
            gender: "Male", 
            room: "Discharged", 
            diagnosis: "Type 2 Diabetes Mellitus", 
            doctor: "Dr. Alexander Ross", 
            status: "Discharged", 
            allergies: "Aspirin", 
            warnings: "None", 
            history: "Managed for diabetic ketoacidosis. Discharged on June 13 following glucose stabilization and counseling on insulin regimens." 
        }
    ]);

    // Mock Reports State
    const [reports, setReports] = useState([
        { 
            id: "R401", 
            patientId: "P101", 
            patientName: "Sarah Jenkins", 
            name: "Full Blood Count & Renal Panel", 
            type: "Lab Report", 
            uploadedAt: "2026-06-14 09:30", 
            status: "Completed", 
            aiStatus: "Completed", 
            fileSize: "1.2 MB" 
        },
        { 
            id: "R402", 
            patientId: "P102", 
            patientName: "David Miller", 
            name: "Cardiac Biomarker Panel", 
            type: "Lab Report", 
            uploadedAt: "2026-06-15 08:15", 
            status: "Completed", 
            aiStatus: "Pending Approval", 
            fileSize: "850 KB" 
        },
        { 
            id: "R403", 
            patientId: "P103", 
            patientName: "Elena Rostova", 
            name: "Chest X-Ray AP View", 
            type: "Radiology Report", 
            uploadedAt: "2026-06-15 10:20", 
            status: "Processing", 
            aiStatus: "Analyzing", 
            fileSize: "4.5 MB" 
        }
    ]);

    // Mock AI Analysis/Predictions State
    const [aiAnalysis, setAiAnalysis] = useState({
        P101: {
            patientName: "Sarah Jenkins",
            summary: "Patient GFR is 45 mL/min/1.73m² and creatinine is 1.8 mg/dL. This pattern is indicative of a Stage 1 Acute Kidney Injury (AKI) superimposed on Chronic Kidney Disease.",
            anomalies: [
                { name: "Serum Creatinine", value: "1.8 mg/dL", standard: "0.6 - 1.2 mg/dL", status: "High", percent: 85 },
                { name: "eGFR", value: "45 mL/min", standard: "> 90 mL/min", status: "Low", percent: 35 }
            ],
            drugWarnings: "CRITICAL WARNING: Avoid prescribing NSAIDs (Ibuprofen, Naproxen). Potential drug-drug interaction between Lisinopril and Spironolactone, risking Hyperkalemia.",
            suggestions: [
                { id: 1, type: "Medication", text: "Temporarily hold Lisinopril if potassium exceeds 5.2 mEq/L." },
                { id: 2, type: "Monitoring", text: "Order repeat basic metabolic panel in 24 hours." }
            ],
            sideEffects: "High likelihood of electrolyte imbalances (hyperkalemia) and fluid retention under current dosage.",
            recoveryTime: "4 - 6 days to baseline creatinine under renal dosing adjustments.",
            status: "Pending Approval",
            doctorNotes: ""
        },
        P102: {
            patientName: "David Miller",
            summary: "Elevated Troponin I levels (0.4 ng/mL) and postoperative cardiac strain detected. ECG telemetry indicates frequent PVCs.",
            anomalies: [
                { name: "Troponin I", value: "0.4 ng/mL", standard: "< 0.04 ng/mL", status: "High", percent: 90 },
                { name: "PVC Frequency", value: "8 per min", standard: "< 1 per min", status: "Anomaly", percent: 78 }
            ],
            drugWarnings: "WARNING: Ensure proper anticoagulation dosing post-CABG. Monitor concurrent aspirin therapy.",
            suggestions: [
                { id: 1, type: "Medication", text: "Initiate low-dose beta blocker (e.g., Metoprolol 25mg) if hemodynamically stable." }
            ],
            sideEffects: "Risk of postoperative bradycardia or hypotension.",
            recoveryTime: "7 - 10 days for initial stabilization.",
            status: "Pending Approval",
            doctorNotes: ""
        }
    });

    // Mock Nurse Logs State
    const [nurseLogs, setNurseLogs] = useState([
        { 
            id: "N901", 
            patientId: "P101", 
            patientName: "Sarah Jenkins", 
            vitals: "BP: 158/92, HR: 78 bpm, Temp: 98.4 F, SpO2: 97%", 
            notes: "Patient complains of mild headache. Input/Output fluid chart is being monitored closely. Low urine output logged.", 
            loggedBy: "Nurse Jessica Smith", 
            loggedAt: "2026-06-15 11:30", 
            escalated: false,
            escalationStatus: "Normal"
        },
        { 
            id: "N902", 
            patientId: "P102", 
            patientName: "David Miller", 
            vitals: "BP: 102/64, HR: 98 bpm, Temp: 99.1 F, SpO2: 95%", 
            notes: "Chest tube drainage logged at 40ml. Patient reports chest pain level 6/10; analgesics administered. Alerted doctor due to pain elevation.", 
            loggedBy: "Nurse Jessica Smith", 
            loggedAt: "2026-06-15 12:15", 
            escalated: true,
            escalationStatus: "Critical"
        }
    ]);

    // Handle user logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // Add new patient (Register New Patient)
    const handleRegisterPatient = (e) => {
        e.preventDefault();
        const patientId = `P${100 + patients.length + 1}`;
        const createdPatient = {
            id: patientId,
            ...newPatient,
            doctor: "Dr. Alexander Ross",
            status: "Active"
        };
        setPatients([...patients, createdPatient]);
        setShowRegisterModal(false);
        setNewPatient({
            name: "",
            age: "",
            gender: "Male",
            room: "",
            diagnosis: "",
            allergies: "",
            warnings: "None",
            history: ""
        });
    };

    // Discharge patient
    const handleDischargePatient = (patientId) => {
        setPatients(patients.map(p => {
            if (p.id === patientId) {
                return { ...p, status: "Discharged", room: "Discharged" };
            }
            return p;
        }));
        if (selectedPatient && selectedPatient.id === patientId) {
            setSelectedPatient(prev => ({ ...prev, status: "Discharged", room: "Discharged" }));
        }
    };

    // Upload Report Simulation
    const handleUploadReport = (e) => {
        e.preventDefault();
        const patientObj = patients.find(p => p.id === uploadForm.patientId);
        if (!patientObj) return;

        const reportId = `R${400 + reports.length + 1}`;
        const newReport = {
            id: reportId,
            patientId: uploadForm.patientId,
            patientName: patientObj.name,
            name: uploadForm.name,
            type: uploadForm.type,
            uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            status: "Processing",
            aiStatus: "Analyzing",
            fileSize: uploadForm.fileSize
        };

        setReports([newReport, ...reports]);
        setUploadForm({
            patientId: "",
            name: "",
            type: "Lab Report",
            fileSize: "1.5 MB"
        });
    };

    // Trigger AI Analysis manually
    const handleTriggerAI = (reportId) => {
        setReports(reports.map(r => {
            if (r.id === reportId) {
                return { ...r, status: "Completed", aiStatus: "Pending Approval" };
            }
            return r;
        }));

        // Generate AI analysis for patient if it doesn't exist
        const report = reports.find(r => r.id === reportId);
        if (report && !aiAnalysis[report.patientId]) {
            setAiAnalysis(prev => ({
                ...prev,
                [report.patientId]: {
                    patientName: report.patientName,
                    summary: `AI clinical review completed on ${report.name}. Patient shows mild deviations from baseline parameters. Recommend careful monitoring.`,
                    anomalies: [
                        { name: "White Cell Count", value: "11.2 x10^9/L", standard: "4.0 - 11.0 x10^9/L", status: "High", percent: 70 }
                    ],
                    drugWarnings: "None detected.",
                    suggestions: [
                        { id: 1, type: "Monitoring", text: "Repeat vitals check in next nurse shift." }
                    ],
                    sideEffects: "Low risk expected.",
                    recoveryTime: "3 - 5 days",
                    status: "Pending Approval",
                    doctorNotes: ""
                }
            }));
        }
    };

    // Verify and Approve AI Output
    const handleApproveAI = (patientId, notes) => {
        if (aiAnalysis[patientId]) {
            setAiAnalysis(prev => ({
                ...prev,
                [patientId]: {
                    ...prev[patientId],
                    status: "Approved",
                    doctorNotes: notes
                }
            }));
        }
    };

    // Override AI Suggestion
    const handleOverrideAI = (patientId, notes) => {
        if (aiAnalysis[patientId]) {
            setAiAnalysis(prev => ({
                ...prev,
                [patientId]: {
                    ...prev[patientId],
                    status: "Overridden",
                    doctorNotes: notes
                }
            }));
        }
    };

    // Acknowledge Nurse Escalation Alert
    const handleAcknowledgeEscalation = (logId) => {
        setNurseLogs(nurseLogs.map(log => {
            if (log.id === logId) {
                return { ...log, escalated: false, escalationStatus: "Acknowledged" };
            }
            return log;
        }));
    };

    // Filter patients by search query
    const filteredPatients = patients.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Active stats counters
    const totalPatients = patients.filter(p => p.status === "Active").length;
    const pendingAI = reports.filter(r => r.aiStatus === "Pending Approval").length;
    const criticalAlerts = nurseLogs.filter(n => n.escalated).length;
    const processingReports = reports.filter(r => r.status === "Processing").length;

    return (
        <div className="fixed inset-0 w-screen h-screen flex bg-[#05070e] font-sans text-slate-200 overflow-hidden">
            
            {/* Holographic Glowing Ambient Background Blobs */}
            <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none opacity-40">
                <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] rounded-full blur-[140px] bg-teal-500/10"></div>
                <div className="absolute bottom-[10%] right-[5%] w-[550px] h-[550px] rounded-full blur-[140px] bg-indigo-500/15"></div>
                <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] rounded-full blur-[120px] bg-pink-500/10 animate-float-blob"></div>
            </div>

            {/* Floating Glassmorphic Control Dock (Sidebar) */}
            <div className="m-5 ml-6 h-[calc(100vh-2.5rem)] w-76 bg-slate-950/70 border border-white/10 rounded-[28px] flex flex-col p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-20 backdrop-blur-xl shrink-0">
                
                {/* Brand Logo & pulse */}
                <div className="flex items-center gap-3.5 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-indigo-500 flex justify-center items-center text-white shadow-[0_0_15px_rgba(20,184,166,0.3)] animate-pulse-logo">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent tracking-wide font-sans">CareLink</h1>
                        <p className="text-[9px] text-teal-400 uppercase tracking-widest font-extrabold">Clinician Console</p>
                    </div>
                </div>

                {/* Attending Physician holographic badge */}
                <div className="bg-slate-900/40 border border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.05)] rounded-2xl p-4.5 mb-8 flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-slate-950 border border-teal-500/30 flex justify-center items-center text-teal-400 font-extrabold relative shadow-[0_0_10px_rgba(20,184,166,0.2)]">
                        AR
                        <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-teal-500 border-2 border-slate-950 rounded-full animate-ping"></span>
                    </div>
                    <div className="overflow-hidden">
                        <h2 className="text-sm font-bold text-white truncate">Dr. Alexander Ross</h2>
                        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Primary Cardiologist</p>
                    </div>
                </div>

                {/* Tab Menu Options with glowing active indicator */}
                <div className="flex flex-col gap-3 flex-1">
                    <button 
                        onClick={() => setActiveTab("overview")}
                        className={`flex items-center gap-3.5 px-4.5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden group ${activeTab === "overview" ? "bg-gradient-to-r from-teal-500/15 to-indigo-500/15 border-l-4 border-teal-500 text-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.1)]" : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border-l-4 border-transparent"}`}
                    >
                        <LayoutDashboard className="w-[18px] h-[18px]" />
                        <span>Clinical Overview</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab("patients")}
                        className={`flex items-center gap-3.5 px-4.5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden group ${activeTab === "patients" ? "bg-gradient-to-r from-teal-500/15 to-indigo-500/15 border-l-4 border-teal-500 text-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.1)]" : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border-l-4 border-transparent"}`}
                    >
                        <Users className="w-[18px] h-[18px]" />
                        <span>Patient Directory</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab("uploads")}
                        className={`flex items-center gap-3.5 px-4.5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden group ${activeTab === "uploads" ? "bg-gradient-to-r from-teal-500/15 to-indigo-500/15 border-l-4 border-teal-500 text-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.1)]" : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border-l-4 border-transparent"}`}
                    >
                        <UploadCloud className="w-[18px] h-[18px]" />
                        <span>Upload Reports</span>
                        {processingReports > 0 && (
                            <span className="ml-auto w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                        )}
                    </button>
                    <button 
                        onClick={() => setActiveTab("ai-diagnostics")}
                        className={`flex items-center gap-3.5 px-4.5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden group ${activeTab === "ai-diagnostics" ? "bg-gradient-to-r from-teal-500/15 to-indigo-500/15 border-l-4 border-teal-500 text-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.1)]" : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border-l-4 border-transparent"}`}
                    >
                        <BrainCircuit className="w-[18px] h-[18px]" />
                        <span>AI Diagnostic Desk</span>
                        {pendingAI > 0 && (
                            <span className="ml-auto bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                                {pendingAI}
                            </span>
                        )}
                    </button>
                    <button 
                        onClick={() => setActiveTab("nurse-logs")}
                        className={`flex items-center gap-3.5 px-4.5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden group ${activeTab === "nurse-logs" ? "bg-gradient-to-r from-teal-500/15 to-indigo-500/15 border-l-4 border-teal-500 text-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.1)]" : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border-l-4 border-transparent"}`}
                    >
                        <ClipboardList className="w-[18px] h-[18px]" />
                        <span>Nurse logs</span>
                        {criticalAlerts > 0 && (
                            <span className="ml-auto bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                                {criticalAlerts}
                            </span>
                        )}
                    </button>
                </div>

                {/* Sign Out Button */}
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3.5 px-4.5 py-3.5 text-slate-400 hover:text-red-400 hover:bg-red-500/5 border-l-4 border-transparent rounded-xl text-sm font-semibold transition-all duration-200"
                >
                    <LogOut className="w-[18px] h-[18px]" />
                    <span>Disconnect Console</span>
                </button>
            </div>

            {/* Main Interactive Screen (Detached layout) */}
            <div className="flex-1 m-5 ml-2 h-[calc(100vh-2.5rem)] bg-slate-950/45 border border-white/10 rounded-[28px] z-10 flex flex-col overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-md">
                
                {/* Header Bar with custom drawing Heartbeat ECG animation */}
                <header className="flex items-center justify-between p-6 border-b border-white/10 backdrop-blur-xl bg-slate-950/40 sticky top-0 z-30 overflow-hidden">
                    
                    {/* Running ECG Path */}
                    <div className="absolute bottom-0 left-0 w-full h-[6px] overflow-hidden opacity-30">
                        <svg className="w-full h-full text-teal-400" viewBox="0 0 200 10" preserveAspectRatio="none">
                            <path 
                                d="M0 5 L20 5 L24 2 L28 8 L32 5 L55 5 L58 0 L61 10 L64 5 L85 5 L88 3 L91 7 L94 5 L115 5 L118 1 L121 9 L124 5 L145 5 L148 3 L151 7 L154 5 L175 5 L178 3 L181 7 L184 5 L200 5" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="0.8" 
                                strokeDasharray="1000" 
                                strokeDashoffset="1000"
                                className="animate-pulse-ecg"
                            />
                        </svg>
                    </div>

                    <div>
                        <h2 className="text-xl font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                            {activeTab === "overview" && "Clinical Hub"}
                            {activeTab === "patients" && "Attending Patient Registry"}
                            {activeTab === "uploads" && "Lab Report Processing Desk"}
                            {activeTab === "ai-diagnostics" && "AI Diagnostic Desk"}
                            {activeTab === "nurse-logs" && "Nurse Observation Desk"}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">Attending Clinic: Cardiology & Critical Care Unit</p>
                    </div>

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="text-right max-sm:hidden">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold">Attending Physician</p>
                            <p className="text-xs font-bold text-teal-400">Dr. Alexander Ross, MD</p>
                        </div>
                        <div className="h-8 w-[1px] bg-white/10 max-sm:hidden"></div>
                        <div className="flex items-center gap-2.5 bg-slate-950 border border-teal-500/20 rounded-full px-4 py-2 text-xs text-slate-300 shadow-[0_0_15px_rgba(20,184,166,0.1)]">
                            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping"></span>
                            <span>CareLink AI System Active</span>
                        </div>
                    </div>
                </header>

                {/* View Panel Content */}
                <main className="flex-grow p-8 max-sm:p-4 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/30 via-slate-950/40 to-slate-950">

                    {/* VIEW: CLINICAL OVERVIEW */}
                    {activeTab === "overview" && (
                        <div className="flex flex-col gap-8 animate-card-entrance">
                            
                            {/* Futuristic Statistics Cards (holographic look) */}
                            <div className="grid grid-cols-4 gap-6 max-xl:grid-cols-2 max-sm:grid-cols-1">
                                {[
                                    { title: "Active Patients", val: totalPatients, desc: "Assigned attending case load", icon: Users, color: "text-teal-400", bg: "bg-teal-500/5 border-teal-500/20 hover:border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.05)] hover:shadow-[0_0_25px_rgba(20,184,166,0.15)]" },
                                    { title: "Pending Approvals", val: pendingAI, desc: "Awaiting clinical sign-off", icon: BrainCircuit, color: "text-indigo-400", bg: "bg-indigo-500/5 border-indigo-500/20 hover:border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.05)] hover:shadow-[0_0_25px_rgba(99,102,241,0.15)]" },
                                    { title: "Urgent Alerts", val: criticalAlerts, desc: "Escalated patient observations", icon: ShieldAlert, color: "text-red-400", bg: criticalAlerts > 0 ? "bg-red-500/10 border-red-500/30 text-red-400 animate-glow-pulse" : "bg-slate-900/20 border-white/5 hover:border-white/20" },
                                    { title: "Processing reports", val: processingReports, desc: "AI GFR & scan mapping active", icon: UploadCloud, color: "text-cyan-400", bg: "bg-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.05)] hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]" }
                                ].map((card, i) => (
                                    <div key={i} className={`border rounded-[22px] p-6 backdrop-blur-md transition-all duration-300 relative group flex items-center justify-between ${card.bg}`}>
                                        {/* Scanner Grid Line overlay */}
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:10px_10px] rounded-[22px] pointer-events-none"></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{card.title}</p>
                                            <p className="text-3xl font-extrabold text-white mt-1.5">{card.val}</p>
                                            <p className="text-[10px] text-slate-400 mt-1 font-medium">{card.desc}</p>
                                        </div>
                                        <div className={`w-11 h-11 rounded-xl bg-slate-950 border border-white/10 flex justify-center items-center ${card.color} shadow-lg`}>
                                            <card.icon className="w-5.5 h-5.5" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Main split grid */}
                            <div className="grid grid-cols-3 gap-8 max-xl:grid-cols-1">
                                
                                {/* Active Patients List */}
                                <div className="col-span-2 bg-slate-900/30 border border-white/10 rounded-[24px] p-6 backdrop-blur-xl shadow-2xl relative">
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:24px_24px] rounded-[24px] pointer-events-none"></div>
                                    
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-white tracking-wide">Telemetry Monitoring Feed</h3>
                                            <p className="text-xs text-slate-400 mt-0.5">Attending patient stats and live flag updates</p>
                                        </div>
                                        <button 
                                            onClick={() => setActiveTab("patients")}
                                            className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1.5 transition-colors"
                                        >
                                            Manage Registry &rarr;
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-slate-500 border-b border-white/10 text-[10px] uppercase tracking-widest text-left font-bold">
                                                    <th className="pb-3 pl-2">Attending Patient</th>
                                                    <th className="pb-3">Bed Allocation</th>
                                                    <th className="pb-3">Active Diagnosis</th>
                                                    <th className="pb-3">Biomarker Risk</th>
                                                    <th className="pb-3 text-right pr-2">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 text-sm">
                                                {patients.filter(p => p.status === "Active").map(p => (
                                                    <tr key={p.id} className="hover:bg-teal-500/5 transition-colors group">
                                                        <td className="py-4 pl-2 font-bold text-white flex items-center gap-2.5">
                                                            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                                                            <div>
                                                                <p className="text-sm font-semibold">{p.name}</p>
                                                                <p className="text-[10px] text-slate-500 mt-0.5">{p.id} | {p.gender}, {p.age}y</p>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 text-slate-300 font-medium font-mono text-xs">{p.room}</td>
                                                        <td className="py-4 text-slate-400 max-w-[200px] truncate">{p.diagnosis}</td>
                                                        <td className="py-4">
                                                            {p.warnings !== "None" ? (
                                                                <span className="inline-flex items-center gap-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                                                                    <AlertTriangle className="w-3 h-3 text-red-500" />
                                                                    Renal Warning
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                                                                    Stable
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-4 text-right pr-2">
                                                            <button 
                                                                onClick={() => {
                                                                    setSelectedPatient(p);
                                                                    setActiveTab("patients");
                                                                }}
                                                                className="text-[11px] bg-slate-900 group-hover:bg-gradient-to-r group-hover:from-teal-500 group-hover:to-indigo-500 group-hover:text-white border border-white/10 text-slate-300 px-3.5 py-1.5 rounded-lg font-bold transition-all duration-300 shadow-md"
                                                            >
                                                                Open File
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Urgent Critical alerts */}
                                <div className="bg-slate-900/30 border border-white/10 rounded-[24px] p-6 backdrop-blur-xl shadow-2xl flex flex-col relative">
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:10px_10px] rounded-[24px] pointer-events-none"></div>
                                    <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2 relative z-10">
                                        <ShieldAlert className="w-5 h-5 text-red-500" />
                                        Critical Observations
                                    </h3>
                                    
                                    <div className="flex flex-col gap-4 flex-grow overflow-y-auto max-h-[350px] relative z-10">
                                        {nurseLogs.some(n => n.escalated) ? (
                                            nurseLogs.filter(n => n.escalated).map(log => (
                                                <div key={log.id} className="bg-red-500/5 border border-red-500/20 p-4.5 rounded-2xl flex flex-col gap-4 relative overflow-hidden animate-glow-pulse">
                                                    <div className="absolute top-0 right-0 w-[4px] h-full bg-red-500"></div>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest font-mono">Nursing Alert</p>
                                                            <h4 className="text-sm font-bold text-white mt-1">{log.patientName}</h4>
                                                        </div>
                                                        <span className="bg-red-500/20 text-red-400 border border-red-500/35 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                                                            Urgent
                                                        </span>
                                                    </div>
                                                    <div className="bg-slate-950/60 rounded-xl p-3 text-xs font-mono border border-white/10 shadow-inner">
                                                        <p className="text-teal-400 font-bold">{log.vitals}</p>
                                                    </div>
                                                    <p className="text-xs text-slate-400 italic leading-relaxed">"{log.notes}"</p>
                                                    
                                                    <button 
                                                        onClick={() => handleAcknowledgeEscalation(log.id)}
                                                        className="w-full bg-red-500/10 hover:bg-red-500 hover:text-slate-950 border border-red-500/20 text-red-400 font-extrabold text-xs py-2.5 rounded-xl transition-all"
                                                    >
                                                        Acknowledge Alert
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex-1 flex flex-col justify-center items-center p-8 text-center bg-slate-950/20 rounded-2xl border border-dashed border-white/10 text-slate-500">
                                                <HeartPulse className="w-10 h-10 mb-3 text-slate-700" />
                                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">All Metrics Stable</p>
                                                <p className="text-[11px] mt-1.5 text-slate-500 leading-relaxed">No observation alerts or active escalations flagged by nurse teams.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* VIEW: PATIENT DIRECTORY */}
                    {activeTab === "patients" && (
                        <div className="flex flex-col gap-6 animate-card-entrance">
                            <div className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-stretch">
                                
                                {/* Search input */}
                                <div className="relative flex-grow max-w-md">
                                    <input
                                        type="text"
                                        placeholder="Search patient database..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full p-3.5 pl-11 bg-slate-950 border border-white/10 rounded-xl text-white text-sm outline-none transition focus:border-teal-500"
                                    />
                                    <Search className="absolute left-3.5 text-slate-500 pointer-events-none w-5 h-5" />
                                </div>

                                {/* Register Button */}
                                <button 
                                    onClick={() => setShowRegisterModal(true)}
                                    className="bg-gradient-to-br from-teal-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 text-white rounded-xl font-bold px-5 py-3.5 flex items-center justify-center gap-2 shadow-lg hover:shadow-teal-500/25 transition-all"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Register Attending Patient</span>
                                </button>
                            </div>

                            {/* Main Patients Grid */}
                            <div className="grid grid-cols-3 gap-6 max-xl:grid-cols-2 max-sm:grid-cols-1">
                                {filteredPatients.map(p => (
                                    <div key={p.id} className="bg-slate-900/30 border border-white/10 rounded-[22px] p-6 backdrop-blur-md shadow-2xl flex flex-col justify-between group hover:border-teal-500/30 transition-all duration-300 relative">
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:16px_16px] rounded-[22px] pointer-events-none"></div>
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="text-[9px] font-bold text-teal-400 tracking-widest uppercase font-mono">{p.id}</span>
                                                    <h3 className="text-base font-bold text-white mt-1 group-hover:text-teal-400 transition-colors">{p.name}</h3>
                                                </div>
                                                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border ${p.status === "Active" ? "bg-teal-500/10 border-teal-500/20 text-teal-400" : "bg-slate-800 border-white/5 text-slate-500"}`}>
                                                    {p.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mt-5 py-3 border-y border-white/5 text-xs text-slate-400">
                                                <div>
                                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Demographics</p>
                                                    <p className="font-semibold text-slate-200 mt-1">{p.age}y / {p.gender}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Bed Space</p>
                                                    <p className="font-semibold text-slate-200 mt-1">{p.room}</p>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Clinical Impression</p>
                                                <p className="text-sm font-medium text-slate-300 mt-1.5 leading-relaxed truncate">{p.diagnosis}</p>
                                            </div>

                                            {p.warnings !== "None" && (
                                                <div className="mt-4 bg-red-500/5 border border-red-500/10 rounded-xl p-3 flex gap-2 text-red-400 text-xs">
                                                    <AlertTriangle className="w-[18px] h-[18px] shrink-0 text-red-500" />
                                                    <span>{p.warnings}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-3.5 mt-6">
                                            <button 
                                                onClick={() => setSelectedPatient(p)}
                                                className="flex-1 bg-slate-950 hover:bg-slate-900 text-slate-200 font-bold text-xs py-3 rounded-xl border border-white/10 flex items-center justify-center gap-1.5 transition shadow-sm"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>Bio File</span>
                                            </button>
                                            {p.status === "Active" && (
                                                <button 
                                                    onClick={() => handleDischargePatient(p.id)}
                                                    className="bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-400 font-bold text-xs px-3.5 py-3 rounded-xl flex items-center gap-1 transition"
                                                >
                                                    <UserMinus className="w-4 h-4" />
                                                    <span>Discharge</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Patient Profile Detailed Panel Modal */}
                            {selectedPatient && (
                                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex justify-center items-center p-4 z-50 animate-card-entrance">
                                    <div className="bg-slate-900 border border-white/10 rounded-[28px] max-w-2xl w-full p-8 max-sm:p-6 shadow-2xl relative">
                                        <button 
                                            onClick={() => setSelectedPatient(null)}
                                            className="absolute top-6 right-6 text-slate-500 hover:text-white transition"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>

                                        <div className="flex items-center gap-4.5 mb-6">
                                            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex justify-center items-center text-teal-400 font-extrabold text-lg uppercase font-mono">
                                                {selectedPatient.name.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{selectedPatient.name}</h3>
                                                <p className="text-xs text-slate-400 mt-0.5">Patient ID: <span className="font-mono font-bold text-slate-300">{selectedPatient.id}</span> | Attending Status: <span className="text-teal-400 font-bold">{selectedPatient.status}</span></p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1 border-t border-white/10 py-6">
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clinical Demographics</p>
                                                <p className="text-sm text-slate-300 mt-2.5 font-medium">Age: <span className="text-white">{selectedPatient.age} Yrs</span></p>
                                                <p className="text-sm text-slate-300 mt-1.5 font-medium">Gender: <span className="text-white">{selectedPatient.gender}</span></p>
                                                <p className="text-sm text-slate-300 mt-1.5 font-medium">Ward allocation: <span className="text-white font-mono">{selectedPatient.room}</span></p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Allergies & Warnings</p>
                                                <p className="text-sm text-slate-300 mt-2.5 font-medium">Allergic agents: <span className="text-red-400 font-bold">{selectedPatient.allergies}</span></p>
                                                <p className="text-sm text-slate-300 mt-1.5 font-medium">Telemetry Warning: <span className="text-amber-400 font-bold">{selectedPatient.warnings}</span></p>
                                            </div>
                                        </div>

                                        <div className="border-t border-white/10 pt-6 flex flex-col gap-4">
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Attending Clinician</p>
                                                <p className="text-sm text-slate-300 mt-2 font-medium">{selectedPatient.doctor}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Medical Case History</p>
                                                <p className="text-sm text-slate-300 leading-relaxed mt-2 bg-slate-950/50 border border-white/5 p-4 rounded-xl italic">
                                                    "{selectedPatient.history}"
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center gap-4 mt-8 pt-4 border-t border-white/10">
                                            {selectedPatient.status === "Active" && (
                                                <button 
                                                    onClick={() => handleDischargePatient(selectedPatient.id)}
                                                    className="bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-400 font-bold text-xs py-2.5 px-5 rounded-xl transition flex items-center gap-1.5"
                                                >
                                                    <UserMinus className="w-4 h-4" />
                                                    <span>Discharge Patient</span>
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => setSelectedPatient(null)}
                                                className="ml-auto bg-slate-950 hover:bg-slate-900 text-slate-300 font-bold text-xs py-2.5 px-6 rounded-xl border border-white/10 transition"
                                            >
                                                Close Chart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Modal: Register Patient */}
                            {showRegisterModal && (
                                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex justify-center items-center p-4 z-50 animate-card-entrance">
                                    <div className="bg-slate-900 border border-white/10 rounded-[28px] max-w-lg w-full p-8 max-sm:p-6 shadow-2xl relative">
                                        <button 
                                            onClick={() => setShowRegisterModal(false)}
                                            className="absolute top-6 right-6 text-slate-500 hover:text-white transition"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>

                                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                            <Users className="w-6 h-6 text-teal-400" />
                                            Register Attending Patient
                                        </h3>

                                        <form onSubmit={handleRegisterPatient} className="flex flex-col gap-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-xs font-semibold text-slate-400">Full Name</label>
                                                    <input 
                                                        type="text" 
                                                        required
                                                        placeholder="Sarah Jenkins"
                                                        value={newPatient.name}
                                                        onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                                                        className="p-3 bg-slate-950 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-teal-500"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-xs font-semibold text-slate-400">Age</label>
                                                    <input 
                                                        type="number" 
                                                        required
                                                        placeholder="42"
                                                        value={newPatient.age}
                                                        onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                                                        className="p-3 bg-slate-950 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-teal-500"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-xs font-semibold text-slate-400">Gender</label>
                                                    <select 
                                                        value={newPatient.gender}
                                                        onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})}
                                                        className="p-3 bg-slate-950 border border-white/10 rounded-xl text-slate-300 text-sm outline-none focus:border-teal-500"
                                                    >
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-xs font-semibold text-slate-400">Ward Space Allocation</label>
                                                    <input 
                                                        type="text" 
                                                        required
                                                        placeholder="Ward 3A - Bed 4"
                                                        value={newPatient.room}
                                                        onChange={(e) => setNewPatient({...newPatient, room: e.target.value})}
                                                        className="p-3 bg-slate-950 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-teal-500"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-semibold text-slate-400">Clinical Diagnosis</label>
                                                <input 
                                                    type="text" 
                                                    required
                                                    placeholder="Chronic Hypertension & CKD Stage 3"
                                                    value={newPatient.diagnosis}
                                                    onChange={(e) => setNewPatient({...newPatient, diagnosis: e.target.value})}
                                                    className="p-3 bg-slate-950 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-teal-500"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-xs font-semibold text-slate-400">Drug Allergies</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Penicillin, Sulfa"
                                                        value={newPatient.allergies}
                                                        onChange={(e) => setNewPatient({...newPatient, allergies: e.target.value})}
                                                        className="p-3 bg-slate-950 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-teal-500"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-xs font-semibold text-slate-400">Clinical Warning Alert</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="High Risk for AKI"
                                                        value={newPatient.warnings}
                                                        onChange={(e) => setNewPatient({...newPatient, warnings: e.target.value})}
                                                        className="p-3 bg-slate-950 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-teal-500"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-semibold text-slate-400">Attending Notes / Case History</label>
                                                <textarea 
                                                    rows="3"
                                                    placeholder="Admitted on June 10, history of congestive heart failure..."
                                                    value={newPatient.history}
                                                    onChange={(e) => setNewPatient({...newPatient, history: e.target.value})}
                                                    className="p-3 bg-slate-950 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-teal-500 resize-none font-sans"
                                                />
                                            </div>

                                            <div className="flex gap-4 mt-6">
                                                <button 
                                                    type="button"
                                                    onClick={() => setShowRegisterModal(false)}
                                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3.5 rounded-xl border border-white/5 transition"
                                                >
                                                    Cancel
                                                </button>
                                                <button 
                                                    type="submit"
                                                    className="flex-1 bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all"
                                                >
                                                    Create Profile
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}

                    {/* VIEW: UPLOAD REPORTS */}
                    {activeTab === "uploads" && (
                        <div className="grid grid-cols-3 gap-8 animate-card-entrance max-xl:grid-cols-1">
                            
                            {/* Upload Form */}
                            <div className="bg-slate-900/30 border border-white/10 rounded-[24px] p-6 backdrop-blur-xl shadow-2xl h-fit relative">
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:10px_10px] rounded-[24px] pointer-events-none"></div>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                                    <UploadCloud className="w-5 h-5 text-teal-400" />
                                    Upload Lab & Radiology Data
                                </h3>
                                <p className="text-xs text-slate-400 mb-6 leading-relaxed relative z-10">
                                    Upload patient lab files to trigger automated AI biomarker mapping, GFR calculation, and drug warnings.
                                </p>

                                <form onSubmit={handleUploadReport} className="flex flex-col gap-4 relative z-10">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-400">Select Attending Patient</label>
                                        <select 
                                            required
                                            value={uploadForm.patientId}
                                            onChange={(e) => setUploadForm({...uploadForm, patientId: e.target.value})}
                                            className="p-3 bg-slate-95 border border-white/10 rounded-xl text-slate-200 text-sm outline-none focus:border-teal-500"
                                        >
                                            <option value="">-- Choose Patient Profile --</option>
                                            {patients.filter(p => p.status === "Active").map(p => (
                                                <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-400">Report Description</label>
                                        <input 
                                            type="text" 
                                            required
                                            placeholder="Renal Profile & Biochemistry"
                                            value={uploadForm.name}
                                            onChange={(e) => setUploadForm({...uploadForm, name: e.target.value})}
                                            className="p-3 bg-slate-95 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-teal-500"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-400">Classification</label>
                                        <select 
                                            value={uploadForm.type}
                                            onChange={(e) => setUploadForm({...uploadForm, type: e.target.value})}
                                            className="p-3 bg-slate-95 border border-white/10 rounded-xl text-slate-200 text-sm outline-none focus:border-teal-500"
                                        >
                                            <option value="Lab Report">Lab Report</option>
                                            <option value="Radiology Report">Radiology Report</option>
                                            <option value="Scan / Imaging Report">Scan / Imaging Report</option>
                                            <option value="Discharge Summary">Discharge Summary</option>
                                        </select>
                                    </div>

                                    <div className="mt-4 border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-950/40 text-center hover:border-teal-500/40 transition">
                                        <FileText className="w-8 h-8 text-slate-600 mb-2" />
                                        <p className="text-xs font-bold text-slate-300">Drag & drop files here</p>
                                        <p className="text-[10px] text-slate-500 mt-1">PDF, DICOM or JPEG up to 10MB</p>
                                    </div>

                                    <button 
                                        type="submit"
                                        className="mt-4 bg-gradient-to-br from-teal-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all"
                                    >
                                        Upload and Map Report
                                    </button>
                                </form>
                            </div>

                            {/* Reports Status Log */}
                            <div className="col-span-2 bg-slate-900/30 border border-white/10 rounded-[24px] p-6 backdrop-blur-xl shadow-2xl relative">
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:24px_24px] rounded-[24px] pointer-events-none"></div>
                                <h3 className="text-lg font-bold text-white mb-2 relative z-10">Clinical Processing Queue</h3>
                                <p className="text-xs text-slate-500 mb-6 relative z-10">Real-time mapping pipeline and automated AI interaction analysis status</p>

                                <div className="overflow-x-auto relative z-10">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-slate-500 border-b border-white/10 text-[10px] uppercase tracking-widest text-left font-bold">
                                                <th className="pb-3 pl-2">Report Document</th>
                                                <th className="pb-3">Attending Case</th>
                                                <th className="pb-3">Upload Date</th>
                                                <th className="pb-3">Analysis State</th>
                                                <th className="pb-3 text-right pr-2">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-sm">
                                            {reports.map(r => (
                                                <tr key={r.id} className="hover:bg-teal-500/5 transition-colors">
                                                    <td className="py-4 pl-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex justify-center items-center text-indigo-400">
                                                                <FileSpreadsheet className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-white truncate max-w-[180px]">{r.name}</p>
                                                                <p className="text-[10px] text-slate-500">{r.type} | {r.fileSize}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 text-slate-300 font-semibold">
                                                        {r.patientName} <span className="text-xs text-slate-500 font-mono">({r.patientId})</span>
                                                    </td>
                                                    <td className="py-4 text-slate-400 font-mono text-xs">{r.uploadedAt}</td>
                                                    <td className="py-4">
                                                        {r.status === "Processing" ? (
                                                            <span className="inline-flex items-center gap-1.5 text-cyan-400 text-xs font-bold animate-pulse">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                                                Mapping Biomarkers
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 text-teal-400 text-xs font-bold">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                                                                Mapped & Complete
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-4 text-right pr-2">
                                                        {r.status === "Processing" ? (
                                                            <button 
                                                                onClick={() => handleTriggerAI(r.id)}
                                                                className="text-xs bg-indigo-500/10 hover:bg-indigo-500 hover:text-white border border-indigo-500/20 text-indigo-400 px-3.5 py-1.5 rounded-lg font-bold transition shadow-sm"
                                                            >
                                                                Trigger AI
                                                            </button>
                                                        ) : (
                                                            <button 
                                                                onClick={() => {
                                                                    setActiveTab("ai-diagnostics");
                                                                }}
                                                                className="text-xs bg-slate-950 hover:bg-teal-500 hover:text-slate-950 border border-white/10 text-slate-300 px-3.5 py-1.5 rounded-lg font-bold transition"
                                                            >
                                                                Clinical Review
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* VIEW: AI DIAGNOSTICS */}
                    {activeTab === "ai-diagnostics" && (
                        <div className="grid grid-cols-3 gap-8 animate-card-entrance max-xl:grid-cols-1">
                            
                            {/* Patient selector column */}
                            <div className="bg-slate-900/30 border border-white/10 rounded-[24px] p-6 backdrop-blur-xl shadow-2xl h-fit relative">
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:10px_10px] rounded-[24px] pointer-events-none"></div>
                                <h3 className="text-lg font-bold text-white mb-4 relative z-10">Select Diagnostic Log</h3>
                                <p className="text-xs text-slate-500 mb-6 relative z-10">Select a diagnostic file to load AI predictions and check interactions.</p>
                                
                                <div className="flex flex-col gap-3 relative z-10">
                                    {Object.keys(aiAnalysis).map(pId => (
                                        <button
                                            key={pId}
                                            onClick={() => setSelectedPatient(patients.find(p => p.id === pId))}
                                            className={`p-4 rounded-xl border text-left flex justify-between items-center transition-all duration-300 ${selectedPatient && selectedPatient.id === pId ? "bg-gradient-to-r from-teal-500/10 to-indigo-500/10 border-teal-500/40 text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.1)]" : "bg-slate-950 border-white/5 text-slate-300 hover:bg-white/5"}`}
                                        >
                                            <div>
                                                <h4 className="text-sm font-bold text-white">{aiAnalysis[pId].patientName}</h4>
                                                <p className="text-[10px] text-slate-500 mt-1 font-mono">Case ID: {pId}</p>
                                            </div>
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${aiAnalysis[pId].status === "Approved" ? "bg-teal-500/10 border-teal-500/20 text-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.15)]" : aiAnalysis[pId].status === "Overridden" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"}`}>
                                                {aiAnalysis[pId].status}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* AI Diagnostics details pane (Holographic console style) */}
                            <div className="col-span-2 bg-slate-900/30 border border-white/10 rounded-[24px] p-6 backdrop-blur-xl shadow-2xl relative">
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:24px_24px] rounded-[24px] pointer-events-none"></div>
                                {selectedPatient && aiAnalysis[selectedPatient.id] ? (
                                    (() => {
                                        const analysis = aiAnalysis[selectedPatient.id];
                                        return (
                                            <div className="flex flex-col gap-6 relative z-10">
                                                
                                                {/* Header */}
                                                <div className="flex justify-between items-start border-b border-white/10 pb-4">
                                                    <div>
                                                        <h3 className="text-xl font-extrabold text-white">{analysis.patientName}</h3>
                                                        <p className="text-xs text-slate-500 mt-0.5">Primary Clinician: Dr. Alexander Ross</p>
                                                    </div>
                                                    <span className={`text-[10px] font-bold px-3 py-1 rounded border uppercase tracking-widest ${analysis.status === "Approved" ? "bg-teal-500/10 border-teal-500/20 text-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.15)]" : analysis.status === "Overridden" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"}`}>
                                                        {analysis.status}
                                                    </span>
                                                </div>

                                                {/* Clinical Summary */}
                                                <div>
                                                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">AI Summary Output & Pattern Match</h4>
                                                    <div className="bg-slate-950 border border-white/10 rounded-xl p-4.5 leading-relaxed text-sm text-slate-300">
                                                        {analysis.summary}
                                                    </div>
                                                </div>

                                                {/* Grid for Anomalies and Drug Warnings */}
                                                <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
                                                    
                                                    {/* Biomarker Anomalies (Bio-Gauges) */}
                                                    <div className="border border-white/10 rounded-xl p-4.5 bg-slate-950">
                                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                                                            <Activity className="w-4 h-4 text-cyan-400" />
                                                            Biomarker Mapping Analysis
                                                        </h4>
                                                        
                                                        <div className="flex flex-col gap-4">
                                                            {analysis.anomalies.map((a, i) => (
                                                                <div key={i} className="text-xs">
                                                                    <div className="flex justify-between items-center mb-1">
                                                                        <span className="font-semibold text-slate-300">{a.name}</span>
                                                                        <span className={`font-bold ${a.status === "High" || a.status === "Anomaly" ? "text-red-400" : "text-cyan-400"}`}>{a.value}</span>
                                                                    </div>
                                                                    
                                                                    {/* Cyber Gauge progress indicator */}
                                                                    <div className="w-full h-1.5 bg-slate-900 border border-white/5 rounded-full overflow-hidden">
                                                                        <div 
                                                                            style={{ width: `${a.percent}%` }}
                                                                            className={`h-full rounded-full ${a.status === "High" || a.status === "Anomaly" ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"}`}
                                                                        ></div>
                                                                    </div>
                                                                    
                                                                    <div className="flex justify-between text-[9px] text-slate-500 mt-1 font-medium">
                                                                        <span>Ref Range: {a.standard}</span>
                                                                        <span className="uppercase tracking-wider">{a.status}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Drug Warnings */}
                                                    <div className="border border-white/10 rounded-xl p-4.5 bg-slate-950 flex flex-col justify-between">
                                                        <div>
                                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
                                                                <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
                                                                Drug Warnings & Interactions
                                                            </h4>
                                                            <p className="text-xs text-amber-400 bg-amber-500/5 border border-amber-500/15 p-3 rounded-lg leading-relaxed leading-5">
                                                                {analysis.drugWarnings}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Suggestions and Predictions */}
                                                <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
                                                    
                                                    {/* AI Suggestions */}
                                                    <div className="border border-white/10 rounded-xl p-4.5 bg-slate-950">
                                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
                                                            <BrainCircuit className="w-4 h-4 text-indigo-400" />
                                                            Clinical Suggestions
                                                        </h4>
                                                        <ul className="flex flex-col gap-2.5">
                                                            {analysis.suggestions.map((s) => (
                                                                <li key={s.id} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/40 p-2.5 rounded-lg border border-white/5 shadow-inner">
                                                                    <span className="bg-indigo-500/20 text-indigo-400 font-extrabold text-[9px] px-1.5 py-0.5 rounded mt-0.5 uppercase tracking-wide">{s.type}</span>
                                                                    <span>{s.text}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {/* Forecast and Predictions */}
                                                    <div className="border border-white/10 rounded-xl p-4.5 bg-slate-950 flex flex-col gap-4">
                                                        <div>
                                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                                                <ShieldAlert className="w-4 h-4 text-pink-400" />
                                                                Side Effect Forecast
                                                            </h4>
                                                            <p className="text-xs text-slate-300 leading-relaxed">{analysis.sideEffects}</p>
                                                        </div>
                                                        <div className="border-t border-white/5 pt-3.5">
                                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                                                <Clock className="w-4 h-4 text-cyan-400" />
                                                                Recovery Time Prediction
                                                            </h4>
                                                            <p className="text-xs text-slate-300 font-bold">{analysis.recoveryTime}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Doctor notes and clinical sign-off */}
                                                <div className="border-t border-white/10 pt-6">
                                                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-slate-500" />
                                                        Verify Decision Note
                                                    </h4>
                                                    
                                                    <div className="flex flex-col gap-2.5">
                                                        <textarea
                                                            rows="3"
                                                            placeholder="Add clinical observation logs, override justifications, or verification notes..."
                                                            value={analysis.doctorNotes}
                                                            onChange={(e) => {
                                                                setAiAnalysis(prev => ({
                                                                    ...prev,
                                                                    [selectedPatient.id]: {
                                                                        ...prev[selectedPatient.id],
                                                                        doctorNotes: e.target.value
                                                                    }
                                                                }));
                                                            }}
                                                            disabled={analysis.status !== "Pending Approval"}
                                                            className="w-full p-3.5 bg-slate-950 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-teal-500 disabled:opacity-50 resize-none font-sans"
                                                        />
                                                    </div>

                                                    {analysis.status === "Pending Approval" ? (
                                                        <div className="flex gap-4 mt-4">
                                                            <button
                                                                onClick={() => handleOverrideAI(selectedPatient.id, analysis.doctorNotes)}
                                                                className="flex-1 bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/20 text-amber-400 font-bold py-3.5 rounded-xl transition-all duration-300 text-xs shadow-md shadow-amber-500/5 hover:shadow-amber-500/20"
                                                            >
                                                                Override Suggestion
                                                            </button>
                                                            <button
                                                                onClick={() => handleApproveAI(selectedPatient.id, analysis.doctorNotes)}
                                                                className="flex-1 bg-gradient-to-br from-teal-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-teal-500/20 transition-all text-xs"
                                                            >
                                                                Verify & Approve
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="mt-4 bg-teal-500/10 border border-teal-500/20 rounded-xl p-4 text-teal-400 text-xs flex items-center gap-2.5 font-bold shadow-[0_0_15px_rgba(20,184,166,0.1)]">
                                                            <Check className="w-5 h-5 text-teal-500" />
                                                            <span>Clinical Decision Saved: Analysis marked as {analysis.status}.</span>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        );
                                    })()
                                ) : (
                                    <div className="flex flex-col justify-center items-center p-16 text-center text-slate-500">
                                        <BrainCircuit className="w-16 h-16 mb-4 text-slate-800 animate-pulse" />
                                        <h3 className="text-lg font-bold text-slate-400">AI Diagnostic Record Console</h3>
                                        <p className="text-xs text-slate-500 mt-2.5 max-w-sm leading-relaxed">
                                            Select a patient case profile from the diagnostic panel to review biomarker anomalies, interaction checks, and forecasts.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* VIEW: NURSE LOGS */}
                    {activeTab === "nurse-logs" && (
                        <div className="bg-slate-900/30 border border-white/10 rounded-[24px] p-6 backdrop-blur-xl shadow-2xl animate-card-entrance relative">
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:24px_24px] rounded-[24px] pointer-events-none"></div>
                            <h3 className="text-lg font-bold text-white mb-2 relative z-10">Nurse Log Review Register</h3>
                            <p className="text-xs text-slate-500 mb-6 relative z-10">Review shift observations, logged vitals, and acknowledge critical escalations.</p>
                            
                            <div className="flex flex-col gap-4 relative z-10">
                                {nurseLogs.map(log => (
                                    <div 
                                        key={log.id} 
                                        className={`border p-5 rounded-2xl transition-all duration-300 relative overflow-hidden ${log.escalated ? "bg-red-500/5 border-red-500/25 shadow-lg shadow-red-500/5 animate-glow-pulse" : "bg-slate-950 border-white/10"}`}
                                    >
                                        {log.escalated && (
                                            <div className="absolute top-0 right-0 w-[4px] h-full bg-red-500"></div>
                                        )}

                                        <div className="flex justify-between items-start gap-4 max-sm:flex-col">
                                            <div className="flex-1 flex flex-col gap-2">
                                                <div className="flex items-center gap-3">
                                                    <h4 className="text-base font-bold text-white">{log.patientName}</h4>
                                                    <span className="text-[10px] text-slate-500 font-mono">({log.patientId})</span>
                                                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${log.escalated ? "bg-red-500/10 border-red-500/20 text-red-400" : log.escalationStatus === "Acknowledged" ? "bg-teal-500/10 border-teal-500/20 text-teal-400 animate-pulse-logo" : "bg-slate-800 border-white/5 text-slate-500"}`}>
                                                        {log.escalated ? "Escalated to Doctor" : log.escalationStatus}
                                                    </span>
                                                </div>

                                                <div className="flex gap-4.5 items-center flex-wrap mt-2">
                                                    <div className="flex items-center gap-1.5 bg-slate-900 border border-white/10 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-300 shadow-inner">
                                                        <Activity className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                                                        <span>{log.vitals}</span>
                                                    </div>
                                                    <div className="text-slate-500 text-xs font-semibold">
                                                        Nurse: <span className="text-slate-300">{log.loggedBy}</span>
                                                    </div>
                                                    <div className="text-slate-500 text-xs font-mono font-bold">
                                                        {log.loggedAt}
                                                    </div>
                                                </div>

                                                <p className="text-sm text-slate-300 leading-relaxed italic mt-3 bg-slate-950 border border-white/5 p-3.5 rounded-xl">
                                                    "{log.notes}"
                                                </p>
                                            </div>

                                            {log.escalated && (
                                                <button
                                                    onClick={() => handleAcknowledgeEscalation(log.id)}
                                                    className="bg-red-500/15 hover:bg-red-500 hover:text-slate-950 border border-red-500/20 text-red-400 font-bold text-xs py-3 px-5 rounded-xl transition flex items-center justify-center gap-1.5 max-sm:w-full shrink-0"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    <span>Acknowledge Log</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </main>
            </div>
            
        </div>
    );
}
