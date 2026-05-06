import { useState, useEffect, useRef } from "react";
import { 
  ArrowRight, CheckCircle, Instagram, Zap, 
  MessageSquare, Users, TrendingUp, Shield, 
  Menu, X, Play, Star, ChevronDown, Heart,
  Send, MessageCircle, Activity, Globe, MousePointer2,
  Layout, BarChart3, Bot, Smartphone
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

export function LandingPage({ onLoginClick, onGetStarted }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const stackContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { scrollYProgress } = useScroll({
    target: stackContainerRef,
    offset: ["start start", "end end"]
  });

  // Animation for "Meeting in the Middle"
  // Speed up the meeting so there's more "holding" time at the end
  const beforeCardX = useTransform(scrollYProgress, [0.1, 0.4], ["0%", "52%"]);
  const beforeCardScale = useTransform(scrollYProgress, [0.1, 0.4], [1, 0.9]);
  const beforeCardOpacity = useTransform(scrollYProgress, [0.1, 0.4], [1, 0]);

  const afterCardX = useTransform(scrollYProgress, [0.1, 0.4], ["0%", "-52%"]);
  const afterCardScale = useTransform(scrollYProgress, [0.4, 0.6], [1, 1.05]);

  const tickerItems = [
    { name: "GIOVANNI BEGOSSI", followers: "2M FOLLOWERS", text: "MY INSTAGRAM ACCOUNT GAINED OVER 1 MILLION FOLLOWERS IN LESS THAN A YEAR...", img: "https://i.pravatar.cc/100?img=11" },
    { name: "CASSIE SCHOON", followers: "500K FOLLOWERS", text: "TO GENERATE OVER $65 MILLION IN SALES USING DM AUTOMATION...", img: "https://i.pravatar.cc/100?img=12" },
    { name: "MARCUS REED", followers: "1.2M FOLLOWERS", text: "THE BEST TOOL FOR CREATORS. PERIOD. MY ENGAGEMENT EXPLODED!", img: "https://i.pravatar.cc/100?img=13" },
    { name: "ELENA V.", followers: "800K FOLLOWERS", text: "WE SAVED 40 HOURS A WEEK ON CUSTOMER SUPPORT REPLIES...", img: "https://i.pravatar.cc/100?img=14" },
  ];

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-sans selection:bg-[#0047FF]/10 selection:text-[#0047FF]">
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          isScrolled 
            ? "bg-white/80 backdrop-blur-xl border-b border-gray-100 py-3" 
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-[1500px] mx-auto px-6 md:px-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 bg-[#0047FF] rounded-[10px] flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Heart size={20} className="text-white fill-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-[#000]" style={{ fontFamily: 'ManyChatGravity, sans-serif' }}>FlowStudio</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {['Features', 'How it Works', 'Pricing', 'Testimonials'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="text-[13px] font-bold text-gray-600 hover:text-[#0047FF] transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={onLoginClick}
              className="px-6 py-2.5 text-[13px] font-bold text-gray-700 hover:text-[#0047FF] transition-colors"
            >
              Login
            </button>
            <button 
              onClick={onGetStarted}
              className="px-6 py-2.5 bg-[#0047FF] text-white rounded-full text-[13px] font-black shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              Start For Free
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 text-gray-900" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-gradient-to-b from-[#f8faff] to-white">
        <div className="max-w-[1500px] mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0047FF]/5 border border-[#0047FF]/10">
              <span className="flex h-2 w-2 rounded-full bg-[#0047FF] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0047FF]">Official Instagram Partner</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] text-black" style={{ fontFamily: 'ManyChatGravity, sans-serif' }}>
              Go Viral On IG <br />
              <span className="text-[#0047FF]">with DM Automation</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed max-w-xl">
              Turn your audience into customers. Automatically reply to comments, manage leads, and grow your Instagram empire while you sleep.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-10 py-4 bg-[#0047FF] text-white rounded-full text-base font-black shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                Get Started Now <ArrowRight size={20} />
              </button>
              <div className="flex -space-x-3 items-center">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                  </div>
                ))}
                <div className="pl-6 text-[13px] font-bold text-gray-500">
                  <span className="text-black">10K+</span> creators joined
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-8 pt-4">
              {['Meta Verified', 'No Credit Card', 'Instant Setup'].map(f => (
                <div key={f} className="flex items-center gap-2 text-[12px] font-bold text-gray-500">
                  <CheckCircle size={14} className="text-[#0047FF]" /> {f}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative z-10 w-full max-w-[280px] aspect-[9/18.5] bg-black rounded-[40px] border-[8px] border-[#1a1a1a] shadow-[0_0_100px_rgba(0,71,255,0.15)] overflow-hidden">
               {/* Mockup Content */}
               <div className="h-full bg-gray-50 flex flex-col">
                  <div className="h-14 bg-white border-b border-gray-100 flex items-center px-6 justify-between">
                     <Instagram size={18} className="text-gray-900" />
                     <div className="w-20 h-2 bg-gray-100 rounded-full" />
                  </div>
                  <div className="flex-1 p-6 space-y-4 overflow-hidden">
                     {[
                       { name: 'Sarah J.', msg: 'How can I buy this?', time: '2m' },
                       { name: 'Mike Ross', msg: 'Price please!', time: '14m' },
                       { name: 'Alex K.', msg: 'Is it available?', time: '22m' },
                     ].map((chat, i) => (
                       <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.3 }}
                        key={i} 
                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-3 items-start"
                       >
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0" />
                          <div className="flex-1">
                             <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black">{chat.name}</span>
                                <span className="text-[8px] text-gray-400 font-bold">{chat.time} ago</span>
                             </div>
                             <p className="text-[11px] text-gray-600 font-medium">{chat.msg}</p>
                          </div>
                       </motion.div>
                     ))}
                     
                     {/* Automated Response */}
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                        className="mt-10 bg-[#0047FF] p-4 rounded-2xl shadow-xl shadow-blue-500/20 text-white self-end ml-10"
                     >
                        <p className="text-[11px] font-bold">Hey! You can get it here: dmstudio.com 👋</p>
                        <div className="flex items-center gap-1 mt-2 text-[8px] font-black opacity-80">
                           <Zap size={8} className="fill-white" /> Sent automatically
                        </div>
                     </motion.div>
                  </div>
               </div>
            </div>

            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-6 -right-2 md:-right-6 z-20 bg-white p-3 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <TrendingUp size={16} />
              </div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Conversion</p>
                <p className="text-sm font-black text-black">+142%</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -left-2 md:-left-6 z-20 bg-white p-3 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
                <Users size={16} />
              </div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Leads Gen</p>
                <p className="text-sm font-black text-black">1.2K+</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* TICKER SECTION */}
      <section className="py-6 border-y border-gray-100 bg-white overflow-hidden relative">
        <div className="flex items-center">
          {/* Sticky Left Label */}
          <div className="bg-white px-4 md:px-8 py-4 z-20 relative shadow-[20px_0_30px_white] flex-shrink-0 border-r border-gray-50">
            <p className="text-sm md:text-base font-black leading-tight text-black flex items-center gap-2">
               <span className="text-red-500">❤️</span>'d by 1M+ creators, <br /> marketers & brands
            </p>
          </div>

          {/* Scrolling Ticker Content */}
          <div className="flex-1 overflow-hidden relative whitespace-nowrap">
            <motion.div 
              initial={{ x: 0 }}
              animate={{ x: "-50%" }}
              transition={{ 
                duration: 30, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="flex items-center gap-16 inline-flex"
            >
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <div key={i} className="flex items-center gap-4 flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                     <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black uppercase bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 tracking-wider">{item.name}</span>
                       <span className="text-[9px] font-bold text-gray-400">{item.followers}</span>
                    </div>
                    <p className="text-sm font-black text-gray-900 tracking-tight mt-1">"{item.text}"</p>
                    <button className="text-[10px] font-black text-gray-400 hover:text-[#0047FF] transition-colors mt-1 uppercase tracking-widest flex items-center gap-1">Learn More <ArrowRight size={10} /></button>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section (Dark) */}
      <section id="features" className="py-32 bg-[#000] text-white overflow-hidden relative z-50">
        <div className="max-w-[1500px] mx-auto px-6 md:px-16">
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight" style={{ fontFamily: 'ManyChatGravity, sans-serif' }}>
              Unlock the full Power of Instagram
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                title: "Comment Automation", 
                desc: "Reply to comments and send a DM to engage your followers.",
                preview: (
                  <div className="w-full h-full bg-white p-4 flex flex-col gap-3">
                     <p className="text-[10px] font-bold text-center text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Comments</p>
                     <div className="flex gap-2 items-start">
                        <div className="w-6 h-6 rounded-full bg-orange-100 shrink-0" />
                        <div className="flex-1">
                           <div className="flex justify-between items-center"><span className="text-[9px] font-black">Etienne</span> <span className="text-[7px] text-gray-400">2 min</span></div>
                           <p className="text-[8px] text-gray-600 font-medium leading-tight mt-0.5">Do you ship in Italy? Reply</p>
                        </div>
                        <Heart size={8} className="text-red-500 fill-red-500 mt-2" />
                     </div>
                     <div className="flex gap-2 items-start pl-4 border-l-2 border-gray-100">
                        <div className="w-6 h-6 rounded-full bg-blue-100 shrink-0" />
                        <div className="flex-1">
                           <div className="flex justify-between items-center"><span className="text-[9px] font-black">muted_poetry</span> <span className="text-[7px] text-gray-400">now</span></div>
                           <p className="text-[8px] text-blue-600 font-bold leading-tight mt-0.5">@etienne We ship in all Europe, including Italy!</p>
                        </div>
                     </div>
                  </div>
                )
              },
              { 
                title: "Story Automation", 
                desc: "Auto respond to story replies and reactions.",
                preview: (
                  <div className="w-full h-full bg-[#050505] relative overflow-hidden flex flex-col items-center justify-center p-4">
                     <div className="absolute top-4 left-4 right-4 h-24 rounded-lg bg-gray-900 border border-white/5 flex items-center justify-center p-4 overflow-hidden">
                        <p className="text-[8px] font-bold text-center">React with 🔥 to get early access to tickets!</p>
                        <span className="absolute -right-1 bottom-0 text-xl">🔥</span>
                     </div>
                     <div className="mt-24 w-full space-y-2">
                        <div className="bg-white/5 p-2 rounded-lg border border-white/5"><p className="text-[8px] font-bold text-gray-400">That's crazyyyy!!</p></div>
                        <div className="bg-white/5 p-2 rounded-full border border-white/10 flex justify-between items-center">
                           <span className="text-[8px] text-gray-500">Message...</span>
                           <div className="flex gap-1.5 opacity-60"><Instagram size={10} /><Heart size={10} /><MessageCircle size={10} /></div>
                        </div>
                     </div>
                  </div>
                )
              },
              { 
                title: "Live Automation", 
                desc: "Send a message to followers who are active during lives.",
                preview: (
                  <div className="w-full h-full bg-[#111] relative p-4 flex flex-col justify-end gap-2">
                     <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&auto=format&fit=crop&q=60')] bg-cover opacity-60" />
                     <div className="absolute top-4 right-4 px-2 py-0.5 bg-red-600 text-white text-[8px] font-black rounded uppercase">LIVE</div>
                     <div className="relative z-10 space-y-2">
                        <div className="flex items-center gap-2">
                           <div className="w-5 h-5 rounded-full border border-amber-400" />
                           <span className="text-[9px] font-bold">muted_poetry</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-80">
                           <div className="w-5 h-5 rounded-full bg-gray-400" />
                           <span className="text-[8px] font-medium">Welcome! 🔥</span>
                        </div>
                        <div className="bg-black/40 backdrop-blur-md p-2 border-t border-white/10 flex items-center gap-2">
                           <span className="text-[8px] text-gray-500">Add a comment...</span>
                        </div>
                     </div>
                  </div>
                )
              },
              { 
                title: "DM Automation", 
                desc: "Automatically reply to the followers who messages you.",
                preview: (
                  <div className="w-full h-full bg-white p-4 flex flex-col justify-between">
                     <div className="space-y-3 pt-6">
                        <div className="bg-gray-100 p-2 rounded-2xl rounded-bl-none max-w-[80%]">
                           <p className="text-[8px] font-medium">Hey! I love your music!</p>
                        </div>
                        <div className="bg-blue-600 p-2 rounded-2xl rounded-br-none max-w-[80%] self-end">
                           <p className="text-[8px] font-bold text-white">Thank you so much, it means a lot</p>
                        </div>
                     </div>
                     <div className="bg-gray-50 p-2 rounded-full border border-gray-100 flex justify-between items-center">
                        <span className="text-[8px] text-gray-400">Message...</span>
                        <div className="flex gap-2 opacity-40"><MessageSquare size={10} /><Heart size={10} /><Instagram size={10} /></div>
                     </div>
                  </div>
                )
              },
              { 
                title: "Lead Management", 
                desc: "Manage and export your potential customers with ease.",
                preview: (
                  <div className="w-full h-full bg-white p-4 flex flex-col gap-2">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Leads</p>
                     {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100">
                           <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-indigo-100" />
                              <span className="text-[8px] font-black text-gray-700">Lead #{i}</span>
                           </div>
                           <span className="text-[6px] font-bold text-green-500 bg-green-50 px-1.5 py-0.5 rounded">Active</span>
                        </div>
                     ))}
                  </div>
                )
              },
              { 
                title: "Smart Funnels", 
                desc: "Create automated paths to guide users to checkout.",
                preview: (
                  <div className="w-full h-full bg-[#0c121d] p-4 flex flex-col items-center justify-center gap-3">
                     <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                        <Zap size={24} className="text-blue-500" />
                     </div>
                     <div className="w-px h-6 bg-blue-500/30" />
                     <div className="w-24 p-2 rounded-lg bg-white/5 border border-white/10 text-center">
                        <p className="text-[8px] font-black">Send Discount</p>
                     </div>
                     <div className="w-px h-6 bg-blue-500/30" />
                     <div className="w-24 p-2 rounded-lg bg-blue-500 text-center">
                        <p className="text-[8px] font-black text-white">Closed Sale!</p>
                     </div>
                  </div>
                )
              },
              { 
                title: "Analytics Studio", 
                desc: "Track growth and conversion stats in real-time.",
                preview: (
                  <div className="w-full h-full bg-white p-4 flex flex-col gap-4">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Growth</p>
                     <div className="flex items-end gap-1 flex-1 pb-2">
                        {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                           <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} className="flex-1 bg-blue-500 rounded-t-sm" />
                        ))}
                     </div>
                     <div className="flex justify-between border-t border-gray-100 pt-2">
                        <div className="text-center"><p className="text-[10px] font-black">12.4K</p><p className="text-[6px] text-gray-400">Reach</p></div>
                        <div className="text-center"><p className="text-[10px] font-black text-green-500">+14%</p><p className="text-[6px] text-gray-400">Growth</p></div>
                     </div>
                  </div>
                )
              },
              { 
                title: "AI Auto-Replies", 
                desc: "Intelligent AI that understands intent and replies instantly.",
                preview: (
                  <div className="w-full h-full bg-[#000] p-4 flex flex-col gap-3 relative overflow-hidden">
                     <div className="absolute inset-0 bg-blue-500/5 blur-[40px] rounded-full" />
                     <div className="relative z-10 flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center"><Bot size={14} className="text-white" /></div>
                        <span className="text-[10px] font-black text-blue-500">AI ASSISTANT</span>
                     </div>
                     <div className="relative z-10 space-y-2">
                        <div className="p-2 bg-white/5 rounded-lg border border-white/10"><p className="text-[7px] font-medium text-gray-400">User: "Is the red one in stock?"</p></div>
                        <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30"><p className="text-[7px] font-bold text-blue-400">AI: "Yes! We have 5 left in stock. Would you like a direct link?"</p></div>
                     </div>
                  </div>
                )
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03, rotate: 2, zIndex: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="rounded-[24px] bg-[#0c121d] border border-white/5 overflow-hidden flex flex-col h-[380px] cursor-pointer"
              >
                <div className="h-[220px] w-full overflow-hidden border-b border-white/5">
                  {feature.preview}
                </div>
                <div className="p-8 space-y-3 flex-1 flex flex-col justify-center">
                  <h3 className="text-xl font-black text-white leading-tight">{feature.title}</h3>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 flex justify-center pb-20">
             <button 
                onClick={onGetStarted}
                className="px-12 py-4 bg-[#0047FF] text-white rounded-full text-base font-black shadow-2xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
             >
                Start For Free <ArrowRight size={18} />
             </button>
          </div>
        </div>
      </section>

      {/* BEFORE & AFTER STACKING SECTION */}
      <section ref={stackContainerRef} className="relative h-auto md:h-[350vh] bg-white z-[60] py-20 md:py-0">
        <div className="relative md:sticky top-0 h-auto md:h-screen w-full flex flex-col items-center justify-center">
           <div className="max-w-[1500px] mx-auto px-6 md:px-16 w-full relative h-full flex flex-col justify-center">
              <div className="text-center mb-6 md:mb-8 space-y-1">
                <h2 className="text-4xl md:text-6xl font-black tracking-tight text-black leading-tight" style={{ fontFamily: 'ManyChatGravity, sans-serif' }}>
                  Your inbox: <br />
                  <span className="text-gray-400 italic">a before & after</span>
                </h2>
                <p className="text-sm text-gray-500 font-bold">More messages, less mess.</p>
              </div>

              <div className="relative h-auto lg:h-[850px] w-full flex flex-col lg:flex-row justify-center items-center gap-6">
                {/* Card 1: Before */}
                <motion.div 
                  style={{ 
                    x: typeof window !== 'undefined' && window.innerWidth >= 1024 ? beforeCardX : 0, 
                    scale: typeof window !== 'undefined' && window.innerWidth >= 1024 ? beforeCardScale : 1, 
                    opacity: typeof window !== 'undefined' && window.innerWidth >= 1024 ? beforeCardOpacity : 1 
                  }}
                  className="w-full lg:w-[48%] h-[600px] lg:h-full rounded-3xl bg-[#f2f5f1] border border-gray-200/50 py-12 md:py-16 lg:py-20 px-6 md:px-10 lg:px-12 shadow-sm flex flex-col justify-between"
                >
                  <div className="text-center">
                    <p className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-black mb-2 md:mb-4">Before FlowStudio:</p>
                    <h3 className="text-[40px] md:text-[66px] font-black text-black leading-[0.95] md:leading-[1] tracking-tighter" style={{ fontFamily: 'ManyChatGravity, sans-serif' }}>
                      All work <br /> 
                      and no play
                    </h3>
                  </div>
                  <div className="space-y-4 md:space-y-6 max-w-md mx-auto w-full">
                    {[
                      "COPY-PASTING THE SAME REPLY 417 TIMES.", 
                      "LOSING HOT LEADS IN ENDLESS DMS.", 
                      "MISSED SALES WHILE YOU SLEEP.", 
                      "EVERY COMMENT, FOLLOW, DM, BURIES YOU DEEPER."
                    ].map((item, i) => (
                       <div key={i} className="flex items-center justify-between py-3 md:py-4 border-b border-black/10">
                        <span className="text-[9px] md:text-[11px] font-black text-black tracking-tight leading-tight uppercase">{item}</span>
                        <div className="w-4 h-4 md:w-5 md:h-5 rounded bg-black flex items-center justify-center text-white flex-shrink-0"><CheckCircle size={10} /></div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-6 md:pt-8">
                    <button className="w-full py-4 md:py-5 bg-black text-white rounded-xl text-[10px] md:text-[12px] font-black uppercase tracking-widest">Painful Manual Work</button>
                  </div>
                </motion.div>

                {/* Card 2: After */}
                <motion.div 
                  style={{ 
                    x: typeof window !== 'undefined' && window.innerWidth >= 1024 ? afterCardX : 0, 
                    scale: typeof window !== 'undefined' && window.innerWidth >= 1024 ? afterCardScale : 1 
                  }}
                  className="w-full lg:w-[48%] h-[600px] lg:h-full rounded-3xl bg-[#00744e] py-12 md:py-16 lg:py-20 px-6 md:px-10 lg:px-12 shadow-2xl shadow-emerald-900/20 text-white flex flex-col justify-between z-10"
                >
                  <div className="text-center">
                    <p className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-emerald-200/80 mb-2 md:mb-4">After FlowStudio:</p>
                    <h3 className="text-[40px] md:text-[66px] font-black text-white leading-[0.95] md:leading-[1] tracking-tighter" style={{ fontFamily: 'ManyChatGravity, sans-serif' }}>
                      Less grind <br /> 
                      and more pay
                    </h3>
                  </div>
                  <div className="space-y-4 md:space-y-6 max-w-md mx-auto w-full">
                    {[
                      "SMART REPLIES HANDLE FAQS INSTANTLY.", 
                      "ORGANIZED, TAGGED LEADS.", 
                      "SALES GOING OFF 24/7.", 
                      "EVERY INTERACTION IS A CHANCE TO CONVERT."
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-3 md:py-4 border-b border-white/10">
                        <span className="text-[9px] md:text-[11px] font-black text-white tracking-tight leading-tight uppercase">{item}</span>
                        <div className="w-4 h-4 md:w-5 md:h-5 rounded bg-white flex items-center justify-center text-[#00744e] flex-shrink-0"><CheckCircle size={10} /></div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-6 md:pt-8">
                    <button onClick={onGetStarted} className="w-full py-4 md:py-5 bg-white text-[#00744e] rounded-xl text-[10px] md:text-[12px] font-black uppercase tracking-widest shadow-xl shadow-black/10 hover:scale-[1.02] transition-transform">Start For Free Now</button>
                  </div>
                </motion.div>
              </div>
           </div>
        </div>
      </section>

      {/* Extra Space before next section */}
      <div className="h-20 bg-white" />

      {/* How it Works */}
      <section id="how-it-works" className="py-24 md:py-32 bg-white">
        <div className="max-w-[1500px] mx-auto px-6 md:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="space-y-4">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#0047FF]">Process</p>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-black" style={{ fontFamily: 'ManyChatGravity, sans-serif' }}>
                3 Easy Steps, <br />
                <span className="text-gray-400">Unlimited Possibilities</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Step Connectors (Desktop) */}
            <div className="hidden md:block absolute top-10 left-0 w-full h-px bg-gray-100 -z-10" />
            
            {[
              { num: '01', title: 'Connect Account', desc: 'Securely link your Instagram account via official Meta API.', icon: Instagram },
              { num: '02', title: 'Build Your Flow', desc: 'Choose triggers and craft your automated responses.', icon: Zap },
              { num: '03', title: 'Go Viral', desc: 'Watch your engagement and conversions skyrocket.', icon: TrendingUp },
            ].map((step, i) => (
              <div key={i} className="space-y-6">
                <div className="w-20 h-20 bg-white border border-gray-100 rounded-3xl shadow-xl flex items-center justify-center text-[#0047FF] relative z-10">
                   <step.icon size={32} />
                   <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#0047FF] text-white rounded-full flex items-center justify-center text-[12px] font-black">
                    {step.num}
                   </div>
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-black text-black">{step.title}</h3>
                   <p className="text-sm text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-[1500px] mx-auto px-6 md:px-16">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-black" style={{ fontFamily: 'ManyChatGravity, sans-serif' }}>See What People Are Saying 💬</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Jessica Ray", role: "Content Creator", text: "FlowStudio literally doubled my sales in just 30 days. The comment auto-DM is a game changer for my brand!", stars: 5 },
              { name: "Daniel Chen", role: "E-com Owner", text: "I was skeptical at first, but the results are insane. The dashboard is so easy to use and the setup took 5 mins.", stars: 5 },
              { name: "Maria Garcia", role: "Coach & Mentor", text: "No more spending hours in the DMs. I finally have my time back while my business keeps growing. 10/10!", stars: 5 },
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-6">
                <div className="flex gap-1">
                   {[...Array(t.stars)].map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-base text-gray-600 font-medium italic">"{t.text}"</p>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt={t.name} />
                   </div>
                   <div>
                      <p className="text-sm font-black text-black">{t.name}</p>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{t.role}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-[1000px] mx-auto px-6 md:px-16">
          <div className="text-center mb-16 space-y-4">
             <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#0047FF]">Help</p>
             <h2 className="text-3xl md:text-5xl font-black tracking-tight text-black" style={{ fontFamily: 'ManyChatGravity, sans-serif' }}>All Questions <span className="text-[#0047FF]">Answered</span></h2>
          </div>

          <div className="space-y-4">
            {[
              "Is it safe to connect my Instagram?",
              "Do I need any technical skills?",
              "Do I need to be a large creator?",
              "Can I cancel my subscription anytime?",
            ].map((q, i) => (
              <div key={i} className="group p-6 rounded-2xl border border-gray-100 hover:border-[#0047FF]/20 hover:bg-[#0047FF]/[0.02] transition-all cursor-pointer flex justify-between items-center">
                 <span className="text-base font-bold text-gray-700 group-hover:text-black transition-colors">{q}</span>
                 <ChevronDown size={18} className="text-gray-400 group-hover:text-[#0047FF] transition-all" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-12 bg-[#050505] text-white">
        <div className="max-w-[1500px] mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-20 border-b border-white/5">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#0047FF] rounded-xl flex items-center justify-center">
                  <Heart size={22} className="text-white fill-white" />
                </div>
                <span className="text-2xl font-black tracking-tight">FlowStudio</span>
              </div>
              <p className="text-gray-500 font-medium max-w-sm leading-relaxed">
                The world's most advanced Instagram DM automation platform for creators and brands.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0047FF] transition-colors cursor-pointer"><Instagram size={20} /></div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0047FF] transition-colors cursor-pointer"><Zap size={20} /></div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0047FF] transition-colors cursor-pointer"><Users size={20} /></div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Platform</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-500">
                <li className="hover:text-[#0047FF] cursor-pointer transition-colors">Features</li>
                <li className="hover:text-[#0047FF] cursor-pointer transition-colors">How it works</li>
                <li className="hover:text-[#0047FF] cursor-pointer transition-colors">Pricing</li>
                <li className="hover:text-[#0047FF] cursor-pointer transition-colors">Testimonials</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Legal</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-500">
                <li className="hover:text-[#0047FF] cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-[#0047FF] cursor-pointer transition-colors">Terms of Service</li>
                <li className="hover:text-[#0047FF] cursor-pointer transition-colors">Security</li>
                <li className="hover:text-[#0047FF] cursor-pointer transition-colors">Contact</li>
              </ul>
            </div>
          </div>

          <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-gray-600 font-medium">© 2026 FlowStudio AI. All rights reserved.</p>
            <div className="text-[100px] font-black text-white/[0.02] absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none">
              FlowStudio
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[200] bg-white p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#0047FF] rounded-lg flex items-center justify-center">
                  <Heart size={16} className="text-white fill-white" />
                </div>
                <span className="text-lg font-black tracking-tight text-black">FlowStudio</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-900"><X size={24} /></button>
            </div>
            
            <div className="flex flex-col gap-8 flex-1">
               {['Features', 'How it Works', 'Pricing', 'Testimonials'].map(item => (
                 <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black text-black">{item}</a>
               ))}
            </div>

            <div className="space-y-4 pt-8 border-t border-gray-100">
              <button onClick={() => { setMobileMenuOpen(false); onLoginClick(); }} className="w-full py-4 text-lg font-black text-black">Login</button>
              <button onClick={() => { setMobileMenuOpen(false); onGetStarted(); }} className="w-full py-4 bg-[#0047FF] text-white rounded-full text-lg font-black">Start For Free</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
