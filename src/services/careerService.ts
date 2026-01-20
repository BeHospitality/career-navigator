// src/services/careerService.ts
import { supabase } from "@/integrations/supabase/client";
import { UserInput, ValuationResult } from "@/types";

export const calculateValuation = async (input: UserInput): Promise<ValuationResult> => {
  console.log("Consulting the Career Intelligence Engine...");
  
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

  if (error) {
    console.error("Career valuation error:", error);
    throw new Error(error.message || "Failed to get career valuation");
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as ValuationResult;
};
