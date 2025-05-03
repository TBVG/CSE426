
// Mock service for leaderboard
import { calculateRank } from '@/utils/rankSystem';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  points: number;
  badgeCount: number;
  timeStudied: number; // in minutes
  rank?: {
    name: string;
    tier: number;
    color: string;
  };
}

// Get current user data from local storage
const getCurrentUserData = (): Partial<LeaderboardUser> => {
  const userPoints = localStorage.getItem('user_points')
    ? parseInt(localStorage.getItem('user_points')!, 10)
    : 0;
    
  const userBadges = localStorage.getItem('user_badges')
    ? JSON.parse(localStorage.getItem('user_badges')!).length
    : 0;
    
  // Get study time from study progress
  const studyProgress = localStorage.getItem('study_progress')
    ? JSON.parse(localStorage.getItem('study_progress')!)
    : { totalHours: 0 };
    
  const timeStudied = Math.round(studyProgress.totalHours * 60);
  
  // Calculate rank based on points
  const rankInfo = calculateRank(userPoints);
  
  return {
    points: userPoints,
    badgeCount: userBadges,
    timeStudied,
    rank: {
      name: rankInfo.name,
      tier: rankInfo.tier,
      color: rankInfo.color
    }
  };
};

// Generate random rank based on points
const generateRandomRank = (points: number) => {
  return calculateRank(points);
};

// Generate mock leaderboard data
const generateMockLeaderboard = (): LeaderboardUser[] => {
  // Generate random mock users
  const mockUsers: LeaderboardUser[] = [
    {
      id: 'user-1',
      name: 'Alex Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      points: Math.floor(Math.random() * 2000) + 500,
      badgeCount: Math.floor(Math.random() * 4) + 1,
      timeStudied: Math.floor(Math.random() * 1000) + 100
    },
    {
      id: 'user-2',
      name: 'Samantha Lee',
      avatar: 'https://i.pravatar.cc/150?img=2',
      points: Math.floor(Math.random() * 1500) + 200,
      badgeCount: Math.floor(Math.random() * 3) + 1,
      timeStudied: Math.floor(Math.random() * 800) + 50
    },
    {
      id: 'user-3',
      name: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/150?img=3',
      points: Math.floor(Math.random() * 1000) + 100,
      badgeCount: Math.floor(Math.random() * 2) + 1,
      timeStudied: Math.floor(Math.random() * 600) + 30
    },
    {
      id: 'user-4',
      name: 'Olivia Martinez',
      avatar: 'https://i.pravatar.cc/150?img=4',
      points: Math.floor(Math.random() * 800) + 50,
      badgeCount: Math.floor(Math.random() * 2),
      timeStudied: Math.floor(Math.random() * 400) + 20
    }
  ];
  
  // Add rank info
  mockUsers.forEach(user => {
    const rankInfo = generateRandomRank(user.points);
    user.rank = {
      name: rankInfo.name,
      tier: rankInfo.tier,
      color: rankInfo.color
    };
  });
  
  return mockUsers;
};

// Get leaderboard data
export const getLeaderboard = async (): Promise<LeaderboardUser[]> => {
  return new Promise((resolve) => {
    // In a real app, we would fetch this from an API
    // For the mock, we'll generate random data and include the current user
    
    // Get current user data
    const currentUser = getCurrentUserData();
    
    // Generate mock users
    const mockUsers = generateMockLeaderboard();
    
    // Add current user if they have points
    const leaderboard = [...mockUsers];
    
    if (currentUser.points && currentUser.points > 0) {
      leaderboard.push({
        id: 'current-user',
        name: 'You',
        avatar: 'https://i.pravatar.cc/150?img=5',
        points: currentUser.points,
        badgeCount: currentUser.badgeCount || 0,
        timeStudied: currentUser.timeStudied || 0,
        rank: currentUser.rank as { name: string; tier: number; color: string }
      });
    }
    
    // Simulate API delay
    setTimeout(() => resolve(leaderboard), 500);
  });
};

// Helper function to get rank numerical value for sorting
export const getRankValue = (rankName: string, tier: number): number => {
  const rankOrder: Record<string, number> = {
    'Bronze': 0,
    'Silver': 1,
    'Gold': 2,
    'Crystal': 3,
    'Master': 4,
    'Champion': 5,
    'Titan': 6,
    'Legend': 7
  };
  
  return (rankOrder[rankName] * 3) + (tier - 1);
};

