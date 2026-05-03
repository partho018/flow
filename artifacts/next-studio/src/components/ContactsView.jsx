"use client";
import { User, Users, MessageCircle, UserPlus, UserMinus, Search, Filter, MoreHorizontal, Instagram, Clock, Menu } from "lucide-react";
import { motion } from "framer-motion";

export function ContactsView({ igConnected, onMenuToggle }) {
  const mockContacts = [
    { id: 1, name: "Koushik Ahmed", username: "iamkoushik21", avatar: null, lastInteraction: "2 mins ago", type: "Message", status: "Following" },
    { id: 2, name: "Raju Mazumder", username: "raju_dev", avatar: null, lastInteraction: "1 hour ago", type: "Follow", status: "Following" },
    { id: 3, name: "Sarah Khan", username: "sarah_k", avatar: null, lastInteraction: "5 hours ago", type: "Message", status: "Not Following" },
    { id: 4, name: "Tanvir Hasan", username: "tanvir_h", avatar: null, lastInteraction: "Yesterday", type: "Comment", status: "Following" },
  ];

  if (!igConnected) {
    return (
      <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
        <header className="h-14 flex items-center px-6 border-b border-border bg-card/50 backdrop-blur-md gap-3">
          <button className="md:hidden p-1.5 text-foreground" onClick={onMenuToggle}>
            <Menu size={18} />
          </button>
          <h2 className="text-sm font-bold tracking-tight">Contacts</h2>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)] opacity-[0.03] pointer-events-none" />
          
          <div className="max-w-md w-full space-y-8 text-center relative z-10">
             <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 bg-primary/20 rounded-[32px] blur-xl animate-pulse" />
                <div className="relative w-24 h-24 bg-card border border-border rounded-[32px] flex items-center justify-center text-primary shadow-2xl">
                   <Users size={40} strokeWidth={1.5} />
                </div>
             </div>
             <div className="space-y-3">
                <h3 className="text-2xl font-black tracking-tighter">Your Network, <span className="text-primary">Automated.</span></h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  Connect your Instagram account to see people who have interacted with you, sent messages, or followed you.
                </p>
             </div>
             <a href="/api/auth/connect" className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                <Instagram size={18} /> Connect Instagram
             </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button className="md:hidden p-1.5 text-foreground" onClick={onMenuToggle}>
            <Menu size={18} />
          </button>
          <h2 className="text-sm font-bold tracking-tight">Contacts</h2>
          <div className="h-4 w-px bg-border" />
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{mockContacts.length} Total</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative hidden sm:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search contacts..." 
                className="pl-9 pr-4 py-1.5 bg-muted/50 border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary/50 w-64"
              />
           </div>
           <button className="p-1.5 hover:bg-muted rounded-lg transition-colors border border-border">
              <Filter size={14} />
           </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
           {/* Desktop Table */}
           <div className="hidden md:block bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-muted/30 border-b border-border">
                       <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">User</th>
                       <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Last Interaction</th>
                       <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Type</th>
                       <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                       <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody>
                    {mockContacts.map((contact) => (
                       <tr key={contact.id} className="border-b border-border hover:bg-muted/20 transition-colors group">
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 overflow-hidden">
                                   {contact.avatar ? <img src={contact.avatar} className="w-full h-full object-cover" /> : <Instagram size={14} className="text-primary" />}
                                </div>
                                <div>
                                   <p className="text-xs font-bold text-foreground">{contact.name}</p>
                                   <p className="text-[10px] text-muted-foreground">@{contact.username}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
                                <Clock size={12} />
                                {contact.lastInteraction}
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                contact.type === 'Message' ? 'bg-blue-500/10 text-blue-500' : 
                                contact.type === 'Follow' ? 'bg-purple-500/10 text-purple-500' : 
                                'bg-orange-500/10 text-orange-500'
                             }`}>
                                {contact.type === 'Message' ? <MessageCircle size={10} /> : <UserPlus size={10} />}
                                {contact.type}
                             </span>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-1.5">
                                {contact.status === 'Following' ? (
                                   <div className="flex items-center gap-1 text-[10px] font-bold text-green-500">
                                      <UserPlus size={12} />
                                      Following
                                   </div>
                                ) : (
                                   <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                                      <UserMinus size={12} />
                                      Not Following
                                   </div>
                                )}
                             </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                                <MoreHorizontal size={14} />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* Mobile Cards */}
           <div className="md:hidden space-y-3">
              {mockContacts.map((contact) => (
                <div key={contact.id} className="p-4 bg-card border border-border rounded-2xl space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 overflow-hidden">
                        {contact.avatar ? <img src={contact.avatar} className="w-full h-full object-cover" /> : <Instagram size={16} className="text-primary" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{contact.name}</p>
                        <p className="text-[11px] text-muted-foreground">@{contact.username}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-muted rounded-xl transition-colors">
                      <MoreHorizontal size={16} className="text-muted-foreground" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      contact.type === 'Message' ? 'bg-blue-500/10 text-blue-500' : 
                      contact.type === 'Follow' ? 'bg-purple-500/10 text-purple-500' : 
                      'bg-orange-500/10 text-orange-500'
                    }`}>
                      {contact.type === 'Message' ? <MessageCircle size={10} /> : <UserPlus size={10} />}
                      {contact.type}
                    </span>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      contact.status === 'Following' ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'
                    }`}>
                      <UserPlus size={10} />
                      {contact.status}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                      <Clock size={12} />
                      Last interacted {contact.lastInteraction}
                    </div>
                    <button className="text-[10px] font-black uppercase text-primary tracking-widest">View History</button>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
