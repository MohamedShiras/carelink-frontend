import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Activity,
    ArrowRight,
    CalendarClock,
    CheckCircle2,
    ClipboardList,
    FileText,
    HeartPulse,
    LogOut,
    MessageSquare,
    PhoneCall,
    Pill,
    ShieldAlert,
    Stethoscope,
    TimerReset,
    UserRound,
    Bell,
    TrendingUp,
    Zap,
    ChevronRight,
    Download,
    Phone,
} from "lucide-react";

/* ─── Data ────────────────────────────────────────────────────────────── */

const dashboardTabs = [
    { id: "overview",      label: "Overview",      icon: Activity },
    { id: "medications",   label: "Medications",   icon: Pill },
    { id: "appointments",  label: "Appointments",  icon: CalendarClock },
    { id: "records",       label: "Records",       icon: FileText },
    { id: "support",       label: "Support",       icon: PhoneCall },
];

const stats = [
    { label: "Wellbeing",  value: "Stable",           detail: "Recovery on track",  icon: HeartPulse, color: "#10b981", bg: "rgba(16,185,129,0.1)",  trend: "+2%" },
    { label: "Next Visit", value: "Tomorrow",          detail: "09:30 · Cardiology", icon: CalendarClock, color: "#3b82f6", bg: "rgba(59,130,246,0.1)", trend: "Upcoming" },
    { label: "Medication", value: "96%",               detail: "2 doses due today",  icon: Pill, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)",  trend: "↑ 4%" },
    { label: "Alerts",     value: "1 Active",          detail: "Follow-up required", icon: ShieldAlert, color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  trend: "Review" },
];

const medicationSchedule = [
    { name: "Amlodipine 5mg",    time: "08:00 AM", status: "Taken", note: "After breakfast",      progress: 100 },
    { name: "Atorvastatin 20mg", time: "08:00 PM", status: "Due",   note: "After dinner w/ water", progress: 0   },
    { name: "Vitamin D",         time: "08:00 AM", status: "Taken", note: "Daily supplement",      progress: 100 },
];

const careSteps = [
    { text: "Check blood pressure every morning",     done: true  },
    { text: "Upload symptoms if they change",         done: false },
    { text: "Complete the follow-up blood test",      done: false },
    { text: "Review diet notes with the care team",   done: false },
];

const recentUpdates = [
    { title: "Lab results reviewed",       detail: "Kidney markers remain within the expected recovery range.", time: "Today, 07:20 AM",      dot: "#10b981" },
    { title: "Nurse check-in completed",   detail: "Blood pressure and symptom notes were logged successfully.", time: "Yesterday, 06:10 PM",  dot: "#3b82f6" },
    { title: "Medication reminder sent",   detail: "Evening dose reminder scheduled for 8:00 PM.",              time: "Yesterday, 05:15 PM",  dot: "#8b5cf6" },
];

const careTeam = [
    { role: "Primary Doctor",  name: "Dr. Anjali Perera",    initial: "A", color: "#10b981" },
    { role: "Nurse Contact",   name: "Nurse Jessica Smith",  initial: "J", color: "#3b82f6" },
    { role: "Patient Support", name: "CareLink Help Desk",   initial: "C", color: "#8b5cf6" },
];

const appointments = [
    { date: "Tomorrow",   time: "09:30 AM", type: "Cardiology Review",          doctor: "Dr. Anjali Perera",  status: "Confirmed", urgent: true  },
    { date: "Friday",     time: "03:00 PM", type: "Lab Follow-up & Med Review", doctor: "Dr. Anjali Perera",  status: "Scheduled", urgent: false },
    { date: "Next Monday",time: "11:00 AM", type: "General Check-up",           doctor: "Nurse Jessica Smith",status: "Pending",   urgent: false },
];

const records = [
    { name: "Blood Test Results",   date: "14 June 2025", detail: "Creatinine, eGFR, and electrolytes reviewed by clinician.", tag: "Lab Report" },
    { name: "Discharge Notes",      date: "13 June 2025", detail: "Recovery instructions and home monitoring guidance.",        tag: "Discharge" },
    { name: "Cardiology Report",    date: "01 June 2025", detail: "ECG and echocardiogram findings — all within normal range.", tag: "Specialist" },
];

/* ─── Styles ──────────────────────────────────────────────────────────── */

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.pd-root {
    min-height: 100vh;
    background: #eef8f0;
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow-x: hidden;
}

/* ── Ambient background blobs ── */
.pd-blob {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(80px);
    z-index: 0;
}
.pd-blob-1 {
    top: -120px; left: -120px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%);
    animation: pdBlob 18s ease-in-out infinite;
}
.pd-blob-2 {
    bottom: -100px; right: -100px;
    width: 480px; height: 480px;
    background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
    animation: pdBlob 22s ease-in-out infinite reverse;
}
.pd-blob-3 {
    top: 40%; left: 50%;
    width: 360px; height: 360px;
    background: radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%);
    animation: pdBlob 15s ease-in-out infinite 4s;
}
@keyframes pdBlob {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(30px,-40px) scale(1.06); }
    66%      { transform: translate(-20px,20px) scale(0.96); }
}

/* ── Layout ── */
.pd-wrap {
    position: relative; z-index: 1;
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 24px 40px;
}

/* ── Navbar ── */
.pd-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 20px 0 16px;
    border-bottom: 1px solid rgba(16,185,129,0.15);
    margin-bottom: 0;
}
.pd-nav-brand { display: flex; align-items: center; gap: 12px; }
.pd-nav-icon {
    width: 44px; height: 44px;
    border-radius: 14px;
    background: rgba(255,255,255,0.8);
    border: 1.5px solid rgba(16,185,129,0.3);
    display: flex; align-items: center; justify-content: center;
    color: #059669;
    box-shadow: 0 4px 12px rgba(16,185,129,0.12);
    transition: box-shadow 0.2s, transform 0.2s;
}
.pd-nav-icon:hover { box-shadow: 0 6px 20px rgba(16,185,129,0.22); transform: translateY(-1px); }
.pd-nav-title { font-size: 18px; font-weight: 800; color: #022c22; letter-spacing: -0.4px; }
.pd-nav-sub { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.22em; color: #059669; margin-top: 1px; }

.pd-nav-right { display: flex; align-items: center; gap: 10px; }

.pd-status-pill {
    display: none;
    align-items: center; gap: 8px;
    background: rgba(255,255,255,0.75);
    border: 1px solid rgba(16,185,129,0.2);
    border-radius: 100px;
    padding: 8px 16px;
    font-size: 13px; color: #065f46;
    backdrop-filter: blur(8px);
}
@media (min-width: 640px) { .pd-status-pill { display: flex; } }
.pd-status-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #10b981;
    animation: pdPulse 2s ease-in-out infinite;
}
@keyframes pdPulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.75); } }

.pd-bell-btn {
    position: relative;
    width: 40px; height: 40px;
    background: rgba(255,255,255,0.75);
    border: 1px solid rgba(16,185,129,0.2);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    color: #059669; cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;
}
.pd-bell-btn:hover { background: #fff; box-shadow: 0 4px 12px rgba(16,185,129,0.12); }
.pd-bell-badge {
    position: absolute; top: 8px; right: 8px;
    width: 8px; height: 8px; border-radius: 50%;
    background: #f59e0b;
    border: 1.5px solid #eef8f0;
}

.pd-signout-btn {
    display: flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.75);
    border: 1px solid rgba(16,185,129,0.2);
    border-radius: 100px;
    padding: 9px 18px;
    font-size: 13.5px; font-weight: 500;
    color: #065f46; cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: background 0.2s, box-shadow 0.2s;
}
.pd-signout-btn:hover { background: #fff; box-shadow: 0 4px 12px rgba(16,185,129,0.1); }

/* ── Hero banner ── */
.pd-hero {
    margin-top: 28px;
    border-radius: 28px;
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, rgba(255,255,255,0.9) 100%);
    border: 1px solid rgba(16,185,129,0.2);
    padding: 36px 40px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 1px 0 rgba(6,95,70,0.05), 0 16px 40px rgba(16,185,129,0.06);
    animation: pdEntrance 0.5s cubic-bezier(0.22,1,0.36,1) both;
}
@keyframes pdEntrance {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
}
.pd-hero-deco {
    position: absolute;
    top: -60px; right: -60px;
    width: 260px; height: 260px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%);
    filter: blur(40px);
}
.pd-hero-deco2 {
    position: absolute;
    bottom: -40px; left: 40%;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
    filter: blur(30px);
}

.pd-hero-inner {
    position: relative; z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 28px;
}
@media (min-width: 1024px) {
    .pd-hero-inner { flex-direction: row; align-items: center; justify-content: space-between; }
}

.pd-hero-left {}
.pd-user-pill {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.75);
    border: 1px solid rgba(16,185,129,0.25);
    border-radius: 100px;
    padding: 6px 14px;
    font-size: 11.5px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.18em;
    color: #065f46;
    margin-bottom: 16px;
    backdrop-filter: blur(8px);
}
.pd-hero-h2 {
    font-size: 34px; font-weight: 800; color: #022c22;
    letter-spacing: -0.8px; line-height: 1.15;
}
.pd-hero-h2 em {
    font-style: normal;
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
@media (min-width: 640px) { .pd-hero-h2 { font-size: 40px; } }
.pd-hero-p { margin-top: 12px; font-size: 14.5px; line-height: 1.7; color: #065f46; max-width: 480px; }

/* Stats grid */
.pd-stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    flex-shrink: 0;
}
@media (min-width: 1024px) { .pd-stats-grid { width: 360px; } }

.pd-stat-card {
    background: rgba(255,255,255,0.82);
    border: 1px solid rgba(255,255,255,0.9);
    border-radius: 20px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    backdrop-filter: blur(8px);
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: default;
}
.pd-stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(16,185,129,0.1); }

.pd-stat-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.pd-stat-icon {
    width: 34px; height: 34px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.pd-stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #6b7280; font-weight: 600; }
.pd-stat-value { font-size: 17px; font-weight: 700; color: #022c22; margin-top: 6px; line-height: 1.2; }
.pd-stat-detail { font-size: 11.5px; color: #059669; margin-top: 3px; }
.pd-stat-trend {
    display: inline-flex;
    font-size: 10px; font-weight: 600;
    padding: 2px 8px;
    border-radius: 100px;
    background: rgba(16,185,129,0.1);
    color: #059669;
    margin-top: 8px;
}

/* ── Main grid ── */
.pd-main {
    margin-top: 28px;
    display: grid;
    gap: 24px;
}
@media (min-width: 1280px) {
    .pd-main { grid-template-columns: minmax(0, 1fr) 340px; }
}

/* ── Section ── */
.pd-section { display: flex; flex-direction: column; gap: 20px; min-width: 0; }

/* ── Tab bar ── */
.pd-tabs {
    display: flex; gap: 8px;
    padding: 6px;
    background: rgba(255,255,255,0.7);
    border: 1px solid rgba(16,185,129,0.15);
    border-radius: 18px;
    overflow-x: auto;
    scrollbar-width: none;
    backdrop-filter: blur(8px);
}
.pd-tabs::-webkit-scrollbar { display: none; }

.pd-tab {
    display: flex; align-items: center; gap: 7px;
    padding: 9px 18px;
    border-radius: 12px;
    border: none;
    font-size: 13.5px; font-weight: 500;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
    color: #065f46;
    background: transparent;
}
.pd-tab:hover:not(.active) { background: rgba(16,185,129,0.06); }
.pd-tab.active {
    background: linear-gradient(135deg, #10b981, #059669);
    color: #fff;
    box-shadow: 0 4px 12px rgba(16,185,129,0.3);
}

/* ── Panels ── */
.pd-panel {
    background: rgba(255,255,255,0.85);
    border: 1px solid rgba(16,185,129,0.15);
    border-radius: 24px;
    padding: 28px;
    box-shadow: 0 1px 0 rgba(6,95,70,0.04), 0 8px 24px rgba(16,185,129,0.05);
    backdrop-filter: blur(12px);
    animation: pdEntrance 0.3s cubic-bezier(0.22,1,0.36,1) both;
}
.pd-panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
.pd-panel-label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.22em; color: #059669; font-weight: 600; }
.pd-panel-title { font-size: 20px; font-weight: 700; color: #022c22; letter-spacing: -0.3px; margin-top: 4px; }
.pd-panel-icon-wrap {
    width: 40px; height: 40px;
    border-radius: 12px;
    background: rgba(16,185,129,0.1);
    border: 1px solid rgba(16,185,129,0.15);
    display: flex; align-items: center; justify-content: center;
    color: #059669;
}

.pd-badge {
    display: inline-flex;
    font-size: 11px; font-weight: 600;
    padding: 4px 12px; border-radius: 100px;
    background: rgba(16,185,129,0.1);
    border: 1px solid rgba(16,185,129,0.15);
    color: #059669;
}
.pd-badge.amber {
    background: rgba(245,158,11,0.1);
    border-color: rgba(245,158,11,0.15);
    color: #b45309;
}

/* ── Overview tab ── */
.pd-overview-grid { display: grid; gap: 16px; }
@media (min-width: 1024px) { .pd-overview-grid { grid-template-columns: 1fr 1fr; } }

.pd-info-card {
    background: linear-gradient(135deg, rgba(236,253,245,0.8), rgba(255,255,255,0.6));
    border: 1px solid rgba(16,185,129,0.15);
    border-radius: 18px;
    padding: 20px;
}
.pd-info-card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.pd-info-card-icon { width: 20px; height: 20px; color: #059669; }
.pd-info-card-label { font-size: 13px; font-weight: 600; color: #065f46; }
.pd-info-card p { font-size: 13.5px; line-height: 1.75; color: #065f46; }

.pd-focus-list { display: flex; flex-direction: column; gap: 10px; }
.pd-focus-item { display: flex; align-items: center; gap: 10px; }
.pd-focus-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: linear-gradient(135deg, #10b981, #059669);
    flex-shrink: 0;
}
.pd-focus-item span { font-size: 13.5px; color: #065f46; }

/* Updates */
.pd-updates-list { display: flex; flex-direction: column; gap: 16px; }
.pd-update-item {
    display: flex; gap: 14px;
    padding: 14px;
    background: rgba(236,253,245,0.5);
    border: 1px solid rgba(16,185,129,0.1);
    border-radius: 14px;
    transition: background 0.2s;
}
.pd-update-item:hover { background: rgba(236,253,245,0.8); }
.pd-update-dot-col { display: flex; flex-direction: column; align-items: center; gap: 4px; padding-top: 2px; }
.pd-update-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.pd-update-line { width: 1.5px; flex: 1; background: rgba(16,185,129,0.15); }
.pd-update-content { flex: 1; }
.pd-update-title { font-size: 13.5px; font-weight: 600; color: #022c22; }
.pd-update-detail { font-size: 12.5px; color: #065f46; line-height: 1.6; margin-top: 3px; }
.pd-update-time { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.18em; color: #6ee7b7; margin-top: 5px; font-weight: 600; }

/* ── Medications tab ── */
.pd-med-list { display: flex; flex-direction: column; gap: 12px; }
.pd-med-card {
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    padding: 18px 20px;
    background: rgba(236,253,245,0.5);
    border: 1px solid rgba(16,185,129,0.12);
    border-radius: 16px;
    transition: background 0.2s, transform 0.15s;
}
.pd-med-card:hover { background: rgba(236,253,245,0.9); transform: translateX(3px); }
.pd-med-left { display: flex; align-items: center; gap: 14px; }
.pd-med-icon {
    width: 42px; height: 42px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.pd-med-icon.taken { background: rgba(16,185,129,0.12); color: #059669; }
.pd-med-icon.due   { background: rgba(245,158,11,0.12); color: #d97706; }
.pd-med-name { font-size: 14.5px; font-weight: 600; color: #022c22; }
.pd-med-note { font-size: 12.5px; color: #065f46; margin-top: 2px; }
.pd-med-right { text-align: right; flex-shrink: 0; }
.pd-med-time { font-size: 12.5px; color: #059669; font-weight: 500; }
.pd-med-status {
    display: inline-flex;
    font-size: 11px; font-weight: 700;
    padding: 3px 11px; border-radius: 100px;
    margin-top: 5px;
}
.pd-med-status.taken { background: rgba(16,185,129,0.12); color: #059669; }
.pd-med-status.due   { background: rgba(245,158,11,0.12); color: #d97706; }

.pd-adherence-bar-wrap { margin-top: 24px; }
.pd-adherence-label { display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 600; color: #065f46; margin-bottom: 8px; }
.pd-adherence-bar { height: 8px; background: rgba(16,185,129,0.12); border-radius: 100px; overflow: hidden; }
.pd-adherence-fill {
    height: 100%;
    background: linear-gradient(90deg, #10b981, #059669);
    border-radius: 100px;
    transition: width 1s ease;
}

/* ── Appointments tab ── */
.pd-apt-list { display: flex; flex-direction: column; gap: 14px; }
.pd-apt-card {
    display: flex; gap: 16px; align-items: flex-start;
    padding: 18px 20px;
    border-radius: 16px;
    border: 1px solid rgba(16,185,129,0.12);
    background: rgba(236,253,245,0.5);
    transition: background 0.2s, transform 0.15s;
    position: relative; overflow: hidden;
}
.pd-apt-card:hover { background: rgba(236,253,245,0.9); transform: translateX(3px); }
.pd-apt-card.urgent { border-color: rgba(16,185,129,0.25); }
.pd-apt-urgent-bar {
    position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
    background: linear-gradient(180deg, #10b981, #059669);
    border-radius: 4px 0 0 4px;
}
.pd-apt-date-col { text-align: center; min-width: 54px; flex-shrink: 0; }
.pd-apt-day { font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #059669; font-weight: 600; }
.pd-apt-time { font-size: 13px; font-weight: 700; color: #022c22; margin-top: 2px; }
.pd-apt-body { flex: 1; }
.pd-apt-type { font-size: 14.5px; font-weight: 600; color: #022c22; }
.pd-apt-doctor { font-size: 12.5px; color: #065f46; margin-top: 3px; }
.pd-apt-tag {
    display: inline-flex;
    font-size: 11px; font-weight: 600;
    padding: 3px 10px; border-radius: 100px;
    margin-top: 8px;
}
.pd-apt-tag.confirmed { background: rgba(16,185,129,0.1); color: #059669; border: 1px solid rgba(16,185,129,0.15); }
.pd-apt-tag.scheduled { background: rgba(59,130,246,0.1); color: #2563eb; border: 1px solid rgba(59,130,246,0.15); }
.pd-apt-tag.pending   { background: rgba(245,158,11,0.1); color: #d97706; border: 1px solid rgba(245,158,11,0.15); }

/* ── Records tab ── */
.pd-rec-list { display: flex; flex-direction: column; gap: 12px; }
.pd-rec-card {
    display: flex; align-items: center; gap: 16px;
    padding: 18px 20px;
    border-radius: 16px;
    border: 1px solid rgba(16,185,129,0.12);
    background: rgba(236,253,245,0.5);
    transition: background 0.2s, transform 0.15s;
    cursor: pointer;
}
.pd-rec-card:hover { background: rgba(236,253,245,0.9); transform: translateX(3px); }
.pd-rec-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: rgba(16,185,129,0.1);
    border: 1px solid rgba(16,185,129,0.15);
    display: flex; align-items: center; justify-content: center;
    color: #059669; flex-shrink: 0;
}
.pd-rec-body { flex: 1; min-width: 0; }
.pd-rec-name { font-size: 14px; font-weight: 600; color: #022c22; }
.pd-rec-date { font-size: 11.5px; color: #059669; font-weight: 500; margin-top: 2px; }
.pd-rec-detail { font-size: 12.5px; color: #065f46; margin-top: 4px; line-height: 1.5; }
.pd-rec-tag {
    font-size: 10.5px; font-weight: 600;
    padding: 3px 10px; border-radius: 100px;
    background: rgba(16,185,129,0.1);
    border: 1px solid rgba(16,185,129,0.12);
    color: #059669;
    flex-shrink: 0;
    white-space: nowrap;
}
.pd-rec-download {
    width: 32px; height: 32px; border-radius: 9px;
    background: rgba(16,185,129,0.08);
    border: 1px solid rgba(16,185,129,0.12);
    display: flex; align-items: center; justify-content: center;
    color: #059669; flex-shrink: 0;
    transition: background 0.2s;
}
.pd-rec-download:hover { background: rgba(16,185,129,0.16); }

/* ── Support tab ── */
.pd-support-grid { display: grid; gap: 14px; }
@media (min-width: 640px) { .pd-support-grid { grid-template-columns: 1fr 1fr; } }

.pd-support-card {
    padding: 22px;
    border-radius: 18px;
    border: 1px solid rgba(16,185,129,0.15);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    text-align: left;
}
.pd-support-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(16,185,129,0.1); }
.pd-support-card.primary {
    background: linear-gradient(135deg, #10b981, #059669);
    color: #fff;
    border-color: transparent;
}
.pd-support-card.secondary { background: rgba(236,253,245,0.8); }
.pd-support-card-icon {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 14px;
}
.pd-support-card.primary .pd-support-card-icon { background: rgba(255,255,255,0.2); color: #fff; }
.pd-support-card.secondary .pd-support-card-icon { background: rgba(16,185,129,0.1); color: #059669; }
.pd-support-title { font-size: 15px; font-weight: 700; }
.pd-support-card.primary .pd-support-title { color: #fff; }
.pd-support-card.secondary .pd-support-title { color: #022c22; }
.pd-support-desc { font-size: 13px; line-height: 1.6; margin-top: 6px; }
.pd-support-card.primary .pd-support-desc { color: rgba(255,255,255,0.8); }
.pd-support-card.secondary .pd-support-desc { color: #065f46; }

/* ── Aside ── */
.pd-aside { display: flex; flex-direction: column; gap: 20px; }

/* Care team */
.pd-team-list { display: flex; flex-direction: column; gap: 10px; }
.pd-team-card {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 16px;
    background: rgba(236,253,245,0.6);
    border: 1px solid rgba(16,185,129,0.12);
    border-radius: 14px;
    transition: background 0.2s, transform 0.15s;
    cursor: pointer;
}
.pd-team-card:hover { background: rgba(236,253,245,1); transform: translateX(3px); }
.pd-team-avatar {
    width: 40px; height: 40px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: 700; color: #fff;
    flex-shrink: 0;
}
.pd-team-role { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.18em; color: #6ee7b7; font-weight: 600; }
.pd-team-name { font-size: 13.5px; font-weight: 600; color: #022c22; margin-top: 1px; }
.pd-team-chevron { margin-left: auto; color: #a7f3d0; }

/* Care plan */
.pd-plan-list { display: flex; flex-direction: column; gap: 10px; }
.pd-plan-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px;
    border-radius: 14px;
    border: 1px solid rgba(16,185,129,0.12);
    transition: background 0.2s;
    cursor: pointer;
}
.pd-plan-item.done { background: rgba(236,253,245,0.6); }
.pd-plan-item.todo { background: rgba(255,255,255,0.6); }
.pd-plan-item:hover { background: rgba(236,253,245,0.9); }
.pd-plan-check {
    width: 22px; height: 22px; border-radius: 7px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
}
.pd-plan-check.done { background: rgba(16,185,129,0.15); color: #059669; }
.pd-plan-check.todo { background: rgba(16,185,129,0.07); color: #a7f3d0; }
.pd-plan-text { font-size: 13px; color: #065f46; line-height: 1.5; }
.pd-plan-text.done { color: #059669; }

/* CTA */
.pd-cta {
    background: linear-gradient(135deg, #022c22 0%, #064e3b 100%);
    border-radius: 24px;
    padding: 28px;
    position: relative; overflow: hidden;
}
.pd-cta-deco {
    position: absolute; top: -30px; right: -30px;
    width: 120px; height: 120px; border-radius: 50%;
    background: rgba(16,185,129,0.12);
    filter: blur(20px);
}
.pd-cta-label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.22em; color: #6ee7b7; font-weight: 600; }
.pd-cta-title { font-size: 20px; font-weight: 800; color: #fff; margin-top: 8px; letter-spacing: -0.3px; }
.pd-cta-p { font-size: 13px; line-height: 1.65; color: rgba(255,255,255,0.65); margin-top: 10px; }
.pd-cta-btn {
    display: inline-flex; align-items: center; gap: 8px;
    margin-top: 20px;
    background: linear-gradient(135deg, #10b981, #059669);
    border: none; border-radius: 100px;
    padding: 11px 22px;
    font-size: 13.5px; font-weight: 600; color: #fff;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 14px rgba(16,185,129,0.35);
}
.pd-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(16,185,129,0.45); }

/* Wellbeing ring */
.pd-ring-wrap {
    position: relative;
    width: 64px; height: 64px; flex-shrink: 0;
}
.pd-ring-svg { transform: rotate(-90deg); }
.pd-ring-track { fill: none; stroke: rgba(16,185,129,0.12); stroke-width: 6; }
.pd-ring-fill  { fill: none; stroke: url(#ringGrad); stroke-width: 6; stroke-linecap: round; stroke-dasharray: 163; stroke-dashoffset: 7; transition: stroke-dashoffset 1s ease; }

/* Divider */
.pd-divider { height: 1px; background: rgba(16,185,129,0.12); margin: 4px 0; }
`;

/* ─── Component ───────────────────────────────────────────────────────── */

export default function PatientDashboard() {
    const navigate     = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <>
            <style>{css}</style>
            <div className="pd-root">
                {/* Ambient blobs */}
                <div className="pd-blob pd-blob-1" />
                <div className="pd-blob pd-blob-2" />
                <div className="pd-blob pd-blob-3" />

                <div className="pd-wrap">

                    {/* ── Navbar ── */}
                    <nav className="pd-nav">
                        <div className="pd-nav-brand">
                            <div className="pd-nav-icon">
                                <Activity size={20} />
                            </div>
                            <div>
                                <div className="pd-nav-title">CareLink</div>
                                <div className="pd-nav-sub">Patient-first dashboard</div>
                            </div>
                        </div>

                        <div className="pd-nav-right">
                            <div className="pd-status-pill">
                                <span className="pd-status-dot" />
                                Care team available now
                            </div>
                            <button className="pd-bell-btn" aria-label="Notifications">
                                <Bell size={17} />
                                <span className="pd-bell-badge" />
                            </button>
                            <button className="pd-signout-btn" onClick={handleLogout}>
                                <LogOut size={15} />
                                Sign out
                            </button>
                        </div>
                    </nav>

                    {/* ── Hero ── */}
                    <div className="pd-hero">
                        <div className="pd-hero-deco" />
                        <div className="pd-hero-deco2" />
                        <div className="pd-hero-inner">
                            <div className="pd-hero-left">
                                <div className="pd-user-pill">
                                    <UserRound size={13} />
                                    Sarah Jenkins
                                </div>
                                <h2 className="pd-hero-h2">
                                    Your care,<br />
                                    <em>clear and simple.</em>
                                </h2>
                                <p className="pd-hero-p">
                                    See what matters today, follow your treatment plan, and reach the care team — all without digging through a busy interface.
                                </p>
                            </div>

                            <div className="pd-stats-grid">
                                {stats.map((s) => {
                                    const Icon = s.icon;
                                    return (
                                        <div className="pd-stat-card" key={s.label}>
                                            <div className="pd-stat-top">
                                                <div>
                                                    <div className="pd-stat-label">{s.label}</div>
                                                    <div className="pd-stat-value">{s.value}</div>
                                                </div>
                                                <div className="pd-stat-icon" style={{ background: s.bg }}>
                                                    <Icon size={17} style={{ color: s.color }} />
                                                </div>
                                            </div>
                                            <div className="pd-stat-detail">{s.detail}</div>
                                            <div className="pd-stat-trend">{s.trend}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ── Main grid ── */}
                    <div className="pd-main">

                        {/* ── Left section ── */}
                        <div className="pd-section">

                            {/* Tab bar */}
                            <div className="pd-tabs">
                                {dashboardTabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            className={`pd-tab${activeTab === tab.id ? " active" : ""}`}
                                            onClick={() => setActiveTab(tab.id)}
                                        >
                                            <Icon size={15} />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* ── Overview ── */}
                            {activeTab === "overview" && (
                                <>
                                    <div className="pd-panel">
                                        <div className="pd-panel-header">
                                            <div>
                                                <div className="pd-panel-label">Care Summary</div>
                                                <div className="pd-panel-title">What matters today</div>
                                            </div>
                                            <span className="pd-badge">Reviewed by care team</span>
                                        </div>

                                        <div className="pd-overview-grid">
                                            <div className="pd-info-card">
                                                <div className="pd-info-card-header">
                                                    <CheckCircle2 className="pd-info-card-icon" />
                                                    <span className="pd-info-card-label">Health Status</span>
                                                </div>
                                                <p>
                                                    Your latest observations indicate a <strong>stable recovery pattern.</strong> The care team is monitoring blood pressure and kidney markers to keep treatment on track.
                                                </p>
                                            </div>

                                            <div className="pd-info-card">
                                                <div className="pd-info-card-header">
                                                    <TimerReset className="pd-info-card-icon" />
                                                    <span className="pd-info-card-label">Today's Focus</span>
                                                </div>
                                                <div className="pd-focus-list">
                                                    {["Morning vitals check", "Evening medication reminder", "Review lab results after lunch"].map((f) => (
                                                        <div className="pd-focus-item" key={f}>
                                                            <span className="pd-focus-dot" />
                                                            <span>{f}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pd-panel">
                                        <div className="pd-panel-header">
                                            <div>
                                                <div className="pd-panel-label">Recent Updates</div>
                                                <div className="pd-panel-title">Latest from your care team</div>
                                            </div>
                                            <div className="pd-panel-icon-wrap">
                                                <MessageSquare size={18} />
                                            </div>
                                        </div>

                                        <div className="pd-updates-list">
                                            {recentUpdates.map((u, i) => (
                                                <div className="pd-update-item" key={u.title}>
                                                    <div className="pd-update-dot-col">
                                                        <span className="pd-update-dot" style={{ background: u.dot }} />
                                                        {i < recentUpdates.length - 1 && <span className="pd-update-line" />}
                                                    </div>
                                                    <div className="pd-update-content">
                                                        <div className="pd-update-title">{u.title}</div>
                                                        <div className="pd-update-detail">{u.detail}</div>
                                                        <div className="pd-update-time">{u.time}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ── Medications ── */}
                            {activeTab === "medications" && (
                                <div className="pd-panel">
                                    <div className="pd-panel-header">
                                        <div>
                                            <div className="pd-panel-label">Medication Plan</div>
                                            <div className="pd-panel-title">What to take today</div>
                                        </div>
                                        <div className="pd-panel-icon-wrap">
                                            <Pill size={18} />
                                        </div>
                                    </div>

                                    <div className="pd-med-list">
                                        {medicationSchedule.map((m) => (
                                            <div className="pd-med-card" key={m.name}>
                                                <div className="pd-med-left">
                                                    <div className={`pd-med-icon ${m.status.toLowerCase()}`}>
                                                        <Pill size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="pd-med-name">{m.name}</div>
                                                        <div className="pd-med-note">{m.note}</div>
                                                    </div>
                                                </div>
                                                <div className="pd-med-right">
                                                    <div className="pd-med-time">{m.time}</div>
                                                    <div className={`pd-med-status ${m.status.toLowerCase()}`}>
                                                        {m.status === "Taken" ? "✓ Taken" : "● Due"}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pd-adherence-bar-wrap">
                                        <div className="pd-adherence-label">
                                            <span>Weekly adherence</span>
                                            <span>96%</span>
                                        </div>
                                        <div className="pd-adherence-bar">
                                            <div className="pd-adherence-fill" style={{ width: "96%" }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Appointments ── */}
                            {activeTab === "appointments" && (
                                <div className="pd-panel">
                                    <div className="pd-panel-header">
                                        <div>
                                            <div className="pd-panel-label">Upcoming Visits</div>
                                            <div className="pd-panel-title">Your appointment schedule</div>
                                        </div>
                                        <div className="pd-panel-icon-wrap">
                                            <CalendarClock size={18} />
                                        </div>
                                    </div>

                                    <div className="pd-apt-list">
                                        {appointments.map((a) => (
                                            <div className={`pd-apt-card${a.urgent ? " urgent" : ""}`} key={a.type}>
                                                {a.urgent && <div className="pd-apt-urgent-bar" />}
                                                <div className="pd-apt-date-col" style={{ paddingLeft: a.urgent ? 8 : 0 }}>
                                                    <div className="pd-apt-day">{a.date}</div>
                                                    <div className="pd-apt-time">{a.time}</div>
                                                </div>
                                                <div className="pd-apt-body">
                                                    <div className="pd-apt-type">{a.type}</div>
                                                    <div className="pd-apt-doctor">{a.doctor}</div>
                                                    <span className={`pd-apt-tag ${a.status.toLowerCase()}`}>{a.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── Records ── */}
                            {activeTab === "records" && (
                                <div className="pd-panel">
                                    <div className="pd-panel-header">
                                        <div>
                                            <div className="pd-panel-label">Medical Records</div>
                                            <div className="pd-panel-title">Your recent documents</div>
                                        </div>
                                        <div className="pd-panel-icon-wrap">
                                            <ClipboardList size={18} />
                                        </div>
                                    </div>

                                    <div className="pd-rec-list">
                                        {records.map((r) => (
                                            <div className="pd-rec-card" key={r.name}>
                                                <div className="pd-rec-icon">
                                                    <FileText size={18} />
                                                </div>
                                                <div className="pd-rec-body">
                                                    <div className="pd-rec-name">{r.name}</div>
                                                    <div className="pd-rec-date">{r.date}</div>
                                                    <div className="pd-rec-detail">{r.detail}</div>
                                                </div>
                                                <span className="pd-rec-tag">{r.tag}</span>
                                                <div className="pd-rec-download">
                                                    <Download size={13} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── Support ── */}
                            {activeTab === "support" && (
                                <div className="pd-panel">
                                    <div className="pd-panel-header">
                                        <div>
                                            <div className="pd-panel-label">Get Help</div>
                                            <div className="pd-panel-title">Reach the care team</div>
                                        </div>
                                        <div className="pd-panel-icon-wrap">
                                            <PhoneCall size={18} />
                                        </div>
                                    </div>

                                    <div className="pd-support-grid">
                                        <button className="pd-support-card primary">
                                            <div className="pd-support-card-icon">
                                                <Zap size={20} />
                                            </div>
                                            <div className="pd-support-title">Emergency Assistance</div>
                                            <div className="pd-support-desc">Call the hospital emergency number if symptoms become severe or urgent.</div>
                                        </button>

                                        <button className="pd-support-card secondary">
                                            <div className="pd-support-card-icon">
                                                <Phone size={20} />
                                            </div>
                                            <div className="pd-support-title">Patient Help Desk</div>
                                            <div className="pd-support-desc">Use the care team channel for appointment or record questions.</div>
                                        </button>

                                        <button className="pd-support-card secondary">
                                            <div className="pd-support-card-icon">
                                                <MessageSquare size={20} />
                                            </div>
                                            <div className="pd-support-title">Message Care Team</div>
                                            <div className="pd-support-desc">Send a message to your nurse or doctor directly through the platform.</div>
                                        </button>

                                        <button className="pd-support-card secondary">
                                            <div className="pd-support-card-icon">
                                                <TrendingUp size={20} />
                                            </div>
                                            <div className="pd-support-title">Report Symptoms</div>
                                            <div className="pd-support-desc">Log any new or worsening symptoms for your care team to review.</div>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Aside ── */}
                        <div className="pd-aside">

                            {/* Care team */}
                            <div className="pd-panel">
                                <div className="pd-panel-header">
                                    <div>
                                        <div className="pd-panel-label">Care Team</div>
                                        <div className="pd-panel-title">Who supports you</div>
                                    </div>
                                    <div className="pd-panel-icon-wrap">
                                        <Stethoscope size={18} />
                                    </div>
                                </div>

                                <div className="pd-team-list">
                                    {careTeam.map((p) => (
                                        <div className="pd-team-card" key={p.role}>
                                            <div className="pd-team-avatar" style={{ background: p.color }}>
                                                {p.initial}
                                            </div>
                                            <div>
                                                <div className="pd-team-role">{p.role}</div>
                                                <div className="pd-team-name">{p.name}</div>
                                            </div>
                                            <ChevronRight size={15} className="pd-team-chevron" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Care plan */}
                            <div className="pd-panel">
                                <div className="pd-panel-header">
                                    <div>
                                        <div className="pd-panel-label">Care Plan</div>
                                        <div className="pd-panel-title">Today's actions</div>
                                    </div>
                                    <div className="pd-panel-icon-wrap">
                                        <ClipboardList size={18} />
                                    </div>
                                </div>

                                <div className="pd-plan-list">
                                    {careSteps.map((s) => (
                                        <div className={`pd-plan-item ${s.done ? "done" : "todo"}`} key={s.text}>
                                            <div className={`pd-plan-check ${s.done ? "done" : "todo"}`}>
                                                <CheckCircle2 size={14} />
                                            </div>
                                            <span className={`pd-plan-text ${s.done ? "done" : ""}`}>
                                                {s.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pd-divider" style={{ margin: "18px 0 14px" }} />
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", color: "#065f46", fontWeight: 500 }}>
                                    <span>Progress</span>
                                    <span style={{ color: "#059669", fontWeight: 700 }}>1 / 4 complete</span>
                                </div>
                                <div className="pd-adherence-bar" style={{ marginTop: 8 }}>
                                    <div className="pd-adherence-fill" style={{ width: "25%" }} />
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="pd-cta">
                                <div className="pd-cta-deco" />
                                <div className="pd-cta-label">Quick action</div>
                                <div className="pd-cta-title">Need to reach someone?</div>
                                <p className="pd-cta-p">
                                    Report a symptom, request a refill, or reschedule a visit — your care team is one tap away.
                                </p>
                                <button className="pd-cta-btn">
                                    Contact care team
                                    <ArrowRight size={15} />
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}