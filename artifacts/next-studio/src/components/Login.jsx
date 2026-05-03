"use client";
import { useState } from "react";
import { 
  Zap, CheckCircle, Mail, Lock, Eye, EyeOff, 
  RefreshCw, AlertTriangle, User, Phone, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";

export function Login({ onLogin }) {
  const [mode, setMode] = useState('sign-in'); // sign-in, sign-up, reset
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState('');

  const DEMO_EMAIL = 'parthosamadder00@gmail.com';
  const DEMO_PASS = '0000';

  const submit = async e => {
    e.preventDefault(); 
    setLoad(true); 
    setErr('');
    
    try {
      if (mode === 'sign-in') {
        if (email.trim().toLowerCase() === DEMO_EMAIL && pw === DEMO_PASS) {
          onLogin({ user: { email: DEMO_EMAIL }, demo: true });
          return;
        }
        
        const res = await signIn('credentials', { email, password: pw, redirect: false });
        if (res?.error) {
          setErr(res.error === "CredentialsSignin" ? "Invalid email or password" : res.error);
        } else {
          window.location.reload();
        }
      } else if (mode === 'sign-up') {
        const res = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: `${fName} ${lName}`.trim(), email, password: pw }),
        });

        const data = await res.json();
        if (!res.ok) {
          setErr(data.error || 'Failed to create account');
        } else {
          // Auto sign in after signup
          const loginRes = await signIn('credentials', { email, password: pw, redirect: false });
          if (loginRes?.error) {
            setMode('sign-in');
            setErr('Account created! Please sign in.');
          } else {
            window.location.reload();
          }
        }
      }
    } catch (error) { 
      setErr('Connection error. Please try again.'); 
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-20 pointer-events-none" />
      
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 bg-card border border-border rounded-2xl overflow-hidden shadow-2xl shadow-black relative z-10">
        
        {/* Left Side: Brand & Visuals */}
        <div className="hidden lg:flex flex-col p-10 bg-primary text-primary-foreground relative">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">FlowStudio</span>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold leading-tight tracking-tight"
            >
              Scale your Instagram <br />
              <span className="text-white/60">without the effort.</span>
            </motion.h1>
            <p className="text-white/70 text-sm font-medium leading-relaxed max-w-xs">
              Automate DMs, manage leads, and grow your business with our all-in-one studio.
            </p>
          </div>

          <div className="space-y-3">
            {[
              "Automated Comment Replies",
              "Smart DM Funnels",
              "Lead Export Tools"
            ].map((f, i) => (
              <motion.div 
                key={f}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-2.5 text-xs font-bold text-white/80"
              >
                <CheckCircle size={14} className="text-white/40" />
                {f}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-10 lg:p-12 flex flex-col justify-center bg-card">
          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-1">
              {mode === 'sign-in' ? "Welcome back" : "Get started"}
            </h2>
            <p className="text-muted-foreground text-xs font-medium">
              {mode === 'sign-in' ? "Sign in to manage your studio." : "Create your account in seconds."}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'sign-up' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">First Name</label>
                    <input 
                      required
                      value={fName}
                      onChange={e => setFName(e.target.value)}
                      placeholder="Alex"
                      className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-lg text-xs focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Last Name</label>
                    <input 
                      required
                      value={lName}
                      onChange={e => setLName(e.target.value)}
                      placeholder="Creator"
                      className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-lg text-xs focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="alex@studio.com"
                  className="w-full pl-11 pr-4 py-2.5 bg-muted/30 border border-border rounded-lg text-xs focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
                <input 
                  type={showPw ? "text" : "password"}
                  required
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-2.5 bg-muted/30 border border-border rounded-lg text-xs focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {err && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-destructive/5 border border-destructive/10 rounded-lg flex items-center gap-2 text-destructive text-[10px] font-bold"
              >
                <AlertTriangle size={14} />
                {err}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={load}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold text-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {load ? <RefreshCw className="animate-spin" size={16} /> : (
                <>
                  {mode === 'sign-in' ? "Sign In" : "Create Account"}
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center space-y-4">
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
               {mode === 'sign-in' ? "New here?" : "Joined already?"}
               <button 
                onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
                className="ml-2 text-primary hover:underline"
               >
                 {mode === 'sign-in' ? "Create account" : "Sign in"}
               </button>
             </p>

             <button 
              onClick={() => signIn('google')}
              className="w-full py-2.5 bg-muted/50 border border-border rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-muted transition-all flex items-center justify-center gap-2.5"
             >
                <svg width="14" height="14" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google Login
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
