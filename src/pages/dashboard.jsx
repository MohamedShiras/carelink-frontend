import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import api from "../services/api";

import PatientDashboard from "./PatientDashboard";
import DoctorDashboard from "./DoctorDashboard";
import NurseDashboard from "./NurseDashboard";
import AdminDashboard from "./AdminDashboard";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/profile");
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to load user profile", err);
        // Clear token if invalid
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-200">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
          <p className="text-sm font-medium">Synchronizing Secure Session...</p>
        </div>
      </div>
    );
  }

  if (!localStorage.getItem("token") || !user) {
    return <Navigate to="/login" replace />;
  }

  // Render dashboard based on user role
  switch (user.role) {
    case "patient":
      return <PatientDashboard user={user} onLogout={handleLogout} />;
    case "doctor":
      return <DoctorDashboard user={user} onLogout={handleLogout} />;
    case "nurse":
      return <NurseDashboard user={user} onLogout={handleLogout} />;
    case "admin":
      return <AdminDashboard user={user} onLogout={handleLogout} />;
    default:
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-200">
          <h2 className="text-xl font-bold text-rose-400">Invalid Account Role</h2>
          <p className="text-sm text-slate-400 mt-2">The system could not identify your account privilege tier.</p>
          <button 
            onClick={handleLogout} 
            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm border border-slate-700 transition"
          >
            Go to Login
          </button>
        </div>
      );
  }
}
