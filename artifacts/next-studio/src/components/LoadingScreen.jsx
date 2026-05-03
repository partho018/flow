"use client";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export function LoadingScreen({ message = "Initializing Studio" }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#fcfdff] overflow-hidden p-6">
      {/* Background Decorative Elements - Soft & Airy */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0],
            y: [0, 20, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[5%] w-[80%] md:w-[50%] h-[50%] bg-primary/5 rounded-full blur-[80px] md:blur-[100px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -30, 0],
            y: [0, -40, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[5%] w-[70%] md:w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[60px] md:blur-[80px]"
        />
      </div>

      <div className="relative flex flex-col items-center w-full max-w-xs">
        {/* Main Logo Container */}
        <div className="relative">
          {/* Pulsing Aura */}
          <motion.div 
            animate={{ 
              scale: [1, 1.6],
              opacity: [0.15, 0]
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
              ease: "easeOut" 
            }}
            className="absolute inset-0 bg-primary/20 rounded-[28px] md:rounded-[32px] blur-2xl md:blur-3xl"
          />
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary to-indigo-600 rounded-[28px] md:rounded-[32px] flex items-center justify-center shadow-[0_15px_40px_-10px_rgba(51,77,255,0.25)] relative z-10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-60" />
            
            <motion.div 
              animate={{ y: ["100%", "0%", "100%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-white/10 blur-xl"
            />

            <Zap className="w-10 h-10 md:w-11 md:h-11 text-white fill-white relative z-20 drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]" />
          </motion.div>
          
          {/* Rotating Outer Ring - Adjusted for mobile scale */}
          <svg className="absolute inset-0 -m-4 md:-m-5 w-[calc(100%+32px)] h-[calc(100%+32px)] md:w-[calc(100%+40px)] md:h-[calc(100%+40px)] pointer-events-none">
            <motion.circle
              cx="50%"
              cy="50%"
              r="52"
              className="md:r-[62]"
              fill="none"
              stroke="url(#loading-gradient-light)"
              strokeWidth="1.5"
              strokeDasharray="60 160"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <defs>
              <linearGradient id="loading-gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
                <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 md:mt-14 text-center"
        >
          <h1 className="text-xl md:text-2xl font-black tracking-[-0.05em] text-slate-900 flex items-center justify-center gap-1">
            Flow<span className="text-primary">Studio</span>
          </h1>
          
          {/* Loading Text & Dots */}
          <div className="mt-4 md:mt-5 flex flex-col items-center gap-3 md:gap-3.5">
            <motion.p 
              animate={{ 
                opacity: [0.4, 0.8, 0.4],
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ 
                opacity: { duration: 2.5, repeat: Infinity },
                backgroundPosition: { duration: 3.5, repeat: Infinity, ease: "linear" }
              }}
              className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.35em] md:tracking-[0.45em] text-transparent bg-clip-text bg-gradient-to-r from-slate-400 via-primary/80 to-slate-400 bg-[length:200%_auto]"
            >
              {message}
            </motion.p>
            
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.4, 1],
                    backgroundColor: ["rgba(203,213,225,1)", "rgba(51,77,255,1)", "rgba(203,213,225,1)"]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5, 
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                  className="w-1 h-1 rounded-full"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 md:bottom-12 left-0 w-full text-center px-4"
      >
        <p className="text-[8px] md:text-[9px] font-bold text-slate-400/50 uppercase tracking-[0.2em]">
          Version 2.4.0 • Secured by Cloud
        </p>
      </motion.div>
    </div>
  );
}
