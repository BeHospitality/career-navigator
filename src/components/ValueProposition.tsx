import { motion } from "framer-motion";
import { Target, TrendingUp, Globe } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Calibrate",
    description: "Assess where you are in your hospitality journey with precision diagnostics.",
  },
  {
    icon: TrendingUp,
    title: "Define",
    description: "Articulate your unique value proposition in the global market.",
  },
  {
    icon: Globe,
    title: "Navigate",
    description: "Chart strategic moves across borders and career milestones.",
  },
];

const ValueProposition = () => {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-sans font-medium tracking-[0.3em] uppercase text-gold mb-4 block">
            Your Career Agent
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-6">
            Not a Job Board
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            A reflective diagnostic tool designed for hospitality professionals 
            who think globally about their careers.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="group text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-gold/20 mb-6 group-hover:border-gold/50 transition-colors duration-500">
                <feature.icon className="w-6 h-6 text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
