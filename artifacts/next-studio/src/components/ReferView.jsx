"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Check, CircleDollarSign, Users, Gift, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ReferView({ onMenuToggle, userName }) {
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Generate dynamic referral link based on current domain and username
  const domain = typeof window !== 'undefined' ? window.location.origin : 'https://linkplease.co';
  const userSlug = userName ? userName.toLowerCase().replace(/\s+/g, '-') : 'user';
  const referralLink = `${domain}?ref=${userSlug}`;

  useEffect(() => {
    fetch('/api/referrals')
      .then(res => res.json())
      .then(data => {
        if (data.referrals) setReferrals(data.referrals);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch referrals:", err);
        setLoading(false);
      });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#f8f9fc] dark:bg-[#0a0a0b]">
      {/* Header */}
      <header className="p-6 md:p-8 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border/50">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuToggle}
            className="md:hidden p-2 hover:bg-muted rounded-[8px] transition-colors"
          >
            <div className="w-5 h-0.5 bg-foreground mb-1" />
            <div className="w-5 h-0.5 bg-foreground mb-1" />
            <div className="w-5 h-0.5 bg-foreground" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">Refer & Earn</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">Affiliate Dashboard</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full space-y-6">
        {/* Commission Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#fffbeb] dark:bg-yellow-500/5 border border-yellow-200/50 dark:border-yellow-500/20 rounded-[16px] p-6 flex items-start gap-4"
        >
          <div className="w-12 h-12 rounded-[12px] bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/20 shrink-0">
            <Gift size={24} className="text-yellow-900" />
          </div>
          <div>
            <h2 className="text-lg font-black text-yellow-900 dark:text-yellow-500 tracking-tight">Earn 25% commission</h2>
            <p className="text-sm text-yellow-800/80 dark:text-yellow-500/80 font-medium">
              You get 25% of the revenue from every paid user you refer for the first 11 months.
            </p>
          </div>
        </motion.div>

        {/* Referral Link Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-[16px] p-6 md:p-8 shadow-sm"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Share2 size={16} className="text-primary" />
              Your Referral Link
            </div>
            
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative group">
                <input 
                  type="text" 
                  readOnly 
                  value={referralLink}
                  className="w-full h-12 px-4 rounded-[12px] bg-muted/30 border border-border text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <button 
                onClick={handleCopy}
                className="h-12 px-6 bg-primary text-primary-foreground rounded-[12px] font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Referrals Table Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-[16px] overflow-hidden shadow-sm flex flex-col min-h-[300px]"
        >
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-primary" />
              <h3 className="text-sm font-bold text-foreground">Your Referrals <span className="text-muted-foreground ml-1">({referrals.length})</span></h3>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col overflow-x-auto">
            {loading ? (
              <div className="flex-1 flex items-center justify-center p-12">
                <Loader2 size={24} className="text-primary animate-spin" />
              </div>
            ) : referrals.length > 0 ? (
              <table className="w-full text-left">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">User</th>
                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Plan</th>
                    <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {referrals.map((user, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">{user.name}</p>
                            <p className="text-[10px] text-muted-foreground font-medium">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full ${
                          user.plan === 'pro' || user.plan === 'business' 
                            ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                            : 'bg-muted text-muted-foreground border border-border'
                        }`}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[10px] font-bold text-muted-foreground">
                        {user.joined}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                  <Users size={32} className="text-muted-foreground/40" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-foreground">No referrals yet</p>
                  <p className="text-xs text-muted-foreground font-medium">Share your link to start earning!</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
