import { useState } from "react";
import api from "../services/api";
import { Mail, Lock, Eye, EyeOff, Activity, AlertCircle } from "lucide-react";
import "./login.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post("/auth/login", {
                email,
                password,
            });

            console.log("Login success:", res.data);

            // Example: save token
            localStorage.setItem("token", res.data.token);

        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-wrapper">
            {/* Ambient Background Blobs */}
            <div className="bg-blobs">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>

            <div className="login-card-container">
                <div className="login-card">
                    {/* Brand / Logo */}
                    <div className="brand-header">
                        <div className="brand-logo-container">
                            <Activity className="brand-logo-icon" />
                        </div>
                        <h1 className="brand-name">CareLink</h1>
                        <p className="brand-tagline">Clinical connection & patient management</p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="error-alert">
                            <AlertCircle className="error-icon" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="login-form">
                        {/* Email field */}
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="login-input"
                                    required
                                />
                                <Mail className="input-icon" />
                            </div>
                        </div>

                        {/* Password field */}
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="login-input"
                                    required
                                />
                                <Lock className="input-icon" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-toggle-btn"
                                    tabIndex="-1"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Extra options */}
                        <div className="form-options">
                            <label className="remember-me">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span>Remember me</span>
                            </label>
                            <a href="#forgot" className="forgot-password-link">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit button */}
                        <button type="submit" className="login-submit-button" disabled={loading}>
                            {loading ? (
                                <>
                                    <div className="submit-spinner"></div>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                "Sign In to CareLink"
                            )}
                        </button>
                    </form>

                    {/* Card Footer */}
                    <div className="login-card-footer">
                        Don't have an account? 
                        <a href="#signup" className="signup-link">
                            Create Account
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}