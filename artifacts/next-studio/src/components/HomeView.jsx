"use client";
import { Send, Users, MessageCircle, TrendingUp, ArrowUpRight, Plus, RefreshCw, Instagram, BookOpen, Zap, Menu } from "lucide-react";
import { motion } from "framer-motion";

export function HomeView({ greeting, automations, onNew, igConnected, igUsername, igImage, stats: liveStats, onConnect, onMenuToggle, plan, onUpgrade, userName, isBanned }) {
  const stats = [
    { label: 'DMs Sent Today', value: liveStats?.dmsSent?.toLocaleString() || '0', delta: '+2%', icon: Send, color: 'text-blue-500' },
    { label: 'Total Followers', value: liveStats?.followersCount?.toLocaleString() || '0', delta: '+1%', icon: Users, color: 'text-purple-500' },
    { label: 'Comments Caught', value: liveStats?.commentsCaught?.toLocaleString() || '0', delta: '+4%', icon: MessageCircle, color: 'text-orange-500' },
    { label: 'Engagement Rate', value: '4.8%', delta: '+6%', icon: TrendingUp, color: 'text-green-500' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-1.5 text-foreground" onClick={onMenuToggle}>
            <Menu size={18} />
          </button>
          <h2 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Dashboard</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-green-500/5 border border-green-500/10 rounded-full">
            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-bold text-green-600 uppercase tracking-wider">Live</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Upgrade Banner */}
          {plan === 'free' && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden group p-6 rounded-[24px] bg-gradient-to-r from-primary to-primary/80 text-white shadow-xl shadow-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 relative z-10">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-2">Unlock Pro Power!</h3>
                <p className="text-[11px] font-medium text-white/80">Get unlimited automations, contacts & advanced analytics.</p>
              </div>
              <button 
                onClick={onUpgrade}
                disabled={isBanned}
                className={`relative z-10 px-6 py-3 bg-white text-primary rounded-xl font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex-shrink-0 ${isBanned ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
              >
                Upgrade to Pro
              </button>
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
            </motion.div>
          )}

          {/* Welcome Section */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2"
              >
                {greeting}, <span className="text-primary">{userName || igUsername || 'Creator'}</span>
              </motion.h1>
              <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                {igConnected 
                  ? `Your Instagram studio is active and tracking your growth.`
                  : "Connect your Instagram account to see your real-time followers, engagement, and automation data."
                }
              </p>
            </div>
            {igConnected && (
               <div className="flex items-center gap-3 px-4 py-2 bg-muted/30 border border-border rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                      {igImage ? <img src={igImage} className="w-full h-full object-cover" /> : <Instagram size={16} />}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">@{igUsername}</p>
                    <p className="text-[9px] text-green-500 font-bold uppercase tracking-wider">Connected</p>
                  </div>
               </div>
            )}
          </section>

          {!igConnected ? (
            <div className="py-8 flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-30 bg-card border border-border p-6 md:p-8 rounded-[32px] shadow-2xl max-w-sm w-full text-center space-y-5"
              >
                <div className="w-14 h-14 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-pink-500/20">
                  <Instagram size={28} />
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-lg md:text-xl font-black tracking-tight text-foreground">Connect Instagram</h2>
                  <p className="text-[11px] text-muted-foreground font-medium leading-relaxed px-4">
                    Link your account to unlock real-time stats and automation features on your dashboard.
                  </p>
                </div>
                <button 
                  onClick={onConnect}
                  disabled={isBanned}
                  className={`inline-flex items-center justify-center w-full py-3 bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white rounded-xl font-black text-xs shadow-lg shadow-pink-500/20 hover:brightness-110 active:scale-[0.98] transition-all ${isBanned ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                >
                  Connect Now
                </button>
              </motion.div>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <motion.div 
                    key={stat.label}
                    whileHover={{ backgroundColor: "rgba(var(--primary-rgb), 0.02)" }}
                    className="group p-5 rounded-xl bg-card border border-border transition-all duration-300 cursor-default hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-lg bg-muted/50 ${stat.color} group-hover:bg-primary/10 transition-colors`}>
                        <stat.icon size={16} />
                      </div>
                      <span className="text-[10px] font-bold text-green-600 bg-green-500/5 px-1.5 py-0.5 rounded-md">
                        {stat.delta}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">{stat.value}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Analytics Trend (New Section) */}
              <section className="bg-card border border-border rounded-3xl p-6 lg:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black tracking-tighter">Growth Trend</h3>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Followers & Engagement over time</p>
                  </div>
                  <div className="flex gap-2">
                    {['7D', '30D', '90D'].map(p => (
                      <button key={p} className={`px-3 py-1 rounded-lg text-[9px] font-black transition-all ${p === '30D' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>{p}</button>
                    ))}
                  </div>
                </div>
                <div className="h-48 w-full flex items-end gap-1.5 pt-4">
                  {[40, 60, 45, 70, 90, 65, 80, 50, 85, 100, 75, 95, 60, 40, 55, 70, 85, 60, 45, 90].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.05, duration: 0.8 }}
                      className={`flex-1 rounded-t-md relative group ${h > 80 ? 'bg-primary' : 'bg-primary/30'} hover:bg-primary transition-all`}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-ink text-white text-[8px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                        +{h}%
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border/50">
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-[10px] font-bold text-muted-foreground">Followers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary/30" />
                      <span className="text-[10px] font-bold text-muted-foreground">Engagement</span>
                    </div>
                  </div>
                  <button className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Full Report</button>
                </div>
              </section>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
                <section className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold tracking-tight">Active Automations</h3>
                    <button onClick={onNew} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                      View all <Plus size={12} />
                    </button>
                  </div>
                  <div className="grid gap-3">
                    {automations.length === 0 ? (
                      <div className="p-8 text-center rounded-xl border border-dashed border-border bg-muted/10">
                        <div className="w-10 h-10 bg-muted/50 rounded-lg flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                          <Zap size={20} />
                        </div>
                        <h4 className="text-sm font-bold mb-1">No active flows</h4>
                        <p className="text-xs text-muted-foreground mb-4">Start by creating your first flow.</p>
                        <button onClick={onNew} className="px-5 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-xs hover:brightness-110 transition-all">
                          Create Flow
                        </button>
                      </div>
                    ) : (
                      automations.slice(0, 3).map((auto) => (
                        <div key={auto.id} className="group flex items-center gap-4 p-3 rounded-xl bg-card border border-border hover:bg-muted/30 transition-all">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <MessageCircle size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-foreground truncate">{auto.name}</h4>
                            <p className="text-[10px] text-muted-foreground truncate">{auto.triggerType === 'comment' ? 'Comment Trigger' : 'Story Reply'}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                              <p className="text-xs font-bold text-foreground">1.2K</p>
                              <p className="text-[9px] text-muted-foreground uppercase font-medium">Hits</p>
                            </div>
                            <button className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground">
                              <ArrowUpRight size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <aside className="space-y-6">
                  {/* Quick Actions */}
                  <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                    <h3 className="text-sm font-bold tracking-tight mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <button 
                        onClick={onNew}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted hover:border-primary/20 transition-all group"
                      >
                        <div className="p-1.5 rounded-lg bg-card border border-border group-hover:text-primary transition-colors">
                          <Plus size={14} />
                        </div>
                        <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">New Automation</span>
                      </button>

                      <button 
                        onClick={onConnect}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted hover:border-primary/20 transition-all group"
                      >
                        <div className="p-1.5 rounded-lg bg-card border border-border group-hover:text-primary transition-colors">
                          <RefreshCw size={14} />
                        </div>
                        <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">Connect IG Account</span>
                      </button>

                      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted hover:border-primary/20 transition-all group">
                        <div className="p-1.5 rounded-lg bg-card border border-border group-hover:text-primary transition-colors">
                          <ArrowUpRight size={14} />
                        </div>
                        <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">View Knowledgebase</span>
                      </button>
                    </div>
                  </div>

                  {/* Pro Tip */}
                  <div className="p-5 rounded-xl bg-primary/5 border border-primary/10 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-primary text-primary-foreground">
                        <Zap size={14} />
                      </div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Pro Tip</h4>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                      Fast responses increase conversion by <span className="text-primary font-bold">300%</span>.
                    </p>
                  </div>
                </aside>
            </div>
          </div>
          )}
        </div>
      </main>
    </div>
  );
}
