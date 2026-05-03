"use client";
// Last fix: 2026-05-03 18:45
import { useState, useEffect } from "react";
import {
  Users, DollarSign, Activity, Shield, Zap, Settings, LogOut,
  Crown, Star, AlertTriangle, Clock, MessageCircle, Send,
  Eye, EyeOff, Lock, RefreshCw, UserPlus, Gift,
  Home, Plus, ChevronRight, X, CheckCircle, Ban, ArrowUpRight,
  ArrowDownRight, BarChart2, TrendingUp, Filter, Mail, UserSquare, Phone,
  Download, Search, Edit2, CreditCard, Save, ShoppingBag, Tag, Menu, Trash2,
  Power, Bell
} from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

/* ─────────── CSS ─────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden}
:root{
  --bg:#FAFAF9;--s:#fff;--b:#F1F1EF;--b2:#E5E5E2;
  --ink:#0A0A09;--ink2:#262624;--ink3:#52524E;
  --mu:#8E8E87;--mu2:#C2C2B9;
  --acc:#334DFF;--acc2:#4D66FF;
  --green:#10B981;--red:#EF4444;
  --amber:#F59E0B;--blue:#3B82F6;
  --sb:#090908;
  --fh:'DM Sans',sans-serif;
  --fb:'DM Sans',sans-serif;
  --p20:rgba(51,77,255,.08);
}
body{background:var(--bg);color:var(--ink);font-family:var(--fb);-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:var(--b2);border-radius:99px}
.shell{display:flex;height:100vh;overflow:hidden}
.aside{width:270px;flex-shrink:0;height:100vh;display:flex;flex-direction:column;background:#fff;border-right:1px solid var(--b)}
.main{flex:1;display:flex;flex-direction:column;overflow:hidden}
.scroll{flex:1;overflow-y:auto;background:var(--bg)}

/* sidebar */
.sb-brand{padding:32px 24px 24px;display:flex;align-items:center;gap:12px}
.sb-mark{width:40px;height:40px;border-radius:12px;background:var(--acc);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 8px 20px rgba(51,77,255,.25)}
.sb-name{font-family:var(--fh);font-weight:900;font-size:18px;color:var(--ink);letter-spacing:-.8px}
.sb-badge{font-size:9px;font-weight:900;padding:2px 8px;border-radius:6px;background:var(--ink);color:#fff;margin-top:2px;font-family:var(--fm);letter-spacing:1px;text-transform:uppercase;display:inline-block}
.sb-admin{margin:0 16px 24px;padding:16px;background:#fff;border:1px solid var(--b);border-radius:16px;display:flex;align-items:center;gap:12px;box-shadow:0 2px 8px rgba(0,0,0,.02)}
.sb-av-admin{width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,var(--acc),var(--acc2));flex-shrink:0;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(51,77,255,.15)}
.sb-section{padding:20px 24px 8px;font-size:10px;font-weight:900;letter-spacing:2px;text-transform:uppercase;color:var(--mu2)}
.sb-item{display:flex;align-items:center;gap:14px;padding:11px 16px;margin:3px 12px;border-radius:12px;cursor:pointer;font-size:14px;font-weight:700;color:var(--ink3);transition:all .2s;border:1px solid transparent}
.sb-item:hover{color:var(--ink);background:#f4f4f3}
.sb-item.on{color:var(--acc);background:rgba(51,77,255,.06);border-color:rgba(51,77,255,.08)}
.sb-item.on svg{color:var(--acc)}
.sb-count{margin-left:auto;font-size:10px;font-weight:800;padding:2px 8px;border-radius:8px;background:var(--ink);color:#fff;font-family:var(--fm)}
.sb-foot{padding:20px 16px;border-top:1px solid var(--b);margin-top:auto}
.sb-logout{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;padding:13px;border-radius:12px;background:#fff;border:1px solid var(--b);color:var(--ink3);font-family:var(--fb);font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 1px 3px rgba(0,0,0,.04)}
.sb-logout:hover{background:#fff;border-color:var(--red);color:var(--red);box-shadow:0 4px 12px rgba(239,68,68,.08)}

/* topbar */
.topbar{height:64px;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:0 32px;border-bottom:1px solid var(--b);background:#fff;z-index:10}
.tb-title{font-family:var(--fh);font-weight:900;font-size:18px;color:var(--ink);letter-spacing:-.5px}

/* buttons */
.btn-p{background:var(--ink);color:#fff;border:none;padding:10px 20px;border-radius:12px;font-family:var(--fh);font-weight:800;font-size:14px;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:8px}
.btn-p:hover{background:var(--ink2);transform:translateY(-1px);box-shadow:0 8px 16px rgba(0,0,0,.12)}
.btn-p:active{transform:translateY(0)}
.btn-p:disabled{opacity:.4;cursor:not-allowed;transform:none}
.btn-p.acc{background:var(--acc)}.btn-p.acc:hover{background:var(--acc2);box-shadow:0 8px 20px rgba(51,77,255,.2)}
.btn-p.sm{padding:8px 16px;font-size:13px;border-radius:10px}
.btn-g{background:#fff;color:var(--ink3);border:1px solid var(--b);padding:8px 16px;border-radius:10px;font-family:var(--fb);font-weight:700;font-size:13px;cursor:pointer;transition:all .15s;display:inline-flex;align-items:center;gap:8px;box-shadow:0 1px 2px rgba(0,0,0,.02)}
.btn-g:hover{color:var(--ink);border-color:var(--b2);background:#fff;box-shadow:0 4px 8px rgba(0,0,0,.04)}
.btn-red{background:rgba(239,68,68,.05);color:var(--red);border:1px solid rgba(239,68,68,.1);padding:8px 14px;border-radius:10px;font-family:var(--fb);font-weight:700;font-size:13px;cursor:pointer;transition:all .15s;display:inline-flex;align-items:center;gap:6px}
.btn-red:hover{background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.2)}

/* stat */
.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
.stat-card{background:#fff;border:1px solid var(--b);border-radius:20px;padding:24px;transition:all .3s cubic-bezier(0.4, 0, 0.2, 1);position:relative;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.02)}
.stat-card:hover{border-color:var(--acc2);box-shadow:0 12px 30px rgba(51,77,255,.08);transform:translateY(-2px)}
.stat-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px}
.stat-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:var(--bg)}
.delta-up{background:rgba(16,185,129,.1);color:var(--green);display:flex;align-items:center;gap:2px;font-size:11px;font-weight:800;padding:3px 10px;border-radius:99px}
.stat-num{font-family:var(--fh);font-size:36px;font-weight:900;color:var(--ink);line-height:1;letter-spacing:-1.8px}
.stat-lbl{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:var(--mu);margin-top:10px;font-family:var(--fm)}

/* table */
.tbl-wrap{background:#fff;border:1px solid var(--b);border-radius:24px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.02)}
.tbl-ctrl{padding:20px 24px;border-bottom:1px solid var(--b);display:flex;align-items:center;gap:16px;flex-wrap:wrap;background:#fafafa}
.srch{display:flex;align-items:center;gap:10px;padding:10px 16px;background:#fff;border:1px solid var(--b);border-radius:12px;flex:1;min-width:260px;max-width:340px;transition:all .2s;box-shadow:0 1px 2px rgba(0,0,0,.02)}
.srch:focus-within{border-color:var(--acc);box-shadow:0 0 0 4px rgba(51,77,255,.08)}
.srch input{background:none;border:none;outline:none;font-family:var(--fb);font-size:14px;color:var(--ink);width:100%}
.srch input::placeholder{color:var(--mu2)}
.col-hd{display:flex;padding:12px 24px;background:#fcfcfc;border-bottom:1px solid var(--b)}
.col-h{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:var(--mu);font-family:var(--fm)}
.urow{display:flex;align-items:center;padding:14px 24px;border-bottom:1px solid var(--b);transition:all .15s ease}
.urow:last-child{border-bottom:none}
.urow:hover{background:#f9f9f8}
.av{width:36px;height:36px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-family:var(--fh);font-size:14px;font-weight:800;color:#fff;flex-shrink:0;box-shadow:0 2px 6px rgba(0,0,0,.05)}

/* pills */
.plan-pill{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:99px;font-size:11px;font-weight:800;font-family:var(--fm);text-transform:uppercase;letter-spacing:0.5px}
.pp-free{background:#F1F1EF;color:var(--ink3);border:1px solid var(--b2)}
.pp-pro{background:#FFFBEB;color:var(--amber);border:1px solid rgba(245,158,11,.2)}
.pp-business{background:#EFF6FF;color:var(--blue);border:1px solid rgba(59,130,246,.2)}
.sp{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:99px;font-size:11px;font-weight:800;font-family:var(--fm);text-transform:uppercase;letter-spacing:0.5px}
.sp-a{background:#ECFDF5;color:var(--green);border:1px solid rgba(16,185,129,.2)}
.sp-b{background:#FEF2F2;color:var(--red);border:1px solid rgba(239,68,68,.2)}
.sp-p{background:#FFFBEB;color:var(--amber);border:1px solid rgba(245,158,11,.2)}
.sp-c{background:#F1F1EF;color:var(--mu);border:1px solid var(--b2)}

/* modal */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);z-index:300;display:flex;align-items:center;justify-content:center;padding:24px}
.modal{background:#fff;border:1px solid var(--b);border-radius:28px;width:100%;max-width:540px;box-shadow:0 30px 90px rgba(0,0,0,.25);overflow:hidden}
.modal-head{padding:24px 32px;border-bottom:1px solid var(--b);display:flex;align-items:center;justify-content:space-between}
.modal-body{padding:32px;max-height:75vh;overflow-y:auto}
.modal-foot{padding:20px 32px;border-top:1px solid var(--b);display:flex;justify-content:flex-end;gap:12px;background:#fafafa}

/* inp */
.inp{width:100%;background:#fff;border:1px solid var(--b);border-radius:12px;padding:12px 16px;color:var(--ink);font-family:var(--fb);font-size:14px;outline:none;transition:all .2s;box-shadow:0 1px 2px rgba(0,0,0,.02)}
.inp:focus{border-color:var(--acc);box-shadow:0 0 0 4px rgba(51,77,255,.08)}
.inp::placeholder{color:var(--mu2)}
textarea.inp{resize:vertical;min-height:100px;line-height:1.6}
.ilbl{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1.8px;color:var(--mu);margin-bottom:8px;font-family:var(--fm);display:flex;align-items:center;gap:6px}

/* tabs */
.tabs{display:flex;gap:4px;padding:4px;background:#f1f1ef;border-radius:12px}
.tab{padding:8px 16px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:700;color:var(--mu);transition:all .2s;white-space:nowrap}
.tab.on{background:#fff;color:var(--ink);box-shadow:0 2px 6px rgba(0,0,0,.06)}

/* login */
.login-bg{position:fixed;inset:0;background:#fafafa;display:flex;align-items:center;justify-content:center;z-index:500;background-image:radial-gradient(circle at 2px 2px, rgba(0,0,0,0.03) 1px, transparent 0);background-size:32px 32px}
.login-card{width:460px;background:#fff;border:1px solid rgba(0,0,0,0.06);border-radius:32px;padding:56px;box-shadow:0 30px 100px rgba(0,0,0,.08)}

.fi{animation:fi .4s cubic-bezier(0.16, 1, 0.3, 1) both}
@keyframes fi{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}

.rev-bars{display:flex;align-items:flex-end;gap:12px;height:160px;margin-top:20px}
.rev-bar{width:100%;border-radius:8px 8px 4px 4px;transition:all .6s cubic-bezier(0.34, 1.56, 0.64, 1);cursor:pointer}
.rev-bar:hover{filter:brightness(1.1);transform:scaleX(1.05)}
.rev-bar.hi{background:var(--acc);box-shadow:0 10px 25px rgba(51,77,255,0.25)}

.inp-wrap{position:relative;margin-bottom:16px}
.inp-icon{position:absolute;left:16px;top:50%;transform:translateY(-50%);color:var(--mu2);pointer-events:none;z-index:2}
.inp-wrap .inp{padding-left:44px}
.eye-btn{position:absolute;right:16px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--mu2);display:flex;padding:4px;z-index:2;transition:all .2s}
.eye-btn:hover{color:var(--ink)}
.err-box{background:#FEF2F2;border:1px solid #FEE2E2;border-radius:12px;padding:12px 16px;color:var(--red);font-size:13px;display:flex;align-items:center;gap:10px;margin-bottom:20px;font-weight:700}
`;

/* ─── utils ─── */
const AV_COLORS = ['#C8410A', '#1D4ED8', '#1A6B3E', '#7C3AED', '#B45309', '#0E7490', '#BE185D'];
const avCol = name => AV_COLORS[name ? name.charCodeAt(0) % AV_COLORS.length : 0];

const PLANS_DEF = [
  { id: 'free', name: 'Free', price: 0, dms: 100, color: 'var(--mu)', features: ['100 DMs/month', '1 automation', 'Basic support'] },
  { id: 'pro', name: 'Pro', price: 499, dms: 5000, color: 'var(--amber)', features: ['5,000 DMs/month', '10 automations', 'Analytics', 'Priority support'] },
  { id: 'business', name: 'Business', price: 1499, dms: 50000, color: 'var(--blue)', features: ['50,000 DMs/month', 'Unlimited automations', 'Full analytics', 'Dedicated support', 'Custom branding'] },
];

/* ─── dynamic helpers ─── */

const getMonthlyRevenue = (orders) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const last8 = [];
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    last8.push({ m: months[d.getMonth()], v: 0, p: 0, hi: false });
  }
  
  orders.forEach(o => {
    const d = new Date(o.createdAt);
    const m = months[d.getMonth()];
    const item = last8.find(x => x.m === m);
    if (item) {
      const amt = Number(o.amount) || 0;
      if (o.status === 'completed' || o.status === 'success') item.v += amt;
      else if (o.status === 'pending' || o.status === 'processing') item.p += amt;
    }
  });
  
  if (last8.length > 0) last8[last8.length - 1].hi = true;
  return last8;
};

const getRecentActivity = (users, orders) => {
  const act = [];
  users.slice(0, 4).forEach(u => {
    act.push({ text: `New signup: ${u.name} (${u.plan})`, time: u.joined || 'Recent', color: 'var(--green)' });
  });
  orders.slice(0, 4).forEach(o => {
    act.push({ 
      text: `Payment ${o.status}: ₹${o.amount} (${o.userName || o.userEmail})`, 
      time: new Date(o.createdAt).toLocaleDateString(), 
      color: o.status === 'completed' || o.status === 'success' ? 'var(--green)' : o.status === 'failed' ? 'var(--red)' : 'var(--amber)' 
    });
  });
  return act.sort((a, b) => b.time.localeCompare(a.time)).slice(0, 6);
};


/* ─── pill helpers ─── */
const PlanPill = ({ plan }) => (
  <span className={`plan-pill pp-${plan}`}>
    {plan === 'pro' && <Crown size={9} />}{plan === 'business' && <Star size={9} />}
    {plan.charAt(0).toUpperCase() + plan.slice(1)}
  </span>
);
const StatusPill = ({ status }) => (
  <span className={`sp ${status === 'active' ? 'sp-a' : status === 'banned' ? 'sp-b' : 'sp-p'}`}>
    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

const exportToCSV = (data, type) => {
  if (!data || !data.length) {
    alert("No data to export");
    return;
  }
  
  let headers = [];
  let rows = [];

  if (type === 'orders') {
    headers = ['Date', 'Order ID', 'Customer', 'Email', 'Amount', 'Currency', 'Status', 'Payment ID'];
    rows = data.map(o => [
      new Date(o.createdAt).toLocaleDateString('en-IN'),
      o.orderId,
      o.billedName || o.userName || 'Unknown',
      o.userEmail,
      o.amount,
      o.currency || 'INR',
      o.status,
      o.paymentId || 'N/A'
    ]);
  } else if (type === 'users') {
    headers = ['Name', 'Email', 'Plan', 'Status', 'DMs Used', 'DM Limit', 'Revenue', 'Joined'];
    rows = data.map(u => [
      u.name,
      u.email,
      u.plan,
      u.status,
      u.dmsUsed,
      u.dmsLimit + u.creditBonus,
      u.rev,
      u.joined
    ]);
  }

  const content = [headers, ...rows].map(row => 
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n');

  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${type}_export_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/* ─────────── USER MODAL ─────────── */
function UserModal({ user, onClose, onSave, onDelete }) {
  const [u, setU] = useState({ ...user });
  const [tab, setTab] = useState('overview');
  const [cr, setCr] = useState('');

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal fi" onClick={e => e.stopPropagation()}>

        {/* head */}
        <div className="modal-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div className="av" style={{ width: 36, height: 36, background: avCol(u.name), fontSize: 14 }}>{u.name[0]}</div>
            <div>
              <div style={{ fontFamily: 'var(--fh)', fontWeight: 700, fontSize: '15px', color: 'var(--ink)', letterSpacing: '-.2px' }}>{u.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--mu)', fontFamily: 'var(--fm)' }}>{u.email}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mu)', display: 'flex', padding: 4 }}><X size={16} /></button>
        </div>

        {/* sub-head: tabs + ban */}
        <div style={{ padding: '11px 20px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="tabs">
            {['Overview', 'Credits', 'Plan'].map(t => (
              <div key={t} className={`tab ${tab === t.toLowerCase() ? 'on' : ''}`} onClick={() => setTab(t.toLowerCase())}>{t}</div>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="btn-red" onClick={() => onDelete(u)} title="Permanently delete user account and data">
              <Trash2 size={11} /> Delete User
            </button>
            {u.status !== 'banned'
              ? <button className="btn-red" onClick={() => setU(p => ({ ...p, status: 'banned' }))}><Ban size={11} /> Ban User</button>
              : <button className="btn-grn" onClick={() => setU(p => ({ ...p, status: 'active' }))}><CheckCircle size={11} /> Unban</button>
            }
          </div>
        </div>

        <div className="modal-body">

          {/* Overview */}
          {tab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {[
                  { l: 'Plan', v: <PlanPill plan={u.plan} /> },
                  { l: 'Status', v: <StatusPill status={u.status} /> },
                  { l: 'Joined', v: <span style={{ fontFamily: 'var(--fm)', fontSize: '13px' }}>{u.joined}</span> },
                  { l: 'DMs Used', v: <span style={{ fontFamily: 'var(--fm)', fontSize: '13px', fontWeight: 600 }}>{u.dmsUsed.toLocaleString()}<span style={{ color: 'var(--mu)' }}>/{(u.dmsLimit + u.creditBonus).toLocaleString()}</span></span> },
                  { l: 'Automations', v: <span style={{ fontFamily: 'var(--fm)', fontSize: '13px', fontWeight: 600 }}>{u.autos}</span> },
                  { l: 'Revenue', v: <span style={{ fontFamily: 'var(--fm)', fontSize: '13px', fontWeight: 600, color: 'var(--green)' }}>₹{u.rev}</span> },
                ].map(f => (
                  <div key={f.l} style={{ background: 'var(--bg)', border: '1px solid var(--b)', borderRadius: 9, padding: '10px 12px' }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--mu)', fontFamily: 'var(--fm)', marginBottom: 6 }}>{f.l}</div>
                    {f.v}
                  </div>
                ))}
              </div>
              <div style={{ background: 'var(--bg)', border: '1px solid var(--b)', borderRadius: 9, padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: '12px', color: 'var(--mu)' }}>
                  <span>DM usage this month</span>
                  <span style={{ fontFamily: 'var(--fm)', fontWeight: 700, color: u.dmsUsed / (u.dmsLimit + u.creditBonus) > .9 ? 'var(--red)' : 'var(--ink)' }}>
                    {Math.round(u.dmsUsed / (u.dmsLimit + u.creditBonus) * 100)}%
                  </span>
                </div>
                <div style={{ height: 7, background: 'var(--b)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 99, background: u.dmsUsed / (u.dmsLimit + u.creditBonus) > .9 ? 'var(--red)' : 'var(--ink)', width: `${Math.min(Math.round(u.dmsUsed / (u.dmsLimit + u.creditBonus) * 100), 100)}%`, transition: 'width .6s' }} />
                </div>
                {u.creditBonus > 0 && <div style={{ fontSize: '11px', color: 'var(--green)', marginTop: 6, fontFamily: 'var(--fm)', fontWeight: 600 }}>+{u.creditBonus.toLocaleString()} bonus credits added</div>}
              </div>
            </div>
          )}

          {/* Credits */}
          {tab === 'credits' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ padding: '12px 14px', background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 9, display: 'flex', gap: 9, fontSize: '12.5px', color: '#0369A1', lineHeight: 1.6 }}>
                <Activity size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                Add bonus DM credits on top of the user's plan limit. Great for rewards, refunds, or special cases.
              </div>
              <div style={{ background: 'var(--bg)', border: '1px solid var(--b)', borderRadius: 9, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '12px', color: 'var(--mu)' }}>Current DM Limit</div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>{(u.dmsLimit + u.creditBonus).toLocaleString()} DMs</div>
              </div>
              <div>
                <div className="ilbl"><Gift size={9} /> Add Bonus Credits (DMs)</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="inp" type="number" value={cr} onChange={e => setCr(e.target.value)} placeholder="e.g. 500" style={{ flex: 1 }} />
                  <button className="btn-p sm acc" onClick={() => { if (cr > 0) { setU(p => ({ ...p, creditBonus: p.creditBonus + Number(cr) })); setCr(''); } }}>
                    <Plus size={12} /> Add
                  </button>
                </div>
              </div>
              <div>
                <div className="ilbl">Quick Add</div>
                <div style={{ display: 'flex', gap: 7 }}>
                  {[100, 500, 1000, 5000].map(n => (
                    <button key={n} className="btn-g" style={{ flex: 1, justifyContent: 'center', fontSize: '12px' }}
                      onClick={() => setU(p => ({ ...p, creditBonus: p.creditBonus + n }))}>+{n}</button>
                  ))}
                </div>
              </div>
              {u.creditBonus > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#ECFDF5', border: '1px solid rgba(26,107,62,.15)', borderRadius: 9 }}>
                  <span style={{ fontSize: '12.5px', color: 'var(--green)', fontWeight: 600 }}>Total bonus credits: +{u.creditBonus.toLocaleString()} DMs</span>
                  <button className="btn-red" style={{ padding: '4px 9px', fontSize: '11px' }} onClick={() => setU(p => ({ ...p, creditBonus: 0 }))}><X size={10} /> Reset</button>
                </div>
              )}
            </div>
          )}

          {/* Plan */}
          {tab === 'plan' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <div style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: 4 }}>Override user's plan directly (use for manual upgrades or comps)</div>
              {PLANS_DEF.map(pl => (
                <div key={pl.id} className={`plan-card ${u.plan === pl.id ? 'sel' : ''}`}
                  onClick={() => setU(p => ({ ...p, plan: pl.id, dmsLimit: pl.dms }))}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--fh)', fontWeight: 700, fontSize: '14px', color: 'var(--ink)', marginBottom: 3 }}>{pl.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--mu)' }}>{pl.dms.toLocaleString()} DMs/month</div>
                    </div>
                    <div style={{ fontFamily: 'var(--fh)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-1px' }}>
                      {pl.price === 0 ? 'Free' : '₹' + pl.price}
                      {pl.price > 0 && <span style={{ fontSize: '12px', color: 'var(--mu)', fontWeight: 400, fontFamily: 'var(--fb)' }}>/mo</span>}
                    </div>
                  </div>
                  {u.plan === pl.id && (
                    <div style={{ position: 'absolute', top: 10, right: 10, width: 18, height: 18, borderRadius: '50%', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle size={10} color="#fff" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>

        <div className="modal-foot">
          <button className="btn-g" onClick={onClose}>Cancel</button>
          <button className="btn-p sm acc" onClick={() => onSave(u)}><CheckCircle size={12} /> Save Changes</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── ORDER DETAIL MODAL ─────────── */
function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  const getStatusConfig = (status) => {
    const s = status?.toLowerCase();
    if (s === 'completed' || s === 'success') return { 
      bg: '#ECFDF5', 
      color: '#059669', 
      label: 'Completed' 
    };
    if (s === 'failed') return { 
      bg: '#FEF2F2', 
      color: '#DC2626', 
      label: 'Failed' 
    };
    if (s === 'cancelled') return { 
      bg: '#FFF1F2', 
      color: '#E11D48', 
      label: 'Cancelled' 
    };
    return { 
      bg: '#FFFBEB', 
      color: '#D97706', 
      label: 'Pending' 
    };
  };

  const status = getStatusConfig(order.status);

  return (
    <div className="modal-bg" onClick={onClose} style={{ backdropFilter: 'blur(12px)', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="modal fi" style={{ maxWidth: 640, maxHeight: '85vh', borderRadius: 32, border: '1px solid var(--b)', boxShadow: '0 40px 120px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }} onClick={e => e.stopPropagation()}>
        
        {/* Header - Fixed */}
        <div style={{ padding: '28px 36px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px', color: 'var(--ink)' }}>Order Details</h3>
              <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '1px', margin: '4px 0 0', opacity: 0.8 }}>{order.orderId}</p>
            </div>
            <span style={{ 
              fontSize: '11px', 
              padding: '6px 14px', 
              borderRadius: 100, 
              fontWeight: 800, 
              background: status.bg,
              color: status.color,
              display: 'inline-flex',
              alignItems: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block', marginRight: 8 }} />
              {status.label}
            </span>
          </div>
          <button onClick={onClose} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg2)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ink)' }}>
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{ padding: '36px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 40 }} className="custom-scrollbar">
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40 }}>
            {/* Customer Section */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--acc10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserSquare size={18} color="var(--acc)" />
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--ink)' }}>Customer Info</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { l: 'Full Name', v: order.billedName || order.userName },
                  { l: 'Email Address', v: order.userEmail },
                  { l: 'Phone Number', v: order.billedPhone },
                  { l: 'Country / Region', v: order.billedCountry || order.billed_country },
                  { l: 'State / Province', v: order.billedState || order.billed_state },
                ].map(f => (
                  <div key={f.l}>
                    <div style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>{f.l}</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', lineHeight: '1.5' }}>{f.v || '—'}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Section */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--acc10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={18} color="var(--acc)" />
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--ink)' }}>Payment Info</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { l: 'Total Amount', v: `₹${order.amount}`, b: true },
                  { l: 'Currency', v: (order.currency || 'INR').toUpperCase() },
                  { l: 'Razorpay ID', v: order.orderId, mono: true },
                  { l: 'Payment Ref', v: order.paymentId, mono: true },
                  { l: 'Order Date', v: new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                ].map(f => (
                  <div key={f.l}>
                    <div style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>{f.l}</div>
                    <div style={{ 
                      fontSize: f.b ? '24px' : '14px', 
                      fontWeight: f.b ? 900 : 600, 
                      color: f.b ? 'var(--acc)' : 'var(--ink)', 
                      fontFamily: f.mono ? 'var(--fb)' : 'inherit'
                    }}>{f.v || '—'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div style={{ height: 10, flexShrink: 0 }} />
        </div>

        {/* Footer - Fixed */}
        <div style={{ padding: '20px 36px', borderTop: '1px solid var(--b)', display: 'flex', justifyContent: 'flex-end', background: 'var(--bg2)', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, flexShrink: 0 }}>
          <button 
            className="btn-p" 
            onClick={onClose}
            style={{ padding: '12px 40px', borderRadius: 14, fontWeight: 900, fontSize: '14px', boxShadow: '0 8px 24px var(--p20)' }}
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── OVERVIEW ─────────── */
function Overview({ users, totalReg, orders, onMenuToggle }) {
  const totalRev = orders.filter(o => o.status === 'completed' || o.status === 'success').reduce((s, o) => s + Number(o.amount), 0);
  const paid = users.filter(u => u.plan !== 'free').length;
  
  const revData = getMonthlyRevenue(orders);
  const maxRev = Math.max(...revData.map(d => d.v), 1000);
  const activities = getRecentActivity(users, orders);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className="tb-menu" onClick={onMenuToggle}><Menu size={20} /></button>
          <div className="tb-title">Dashboard Overview</div>
        </div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--mu)', fontFamily: 'var(--fb)', background: 'var(--bg)', padding: '6px 14px', borderRadius: 10 }}>
          {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>
      <div className="scroll"><div style={{ padding: '32px', maxWidth: 1400, width: '100%', margin: '0 auto' }}>

        <div className="stat-grid">
          {[
            { l: 'Total Revenue', v: '₹' + totalRev.toLocaleString(), d: '+27%', I: DollarSign, c: 'var(--green)' },
            { l: 'Total Profiles', v: users.length, d: '+4', I: Users, c: 'var(--acc)' },
            { l: 'Total Registered', v: totalReg, d: '+12%', I: UserPlus, c: 'var(--blue)' },
            { l: 'Paid Users', v: paid, d: '+2', I: Crown, c: 'var(--amber)' },
          ].map(s => (
            <div key={s.l} className="stat-card fi">
              <div className="stat-top">
                <div className="stat-icon" style={{ color: s.c, background: `${s.c}10` }}>
                  <s.I size={18} strokeWidth={2.5} />
                </div>
                <span className="delta-up"><TrendingUp size={12} />{s.d}</span>
              </div>
              <div className="stat-num">{s.v}</div>
              <div className="stat-lbl">{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 20, alignItems: 'start' }}>
          <div style={{ background: '#fff', border: '1px solid var(--b)', borderRadius: 24, padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--mu)', fontFamily: 'var(--fb)', marginBottom: 8 }}>Revenue Analytics</div>
                <div style={{ fontFamily: 'var(--fh)', fontSize: '32px', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-1.5px', lineHeight: 1 }}>₹{revData[revData.length - 1].v.toLocaleString()}</div>
                <div style={{ fontSize: '13px', color: 'var(--green)', fontWeight: 700, marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--green)20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowUpRight size={12} /></div>
                  +27% from last month
                </div>
              </div>
              <div style={{ padding: '8px 16px', background: 'var(--bg)', borderRadius: 12, fontSize: '12px', fontWeight: 700, color: 'var(--mu2)' }}>Last 8 Months</div>
            </div>
            
            <div className="rev-bars">
              {revData.map((d, i) => {
                const total = d.v + d.p;
                const vPct = total > 0 ? (d.v / maxRev * 100) : 0;
                const pPct = total > 0 ? (d.p / maxRev * 100) : 0;
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                      {/* Pending Part */}
                      <div className="rev-bar" 
                        style={{ 
                          height: `${Math.max(pPct, d.p > 0 ? 5 : 0)}%`, 
                          background: 'var(--amber)', 
                          opacity: 0.4,
                          borderRadius: d.v > 0 ? '0' : '8px 8px 4px 4px',
                          marginBottom: -2
                        }} 
                        title={`Pending: ₹${d.p}`} />
                      {/* Success Part */}
                      <div className={`rev-bar ${d.hi ? 'hi' : ''}`}
                        style={{ 
                          height: `${Math.max(vPct, d.v > 0 ? 5 : 0)}%`,
                          background: d.hi ? 'var(--acc)' : (d.v > 0 ? 'var(--mu2)' : 'var(--mu2)15')
                        }}
                        title={`Success: ₹${d.v}`} />
                      
                      {/* Fallback line if both are 0 */}
                      {total === 0 && <div style={{ height: 2, background: 'var(--mu2)10', width: '100%', borderRadius: 2 }} />}
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '10px', fontFamily: 'var(--fb)', color: d.hi ? 'var(--acc)' : 'var(--mu2)', fontWeight: 800, textTransform: 'uppercase', marginTop: 8 }}>{d.m}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--b)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.02)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--b)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--mu)', fontFamily: 'var(--fb)' }}>Live Activity</div>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 10px var(--green)' }} />
            </div>
            <div style={{ padding: '8px 24px', overflowY: 'auto', flex: 1 }}>
              {activities.length === 0 ? (
                 <div style={{ padding: '60px 10px', textAlign: 'center', color: 'var(--mu2)', fontSize: '13px', fontWeight: 600 }}>No recent activity</div>
              ) : activities.map((a, i) => (
                <div key={i} className="af-row" style={{ padding: '16px 0', gap: 14 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '4px', background: a.color, flexShrink: 0, marginTop: 4, boxShadow: `0 0 8px ${a.color}40` }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13.5px', color: 'var(--ink2)', lineHeight: 1.5, fontWeight: 600 }}>{a.text}</div>
                    <div style={{ fontSize: '11px', color: 'var(--mu2)', fontFamily: 'var(--fb)', marginTop: 4, fontWeight: 700 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '16px 24px', background: 'var(--bg)', borderTop: '1px solid var(--b)', textAlign: 'center' }}>
              <button className="btn-g" style={{ width: '100%', justifyContent: 'center', fontSize: '12px' }}>View Full Logs</button>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--b)', borderRadius: 24, padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--mu)', fontFamily: 'var(--fm)' }}>Plan Distribution</div>
            <div className="tabs">
              <div className="tab on">Active Users</div>
              <div className="tab">Revenue</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {PLANS_DEF.map(pl => {
              const count = users.filter(u => u.plan === pl.id).length;
              const rev = users.filter(u => u.plan === pl.id).reduce((s, u) => s + u.rev, 0);
              return (
                <div key={pl.id} style={{ padding: '24px', background: 'var(--bg)', border: '1px solid var(--b)', borderRadius: 20, transition: 'all .2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <PlanPill plan={pl.id} />
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--mu)', textTransform: 'uppercase', marginBottom: 2 }}>Revenue</div>
                      <div style={{ fontFamily: 'var(--fm)', fontSize: '14px', fontWeight: 800, color: rev > 0 ? 'var(--green)' : 'var(--mu2)' }}>₹{rev.toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--fh)', fontSize: '42px', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-2px', lineHeight: 1 }}>{count}</div>
                  <div style={{ fontSize: '12px', color: 'var(--mu)', marginTop: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Subscribers</div>
                </div>
              );
            })}
          </div>
        </div>

      </div></div>
    </div>
  );
}

/* ─────────── USERS ─────────── */
function UsersView({ users, onManage, onMenuToggle }) {
  const [search, setSearch] = useState('');
  const [flt, setFlt] = useState('all');
  const FLTS = [{ id: 'all', l: 'All Users' }, { id: 'pro', l: 'Pro' }, { id: 'business', l: 'Business' }, { id: 'free', l: 'Free' }, { id: 'banned', l: 'Banned' }];

  const filtered = users.filter(u => {
    const ms = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const mf = flt === 'all' || u.plan === flt || u.status === flt;
    return ms && mf;
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className="tb-menu" onClick={onMenuToggle}><Menu size={20} /></button>
          <div className="tb-title">User Management <span style={{ fontFamily: 'var(--fm)', fontSize: '13px', color: 'var(--mu2)', fontWeight: 700 }}>({users.length})</span></div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-g" onClick={() => exportToCSV(users, 'users')}><Download size={14} /> Export CSV</button>
          <button className="btn-p sm acc"><UserPlus size={14} /> Invite User</button>
        </div>
      </div>
      <div className="scroll"><div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>
        <div className="tbl-wrap" style={{ borderRadius: 28 }}>
          <div className="tbl-ctrl" style={{ padding: '24px', gap: 20 }}>
            <div className="srch" style={{ maxWidth: 360 }}><Search size={16} color="var(--mu)" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users by name, email..." /></div>
            <div className="tabs" style={{ marginLeft: 'auto' }}>
              {FLTS.map(f => <div key={f.id} className={`tab ${flt === f.id ? 'on' : ''}`} onClick={() => setFlt(f.id)}>{f.l}</div>)}
            </div>
          </div>

          <div className="col-hd" style={{ padding: '16px 32px', background: '#fafafa' }}>
            <div key="user" style={{ flex: 2, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--mu)', fontFamily: 'var(--fm)' }}>User</div>
            <div key="plan" style={{ flex: 1, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--mu)', fontFamily: 'var(--fm)' }}>Plan</div>
            <div key="status" style={{ flex: 1, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--mu)', fontFamily: 'var(--fm)' }}>Status</div>
            <div key="usage" style={{ flex: 1.2, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--mu)', fontFamily: 'var(--fm)' }}>DM Usage</div>
            <div key="rev" style={{ flex: 1, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--mu)', fontFamily: 'var(--fm)' }}>Revenue</div>
            <div key="action" style={{ width: 100 }}></div>
          </div>

          {filtered.length === 0
            ? <div style={{ padding: '100px 20px', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Users size={24} color="var(--mu2)" />
                </div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--ink2)' }}>No users found</div>
                <p style={{ fontSize: '13px', color: 'var(--mu)', marginTop: 4 }}>Try adjusting your search or filters</p>
              </div>
            : filtered.map(u => {
              const tot = u.dmsLimit + u.creditBonus;
              const pct = Math.min(Math.round(u.dmsUsed / tot * 100), 100);
              return (
                <div key={u.id} className="urow" style={{ padding: '20px 32px' }}>
                  <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, cursor: 'pointer' }} onClick={() => onManage(u)}>
                    <div className="av" style={{ background: avCol(u.name), width: 40, height: 40, borderRadius: 14 }}>{u.name?.[0] || 'U'}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--mu)', fontFamily: 'var(--fm)', fontWeight: 600 }}>{u.email}</div>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}><PlanPill plan={u.plan} /></div>
                  <div style={{ flex: 1 }}><StatusPill status={u.status} /></div>
                  <div style={{ flex: 1.2, paddingRight: 24 }}>
                    <div className="ubar" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ fontSize: '10px', fontFamily: 'var(--fm)', fontWeight: 800, color: 'var(--mu)' }}>{pct}% Used</div>
                        <div style={{ fontSize: '10px', fontFamily: 'var(--fm)', fontWeight: 800, color: pct > 90 ? 'var(--red)' : 'var(--ink)' }}>{u.dmsUsed.toLocaleString()}</div>
                      </div>
                      <div className="ubar-track" style={{ height: 6, background: '#f1f1ef' }}>
                        <div className="ubar-fill" style={{ width: `${pct}%`, background: pct > 90 ? 'var(--red)' : 'linear-gradient(90deg, var(--acc), var(--acc2))', boxShadow: pct > 10 ? '0 0 10px rgba(51,77,255,0.2)' : 'none' }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: 1, fontFamily: 'var(--fm)', fontSize: '14px', fontWeight: 800, color: u.rev > 0 ? 'var(--green)' : 'var(--mu2)' }}>{u.rev > 0 ? '₹' + u.rev.toLocaleString() : '—'}</div>
                  <div style={{ width: 100, display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn-g" style={{ padding: '8px 14px', borderRadius: 10 }} onClick={() => onManage(u)}><Settings size={14} /> Manage</button>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div></div>
    </div>
  );
}

/* ─────────── ORDERS ─────────── */
function OrdersView({ orders, orderError, loadingOrders, fetchOrders, onMenuToggle }) {
  const [search, setSearch] = useState('');
  const [selOrder, setSelOrder] = useState(null);
  
  const filtered = orders.filter(o => 
    o.orderId.toLowerCase().includes(search.toLowerCase()) || 
    o.userEmail?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {selOrder && <OrderDetailModal order={selOrder} onClose={() => setSelOrder(null)} />}

      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className="tb-menu" onClick={onMenuToggle}><Menu size={20} /></button>
          <div className="tb-title">Orders Management <span style={{ fontFamily: 'var(--fm)', fontSize: '13px', color: 'var(--mu2)', fontWeight: 700 }}>({orders.length})</span></div>
        </div>
        <button className="btn-g" onClick={() => exportToCSV(orders, 'orders')}><Download size={14} /> Export CSV</button>
      </div>
      <div className="scroll"><div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>
        
        <div className="tbl-wrap" style={{ borderRadius: 28 }}>
          <div className="tbl-ctrl" style={{ padding: '24px' }}>
            <div className="srch" style={{ maxWidth: 400 }}><Search size={16} color="var(--mu)" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by Order ID or Customer Email..." /></div>
            <div style={{ display: 'flex', gap: '12px', marginLeft: 'auto' }}>
              <button onClick={() => fetchOrders()} className="btn-g" style={{ borderRadius: 12 }}>
                <RefreshCw size={14} className={loadingOrders ? 'spin' : ''} /> {loadingOrders ? 'Syncing...' : 'Sync Orders'}
              </button>
            </div>
          </div>

          {orderError && (
            <div style={{ margin: '0 24px 24px', padding: '16px 20px', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '16px', color: '#B91C1C', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '12px' }} className="fi">
              <AlertTriangle size={18} strokeWidth={2.5} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, marginBottom: 2 }}>Payment Gateway Sync Error</div>
                <div style={{ fontSize: '12px', opacity: 0.8, fontWeight: 500 }}>{orderError}</div>
              </div>
            </div>
          )}

          <div className="col-hd" style={{ padding: '16px 32px', background: '#fafafa' }}>
            <div key="date" style={{ flex: 1, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--mu)', fontFamily: 'var(--fm)' }}>Date</div>
            <div key="id" style={{ flex: 1.5, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--mu)', fontFamily: 'var(--fm)' }}>Order ID</div>
            <div key="cust" style={{ flex: 2, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--mu)', fontFamily: 'var(--fm)' }}>Customer</div>
            <div key="amt" style={{ flex: 1, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--mu)', fontFamily: 'var(--fm)' }}>Amount</div>
            <div key="stat" style={{ flex: 1, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--mu)', fontFamily: 'var(--fm)' }}>Status</div>
            <div key="act" style={{ width: 50 }}></div>
          </div>

          {filtered.length === 0 
            ? <div style={{ padding: '100px 20px', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <ShoppingBag size={24} color="var(--mu2)" />
                </div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--ink2)' }}>No orders found</div>
                <p style={{ fontSize: '13px', color: 'var(--mu)', marginTop: 4 }}>Check back later or sync with Razorpay</p>
              </div>
            : filtered.map(o => (
              <div key={o.id} className="urow" style={{ padding: '20px 32px' }}>
                <div style={{ flex: 1, fontSize: '13px', color: 'var(--mu2)', fontFamily: 'var(--fm)', fontWeight: 700 }}>
                  {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </div>
                <div style={{ flex: 1.5, fontSize: '12px', fontWeight: 800, color: 'var(--ink2)', fontFamily: 'var(--fm)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 12 }}>{o.orderId}</div>
                <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="av" style={{ background: 'var(--bg)', color: 'var(--mu)', width: 32, height: 32, borderRadius: 10, fontSize: '11px', border: '1px solid var(--b)' }}>{o.billedName?.[0] || 'U'}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.billedName || o.userName || 'Customer'}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--mu)', fontFamily: 'var(--fm)', fontWeight: 600 }}>{o.userEmail}</div>
                  </div>
                </div>
                <div style={{ flex: 1, fontFamily: 'var(--fm)', fontSize: '14px', fontWeight: 900, color: 'var(--ink)' }}>₹{o.amount.toLocaleString()}</div>
                <div style={{ flex: 1 }}>
                  <span className={`sp ${o.status === 'completed' || o.status === 'success' ? 'sp-a' : o.status === 'failed' ? 'sp-b' : o.status === 'cancelled' ? 'sp-c' : 'sp-p'}`}>
                    {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                  </span>
                </div>
                <div style={{ width: 50, display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    title="View order details"
                    onClick={() => setSelOrder(o)}
                    className="btn-g"
                    style={{ padding: '8px', borderRadius: 10 }}
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            ))
          }
        </div>

      </div></div>
    </div>
  );
}

/* ─────────── PRICING ─────────── */
function PricingView({ pricing, onSave, onMenuToggle }) {
  const [p, setP] = useState({ ...pricing });
  const [load, setLoad] = useState(false);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className="tb-menu" onClick={onMenuToggle}><Menu size={20} /></button>
          <div className="tb-title">Subscription Pricing</div>
        </div>
        <button 
          className="btn-p sm acc" 
          style={{ borderRadius: 12, padding: '10px 20px' }}
          onClick={async () => { setLoad(true); await onSave(p); setLoad(false); }}
          disabled={load}
        >
          {load ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
          Update Pricing
        </button>
      </div>
      <div className="scroll"><div style={{ padding: '40px 32px', maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        <div className="fi" style={{ background: '#fff', border: '1px solid var(--b)', borderRadius: 24, padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div className="ilbl" style={{ marginBottom: 16, color: 'var(--acc)' }}><DollarSign size={14} /> Currency: Indian Rupee (₹)</div>
          <h3 style={{ fontFamily: 'var(--fh)', fontSize: '20px', fontWeight: 900, marginBottom: 8, letterSpacing: '-0.5px' }}>Platform Billing Rates</h3>
          <p style={{ color: 'var(--mu)', fontSize: '14px', marginBottom: 32, fontWeight: 500 }}>Adjust the subscription costs that users will see in their dashboard upgrade modals.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            <div>
              <div className="ilbl">Monthly Subscription</div>
              <div className="inp-wrap" style={{ marginBottom: 0 }}>
                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontWeight: 900, color: 'var(--mu2)', fontSize: '14px' }}>₹</span>
                <input className="inp" style={{ paddingLeft: 32, fontSize: '15px', fontWeight: 800 }} type="number" value={p.monthly} onChange={e => setP({ ...p, monthly: parseInt(e.target.value) })} />
              </div>
            </div>
            <div>
              <div className="ilbl">Yearly Sub (Effective Monthly)</div>
              <div className="inp-wrap" style={{ marginBottom: 0 }}>
                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontWeight: 900, color: 'var(--mu2)', fontSize: '14px' }}>₹</span>
                <input className="inp" style={{ paddingLeft: 32, fontSize: '15px', fontWeight: 800 }} type="number" value={p.yearly} onChange={e => setP({ ...p, yearly: parseInt(e.target.value) })} />
              </div>
            </div>
          </div>
          
          <div style={{ padding: '24px', background: 'var(--bg)', borderRadius: 16, border: '1px solid var(--b)' }}>
            <div className="ilbl">Total Annual Upfront Payment</div>
            <div className="inp-wrap" style={{ marginBottom: 12 }}>
              <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontWeight: 900, color: 'var(--mu2)', fontSize: '14px' }}>₹</span>
              <input className="inp" style={{ paddingLeft: 32, fontSize: '18px', fontWeight: 900, color: 'var(--acc)' }} type="number" value={p.totalYearly} onChange={e => setP({ ...p, totalYearly: parseInt(e.target.value) })} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'rgba(16,185,129,0.06)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.1)' }}>
              <Zap size={14} color="var(--green)" fill="var(--green)" />
              <span style={{ fontSize: '12px', color: 'var(--green)', fontWeight: 800, fontFamily: 'var(--fm)', textTransform: 'uppercase' }}>
                User Savings: ₹{(p.monthly * 12 - p.totalYearly).toLocaleString()} / year
              </span>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 24px', background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: 16, display: 'flex', gap: 14 }} className="fi">
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <TrendingUp size={16} color="var(--blue)" strokeWidth={2.5} />
          </div>
          <p style={{ fontSize: '13px', color: 'var(--blue)', lineHeight: 1.6, fontWeight: 600 }}>
            Pricing changes are applied globally and take effect for all new subscription attempts. Existing active subscriptions are not affected.
          </p>
        </div>

      </div></div>
    </div>
  );
}

/* ─────────── LOGIN ─────────── */
function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState('');

  const submit = async e => {
    e.preventDefault(); setLoad(true); setErr('');
    setTimeout(() => {
      const targetEmail = 'parthosamadder00@gmail.com';
      const targetPw = '0000';
      if (email.toLowerCase() === targetEmail && pw === targetPw) {
        onLogin();
      } else {
        setErr("Invalid credentials. Access denied.");
      }
      setLoad(false);
    }, 400);
  };

  return (
    <div className="login-bg">
      <div className="login-card fi">
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ 
            width: 56, height: 56, borderRadius: 18, background: 'var(--acc)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            margin: '0 auto 20px', boxShadow: '0 12px 24px rgba(51,77,255,0.2)' 
          }}>
            <Zap size={24} color="#fff" fill="#fff" />
          </div>
          <h1 style={{ fontFamily: 'var(--fh)', fontWeight: 800, fontSize: '26px', color: 'var(--ink)', letterSpacing: '-0.8px', marginBottom: 8 }}>Admin Access</h1>
          <p style={{ fontSize: '14px', color: 'var(--mu)', lineHeight: 1.5 }}>This area is strictly reserved for <strong>Partho Samadder</strong>.</p>
        </div>

        <form onSubmit={submit}>
          <div className="inp-wrap">
            <Mail className="inp-icon" size={16} />
            <input className="inp" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Admin Email" autoFocus />
          </div>
          <div className="inp-wrap" style={{ marginBottom: 24 }}>
            <Lock className="inp-icon" size={16} />
            <input className="inp" type={show ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} placeholder="Access Key" style={{ letterSpacing: pw && !show ? '4px' : 'normal' }} />
            <button type="button" className="eye-btn" onClick={() => setShow(p => !p)}>
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {err && <div className="err-box"><AlertTriangle size={14} style={{flexShrink:0}} /> {err}</div>}
          <button type="submit" className="btn-p" style={{ width: '100%', padding: '14px', justifyContent: 'center', borderRadius: 12, fontSize: '15px', background: 'var(--acc)', boxShadow: '0 8px 20px rgba(51,77,255,0.15)' }} disabled={load || !email || !pw}>
            {load ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'Enter Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─────────── ADMIN SETTINGS ─────────── */
function AdminSettings({ announcement, onSave, onMenuToggle }) {
  const [config, setConfig] = useState({ maintenance: false, signups: true, notifications: true });
  const [ann, setAnn] = useState(announcement || { enabled: false, text: '', type: 'update' });
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { if (announcement) setAnn(announcement); }, [announcement]);

  const onLocalSave = async () => {
    setIsSaving(true); setError(null);
    try { await onSave(ann, config); setShowSaved(true); setTimeout(() => setShowSaved(false), 3000); }
    catch (e) { setError("Failed to save settings."); }
    setIsSaving(false);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className="tb-menu" onClick={onMenuToggle}><Menu size={20} /></button>
          <div className="tb-title">Global Configuration</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {error && <div style={{ color: 'var(--red)', fontSize: '13px', fontWeight: 800 }}>⚠ {error}</div>}
          {showSaved && <div style={{ color: 'var(--green)', fontSize: '13px', fontWeight: 800 }}>✓ Changes Applied</div>}
          <button className="btn-p sm acc" style={{ borderRadius: 12, padding: '10px 20px' }} onClick={onLocalSave} disabled={isSaving}>
            {isSaving ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
            {isSaving ? ' Applying...' : ' Save All Changes'}
          </button>
        </div>
      </div>
      <div className="scroll">
        <div style={{ padding: '40px 32px', maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: '#fff', border: '1px solid var(--b)', borderRadius: 24, padding: '32px' }} className="fi">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
               <div>
                  <h3 style={{ fontFamily: 'var(--fh)', fontSize: '20px', fontWeight: 900, marginBottom: 6 }}>Announcement System</h3>
                  <p style={{ color: 'var(--mu)', fontSize: '14px' }}>Broadcast messages to users instantly.</p>
               </div>
               <div onClick={() => setAnn({ ...ann, enabled: !ann.enabled })} style={{ width: 50, height: 26, borderRadius: 22, background: ann.enabled ? 'var(--acc)' : 'var(--b2)', position: 'relative', cursor: 'pointer', transition: 'all .3s' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: ann.enabled ? 27 : 3, transition: 'all .3s' }} />
               </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <div className="ilbl">Broadcast Message</div>
                <textarea className="inp" style={{ minHeight: 120 }} value={ann.text} onChange={e => setAnn({ ...ann, text: e.target.value })} placeholder="e.g. New features added..." />
              </div>
              <div>
                <div className="ilbl">Alert Visual Style</div>
                <div className="tabs" style={{ padding: 6 }}>
                   {['update', 'warning', 'info'].map(t => (
                     <button key={t} className={`tab ${ann.type === t ? 'on' : ''}`} style={{ flex: 1, textTransform: 'capitalize', fontWeight: 800 }} onClick={() => setAnn({...ann, type: t})}>{t}</button>
                   ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--b)', borderRadius: 24, padding: '32px' }} className="fi">
            <h3 style={{ fontFamily: 'var(--fh)', fontSize: '20px', fontWeight: 900, marginBottom: 24 }}>System Controls</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { id: 'maintenance', l: 'Production Maintenance', d: 'Redirect users to maintenance page.', val: config.maintenance, icon: Power },
                { id: 'signups', l: 'Public Registrations', d: 'Allow new accounts.', val: config.signups, icon: UserPlus },
                { id: 'notifications', l: 'Email Automation', d: 'Send transactional emails.', val: config.notifications, icon: Bell },
              ].map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'var(--bg)', border: '1px solid var(--b)', borderRadius: 16 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fff', border: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><item.icon size={18} /></div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 800 }}>{item.l}</div>
                      <div style={{ fontSize: '12px', color: 'var(--mu)' }}>{item.d}</div>
                    </div>
                  </div>
                  <div onClick={() => setConfig({ ...config, [item.id]: !item.val })} style={{ width: 44, height: 24, borderRadius: 22, background: item.val ? 'var(--acc)' : 'var(--b2)', position: 'relative', cursor: 'pointer', transition: 'all .3s' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: item.val ? 23 : 3, transition: 'all .3s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────── DELETE MODAL ─────────── */
function DeleteConfirmModal({ user, onClose, onConfirm }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(false);
  const handleConfirm = () => { pw === '0000' ? onConfirm() : (setErr(true), setTimeout(() => setErr(false), 2000)); };
  return (
    <div className="modal-bg" onClick={onClose} style={{ backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.3)' }}>
      <div className="modal fi" onClick={e => e.stopPropagation()} style={{ maxWidth: 380, borderRadius: 24, padding: 8 }}>
        <div style={{ padding: '32px 24px 24px', textAlign: 'center' }}>
          <div style={{ width: 54, height: 54, borderRadius: 18, background: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#E11D48' }}>
            <Trash2 size={24} />
          </div>
          <h3 style={{ fontFamily: 'var(--fh)', fontSize: '20px', fontWeight: 800, marginBottom: 8 }}>Delete User?</h3>
          <p style={{ fontSize: '13.5px', color: 'var(--mu)', marginBottom: 28 }}>Permanently wipe <strong>{user.name || user.email}</strong>. This is irreversible.</p>
          <div style={{ textAlign: 'left' }}>
            <div className="ilbl">Verify Admin Access Key</div>
            <input className="inp" type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="••••" style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '8px', height: 54, borderRadius: 14, borderColor: err ? 'var(--red)' : 'var(--b2)' }} autoFocus />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '0 16px 16px' }}>
          <button className="btn-g" style={{ flex: 1, padding: '14px' }} onClick={onClose}>Cancel</button>
          <button className="btn-p" style={{ flex: 1, padding: '14px', background: '#E11D48' }} onClick={handleConfirm}>Confirm Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── REGISTRATIONS LIST ─────────── */
function RegistrationsList({ users, onDelete, onMenuToggle }) {
  const [search, setSearch] = useState('');
  const filtered = users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()) || (u.name && u.name.toLowerCase().includes(search.toLowerCase())));
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className="tb-menu" onClick={onMenuToggle}><Menu size={20} /></button>
          <div className="tb-title">Registrations <span style={{ fontFamily: 'var(--fm)', fontSize: '13px', color: 'var(--mu2)', fontWeight: 700 }}>({users.length})</span></div>
        </div>
      </div>
      <div className="scroll"><div style={{ padding: '32px', maxWidth: 1100, margin: '0 auto' }}>
        <div className="tbl-wrap" style={{ borderRadius: 28 }}>
          <div className="tbl-ctrl" style={{ padding: '24px' }}>
            <div className="srch" style={{ maxWidth: 400 }}><Search size={16} color="var(--mu)" /><input placeholder="Search registrations..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          </div>
          <div className="col-hd" style={{ padding: '16px 32px', background: '#fafafa' }}>
            <div style={{ width: 50, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--fm)', color: 'var(--mu)' }}>#</div>
            <div style={{ flex: 2.5, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--fm)', color: 'var(--mu)' }}>User</div>
            <div style={{ flex: 1.5, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--fm)', color: 'var(--mu)' }}>Joined</div>
            <div style={{ width: 120, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--fm)', color: 'var(--mu)' }}>Status</div>
            <div style={{ width: 50 }}></div>
          </div>
          {filtered.length === 0 ? (
            <div style={{ padding: '80px', textAlign: 'center', color: 'var(--mu)' }}>No matching registrations</div>
          ) : (
            filtered.map((u, i) => (
              <div key={u.id} className="urow" style={{ padding: '18px 32px' }}>
                <div style={{ width: 50, fontSize: '13px', color: 'var(--mu2)', fontFamily: 'var(--fm)', fontWeight: 700 }}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{ flex: 2.5, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="av" style={{ background: avCol(u.name || u.email), width: 42, height: 42, borderRadius: 14 }}>{u.name?.[0] || 'U'}</div>
                  <div>
                    <div style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--ink)' }}>{u.name || 'New User'}</div>
                    <div style={{ fontSize: '12px', color: 'var(--mu)', fontFamily: 'var(--fm)' }}>{u.email}</div>
                  </div>
                </div>
                <div style={{ flex: 1.5 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 700 }}>{u.joined || 'Recent'}</div>
                  <div style={{ fontSize: '10px', color: 'var(--mu2)', fontWeight: 800, textTransform: 'uppercase', marginTop: 3 }}>Direct Signup</div>
                </div>
                <div style={{ width: 120 }}><div className="sp sp-a">Verified</div></div>
                <div style={{ width: 50, display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn-red" style={{ padding: '8px', background: 'transparent', border: '1px solid var(--b)', borderRadius: 10 }} onClick={() => onDelete(u)} title="Remove Registration">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div></div>
    </div>
  );
}

/* ─────────── ROOT ─────────── */
export default function AdminApp() {
  const [authed, setAuthed] = useState(() => {
    if (typeof window !== 'undefined') {
      const isAuthed = sessionStorage.getItem('admin_authed') === 'true';
      const lastActive = sessionStorage.getItem('admin_last_active');
      if (isAuthed && lastActive && (Date.now() - parseInt(lastActive) < 600000)) return true;
      sessionStorage.removeItem('admin_authed');
    }
    return false;
  });

  useEffect(() => {
    if (authed) {
      sessionStorage.setItem('admin_last_active', Date.now().toString());
      const interval = setInterval(() => sessionStorage.setItem('admin_last_active', Date.now().toString()), 10000);
      return () => clearInterval(interval);
    }
  }, [authed]);

  const [view, setView] = useState('overview');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selUser, setSelUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [totalReg, setTotalReg] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [pricing, setPricing] = useState({ monthly: 499, yearly: 399, totalYearly: 4788 });
  const [announcement, setAnnouncement] = useState({ enabled: false, text: '', type: 'update' });

  useEffect(() => { if (authed) { fetchUsers(); fetchPricing(); fetchOrders(); } }, [authed]);

  const fetchPricing = async () => {
    try {
      const res = await fetch('/api/settings?global=true', { headers: { 'x-admin-auth': '0000' } });
      if (res.ok) { 
        const data = await res.json(); 
        if (data.settings?.pricing) setPricing(data.settings.pricing); 
        if (data.settings?.announcement) setAnnouncement(data.settings.announcement); 
      }
    } catch (e) {}
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/profiles', { headers: { 'x-admin-auth': '0000' } });
      if (res.ok) { 
        const { data, totalRegistered } = await res.json(); 
        if (data) setUsers(data); 
        if (totalRegistered !== undefined) setTotalReg(totalRegistered); 
      }
    } catch (e) {}
    setLoadingUsers(false);
  };

  const fetchOrders = async () => {
    setLoadingOrders(true); setOrderError(null);
    try {
      const res = await fetch('/api/admin/orders', { headers: { 'x-admin-auth': '0000' } });
      if (res.ok) { 
        const { data, error } = await res.json(); 
        if (error) setOrderError(error); 
        else if (data) setOrders(data); 
      }
    } catch (e) { setOrderError(e.message); }
    setLoadingOrders(false);
  };

  const NAV = [
    { id: 'overview', icon: <Home size={18} />, label: 'Overview' },
    { id: 'users', icon: <Users size={18} />, label: 'Users', count: users.length },
    { id: 'registrations', icon: <UserPlus size={18} />, label: 'Registrations', count: totalReg },
    { id: 'orders', icon: <ShoppingBag size={18} />, label: 'Orders', count: orders.length },
    { id: 'pricing', icon: <Tag size={18} />, label: 'Pricing' },
    { id: 'settings', icon: <Settings size={18} />, label: 'Settings' },
  ];

  const handleSaveGlobal = async (p, a, c) => {
    try {
      const res = await fetch('/api/settings?global=true');
      let cur = res.ok ? (await res.json()).settings || {} : {};
      const updated = { ...cur, pricing: p || pricing, announcement: a || announcement, config: c || cur.config || { maintenance: false, signups: true, notifications: true } };
      await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-auth': '0000' }, body: JSON.stringify({ settings: updated, global: true }) });
      if (p) setPricing(p); if (a) setAnnouncement(a);
    } catch (e) {}
  };

  const handleSave = async u => {
    const old = [...users]; setUsers(p => p.map(x => x.id === u.id ? u : x)); setSelUser(null);
    try {
      const res = await fetch('/api/profiles', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-auth': '0000' }, body: JSON.stringify(u) });
      if (!res.ok) throw new Error();
    } catch (e) { setUsers(old); alert("Save failed"); }
  };

  const handleDeleteUser = async u => {
    try {
      const res = await fetch(`/api/profiles?userId=${u.userId || u.id.replace('p_', '')}`, { method: 'DELETE', headers: { 'x-admin-auth': '0000' } });
      if (res.ok) { setUsers(p => p.filter(x => x.id !== u.id)); setSelUser(null); setDeleteTarget(null); }
    } catch (e) { alert("Delete failed"); }
  };

  if (!authed) return <div className="shell"><style>{CSS}</style><AdminLogin onLogin={() => { setAuthed(true); sessionStorage.setItem('admin_authed', 'true'); }} /></div>;

  return (
    <div className="shell">
      <style>{CSS}</style>
      {mobileMenu && <div className="shell-overlay" onClick={() => setMobileMenu(false)} />}
      {selUser && <UserModal user={selUser} onClose={() => setSelUser(null)} onSave={handleSave} onDelete={setDeleteTarget} />}
      {deleteTarget && <DeleteConfirmModal user={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => handleDeleteUser(deleteTarget)} />}
      <aside className={`aside ${mobileMenu ? 'open' : ''}`}>
        <div className="sb-brand">
          <div className="sb-mark"><Zap size={20} color="#fff" fill="#fff" /></div>
          <div><div className="sb-name">DM Studio</div><div className="sb-badge">ADMIN</div></div>
        </div>
        <div className="sb-admin">
          <div className="sb-av-admin"><Shield size={16} color="#fff" /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--ink)' }}>Partho Samadder</div>
            <div style={{ fontSize: '11px', color: 'var(--mu)' }}>Platform Administrator</div>
          </div>
        </div>
        <div className="sb-section">Menu</div>
        {NAV.map(n => (
          <div key={n.id} className={`sb-item ${view === n.id ? 'on' : ''}`} onClick={() => {setView(n.id); setMobileMenu(false)}}>
            {n.icon}{n.label}
            {n.count !== undefined && <span className="sb-count">{n.count}</span>}
          </div>
        ))}
        <div className="sb-foot">
          <button className="sb-logout" onClick={() => { sessionStorage.removeItem('admin_authed'); setAuthed(false); }}><LogOut size={16} /> Sign out</button>
        </div>
      </aside>
      <div className="main">
        {view === 'overview' && <Overview users={users} totalReg={totalReg} orders={orders} onMenuToggle={() => setMobileMenu(true)} />}
        {view === 'users' && <UsersView users={users} onManage={setSelUser} onMenuToggle={() => setMobileMenu(true)} />}
        {view === 'registrations' && <RegistrationsList users={users} onDelete={setDeleteTarget} onMenuToggle={() => setMobileMenu(true)} />}
        {view === 'orders' && <OrdersView orders={orders} orderError={orderError} loadingOrders={loadingOrders} fetchOrders={fetchOrders} onMenuToggle={() => setMobileMenu(true)} />}
        {view === 'pricing' && <PricingView pricing={pricing} onSave={(p) => handleSaveGlobal(p, null, null)} onMenuToggle={() => setMobileMenu(true)} />}
        {view === 'settings' && <AdminSettings announcement={announcement} onSave={(a, c) => handleSaveGlobal(null, a, c)} onMenuToggle={() => setMobileMenu(true)} />}
      </div>
    </div>
  );
}