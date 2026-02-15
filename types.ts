
export interface WeightEntry {
  id: string;
  weight: number;
  date: string; // ISO string
  note?: string;
}

export interface AiInsight {
  summary: string;
  trend: 'up' | 'down' | 'stable';
  advice: string;
  suggestedAction: string;
}
