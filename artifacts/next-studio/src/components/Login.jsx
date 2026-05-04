"use client";
import { useState } from "react";
import { 
  Mail, Lock, Eye, EyeOff, 
  RefreshCw, AlertTriangle, ChevronRight,
  Heart, CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";

const Logo = () => (
  <div className="flex items-center gap-2 mb-8 justify-center">
    <div className="relative flex items-center justify-center">
      <div className="w-10 h-10 bg-[#1877f2] rounded-[8px] flex items-center justify-center transform rotate-12 absolute -z-10 opacity-20" />
      <div className="w-10 h-10 bg-[#1877f2] rounded-[8px] flex items-center justify-center shadow-lg shadow-primary/20">
        <Heart size={22} className="text-white fill-white" />
      </div>
    </div>
    <span className="text-2xl font-bold tracking-tight text-[#1a1a1a]">FlowStudio</span>
  </div>
);

export function Login({ onLogin }) {
  const [mode, setMode] = useState('sign-in'); // sign-in, sign-up
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
          onLogin?.({ user: { email: DEMO_EMAIL }, demo: true });
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
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center p-0 sm:p-6 font-sans">
      <div className="w-full max-w-6xl min-h-screen sm:min-h-0 grid grid-cols-1 lg:grid-cols-2 bg-white sm:rounded-[8px] overflow-hidden border-none sm:border border-gray-100">
        
        {/* Left Side: Visuals */}
        <div className="hidden lg:flex flex-col p-8 bg-[#1877f2] text-white relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] -ml-32 -mt-32" />
          
          <div className="relative z-10 flex flex-col h-full pt-10">
            <div className="flex-1 flex flex-col justify-start">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-5xl font-extrabold mb-8 leading-[1.1] tracking-tight">
                  Scale your Instagram <br />
                  <span className="opacity-40">effortlessly.</span>
                </h2>
                <p className="text-white/80 text-xl font-medium leading-relaxed max-w-md mb-12">
                  Automate DMs, manage leads, and grow your business with our all-in-one studio.
                </p>
              </motion.div>
            </div>

            <div className="space-y-4">
              {[
                "Automated Comment Replies",
                "Smart DM Funnels",
                "Lead Export Tools",
                "AI Powered Auto-Replies",
                "Detailed Analytics Dashboard"
              ].map((f, i) => (
                <motion.div 
                  key={f}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3 text-sm font-semibold text-white/90"
                >
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle size={14} className="text-white" />
                  </div>
                  {f}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-white overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[420px] mx-auto py-8 sm:py-0"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-[#1877f2] rounded-[8px] flex items-center justify-center shadow-lg shadow-primary/20">
                <Heart size={20} className="text-white fill-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#1a1a1a]">FlowStudio</span>
            </div>

            <div className="mb-6">
              <h1 className="text-[24px] sm:text-[28px] font-bold text-[#1a1a1a] mb-1 tracking-tight">
                {mode === 'sign-in' ? "Welcome back" : "Get Started"}
              </h1>
              <p className="text-[#666666] text-base">
                {mode === 'sign-in' ? "Log in to your account" : "Create your account in seconds"}
              </p>
            </div>

            <div className="space-y-4">
              <button 
                type="button"
                onClick={() => signIn('google')}
                className="w-full py-3 px-4 bg-white border border-gray-300 rounded-[8px] flex items-center justify-center gap-3 hover:bg-[#4285f4]/5 hover:border-[#4285f4]/30 transition-all duration-200 cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-[#374151] font-semibold text-[15px]">
                  {mode === 'sign-in' ? "Sign in with Google" : "Sign up with Google"}
                </span>
              </button>

              <div className="relative flex items-center justify-center my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e5e7eb]"></div>
                </div>
                <span className="relative px-4 bg-white text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest">OR</span>
              </div>

              <form onSubmit={submit} className="space-y-3">
                <AnimatePresence mode="wait">
                  {mode === 'sign-up' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <input 
                        required
                        value={fName}
                        onChange={e => setFName(e.target.value)}
                        placeholder="First Name"
                        className="w-full px-5 py-3 bg-white border border-gray-300 rounded-[8px] text-[15px] focus:bg-white focus:border-[#1877f2]/50 focus:ring-4 focus:ring-[#1877f2]/5 transition-all outline-none placeholder:text-[#9ca3af]"
                      />
                      <input 
                        required
                        value={lName}
                        onChange={e => setLName(e.target.value)}
                        placeholder="Last Name"
                        className="w-full px-5 py-3 bg-white border border-gray-300 rounded-[8px] text-[15px] focus:bg-white focus:border-[#1877f2]/50 focus:ring-4 focus:ring-[#1877f2]/5 transition-all outline-none placeholder:text-[#9ca3af]"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <input 
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={mode === 'sign-in' ? "Email" : "Email Address"}
                  className="w-full px-5 py-3 bg-white border border-gray-300 rounded-[8px] text-[15px] focus:bg-white focus:border-[#1877f2]/50 focus:ring-4 focus:ring-[#1877f2]/5 transition-all outline-none placeholder:text-[#9ca3af]"
                />

                <div className="relative">
                  <input 
                    type={showPw ? "text" : "password"}
                    required
                    value={pw}
                    onChange={e => setPw(e.target.value)}
                    placeholder="Password"
                    className="w-full px-5 py-3 bg-white border border-gray-300 rounded-[8px] text-[15px] focus:bg-white focus:border-[#1877f2]/50 focus:ring-4 focus:ring-[#1877f2]/5 transition-all outline-none placeholder:text-[#9ca3af]"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-5 top-[18px] text-[#9ca3af] hover:text-[#1a1a1a] transition-colors cursor-pointer"
                  >
                    {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {mode === 'sign-up' && (
                  <div className="p-4 bg-[#f0f7ff] border border-gray-300 rounded-[8px] flex items-start gap-4 mt-2">
                    <div className="mt-1 w-8 h-8 flex-shrink-0 flex items-center justify-center">
                      <img 
                        src="/meta-icon.png" 
                        alt="Meta partner" 
                        className="w-full h-full object-contain opacity-90"
                      />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-[#1877f2]">Meta-verified partner</h4>
                      <p className="text-[11px] text-[#666666] leading-relaxed">
                        We only use official Instagram APIs and processes. Your Instagram account is secure, and you stay in full control.
                      </p>
                    </div>
                  </div>
                )}

                {mode === 'sign-in' && (
                  <div className="flex justify-end mt-1">
                    <button type="button" className="text-[13px] font-semibold text-[#666666] hover:text-[#1877f2] transition-colors cursor-pointer">
                      Forgot password?
                    </button>
                  </div>
                )}

                {err && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-[8px] flex items-center gap-2 text-red-600 text-sm font-medium">
                    <AlertTriangle size={18} />
                    {err}
                  </div>
                )}

                <div className="pt-1">
                  {mode === 'sign-up' && (
                    <p className="text-center text-[11px] text-[#9ca3af] mb-3">
                      By joining you agree to our <span className="text-[#1877f2] cursor-pointer">Terms</span> & <span className="text-[#1877f2] cursor-pointer">Privacy Policy</span>
                    </p>
                  )}
                  <button 
                    type="submit" 
                    disabled={load}
                    className="w-full py-3 bg-[#1877f2] text-white rounded-[8px] font-bold text-[15px] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {load ? <RefreshCw className="animate-spin" size={20} /> : (
                      mode === 'sign-in' ? "Sign In" : "Create Account"
                    )}
                  </button>
                </div>
              </form>

              <div className="pt-4 text-center">
                <p className="text-[15px] text-[#666666]">
                  {mode === 'sign-in' ? "Don't have an account?" : "Already have an account?"}
                  <button 
                    onClick={() => {
                      setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in');
                      setErr('');
                    }}
                    className="ml-2 text-[#1877f2] font-bold hover:underline cursor-pointer"
                  >
                    {mode === 'sign-in' ? "Sign up for free" : "Sign in"}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
