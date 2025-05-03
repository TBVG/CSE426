
// Define rank thresholds and metadata
export const RANKS = [
  { name: 'Bronze', color: '#CD7F32', tiers: 3 },
  { name: 'Silver', color: '#C0C0C0', tiers: 3 },
  { name: 'Gold', color: '#FFD700', tiers: 3 },
  { name: 'Crystal', color: '#4DB6AC', tiers: 3 },
  { name: 'Master', color: '#9C27B0', tiers: 3 },
  { name: 'Champion', color: '#3F51B5', tiers: 3 },
  { name: 'Titan', color: '#F44336', tiers: 3 },
  { name: 'Legend', color: '#212121', tiers: 3 }
];

// Points required for each rank (start of rank)
const BASE_POINTS = 500;
const MULTIPLIER = 2;

/**
 * Calculate rank information based on points
 */
export function calculateRank(points: number): { 
  name: string; 
  tier: number;
  color: string;
  pointsRequired: number;
  nextRankPoints: number;
} {
  // Initial values (lowest possible rank)
  let rankName = RANKS[0].name;
  let tier = 1;
  let color = RANKS[0].color;
  let pointsRequired = 0;
  let nextRankPoints = BASE_POINTS;
  
  // Calculate rank thresholds
  let thresholdPoints = 0;
  
  for (let rankIndex = 0; rankIndex < RANKS.length; rankIndex++) {
    const rank = RANKS[rankIndex];
    
    for (let currentTier = 1; currentTier <= rank.tiers; currentTier++) {
      // Calculate points threshold for this tier
      const tierMultiplier = rankIndex * rank.tiers + currentTier;
      const pointThreshold = BASE_POINTS * Math.pow(MULTIPLIER, tierMultiplier - 1);
      
      // Check if user has enough points for this rank
      if (points >= thresholdPoints && points < thresholdPoints + pointThreshold) {
        rankName = rank.name;
        tier = currentTier;
        color = rank.color;
        pointsRequired = thresholdPoints;
        nextRankPoints = thresholdPoints + pointThreshold;
        return { name: rankName, tier, color, pointsRequired, nextRankPoints };
      }
      
      // Update threshold for next iteration
      thresholdPoints += pointThreshold;
    }
  }
  
  // If they've exceeded all defined ranks, they're at max rank
  const maxRank = RANKS[RANKS.length - 1];
  return {
    name: maxRank.name,
    tier: maxRank.tiers,
    color: maxRank.color,
    pointsRequired: thresholdPoints - BASE_POINTS * Math.pow(MULTIPLIER, RANKS.length * 3 - 1),
    nextRankPoints: Infinity
  };
}

/**
 * Get a display string for the rank
 */
export function getRankDisplayName(rankName: string, tier: number): string {
  return `${rankName} ${getRomanNumeral(tier)}`;
}

/**
 * Convert number to Roman numeral (for tiers I, II, III)
 */
function getRomanNumeral(num: number): string {
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V'];
  return romanNumerals[num - 1] || num.toString();
}
