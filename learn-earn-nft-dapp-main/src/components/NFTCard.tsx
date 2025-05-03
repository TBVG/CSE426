
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { fetchMetadata } from '@/services/ipfsService';
import { cn } from '@/lib/utils';
import { getRankDisplayName } from '@/utils/rankSystem';
import RankBadge from './RankBadge';

interface NFTCardProps {
  tokenId: number;
  tokenURI: string;
  onUpdateClick?: () => void;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: any;
  }[];
}

const NFTCard: React.FC<NFTCardProps> = ({ tokenId, tokenURI, onUpdateClick }) => {
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRankUp, setIsRankUp] = useState(false);
  
  useEffect(() => {
    const getMetadata = async () => {
      try {
        setLoading(true);
        const data = await fetchMetadata(tokenURI);
        setMetadata(data);
      } catch (error) {
        console.error('Error fetching NFT metadata:', error);
        setError('Failed to load NFT data');
      } finally {
        setLoading(false);
      }
    };
    
    getMetadata();
  }, [tokenURI]);

  useEffect(() => {
    if (metadata) {
      setIsRankUp(true);
      const timer = setTimeout(() => setIsRankUp(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [metadata?.attributes?.find((attr) => attr.trait_type === 'Rank')?.value]);

  // Get rank and points
  const rankValue = metadata?.attributes?.find((attr) => attr.trait_type === 'Rank')?.value || 'Bronze I';
  const points = metadata?.attributes?.find((attr) => attr.trait_type === 'Points')?.value || 0;
  const studyHours = metadata?.attributes?.find((attr) => attr.trait_type === 'Study Hours')?.value || 0;
  
  // Parse rank (e.g. "Gold 2" -> { name: "Gold", tier: 2 })
  const rankParts = rankValue.toString().split(' ');
  const rankName = rankParts[0];
  const rankTier = rankParts.length > 1 ? parseInt(rankParts[1], 10) : 1;

  // Set color based on rank
  const rankColors: Record<string, string> = {
    'Bronze': '#CD7F32',
    'Silver': '#C0C0C0',
    'Gold': '#FFD700',
    'Crystal': '#4DB6AC',
    'Master': '#9C27B0',
    'Champion': '#3F51B5',
    'Titan': '#F44336',
    'Legend': '#212121'
  };
  
  const rankColor = rankColors[rankName] || '#000000';

  if (loading) {
    return (
      <Card className="nft-card w-full max-w-xs animate-pulse">
        <div className="h-48 bg-gray-300" />
        <CardContent className="p-4">
          <div className="h-5 bg-gray-300 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-full mb-4" />
          <div className="h-3 bg-gray-200 rounded w-full mb-1" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
        </CardContent>
      </Card>
    );
  }

  if (error || !metadata) {
    return (
      <Card className="nft-card w-full max-w-xs">
        <CardContent className="p-4 text-center">
          <p className="text-red-500">{error || 'Failed to load NFT'}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="nft-card w-full max-w-xs">
      <div className={cn("absolute top-2 right-2 z-10", isRankUp && "animate-bounce")}>
        <RankBadge
          name={rankName}
          tier={rankTier}
          color={rankColor}
          size="md"
          showIcon={true}
        />
      </div>
      
      <div className="h-48 bg-gray-100 overflow-hidden">
        <img 
          src={metadata.image || '/placeholder.svg'} 
          alt={metadata.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-1">{metadata.name || `Study NFT #${tokenId}`}</h3>
        <p className="text-sm text-gray-600 mb-3">{metadata.description}</p>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Total Points</span>
              <span>{points}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-100 rounded p-2 text-center">
              <p className="text-xs text-gray-600">Study Hours</p>
              <p className="font-semibold">{studyHours}</p>
            </div>
            {metadata.attributes.map((attr, index) => {
              if (attr.trait_type !== 'Rank' && 
                  attr.trait_type !== 'Study Hours' && 
                  attr.trait_type !== 'Points') {
                return (
                  <div key={index} className="bg-gray-100 rounded p-2 text-center">
                    <p className="text-xs text-gray-600">{attr.trait_type}</p>
                    <p className="font-semibold">{attr.value}</p>
                  </div>
                );
              }
              return null;
            }).filter(Boolean)[0]}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0">
        <Button 
          className="w-full text-white" 
          onClick={onUpdateClick}
          style={{ backgroundColor: rankColor }}
        >
          Log Study Hours
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NFTCard;
