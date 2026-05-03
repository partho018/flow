"use client";
import { Zap, Home, MessageSquare, Users, Settings, LogOut, Sun, Moon, Crown, Instagram, Send, UserSquare, CreditCard, X, ShoppingBag, Plus } from "lucide-react";
import { motion } from "framer-motion";

export function Sidebar({ activeView, onViewChange, isDarkMode, onToggleDarkMode, plan, igUsername, igImage, igConnected, userEmail, onUpgrade, onLogout, isOpen, onClose, onNew }) {
  const NAV = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'automations', icon: Zap, label: 'Automations' },
    { id: 'contacts', icon: UserSquare, label: 'Contacts' },
    { id: 'products', icon: ShoppingBag, label: 'Products', badge: 'New' },
    { id: 'billing', icon: CreditCard, label: 'Billing' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const PLAN_DMS = { free: 50, creator: 2000, pro: 10000, business: 50000 };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden" 
          onClick={onClose}
        />
      )}

      <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-card border-r border-border flex flex-col z-[70] transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand */}
        <div className="p-5 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/10">
              <Zap size={16} className="text-primary-foreground fill-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-foreground">FlowStudio</h1>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{plan} Plan</p>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden p-1 hover:bg-muted rounded-lg transition-colors">
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {/* Profile Card */}
          <div className="mb-6">
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40 group hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                      {igConnected && igImage ? (
                        <img src={igImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <Instagram size={14} className="text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  {igConnected && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-card rounded-full" />}
                </div>
                <div className="min-width-0 overflow-hidden">
                  <p className="text-xs font-bold text-foreground truncate">@{igUsername || 'Connect IG'}</p>
                  <p className="text-[9px] text-muted-foreground truncate font-medium">{userEmail || 'Active now'}</p>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[9px] font-bold mb-1 uppercase tracking-tight">
                    <span className="text-muted-foreground flex items-center gap-1"><Send size={8} /> DMs Used</span>
                    <span className="text-foreground">0 / {PLAN_DMS[plan]?.toLocaleString()}</span>
                  </div>
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "2%" }}
                      className="h-full bg-primary" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Menu</span>
            <button 
              onClick={() => { onViewChange('automations'); onNew(); onClose(); }}
              className="p-1 hover:bg-primary/10 rounded-md text-primary transition-colors group"
              title="Create New Flow"
            >
              <Plus size={14} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
            </button>
          </div>
          <div className="space-y-1 relative">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => { onViewChange(item.id); onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative ${
                  activeView === item.id 
                    ? "text-primary bg-primary/[0.04]" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <item.icon 
                  size={18} 
                  strokeWidth={activeView === item.id ? 2.5 : 2}
                  className={activeView === item.id ? "text-primary" : "transition-transform group-hover:scale-105"} 
                />
                <span className="text-xs font-black tracking-tight flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                    activeView === item.id 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted text-muted-foreground/60'
                  }`}>
                    {item.badge}
                  </span>
                )}
                
                {activeView === item.id && (
                  <motion.div 
                    layoutId="sidebarActiveIndicator"
                    className="absolute left-0 w-1 h-5 bg-primary rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-muted/10">
          <button 
            onClick={() => { onUpgrade(); onClose(); }}
            className="w-full mb-2 flex items-center justify-center gap-2 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:brightness-110 transition-all"
          >
            <Crown size={14} /> Upgrade Plan
          </button>
          
          <div className="flex gap-2">
            <button 
              onClick={onToggleDarkMode}
              className="flex-1 flex items-center justify-center p-2 rounded-md bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button 
              onClick={onLogout}
              className="flex-1 flex items-center justify-center p-2 rounded-md bg-card border border-border text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
