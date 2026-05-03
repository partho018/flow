"use client";
import { useState, useEffect } from "react";
import {
  Users, DollarSign, Activity, Shield, Zap, Settings, LogOut,
  Crown, Star, AlertTriangle, Clock, MessageCircle, Send,
  Eye, EyeOff, Lock, RefreshCw, UserPlus, Gift,
  Home, Plus, ChevronRight, X, CheckCircle, Ban, ArrowUpRight,
  ArrowDownRight, BarChart2, TrendingUp, Filter, Mail, UserSquare, Phone,
  Download, Search, Edit2, CreditCard, Save, ShoppingBag, Tag, Menu
} from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

/* ─────────── CSS ─────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden}
:root{
  --bg:#fff;--s:#fff;--b:#F1F1EF;--b2:#E5E5E2;
  --ink:#0A0A09;--ink2:#262624;--ink3:#52524E;
  --mu:#8E8E87;--mu2:#C2C2B9;
  --acc:#334DFF;--acc2:#4D66FF;
  --green:#10B981;--red:#EF4444;
  --amber:#F59E0B;--blue:#3B82F6;
  --sb:#090908;
  --fh:'Bricolage Grotesque',sans-serif;
  --fb:'Geist',sans-serif;
  --fm:'Geist Mono',monospace;
}
body{background:var(--bg);color:var(--ink);font-family:var(--fb);-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:var(--b2);border-radius:99px}
.shell{display:flex;height:100vh;overflow:hidden}
.aside{width:260px;flex-shrink:0;height:100vh;display:flex;flex-direction:column;background:#fff;border-right:1px solid var(--b)}
.main{flex:1;display:flex;flex-direction:column;overflow:hidden}
.scroll{flex:1;overflow-y:auto}

/* sidebar */
.sb-brand{padding:24px 20px 20px;display:flex;align-items:center;gap:11px}
.sb-mark{width:34px;height:34px;border-radius:10px;background:var(--acc);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 4px 12px rgba(51,77,255,.2)}
.sb-name{font-family:var(--fh);font-weight:700;font-size:16px;color:var(--ink);letter-spacing:-.2px}
.sb-badge{font-size:9px;font-weight:800;padding:2px 7px;border-radius:4px;background:var(--acc);color:#fff;margin-top:2px;font-family:var(--fm);letter-spacing:1px;text-transform:uppercase;display:inline-block}
.sb-admin{margin:0 14px 16px;padding:12px;background:var(--bg);border:1px solid var(--b);border-radius:12px;display:flex;align-items:center;gap:10px}
.sb-av-admin{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--acc),var(--acc2));flex-shrink:0;display:flex;align-items:center;justify-content:center}
.sb-section{padding:18px 20px 8px;font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--mu)}
.sb-item{display:flex;align-items:center;gap:12px;padding:10px 14px;margin:2px 10px;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:var(--mu);transition:all .2s;border:1px solid transparent}
.sb-item:hover{color:var(--ink);background:var(--bg)}
.sb-item.on{color:var(--acc);background:rgba(51,77,255,.05);border-color:rgba(51,77,255,.1)}
.sb-item.on svg{color:var(--acc)}
.sb-count{margin-left:auto;font-size:10px;font-weight:800;padding:2px 6px;border-radius:6px;background:var(--ink);color:#fff;font-family:var(--fm)}
.sb-foot{padding:16px;border-top:1px solid var(--b);margin-top:auto}
.sb-logout{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;padding:11px;border-radius:10px;background:var(--bg);border:1px solid var(--b);color:var(--ink3);font-family:var(--fb);font-size:13.5px;font-weight:600;cursor:pointer;transition:all .2s}
.sb-logout:hover{background:#fff;border-color:var(--mu2);color:var(--red)}

/* topbar */
.topbar{height:50px;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:0 24px;border-bottom:1px solid var(--b);background:var(--s);flex-shrink:0}
.tb-title{font-family:var(--fh);font-weight:700;font-size:15px;color:var(--ink);letter-spacing:-.3px}

/* buttons */
.btn-p{background:var(--ink);color:#F5F4F1;border:none;padding:8px 16px;border-radius:8px;font-family:var(--fh);font-weight:700;font-size:12.5px;cursor:pointer;transition:all .13s;display:inline-flex;align-items:center;gap:6px}
.btn-p:hover{background:var(--ink2);transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.1)}
.btn-p:disabled{opacity:.4;cursor:not-allowed;transform:none}
.btn-p.acc{background:var(--acc)}.btn-p.acc:hover{background:var(--acc2)}
.btn-p.sm{padding:6px 12px;font-size:12px}
.btn-g{background:transparent;color:var(--mu);border:1px solid var(--b);padding:6px 12px;border-radius:8px;font-family:var(--fb);font-weight:500;font-size:12px;cursor:pointer;transition:all .12s;display:inline-flex;align-items:center;gap:5px}
.btn-g:hover{color:var(--ink);border-color:var(--b2);background:var(--bg)}
.btn-red{background:transparent;color:var(--red);border:1px solid rgba(185,28,28,.2);padding:6px 10px;border-radius:7px;font-family:var(--fb);font-weight:500;font-size:12px;cursor:pointer;transition:all .12s;display:inline-flex;align-items:center;gap:5px}
.btn-red:hover{background:rgba(185,28,28,.06);border-color:rgba(185,28,28,.35)}
.btn-grn{background:transparent;color:var(--green);border:1px solid rgba(26,107,62,.2);padding:6px 10px;border-radius:7px;font-family:var(--fb);font-weight:500;font-size:12px;cursor:pointer;transition:all .12s;display:inline-flex;align-items:center;gap:5px}
.btn-grn:hover{background:rgba(26,107,62,.06);border-color:rgba(26,107,62,.35)}

/* stat */
.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px}
.stat-card{background:var(--s);border:1px solid var(--b);border-radius:12px;padding:18px 20px;transition:border-color .13s,box-shadow .13s;position:relative;overflow:hidden}
.stat-card:hover{border-color:var(--b2);box-shadow:0 2px 12px rgba(0,0,0,.05)}
.stat-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--acc);transform:scaleY(0);transform-origin:bottom;transition:transform .2s}
.stat-card:hover::before{transform:scaleY(1)}
.stat-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px}
.delta-up{background:#ECFDF5;color:var(--green);display:flex;align-items:center;gap:2px;font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px}
.stat-num{font-family:var(--fh);font-size:32px;font-weight:700;color:var(--ink);line-height:1;letter-spacing:-1.5px}
.stat-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--mu);margin-top:7px;font-family:var(--fm)}

/* table */
.tbl-wrap{background:var(--s);border:1px solid var(--b);border-radius:12px;overflow:hidden}
.tbl-ctrl{padding:12px 16px;border-bottom:1px solid var(--b);display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.srch{display:flex;align-items:center;gap:7px;padding:7px 12px;background:var(--bg);border:1px solid var(--b);border-radius:8px;flex:1;min-width:200px;max-width:280px}
.srch input{background:none;border:none;outline:none;font-family:var(--fb);font-size:13px;color:var(--ink);width:100%}
.srch input::placeholder{color:var(--mu2)}
.col-hd{display:flex;padding:8px 16px;background:var(--bg);border-bottom:1px solid var(--b)}
.col-h{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--mu);font-family:var(--fm)}
.urow{display:flex;align-items:center;padding:11px 16px;border-bottom:1px solid var(--b);transition:background .1s}
.urow:last-child{border-bottom:none}
.urow:hover{background:#FAFAF9}
.av{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--fh);font-size:12px;font-weight:700;color:#fff;flex-shrink:0}

/* pills */
.plan-pill{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:99px;font-size:10.5px;font-weight:700;font-family:var(--fm)}
.pp-free{background:var(--bg);color:var(--mu);border:1px solid var(--b)}
.pp-pro{background:#FEF3C7;color:var(--amber)}
.pp-business{background:#EFF6FF;color:var(--blue)}
.sp{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:99px;font-size:10.5px;font-weight:700;font-family:var(--fm)}
.sp-a{background:#ECFDF5;color:var(--green)}
.sp-b{background:#FEF2F2;color:var(--red)}
.sp-p{background:#FEF3C7;color:var(--amber)}
.sp-c{background:#F1F1EF;color:var(--mu)}

/* usage bar */
.ubar{width:70px}
.ubar-track{height:4px;background:var(--b);border-radius:99px;overflow:hidden;margin-top:3px}
.ubar-fill{height:100%;border-radius:99px}

/* modal */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:300;display:flex;align-items:center;justify-content:center;padding:20px}
.modal{background:var(--s);border:1px solid var(--b);border-radius:14px;width:100%;max-width:500px;box-shadow:0 20px 60px rgba(0,0,0,.15);overflow:hidden}
.modal-head{padding:16px 20px;border-bottom:1px solid var(--b);display:flex;align-items:center;justify-content:space-between}
.modal-body{padding:20px 20px 35px;max-height:75vh;overflow-y:auto}
.modal-foot{padding:13px 20px;border-top:1px solid var(--b);display:flex;justify-content:flex-end;gap:8px}

/* inp */
.inp{width:100%;background:var(--bg);border:1px solid var(--b);border-radius:8px;padding:10px 13px;color:var(--ink);font-family:var(--fb);font-size:13px;outline:none;transition:border .12s,box-shadow .12s}
.inp:focus{border-color:var(--ink);box-shadow:0 0 0 3px rgba(20,20,18,.06)}
.inp::placeholder{color:var(--mu2)}
textarea.inp{resize:vertical;min-height:80px;line-height:1.6}
.ilbl{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:1.3px;color:var(--mu);margin-bottom:6px;font-family:var(--fm);display:flex;align-items:center;gap:5px}

/* tabs */
.tabs{display:flex;gap:2px;padding:3px;background:var(--bg);border:1px solid var(--b);border-radius:9px}
.tab{padding:5px 12px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:500;color:var(--mu);transition:all .12s;white-space:nowrap}
.tab.on{background:var(--s);color:var(--ink);font-weight:600;box-shadow:0 1px 3px rgba(0,0,0,.08)}

/* plan card */
.plan-card{border:2px solid var(--b);border-radius:11px;padding:16px 18px;cursor:pointer;transition:all .14s;position:relative}
.plan-card:hover{border-color:var(--b2)}
.plan-card.sel{border-color:var(--ink);background:#FAFAF9}

/* revenue bars */
.rev-bars{display:flex;align-items:flex-end;gap:5px;height:72px}
.rev-bar{flex:1;border-radius:4px 4px 0 0;background:var(--ink);opacity:.12;transition:opacity .2s;cursor:pointer}
.rev-bar:hover{opacity:.3}
.rev-bar.hi{opacity:.85;background:var(--acc)}

/* activity */
.af-row{display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid var(--b)}
.af-row:last-child{border-bottom:none}

/* login */
.login-bg{position:fixed;inset:0;background:#ffffff;display:flex;align-items:center;justify-content:center;z-index:500;background-image:radial-gradient(circle at 2px 2px, rgba(0,0,0,0.02) 1px, transparent 0);background-size:24px 24px}
.login-card{width:420px;background:#fff;border:1px solid rgba(0,0,0,0.06);border-radius:24px;padding:48px;box-shadow:0 20px 80px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.1)}
.inp-wrap{position:relative;margin-bottom:18px}
.inp-wrap .inp{padding:12px 14px;padding-left:40px;background:#fcfcfb;border:1px solid rgba(0,0,0,0.08);border-radius:12px;font-size:14px;transition:all .2s ease}
.inp-wrap .inp:focus{background:#fff;border-color:var(--acc);box-shadow:0 0 0 4px rgba(51,77,255,0.08)}
.inp-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--mu2);pointer-events:none}
.eye-btn{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--mu2);cursor:pointer;display:flex;padding:4px;transition:color .2s}
.eye-btn:hover{color:var(--acc)}
.err-box{background:#FFF5F5;border:1px solid rgba(224,36,36,0.1);color:#C53030;border-radius:12px;padding:12px 16px;font-size:13px;font-weight:500;margin-bottom:20px;display:flex;align-items:center;gap:10px}

@media (max-width: 1024px) {
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .aside { position: fixed; left: 0; top: 0; bottom: 0; z-index: 400; transform: translateX(-100%); transition: transform .3s ease; }
  .aside.open { transform: translateX(0); }
  .stat-grid { grid-template-columns: 1fr; }
  .tbl-ctrl { flex-direction: column; align-items: stretch; }
  .srch { max-width: none; }
  .modal { max-width: none; height: 100%; border-radius: 0; }
  .modal-body { max-height: none; flex: 1; }
  .tb-menu { display: flex !important; }
  .shell-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 350; display: block !important; }
}
.tb-menu { display: none; background: none; border: none; color: var(--ink); cursor: pointer; padding: 5px; margin-right: 12px; }

.fi{animation:fi .18s ease both}
@keyframes fi{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
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
    last8.push({ m: months[d.getMonth()], v: 0, hi: false });
  }
  
  orders.filter(o => o.status === 'completed' || o.status === 'success').forEach(o => {
    const d = new Date(o.createdAt);
    const m = months[d.getMonth()];
    const item = last8.find(x => x.m === m);
    if (item) item.v += Number(o.amount);
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
function UserModal({ user, onClose, onSave }) {
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
          <div style={{ marginLeft: 'auto' }}>
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
                      fontFamily: f.mono ? 'var(--fm)' : 'inherit'
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
          <button className="tb-menu" onClick={onMenuToggle}><Menu size={18} /></button>
          <div className="tb-title">Overview</div>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--mu)', fontFamily: 'var(--fm)' }}>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
      </div>
      <div className="scroll"><div style={{ padding: '24px', maxWidth: 1400, width: '100%', margin: '0 auto' }}>

        <div className="stat-grid">
          {[
            { l: 'Total Revenue', v: '₹' + totalRev.toLocaleString(), d: '+27%', I: DollarSign },
            { l: 'Total Profiles', v: users.length, d: '+4', I: Users },
            { l: 'Total Registered', v: totalReg, d: '+12%', I: UserPlus },
            { l: 'Paid Users', v: paid, d: '+2', I: Crown },
          ].map(s => (
            <div key={s.l} className="stat-card fi">
              <div className="stat-top">
                <s.I size={14} color="var(--mu2)" strokeWidth={1.7} />
                <span className="delta-up"><ArrowUpRight size={10} />{s.d}</span>
              </div>
              <div className="stat-num">{s.v}</div>
              <div className="stat-lbl">{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 12, marginBottom: 14 }}>
          <div style={{ background: 'var(--s)', border: '1px solid var(--b)', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--mu)', fontFamily: 'var(--fm)', marginBottom: 5 }}>Monthly Revenue</div>
              <div style={{ fontFamily: 'var(--fh)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-1px', lineHeight: 1 }}>₹{revData[revData.length - 1].v.toLocaleString()}</div>
              <div style={{ fontSize: '12px', color: 'var(--green)', fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 3 }}><ArrowUpRight size={12} />+27% from last month</div>
            </div>
            <div className="rev-bars">
              {revData.map((d, i) => (
                <div key={i} className={`rev-bar ${d.hi ? 'hi' : ''}`}
                  style={{ height: `${Math.round(d.v / maxRev * 100)}%` }}
                  title={`${d.m}: ₹${d.v.toLocaleString()}`} />
              ))}
            </div>
            <div style={{ display: 'flex', marginTop: 5 }}>
              {revData.map((d, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: '9.5px', fontFamily: 'var(--fm)', color: d.hi ? 'var(--acc)' : 'var(--mu2)', fontWeight: d.hi ? 700 : 400 }}>{d.m}</div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--s)', border: '1px solid var(--b)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--b)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--mu)', fontFamily: 'var(--fm)' }}>Live Activity</div>
            <div style={{ padding: '4px 16px', overflowY: 'auto', maxHeight: 200 }}>
              {activities.length === 0 ? (
                 <div style={{ padding: '40px 10px', textAlign: 'center', color: 'var(--mu)', fontSize: '12px' }}>No recent activity</div>
              ) : activities.map((a, i) => (
                <div key={i} className="af-row">
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: a.color, flexShrink: 0, marginTop: 5 }} />
                  <div style={{ fontSize: '12px', color: 'var(--ink2)', lineHeight: 1.55, flex: 1 }}>{a.text}</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--mu2)', fontFamily: 'var(--fm)', whiteSpace: 'nowrap', flexShrink: 0 }}>{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--s)', border: '1px solid var(--b)', borderRadius: 12, padding: '18px 20px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--mu)', fontFamily: 'var(--fm)', marginBottom: 14 }}>Plan Breakdown</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {PLANS_DEF.map(pl => {
              const count = users.filter(u => u.plan === pl.id).length;
              const rev = users.filter(u => u.plan === pl.id).reduce((s, u) => s + u.rev, 0);
              return (
                <div key={pl.id} style={{ padding: '14px 16px', background: 'var(--bg)', border: '1px solid var(--b)', borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <PlanPill plan={pl.id} />
                    <span style={{ fontFamily: 'var(--fm)', fontSize: '11px', fontWeight: 700, color: rev > 0 ? 'var(--green)' : 'var(--mu)' }}>₹{rev.toLocaleString()}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--fh)', fontSize: '30px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-1px', lineHeight: 1 }}>{count}</div>
                  <div style={{ fontSize: '11px', color: 'var(--mu)', marginTop: 4 }}>users</div>
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
  const FLTS = [{ id: 'all', l: 'All' }, { id: 'pro', l: 'Pro' }, { id: 'business', l: 'Business' }, { id: 'free', l: 'Free' }, { id: 'banned', l: 'Banned' }];

  const filtered = users.filter(u => {
    const ms = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const mf = flt === 'all' || u.plan === flt || u.status === flt;
    return ms && mf;
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className="tb-menu" onClick={onMenuToggle}><Menu size={18} /></button>
          <div className="tb-title">Users <span style={{ fontFamily: 'var(--fm)', fontSize: '13px', color: 'var(--mu)', fontWeight: 400 }}>({users.length})</span></div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-g" onClick={() => exportToCSV(users, 'users')}><Download size={11} /> Export</button>
          <button className="btn-p sm acc"><UserPlus size={11} /> Invite</button>
        </div>
      </div>
      <div className="scroll"><div style={{ padding: '24px', maxWidth: 1080, margin: '0 auto' }}>
        <div className="tbl-wrap">
          <div className="tbl-ctrl">
            <div className="srch"><Search size={13} color="var(--mu2)" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." /></div>
            <div className="tabs" style={{ flexShrink: 0 }}>
              {FLTS.map(f => <div key={f.id} className={`tab ${flt === f.id ? 'on' : ''}`} onClick={() => setFlt(f.id)}>{f.l}</div>)}
            </div>
          </div>

          <div className="col-hd" style={{ alignItems: 'center', gap: 0 }}>
            {[['User', '2'], ['Plan', '1'], ['Status', '1'], ['DM Usage', '1'], ['Revenue', '1'], ['Joined', '1'], ['', '0 0 100px']].map(([h, f]) => (
              <div key={h} style={{ flex: f, fontSize: '9.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--mu)', fontFamily: 'var(--fm)' }}>{h}</div>
            ))}
          </div>

          {filtered.length === 0
            ? <div style={{ padding: '40px', textAlign: 'center', color: 'var(--mu)', fontSize: '13px' }}>No users match your search</div>
            : filtered.map(u => {
              const tot = u.dmsLimit + u.creditBonus;
              const pct = Math.min(Math.round(u.dmsUsed / tot * 100), 100);
              return (
                <div key={u.id} className="urow">
                  <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, cursor: 'pointer' }} onClick={() => onManage(u)}>
                    <div className="av" style={{ background: avCol(u.name) }}>{u.name[0]}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--mu)', fontFamily: 'var(--fm)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}><PlanPill plan={u.plan} /></div>
                  <div style={{ flex: 1 }}><StatusPill status={u.status} /></div>
                  <div style={{ flex: 1 }}>
                    <div className="ubar">
                      <div style={{ fontSize: '11px', fontFamily: 'var(--fm)', fontWeight: 600, color: pct > 90 ? 'var(--red)' : 'var(--ink3)' }}>{u.dmsUsed.toLocaleString()}/{tot.toLocaleString()}</div>
                      <div className="ubar-track"><div className="ubar-fill" style={{ width: `${pct}%`, background: pct > 90 ? 'var(--red)' : 'var(--ink)' }} /></div>
                    </div>
                  </div>
                  <div style={{ flex: 1, fontFamily: 'var(--fm)', fontSize: '13px', fontWeight: 600, color: u.rev > 0 ? 'var(--green)' : 'var(--mu)' }}>{u.rev > 0 ? '₹' + u.rev : '—'}</div>
                  <div style={{ flex: 1, fontSize: '12px', color: 'var(--mu)', fontFamily: 'var(--fm)' }}>{u.joined}</div>
                  <div style={{ flex: '0 0 100px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn-g" style={{ padding: '5px 10px', fontSize: '11px' }} onClick={() => onManage(u)}><Edit2 size={10} /> Manage</button>
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
          <button className="tb-menu" onClick={onMenuToggle}><Menu size={18} /></button>
          <div className="tb-title">Orders <span style={{ fontFamily: 'var(--fm)', fontSize: '13px', color: 'var(--mu)', fontWeight: 400 }}>({orders.length})</span></div>
        </div>
        <button className="btn-g" onClick={() => exportToCSV(orders, 'orders')}><Download size={11} /> Export CSV</button>
      </div>
      <div className="scroll"><div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
        
        <div className="tbl-wrap">
          <div className="tbl-ctrl">
            <div className="srch"><Search size={13} color="var(--mu2)" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Order ID or Email..." /></div>
            <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
              <button onClick={() => fetchOrders()} className="btn-g">
                <RefreshCw size={12} className={loadingOrders ? 'spin' : ''} /> Refresh
              </button>
            </div>
          </div>

          <style>{`
            .spin { animation: spin 1s linear infinite; }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          `}</style>

          {/* Error Message */}
          {orderError && (
            <div style={{ padding: '20px', margin: '0 16px 16px', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '12px', color: '#B91C1C', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={16} />
              <div>
                <p style={{ fontWeight: 700 }}>Database Sync Error</p>
                <p style={{ fontSize: '11px', opacity: 0.8 }}>{orderError}</p>
              </div>
            </div>
          )}

          <div className="col-hd" style={{ alignItems: 'center' }}>
            {[['Date', '1'], ['Order ID', '1.5'], ['Customer', '2'], ['Amount', '1'], ['Status', '1'], ['', '0 0 50px']].map(([h, f]) => (
              <div key={h} style={{ flex: f, fontSize: '9.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--mu)', fontFamily: 'var(--fm)' }}>{h}</div>
            ))}
          </div>

          {filtered.length === 0 
            ? <div style={{ padding: '60px', textAlign: 'center', color: 'var(--mu)', fontSize: '13px' }}>No orders found</div>
            : filtered.map(o => (
              <div key={o.id} className="urow">
                <div style={{ flex: 1, fontSize: '12px', color: 'var(--mu)', fontFamily: 'var(--fm)' }}>
                  {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </div>
                <div style={{ flex: 1.5, fontSize: '12px', fontWeight: 600, color: 'var(--ink2)', fontFamily: 'var(--fm)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>{o.orderId}</div>
                <div style={{ flex: 2 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{o.billedName || o.userName || 'Unknown'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--mu)', fontFamily: 'var(--fm)' }}>{o.userEmail}</div>
                </div>
                <div style={{ flex: 1, fontFamily: 'var(--fm)', fontSize: '13px', fontWeight: 700 }}>₹{o.amount}</div>
                <div style={{ flex: 1 }}>
                  <span className={`sp ${o.status === 'completed' || o.status === 'success' ? 'sp-a' : o.status === 'failed' ? 'sp-b' : o.status === 'cancelled' ? 'sp-c' : 'sp-p'}`}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                    {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                  </span>
                </div>
                <div style={{ flex: '0 0 50px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    title="View order details"
                    onClick={() => setSelOrder(o)}
                    style={{ background: 'none', border: '1px solid var(--b)', borderRadius: 7, padding: '5px 7px', cursor: 'pointer', color: 'var(--mu)', display: 'flex', alignItems: 'center', transition: 'all .12s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(51,77,255,.06)'; e.currentTarget.style.borderColor = 'var(--acc)'; e.currentTarget.style.color = 'var(--acc)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'var(--b)'; e.currentTarget.style.color = 'var(--mu)'; }}
                  >
                    <Eye size={13} />
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
          <button className="tb-menu" onClick={onMenuToggle}><Menu size={18} /></button>
          <div className="tb-title">Platform Pricing</div>
        </div>
        <button 
          className="btn-p sm acc" 
          onClick={async () => { setLoad(true); await onSave(p); setLoad(false); }}
          disabled={load}
        >
          {load ? <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={12} />}
          Save Pricing
        </button>
      </div>
      <div className="scroll"><div style={{ padding: '24px', maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        <div style={{ background: 'var(--s)', border: '1px solid var(--b)', borderRadius: 12, padding: '24px' }}>
          <div className="ilbl" style={{ marginBottom: 12 }}><DollarSign size={10} /> Subscription Rates (₹)</div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <div className="ilbl">Monthly Price</div>
              <input className="inp" type="number" value={p.monthly} onChange={e => setP({ ...p, monthly: parseInt(e.target.value) })} />
            </div>
            <div>
              <div className="ilbl">Yearly Price (per month)</div>
              <input className="inp" type="number" value={p.yearly} onChange={e => setP({ ...p, yearly: parseInt(e.target.value) })} />
            </div>
          </div>
          
          <div>
            <div className="ilbl">Total Yearly Payment</div>
            <input className="inp" type="number" value={p.totalYearly} onChange={e => setP({ ...p, totalYearly: parseInt(e.target.value) })} />
            <p style={{ fontSize: '11px', color: 'var(--mu)', marginTop: 6, fontFamily: 'var(--fm)' }}>
              Current Savings Label: ₹{(p.monthly * 12 - p.totalYearly).toLocaleString()}
            </p>
          </div>
        </div>

        <div style={{ padding: '16px', background: 'rgba(29,78,216,.05)', border: '1px solid rgba(29,78,216,.15)', borderRadius: 11, display: 'flex', gap: 10 }}>
          <TrendingUp size={13} color="var(--blue)" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: '12px', color: 'var(--blue)', lineHeight: 1.6, fontWeight: 500 }}>
            Updates here will be reflected immediately in the user dashboard upgrade modal.
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
    }, 200);
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
          <h1 style={{ fontFamily: 'var(--fh)', fontWeight: 800, fontSize: '26px', color: 'var(--ink)', letterSpacing: '-0.8px', marginBottom: 8 }}>Welcome Back</h1>
          <p style={{ fontSize: '14px', color: 'var(--mu)', lineHeight: 1.5 }}>Authorized personnel only. Please sign in to access the DM Studio management console.</p>
        </div>

        <form onSubmit={submit}>
          <div className="inp-wrap">
            <Mail className="inp-icon" size={16} />
            <input 
              className="inp" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Admin Email" 
              autoFocus 
            />
          </div>
          
          <div className="inp-wrap" style={{ marginBottom: 24 }}>
            <Lock className="inp-icon" size={16} />
            <input 
              className="inp" 
              type={show ? 'text' : 'password'} 
              value={pw} 
              onChange={e => setPw(e.target.value)} 
              placeholder="Access Key" 
              style={{ letterSpacing: pw && !show ? '4px' : 'normal' }}
            />
            <button type="button" className="eye-btn" onClick={() => setShow(p => !p)}>
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {err && <div className="err-box"><AlertTriangle size={14} style={{flexShrink:0}} /> {err}</div>}
          
          <button type="submit" className="btn-p" style={{ 
            width: '100%', padding: '14px', justifyContent: 'center', 
            borderRadius: 12, fontSize: '15px', background: 'var(--acc)',
            boxShadow: '0 8px 20px rgba(51,77,255,0.15)'
          }} disabled={load || !email || !pw}>
            {load ? (
              <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite', marginRight: 8 }} /> Authenticating...</>
            ) : (
              'Enter Dashboard'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─────────── ADMIN SETTINGS ─────────── */
function AdminSettings({ announcement, onSave, onMenuToggle }) {
  const [config, setConfig] = useState({
    maintenance: false,
    signups: true,
    notifications: true,
  });
  const [ann, setAnn] = useState(announcement || { enabled: false, text: '', type: 'update' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (announcement) {
      setAnn(announcement);
    }
  }, [announcement]);
  const [showSaved, setShowSaved] = useState(false);
  const [error, setError] = useState(null);

  const onLocalSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onSave(ann, config);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    } catch (e) {
      console.error("Save failed:", e);
      setError("Failed to save settings. Please try again.");
      setTimeout(() => setError(null), 5000);
    }
    setIsSaving(false);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className="tb-menu" onClick={onMenuToggle}><Menu size={18} /></button>
          <div className="tb-title">System Settings</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {error && <div style={{ color: 'var(--red)', fontSize: '12px', fontWeight: 600 }} className="fi">⚠ {error}</div>}
          {showSaved && <div style={{ color: 'var(--green)', fontSize: '12px', fontWeight: 600 }} className="fi">✓ Settings Saved</div>}
          <button className="btn-p sm acc" onClick={onLocalSave} disabled={isSaving}>
            {isSaving ? <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={12} />}
            {isSaving ? ' Saving...' : ' Save Settings'}
          </button>
        </div>
      </div>


      <div className="scroll">
        <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div style={{ background: 'var(--s)', border: '1px solid var(--b)', borderRadius: 12, padding: '24px' }} className="fi">
            <h3 style={{ fontFamily: 'var(--fh)', fontSize: '18px', marginBottom: 6 }}>Announcement Bar</h3>
            <p style={{ color: 'var(--mu)', fontSize: '13px', marginBottom: 20 }}>Display a message to all users at the top of their dashboard.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>Enable Bar</div>
                <div 
                  onClick={() => setAnn({ ...ann, enabled: !ann.enabled })}
                  style={{ 
                    width: 44, height: 22, borderRadius: 22, background: ann.enabled ? 'var(--ink)' : 'var(--b2)', 
                    position: 'relative', cursor: 'pointer', transition: 'background .2s ease'
                  }}
                >
                  <div style={{ 
                    width: 18, height: 18, borderRadius: '50%', background: '#fff', 
                    position: 'absolute', top: 2, left: ann.enabled ? 24 : 2, transition: 'left .2s cubic-bezier(0.4, 0, 0.2, 1)' 
                  }} />
                </div>
              </div>
              
              <div>
                <div className="ilbl">Announcement Text</div>
                <textarea 
                  className="inp" 
                  style={{ minHeight: 100 }}
                  value={ann.text} 
                  onChange={e => setAnn({ ...ann, text: e.target.value })}
                  placeholder="e.g. Comment reply automations are stable again..."
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                 {['update', 'warning', 'info'].map(t => (
                   <button key={t} className={`tab ${ann.type === t ? 'on' : ''}`} onClick={() => setAnn({...ann, type: t})}>
                     {t.toUpperCase()}
                   </button>
                 ))}
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--s)', border: '1px solid var(--b)', borderRadius: 12, padding: '24px' }} className="fi">
            <h3 style={{ fontFamily: 'var(--fh)', fontSize: '18px', marginBottom: 6 }}>General Configuration</h3>
            <p style={{ color: 'var(--mu)', fontSize: '13px', marginBottom: 20 }}>Manage global platform behavior and visibility.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { id: 'maintenance', l: 'Maintenance Mode', d: 'Temporarily disable the application for all users.', val: config.maintenance },
                { id: 'signups', l: 'Open Signups', d: 'Allow new users to register for accounts.', val: config.signups },
                { id: 'notifications', l: 'System Notifications', d: 'Send automated emails for system alerts.', val: config.notifications },
              ].map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'var(--bg)', border: '1px solid var(--b)', borderRadius: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{item.l}</div>
                    <div style={{ fontSize: '12px', color: 'var(--mu)', marginTop: 2 }}>{item.d}</div>
                  </div>
                  <div 
                    onClick={() => setConfig({ ...config, [item.id]: !item.val })}
                    style={{ 
                      width: 44, height: 22, borderRadius: 22, background: item.val ? 'var(--ink)' : 'var(--b2)', 
                      position: 'relative', cursor: 'pointer', transition: 'background .2s ease'
                    }}
                  >
                    <div style={{ 
                      width: 18, height: 18, borderRadius: '50%', background: '#fff', 
                      position: 'absolute', top: 2, left: item.val ? 24 : 2, transition: 'left .2s cubic-bezier(0.4, 0, 0.2, 1)' 
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '16px', background: '#FEF2F2', border: '1px solid rgba(185,28,28,.15)', borderRadius: 12, display: 'flex', gap: 12 }} className="fi">
            <AlertTriangle size={18} color="var(--red)" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--red)' }}>Danger Zone</div>
              <p style={{ fontSize: '12px', color: 'var(--red)', opacity: 0.8, marginTop: 4, lineHeight: 1.5 }}>
                Changing these settings can impact production users immediately. Please verify all changes before saving.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ─────────── ROOT ─────────── */
export default function AdminApp() {
  const [authed, setAuthed] = useState(() => {
    // Check if we have an active admin session in this browser window
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('admin_authed') === 'true';
    }
    return false;
  });
  const [view, setView] = useState('overview');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selUser, setSelUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [totalReg, setTotalReg] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);


  const [pricing, setPricing] = useState({ monthly: 499, yearly: 399, totalYearly: 4788 });
  const [announcement, setAnnouncement] = useState({ enabled: false, text: '', type: 'update' });


  const { data: session, status } = useSession();

  useEffect(() => {
    // Admin access is now completely independent of Google login status.
    // We only rely on the 'authed' state which is set via the password form.
    if (authed) {
      fetchUsers();
      fetchPricing();
      fetchOrders();
    }
  }, [authed]);

  const fetchPricing = async () => {
    try {
      const res = await fetch('/api/settings?global=true', {
        headers: { 'x-admin-auth': '0000' }
      });
      if (!res.ok) return;
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      if (data.settings?.pricing) setPricing(data.settings.pricing);
      if (data.settings?.announcement) setAnnouncement(data.settings.announcement);

    } catch (e) {
      console.error("Failed to fetch pricing:", e);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/profiles', {
        headers: { 'x-admin-auth': '0000' }
      });
      if (!res.ok) return;
      const text = await res.text();
      if (!text) return;
      const { data, totalRegistered, error } = JSON.parse(text);
      if (!error && data) setUsers(data);
      if (totalRegistered !== undefined) setTotalReg(totalRegistered);

    } catch (e) {
      console.error("Failed to fetch users:", e);
    }
    setLoadingUsers(false);
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    setOrderError(null);
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { 'x-admin-auth': '0000' }
      });
      if (!res.ok) return;
      const text = await res.text();
      if (!text) return;
      const { data, error } = JSON.parse(text);
      if (error) {
        setOrderError("API Error: " + error);
      } else if (data) {
        setOrders(data);
      }
    } catch (e) {
      console.error("Failed to fetch orders:", e);
      setOrderError("Fetch Exception: " + e.message);
    }
    setLoadingOrders(false);
  };

  const NAV = [
    { id: 'overview', icon: <Home size={16} strokeWidth={2} />, label: 'Overview' },
    { id: 'users', icon: <Users size={16} strokeWidth={2} />, label: 'Users', count: users.length },
    { id: 'registrations', icon: <UserPlus size={16} strokeWidth={2} />, label: 'Registrations', count: totalReg },
    { id: 'orders', icon: <ShoppingBag size={16} strokeWidth={2} />, label: 'Orders', count: orders.length },

    { id: 'pricing', icon: <Tag size={16} strokeWidth={2} />, label: 'Pricing' },
    { id: 'settings', icon: <Settings size={16} strokeWidth={2} />, label: 'Settings' },
  ];

  const handleSaveGlobal = async (p, a, c) => {
    try {
      if (p) setPricing(p);
      if (a) setAnnouncement(a);
      
      const res = await fetch('/api/settings?global=true');
      let currentSettings = {};
      if (res.ok) {
        const text = await res.text();
        if (text) {
          const data = JSON.parse(text);
          currentSettings = data.settings || {};
        }
      }

      const updatedSettings = {
        ...currentSettings,
        pricing: p || pricing,
        announcement: a || announcement,
        config: c || currentSettings.config || { maintenance: false, signups: true, notifications: true }
      };

      const saveRes = await fetch('/api/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-auth': '0000'
        },
        body: JSON.stringify({ settings: updatedSettings, global: true })
      });
      
      if (!saveRes.ok) throw new Error("Server rejected the update");
    } catch (e) {
      console.error("Global save error:", e);
      throw e;
    }
  };




  const handleSave = async u => {
    const oldUsers = [...users];
    setUsers(p => p.map(x => x.id === u.id ? u : x));
    setSelUser(null);
    
    try {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-auth': '0000'
        },
        body: JSON.stringify({
          id: u.id,
          userId: u.userId,
          plan: u.plan,
          status: u.status,
          creditBonus: u.creditBonus
        })
      });
      if (!res.ok) throw new Error("Failed to save");
    } catch (e) {
      console.error("Save failed:", e);
      alert("Failed to save user data. Reverting changes.");
      setUsers(oldUsers);
    }
  };

  if (!authed) return (
    <div className="shell"><style>{CSS}</style><AdminLogin onLogin={() => {
      setAuthed(true);
      sessionStorage.setItem('admin_authed', 'true');
    }} /></div>
  );

  return (
    <div className="shell">
      <style>{CSS}</style>

      {mobileMenu && <div className="shell-overlay" onClick={() => setMobileMenu(false)} />}
      {selUser && <UserModal user={selUser} onClose={() => setSelUser(null)} onSave={handleSave} />}

      <aside className={`aside ${mobileMenu ? 'open' : ''}`}>
        <div className="sb-brand">
          <div className="sb-mark"><Zap size={16} color="#fff" strokeWidth={2.5} /></div>
          <div>
            <div className="sb-name">DM Studio</div>
            <div className="sb-badge">ADMIN</div>
          </div>
        </div>
        <div className="sb-admin">
          <div className="sb-av-admin"><Shield size={14} color="#fff" /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Super Admin</div>
            <div style={{ fontSize: '11px', color: 'var(--mu)', marginTop: 2 }}>{session?.user?.email || 'Administrator'}</div>
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
          <button className="sb-logout" onClick={() => signOut()}><LogOut size={14} /> Sign out</button>
        </div>
      </aside>

      <div className="main">
        {view === 'overview' && <Overview users={users} totalReg={totalReg} orders={orders} onMenuToggle={() => setMobileMenu(true)} />}
        {view === 'users' && <UsersView users={users} onManage={setSelUser} onMenuToggle={() => setMobileMenu(true)} />}
        {view === 'registrations' && <RegistrationsList users={users} onMenuToggle={() => setMobileMenu(true)} />}
        {view === 'orders' && <OrdersView orders={orders} orderError={orderError} loadingOrders={loadingOrders} fetchOrders={fetchOrders} onMenuToggle={() => setMobileMenu(true)} />}
        {view === 'pricing' && <PricingView pricing={pricing} onSave={(p) => handleSaveGlobal(p, null, null)} onMenuToggle={() => setMobileMenu(true)} />}
        {view === 'settings' && <AdminSettings announcement={announcement} onSave={(a, c) => handleSaveGlobal(null, a, c)} onMenuToggle={() => setMobileMenu(true)} />}
      </div>


    </div>
  );
}

function RegistrationsList({ users, onMenuToggle }) {
  const [search, setSearch] = useState('');
  const filtered = users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()) || (u.name && u.name.toLowerCase().includes(search.toLowerCase())));
  
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className="tb-menu" onClick={onMenuToggle}><Menu size={18} /></button>
          <div className="tb-title">All Registrations <span style={{ fontFamily: 'var(--fm)', fontSize: '13px', color: 'var(--mu)', fontWeight: 400 }}>({users.length})</span></div>
        </div>
      </div>
      <div className="scroll"><div style={{ padding: '24px', maxWidth: 1000, margin: '0 auto' }}>
        <div className="tbl-wrap">
          <div className="tbl-ctrl">
            <div className="srch"><Search size={14} /><input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          </div>
          <div className="col-hd">
            <div className="col-h" style={{ width: 40 }}>#</div>
            <div className="col-h" style={{ flex: 2 }}>User</div>
            <div className="col-h" style={{ flex: 1 }}>Joined</div>
            <div className="col-h" style={{ width: 100 }}>Status</div>
          </div>
          {filtered.map((u, i) => (
            <div key={u.id} className="urow">
              <div style={{ width: 40, fontSize: '12px', color: 'var(--mu)', fontFamily: 'var(--fm)' }}>{i + 1}</div>
              <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="av" style={{ background: 'var(--ink3)' }}>{u.name?.[0] || 'U'}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--ink)' }}>{u.name || 'Anonymous'}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--mu)' }}>{u.email}</div>
                </div>
              </div>
              <div style={{ flex: 1, fontSize: '12.5px', color: 'var(--ink3)' }}>{u.joined || 'Recent'}</div>
              <div style={{ width: 100 }}><div className="sp sp-a">Active</div></div>
            </div>
          ))}
        </div>
      </div></div>
    </div>
  );
}