
// Mock service for badge management

// Define badge types
export interface UserBadge {
  id: string;
  purchasedAt: number;
}

// Local storage keys
const USER_BADGES_KEY = 'user_badges';
const USER_POINTS_KEY = 'user_points';

// Get user's badges
export const getUserBadges = (): string[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(USER_BADGES_KEY);
  if (stored) {
    try {
      const badges: UserBadge[] = JSON.parse(stored);
      return badges.map(badge => badge.id);
    } catch (e) {
      console.error('Error parsing user badges:', e);
      return [];
    }
  }
  return [];
};

// Save user badges
const saveUserBadges = (badges: UserBadge[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_BADGES_KEY, JSON.stringify(badges));
  }
};

// Get user's total points
export const getUserPoints = (): number => {
  if (typeof window === 'undefined') return 0;
  
  const stored = localStorage.getItem(USER_POINTS_KEY);
  if (stored) {
    try {
      return parseInt(stored, 10);
    } catch (e) {
      console.error('Error parsing user points:', e);
      return 0;
    }
  }
  return 0;
};

// Save user points
export const saveUserPoints = (points: number): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_POINTS_KEY, points.toString());
  }
};

// Add points to user's total
export const addUserPoints = (points: number): number => {
  const currentPoints = getUserPoints();
  const newPoints = currentPoints + points;
  saveUserPoints(newPoints);
  return newPoints;
};

// Purchase a badge
export const purchaseBadge = async (badgeId: string): Promise<boolean> => {
  // Get badge price (in a real app this would come from an API)
  const getBadgePrice = (id: string): number => {
    const prices: Record<string, number> = {
      'badge-1': 100,
      'badge-2': 500,
      'badge-3': 1000,
      'badge-4': 2500,
      'badge-5': 5000,
      // Add more badges as needed
    };
    
    return prices[id] || 0;
  };
  
  const price = getBadgePrice(badgeId);
  
  // Check if the user has enough points
  const currentPoints = getUserPoints();
  if (currentPoints < price) {
    throw new Error("Not enough points");
  }
  
  // Check if user already owns this badge
  const ownedBadges = getUserBadges();
  if (ownedBadges.includes(badgeId)) {
    throw new Error("Badge already owned");
  }
  
  return new Promise((resolve) => {
    // In a real app, we would call an API to purchase the badge
    // For the mock, we'll update the local storage
    
    // Deduct points
    const newPoints = currentPoints - price;
    saveUserPoints(newPoints);
    
    // Add the badge
    const currentBadges: UserBadge[] = localStorage.getItem(USER_BADGES_KEY)
      ? JSON.parse(localStorage.getItem(USER_BADGES_KEY)!)
      : [];
      
    const newBadge: UserBadge = {
      id: badgeId,
      purchasedAt: Date.now()
    };
    
    saveUserBadges([...currentBadges, newBadge]);
    
    // Short timeout to simulate network delay
    setTimeout(() => resolve(true), 500);
  });
};
