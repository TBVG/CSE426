import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatPoints } from '@/utils/formatters';
import { Trophy } from 'lucide-react';
import { getLeaderboard, getRankValue } from '@/services/leaderboardService';
import RankBadge from './RankBadge';

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
  displayRank?: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard();
        
        // Sort by rank first (high to low), then by points
        const sortedData = [...data].sort((a, b) => {
          // First sort by rank (if available)
          if (a.rank && b.rank) {
            const aRankValue = getRankValue(a.rank.name, a.rank.tier);
            const bRankValue = getRankValue(b.rank.name, b.rank.tier);
            
            if (aRankValue !== bRankValue) {
              return bRankValue - aRankValue; // Higher rank first
            }
          }
          
          // If same rank or no rank info, sort by points
          return b.points - a.points;
        });
        
        // Add display rank
        const rankedData = sortedData.map((user, index) => ({
          ...user,
          displayRank: index + 1
        }));
        
        setLeaderboardData(rankedData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchLeaderboard, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (rank === 2) return "bg-gray-100 text-gray-800 border-gray-300";
    if (rank === 3) return "bg-amber-100 text-amber-800 border-amber-300";
    return "";
  };
  
  const formatStudyTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-heading flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>User</TableHead>
              <TableHead>League</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead className="text-right">Time Studied</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Loading leaderboard...
                </TableCell>
              </TableRow>
            ) : leaderboardData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No users found on the leaderboard yet
                </TableCell>
              </TableRow>
            ) : (
              leaderboardData.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Badge className={`${getRankStyle(user.displayRank || 0)}`}>
                      {user.displayRank}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <img src={user.avatar} alt={user.name} />
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.rank ? (
                      <RankBadge
                        name={user.rank.name}
                        tier={user.rank.tier}
                        color={user.rank.color}
                        size="sm"
                      />
                    ) : (
                      "Unranked"
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPoints(user.points)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatStudyTime(user.timeStudied)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
