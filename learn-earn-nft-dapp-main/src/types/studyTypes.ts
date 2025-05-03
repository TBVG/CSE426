
export interface StudySession {
  id: string;
  subject: string;
  duration: number; // in minutes
  timestamp: number;
}

export interface StudyProgress {
  totalHours: number;
  subjects: Record<string, number>; // subject name to hours
  recentSessions: StudySession[];
  leveledUp: boolean;
  rank: RankInfo;
}

export interface RankInfo {
  name: string;      // Bronze, Silver, Gold, etc.
  tier: number;      // 1, 2, 3 within each rank
  color: string;     // CSS color code for the rank
  pointsRequired: number; // Points required to reach this rank
  nextRankPoints: number; // Points required for next rank
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: any;
  }[];
}
