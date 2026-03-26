import React, { useState, useEffect } from 'react';
import { UserInput, ValuationResult, UserState } from './types';
import { ROLES, SECTORS, LOCATIONS, STATE_OF_MIND } from './constants';
import { calculateValuation } from './services/careerService'; 
import { 
  Briefcase, MapPin, Clock, DollarSign, ChevronRight, 
  Sparkles, ArrowRight, CheckCircle, ShieldCheck, Globe 
} from 'lucide-react'; 

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [input, setInput] = useState<UserInput>({
    role: ROLES[0], sector: SECTORS[0], location: LOCATIONS[0],
    experienceYears: 5, currentSalary: '', stateOfMind: 'Curious'
  });

  const loadingMessages = [
    "Calibrating Global Coordinates...", "Analyzing Market Ceilings...",
    "Identifying Bridge Roles...", "Locating Your North Star...", "Finalizing Career Map..."
  ];

  useEffect(() => {
    if (loading) {
      let msgIndex = 0;
      setLoadingMessage(loadingMessages[0]);
      const interval = setInterval(() => {
        msgIndex = (msgIndex + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[msgIndex]);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleStartAudit = async () => {
    setLoading(true);
    try {
      const data = await calculateValuation(input);
      setResult(data);
      setStep(4);
      window.scrollTo(0,0); // Auto-scroll to top on mobile
    } catch (error) {
      console.error(error);
      alert("We couldn't generate your map. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: // VIBE CHECK
        return (
          <div className="max-w-xl mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4 md:space-y-6">
              {/* Responsive Heading: Smaller on Mobile */}
              <h2 className="text-4xl md:text-7xl font-serif italic text-white tracking-tight">
                FIND YOUR <span className="text-gold">WAY</span>
              </h2>
              <p className="text-zinc-400 text-base md:text-lg max-w-md mx-auto leading-relaxed px-4">
                The borderless career intelligence tool. Calibrate your coordinates, define your value, and chart your next move.
              </p>
              
              <div className="pt-4 md:pt-8">
                <p className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-zinc-600 mb-6">Step 1: The Vibe Check</p>
                <div className="grid gap-3 md:gap-4">
                  {STATE_OF_MIND.map((state) => (
                    <button
                      key={state.id}
                      onClick={() => {
                        setInput({ ...input, stateOfMind: state.id as UserState });
                        setStep(2);
                      }}
                      // Increased padding for mobile touch targets
                      className="group relative p-5 md:p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-gold transition-all text-left overflow-hidden active:scale-[0.98]"
                    >
                      <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative flex justify-between items-center">
                        <div>
                          <h3 className="text-lg md:text-xl font-semibold text-white mb-1">{state.label}</h3>
                          <p className="text-zinc-500 text-xs md:text-sm">{state.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-gold transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // INPUTS
        return (
          <div className="max-w-2xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="flex justify-between items-center px-1">
               <button 
                 onClick={() => setStep(1)}
                 className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1 text-xs md:text-sm uppercase tracking-widest p-2"
               >
                 <ChevronRight className="w-4 h-4 rotate-180" /> Back
               </button>
               <h2 className="text-2xl md:text-4xl font-serif italic text-gold">Your Profile</h2>
               <div className="w-12" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {[
                { label: 'Current Role', icon: Briefcase, val: input.role, set: (v:string)=>setInput({...input, role: v}), opts: ROLES },
                { label: 'Sector', icon: Sparkles, val: input.sector, set: (v:string)=>setInput({...input, sector: v}), opts: SECTORS },
                { label: 'Location', icon: MapPin, val: input.location, set: (v:string)=>setInput({...input, location: v}), opts: LOCATIONS },
              ].map((field, i) => (
                <div key={i} className="space-y-2">
                  <label className="text-[10px] md:text-xs uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-2">
                    <field.icon className="w-3 h-3 md:w-4 md:h-4" /> {field.label}
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm md:text-base text-white focus:outline-none focus:border-gold appearance-none"
                      value={field.val}
                      onChange={(e) => field.set(e.target.value)}
                    >
                      {field.opts.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 rotate-90 pointer-events-none" />
                  </div>
                </div>
              ))}

              <div className="space-y-2">
                <label className="text-[10px] md:text-xs uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-2">
                  <Clock className="w-3 h-3 md:w-4 md:h-4" /> Years Experience
                </label>
                <input 
                  type="number"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm md:text-base text-white focus:outline-none focus:border-gold"
                  value={input.experienceYears}
                  onChange={(e) => setInput({...input, experienceYears: Math.max(0, parseInt(e.target.value) || 0)})}
                />
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full py-5 bg-zinc-100 text-black font-bold rounded-xl hover:bg-gold transition-all flex items-center justify-center gap-2 group mt-4 text-lg"
            >
              Set Coordinates <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        );

      case 3: // SALARY
        return (
          <div className="max-w-xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center px-1">
               <button onClick={() => setStep(2)} className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1 text-xs md:text-sm uppercase tracking-widest p-2">
                 <ChevronRight className="w-4 h-4 rotate-180" /> Back
               </button>
               <div className="w-12" /> 
            </div>

            <div className="text-center space-y-2 md:space-y-4">
              <h2 className="text-3xl md:text-4xl font-serif italic text-gold">Calibration</h2>
              <p className="text-zinc-400 text-sm md:text-base">What is your current total package (Yearly)?</p>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500">
                <DollarSign className="w-6 h-6" />
              </div>
              <input 
                type="text"
                placeholder="e.g. 55,000"
                // Larger font and padding for mobile typing
                className="w-full bg-zinc-900/50 border-2 border-zinc-800 rounded-2xl p-6 pl-12 text-2xl md:text-3xl font-bold text-white focus:outline-none focus:border-gold placeholder:text-zinc-700 transition-all"
                value={input.currentSalary}
                onChange={(e) => setInput({...input, currentSalary: e.target.value})}
              />
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 p-4 md:p-6 rounded-xl space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-gold shrink-0 mt-1" />
                <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">We use AI-powered career intelligence to calculate your "Career Equity"—the projected value of your skills over the next 3 years.</p>
              </div>
            </div>

            <button
              disabled={!input.currentSalary}
              onClick={handleStartAudit}
              className={`w-full py-5 rounded-2xl font-black text-lg md:text-xl tracking-widest transition-all ${
                !input.currentSalary ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-gold-gradient text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]'
              }`}
            >
              REVEAL MY MAP
            </button>
          </div>
        );

      case 4: // RESULTS
        if (!result) return null;
        return (
          <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 pb-24 animate-in zoom-in-95 duration-1000">
            {/* Hero Section */}
            <div className="text-center space-y-4 md:space-y-6">
              <div className="inline-block px-4 py-1 rounded-full border border-gold text-gold text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-2 animate-pulse">
                Path Revealed • 2026 Strategy
              </div>
              <h2 className="text-4xl md:text-6xl font-serif italic text-white leading-tight">
                <span className="text-gold">The {result.valuation.north_star_archetype.replace(/^The\s+/i, '')}</span>
              </h2>
              <p className="text-base md:text-xl text-zinc-400 max-w-2xl mx-auto italic font-light px-4">
                "{result.career_strategy.agent_take}"
              </p>
            </div>

            {/* Market Valuation Pulse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="bg-zinc-900/40 border border-zinc-800 p-6 md:p-8 rounded-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                   <DollarSign className="w-24 h-24 md:w-32 md:h-32" />
                 </div>
                 <h3 className="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2">Current Market Value</h3>
                 {/* Responsive Font for Salary to prevent breaking */}
                 <div className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">{result.valuation.current_market_value}</div>
                 
                 <div className="flex flex-wrap gap-2 items-center">
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-xs md:text-sm font-bold animate-pulse-gold">
                     <Sparkles className="w-3 h-3 md:w-4 md:h-4" /> {result.valuation.level_up_jump} Growth
                   </div>
                   <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs md:text-sm font-bold ${result.valuation.market_position === 'Below Market Average' ? 'bg-red-500/10 text-red-400' : 'bg-gold/10 text-gold'}`}>
                      {result.valuation.market_position}
                   </div>
                 </div>

                 <p className="mt-6 text-xs md:text-sm text-zinc-400 leading-relaxed border-l-2 border-zinc-700 pl-4">
                   {result.valuation.salary_ceiling_warning}
                 </p>
              </div>

              <div className="bg-zinc-900/40 border border-zinc-800 p-6 md:p-8 rounded-3xl space-y-6">
                <h3 className="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Market Context
                </h3>
                <div className="space-y-4">
                  {[
                    { l: 'Location', v: result.user_profile.detected_location },
                    { l: 'Role', v: result.user_profile.detected_role },
                    { l: 'Sector', v: result.user_profile.market_type }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-zinc-800 text-sm md:text-base">
                      <span className="text-zinc-400">{item.l}</span>
                      <span className="text-white font-medium text-right">{item.v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-2 text-sm md:text-base">
                    <span className="text-zinc-400">3-Year Equity</span>
                    <span className="text-gold font-bold text-right">{result.career_strategy.career_equity_3yr}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategy Roadmap */}
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-px bg-zinc-800 flex-grow" />
                <h3 className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-zinc-500 shrink-0">Your Compass</h3>
                <div className="h-px bg-zinc-800 flex-grow" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {[
                  { title: 'The Bridge Role', sub: result.career_strategy.bridge_role, desc: result.career_strategy.rationale, num: 1 },
                  { title: 'The Next Move', sub: result.career_strategy.next_move, desc: 'Immediate Impact Strategy', num: 2 },
                  { title: 'Path to Mastery', sub: result.career_strategy.path_to_mastery.quest, desc: result.career_strategy.path_to_mastery.challenge, num: 3 }
                ].map((card, i) => (
                  <div key={i} className="bg-zinc-900/20 border border-zinc-800 p-5 md:p-6 rounded-2xl space-y-3 md:space-y-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold font-bold text-sm md:text-base">{card.num}</div>
                    <h4 className="font-bold text-white text-base md:text-lg">{card.title}</h4>
                    <p className="text-sm text-gold font-serif italic">{card.sub}</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action - MOBILE OPTIMIZED (No Sticky Covering) */}
            <div className="relative md:sticky md:bottom-8 bg-black/90 backdrop-blur-xl border border-gold p-6 md:p-8 rounded-3xl text-center space-y-4 md:space-y-6 shadow-2xl z-50">
               <h3 className="text-xl md:text-2xl font-serif italic text-white">Access The Network</h3>
               <p className="text-zinc-400 text-xs md:text-sm max-w-lg mx-auto">
                 Your Compass is set. To connect with the mentors and roles on this map, enter the Be Family Ecosystem.
               </p>
               
               <div className="flex flex-col gap-3 justify-center items-center">
                 <a 
                   href="https://app.be.ie/" 
                   target="_blank" rel="noopener noreferrer"
                   className="w-full sm:w-auto min-w-[240px] flex items-center justify-center gap-3 bg-white text-black px-6 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-zinc-200 shadow-lg text-sm md:text-base"
                 >
                   <Globe className="w-5 h-5 text-black" />
                   Launch Web App
                 </a>

                 <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <a href="https://apps.apple.com/in/app/be-connect-platform/id6757708396" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 border border-zinc-700 text-white px-5 py-3 rounded-xl hover:border-gold hover:text-gold transition-all text-xs uppercase font-bold">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M16.999 19.999c-.94 1.12-2.03 1.99-3.38 1.99-1.44 0-1.89-.85-3.55-.85-1.63 0-2.12.85-3.45.85-1.36 0-2.55-1.1-3.6-2.6-1.92-2.73-2.15-6.57-.04-9.35.9-1.18 2.45-1.93 3.73-1.93 1.25 0 2.12.83 2.92.83.78 0 1.95-.83 3.32-.83 1.34 0 2.62.88 3.37 1.72-3.08 1.53-2.53 6.05.65 7.18-.68 1.77-1.68 3.58-2.97 5.09l-.02.04h.02zM12.91 6.8c-.59-1.4.29-2.86 1.58-3.43.68 1.54-.34 3.03-1.58 3.43z"/></svg>
                      Apple Store
                    </a>
                    <a href="https://play.google.com/store/apps/details?id=com.beconnectapp.app" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 border border-zinc-700 text-white px-5 py-3 rounded-xl hover:border-gold hover:text-gold transition-all text-xs uppercase font-bold">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.14L6.05,2.66Z" /></svg>
                      Google Play
                    </a>
                 </div>

                 <button onClick={() => setStep(1)} className="px-6 py-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-bold tracking-widest uppercase mt-2">
                   Reset Compass
                 </button>
               </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] selection:bg-gold selection:text-black font-sans">
      {/* Header */}
      <header className="p-6 md:p-8 flex justify-between items-center border-b border-zinc-900 mb-6 md:mb-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gold flex items-center justify-center font-black text-black text-lg md:text-xl rounded-md italic">Be</div>
          <h1 className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] hidden sm:block text-zinc-300">Career Compass</h1>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 bg-zinc-900/50 px-3 py-1 rounded-full border border-zinc-800">
          Intelligence v3.3 Mobile
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 md:px-12 pb-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 md:space-y-12 animate-in fade-in duration-500">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 border-2 border-gold/20 rounded-full animate-spin border-t-gold" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gold/10 rounded-full animate-pulse flex items-center justify-center">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-gold" />
                </div>
              </div>
            </div>
            <div className="space-y-2 md:space-y-3 text-center">
              <h3 className="text-xl md:text-3xl font-serif italic text-white animate-pulse">{loadingMessage}</h3>
              <p className="text-zinc-600 text-xs md:text-sm tracking-widest uppercase">Consulting Global Data</p>
            </div>
          </div>
        ) : renderStep()}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <a
          href="https://be.ie/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#6B7280] hover:underline"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Privacy Notice
        </a>
      </footer>
    </div>
  );
};

export default App;
