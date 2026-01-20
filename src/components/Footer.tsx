import { motion } from "framer-motion";
import { Compass } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative py-16 px-6 border-t border-border/50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center text-center"
        >
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <Compass className="w-5 h-5 text-gold" strokeWidth={1.5} />
            <span className="font-serif text-foreground">Be Career Compass</span>
          </div>

          {/* Tagline */}
          <p className="text-muted-foreground text-sm max-w-md mb-8">
            The borderless career intelligence tool for hospitality professionals.
          </p>

          {/* Divider */}
          <div className="divider-gold mb-8" />

          {/* Copyright */}
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} The Be Career Compass. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
