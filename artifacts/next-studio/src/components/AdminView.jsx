"use client";
import { useState } from "react";
import { Shield, Save, DollarSign, Zap, TrendingUp, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export function AdminView({ pricing, onSavePricing }) {
  const [localPricing, setLocalPricing] = useState({ ...pricing });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSavePricing(localPricing);
    setSaving(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <header className="h-14 flex items-center px-6 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-primary" />
          <h2 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60">Admin Dashboard</h2>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h3 className="text-2xl font-black tracking-tighter mb-1">Platform Controls</h3>
            <p className="text-muted-foreground text-xs font-medium">Manage global settings, pricing, and system parameters.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                    <DollarSign size={20} />
                  </div>
                  <h4 className="text-sm font-bold mb-1">Active Revenue</h4>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Projected this month</p>
                </div>
                <p className="text-2xl font-black mt-4">₹1,24,500</p>
             </div>
             <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
                    <Zap size={20} />
                  </div>
                  <h4 className="text-sm font-bold mb-1">Total Flows</h4>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Across all users</p>
                </div>
                <p className="text-2xl font-black mt-4">12,842</p>
             </div>
             <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center mb-4">
                    <TrendingUp size={20} />
                  </div>
                  <h4 className="text-sm font-bold mb-1">Conversion Rate</h4>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Free to Pro</p>
                </div>
                <p className="text-2xl font-black mt-4">4.2%</p>
             </div>
          </div>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-primary" />
              <h4 className="text-sm font-bold">Subscription Pricing</h4>
            </div>
            
            <div className="p-8 rounded-[32px] bg-card border border-border shadow-xl shadow-black/5 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Monthly Price (₹)</label>
                  <input 
                    type="number" 
                    value={localPricing.monthly} 
                    onChange={e => setLocalPricing({ ...localPricing, monthly: parseInt(e.target.value) })}
                    className="w-full px-5 py-3 bg-muted/30 border border-border rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Yearly Price /mo (₹)</label>
                  <input 
                    type="number" 
                    value={localPricing.yearly} 
                    onChange={e => setLocalPricing({ ...localPricing, yearly: parseInt(e.target.value) })}
                    className="w-full px-5 py-3 bg-muted/30 border border-border rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Total Yearly (₹)</label>
                  <input 
                    type="number" 
                    value={localPricing.totalYearly} 
                    onChange={e => setLocalPricing({ ...localPricing, totalYearly: parseInt(e.target.value) })}
                    className="w-full px-5 py-3 bg-muted/30 border border-border rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-4">
                 <AlertCircle size={20} className="text-amber-600 mt-0.5" />
                 <div>
                    <p className="text-xs font-bold text-amber-900">Important Note</p>
                    <p className="text-[10px] text-amber-700 leading-relaxed font-medium">Changing these prices will immediately affect the Upgrade Modal and checkout pages for all users. Ensure you have coordinated with your billing provider before making changes.</p>
                 </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border/50">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  <Save size={16} /> {saving ? "Saving Changes..." : "Apply Prices Globally"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
