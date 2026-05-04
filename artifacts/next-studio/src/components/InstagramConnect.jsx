"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, Instagram, CheckCircle2, ShieldCheck, Heart, X } from "lucide-react";
import { motion } from "framer-motion";

export function InstagramConnect({ onBack, onLogin, connectUrl, igConnected, igUsername, igImage, onLogout }) {
  const [success, setSuccess] = useState(false);

  // For demo: trigger success after 2 seconds if not connected
  useEffect(() => {
    if (!igConnected && !success) {
      const timer = setTimeout(() => {
        // In a real app, this would be triggered by the OAuth callback
        // setSuccess(true); 
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [igConnected]);

  // If already connected, we might want to show success immediately or just close
  useEffect(() => {
    if (igConnected) {
      setSuccess(true);
    }
  }, [igConnected]);

  if (success) {
    return (
      <div className="fixed inset-0 z-[200] bg-background/80 backdrop-blur-sm flex items-center justify-center p-6 overflow-hidden">
        {/* Confetti Animation Layer */}
        <div className="absolute inset-0 pointer-events-none">
           {[...Array(30)].map((_, i) => (
             <motion.div
               key={i}
               initial={{ 
                 top: -20, 
                 left: `${Math.random() * 100}%`,
                 rotate: 0,
                 opacity: 1
               }}
               animate={{ 
                 top: "110%", 
                 rotate: 360,
                 opacity: [1, 1, 0]
               }}
               transition={{ 
                 duration: 2 + Math.random() * 2, 
                 repeat: Infinity,
                 delay: Math.random() * 2,
                 ease: "linear"
               }}
               className="absolute w-2 h-4 rounded-sm"
               style={{ 
                 backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)]
               }}
             />
           ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative z-10 bg-card border border-border p-10 rounded-[8px] shadow-2xl max-w-sm w-full text-center space-y-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-[8px] bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                 <Heart size={20} className="text-white fill-white" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-foreground">FlowStudio</h1>
          </div>

          <div className="relative mx-auto w-24 h-24">
             <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
             <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 p-1 shadow-xl">
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                   {igImage ? <img src={igImage} className="w-full h-full object-cover" /> : <Instagram size={32} className="text-primary" />}
                </div>
             </div>
          </div>

          <div className="space-y-2">
             <h2 className="text-xl font-black tracking-tight text-foreground">Congratulations! 🎉</h2>
             <p className="text-[13px] text-muted-foreground font-medium">
                @{igUsername || 'retbotbd'} is successfully connected!
             </p>
          </div>

          <button 
            onClick={onBack}
            className="w-full py-4 bg-primary text-primary-foreground rounded-[8px] font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Next
          </button>
        </motion.div>

        {/* Success Toast */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-10 right-10 flex items-center gap-3 px-5 py-3 bg-white border-l-4 border-green-500 rounded-[8px] shadow-2xl z-50"
        >
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
             <CheckCircle2 size={14} />
          </div>
          <span className="text-[13px] font-bold text-foreground">Instagram Account connected</span>
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground ml-4">
             <X size={14} />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center p-6 overflow-y-auto">
      <div className="max-w-[340px] w-full space-y-7 py-10">
        {/* Back Button */}
        <div className="flex justify-start">
          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-[11px] font-bold"
          >
            <ChevronLeft size={14} />
            Back
          </button>
        </div>

        {/* Logo Section */}
        <div className="text-center space-y-1.5">
           <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-[8px] bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                 <Heart size={18} className="text-white fill-white" />
              </div>
              <h1 className="text-xl font-black tracking-tighter text-foreground">FlowStudio</h1>
           </div>
           <h2 className="text-lg font-black tracking-tight text-foreground">Connect Instagram Account ✨</h2>
           <p className="text-[10px] text-muted-foreground font-bold">Only a few steps away to go Viral!</p>
        </div>

        {/* Info Card */}
        <div className="bg-muted/30 border border-border rounded-[8px] p-6 space-y-4">
           <div className="flex items-center gap-3 text-blue-500">
              <div className="w-8 h-8 rounded-[8px] bg-blue-500/10 flex items-center justify-center">
                 <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5 7.5C15.8431 7.5 14.5 8.84315 14.5 10.5C14.5 11.2332 14.764 11.9054 15.2016 12.4284L12 15.63L8.79836 12.4284C9.23597 11.9054 9.5 11.2332 9.5 10.5C9.5 8.84315 8.15685 7.5 6.5 7.5C4.84315 7.5 3.5 8.84315 3.5 10.5C3.5 12.1569 4.84315 13.5 6.5 13.5C7.23321 13.5 7.90538 13.236 8.42838 12.7984L11.63 16C11.1924 16.523 11 17.1952 11 17.9284C11 19.5852 12.3431 20.9284 14 20.9284C15.6569 20.9284 17 19.5852 17 17.9284C17 17.1952 16.8076 16.523 16.37 16L19.5716 12.7984C20.0946 13.236 20.7668 13.5 21.5 13.5C23.1569 13.5 24.5 12.1569 24.5 10.5C24.5 8.84315 23.1569 7.5 21.5 7.5C19.8431 7.5 18.5 8.84315 18.5 10.5C18.5 11.2332 18.764 11.9054 19.2016 12.4284L16 15.63L12.7984 12.4284C13.236 11.9054 13.5 11.2332 13.5 10.5C13.5 8.84315 12.1569 7.5 10.5 7.5C8.84315 7.5 7.5 8.84315 7.5 10.5C7.5 12.1569 8.84315 13.5 10.5 13.5C11.2332 13.5 11.9054 13.236 12.4284 12.7984L15.63 16L18.8316 12.7984C19.2692 12.2754 19.5 11.6032 19.5 10.87C19.5 9.21315 18.1569 7.87 16.5 7.87C14.8431 7.87 13.5 9.21315 13.5 10.87C13.5 11.6032 13.7308 12.2754 14.1684 12.7984L11 15.9668L7.83162 12.7984C8.26922 12.2754 8.5 11.6032 8.5 10.87C8.5 9.21315 7.15685 7.87 5.5 7.87C3.84315 7.87 2.5 9.21315 2.5 10.87C2.5 12.5269 3.84315 13.87 5.5 13.87C6.23321 13.87 6.90538 13.6392 7.42838 13.2016L10.5968 16.37L7.42838 19.5384C6.90538 19.1008 6.23321 18.87 5.5 18.87C3.84315 18.87 2.5 20.2131 2.5 21.87C2.5 23.5269 3.84315 24.87 5.5 24.87C7.15685 24.87 8.5 23.5269 8.5 21.87C8.5 21.1368 8.26922 20.4646 7.83162 19.9416L11 16.7732L14.1684 19.9416C13.7308 20.4646 13.5 21.1368 13.5 21.87C13.5 23.5269 14.8431 24.87 16.5 24.87C18.1569 24.87 19.5 23.5269 19.5 21.87C19.5 21.1368 19.2692 20.4646 18.8316 19.9416L15.6632 16.7732L18.8316 13.6048C19.2692 14.0424 19.9414 14.2732 20.6746 14.2732C22.3314 14.2732 23.6746 12.93 23.6746 11.2732C23.6746 9.61635 22.3314 8.27315 20.6746 8.27315C19.9414 8.27315 19.2692 8.50395 18.7462 8.94155L15.5778 5.77315C16.1008 6.21075 16.773 6.44155 17.5062 6.44155C19.1631 6.44155 20.5062 5.09835 20.5062 3.44155C20.5062 1.78475 19.1631 0.44155 17.5062 0.44155C15.8493 0.44155 14.5062 1.78475 14.5062 3.44155C14.5062 4.17475 14.737 4.84695 15.1746 5.36995L12.0062 8.53835L8.83782 5.36995C9.27542 4.84695 9.50622 4.17475 9.50622 3.44155C9.50622 1.78475 8.16307 0.44155 6.50622 0.44155C4.84937 0.44155 3.50622 1.78475 3.50622 3.44155C3.50622 5.09835 4.84937 6.44155 6.50622 6.44155C7.23942 6.44155 7.91158 6.21075 8.43458 5.77315L11.603 8.94155C11.1654 8.41855 10.9346 7.74635 10.9346 7.01315C10.9346 5.35635 12.2778 4.01315 13.9346 4.01315C15.5914 4.01315 16.9346 5.35635 16.9346 7.01315C16.9346 7.74635 16.7038 8.41855 16.2662 8.94155L19.4346 12.1099C19.9576 11.6723 20.6298 11.4415 21.363 11.4415C23.0198 11.4415 24.363 12.7847 24.363 14.4415C24.363 16.0983 23.0198 17.4415 21.363 17.4415C20.6298 17.4415 19.9576 17.2107 19.4346 16.7732L16.2662 19.9416C16.7038 20.4646 16.9346 21.1368 16.9346 21.87C16.9346 23.5269 15.5914 24.87 13.9346 24.87C12.2778 24.87 10.9346 23.5269 10.9346 21.87C10.9346 21.1368 11.1654 20.4646 11.603 19.9416L8.43458 16.7732C7.91158 17.2107 7.23942 17.4415 6.50622 17.4415C4.84937 17.4415 3.50622 16.0983 3.50622 14.4415C3.50622 12.7847 4.84937 11.4415 6.50622 11.4415C7.23942 11.4415 7.91158 11.6723 8.43458 12.1099L11.603 8.94155L14.7714 12.1099C14.3338 12.6329 14.103 13.3051 14.103 14.0383C14.103 15.6951 15.4462 17.0383 17.103 17.0383C18.7598 17.0383 20.103 15.6951 20.103 14.0383C20.103 13.3051 19.8722 12.6329 19.4346 12.1099L16.2662 8.94155Z" />
                 </svg>
              </div>
              <span className="text-[13px] font-bold">We're a Meta-verified business</span>
           </div>
           
           <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
             We only use official Instagram APIs and processes. Your Instagram account is secure, and you stay in full control.
           </p>

           <div className="space-y-3 pt-1">
              {[
                "Official Meta OAuth login",
                "Safe and Secure",
                "Used by 1000+ creators"
              ].map(item => (
                <div key={item} className="flex items-center gap-2.5 text-[10px] font-bold text-foreground/80">
                   <div className="text-green-500">
                      <CheckCircle2 size={14} />
                   </div>
                   {item}
                </div>
              ))}
           </div>
        </div>

        {/* Login Button */}
        <div className="space-y-5 text-center">
           <a 
             href={connectUrl}
             className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white rounded-[8px] font-black text-xs shadow-lg shadow-red-500/10 hover:brightness-110 transition-all"
           >
             <Instagram size={16} />
             Login with Instagram
           </a>

           <div className="space-y-4">
              <p className="text-[9px] text-muted-foreground font-bold px-6 leading-relaxed">
                By continuing, you agree to FlowStudio's <br />
                <a href="/terms-of-service" className="text-primary hover:underline cursor-pointer">Terms of Service</a> and <a href="/privacy-policy" className="text-primary hover:underline cursor-pointer">Privacy Policy</a>
              </p>
              <button 
                onClick={onLogout}
                className="text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
              >
                Logout
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
