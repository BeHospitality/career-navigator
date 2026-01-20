// src/types.ts

export type UserState = 'Curious' | 'Ready' | 'Stuck' | 'Content';

export interface UserInput {
  role: string;
  sector: string;
  location: string;
  experienceYears: number;
  currentSalary: string;
  stateOfMind: UserState;
}

export interface PathToMastery {
  quest: string;
  challenge: string;
  trial: string;
}

export interface CareerStrategy {
  agent_take: string;
  next_move: string;
  bridge_role: string;
  career_equity_3yr: string;
  rationale: string;
  path_to_mastery: PathToMastery;
}

export interface Valuation {
  current_market_value: string;
  market_position: string;
  salary_ceiling_warning: string;
  north_star_archetype: string;
  level_up_jump?: string; // Optional field for UI flash
}

export interface UserProfile {
  detected_role: string;
  detected_location: string;
  market_type: string;
}

export interface ValuationResult {
  user_profile: UserProfile;
  valuation: Valuation;
  career_strategy: CareerStrategy;
}
