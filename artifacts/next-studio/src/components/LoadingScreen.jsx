"use client";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export function LoadingScreen({ message = "Initializing Studio" }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#ffffff] overflow-hidden">
      {/* Premium Light Mesh Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-blue-100/40 to-transparent blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1.3, 1, 1.3],
            opacity: [0.15, 0.3, 0.15],
            rotate: [360, 270, 180, 90, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-indigo-100/40 to-transparent blur-[120px]"
        />
      </div>

      <div className="relative flex flex-col items-center">
        {/* The Core: Liquid Energy Logo */}
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          {/* Outer Ring Glow */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border border-blue-500/20 blur-sm"
          />

          {/* Main Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-[#f8faff] rounded-full p-1 border border-blue-500/10 flex items-center justify-center overflow-hidden shadow-[0_20px_50px_-15px_rgba(51,77,255,0.15)]"
          >
            {/* Liquid Fill Effect */}
            <motion.div 
              animate={{ 
                y: ["80%", "30%", "80%"],
                rotate: [0, 360]
              }}
              transition={{ 
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 10, repeat: Infinity, ease: "linear" }
              }}
              className="absolute inset-0 w-[240%] h-[240%] left-[-70%] top-[-70%] bg-gradient-to-t from-blue-600 to-indigo-500 opacity-30 rounded-[35%] blur-xl"
            />

            {/* Inner Icon - Now using brand color for visibility */}
            <div className="relative z-10">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  filter: ["drop-shadow(0 0 0px rgba(59,130,246,0))", "drop-shadow(0 0 10px rgba(59,130,246,0.3))", "drop-shadow(0 0 0px rgba(59,130,246,0))"]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Zap size={40} className="text-blue-600 fill-blue-600 md:w-12 md:h-12 drop-shadow-md" />
              </motion.div>
            </div>
          </motion.div>

          {/* Orbital Particle */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.8)]" />
          </motion.div>
        </div>

        {/* Brand & Progress Section */}
        <div className="mt-14 text-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900">
              Flow<span className="text-blue-600">Studio</span>
            </h1>
            
            <div className="mt-6 flex flex-col items-center gap-5">
              <motion.div 
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-slate-400"
              >
                {message}
              </motion.div>
              
              {/* Sleek Progress Bar */}
              <div className="w-56 h-[3px] bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ 
                    x: ["-100%", "100%"] 
                  }}
                  transition={{ 
                    duration: 1.8, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="w-1/2 h-full bg-gradient-to-r from-transparent via-blue-600 to-transparent"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Branding */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em]"
      >
        Neural Core Active • v2.4.0
      </motion.div>
    </div>
  );
}
