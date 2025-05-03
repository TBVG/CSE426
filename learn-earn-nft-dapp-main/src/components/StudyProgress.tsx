
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getStudyProgress } from '@/services/studyService';
import { formatHours, formatDate, formatPoints } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';
import { getRankDisplayName } from '@/utils/rankSystem';
import RankBadge from './RankBadge';

interface StudyProgressProps {
  points: number;
  badges: string[];
}

const StudyProgress: React.FC<StudyProgressProps> = ({ points, badges }) => {
  const [progress, setProgress] = useState(() => getStudyProgress());
  
  // Refresh progress when component mounts
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(getStudyProgress());
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Calculate progress to next rank
  const rank = progress.rank;
  const pointsForCurrentRank = points - rank.pointsRequired;
  const pointsToNextRank = rank.nextRankPoints - rank.pointsRequired;
  const progressPercent = Math.min(100, (pointsForCurrentRank / pointsToNextRank) * 100) || 0;
  
  // Get subjects sorted by hours (descending)
  const sortedSubjects = Object.entries(progress.subjects)
    .sort(([, hoursA], [, hoursB]) => hoursB - hoursA);
  
  return (
    <div className="space-y-4 w-full">
      {/* Points and Badges */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-heading">Your Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Points</p>
              <p className="text-2xl font-bold text-green-600">{formatPoints(points)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Badges Earned</p>
              <p className="text-2xl font-bold text-amber-500">{badges.length}</p>
            </div>
          </div>
          
          {badges.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {badges.slice(0, 4).map((badgeId, idx) => (
                <Badge key={badgeId} variant="outline" className="bg-amber-50">
                  Badge #{idx + 1}
                </Badge>
              ))}
              {badges.length > 4 && (
                <Badge variant="outline">+{badges.length - 4} more</Badge>
              )}
            </div>
          ) : (
            <p className="text-sm text-center text-muted-foreground">
              No badges earned yet. Keep studying to earn points!
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Rank Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-heading flex items-center justify-between">
            Rank
            <RankBadge
              name={rank.name}
              tier={rank.tier}
              color={rank.color}
              size="md"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Current Rank</span>
              <span className="text-sm">{Math.floor(progressPercent)}%</span>
              {rank.nextRankPoints !== Infinity ? (
                <span className="text-sm">Next Rank</span>
              ) : (
                <span className="text-sm">Max Rank</span>
              )}
            </div>
            <Progress value={progressPercent} className="h-2" />
            <div className="text-center text-sm text-muted-foreground">
              {formatPoints(pointsForCurrentRank)} / {rank.nextRankPoints !== Infinity ? formatPoints(pointsToNextRank) : 'MAX'} points
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Study Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-heading">Total Study Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatHours(progress.totalHours)}</div>
            <p className="text-sm text-muted-foreground">Across {Object.keys(progress.subjects).length} subjects</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-heading">Study Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[100px]">
              <ul className="space-y-2">
                {sortedSubjects.map(([subject, hours]) => (
                  <li key={subject} className="flex justify-between items-center">
                    <span className="text-sm">{subject}</span>
                    <span className="text-sm font-medium">{formatHours(hours)}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Sessions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-heading">Recent Study Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {progress.recentSessions.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-4">
                No study sessions recorded yet
              </p>
            ) : (
              <ul className="space-y-2">
                {progress.recentSessions.map((session) => (
                  <li key={session.id} className="border-b pb-2 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{session.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(session.timestamp)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">
                          {formatHours(session.duration / 60)}
                        </span>
                        <p className="text-xs text-green-600">+{session.duration * 10} pts</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyProgress;
