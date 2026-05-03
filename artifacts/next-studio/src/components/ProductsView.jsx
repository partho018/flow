"use client";
import { ShoppingBag, Package, Tag, Sparkles, ArrowRight, Bell, Menu } from "lucide-react";
import { motion } from "framer-motion";

export function ProductsView({ onMenuToggle }) {
  const upcoming = [
    { icon: Package, title: "Digital Products", desc: "Sell eBooks, presets, templates & more directly from your DMs." },
    { icon: Tag, title: "Discount Codes", desc: "Auto-send exclusive coupon codes to commenters and story repliers." },
    { icon: ShoppingBag, title: "Product Drops", desc: "Announce new product launches and automate the hype." },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-1.5 text-foreground" onClick={onMenuToggle}>
            <Menu size={18} />
          </button>
          <h2 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60">Products</h2>
        </div>
        <span className="px-2.5 py-1 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest rounded-full">
          Coming Soon
        </span>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="min-h-full flex items-center justify-center py-10">
          <div className="max-w-2xl w-full text-center space-y-10 sm:space-y-16">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Animated Icon */}
            <div className="relative mx-auto w-20 h-20 sm:w-28 sm:h-28">
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-[24px] sm:rounded-[32px] bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 flex items-center justify-center mx-auto shadow-2xl shadow-primary/10"
              >
                <ShoppingBag size={36} className="text-primary sm:size-[52px]" strokeWidth={1.5} />
              </motion.div>
              {/* Floating sparkles */}
              <motion.div
                animate={{ y: [-4, 4, -4], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3"
              >
                <Sparkles size={16} className="text-primary sm:size-[20px]" />
              </motion.div>
            </div>

            <div className="space-y-2 sm:space-y-3 px-4">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tighter text-foreground">
                Products is <span className="text-primary">Coming Soon</span>
              </h1>
              <p className="text-[11px] sm:text-sm text-muted-foreground font-medium leading-relaxed max-w-md mx-auto">
                We're building a powerful product selling engine for Instagram creators. 
                Sell your digital products, automate delivery — all from your DMs.
              </p>
            </div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 px-4"
          >
            {upcoming.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (i + 1) }}
                className="p-4 sm:p-5 rounded-2xl bg-card border border-border/60 text-left space-y-2 sm:space-y-3 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon size={16} className="text-primary sm:size-[18px]" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-foreground">{feature.title}</h3>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Notify CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border border-border rounded-full text-[10px] sm:text-xs text-muted-foreground font-medium">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full animate-pulse" />
              Currently in development
            </div>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-bold text-[10px] sm:text-xs hover:brightness-110 transition-all shadow-lg shadow-primary/20">
              <Bell size={14} />
              Notify Me When Ready
              <ArrowRight size={14} />
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  </div>
  );
}
