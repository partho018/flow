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
import { SettingsView } from "./components/SettingsView";
import { ContactsView } from "./components/ContactsView";
import { InstagramConnect } from "./components/InstagramConnect";
import { ProductsView } from "./components/ProductsView";
import { CountrySelector, PhoneInput, COUNTRIES } from "./components/CountrySelector";
import { LoadingScreen } from "./components/LoadingScreen";


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
  const [pricing, setPricing] = useState({ monthly: 499, yearly: 399, totalYearly: 4788, coupons: [{ code: 'SAVE50', type: 'percentage', value: 50 }] });
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [showConnectIG, setShowConnectIG] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [billingDetails, setBillingDetails] = useState({ fullName: '', phone: '', phoneCountry: 'India', billingCountry: 'India', state: '' });
  const [billingErrors, setBillingErrors] = useState({});
  const [userStatus, setUserStatus] = useState('active'); // Added to track ban status
  const [announcement, setAnnouncement] = useState(null);
  const [showAnn, setShowAnn] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [systemLoading, setSystemLoading] = useState(true);

  const [pageLoading, setPageLoading] = useState(true);
  const [authed, setAuthed] = useState(true);

  const { data: session, status } = useSession();
  const [userName, setUserName] = useState('');

  // Initial Page Load Animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 400); // 100ms for a super snappy feel

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
      
      fetch('/api/settings?global=true')
        .then(res => res.json())
        .then(data => {
          if (data.settings?.pricing) setPricing(data.settings.pricing);
        })
        .catch(err => console.error("Failed to load global pricing:", err));

      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          if (data.settings?.automations) setAutomations(data.settings.automations);
        })
        .catch(err => console.error("Failed to load user settings:", err));

      // Fetch IG Stats
      fetch('/api/stats')
        .then(res => {
          if (res.status === 404 || res.status === 401) {
            signOut(); // User deleted or unauthorized, kick them out
            throw new Error("Unauthorized");
          }
          return res.json();
        })
        .then(data => {
          if (!data || data.error) {
            if (data?.error === 'User not found') signOut();
            return;
          }
          
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
        })
        .catch(err => console.error("Failed to load stats:", err));

    }
    
    // Fetch System Status (Maintenance Mode)
    fetch('/api/system-status')
      .then(res => res.json())
      .then(data => {
        setIsMaintenance(data.maintenance);
        setSystemLoading(false);
      })
      .catch(() => setSystemLoading(false));

    // Fetch Announcement (Global - shows even for unauthenticated users if desired)
    fetch('/api/announcement', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data && data.enabled) {
          setAnnouncement(data);
          setShowAnn(true);
        } else {
          setShowAnn(false);
        }
      })
      .catch(err => console.error("Failed to load announcement:", err));
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
  const handleUpgradeNowClick = async () => {
    // Re-fetch latest pricing and coupons before showing billing modal
    try {
      const res = await fetch('/api/settings?global=true');
      if (res.ok) {
        const data = await res.json();
        if (data.settings?.pricing) setPricing(data.settings.pricing);
      }
    } catch (e) {
      console.error("Failed to refresh global pricing:", e);
    }

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

  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponInput) return;
    
    const code = couponInput.toUpperCase();
    const found = pricing.coupons?.find(c => c.code === code);
    
    if (found) {
      setAppliedCoupon(found);
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code');
    }
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
    let baseAmount = billingCycle === 'monthly' ? pricing.monthly : pricing.totalYearly;
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percentage') {
        baseAmount = Math.round(baseAmount * (1 - appliedCoupon.value / 100));
      } else {
        baseAmount = Math.max(0, baseAmount - appliedCoupon.value);
      }
    }
    const amount = baseAmount;
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
  const handleNew = (initialData = {}) => {
    if (automations.length >= PLAN_LIMITS[plan]) setShowUpgradeModal(true);
    else setEditing({ id: 'new', ...initialData });
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
  
  // Maintenance Page
  if (isMaintenance && session?.user?.email !== 'parthosamadder00@gmail.com') {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0a0a0b] text-white p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md space-y-6"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/20">
            <Activity size={40} className="text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl font-black tracking-tight">System Maintenance</h1>
          <p className="text-muted-foreground leading-relaxed">
            We're currently performing some scheduled maintenance to improve your experience. 
            We'll be back online shortly. Thank you for your patience!
          </p>
          <div className="pt-8 border-t border-white/5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Status: Offline for updates</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (status === 'loading' || systemLoading) {
    return <LoadingScreen message="Initializing Studio" />;
  }


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
            transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}

          >
            <LoadingScreen message="Optimizing Experience" />
          </motion.div>
        ) : (
          <motion.div 
            key="app"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0 }}

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
                  <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-center relative min-h-[44px]">
                    <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2">
                      <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-black tracking-widest uppercase shrink-0">
                        {announcement.type || 'Update'}
                      </span>
                    </div>
                    
                    <p className="text-xs md:text-sm font-bold tracking-tight text-center px-12">
                      {announcement.text}
                    </p>

                    <button 
                      onClick={() => setShowAnn(false)}
                      className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-[8px] transition-colors shrink-0"
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
                  onViewAutomations={() => setView('automations')}
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
                    <div className="w-20 h-20 bg-card border border-border rounded-[8px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/5 animate-bounce">
                      <Activity size={40} className="text-primary" />
                    </div>
                    <h3 className="text-3xl font-black tracking-tighter">{view.charAt(0).toUpperCase() + view.slice(1)} Coming Soon</h3>
                    <p className="text-muted-foreground font-medium leading-relaxed">
                      We're currently building the {view} section. Check back soon for the updated experience!
                    </p>
                    <button onClick={() => setView('home')} className="px-8 py-3 bg-primary text-primary-foreground rounded-[8px] font-black text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
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
                    className="relative bg-card border border-border rounded-[15px] w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto md:overflow-hidden shadow-2xl flex flex-col z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                      <button 
                        onClick={() => setShowUpgradeModal(false)}
                        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-muted border border-border text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all shadow-lg"
                      >
                        <X size={18} />
                      </button>

                      <div className="flex-1 flex flex-col md:flex-row md:overflow-hidden">
                         <div className="flex-1 p-8 md:p-12 bg-gradient-to-br from-card to-primary/10 flex flex-col justify-center">
                            <div className="w-16 h-16 bg-primary rounded-[8px] flex items-center justify-center mb-8 shadow-xl shadow-primary/20 rotate-3">
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
                                className={`w-full p-6 rounded-[8px] border-2 transition-all relative overflow-hidden group ${billingCycle === 'monthly' ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' : 'border-border hover:border-primary/50'}`}
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
                                className={`w-full p-6 rounded-[8px] border-2 transition-all relative overflow-hidden group ${billingCycle === 'yearly' ? 'border-green-500 bg-green-500/5 shadow-xl shadow-green-500/10' : 'border-border hover:border-green-500/50'}`}
                              >
                                  <div className="absolute top-0 right-0 px-3 py-1 bg-green-500 text-white text-[9px] font-black uppercase rounded-[8px] tracking-tighter">Save 20%</div>
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
                              className="w-full mt-8 py-4 bg-primary text-primary-foreground rounded-[8px] font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                              {isProcessing ? "Processing..." : "Upgrade Now"}
                            </button>

                            <p className="mt-6 text-[9px] text-muted-foreground text-center font-medium leading-relaxed">
                              <span className="font-bold text-foreground">Price Lock Guarantee:</span> You will keep paying this price as long as you remain subscribed.
                            </p>
                         </div>
                      </div>


                  </motion.div>
                </div>
              )}

              {/* Billing Details Modal */}
              {showBillingModal && (
                <div className="fixed inset-0 z-[1000] flex flex-col items-center overflow-y-auto p-4 md:p-6">
                  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowBillingModal(false)} />
                  <div className="relative w-full max-w-4xl bg-background border border-border rounded-[15px] shadow-2xl flex flex-col md:flex-row md:max-h-[90vh] my-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                    
                    {/* Left Side: Form */}
                    <div className="flex-1 p-6 md:p-10 md:overflow-y-auto custom-scrollbar">
                      <div className="flex items-center gap-3 mb-4 md:mb-6">
                        <button onClick={handleBillingBack} className="p-2 -ml-2 rounded-[8px] hover:bg-muted transition-colors text-muted-foreground hover:text-foreground group">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:-translate-x-0.5 transition-transform"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>
                        <div>
                          <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">Billed To</h2>
                          <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">Checkout Information</p>
                        </div>
                      </div>

                      <div className="space-y-3 md:space-y-4">
                        {/* Full Name */}
                        <div className="space-y-1.5 md:space-y-2">
                          <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Users size={12} /> Full Name
                          </label>
                          <input 
                            type="text"
                            value={billingDetails.fullName}
                            onChange={(e) => setBillingDetails({ ...billingDetails, fullName: e.target.value })}
                            placeholder="John Doe"
                            className={`w-full p-3 md:p-4 bg-muted/30 border ${billingErrors.fullName ? 'border-destructive' : 'border-border'} rounded-[12px] text-sm focus:bg-background transition-all outline-none`}
                          />
                        </div>

                        {/* Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div className="space-y-1.5 md:space-y-2">
                            <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                              <Activity size={12} /> Country
                            </label>
                            <CountrySelector 
                              value={billingDetails.phoneCountry} 
                              onChange={(val) => setBillingDetails({ ...billingDetails, phoneCountry: val, billingCountry: val })} 
                            />
                          </div>
                          <div className="space-y-1.5 md:space-y-2">
                            <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                              Phone Number
                            </label>
                            <PhoneInput 
                              country={billingDetails.phoneCountry}
                              value={billingDetails.phone}
                              onChange={(val) => setBillingDetails({ ...billingDetails, phone: val })}
                              error={billingErrors.phone}
                            />
                          </div>
                        </div>

                        {/* State */}
                        <div className="space-y-1.5 md:space-y-2">
                          <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-muted-foreground">State / Province (Optional)</label>
                          <input 
                            type="text"
                            value={billingDetails.state}
                            onChange={(e) => setBillingDetails({ ...billingDetails, state: e.target.value })}
                            placeholder="e.g. West Bengal"
                            className="w-full p-3 md:p-4 bg-muted/30 border border-border rounded-[12px] text-sm focus:bg-background transition-all outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Summary */}
                    <div className="w-full md:w-[320px] bg-muted/30 border-t md:border-t-0 md:border-l border-border p-6 md:p-10 flex flex-col justify-between">
                      <div className="space-y-6 md:space-y-8">
                        <div>
                          <h3 className="text-base md:text-lg font-black tracking-tight mb-4">Summary</h3>
                          <div className="space-y-2 md:space-y-3">
                            <div className="flex justify-between text-xs md:text-sm font-bold text-muted-foreground">
                              <span>Plan</span>
                              <span className="text-foreground">Pro Studio</span>
                            </div>
                            <div className="flex justify-between text-xs md:text-sm font-bold text-muted-foreground">
                              <span>Billing</span>
                              <span className="text-foreground capitalize">{billingCycle}</span>
                            </div>
                            <div className="flex justify-between text-xs md:text-sm font-bold text-muted-foreground">
                              <span>Base Price</span>
                              <span className="text-foreground">₹{billingCycle === 'monthly' ? pricing.monthly : pricing.totalYearly}</span>
                            </div>
                            
                            {appliedCoupon && (
                              <div className="flex justify-between text-xs md:text-sm font-bold text-green-600">
                                <span className="flex items-center gap-1.5"><Zap size={12} /> Discount ({appliedCoupon.code})</span>
                                <span>-{appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}%` : `₹${appliedCoupon.value}`}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3 md:space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Promo Code</label>
                           <div className="flex gap-2">
                             <input 
                              type="text"
                              value={couponInput}
                              onChange={(e) => setCouponInput(e.target.value)}
                              placeholder="CODE"
                              className="flex-1 bg-background border border-border px-3 py-2 rounded-[8px] text-xs font-black outline-none"
                             />
                             <button onClick={handleApplyCoupon} className="px-4 py-2 bg-foreground text-background rounded-[8px] text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all">Apply</button>
                           </div>
                           {couponError && <p className="text-[10px] font-bold text-destructive">{couponError}</p>}
                        </div>
                      </div>

                      <div className="pt-6 md:pt-10 border-t border-border mt-6 md:mt-0">
                        <div className="flex justify-between items-end mb-4 md:mb-6">
                           <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-muted-foreground">Total to pay</span>
                           <span className="text-2xl md:text-3xl font-black tracking-tight text-primary">
                             ₹{(() => {
                                let base = billingCycle === 'monthly' ? pricing.monthly : pricing.totalYearly;
                                if (appliedCoupon) {
                                  if (appliedCoupon.type === 'percentage') base = Math.round(base * (1 - appliedCoupon.value / 100));
                                  else base = Math.max(0, base - appliedCoupon.value);
                                }
                                return base;
                             })()}
                           </span>
                        </div>
                        <button 
                          onClick={handleProceedToPayment}
                          disabled={isProcessing}
                          className="w-full py-3 md:py-4 bg-primary text-primary-foreground rounded-[12px] font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                          {isProcessing ? "Processing..." : "Pay with Razorpay"}
                        </button>
                        <p className="text-[9px] text-center text-muted-foreground font-medium mt-3 md:mt-4 px-2">Secure encrypted payment processing.</p>
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