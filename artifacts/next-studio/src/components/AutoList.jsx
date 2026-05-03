"use client";
import { useState } from "react";
import { Zap, Plus, Search, Filter, MoreVertical, Edit2, Trash2, Pause, Play, BookImage, MessageCircle, Crown, AlertCircle, Menu, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AutoList({ automations, onNew, onEdit, onDelete, onUpgrade, onMenuToggle, isBanned }) {
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = automations.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden font-sans">
      <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-1.5 text-foreground" onClick={onMenuToggle}>
            <Menu size={18} />
          </button>
          <h2 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60">Automations</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search flows..." 
              className="pl-9 pr-4 py-1.5 bg-muted/50 border border-border rounded-lg text-xs focus:ring-2 focus:ring-primary/20 transition-all outline-none w-48 md:w-64 font-medium"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Unlock Pro Banner */}
          <section className="bg-primary rounded-lg p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="space-y-1 text-center md:text-left">
                <h2 className="text-xl font-black tracking-tight flex items-center justify-center md:justify-start gap-2">
                  Unlock <span className="opacity-90">Pro Power!</span>
                </h2>
                <p className="text-[13px] font-medium opacity-80">Get unlimited automations, contacts & advanced analytics.</p>
              </div>
              <button 
                onClick={onUpgrade}
                className="px-6 py-2.5 bg-white text-primary rounded-xl font-black text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                Upgrade to Pro
              </button>
            </div>
            {/* Subtle patterns */}
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
              <Zap size={120} strokeWidth={1} />
            </div>
          </section>

          {/* Title & Create */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black tracking-tighter text-foreground">Automations</h1>
            <button 
              onClick={onNew}
              disabled={isBanned}
              className="px-6 py-2 bg-primary text-white rounded-xl font-black text-sm shadow-lg shadow-primary/20 flex items-center gap-2 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
            >
              <Plus size={18} strokeWidth={3} />
              Create
            </button>
          </div>

          {/* List Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
            <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-5 border-b border-border bg-muted/20">
              <div className="col-span-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Image</div>
              <div className="col-span-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Name</div>
              <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-center">Status</div>
              <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-center">Created</div>
              <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-center">Last Modified</div>
              <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-right">Actions</div>
            </div>

            <div className="divide-y divide-border hidden md:block">
              <AnimatePresence mode="popLayout">
                {filtered.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-20 text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-muted/40 rounded-[28px] flex items-center justify-center mx-auto mb-4 text-muted-foreground/40 border border-border/50">
                      <Zap size={40} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-black tracking-tighter">No automations found</h3>
                      <p className="text-sm text-muted-foreground font-medium">Get started by creating your first automation.</p>
                    </div>
                    <button 
                      onClick={onNew} 
                      disabled={isBanned}
                      className="px-8 py-3 bg-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-primary/20 flex items-center gap-2 mx-auto hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
                    >
                      <Plus size={18} strokeWidth={3} />
                      Create Automation
                    </button>
                  </motion.div>
                ) : (
                  filtered.map((auto) => (
                    <motion.div 
                      key={auto.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-muted/30 transition-all group ${isBanned ? 'opacity-70 pointer-events-none' : ''}`}
                    >
                      <div className="col-span-1">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${auto.active ? "bg-primary/10 text-primary shadow-sm" : "bg-muted text-muted-foreground"}`}>
                          {auto.triggerType === 'story' ? <BookImage size={20} /> : <MessageCircle size={20} />}
                        </div>
                      </div>
                      
                      <div className="col-span-3 flex flex-col">
                        <h4 className="text-sm font-bold text-foreground truncate">{auto.name}</h4>
                        <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5">
                          Trigger: <span className="text-foreground/80 font-bold uppercase tracking-tight">{auto.triggerType}</span>
                        </p>
                      </div>

                      <div className="col-span-2 flex justify-center">
                        <div className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 ${auto.active ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground/60"}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${auto.active ? "bg-green-500" : "bg-muted-foreground/40"}`} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{auto.active ? "Active" : "Paused"}</span>
                        </div>
                      </div>

                      <div className="col-span-2 text-center text-[11px] font-bold text-muted-foreground/70">
                        Recent
                      </div>

                      <div className="col-span-2 text-center text-[11px] font-bold text-muted-foreground/70">
                        2 mins ago
                      </div>

                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onEdit(auto); }}
                          className="p-2 hover:bg-primary/10 rounded-xl text-muted-foreground hover:text-primary transition-all"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setConfirmDelete(auto); }}
                          className="p-2 hover:bg-destructive/10 rounded-xl text-muted-foreground hover:text-destructive transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-border">
              {filtered.length === 0 ? (
                 <div className="p-12 text-center space-y-4">
                    <Zap className="mx-auto text-muted-foreground/20" size={40} />
                    <p className="text-xs font-bold text-muted-foreground">No flows found</p>
                    <button onClick={onNew} className="text-[10px] font-black uppercase text-primary">Create Now</button>
                 </div>
              ) : (
                filtered.map((auto) => (
                  <div key={auto.id} className="p-5 space-y-4 bg-card active:bg-muted/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${auto.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {auto.triggerType === 'story' ? <BookImage size={18} /> : <MessageCircle size={18} />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-foreground">{auto.name}</h4>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">{auto.triggerType} Trigger</p>
                        </div>
                      </div>
                      <div className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${auto.active ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground/60"}`}>
                        <div className={`w-1 h-1 rounded-full ${auto.active ? "bg-green-500" : "bg-muted-foreground/40"}`} />
                        <span className="text-[8px] font-black uppercase tracking-widest">{auto.active ? "Active" : "Paused"}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex gap-4">
                        <div className="text-[9px] font-bold text-muted-foreground">
                          <p className="uppercase tracking-widest opacity-60 mb-0.5">Hits</p>
                          <p className="text-foreground">1.2K</p>
                        </div>
                        <div className="text-[9px] font-bold text-muted-foreground">
                          <p className="uppercase tracking-widest opacity-60 mb-0.5">Modified</p>
                          <p className="text-foreground">2m ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => onEdit(auto)} className="p-2 hover:bg-muted rounded-lg transition-colors"><Edit2 size={16} className="text-muted-foreground" /></button>
                        <button onClick={() => setConfirmDelete(auto)} className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"><Trash2 size={16} className="text-destructive/60" /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmDelete(null)} className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-card border border-border p-8 rounded-3xl w-full max-w-sm shadow-2xl">
              <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-xl font-black tracking-tight mb-1 text-foreground">Delete Flow?</h3>
              <p className="text-muted-foreground text-[13px] mb-8 font-medium">Are you sure you want to delete <span className="text-foreground font-bold italic">"{confirmDelete.name}"</span>? This action cannot be undone.</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setConfirmDelete(null)} className="py-2.5 bg-muted text-foreground rounded-xl font-bold text-xs hover:bg-muted/70 transition-all">Cancel</button>
                <button onClick={() => { onDelete(confirmDelete.id); setConfirmDelete(null); }} className="py-2.5 bg-destructive text-white rounded-xl font-bold text-xs hover:brightness-110 transition-all shadow-lg shadow-destructive/20">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
