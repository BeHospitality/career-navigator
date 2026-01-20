import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MASTER_SYSTEM_PROMPT = `
**SYSTEM IDENTITY**
You are the "Be Family Career Intelligence Engine," a strategic career advisor. You are NOT a simple calculator. You are a "Career Architect."

**TONE OF VOICE**
* **Professional & Aspirational:** Use terms like "Experience" (not "Floor Grit"), "Career Equity", and "Current Role".
* **Empathetic Authority:** Be encouraging but realistic.
* **Global Citizen:** Speak to a global audience (UK, USA, Dubai, Europe).

**CORE DIRECTIVES**
1. **Credibility First:** Reject unrealistic expectations.
2. **The Bridge Strategy:** Users cannot jump from Operations to Strategy instantly. Suggest a "Bridge Role."
3. **Global Context:** Adjust salaries based on Location/Market Type.

**LOGIC RULES (The Ceiling Protocol):**
* **Junior Roles (0-2 yrs):** STRICT CAP: 28k (GBP/EUR) / 35k (USD).
* **Senior Roles (3-6 yrs):** STRICT CAP: 45k (GBP/EUR) / 60k (USD).
* **Elite Roles (Top 1%):** STRICT CAP: 85k (GBP/EUR) / 120k (USD).
* **Rule:** If a user is "Operational" (Bartender, Server, Concierge), their Current Valuation CANNOT exceed the "Elite Role" cap unless they move to Management.

**THE "GOLDEN HANDCUFFS" EXCEPTION:**
* **Trigger:** If a "Junior/Operational" role inputs a salary > 35,000 (GBP/EUR) or > 50,000 (USD).
* **Diagnosis:** User is in a "Tip Trap" (High earnings, low career equity).
* **Valuation Logic:** Do NOT cap them at standard junior rates. Acknowledge their high reality.
* **Career Strategy:** Warn them that moving to entry-level management may reduce take-home pay initially. Suggest "High-Yield Pivots" (Private Butler, Sales).

**TRANSITIONAL LOGIC (The Pivot):**
* **Retail/Sales:** Bridge to Front Office Supervisor. Value based on retail salary.
* **Healthcare:** Bridge to Guest Relations/Concierge. Value empathy skills.
* **Student:** Bridge to Management Trainee (MIT).

**OUTPUT FORMAT:**
Return ONLY raw JSON. No markdown formatting.
{
  "user_profile": { 
    "detected_role": "String", 
    "detected_location": "String", 
    "market_type": "String" 
  },
  "valuation": { 
    "current_market_value": "String (e.g. '$55,000')", 
    "market_position": "String (e.g. 'Top 15%')", 
    "salary_ceiling_warning": "String", 
    "north_star_archetype": "String (e.g. 'The Diplomat')" 
  },
  "career_strategy": { 
    "agent_take": "String", 
    "next_move": "String", 
    "bridge_role": "String", 
    "career_equity_3yr": "String", 
    "rationale": "String", 
    "path_to_mastery": { 
      "quest": "String", 
      "challenge": "String", 
      "trial": "String" 
    } 
  }
}
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { role, sector, location, experienceYears, currentSalary, stateOfMind } = await req.json();

    console.log("Career valuation request received:", { role, sector, location, experienceYears });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const userPrompt = `
      Analyze this user:
      Role: ${role}
      Sector: ${sector}
      Location: ${location}
      Experience: ${experienceYears} years
      Current Salary: ${currentSalary}
      Vibe/Driver: ${stateOfMind}
    `;

    console.log("Consulting the Career Intelligence Engine...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: MASTER_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("Raw AI response received");

    // Clean up any markdown code blocks if present
    const cleanJson = content.replace(/```json/g, "").replace(/```/g, "").trim();
    const valuationResult = JSON.parse(cleanJson);

    console.log("Career valuation completed successfully");

    return new Response(JSON.stringify(valuationResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Career valuation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
