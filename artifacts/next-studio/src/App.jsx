"use client";
import { useState, useEffect, useRef } from "react";
import { Zap, Plus, CheckCircle, X, Activity, Crown, AlertTriangle } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

// Modular Components
import { Sidebar } from "./components/Sidebar";
import { HomeView as HomeViewNew } from "./components/HomeView";
import { AutoList } from "./components/AutoList";
import { Builder } from "./components/Builder";
import { Login } from "./components/Login";
import { SettingsView } from "./components/SettingsView";
import { ContactsView } from "./components/ContactsView";
import { InstagramConnect } from "./components/InstagramConnect";
import { ProductsView } from "./components/ProductsView";
import { CountrySelector, PhoneInput, COUNTRIES } from "./components/CountrySelector";

const PLAN_LIMITS = { free: 1, creator: 10, pro: 100, business: Infinity };

export default function App() {
  const [greeting, setGreeting] = useState('Welcome');
  const [view, setView] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [plan, setPlan] = useState('free');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [automations, setAutomations] = useState([]);
  const [editing, setEditing] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [pricing, setPricing] = useState({ monthly: 499, yearly: 399, totalYearly: 4788 });
  const [showConnectIG, setShowConnectIG] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [billingDetails, setBillingDetails] = useState({ fullName: '', phone: '', phoneCountry: 'India', billingCountry: 'India', state: '' });
  const [billingErrors, setBillingErrors] = useState({});
  const [userStatus, setUserStatus] = useState('active'); // Added to track ban status
  const [announcement, setAnnouncement] = useState(null);
  const [showAnn, setShowAnn] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);



  const [pageLoading, setPageLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  const { data: session, status } = useSession();
  const [userName, setUserName] = useState('');

  // Initial Page Load Animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 700); // 700ms for a snappier feel
    return () => clearTimeout(timer);
  }, []);

  // Sync user name from session
  useEffect(() => {
    if (session?.user?.name) setUserName(session.user.name);
  }, [session]);

  // Authentication State
  useEffect(() => {
    if (status === 'authenticated') {
      setAuthed(true);
    } else if (status === 'unauthenticated') {
      setAuthed(false);
      // Reset view to home for next login session
      localStorage.removeItem('current_view');
    }
  }, [status]);


  // Greeting
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning 👋" : h < 17 ? "Good afternoon 👋" : "Good evening 👋");
  }, []);

  // Theme & View Persistence
  useEffect(() => {
    const savedView = localStorage.getItem('current_view');
    if (savedView) setView(savedView);
    const savedTheme = localStorage.getItem('dm_theme');
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');
    else setIsDarkMode(false); // Default to light
  }, []);

  useEffect(() => {
    localStorage.setItem('current_view', view);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dm_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dm_theme', 'light');
    }
  }, [view, isDarkMode]);

  // Instagram State (from URL/LocalStorage)
  const [igConnected, setIgConnected] = useState(false);
  const [igUsername, setIgUsername] = useState(null);
  const [igImage, setIgImage] = useState(null);
  const [appUrl, setAppUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const igConnectedParam = params.get('ig_connected') === 'true';
      const igUsernameParam = params.get('ig_username');
      const igImageParam = params.get('ig_image');
      
      // Only restore from URL params (OAuth redirect), not localStorage
      // localStorage is only used as a cache AFTER server confirms the connection
      if (igConnectedParam && igUsernameParam) {
        localStorage.setItem('ig_connected', 'true');
        localStorage.setItem('ig_username', igUsernameParam);
        if (igImageParam) localStorage.setItem('ig_image', igImageParam);
        setIgConnected(true);
        setIgUsername(igUsernameParam);
        if (igImageParam) setIgImage(igImageParam);
        window.history.replaceState({}, '', '/');
      }
      setAppUrl(window.location.origin);
    }
  }, []);

  // Clear IG state when session user changes (prevents cross-account contamination)
  const prevUserIdRef = useRef(null);
  useEffect(() => {
    if (session?.user?.id && session.user.id !== prevUserIdRef.current) {
      prevUserIdRef.current = session.user.id;
      // Reset to unconnected state; /api/stats will restore if genuinely connected
      setIgConnected(false);
      setIgUsername(null);
      setIgImage(null);
    }
  }, [session?.user?.id]);


  const [stats, setStats] = useState({ dmsSent: 0, followersCount: 0, commentsCaught: 0 });

  // Auto-show upgrade modal for free users on load/login
  const hasTriggeredModal = useRef(false);
  useEffect(() => {
    if (status === 'authenticated' && plan === 'free' && !hasTriggeredModal.current) {
      hasTriggeredModal.current = true;
      const timer = setTimeout(() => {
        setShowUpgradeModal(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status, plan]);

  // Fetch Data
  useEffect(() => {
    if (status === 'authenticated') {
      
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          if (data.settings?.automations) setAutomations(data.settings.automations);
          if (data.settings?.pricing) setPricing(data.settings.pricing);
        })
        .catch(err => console.error("Failed to load settings:", err));

      // Fetch IG Stats
      fetch('/api/stats')
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            if (data.status) setUserStatus(data.status);
            if (data.plan) setPlan(data.plan);
            if (data.hasPassword !== undefined) setHasPassword(data.hasPassword);
            
            if (data.igUsername) {
              setStats(data);
              setIgConnected(true);
              if (data.igImage) setIgImage(data.igImage);
              if (data.igUsername) setIgUsername(data.igUsername);
              
              // Sync localStorage as a backup for this device
              localStorage.setItem('ig_connected', 'true');
              localStorage.setItem('ig_username', data.igUsername);
              if (data.igImage) localStorage.setItem('ig_image', data.igImage);
            } else {
              // Explicitly clear state if no profile found in DB for this Gmail user
              setIgConnected(false);
              setIgUsername(null);
              setIgImage(null);
              localStorage.removeItem('ig_connected');
              localStorage.removeItem('ig_username');
              localStorage.removeItem('ig_image');
            }
          }
        })
        .catch(err => console.error("Failed to load stats:", err));

      // Fetch Announcement
      fetch('/api/announcement')
        .then(res => res.json())
        .then(data => {
          if (data.enabled) {
            setAnnouncement(data);
            setShowAnn(true);
          }
        })
        .catch(err => console.error("Failed to load announcement:", err));
    }
  }, [status]); // Removed igConnected from dependencies to avoid loop


 
  // Razorpay Implementation
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Validate billing details before proceeding to payment
  const handleUpgradeNowClick = () => {
    // Reset billing form and show the billing modal with default values
    setBillingDetails({ 
      fullName: session?.user?.name || '', 
      phone: '', 
      phoneCountry: 'India', 
      billingCountry: 'India', 
      state: '' 
    });
    setBillingErrors({});
    setShowBillingModal(true);
    setShowUpgradeModal(false);
  };

  const handleBillingBack = () => {
    setShowBillingModal(false);
    setShowUpgradeModal(true);
  };

  const handleProceedToPayment = async () => {
    // Validate
    const errs = {};
    if (!billingDetails.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!billingDetails.phone.trim()) errs.phone = 'Phone number is required.';
    if (!billingDetails.billingCountry.trim()) errs.country = 'Country is required.';
    if (Object.keys(errs).length > 0) { setBillingErrors(errs); return; }
    
    // Don't close modal here, let handleRazorpayPayment manage it
    await handleRazorpayPayment();
  };

  const handleRazorpayPayment = async () => {
    const amount = billingCycle === 'monthly' ? pricing.monthly : pricing.totalYearly;
    setIsProcessing(true);
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsProcessing(false);
      return;
    }

    // Get dial code for the phone country and sanitize phone input
    const dialCode = COUNTRIES.find(c => c.name === billingDetails.phoneCountry)?.dialCode || '';
    const cleanPhone = billingDetails.phone.replace(/\D/g, ''); // Remove all non-digits
    const fullPhone = `${dialCode}${cleanPhone}`;

    // Create Order on Server with billing details
    const data = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        amount,
        billingDetails: {
          fullName: billingDetails.fullName,
          phone: fullPhone,
          country: billingDetails.billingCountry,
          state: billingDetails.state,
        }
      }),
    }).then((t) => t.json());

    if (data.error) {
      alert("Failed to create order");
      setIsProcessing(false);
      return;
    }

    // Success! Now close the billing modal and open Razorpay
    setShowBillingModal(false);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "DM Studio",
      description: `${billingCycle === 'monthly' ? 'Monthly' : 'Annual'} Plan`,
      order_id: data.id,
      handler: async function (response) {
        // Verify payment on server
        const verifyRes = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        }).then((t) => t.json());

        if (verifyRes.status === "success") {
          setPlan('pro');
          setShowUpgradeModal(false);
          alert("🎉 Upgrade Successful! Welcome to Pro Plan.");
        } else {
          alert("Payment Verification Failed");
        }
        setIsProcessing(false);
      },
      prefill: {
        name: billingDetails.fullName || session?.user?.name,
        email: session?.user?.email,
        contact: cleanPhone ? fullPhone : "",
      },
      theme: {
        color: "#334DFF",
      },
      modal: {
        ondismiss: function () {
          fetch("/api/razorpay/cancel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: data.id }),
          });
          setIsProcessing(false);
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setIsProcessing(false);
  };


  const persistAutomations = (updated) => {
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: { automations: updated } })
    }).catch(err => console.error("Failed to persist automations:", err));
  };

  // Actions
  const handleNew = () => {
    if (automations.length >= PLAN_LIMITS[plan]) setShowUpgradeModal(true);
    else setEditing({ id: 'new' });
  };

  const handleSave = data => {
    setAutomations(prev => {
      const exists = prev.find(a => a.id === data.id);
      const updated = exists ? prev.map(a => a.id === data.id ? data : a) : [...prev, data];
      persistAutomations(updated);
      return updated;
    });
    setEditing(null); 
    setView('automations');
  };

  const handleDelete = id => { 
    setAutomations(p => {
      const updated = p.filter(a => a.id !== id);
      persistAutomations(updated);
      return updated;
    });
  };

  const handleDisconnect = () => {
    localStorage.removeItem('ig_connected');
    localStorage.removeItem('ig_username');
    localStorage.removeItem('ig_image');
    setIgConnected(false);
    setIgUsername(null);
    setIgImage(null);
  };

  const persistPricing = (updatedPricing) => {
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: { pricing: updatedPricing } })
    }).catch(err => console.error("Failed to persist pricing:", err));
  };

  const handleSavePricing = (newPricing) => {
    setPricing(newPricing);
    persistPricing(newPricing);
  };

  const connectUrl = `${appUrl}/api/auth/connect`;
  
  if (status === 'loading') {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-2xl shadow-primary/20"
        >
          <Zap size={24} className="text-white fill-white" />
        </motion.div>
      </div>
    );
  }

  if (status === 'unauthenticated' && !authed) return <Login onLogin={() => setAuthed(true)} />;

  const isBuilder = editing !== null;
  const isBanned = userStatus === 'banned';

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'dark bg-[#0a0a0b]' : 'bg-[#f8f9fc]'}`}>
      <AnimatePresence mode="wait">
        {pageLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-24 h-24 rounded-full border-2 border-primary/10 border-t-primary shadow-[0_0_40px_-10px_rgba(51,77,255,0.3)]"
              />
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
                transition={{ 
                  scale: { repeat: Infinity, duration: 1.5, repeatType: "reverse" },
                  opacity: { duration: 0.5 }
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40">
                  <Zap size={24} className="text-white fill-white" />
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex flex-col items-center"
            >
              <h1 className="text-xl font-black tracking-tighter text-foreground">FlowStudio</h1>
              <div className="mt-4 flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 bg-primary rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : !authed ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Login onLogin={() => setAuthed(true)} />
          </motion.div>
        ) : (
          <motion.div 
            key="app"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex h-screen overflow-hidden"
          >
            <Sidebar 
              activeView={view} 
              onViewChange={(v) => { setView(v); setEditing(null); }} 
              isDarkMode={isDarkMode} 
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
              plan={plan}
              igUsername={igUsername}
              igImage={igImage}
              igConnected={igConnected}
              userEmail={session?.user?.email}
              onUpgrade={() => setShowUpgradeModal(true)}
              onConnect={() => setShowConnectIG(true)}
              onLogout={() => signOut()}
              isOpen={menuOpen}
              onClose={() => setMenuOpen(false)}
              onNew={isBanned ? null : handleNew}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
              {/* Ban Warning Bar */}
              {isBanned && (
                <div className="bg-destructive text-destructive-foreground py-2.5 px-6 flex items-center justify-center gap-3 relative z-[70] shadow-lg animate-pulse">
                  <AlertTriangle size={16} />
                  <p className="text-xs md:text-sm font-black tracking-tight">
                    ACCOUNT SUSPENDED: Your access is restricted. Please contact support to resolve this issue.
                  </p>
                </div>
              )}

              {showAnn && announcement && (
                <div className="bg-primary text-white overflow-hidden relative z-[60] shadow-md">
                  <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-black tracking-widest uppercase">
                        {announcement.type || 'Update'}
                      </span>
                      <p className="text-xs md:text-sm font-bold tracking-tight">
                        {announcement.text}
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowAnn(false)}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}

              {isBuilder ? (
                <Builder automation={editing} onBack={() => setEditing(null)} onSave={isBanned ? null : handleSave} isBanned={isBanned} />
              ) : view === 'home' ? (
                <HomeViewNew 
                  greeting={greeting} 
                  automations={automations} 
                  onNew={isBanned ? null : handleNew} 
                  igConnected={igConnected} 
                  igUsername={igUsername}
                  igImage={igImage}
                  stats={{
                    ...stats,
                    activeAutomations: automations.filter(a => a.active).length,
                    totalAutomations: automations.length
                  }}
                  plan={plan}
                  userName={userName}
                  onUpgrade={isBanned ? null : () => setShowUpgradeModal(true)}
                  connectUrl={connectUrl} 
                  onConnect={isBanned ? null : () => setShowConnectIG(true)}
                  onMenuToggle={() => setMenuOpen(true)} 
                  isBanned={isBanned}
                />
              ) : view === 'automations' ? (
                <AutoList 
                  automations={automations} 
                  onNew={isBanned ? null : handleNew} 
                  onEdit={isBanned ? null : (a => setEditing(a))} 
                  onDelete={isBanned ? null : handleDelete} 
                  onUpgrade={isBanned ? null : () => setShowUpgradeModal(true)} 
                  onMenuToggle={() => setMenuOpen(true)} 
                  isBanned={isBanned}
                />
              ) : view === 'contacts' ? (
                <ContactsView igConnected={igConnected} onMenuToggle={() => setMenuOpen(true)} isBanned={isBanned} />
              ) : view === 'products' ? (
                <ProductsView onMenuToggle={() => setMenuOpen(true)} />
              ) : (view === 'settings' || view === 'billing') ? (
                <SettingsView 
                  plan={plan} 
                  igConnected={igConnected} 
                  igUsername={igUsername} 
                  igImage={igImage} 
                  onUpgrade={isBanned ? null : () => setShowUpgradeModal(true)} 
                  onDisconnect={isBanned ? null : handleDisconnect} 
                  userEmail={session?.user?.email} 
                  userName={userName}
                  hasPassword={hasPassword}
                  initialTab={view === 'billing' ? 'billing' : 'general'} 
                  onMenuToggle={() => setMenuOpen(true)}
                  isBanned={isBanned}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center p-8 bg-muted/20">
                  <div className="max-w-md text-center space-y-6">
                    <div className="w-20 h-20 bg-card border border-border rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/5 animate-bounce">
                      <Activity size={40} className="text-primary" />
                    </div>
                    <h3 className="text-3xl font-black tracking-tighter">{view.charAt(0).toUpperCase() + view.slice(1)} Coming Soon</h3>
                    <p className="text-muted-foreground font-medium leading-relaxed">
                      We're currently building the {view} section. Check back soon for the updated experience!
                    </p>
                    <button onClick={() => setView('home')} className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-black text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                      Back to Dashboard
                    </button>
                  </div>
                </div>
              )}

              {showConnectIG && (
                <InstagramConnect 
                  onBack={() => setShowConnectIG(false)} 
                  connectUrl={connectUrl} 
                  igConnected={igConnected}
                  igUsername={igUsername}
                  igImage={igImage}
                  onLogout={() => signOut()}
                />
              )}

              {/* Global Upgrade Modal */}
              {showUpgradeModal && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={() => setShowUpgradeModal(false)} />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="relative bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto md:overflow-hidden shadow-2xl flex flex-col z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                      <button 
                        onClick={() => setShowUpgradeModal(false)}
                        className="absolute top-6 right-6 z-50 p-2.5 rounded-xl bg-muted border border-border text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all shadow-lg"
                      >
                        <X size={18} />
                      </button>

                      <div className="flex-1 flex flex-col md:flex-row md:overflow-hidden">
                         <div className="flex-1 p-8 md:p-12 bg-gradient-to-br from-card to-primary/10 flex flex-col justify-center">
                            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-primary/20 rotate-3">
                              <Crown size={32} className="text-white" />
                            </div>
                            <h2 className="text-4xl font-black tracking-tight mb-4 leading-[1.1] text-foreground">
                              Unlock your <span className="text-primary">Growth</span>
                            </h2>
                            <p className="text-muted-foreground font-bold mb-10 text-[13px]">Scale beyond the limits of the free plan.</p>
                            
                            <div className="space-y-4">
                               {[
                                 "Remove FlowStudio Branding",
                                 "Unlimited DM Automations",
                                 "Unlimited Contacts & Leads",
                                 "Follower Growth Feature",
                                 "Retrigger Comments Anytime"
                               ].map(f => (
                                 <div key={f} className="flex items-center gap-4 text-xs font-bold text-foreground/80 group">
                                   <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                     <CheckCircle size={14} />
                                   </div>
                                   {f}
                                 </div>
                               ))}
                            </div>
                         </div>

                         <div className="w-full md:w-[420px] p-8 md:p-12 bg-card border-t md:border-t-0 md:border-l border-border flex flex-col justify-center">
                            <div className="space-y-4">
                              <button 
                                onClick={() => setBillingCycle('monthly')}
                                className={`w-full p-6 rounded-3xl border-2 transition-all relative overflow-hidden group ${billingCycle === 'monthly' ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' : 'border-border hover:border-primary/50'}`}
                              >
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${billingCycle === 'monthly' ? 'border-primary' : 'border-muted'}`}>
                                        {billingCycle === 'monthly' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                                      </div>
                                      <span className="text-sm font-bold">Monthly</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-2xl font-black">₹{pricing.monthly}</span>
                                      <span className="text-[10px] text-muted-foreground font-bold">/mo</span>
                                    </div>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground font-medium ml-8">Perfect for getting started</p>
                              </button>

                              <button 
                                onClick={() => setBillingCycle('yearly')}
                                className={`w-full p-6 rounded-3xl border-2 transition-all relative overflow-hidden group ${billingCycle === 'yearly' ? 'border-green-500 bg-green-500/5 shadow-xl shadow-green-500/10' : 'border-border hover:border-green-500/50'}`}
                              >
                                  <div className="absolute top-0 right-0 px-3 py-1 bg-green-500 text-white text-[9px] font-black uppercase rounded-bl-xl tracking-tighter">Save 20%</div>
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${billingCycle === 'yearly' ? 'border-green-500' : 'border-muted'}`}>
                                        {billingCycle === 'yearly' && <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />}
                                      </div>
                                      <span className="text-sm font-bold">Annual</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-2xl font-black">₹{pricing.yearly}</span>
                                      <span className="text-[10px] text-muted-foreground font-bold">/mo</span>
                                    </div>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground font-medium ml-8">Billed yearly (Total ₹{pricing.totalYearly})</p>
                              </button>
                            </div>

                            <button 
                              disabled={isProcessing}
                              onClick={handleUpgradeNowClick}
                              className="w-full mt-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                              {isProcessing ? "Processing..." : "Upgrade Now"}
                            </button>

                            <p className="mt-6 text-[9px] text-muted-foreground text-center font-medium leading-relaxed">
                              <span className="font-bold text-foreground">Price Lock Guarantee:</span> You will keep paying this price as long as you remain subscribed.
                            </p>
                         </div>
                      </div>

                      <div className="p-4 bg-muted/10 border-t border-border flex justify-center">
                        <button 
                          onClick={() => setShowUpgradeModal(false)} 
                          className="text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors py-2 px-4"
                        >
                          Maybe later
                        </button>
                      </div>
                  </motion.div>
                </div>
              )}

              {/* Billing Details Modal */}
              {showBillingModal && (
                <div className="fixed inset-0 z-[1000] flex flex-col items-center overflow-y-auto p-4 md:p-6">
                  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowBillingModal(false)} />
                  <div className="relative w-full max-w-4xl bg-background border border-border rounded-[24px] md:rounded-[32px] shadow-2xl flex flex-col md:flex-row md:max-h-[90vh] my-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                    
                    {/* Left Side: Form */}
                    <div className="flex-1 p-6 md:p-12 md:overflow-y-auto custom-scrollbar">
                      <div className="flex items-center gap-3 mb-6 md:mb-8">
                        <button onClick={handleBillingBack} className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground group">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:-translate-x-0.5 transition-transform"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>
                        <div>
                          <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">Billed To</h2>
                          <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">Checkout Information</p>
                        </div>
                      </div>

                      <div className="space-y-5 md:space-y-6">
                        {/* Full Name */}
                        <div>
                          <label className="block text-[10px] md:text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1">Full Name</label>
                          <div className={`flex items-center rounded-2xl border transition-all duration-200 ${
                            billingErrors.fullName ? 'border-destructive bg-destructive/5' : 'border-border bg-muted/20 focus-within:bg-background focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10'
                          }`}>
                            <input
                              type="text"
                              placeholder="Your full name"
                              value={billingDetails.fullName}
                              onChange={e => { setBillingDetails(p => ({...p, fullName: e.target.value})); setBillingErrors(p => ({...p, fullName: ''})); }}
                              className="flex-1 px-4 md:px-5 py-3.5 md:py-4 text-sm font-black bg-transparent outline-none placeholder:text-muted-foreground/30"
                            />
                          </div>
                          {billingErrors.fullName && <p className="text-destructive text-[10px] font-bold mt-1.5 ml-1">{billingErrors.fullName}</p>}
                        </div>

                        {/* Phone Number */}
                        <div>
                          <label className="block text-[10px] md:text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1">Phone Number</label>
                          <PhoneInput
                            value={billingDetails.phone}
                            country={billingDetails.phoneCountry}
                            onPhoneChange={val => { setBillingDetails(p => ({...p, phone: val})); setBillingErrors(p => ({...p, phone: ''})); }}
                            onCountryChange={c => setBillingDetails(p => ({...p, phoneCountry: c.name}))}
                            error={billingErrors.phone}
                          />
                          {billingErrors.phone && <p className="text-destructive text-[10px] font-bold mt-1.5 ml-1">{billingErrors.phone}</p>}
                        </div>

                        <div className="pt-5 md:pt-6 mt-5 md:mt-6 border-t border-border/50">
                          <div className="flex items-center gap-3 mb-5 md:mb-6">
                            <div className="p-2 md:p-2.5 bg-primary/10 rounded-xl">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-base md:text-lg font-black tracking-tight text-foreground">Billing Address</h3>
                              <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global Support</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] md:text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1">Country</label>
                              <CountrySelector
                                value={billingDetails.billingCountry}
                                onChange={c => { setBillingDetails(p => ({...p, billingCountry: c.name})); setBillingErrors(p => ({...p, country: ''})); }}
                                error={billingErrors.country}
                              />
                              {billingErrors.country && <p className="text-destructive text-[10px] font-bold mt-1.5 ml-1">{billingErrors.country}</p>}
                            </div>

                            <div>
                              <label className="block text-[10px] md:text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1">State / Province</label>
                              <div className="flex items-center rounded-2xl border border-border bg-muted/20 focus-within:bg-background focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-200">
                                <input
                                  type="text"
                                  placeholder="e.g. New York"
                                  value={billingDetails.state}
                                  onChange={e => setBillingDetails(p => ({...p, state: e.target.value}))}
                                  className="flex-1 px-4 md:px-5 py-3.5 md:py-4 text-sm font-black bg-transparent outline-none placeholder:text-muted-foreground/30"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Summary Card */}
                    <div className="w-full md:w-[360px] bg-muted/30 p-6 pb-12 md:p-12 border-t md:border-t-0 md:border-l border-border flex flex-col justify-between relative md:overflow-hidden">
                      <div className="absolute top-[-10%] right-[-10%] w-[150px] md:w-[200px] h-[150px] md:h-[200px] bg-primary/10 blur-[60px] md:blur-[80px] rounded-full" />
                      
                      <div className="relative z-10">
                        <div className="mb-8 flex justify-between items-center">
                          <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Order Summary</h3>
                          <button onClick={() => setShowBillingModal(false)} className="p-2 -mr-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                          </button>
                        </div>
                        
                        <div className="bg-background border border-border rounded-[24px] p-6 shadow-xl shadow-primary/5 mb-8">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 12l10 5 10-5M2 17l10 5 10-5"/></svg>
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-foreground uppercase">{billingCycle === 'monthly' ? 'Monthly' : 'Annual'} Plan</h4>
                              <p className="text-[10px] font-bold text-muted-foreground">Premium Access</p>
                            </div>
                          </div>
                          <div className="pt-4 border-t border-border/50 flex justify-between items-end">
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Payable</span>
                              <p className="text-2xl font-black text-foreground tracking-tight">₹{billingCycle === 'monthly' ? pricing.monthly : pricing.totalYearly}</p>
                            </div>
                            {billingCycle === 'yearly' && (
                              <div className="px-2 py-1 bg-green-500/10 text-green-500 rounded-md text-[9px] font-black uppercase">Save 20%</div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4 px-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-muted-foreground">Subscription Fee</span>
                            <span className="text-xs font-black text-foreground">₹{billingCycle === 'monthly' ? pricing.monthly : pricing.totalYearly}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-muted-foreground">GST / Taxes</span>
                            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Included</span>
                          </div>
                        </div>
                      </div>

                      <div className="relative z-10 pt-6 md:pt-8">
                        <button
                          onClick={handleProceedToPayment}
                          disabled={isProcessing}
                          className="w-full bg-primary hover:bg-primary/90 text-white py-4.5 rounded-2xl font-black text-sm shadow-xl shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 group flex items-center justify-center gap-2"
                        >
                          {isProcessing ? (
                            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                          ) : (
                            <>
                              <span>Proceed to Pay</span>
                              <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </>
                          )}
                        </button>
                        <div className="mt-4 flex flex-col items-center gap-2">
                          <div className="flex items-center gap-1.5 opacity-40">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest text-center">Secured by Razorpay</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}