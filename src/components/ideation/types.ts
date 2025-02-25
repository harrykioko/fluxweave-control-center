
export type AnalysisTab = "market" | "feasibility" | "considerations" | "next-steps";

export interface Analysis {
  market: string | null;
  feasibility: string | null;
  considerations: string | null;
  "next-steps": string | null;
}
