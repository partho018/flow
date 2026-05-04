"use client";
import { useState, useEffect } from "react";
import { 
  User, Shield, Instagram, CreditCard, Bell, 
  ChevronRight, CheckCircle, AlertTriangle, 
  Mail, Phone, Lock, Eye, EyeOff, LogOut, Trash2, X, Menu
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

export function SettingsView({ plan, igConnected, igUsername, igImage, onUpgrade, onDisconnect, userEmail, userName, hasPassword, initialTab = 'general', onMenuToggle, isBanned }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passVisible, setPassVisible] = useState(false);
  const [passLoad, setPassLoad] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [twoFactor, setTwoFactor] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [modalStep, setModalStep] = useState('select'); // select, card, paypal
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState({ type: 'VISA', last4: '4242', expiry: '12/28' });
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Load Razorpay Script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async (amount = 499) => {
    setIsProcessing(true);
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsProcessing(false);
      return;
    }

    // Create Order on Server
    const data = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    }).then((t) => t.json());

    if (data.error) {
      alert("Failed to create order");
      setIsProcessing(false);
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
      amount: data.amount,
      currency: data.currency,
      name: "Instagram Automation",
      description: "Subscription Plan Upgrade",
      order_id: data.id,
      handler: async function (response) {
        // Verify payment on server
        const verifyRes = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        }).then((t) => t.json());

        if (verifyRes.status === "success") {
          setPaymentMethod({ type: 'Razorpay', email: userEmail || "Verified" });
          setShowPaymentModal(false);
          alert("Payment Successful!");
        } else {
          alert("Payment Verification Failed");
        }
        setIsProcessing(false);
      },
      prefill: {
        name: userName,
        email: userEmail,
      },
      theme: {
        color: "#000000",
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

  const firstName = userName ? userName.split(' ')[0] : '';
  const lastName = userName ? userName.split(' ').slice(1).join(' ') : '';

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <header className="h-14 flex items-center px-6 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10 gap-3">
        <button className="md:hidden p-1.5 text-foreground" onClick={onMenuToggle}>
          <Menu size={18} />
        </button>
        <h2 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60">Settings</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Tabs */}
          <aside className="w-full lg:w-60 space-y-6">
            <div className="space-y-1 p-2 rounded-[8px] bg-card border border-border shadow-sm">
              <div className="px-3 py-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">
                Account Settings
              </div>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-[8px] transition-all duration-300 group relative ${
                    activeTab === tab.id 
                      ? "text-primary bg-primary/[0.03]" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-[8px] transition-colors ${
                    activeTab === tab.id ? "bg-primary/10" : "bg-muted/50 border border-border group-hover:border-primary/30"
                  }`}>
                    <tab.icon size={16} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                  </div>
                  <span className="text-xs font-black tracking-tight">{tab.label}</span>
                  
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute left-0 w-1 h-5 bg-primary rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </aside>

          {/* Content Area */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                className="space-y-6"
              >
                {activeTab === 'general' && (
                  <section className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold tracking-tight mb-0.5">General Information</h3>
                      <p className="text-muted-foreground text-xs font-medium">Update your profile and contact details.</p>
                    </div>
                    <div className="p-6 rounded-[8px] bg-card border border-border space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">First Name</label>
                          <input defaultValue={firstName} className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-[8px] text-xs focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Last Name</label>
                          <input defaultValue={lastName} className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-[8px] text-xs focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
                          <input defaultValue={userEmail} className="w-full pl-11 pr-4 py-2.5 bg-muted/30 border border-border rounded-[8px] text-xs focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-[8px] font-bold text-xs hover:brightness-110 transition-all">
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </section>
                )}

                {activeTab === 'instagram' && (
                  <section className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold tracking-tight mb-0.5">Instagram Connection</h3>
                      <p className="text-muted-foreground text-xs font-medium">Manage your linked Instagram account.</p>
                    </div>
                    <div className="p-6 rounded-[8px] bg-card border border-border">
                      {igConnected ? (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between p-4 rounded-[8px] bg-muted/20 border border-border/50">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 p-0.5">
                                <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                                  {igImage ? <img src={igImage} className="w-full h-full object-cover" /> : <Instagram size={20} className="text-muted-foreground" />}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-base font-bold tracking-tight">@{igUsername}</h4>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <CheckCircle size={12} className="text-green-500" />
                                  <span className="text-[9px] font-bold text-green-600 uppercase tracking-widest">Connected</span>
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={onDisconnect}
                              disabled={isBanned}
                              className={`px-4 py-2 bg-destructive/5 text-destructive rounded-[8px] font-bold text-[10px] hover:bg-destructive hover:text-destructive-foreground transition-all ${isBanned ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              Disconnect
                            </button>
                          </div>
                          
                          <div className="grid gap-2">
                            {['Read Profile Info', 'Send & Manage Messages', 'Manage Comments'].map(p => (
                              <div key={p} className="flex items-center justify-between p-3 rounded-[8px] bg-muted/10 border border-border/40 text-[10px] font-bold uppercase tracking-wide">
                                <span>{p}</span>
                                <CheckCircle size={12} className="text-primary" />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <div className="w-14 h-14 bg-muted/50 rounded-[8px] flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                            <Instagram size={28} />
                          </div>
                          <h4 className="text-base font-bold mb-1">No account connected</h4>
                          <p className="text-muted-foreground text-xs font-medium mb-6">Connect your Instagram Business account.</p>
                          <a href={isBanned ? '#' : '/api/auth/connect'} className={`inline-flex items-center justify-center gap-2 px-8 py-2.5 bg-primary text-primary-foreground rounded-[8px] font-bold text-xs transition-all ${isBanned ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}>
                            <Instagram size={16} /> Connect Account
                          </a>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {activeTab === 'billing' && (
                  <section className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold tracking-tight mb-0.5">Billing & Plans</h3>
                      <p className="text-muted-foreground text-xs font-medium">Manage your subscription.</p>
                    </div>
                    <div className="grid gap-4">
                      <div className="p-6 rounded-[8px] bg-card border border-border flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Current Plan</p>
                          <h4 className="text-xl font-bold tracking-tight uppercase">{plan}</h4>
                        </div>
                        <button 
                          onClick={onUpgrade} 
                          disabled={isBanned}
                          className={`px-6 py-2 bg-primary text-primary-foreground rounded-[8px] font-bold text-xs hover:brightness-110 transition-all ${isBanned ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Upgrade Plan
                        </button>
                      </div>
                      <div className="p-6 rounded-[8px] bg-card border border-border">
                         <div className="flex items-center justify-between mb-4">
                           <h4 className="text-sm font-bold">Payment Method</h4>
                           <button 
                            disabled={isBanned}
                            onClick={() => {
                              setModalStep('select');
                              setShowPaymentModal(true);
                            }}
                            className="text-[10px] font-bold text-primary hover:underline"
                           >
                             Update
                           </button>
                         </div>
                         <div className="flex items-center gap-3 p-3 rounded-[8px] bg-muted/20 border border-border/40">
                            <div className="w-10 h-6 bg-card border border-border rounded-[8px] flex items-center justify-center font-bold text-[8px] uppercase">{paymentMethod.type}</div>
                            <div>
                               <p className="text-xs font-bold">{paymentMethod.type === 'PayPal' ? paymentMethod.email : `•••• ${paymentMethod.last4}`}</p>
                               <p className="text-[9px] text-muted-foreground font-medium">{paymentMethod.type === 'PayPal' ? 'Connected' : `Expires ${paymentMethod.expiry}`}</p>
                            </div>
                         </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Other tabs can have placeholders or similar designs */}
                {activeTab === 'security' && (
                  <section className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold tracking-tight mb-0.5">Security Settings</h3>
                      <p className="text-muted-foreground text-xs font-medium">Protect your account with advanced security features.</p>
                    </div>

                    {/* Password Section */}
                    <div className="p-6 rounded-[8px] bg-card border border-border space-y-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-[8px] bg-primary/10 text-primary flex items-center justify-center">
                            <Lock size={16} />
                          </div>
                          <h4 className="text-sm font-bold">Change Password</h4>
                        </div>
                        {hasPassword && (
                          <button 
                            type="button" 
                            onClick={() => setPassVisible(!passVisible)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {passVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        )}
                      </div>
                      
                      <div className={`space-y-4 ${!hasPassword ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Current Password</label>
                          <input 
                            type={passVisible ? "text" : "password"} 
                            placeholder="••••••••" 
                            value={passwords.current}
                            onChange={e => setPasswords({...passwords, current: e.target.value})}
                            className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-[8px] text-xs outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">New Password</label>
                            <input 
                              type={passVisible ? "text" : "password"} 
                              placeholder="••••••••" 
                              value={passwords.new}
                              onChange={e => setPasswords({...passwords, new: e.target.value})}
                              className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-[8px] text-xs outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Confirm New Password</label>
                            <input 
                              type={passVisible ? "text" : "password"} 
                              placeholder="••••••••" 
                              value={passwords.confirm}
                              onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                              className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-[8px] text-xs outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                            />
                          </div>
                        </div>
                      </div>

                      {!hasPassword && (
                        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-[8px] flex items-center gap-3">
                          <AlertTriangle size={14} className="text-amber-500" />
                          <p className="text-[10px] font-medium text-amber-700">
                            Your account is linked with <span className="font-bold">Google</span>. Password management is handled through your Google Account settings.
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <button 
                          onClick={() => {
                            if (!hasPassword) showToast("Please use Google Account settings to reset your password.");
                            else showToast("Feature coming soon: Password reset via email.");
                          }}
                          className="text-[10px] font-bold text-primary hover:underline"
                        >
                          Forgot password?
                        </button>
                        <button 
                          disabled={!hasPassword || passLoad || isBanned}
                          onClick={async () => {
                            if (passwords.new !== passwords.confirm) return showToast("Passwords do not match");
                            if (passwords.new.length < 6) return showToast("Password must be at least 6 characters");
                            
                            setPassLoad(true);
                            try {
                              const res = await fetch('/api/user/password', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ current: passwords.current, new: passwords.new })
                              });
                              const data = await res.json();
                              if (res.ok) {
                                showToast("Password updated successfully!");
                                setPasswords({ current: '', new: '', confirm: '' });
                              } else {
                                showToast(data.error || "Failed to update password");
                              }
                            } catch {
                              showToast("Connection error");
                            } finally {
                              setPassLoad(false);
                            }
                          }}
                          className="px-6 py-2 bg-primary text-primary-foreground rounded-[8px] font-bold text-xs hover:brightness-110 transition-all disabled:opacity-50"
                        >
                          {passLoad ? "Updating..." : "Update Password"}
                        </button>
                      </div>
                    </div>

                    {/* 2FA Section */}
                    <div className="p-6 rounded-[8px] bg-card border border-border flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-[8px] bg-green-500/10 text-green-600 flex items-center justify-center">
                          <Shield size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold">Two-Factor Authentication</h4>
                          <p className="text-[10px] text-muted-foreground font-medium">Add an extra layer of security to your account.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setTwoFactor(!twoFactor)}
                        className={`relative w-10 h-5 rounded-[8px] transition-colors duration-200 focus:outline-none ${twoFactor ? 'bg-primary' : 'bg-muted'}`}
                      >
                        <motion.div 
                          animate={{ x: twoFactor ? 20 : 2 }}
                          className="absolute top-1 w-3 h-3 bg-white rounded-[8px] shadow-sm"
                        />
                      </button>
                    </div>
                  </section>
                )}

                {activeTab === 'notifications' && (
                   <div className="p-20 text-center rounded-[8px] bg-muted/20 border-2 border-dashed border-border">
                      <h4 className="text-base font-bold mb-1">Refining notifications...</h4>
                      <p className="text-xs text-muted-foreground">This section is being updated with advanced features.</p>
                   </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
      {/* Payment Method Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowPaymentModal(false)} 
              className="absolute inset-0 bg-background/80 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative bg-card border border-border rounded-[8px] w-full max-w-md overflow-hidden shadow-2xl flex flex-col z-10"
            >
               <div className="p-6 border-b border-border flex items-center justify-between">
                 <button type="button" onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-muted rounded-[8px] transition-all"><X size={18} /></button>
               </div>
               <div className="p-6 space-y-4">
                  <AnimatePresence mode="wait">
                    {modalStep === 'select' && (
                      <motion.div 
                        key="select"
                        initial={{ opacity: 0, x: 10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                        <p className="text-xs text-muted-foreground font-medium mb-2">Choose your preferred payment method:</p>
                        
                        <button 
                          type="button"
                          onClick={() => setModalStep('card')}
                          className="w-full flex items-center gap-4 p-4 rounded-[8px] border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                        >
                          <div className="w-12 h-12 bg-primary/10 rounded-[8px] flex items-center justify-center text-primary">
                            <CreditCard size={24} />
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-sm font-bold">Credit or Debit Card</p>
                            <p className="text-[10px] text-muted-foreground">Visa, Mastercard, AMEX</p>
                          </div>
                          <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                        </button>

                        <button 
                          type="button"
                          onClick={() => setModalStep('paypal')}
                          className="w-full flex items-center gap-4 p-4 rounded-[8px] border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                        >
                          <div className="w-12 h-12 bg-blue-500/10 rounded-[8px] flex items-center justify-center text-blue-600">
                            <span className="font-black text-xl italic">P</span>
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-sm font-bold">PayPal</p>
                            <p className="text-[10px] text-muted-foreground">Pay with your PayPal account</p>
                          </div>
                          <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                        </button>
                      </motion.div>
                    )}

                    {modalStep === 'card' && (
                      <motion.div 
                        key="card"
                        initial={{ opacity: 0, x: 10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Card Number</label>
                          <input 
                            type="text" 
                            placeholder="0000 0000 0000 0000" 
                            value={cardDetails.number}
                            onChange={e => setCardDetails({...cardDetails, number: e.target.value})}
                            className="w-full px-4 py-3 bg-muted/30 border border-border rounded-[8px] text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Expiry Date</label>
                            <input 
                              type="text" 
                              placeholder="MM/YY" 
                              value={cardDetails.expiry}
                              onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})}
                              className="w-full px-4 py-3 bg-muted/30 border border-border rounded-[8px] text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">CVC</label>
                            <input 
                              type="text" 
                              placeholder="123" 
                              value={cardDetails.cvc}
                              onChange={e => setCardDetails({...cardDetails, cvc: e.target.value})}
                              className="w-full px-4 py-3 bg-muted/30 border border-border rounded-[8px] text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                            />
                          </div>
                        </div>
                        <button 
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleRazorpayPayment()}
                          className="w-full py-3 bg-primary text-primary-foreground rounded-[8px] font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                          {isProcessing ? "Processing..." : "Pay & Save Card"}
                        </button>
                        <button type="button" onClick={() => setModalStep('select')} className="w-full text-xs font-bold text-muted-foreground hover:text-foreground transition-all">Go Back</button>
                      </motion.div>
                    )}

                    {modalStep === 'paypal' && (
                      <motion.div 
                        key="paypal"
                        initial={{ opacity: 0, x: 10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-6 py-4 text-center"
                      >
                         <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-600 mx-auto">
                            <span className="font-black text-4xl italic">P</span>
                         </div>
                         <div>
                            <h4 className="text-base font-bold mb-1">Connect PayPal</h4>
                            <p className="text-xs text-muted-foreground">You'll be redirected to PayPal to verify your account.</p>
                         </div>
                         <button 
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleRazorpayPayment()}
                          className="w-full py-3 bg-[#0070ba] text-white rounded-[8px] font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                        >
                          {isProcessing ? "Connecting..." : "Pay with PayPal / Razorpay"}
                        </button>
                        <button type="button" onClick={() => setModalStep('select')} className="w-full text-xs font-bold text-muted-foreground hover:text-foreground transition-all">Go Back</button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-4 flex justify-center border-t border-border/40 mt-4">
                    <p className="text-[9px] text-muted-foreground font-medium flex items-center gap-1.5">
                      <Shield size={10} /> Secure encrypted payments powered by Stripe
                    </p>
                  </div>
               </div>


            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-[200] px-6 py-3 bg-ink text-white rounded-[8px] shadow-2xl flex items-center gap-3 border border-white/10"
          >
            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <CheckCircle size={12} color="#fff" />
            </div>
            <span className="text-xs font-bold">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

