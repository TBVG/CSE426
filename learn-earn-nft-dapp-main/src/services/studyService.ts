
import { StudyProgress, StudySession, NFTMetadata, RankInfo } from '@/types/studyTypes';
import { addUserPoints } from './badgeService';
import { calculateRank } from '@/utils/rankSystem';

// This is a mock service - in a real app, this would interact with a backend
const STORAGE_KEY = 'study_progress';

// Initialize study progress
const initializeProgress = (): StudyProgress => {
  const initialRank = calculateRank(0);
  return {
    totalHours: 0,
    subjects: {},
    recentSessions: [],
    leveledUp: false,
    rank: initialRank
  };
};

// Get progress from local storage or initialize
export const getStudyProgress = (): StudyProgress => {
  if (typeof window === 'undefined') {
    return initializeProgress();
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const progress = JSON.parse(stored);
      // Ensure rank is properly calculated (in case of loading old data)
      if (!progress.rank) {
        const points = localStorage.getItem('user_points') 
          ? parseInt(localStorage.getItem('user_points')!, 10) 
          : 0;
        progress.rank = calculateRank(points);
      }
      return progress;
    } catch (e) {
      console.error('Error parsing study progress:', e);
      return initializeProgress();
    }
  } else {
    return initializeProgress();
  }
};

// Save progress to local storage
const saveProgress = (progress: StudyProgress): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
};

// Log a new study session and update progress
export const logStudySession = (subject: string, durationMinutes: number): StudyProgress => {
  const progress = getStudyProgress();
  const durationHours = durationMinutes / 60;
  
  // Add or update subject hours
  if (!progress.subjects[subject]) {
    progress.subjects[subject] = durationHours;
  } else {
    progress.subjects[subject] += durationHours;
  }
  
  // Add to total hours
  progress.totalHours += durationHours;
  
  // Get current points
  const currentPoints = localStorage.getItem('user_points') 
    ? parseInt(localStorage.getItem('user_points')!, 10) 
    : 0;
  
  // Calculate rank before adding new points
  const oldRank = progress.rank;
  
  // Award points - 10 points per minute of study
  const pointsEarned = durationMinutes * 10;
  addUserPoints(pointsEarned);
  
  // Calculate new rank based on updated points
  const newRank = calculateRank(currentPoints + pointsEarned);
  progress.rank = newRank;
  
  // Check if rank has increased
  progress.leveledUp = (
    newRank.name !== oldRank.name || 
    newRank.tier > oldRank.tier
  );
  
  // Add to recent sessions
  const session: StudySession = {
    id: Date.now().toString(),
    subject,
    duration: durationMinutes,
    timestamp: Date.now(),
  };
  
  progress.recentSessions = [session, ...progress.recentSessions].slice(0, 10); // Keep last 10 sessions
  
  // Save updated progress
  saveProgress(progress);
  
  return progress;
};

// Log points for PDF study
export const logPDFStudy = (title: string, durationMinutes: number): number => {
  // Log as a study session
  logStudySession(title, durationMinutes);
  
  // Return points earned (10 points per minute)
  return durationMinutes * 10;
};

// Generate NFT metadata for a token
export const generateNFTMetadata = (tokenId: number): NFTMetadata => {
  const progress = getStudyProgress();
  const points = localStorage.getItem('user_points') 
    ? parseInt(localStorage.getItem('user_points')!, 10) 
    : 0;
  
  // Get main subject (the one with most hours)
  let mainSubject = 'General Study';
  let maxHours = 0;
  
  Object.entries(progress.subjects).forEach(([subject, hours]) => {
    if (hours > maxHours) {
      maxHours = hours;
      mainSubject = subject;
    }
  });
  
  const rank = progress.rank;
  
  return {
    name: `Study NFT #${tokenId}`,
    description: `This NFT represents your study progress in ${mainSubject}`,
    image: `https://ipfs.io/ipfs/QmXrFhcyvEb3HYfYg9vHMJtPj6YzdnXVG5hjW5Kh7evqQh`,
    attributes: [
      {
        trait_type: "Rank",
        value: `${rank.name} ${rank.tier}`
      },
      {
        trait_type: "Points",
        value: points
      },
      {
        trait_type: "Study Hours",
        value: progress.totalHours
      },
      {
        trait_type: "Subject",
        value: mainSubject
      }
    ]
  };
};
