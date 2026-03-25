// src/services/careerService.ts

import { supabase } from '@/integrations/supabase/client';
import { UserInput, ValuationResult } from '../types';

// --- 1. THE TIER SYSTEM ---
const ROLE_TIERS: Record<string, number> = {
  // TIER 1: OPERATIONAL
  "Kitchen Porter / Steward": 1,
  "Commis Chef": 1,
  "Food Runner / Busser": 1,
  "Barback": 1,
  "Porter / Bell Attendant": 1,
  "Doorman / Valet": 1,
  "Accommodation Assistant / Housekeeping": 1,
  "Golf Associate / Caddy": 1,
  "Locker Room Attendant": 1,
  "Pool & Beach Attendant": 1,
  "Logistics / Driver": 1,
  "Retail Associate / Manager (Transitioning)": 1,
  "Healthcare / Care Assistant (Transitioning)": 1,
  "Student / Recent Graduate": 1,
  "Shift Manager / Team Leader": 1,
  "Teacher / Education (Transitioning)": 1,
  "Food & Beverage Assistant / Associate": 1,
  "Conference & Banqueting Staff": 1,

  // TIER 2: SKILLED / SERVICE
  "Demi Chef / Line Cook": 2,
  "Chef de Partie": 2,
  "Pastry Chef": 2,
  "Server / Waiter": 2,
  "Head Waiter / Captain": 2,
  "Bartender": 2,
  "Host / Hostess": 2,
  "Concierge": 2,
  "Receptionist / Front Desk Agent": 2,
  "Spa Therapist": 2,
  "Fitness Instructor / Personal Trainer": 2,
  "Customer Service Representative": 2,
  "Cabin Crew / Flight Attendant": 2,
  "Cruise Staff / Youth Staff": 2,
  "Private Jet Host": 2,
  "Security Officer / Manager": 2,
  "Corporate Admin / Assistant": 2,
  "Golf Operations Supervisor": 2,

  // TIER 3: MANAGEMENT
  "Sous Chef": 3,
  "Head Chef / Chef de Cuisine": 3,
  "Restaurant Manager": 3,
  "Restaurant General Manager (QSR)": 3,
  "Maitre D'": 3,
  "Sommelier": 3,
  "Bar Manager": 3,
  "Head Bartender / Mixologist": 3,
  "VIP Host / Promoter": 3,
  "Front Office Manager": 3,
  "Guest Experience Manager": 3,
  "Chief Concierge (Les Clefs d'Or)": 3,
  "Duty Manager": 3,
  "Night Auditor": 3,
  "Housekeeping Supervisor": 3,
  "Maintenance Manager / Chief Engineer": 3,
  "Sales / Events Manager": 3,
  "Revenue Manager": 3,
  "Human Resources / Talent Manager": 3,
  "Finance Manager / Financial Controller": 3,
  "Membership Director": 3,
  "Event / Wedding Planner": 3,
  "Cruise Director": 3,
  "Cabin Service Director (Airline)": 3,
  "Inflight Service Manager": 3,
  "Private Butler / Valet": 3,

  // TIER 4: EXECUTIVE
  "Executive Chef": 4,
  "Beverage Director": 4,
  "Director of Rooms": 4,
  "Director of Sales / Marketing": 4,
  "Director of Golf / Head Pro": 4,
  "Spa Director": 4,
  "General Manager (Hotel)": 4,
  "General Manager / COO (Private Club)": 4,
  "Hotel Director (Cruise)": 4,
  "Director of Operations": 4,
  "Franchise Owner": 4,
  "Area Coach / District Manager (Multi-Unit)": 4,
  "Estate Manager / House Manager": 4,
  "Lifestyle Manager": 4,
};

// --- 2. LOCATION FACTORS ---
const LOCATION_FACTORS: Record<string, number> = {
  "USA (Major City - NYC/LA/Miami)": 1.45,
  "USA (Regional)": 1.15,
  "UK (London)": 1.1,
  "UK (Regional)": 0.85,
  "Middle East (Saudi - Riyadh/Red Sea)": 1.40,
  "Middle East (Qatar / Other)": 1.15,
  "UAE (Dubai / Abu Dhabi)": 1.15,
  "Ireland (Dublin)": 1.0,
  "Ireland (Regional)": 0.80,
  "Europe (Western)": 0.95,
  "Canada / North America": 1.05,
  "Asia Pacific (Aus / NZ / Singapore)": 1.05,
  "Caribbean / Resorts": 0.95,
  "Cruise Ship / International Waters": 1.1,
  "India (Major Cities)": 0.55,
};

// --- 3. CURRENCY LOGIC ---
const getCurrency = (location: string): string => {
  if (location.includes("USA") || location.includes("Canada") || location.includes("Caribbean") || location.includes("Cruise")) return "$";
  if (location.includes("UK")) return "£";
  if (location.includes("Ireland") || location.includes("Europe")) return "€";
  if (location.includes("UAE")) return "AED ";
  if (location.includes("Saudi")) return "SAR ";
  if (location.includes("Qatar")) return "QAR ";
  if (location.includes("India")) return "₹";
  if (location.includes("Asia Pacific")) return "$";
  return "€";
};

// --- 4. AI-POWERED VALUATION (Primary) ---
const getAIValuation = async (input: UserInput): Promise<ValuationResult> => {
  const { data, error } = await supabase.functions.invoke('career-valuation', {
    body: {
      role: input.role,
      sector: input.sector,
      location: input.location,
      experienceYears: input.experienceYears,
      currentSalary: input.currentSalary,
      stateOfMind: input.stateOfMind,
    },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data as ValuationResult;
};

// --- 5. LOCAL FALLBACK ---
const getLocalValuation = (input: UserInput): ValuationResult => {
  const currentSalary = parseInt(input.currentSalary.replace(/[^0-9]/g, '')) || 30000;
  const roleTier = ROLE_TIERS[input.role] || 2;
  const locationFactor = LOCATION_FACTORS[input.location] || 0.9;
  const currency = getCurrency(input.location);

  let baseMin = 0, baseMax = 0;
  switch (roleTier) {
    case 1: baseMin = 24000; baseMax = 32000; break;
    case 2: baseMin = 32000; baseMax = 48000; break;
    case 3: baseMin = 50000; baseMax = 90000; break;
    case 4: baseMin = 90000; baseMax = 200000; break;
  }

  const marketMin = Math.round(baseMin * locationFactor);
  const marketMax = Math.round(baseMax * locationFactor);

  let projectedGrowth = 0;
  let ceilingWarning = "";

  if (roleTier === 1) {
    projectedGrowth = 1.08;
    ceilingWarning = `Operational roles in ${input.location} typically cap at ${currency}${Math.round(marketMax / 1000)}k. Significant income jumps require a move to Management or a High-Volume US/UAE Market.`;
  } else if (roleTier === 2) {
    projectedGrowth = 1.15;
    ceilingWarning = "You are approaching the specialist ceiling. Next jump requires team leadership (e.g. Duty Manager).";
  } else {
    projectedGrowth = 1.30;
    ceilingWarning = "High growth potential available through strategic moves (Asset Management, Multi-Unit).";
  }

  let futureValueLow = 0, futureValueHigh = 0;
  let marketPosition = "Fair Market Value";

  if (currentSalary > marketMax) {
    futureValueLow = Math.round(currentSalary * 1.02);
    futureValueHigh = Math.round(currentSalary * 1.05);
    ceilingWarning = `You are earning above the standard band for ${input.location}. To increase value, consider a Sector Pivot (e.g. Private Clubs) or Relocation.`;
    marketPosition = "Leading Market Rates";
  } else if (currentSalary < marketMin) {
    marketPosition = "Below Market Average";
    futureValueLow = Math.round(currentSalary * projectedGrowth);
    futureValueHigh = Math.round(currentSalary * (projectedGrowth + 0.1));
  } else {
    futureValueLow = Math.round(currentSalary * projectedGrowth);
    futureValueHigh = Math.round(currentSalary * (projectedGrowth + 0.1));
  }

  let bridgeRole = "Operations Supervisor";
  let rationale = "Moving from execution to oversight increases value by 30%.";

  if (input.role.includes("Caddy") || input.role.includes("Golf")) {
    bridgeRole = "Golf Operations Supervisor / Director";
    rationale = "Shift from physical service to commercial management to access the $60k+ bands.";
  } else if (input.role.includes("Chef") || input.role.includes("Cook")) {
    bridgeRole = "Sous Chef / Kitchen Manager";
    rationale = "Managing food cost (COGS) and labor is the multiplier for Chef salaries.";
  } else if (input.role.includes("Waiter") || input.role.includes("Server") || input.role.includes("Captain")) {
    bridgeRole = "Restaurant Manager / Maitre D'";
  } else if (input.role.includes("Reception")) {
    bridgeRole = "Front Office Manager / Duty Manager";
  } else if (input.role.includes("QSR") || input.role.includes("Fast") || input.role.includes("Shift Manager")) {
    bridgeRole = "Area Coach / District Manager";
    rationale = "Moving from Single-Unit to Multi-Unit management doubles earning potential.";
  } else if (input.role.includes("Butler") || input.role.includes("Estate")) {
    bridgeRole = "Director of Residences";
    rationale = "Managing the entire estate portfolio rather than just service delivery.";
  } else if (input.role.includes("Teacher") || input.role.includes("Education")) {
    bridgeRole = "Guest Relations Manager / Training Manager";
    rationale = "Your teaching skills translate directly to L&D and guest experience roles.";
  } else if (input.role.includes("Retail")) {
    bridgeRole = "Front Office Supervisor";
    rationale = "Retail management skills map directly to hotel front office operations.";
  } else if (input.role.includes("Healthcare") || input.role.includes("Care")) {
    bridgeRole = "Guest Relations / Concierge";
    rationale = "Your empathy and care skills are highly valued in luxury guest services.";
  } else if (input.role.includes("Conference") || input.role.includes("Banqueting")) {
    bridgeRole = "Events Manager / Sales Coordinator";
    rationale = "Conference operations experience is the gateway to high-value event sales.";
  }

  const format = (num: number) => `${currency}${Math.round(num).toLocaleString()}`;
  const valMin = Math.round(currentSalary * 0.95);
  const valMax = Math.round(currentSalary * 1.05);

  return {
    user_profile: {
      detected_role: input.role,
      detected_location: input.location,
      market_type: input.sector,
    },
    valuation: {
      current_market_value: `${format(valMin)} - ${format(valMax)}`,
      level_up_jump: `+${Math.round((projectedGrowth - 1) * 100)}%`,
      north_star_archetype: "Experience Architect",
      salary_ceiling_warning: ceilingWarning,
      market_position: marketPosition,
    },
    career_strategy: {
      agent_take: `You are currently leveraging skill in a specific sector. While ${format(currentSalary)} is strong for ${input.experienceYears} years, your 'Career Equity' is tied to physical presence.`,
      career_equity_3yr: `Potential to reach ${format(futureValueLow)} - ${format(futureValueHigh)}`,
      bridge_role: bridgeRole,
      rationale: rationale,
      next_move: "Strategic Pivot",
      path_to_mastery: {
        quest: "Operational Oversight",
        challenge: "Team Leadership",
        trial: "Commercial Awareness",
      },
    },
  };
};

// --- 6. PUBLIC API: Try AI first, fallback to local ---
export const calculateValuation = async (input: UserInput): Promise<ValuationResult> => {
  try {
    console.log("Attempting AI-powered valuation...");
    const result = await getAIValuation(input);
    console.log("AI valuation successful");
    return result;
  } catch (error) {
    console.warn("AI valuation failed, using local fallback:", error);
    return getLocalValuation(input);
  }
};
