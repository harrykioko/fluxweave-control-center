
export type AnalysisTab = "market" | "feasibility" | "considerations" | "next-steps";

export interface Analysis {
  [key: string]: string | null;
  market: string | null;
  feasibility: string | null;
  considerations: string | null;
  "next-steps": string | null;
}
