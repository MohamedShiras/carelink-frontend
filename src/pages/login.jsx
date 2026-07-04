import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Mail, Lock, Eye, EyeOff, Activity, AlertCircle, Sparkles, UserCheck } from "lucide-react"; // We keep it imported, but we'll clean it up later or let Tailwind override

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail]               = useState("");
    const [password, setPassword]         = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e, customEmail = null, customPassword = null) => {
        if (e) e.preventDefault();
        
        const loginEmail = customEmail || email;
        const loginPassword = customPassword || password;
        
        if (!loginEmail || !loginPassword) {
            setError("Email and Password are required.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await api.post("/auth/login", {
                email: loginEmail,
                password: loginPassword,
            });

            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");
        } catch (err) {
            // Smart auto-registration: if account doesn't exist, we auto-create for demo convenience!
            if (err.response?.status === 401 || err.response?.status === 404) {
                // If it is one of our demo accounts, let's auto-register them!
                const lowerEmail = loginEmail.toLowerCase();
                let role = "";
                let name = "";
                let additionalInfo = {};

                if (lowerEmail.includes("patient")) {
                    role = "patient";
                    name = "Demo Patient";
                    additionalInfo = { age: 30, gender: "Male" };
                } else if (lowerEmail.includes("doctor")) {
                    role = "doctor";
                    name = "Sarah Jenkins";
                    additionalInfo = { specialization: "Cardiologist" };
                } else if (lowerEmail.includes("nurse")) {
                    role = "nurse";
                    name = "Emily Watson";
                    additionalInfo = { department: "Emergency" };
                } else if (lowerEmail.includes("admin")) {
                    role = "admin";
                    name = "Chief Admin";
                }

                if (role) {
                    try {
                        const regRes = await api.post("/auth/register", {
                            name,
                            email: loginEmail,
                            password: loginPassword,
                            role,
                            additionalInfo
                        });
                        localStorage.setItem("token", regRes.data.token);
                        navigate("/dashboard");
                        return;
                    } catch (regErr) {
                        setError(regErr.response?.data?.message || "Login failed");
                    }
                } else {
                    setError("Invalid credentials. Try using a Demo Account below.");
                }
            } else {
                setError(err.response?.data?.message || "Unable to connect to the backend server.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDemoClick = (demoEmail, demoPassword) => {
        setEmail(demoEmail);
        setPassword(demoPassword);
        handleLogin(null, demoEmail, demoPassword);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center relative overflow-hidden px-4">
            {/* Ambient Background Blobs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
                
                {/* Brand / Logo */}
                <div className="text-center space-y-2">
                    <div className="inline-flex bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 mb-2">
                        <Activity className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">CareLink</h1>
                    <p className="text-slate-400 text-xs">Clinical connection & healthcare management</p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 px-4 py-3 rounded-xl text-sm flex items-center gap-2.5">
                        <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    {/* Email field */}
                    <div className="space-y-1.5">
                        <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="patient@carelink.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm transition"
                                required
                            />
                            <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-650" />
                        </div>
                    </div>

                    {/* Password field */}
                    <div className="space-y-1.5">
                        <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 pl-10 pr-10 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm transition"
                                required
                            />
                            <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-650" />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-350 focus:outline-none"
                                tabIndex="-1"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit button */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm transition duration-150 shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-950"></div>
                                <span>Securing session...</span>
                            </>
                        ) : (
                            "Sign In to CareLink"
                        )}
                    </button>
                </form>

                {/* Demo Accounts Panel */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                        <span className="font-semibold uppercase tracking-wider">Demo / Test Accounts</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                            type="button"
                            onClick={() => handleDemoClick("patient@carelink.com", "password123")}
                            className="bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-300 py-2 px-3 rounded-lg text-left transition flex items-center justify-between"
                        >
                            <span>Patient</span>
                            <span className="text-[10px] text-emerald-400 font-bold">Try</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDemoClick("doctor@carelink.com", "password123")}
                            className="bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-300 py-2 px-3 rounded-lg text-left transition flex items-center justify-between"
                        >
                            <span>Doctor</span>
                            <span className="text-[10px] text-blue-400 font-bold">Try</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDemoClick("nurse@carelink.com", "password123")}
                            className="bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-300 py-2 px-3 rounded-lg text-left transition flex items-center justify-between"
                        >
                            <span>Nurse</span>
                            <span className="text-[10px] text-teal-400 font-bold">Try</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDemoClick("admin@carelink.com", "password123")}
                            className="bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-300 py-2 px-3 rounded-lg text-left transition flex items-center justify-between"
                        >
                            <span>Admin</span>
                            <span className="text-[10px] text-indigo-400 font-bold">Try</span>
                        </button>
                    </div>
                    <p className="text-[10px] text-center text-slate-500">
                        Clicking any button auto-provisions and logs in the selected role.
                    </p>
                </div>
            </div>
        </>
    );
}
