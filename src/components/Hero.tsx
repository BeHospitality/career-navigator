import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/30" />
      
      {/* Decorative compass element */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.03, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <Compass className="w-[600px] h-[600px] text-gold" strokeWidth={0.5} />
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Brand Mark */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <span className="text-xs font-sans font-medium tracking-[0.3em] uppercase text-muted-foreground">
            The Be Career Compass
          </span>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="divider-gold mb-12"
        />

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="headline-cinematic text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-foreground mb-8"
        >
          <span className="block">FIND</span>
          <span className="block text-gold-gradient">YOUR WAY</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
          className="font-sans text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12 text-balance"
        >
          The borderless career intelligence tool. Calibrate your coordinates, 
          define your value, and chart your next move.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
        >
          <Button 
            variant="gold" 
            size="xl"
            className="group glow-gold"
          >
            <Compass className="w-5 h-5 transition-transform duration-500 group-hover:rotate-45" />
            Check My Coordinates
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-12 bg-gradient-to-b from-gold/50 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
