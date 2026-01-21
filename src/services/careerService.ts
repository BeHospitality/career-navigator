// src/services/careerService.ts

import { UserInput, ValuationResult } from "../types";

// --- 1. THE TIER SYSTEM (Validated against Global Reports) ---
// Tier 1: Operational (Capped)
// Tier 2: Skilled/Service (Moderate)
// Tier 3: Management/Specialist (High)
// Tier 4: Executive/Strategic (Uncapped)

const ROLE_TIERS: Record<string, number> = {
  // TIER 1: OPERATIONAL (Hard Ceiling ~€32k-€35k)
  "Kitchen Porter / Steward": 1,
  "Commis Chef": 1,
  "Food Runner / Busser": 1,
  Barback: 1,
  "Porter / Bell Attendant": 1,
  "Doorman / Valet": 1,
  "Accommodation Assistant / Housekeeping": 1,
  "Golf Associate / Caddy": 1,
  "Locker Room Attendant": 1,
  "Pool & Beach Attendant": 1,
  "Driver / Logistics": 1,
  "Retail Associate / Manager (Transitioning)": 1,
  "Healthcare / Care Assistant (Transitioning)": 1,
  "Student / Recent Graduate": 1,
  "Shift Manager / Team Leader": 1, // QSR entry leadership

  // TIER 2: SKILLED / SERVICE (Caps ~€45k-€55k)
  "Demi Chef / Line Cook": 2,
  "Chef de Partie": 2,
  "Pastry Chef": 2,
  "Server / Waiter": 2,
  Bartender: 2,
  "Host / Hostess": 2,
  Concierge: 2,
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

  // TIER 3: MANAGEMENT (High Growth ~€60k-€100k)
  "Sous Chef": 3,
  "Head Chef / Chef de Cuisine": 3,
  "Restaurant Manager": 3,
  "Restaurant General Manager (QSR)": 3, // Can earn $80k+ in US
  "Maitre D'": 3,
  Sommelier: 3,
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
  "Private Butler / Valet": 3, // High earning potential in private service

  // TIER 4: EXECUTIVE (Uncapped / Equity Potential)
  "Executive Chef": 4,
  "Beverage Director": 4,
  "Director of Rooms": 4,
  "Director of Sales / Marketing": 4,
  "Director of Golf / Head Pro": 4,
  "Spa Director": 4,
  "General Manager (Hotel)": 4,
  "General Manager / COO (Private Club)": 4, // $300k+ potential
  "Hotel Director (Cruise)": 4,
  "Director of Operations": 4,
  "Franchise Owner": 4,
  "Area Coach / District Manager (Multi-Unit)": 4, // QSR Multi-unit
  "Estate Manager / House Manager": 4, // UHNW Management
  "Lifestyle Manager": 4,
};

// --- 2. LOCATION FACTORS (Validated against Global Report) ---
const LOCATION_FACTORS: Record<string, number> = {
  "USA (Major City - NYC/LA/Miami)": 1.45,
  "USA (Regional)": 1.15,
  "UK (London)": 1.1,
  "Middle East (Saudi - Riyadh/Red Sea)": 1.4, // Premium for Saudi Giga-projects
  "Middle East (Qatar / Other)": 1.15,
  "UAE (Dubai / Abu Dhabi)": 1.15,
  "Ireland (Dublin)": 1.0,
  "Ireland (Regional)": 0.8, // Validated drop-off
  "Europe (Western)": 0.95,
  "Canada / North America": 1.05,
  "Asia Pacific (Aus / NZ / Singapore)": 1.05,
  "UK (Regional)": 0.85,
  "Caribbean / Resorts": 0.95,
  "Cruise Ship / International Waters": 1.1,
  "India (Major Cities)": 0.55,
};

// --- 3. CURRENCY FORMATTERS ---
const CURRENCY_SYMBOLS: Record<string, string> = {
  USA: "$",
  UK: "£",
  Ireland: "€",
  Europe: "€",
  "Middle East": "AED ",
  India: "₹",
  Asia: "$",
  Canada: "$",
  Caribbean: "$",
  Cruise: "$",
  UAE: "AED ",
};

const getCurrency = (location: string) => {
  if (location.includes("USA") || location.includes("Canada") || location.includes("Caribbean")) return "$";
  if (location.includes("UK")) return "£";
  if (location.includes("Ireland") || location.includes("Europe")) return "€";
  if (location.includes("Middle East") || location.includes("UAE")) return "AED ";
  if (location.includes("India")) return "₹";
  return "€";
};

// --- 4. THE LOGIC CORE ---
export const calculateValuation = async (input: UserInput): Promise<ValuationResult> => {
  // Simulate API delay (Replacing Supabase call with local logic)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const currentSalary = parseInt(input.currentSalary.replace(/[^0-9]/g, "")) || 30000;
  const roleTier = ROLE_TIERS[input.role] || 2;
  const locationFactor = LOCATION_FACTORS[input.location] || 0.9;
  const currency = getCurrency(input.location);

  // BASE BANDS (At Factor 1.0 - Dublin/London Baseline)
  let baseMin = 0;
  let baseMax = 0;

  switch (roleTier) {
    case 1: // Operational
      baseMin = 24000;
      baseMax = 32000;
      break;
    case 2: // Skilled
      baseMin = 32000;
      baseMax = 48000;
      break;
    case 3: // Management
      baseMin = 50000;
      baseMax = 90000;
      break;
    case 4: // Executive
      baseMin = 90000;
      baseMax = 200000;
      break;
  }

  // Apply Location Adjustments
  let marketMin = Math.round(baseMin * locationFactor);
  let marketMax = Math.round(baseMax * locationFactor);

  // --- GROWTH & CEILING LOGIC ---
  let projectedGrowth = 0;
  let ceilingWarning = "";

  if (roleTier === 1) {
    projectedGrowth = 1.08;
    ceilingWarning = `Operational roles in ${input.location} typically cap at ${currency}${Math.round(marketMax / 1000)}k. Significant income jumps require a move to Management or a High-Volume US/UAE Market.`;
  } else if (roleTier === 2) {
    projectedGrowth = 1.15;
    ceilingWarning =
      "You are approaching the specialist ceiling. Next jump requires team leadership (e.g. Duty Manager).";
  } else {
    projectedGrowth = 1.3;
    ceilingWarning = "High growth potential available through strategic moves (Asset Management, Multi-Unit).";
  }

  // Cap growth if already high earner
  let futureValueLow = 0;
  let futureValueHigh = 0;

  if (currentSalary > marketMax) {
    futureValueLow = Math.round(currentSalary * 1.02);
    futureValueHigh = Math.round(currentSalary * 1.05);
    ceilingWarning = `You are earning above the standard band for ${input.location}. To increase value, consider a Sector Pivot (e.g. Private Clubs) or Relocation.`;
  } else {
    futureValueLow = Math.round(currentSalary * projectedGrowth);
    futureValueHigh = Math.round(currentSalary * (projectedGrowth + 0.1));
  }

  // --- BRIDGE ROLES (Context-Aware) ---
  let bridgeRole = "Operations Supervisor";
  let rationale = "Moving from execution to oversight increases value by 30%.";

  if (input.role.includes("Caddy") || input.role.includes("Golf")) {
    bridgeRole = "Golf Operations Supervisor / Director";
    rationale = "Shift from physical service to commercial management to access the $60k+ bands.";
  } else if (input.role.includes("Chef") || input.role.includes("Cook")) {
    bridgeRole = "Sous Chef / Kitchen Manager";
    rationale = "Managing food cost (COGS) and labor is the multiplier for Chef salaries.";
  } else if (input.role.includes("Waiter") || input.role.includes("Server")) {
    bridgeRole = "Restaurant Manager / Maitre D'";
  } else if (input.role.includes("Reception")) {
    bridgeRole = "Front Office Manager / Duty Manager";
  } else if (input.role.includes("QSR") || input.role.includes("Fast")) {
    bridgeRole = "Area Coach / District Manager";
    rationale = "Moving from Single-Unit to Multi-Unit management doubles earning potential.";
  } else if (input.role.includes("Butler") || input.role.includes("Estate")) {
    bridgeRole = "Director of Residences";
    rationale = "Managing the entire estate portfolio rather than just service delivery.";
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
      north_star_archetype: "The Experience Architect",
      salary_ceiling_warning: ceilingWarning,
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
