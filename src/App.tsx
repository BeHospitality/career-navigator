import React, { useState, useEffect } from 'react';
import { UserInput, ValuationResult, UserState } from './types';
import { ROLES, SECTORS, LOCATIONS, STATE_OF_MIND } from './constants';

// --- THE BRIDGE TO THE BRAIN ---
// Importing the secure Edge Function logic
import { calculateValuation } from './services/careerService'; 

// --- ICONS (Lucide React Standard) ---
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign,
  ChevronRight, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  Globe 
} from 'lucide-react'; 

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [input, setInput] = useState<UserInput>({
    role: ROLES[0],
    sector: SECTORS[0],
    location: LOCATIONS[0],
    experienceYears: 5,
    currentSalary: '',
    stateOfMind: 'Curious'
  });

  const loadingMessages = [
    "Calibrating Global Coordinates...",
    "Analyzing Market Ceilings...",
    "Identifying Bridge Roles...",
    "Locating Your North Star...",
    "Finalizing Career Map..."
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
    } catch (error) {
      console.error("Navigation failed:", error);
      alert("We couldn't generate your map. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="max-w-xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-6">
              <h2 className="text-5xl md:text-7xl font-serif italic text-white tracking-tight">
                FIND YOUR <span className="text-gold">WAY</span>
              </h2>
              <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
                The borderless career intelligence tool. Calibrate your coordinates, define your value, and chart your next move.
              </p>
              
              <div className="pt-8">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-600 mb-6">Step 1: The Vibe Check</p>
                <div className="grid gap-4">
                  {STATE_OF_MIND.map((state) => (
                    <button
                      key={state.id}
                      onClick={() => {
                        setInput({ ...input, stateOfMind: state.id as UserState });
                        setStep(2);
                      }}
                      className="group relative p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-gold transition-all text-left overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">{state.label}</h3>
                          <p className="text-zinc-500 text-sm group-hover:text-zinc-400 transition-colors">{state.description}</p>
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

      case 2:
        return (
          <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="text-center space-y-4">
              <h2 className="text-4xl font-serif italic text-gold">Your Profile</h2>
              <p className="text-zinc-400">Where are you starting from?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Current Role
                </label>
                <select 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-gold appearance-none"
                  value={input.role}
                  onChange={(e) => setInput({...input, role: e.target.value})}
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Sector
                </label>
                <select 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-gold appearance-none"
                  value={input.sector}
                  onChange={(e) => setInput({...input, sector: e.target.value})}
                >
                  {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location
                </label>
                <select 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-gold appearance-none"
                  value={input.location}
                  onChange={(e) => setInput({...input, location: e.target.value})}
                >
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Years Experience
                </label>
                <input 
                  type="number"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-gold"
                  value={input.experienceYears}
                  min={0}
                  max={50}
                  onChange={(e) => setInput({...input, experienceYears: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full py-4 bg-zinc-100 text-black font-bold rounded-xl hover:bg-gold transition-all flex items-center justify-center gap-2 group mt-6"
            >
              Set Coordinates <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        );

      case 3:
        return (
          <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-serif italic text-gold">Market Calibration</h2>
              <p className="text-zinc-400">What is your current total package (Yearly)?</p>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500">
                <DollarSign className="w-6 h-6" />
              </div>
              <input 
                type="text"
                placeholder="e.g. 55,000"
                className="w-full bg-zinc-900/50 border-2 border-zinc-800 rounded-2xl p-6 pl-12 text-3xl font-bold text-white focus:outline-none focus:border-gold placeholder:text-zinc-700 transition-all"
                value={input.currentSalary}
                onChange={(e) => setInput({...input, currentSalary: e.target.value})}
              />
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-gold shrink-0 mt-1" />
                <p className="text-sm text-zinc-400">We analyze live global market data to calculate your "Career Equity"—the projected value of your skills over the next 3 years.</p>
              </div>
            </div>

            <button
              disabled={!input.currentSalary}
              onClick={handleStartAudit}
              className={`w-full py-5 rounded-2xl font-black text-xl tracking-widest transition-all ${
                !input.currentSalary 
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                : 'bg-gold-gradient text-black hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.3)]'
              }`}
            >
              REVEAL MY MAP
            </button>
          </div>
        );

      case 4:
        if (!result) return null;
        
        return (
          <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-in zoom-in-95 duration-1000">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="inline-block px-4 py-1 rounded-full border border-gold text-gold text-xs font-bold tracking-[0.2em] uppercase mb-4 animate-pulse">
                Path Revealed • 2026 Strategy
              </div>
              <h2 className="text-5xl md:text-6xl font-serif italic text-white leading-tight">
                The <span className="text-gold">{result.valuation.north_star_archetype}</span>
              </h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto italic font-light">
                "{result.career_strategy.agent_take}"
              </p>
            </div>

            {/* Market Valuation Pulse */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                   <DollarSign className="w-32 h-32" />
                 </div>
                 <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Current Market Value</h3>
                 <div className="text-5xl font-black text-white mb-4">{result.valuation.current_market_value}</div>
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-sm font-bold animate-pulse-gold">
                   <Sparkles className="w-4 h-4" /> {result.valuation.level_up_jump} Growth Potential
                 </div>
                 <p className="mt-6 text-sm text-zinc-400 leading-relaxed">
                   {result.valuation.salary_ceiling_warning}
                 </p>
              </div>

              <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl space-y-6">
                <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Market Context: {result.user_profile.market_type}
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                    <span className="text-zinc-400">Detected Location</span>
                    <span className="text-white font-medium">{result.user_profile.detected_location}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                    <span className="text-zinc-400">Detected Role</span>
                    <span className="text-white font-medium">{result.user_profile.detected_role}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-400">3-Year Career Equity</span>
                    <span className="text-gold font-bold">{result.career_strategy.career_equity_3yr}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategy Roadmap */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-px bg-zinc-800 flex-grow" />
                <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500 shrink-0">Your Compass</h3>
                <div className="h-px bg-zinc-800 flex-grow" />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-zinc-900/20 border border-zinc-800 p-6 rounded-2xl space-y-4 hover:border-gold/30 transition-colors">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold font-bold">1</div>
                  <h4 className="font-bold text-white">The Bridge Role</h4>
                  <p className="text-sm text-gold font-serif italic">{result.career_strategy.bridge_role}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">{result.career_strategy.rationale}</p>
                </div>
                <div className="bg-zinc-900/20 border border-zinc-800 p-6 rounded-2xl space-y-4 hover:border-gold/30 transition-colors">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold font-bold">2</div>
                  <h4 className="font-bold text-white">The Next Move</h4>
                  <p className="text-sm text-zinc-300">{result.career_strategy.next_move}</p>
                  <div className="pt-2">
                    <span className="text-[10px] bg-zinc-800 text-zinc-500 px-2 py-1 rounded uppercase tracking-tighter">Immediate Impact</span>
                  </div>
                </div>
                <div className="bg-zinc-900/20 border border-zinc-800 p-6 rounded-2xl space-y-4 hover:border-gold/30 transition-colors">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold font-bold">3</div>
                  <h4 className="font-bold text-white">Path to Mastery</h4>
                  <ul className="space-y-3">
                    <li className="text-xs flex gap-2">
                      <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                      <span className="text-zinc-400"><strong className="text-zinc-200">Skill:</strong> {result.career_strategy.path_to_mastery.quest}</span>
                    </li>
                    <li className="text-xs flex gap-2">
                      <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                      <span className="text-zinc-400"><strong className="text-zinc-200">Challenge:</strong> {result.career_strategy.path_to_mastery.challenge}</span>
                    </li>
                    <li className="text-xs flex gap-2">
                      <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                      <span className="text-zinc-400"><strong className="text-zinc-200">Trial:</strong> {result.career_strategy.path_to_mastery.trial}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Call to Action - Web & Android Live Links */}
            <div className="sticky bottom-8 bg-black/80 backdrop-blur-xl border border-gold p-8 rounded-3xl text-center space-y-6 shadow-2xl z-50">
               <h3 className="text-2xl font-serif italic text-white">Access The Network</h3>
               <p className="text-zinc-400 text-sm max-w-lg mx-auto">
                 Your Compass is set. To connect with the mentors and roles on this map, enter the Be Family Ecosystem.
               </p>
               
               <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                 {/* Web App Button (iOS Interim Solution) */}
                 <a 
                   href="https://app.be.ie/" 
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-zinc-200 hover:scale-105 transition-all w-full sm:w-auto justify-center"
                 >
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                   </svg>
                   Launch Web App
                 </a>

                 {/* Android Button - LIVE */}
                 <a 
                   href="https://play.google.com/store/apps/details?id=com.beconnectapp.app" 
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex items-center gap-3 bg-transparent border border-zinc-700 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:border-gold hover:text-gold hover:scale-105 transition-all w-full sm:w-auto justify-center"
                 >
                   <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.14L6.05,2.66Z" /></svg>
                   Google Play
                 </a>

                 {/* Restart Button */}
                 <button 
                  onClick={() => setStep(1)}
                  className="px-6 py-4 text-zinc-500 hover:text-white transition-colors text-sm font-bold tracking-widest uppercase"
                 >
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
      <header className="p-8 flex justify-between items-center border-b border-zinc-900 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold flex items-center justify-center font-black text-black text-xl rounded-md italic">Be</div>
          <h1 className="text-sm font-bold uppercase tracking-[0.3em] hidden sm:block text-zinc-300">Career Compass</h1>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 bg-zinc-900/50 px-3 py-1 rounded-full border border-zinc-800">
          Intelligence v3.2.06
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 lg:px-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 animate-in fade-in duration-500">
            <div className="relative">
              <div className="w-32 h-32 border-2 border-gold/20 rounded-full animate-spin border-t-gold" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-gold/10 rounded-full animate-pulse flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-gold" />
                </div>
              </div>
            </div>
            <div className="space-y-3 text-center">
              <h3 className="text-3xl font-serif italic text-white animate-pulse">{loadingMessage}</h3>
              <p className="text-zinc-600 text-sm tracking-widest uppercase">Consulting Global Data</p>
            </div>
          </div>
        ) : renderStep()}
      </main>

      {/* Footer Branding */}
      <footer className="p-12 text-center text-[10px] text-zinc-700 uppercase tracking-[0.5em] font-medium">
        © 2026 Be Family Career Intelligence • Global Data Network
      </footer>
    </div>
  );
};

export default App;
