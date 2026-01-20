import { motion } from "framer-motion";
import { Compass } from "lucide-react";

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-5"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Compass className="w-6 h-6 text-gold" strokeWidth={1.5} />
          <span className="font-serif text-lg text-foreground tracking-wide">
            Be Career Compass
          </span>
        </div>

        {/* Navigation placeholder */}
        <nav className="hidden md:flex items-center gap-8">
          <a 
            href="#about" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            About
          </a>
          <a 
            href="#diagnostic" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            Diagnostic
          </a>
          <a 
            href="#insights" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            Insights
          </a>
        </nav>

        {/* Mobile menu indicator */}
        <button className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5">
          <span className="w-5 h-px bg-foreground" />
          <span className="w-5 h-px bg-foreground" />
        </button>
      </div>
    </motion.header>
  );
};

export default Header;
