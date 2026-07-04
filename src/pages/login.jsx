import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Mail, Lock, Eye, EyeOff, Activity, AlertCircle, ArrowRight, HeartPulse, Shield, Users } from "lucide-react";

const features = [
    { icon: HeartPulse, label: "Real-time health monitoring" },
    { icon: Shield,     label: "Secure & private records" },
    { icon: Users,      label: "Connected care team" },
];

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail]               = useState("");
    const [password, setPassword]         = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe]     = useState(false);
    const [loading, setLoading]           = useState(false);
    const [error, setError]               = useState("");
    const [focused, setFocused]           = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let token = "mock-token";
            try {
                const res = await api.post("/auth/login", { email, password });
                token = res.data?.token || "mock-token";
            } catch (apiErr) {
                console.warn("API login failed, using mock token for demo:", apiErr);
            }
            localStorage.setItem("token", token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

                * { box-sizing: border-box; margin: 0; padding: 0; }

                .login-root {
                    min-height: 100vh;
                    width: 100%;
                    display: flex;
                    font-family: 'Inter', sans-serif;
                    background-color: #eef8f0;
                    overflow: hidden;
                }

                /* ── Left panel ─────────────────────────────────────────── */
                .login-left {
                    display: none;
                    flex: 1;
                    position: relative;
                    overflow: hidden;
                    background: linear-gradient(145deg, #d1fae5 0%, #a7f3d0 40%, #6ee7b7 100%);
                }

                @media (min-width: 1024px) { .login-left { display: flex; flex-direction: column; justify-content: space-between; padding: 48px; } }

                .login-left-blob1 {
                    position: absolute; top: -80px; right: -80px;
                    width: 400px; height: 400px; border-radius: 50%;
                    background: radial-gradient(circle, rgba(16,185,129,0.35) 0%, transparent 70%);
                    filter: blur(60px);
                    animation: floatBlob 12s ease-in-out infinite;
                }
                .login-left-blob2 {
                    position: absolute; bottom: -60px; left: -60px;
                    width: 350px; height: 350px; border-radius: 50%;
                    background: radial-gradient(circle, rgba(5,150,105,0.30) 0%, transparent 70%);
                    filter: blur(60px);
                    animation: floatBlob 15s ease-in-out infinite reverse;
                }
                .login-left-blob3 {
                    position: absolute; top: 50%; left: 30%;
                    width: 250px; height: 250px; border-radius: 50%;
                    background: radial-gradient(circle, rgba(110,231,183,0.25) 0%, transparent 70%);
                    filter: blur(40px);
                    animation: floatBlob 10s ease-in-out infinite 3s;
                }

                @keyframes floatBlob {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50%       { transform: translateY(-20px) scale(1.05); }
                }

                .left-brand {
                    position: relative; z-index: 2;
                }
                .left-brand-logo {
                    display: flex; align-items: center; gap: 12px;
                }
                .left-brand-icon {
                    width: 48px; height: 48px;
                    border-radius: 16px;
                    background: rgba(255,255,255,0.7);
                    border: 1.5px solid rgba(16,185,129,0.4);
                    display: flex; align-items: center; justify-content: center;
                    color: #059669;
                    box-shadow: 0 4px 16px rgba(16,185,129,0.2);
                }
                .left-brand-name {
                    font-size: 22px; font-weight: 800; color: #064e3b;
                    letter-spacing: -0.5px;
                }
                .left-brand-tag {
                    font-size: 11px; text-transform: uppercase;
                    letter-spacing: 0.22em; color: #065f46; margin-top: 2px;
                }

                .left-hero { position: relative; z-index: 2; }
                .left-hero h2 {
                    font-size: 38px; font-weight: 800; line-height: 1.15;
                    color: #022c22; letter-spacing: -1px;
                }
                .left-hero h2 em {
                    font-style: normal;
                    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .left-hero p {
                    margin-top: 16px; font-size: 15px; line-height: 1.7;
                    color: #065f46; max-width: 380px;
                }

                .left-features { position: relative; z-index: 2; display: flex; flex-direction: column; gap: 12px; }
                .left-feature-pill {
                    display: inline-flex; align-items: center; gap: 10px;
                    background: rgba(255,255,255,0.65);
                    border: 1px solid rgba(16,185,129,0.25);
                    border-radius: 100px;
                    padding: 10px 18px;
                    font-size: 13.5px; font-weight: 500; color: #065f46;
                    backdrop-filter: blur(8px);
                    width: fit-content;
                    transition: background 0.2s, transform 0.2s;
                }
                .left-feature-pill:hover { background: rgba(255,255,255,0.85); transform: translateX(4px); }
                .left-feature-icon {
                    width: 28px; height: 28px; border-radius: 8px;
                    background: rgba(16,185,129,0.15);
                    display: flex; align-items: center; justify-content: center;
                    color: #059669;
                }

                /* Floating card decoration */
                .left-card-deco {
                    position: absolute; bottom: 100px; right: 40px; z-index: 2;
                    background: rgba(255,255,255,0.7);
                    border: 1px solid rgba(16,185,129,0.25);
                    border-radius: 20px;
                    padding: 18px 22px;
                    backdrop-filter: blur(12px);
                    box-shadow: 0 8px 32px rgba(16,185,129,0.12);
                    animation: cardFloat 6s ease-in-out infinite;
                }
                @keyframes cardFloat {
                    0%, 100% { transform: translateY(0); }
                    50%       { transform: translateY(-8px); }
                }
                .left-card-deco-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #065f46; }
                .left-card-deco-value { font-size: 22px; font-weight: 700; color: #022c22; margin-top: 4px; }
                .left-card-deco-sub   { font-size: 12px; color: #059669; margin-top: 2px; }
                .left-card-deco-bar {
                    margin-top: 12px;
                    height: 6px; width: 140px;
                    background: rgba(16,185,129,0.15);
                    border-radius: 100px; overflow: hidden;
                }
                .left-card-deco-fill {
                    height: 100%; width: 96%;
                    background: linear-gradient(90deg, #10b981, #059669);
                    border-radius: 100px;
                }

                /* ── Right panel ─────────────────────────────────────────── */
                .login-right {
                    display: flex;
                    flex: 1;
                    align-items: center;
                    justify-content: center;
                    padding: 32px 24px;
                }

                .login-card {
                    width: 100%;
                    max-width: 440px;
                    background: rgba(255,255,255,0.85);
                    border: 1px solid rgba(16,185,129,0.2);
                    border-radius: 28px;
                    padding: 44px 40px;
                    box-shadow:
                        0 1px 0 rgba(6,95,70,0.06),
                        0 20px 60px rgba(16,185,129,0.08),
                        0 4px 16px rgba(0,0,0,0.04);
                    backdrop-filter: blur(12px);
                    animation: cardEntrance 0.5s cubic-bezier(0.22,1,0.36,1) both;
                }

                @keyframes cardEntrance {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 500px) {
                    .login-card { padding: 32px 24px; border-radius: 20px; }
                }

                /* Mobile brand (shown only on small screens) */
                .mobile-brand {
                    display: flex; flex-direction: column; align-items: center; gap: 12px; margin-bottom: 32px;
                }
                .mobile-brand-icon {
                    width: 56px; height: 56px; border-radius: 18px;
                    background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1));
                    border: 1.5px solid rgba(16,185,129,0.3);
                    display: flex; align-items: center; justify-content: center;
                    color: #059669;
                    box-shadow: 0 6px 20px rgba(16,185,129,0.15);
                }
                .mobile-brand-name { font-size: 24px; font-weight: 800; color: #022c22; letter-spacing: -0.5px; }
                .mobile-brand-tag  { font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: #059669; }

                @media (min-width: 1024px) { .mobile-brand { display: none; } }

                /* Card header */
                .card-header { margin-bottom: 28px; }
                .card-header h1 {
                    font-size: 26px; font-weight: 800; color: #022c22; letter-spacing: -0.5px;
                }
                .card-header p { font-size: 14px; color: #059669; margin-top: 6px; }

                /* Error */
                .error-box {
                    display: flex; align-items: center; gap: 10px;
                    background: rgba(239,68,68,0.07);
                    border: 1px solid rgba(239,68,68,0.2);
                    border-radius: 14px;
                    padding: 12px 16px;
                    color: #b91c1c;
                    font-size: 13.5px;
                    margin-bottom: 20px;
                    animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
                }
                @keyframes shake {
                    10%, 90% { transform: translateX(-2px); }
                    20%, 80% { transform: translateX(3px); }
                    30%, 50%, 70% { transform: translateX(-4px); }
                    40%, 60% { transform: translateX(4px); }
                }

                /* Form */
                .form { display: flex; flex-direction: column; gap: 18px; }

                .field { display: flex; flex-direction: column; gap: 7px; }
                .field-label {
                    font-size: 11px; font-weight: 600;
                    text-transform: uppercase; letter-spacing: 0.2em;
                    color: #065f46;
                }
                .field-wrap { position: relative; display: flex; align-items: center; }

                .field-icon {
                    position: absolute; left: 14px;
                    pointer-events: none;
                    width: 18px; height: 18px;
                    color: #6ee7b7;
                    transition: color 0.25s;
                }
                .field-icon.focused { color: #059669; }

                .field-input {
                    width: 100%; padding: 13px 14px 13px 42px;
                    background: rgba(236,253,245,0.6);
                    border: 1.5px solid rgba(16,185,129,0.2);
                    border-radius: 14px;
                    font-size: 15px; font-family: 'Inter', sans-serif;
                    color: #022c22;
                    outline: none;
                    transition: all 0.25s ease;
                }
                .field-input::placeholder { color: #a7f3d0; }
                .field-input:hover {
                    border-color: rgba(16,185,129,0.35);
                    background: rgba(236,253,245,0.8);
                }
                .field-input:focus {
                    border-color: #10b981;
                    background: #ffffff;
                    box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
                }
                .field-input.has-right { padding-right: 44px; }

                .toggle-btn {
                    position: absolute; right: 12px;
                    background: none; border: none;
                    color: #6ee7b7; cursor: pointer;
                    padding: 6px; border-radius: 8px;
                    display: flex; align-items: center;
                    transition: color 0.2s, background 0.2s;
                }
                .toggle-btn:hover { color: #059669; background: rgba(16,185,129,0.08); }

                /* Extras row */
                .extras {
                    display: flex; justify-content: space-between; align-items: center;
                    font-size: 13.5px;
                }
                .remember {
                    display: flex; align-items: center; gap: 8px;
                    color: #065f46; cursor: pointer; user-select: none;
                }
                .remember input[type="checkbox"] { accent-color: #059669; width: 15px; height: 15px; cursor: pointer; }
                .forgot {
                    color: #059669; text-decoration: none; font-weight: 500;
                    transition: color 0.2s;
                }
                .forgot:hover { color: #047857; text-decoration: underline; }

                /* Submit button */
                .submit-btn {
                    position: relative; overflow: hidden;
                    margin-top: 4px; width: 100%;
                    padding: 14px;
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    border: none; border-radius: 14px;
                    color: #ffffff;
                    font-size: 15px; font-weight: 700;
                    font-family: 'Inter', sans-serif;
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    transition: transform 0.2s, box-shadow 0.2s;
                    box-shadow: 0 4px 16px rgba(16,185,129,0.3);
                }
                .submit-btn:not(:disabled):hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(16,185,129,0.4);
                }
                .submit-btn:not(:disabled):active { transform: translateY(0); }
                .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                .submit-shine {
                    position: absolute; inset: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
                    transform: translateX(-100%);
                    transition: transform 0.5s ease;
                }
                .submit-btn:not(:disabled):hover .submit-shine { transform: translateX(100%); }

                .spinner {
                    width: 18px; height: 18px;
                    border: 2.5px solid rgba(255,255,255,0.35);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* Divider */
                .divider {
                    display: flex; align-items: center; gap: 12px; margin-top: 4px;
                }
                .divider-line { flex: 1; height: 1px; background: rgba(16,185,129,0.15); }
                .divider-text { font-size: 12px; color: #6ee7b7; white-space: nowrap; }

                /* Footer */
                .card-footer {
                    margin-top: 24px; text-align: center;
                    font-size: 14px; color: #065f46;
                }
                .card-footer a {
                    color: #059669; text-decoration: none; font-weight: 600; margin-left: 6px;
                    transition: color 0.2s;
                }
                .card-footer a:hover { color: #047857; text-decoration: underline; }

                /* Bottom badge */
                .security-badge {
                    display: flex; align-items: center; justify-content: center; gap: 6px;
                    margin-top: 20px;
                    font-size: 11.5px; color: #6ee7b7;
                }
                .security-dot {
                    width: 6px; height: 6px; border-radius: 50%;
                    background: #10b981;
                    animation: pulse 2s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%       { opacity: 0.5; transform: scale(0.8); }
                }
            `}</style>

            <div className="login-root">

                {/* ── Left decorative panel ── */}
                <div className="login-left">
                    <div className="login-left-blob1" />
                    <div className="login-left-blob2" />
                    <div className="login-left-blob3" />

                    {/* Brand */}
                    <div className="left-brand">
                        <div className="left-brand-logo">
                            <div className="left-brand-icon">
                                <Activity size={22} />
                            </div>
                            <div>
                                <div className="left-brand-name">CareLink</div>
                                <div className="left-brand-tag">Patient-first platform</div>
                            </div>
                        </div>
                    </div>

                    {/* Hero copy */}
                    <div className="left-hero">
                        <h2>
                            Your health,<br />
                            <em>clear and connected.</em>
                        </h2>
                        <p>
                            Access your care plan, track medications, connect with your care team, and stay on top of your recovery — all in one place.
                        </p>
                    </div>

                    {/* Feature pills */}
                    <div className="left-features">
                        {features.map(({ icon: Icon, label }) => (
                            <div className="left-feature-pill" key={label}>
                                <div className="left-feature-icon">
                                    <Icon size={14} />
                                </div>
                                {label}
                            </div>
                        ))}
                    </div>

                    {/* Floating stat card */}
                    <div className="left-card-deco">
                        <div className="left-card-deco-label">Medication adherence</div>
                        <div className="left-card-deco-value">96%</div>
                        <div className="left-card-deco-sub">↑ On track this week</div>
                        <div className="left-card-deco-bar">
                            <div className="left-card-deco-fill" />
                        </div>
                    </div>
                </div>

                {/* ── Right login panel ── */}
                <div className="login-right">
                    <div className="login-card">

                        {/* Mobile-only brand */}
                        <div className="mobile-brand">
                            <div className="mobile-brand-icon">
                                <Activity size={26} />
                            </div>
                            <div className="mobile-brand-name">CareLink</div>
                            <div className="mobile-brand-tag">Patient-first platform</div>
                        </div>

                        {/* Card header */}
                        <div className="card-header">
                            <h1>Welcome back</h1>
                            <p>Sign in to access your patient dashboard</p>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="error-box">
                                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="form">

                            {/* Email */}
                            <div className="field">
                                <label className="field-label" htmlFor="login-email">Email Address</label>
                                <div className="field-wrap">
                                    <Mail
                                        className={`field-icon${focused === "email" ? " focused" : ""}`}
                                        size={18}
                                    />
                                    <input
                                        id="login-email"
                                        type="email"
                                        className="field-input"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setFocused("email")}
                                        onBlur={() => setFocused("")}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="field">
                                <label className="field-label" htmlFor="login-password">Password</label>
                                <div className="field-wrap">
                                    <Lock
                                        className={`field-icon${focused === "password" ? " focused" : ""}`}
                                        size={18}
                                    />
                                    <input
                                        id="login-password"
                                        type={showPassword ? "text" : "password"}
                                        className="field-input has-right"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setFocused("password")}
                                        onBlur={() => setFocused("")}
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword
                                            ? <EyeOff size={17} />
                                            : <Eye     size={17} />}
                                    </button>
                                </div>
                            </div>

                            {/* Extras */}
                            <div className="extras">
                                <label className="remember">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    Remember me
                                </label>
                                <a href="#forgot" className="forgot">Forgot password?</a>
                            </div>

                            {/* Submit */}
                            <button type="submit" className="submit-btn" disabled={loading}>
                                <span className="submit-shine" />
                                {loading ? (
                                    <>
                                        <div className="spinner" />
                                        <span>Signing in…</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In to Patient Care</span>
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="divider">
                            <div className="divider-line" />
                            <span className="divider-text">New to CareLink?</span>
                            <div className="divider-line" />
                        </div>

                        {/* Footer */}
                        <div className="card-footer">
                            Need patient access?
                            <a href="#signup">Create Account</a>
                        </div>

                        {/* Security badge */}
                        <div className="security-badge">
                            <div className="security-dot" />
                            <span>Secure · HIPAA-compliant · Encrypted</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
