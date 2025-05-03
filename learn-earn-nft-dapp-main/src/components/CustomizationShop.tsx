
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, CheckCircle, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { formatPoints } from '@/utils/formatters';

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  cost: number;
  previewColor: string; // Used for simple color preview
  cssValue: string; // CSS value to apply (could be a color code or gradient)
}

interface CustomizationShopProps {
  open: boolean;
  onClose: () => void;
  availablePoints: number;
  ownedThemes: string[];
  activeTheme: string;
  onThemePurchased: (themeId: string, cost: number) => void;
  onThemeActivated: (themeId: string) => void;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'default',
    name: 'Default Theme',
    description: 'The standard theme',
    cost: 0,
    previewColor: '#f3f4f6',
    cssValue: '#f3f4f6'
  },
  {
    id: 'deep-blue',
    name: 'Deep Blue',
    description: 'A calming blue background',
    cost: 500,
    previewColor: '#e0f2fe',
    cssValue: '#e0f2fe'
  },
  {
    id: 'sunset-gradient',
    name: 'Sunset Gradient',
    description: 'A beautiful sunset gradient',
    cost: 1000,
    previewColor: '#FFA07A',
    cssValue: 'linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)'
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'A calm forest green backdrop',
    cost: 800,
    previewColor: '#d1fae5',
    cssValue: '#d1fae5'
  },
  {
    id: 'purple-mist',
    name: 'Purple Mist',
    description: 'A soft purple gradient',
    cost: 1200,
    previewColor: '#c4b5fd',
    cssValue: 'linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)'
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    description: 'Warm golden tones',
    cost: 1500,
    previewColor: '#fef3c7',
    cssValue: 'linear-gradient(90deg, hsla(39, 100%, 77%, 1) 0%, hsla(22, 90%, 57%, 1) 100%)'
  },
  {
    id: 'cool-mint',
    name: 'Cool Mint',
    description: 'Refreshing mint tones',
    cost: 2000,
    previewColor: '#a5f3fc',
    cssValue: 'linear-gradient(90deg, hsla(46, 73%, 75%, 1) 0%, hsla(176, 73%, 88%, 1) 100%)'
  },
];

const CustomizationShop: React.FC<CustomizationShopProps> = ({
  open,
  onClose,
  availablePoints,
  ownedThemes,
  activeTheme,
  onThemePurchased,
  onThemeActivated
}) => {
  const [selectedTab, setSelectedTab] = useState('themes');

  const handlePurchase = (themeId: string, cost: number) => {
    if (availablePoints >= cost) {
      onThemePurchased(themeId, cost);
      toast.success(`You purchased ${THEME_OPTIONS.find(t => t.id === themeId)?.name}!`);
    } else {
      toast.error("Not enough points to purchase this theme!");
    }
  };

  const handleActivate = (themeId: string) => {
    onThemeActivated(themeId);
    toast.success(`Theme activated!`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl font-heading flex items-center gap-2">
            <Palette className="h-6 w-6 text-primary" />
            Customization Shop
          </DialogTitle>
          <DialogDescription>
            Use your points to customize your study experience!
            <span className="ml-2 font-bold">
              Available Points: {formatPoints(availablePoints)}
            </span>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="themes" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <div className="px-6">
            <TabsList className="w-full">
              <TabsTrigger value="themes" className="flex-1">Background Themes</TabsTrigger>
              {/* We can add more categories later */}
            </TabsList>
          </div>

          <ScrollArea className="h-[400px] px-6 py-4">
            <TabsContent value="themes" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {THEME_OPTIONS.map((theme) => {
                  const isOwned = ownedThemes.includes(theme.id) || theme.id === 'default';
                  const isActive = activeTheme === theme.id;

                  return (
                    <Card 
                      key={theme.id}
                      className={`relative overflow-hidden border-2 ${isActive ? 'border-primary' : 'border-transparent'}`}
                    >
                      {isActive && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="default" className="bg-primary">Active</Badge>
                        </div>
                      )}
                      
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-heading">{theme.name}</CardTitle>
                      </CardHeader>

                      <CardContent>
                        <div 
                          className="w-full h-20 rounded-md mb-4 flex items-center justify-center"
                          style={{
                            background: theme.cssValue,
                            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'
                          }}
                        >
                          <ImageIcon className="h-8 w-8 text-white/50" />
                        </div>
                        <p className="text-sm text-gray-600">{theme.description}</p>
                      </CardContent>

                      <CardFooter>
                        {isOwned ? (
                          <Button 
                            className="w-full"
                            variant={isActive ? "outline" : "default"}
                            onClick={() => !isActive && handleActivate(theme.id)}
                            disabled={isActive}
                          >
                            {isActive ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Active
                              </>
                            ) : (
                              'Activate'
                            )}
                          </Button>
                        ) : (
                          <Button 
                            className="w-full"
                            onClick={() => handlePurchase(theme.id, theme.cost)}
                            disabled={availablePoints < theme.cost}
                          >
                            Purchase for {formatPoints(theme.cost)}
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CustomizationShop;
