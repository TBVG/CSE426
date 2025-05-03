
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatPoints } from '@/utils/formatters';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Award, ShoppingCart } from 'lucide-react';
import { purchaseBadge } from '@/services/badgeService';

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  price: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  image: string;
}

interface BadgeShopProps {
  open: boolean;
  onClose: () => void;
  availablePoints: number;
  ownedBadges: string[];
  onBadgePurchased: (badgeId: string, cost: number) => void;
}

const BadgeShop: React.FC<BadgeShopProps> = ({ 
  open, 
  onClose, 
  availablePoints, 
  ownedBadges,
  onBadgePurchased
}) => {
  // Sample badges data - in a real app, this would come from a backend API
  const badges: BadgeItem[] = [
    {
      id: 'badge-1',
      name: 'Study Novice',
      description: 'Completed your first study session',
      price: 100,
      rarity: 'common',
      image: 'https://via.placeholder.com/64/3B82F6/FFFFFF?text=🎓'
    },
    {
      id: 'badge-2',
      name: 'Knowledge Seeker',
      description: 'Spent 5 hours studying',
      price: 500,
      rarity: 'uncommon',
      image: 'https://via.placeholder.com/64/10B981/FFFFFF?text=📚'
    },
    {
      id: 'badge-3',
      name: 'Subject Master',
      description: 'Became proficient in a subject',
      price: 1000,
      rarity: 'rare',
      image: 'https://via.placeholder.com/64/8B5CF6/FFFFFF?text=🧠'
    },
    {
      id: 'badge-4',
      name: 'Academic Excellence',
      description: 'Achieved outstanding study performance',
      price: 2500,
      rarity: 'epic',
      image: 'https://via.placeholder.com/64/EC4899/FFFFFF?text=🏆'
    },
    {
      id: 'badge-5',
      name: 'Legendary Scholar',
      description: 'Reached the highest level of academic achievement',
      price: 5000,
      rarity: 'legendary',
      image: 'https://via.placeholder.com/64/F59E0B/FFFFFF?text=⭐'
    }
  ];

  const handlePurchaseBadge = async (badge: BadgeItem) => {
    if (availablePoints < badge.price) {
      toast.error("You don't have enough points to purchase this badge");
      return;
    }

    if (ownedBadges.includes(badge.id)) {
      toast.info("You already own this badge");
      return;
    }

    try {
      // Purchase badge
      await purchaseBadge(badge.id);
      
      // Update state through callback
      onBadgePurchased(badge.id, badge.price);
      
      // Show success message
      toast.success(`Successfully purchased ${badge.name} badge!`);
    } catch (error) {
      console.error("Error purchasing badge:", error);
      toast.error("Failed to purchase badge");
    }
  };

  const getRarityColor = (rarity: string): string => {
    switch(rarity) {
      case 'common': return 'bg-gray-500';
      case 'uncommon': return 'bg-green-500';
      case 'rare': return 'bg-blue-600';
      case 'epic': return 'bg-purple-600';
      case 'legendary': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-amber-500" />
            Badge Shop
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            Purchase badges with points earned from studying
          </p>
          <p className="font-medium">
            Available Points: <span className="text-green-600">{formatPoints(availablePoints)}</span>
          </p>
        </div>
        
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {badges.map((badge) => {
              const isOwned = ownedBadges.includes(badge.id);
              const canAfford = availablePoints >= badge.price;
              
              return (
                <Card key={badge.id} className={isOwned ? "border-green-500" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{badge.name}</CardTitle>
                        <Badge className={`${getRarityColor(badge.rarity)} text-white`}>
                          {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                        </Badge>
                      </div>
                      <div className="h-16 w-16 rounded-md overflow-hidden">
                        <img src={badge.image} alt={badge.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <CardDescription>{badge.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between items-center">
                    <span className="font-medium">{formatPoints(badge.price)} points</span>
                    {isOwned ? (
                      <Badge variant="outline" className="border-green-500 text-green-700">
                        Owned
                      </Badge>
                    ) : (
                      <Button 
                        onClick={() => handlePurchaseBadge(badge)}
                        disabled={!canAfford || isOwned}
                        variant={canAfford ? "default" : "outline"}
                        className={canAfford ? "bg-study-blue hover:bg-study-blue-dark text-white" : ""}
                      >
                        {canAfford ? 'Purchase' : 'Not Enough Points'}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default BadgeShop;
