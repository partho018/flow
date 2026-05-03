import { useState } from "react";
import { Send, Users, MessageCircle, MessageSquare, TrendingUp, ArrowUpRight, Plus, RefreshCw, Instagram, BookOpen, Zap, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function HomeView({ greeting, automations, onNew, igConnected, igUsername, igImage, stats: liveStats, onConnect, onMenuToggle, plan, onUpgrade, userName, isBanned, onViewAutomations }) {
  const [timeframe, setTimeframe] = useState('30D');

  const QUICK_ACTIONS = [
    { id: 'comment', title: 'Auto DM from Comments', desc: 'Send DMs to users who comment on your posts', badge: 'POPULAR', badgeCol: 'bg-orange-500', icon: MessageCircle, trigger: 'comment' },
    { id: 'grow', title: 'Grow Followers', desc: 'Increase followers with automated engagement', badge: 'TRENDING', badgeCol: 'bg-pink-500', icon: TrendingUp, isPro: true, trigger: 'story' },
    { id: 'leads', title: 'Generate Leads', desc: 'Capture leads from your Instagram DMs', icon: Users, isPro: true, trigger: 'dm' },
    { id: 'dm', title: 'Auto-reply DMs', desc: 'Never miss a message with auto responses', icon: RefreshCw, trigger: 'dm' },
  ];

  const stats = [
    { label: 'DMs Sent Today', value: liveStats?.dmsSent?.toLocaleString() || '0', delta: '+2%', icon: Send, color: 'text-blue-500' },
    { label: 'Total Followers', value: liveStats?.followersCount?.toLocaleString() || '0', delta: '+1%', icon: Users, color: 'text-purple-500' },
    { label: 'Comments Caught', value: liveStats?.commentsCaught?.toLocaleString() || '0', delta: '+4%', icon: MessageCircle, color: 'text-orange-500' },
    { label: 'Engagement Rate', value: '4.8%', delta: '+6%', icon: TrendingUp, color: 'text-green-500' },
  ];

  const getChartData = () => {
    switch(timeframe) {
      case '7D': return [40, 65, 45, 80, 95, 60, 85];
      case '30D': return [45, 65, 40, 75, 95, 60, 85, 55, 90, 100, 80, 95, 70, 50, 65, 80, 90, 75, 60, 95];
      case '90D': return [30, 50, 45, 60, 75, 55, 70, 85, 65, 80, 95, 70, 85, 100, 80, 95, 75, 90, 85, 100];
      default: return [];
    }
  };

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

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 relative custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Upgrade Banner */}
          {plan === 'free' && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden group p-6 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-white shadow-xl shadow-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 relative z-10">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-2">Unlock Pro Power!</h3>
                <p className="text-[11px] font-medium text-white/80">Get unlimited automations, contacts & advanced analytics.</p>
              </div>
              <button 
                onClick={onUpgrade}
                disabled={isBanned}
                className={`relative z-10 px-6 py-3 bg-white text-primary rounded-lg font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex-shrink-0 ${isBanned ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
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
            <button 
              onClick={onNew}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all group"
            >
              <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform">
                <Plus size={14} strokeWidth={3} />
              </div>
              Create New
            </button>
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
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                      <div className={`p-1.5 sm:p-2 rounded-lg bg-muted/50 ${stat.color} group-hover:bg-primary/10 transition-colors`}>
                        <stat.icon size={14} className="sm:w-4 sm:h-4" />
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


              {/* Main Content Grid - Swapped Positions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
                {/* Left Side: Quick Actions (Now taking 2 columns) */}
                <section className="lg:col-span-2 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold tracking-tight text-foreground ml-2">Quick Actions</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {QUICK_ACTIONS.map(a => (
                        <button 
                          key={a.id}
                          onClick={() => onNew({ triggerType: a.trigger })}
                          className={`relative group p-6 rounded-lg bg-card border-2 transition-all text-left flex flex-col gap-4 hover:shadow-xl hover:-translate-y-1 ${a.isPro ? 'border-amber-400/20 hover:border-amber-400' : 'border-border hover:border-primary/40'}`}
                        >
                          {a.badge && (
                            <span className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest ${a.badgeCol}`}>
                              {a.badge}
                            </span>
                          )}
                          
                          <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                            <a.icon size={20} />
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-foreground leading-tight">{a.title}</h4>
                            <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">{a.desc}</p>
                          </div>

                          {a.isPro && (
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 rounded-full text-[8px] font-black text-white uppercase tracking-widest shadow-lg shadow-amber-500/20">
                              PRO
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Right Side: Active Automations (Now in Sidebar) */}
                <aside className="space-y-4 flex flex-col h-[400px] lg:h-auto">
                  <div className="flex items-center justify-between ml-2">
                    <h3 className="text-xl font-bold tracking-tight text-foreground">Active Flows</h3>
                    <button onClick={onViewAutomations} className="text-[10px] font-bold text-primary hover:underline">View all +</button>
                  </div>
                  
                  <div className="flex-1 bg-card border border-border rounded-lg p-4 lg:p-6 shadow-sm overflow-hidden flex flex-col">
                    {automations.filter(a => a.active).length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                        <div className="w-12 h-12 bg-muted/50 rounded-2xl flex items-center justify-center text-muted-foreground/30">
                          <Zap size={20} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-foreground">No active flows</p>
                          <p className="text-[10px] text-muted-foreground font-medium leading-tight">Start by creating your first automation.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto space-y-2.5 pr-2 custom-scrollbar">
                        {automations.filter(a => a.active).map(auto => (
                          <div key={auto.id} className="group p-3 bg-muted/20 border border-border/50 rounded-[20px] flex items-center gap-3 hover:bg-muted/40 hover:border-primary/20 transition-all">
                            <div className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                              {auto.triggerType === 'comment' ? <Instagram size={16} /> : <MessageSquare size={16} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-bold text-foreground truncate">{auto.name}</p>
                              <p className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter opacity-70">
                                {auto.triggerType === 'comment' ? 'Comment Auto-DM' : 'DM Auto-Reply'}
                              </p>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </aside>
              </div>

              {/* Growth Trend Section - Clean & Simple */}
              <section className="bg-card border border-border rounded-lg p-6 lg:p-10 space-y-10 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold tracking-tight text-foreground">Growth Trend</h3>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-70">Followers & Engagement over time</p>
                  </div>
                  <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-2xl border border-border/10">
                    {['7D', '30D', '90D'].map(t => (
                      <button 
                        key={t} 
                        onClick={() => setTimeframe(t)}
                        className={`px-5 py-2 rounded-xl text-[10px] font-bold transition-all ${
                          timeframe === t 
                            ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-48 sm:h-56 w-full flex items-end justify-between gap-1 pt-4 px-1 sm:px-2">
                  <AnimatePresence mode="popLayout">
                    {getChartData().map((h, i) => (
                      <motion.div 
                        key={`${timeframe}-${i}`}
                        initial={{ opacity: 0, height: 0, scale: 0.5 }}
                        animate={{ opacity: 1, height: '100%', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.5 }}
                        transition={{ delay: i * 0.02, duration: 0.5 }}
                        className="flex-1 flex items-end justify-center gap-[1px] sm:gap-1 h-full group cursor-default relative"
                      >
                        {/* Followers Bar */}
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: i * 0.02, duration: 0.8, ease: "easeOut" }}
                          className="w-full max-w-[8px] sm:max-w-[12px] bg-primary rounded-full group-hover:brightness-110 transition-all"
                        />
                        {/* Engagement Bar */}
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${h * 0.6}%` }}
                          transition={{ delay: (i * 0.02) + 0.1, duration: 0.8, ease: "easeOut" }}
                          className="w-full max-w-[8px] sm:max-w-[12px] bg-primary/20 rounded-full group-hover:bg-primary/30 transition-all"
                        />

                        {/* Interactive Tooltip */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 scale-90 group-hover:scale-100">
                          <div className="bg-foreground text-background px-3 py-2 rounded-xl text-[9px] font-bold shadow-2xl flex flex-col gap-1 min-w-[100px]">
                            <div className="flex justify-between gap-3">
                              <span className="text-muted-foreground/60 uppercase tracking-tighter">Followers</span>
                              <span>+{h}%</span>
                            </div>
                            <div className="flex justify-between gap-3 border-t border-background/10 pt-1">
                              <span className="text-muted-foreground/60 uppercase tracking-tighter">Engagement</span>
                              <span>+{(h * 0.6).toFixed(0)}%</span>
                            </div>
                            {/* Arrow */}
                            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-foreground absolute -bottom-1 left-1/2 -translate-x-1/2" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-border/50 gap-6">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-8">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary" />
                      <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground/80">Followers</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary/20" />
                      <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground/80">Engagement</span>
                    </div>
                  </div>
                  <button className="text-[11px] font-black text-primary hover:underline uppercase tracking-widest">
                    Full Report
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
