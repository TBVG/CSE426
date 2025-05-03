import React, { useState, useEffect } from 'react';
import { Web3Provider, useWeb3 } from '../contexts/Web3Context';
import Navbar from '../components/Navbar';
import StudyProgress from '../components/StudyProgress';
import PDFUpload from '../components/PDFUpload';
import PDFViewer from '../components/PDFViewer';
import CustomizationShop from '../components/CustomizationShop';
import Leaderboard from '../components/Leaderboard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { BookOpen, GraduationCap, Upload, Palette } from 'lucide-react';
import { getPDFs, PDFDocument } from '@/services/pdfService';
import { getUserBadges, getUserPoints, addUserPoints, saveUserPoints } from '@/services/badgeService';
import { logPDFStudy, getStudyProgress } from '@/services/studyService';
import { Card, CardContent, CardHeader, CardFooter, CardDescription, CardTitle } from '@/components/ui/card';
import { getOwnedThemes, getActiveTheme, setActiveTheme, applyTheme, addOwnedTheme } from '@/services/themeService';
import RankBadge from '@/components/RankBadge';

const Dashboard = () => {
  const { account } = useWeb3();
  const [pdfs, setPDFs] = useState<PDFDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPDFUpload, setShowPDFUpload] = useState(false);
  const [showCustomizationShop, setShowCustomizationShop] = useState(false);
  const [activePDF, setActivePDF] = useState<PDFDocument | null>(null);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [userBadges, setUserBadges] = useState<string[]>([]);
  const [studyProgress, setStudyProgress] = useState(getStudyProgress());
  const [ownedThemes, setOwnedThemes] = useState<string[]>(['default']);
  const [activeTheme, setActiveThemeState] = useState('default');

  // Load user data
  useEffect(() => {
    if (account) {
      // Load PDFs
      setPDFs(getPDFs());
      
      // Load points and badges
      setUserPoints(getUserPoints());
      setUserBadges(getUserBadges());
      
      // Load study progress
      setStudyProgress(getStudyProgress());
      
      // Load theme data
      setOwnedThemes(getOwnedThemes());
      const currentTheme = getActiveTheme();
      setActiveThemeState(currentTheme);
      applyTheme(currentTheme);
    }
  }, [account]);

  // Handle PDF upload success
  const handlePDFUploaded = (pdfInfo: PDFDocument) => {
    setPDFs(prev => [...prev, pdfInfo]);
    setActivePDF(pdfInfo); // Automatically view the uploaded PDF
    setShowPDFUpload(false);
  };
  
  // Handle PDF study points
  const handleEarnPoints = (minutes: number) => {
    const pointsEarned = logPDFStudy(activePDF?.title || 'PDF Study', minutes);
    setUserPoints(prev => prev + pointsEarned);
    setStudyProgress(getStudyProgress());
    
    toast.success(`You earned ${pointsEarned} points!`);
    
    // Show rank up toast if needed
    if (studyProgress.leveledUp) {
      toast.success(
        <div className="flex flex-col items-center">
          <p className="font-bold mb-1">RANK UP!</p>
          <RankBadge
            name={studyProgress.rank.name}
            tier={studyProgress.rank.tier}
            color={studyProgress.rank.color}
            size="md"
          />
        </div>,
        { duration: 5000 }
      );
    }
  };
  
  // Handle theme purchase
  const handleThemePurchased = (themeId: string, cost: number) => {
    // Add to owned themes
    addOwnedTheme(themeId);
    setOwnedThemes(prev => [...prev, themeId]);
    
    // Deduct points
    addUserPoints(-cost);
    setUserPoints(prev => prev - cost);
  };
  
  // Handle theme activation
  const handleThemeActivated = (themeId: string) => {
    setActiveTheme(themeId);
    setActiveThemeState(themeId);
    applyTheme(themeId);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {!account ? (
          <div className="text-center py-12">
            <GraduationCap className="h-16 w-16 mx-auto text-study-blue mb-4" />
            <h1 className="text-3xl font-heading font-bold mb-4">Study Platform</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Connect your wallet to upload study materials, track progress, and earn points for ranks.
            </p>
            <div className="inline-flex items-center justify-center space-x-2 p-1 bg-white rounded-lg shadow-md">
              <div className="bg-study-blue/10 p-3 rounded-md">
                <BookOpen className="h-6 w-6 text-study-blue" />
              </div>
              <span className="pr-4">Study PDFs and track your learning journey.</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-heading font-bold">Study Dashboard</h2>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setShowPDFUpload(true)}
                    className="bg-study-blue hover:bg-study-blue-dark text-white flex items-center gap-1"
                  >
                    <Upload className="h-4 w-4" />
                    Upload PDF
                  </Button>
                  <Button 
                    onClick={() => setShowCustomizationShop(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1"
                  >
                    <Palette className="h-4 w-4" />
                    Customize
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              {activePDF ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={() => setActivePDF(null)}
                    >
                      Back to All Materials
                    </Button>
                  </div>
                  
                  <PDFViewer 
                    pdfUrl={activePDF.url} 
                    title={activePDF.title}
                    onEarnPoints={handleEarnPoints}
                  />
                </div>
              ) : (
                <div>
                  {pdfs.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                      <BookOpen className="h-12 w-12 mx-auto text-study-blue-light mb-4" />
                      <h3 className="text-xl font-heading font-semibold mb-2">No Study Materials Yet</h3>
                      <p className="text-gray-600 mb-4">Upload PDFs to start studying and earning points.</p>
                      <Button 
                        onClick={() => setShowPDFUpload(true)}
                        className="bg-study-blue hover:bg-study-blue-dark text-white"
                      >
                        Upload First PDF
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pdfs.map((pdf) => (
                        <Card key={pdf.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActivePDF(pdf)}>
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold mb-2 line-clamp-1">{pdf.title}</h3>
                                <p className="text-xs text-gray-500">
                                  {new Date(pdf.uploadedAt).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(pdf.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                              <div className="bg-gray-100 p-2 rounded">
                                <BookOpen className="h-6 w-6 text-study-blue" />
                              </div>
                            </div>
                            <div className="flex justify-end mt-4">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActivePDF(pdf);
                                }}
                              >
                                Study Now
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <Leaderboard />
            </div>
            
            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">Learning Progress</h2>
              <StudyProgress points={userPoints} badges={userBadges} />
              
              <div className="mt-4 bg-white rounded-lg p-4 shadow">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">Current Rank</h3>
                  <RankBadge
                    name={studyProgress.rank.name}
                    tier={studyProgress.rank.tier}
                    color={studyProgress.rank.color}
                    size="md"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Points needed for next rank:</span>
                    <span>{studyProgress.rank.nextRankPoints - userPoints}</span>
                  </div>
                  
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (userPoints - studyProgress.rank.pointsRequired) / (studyProgress.rank.nextRankPoints - studyProgress.rank.pointsRequired) * 100)}%`,
                        backgroundColor: studyProgress.rank.color
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{userPoints} points</span>
                    <span>{studyProgress.rank.nextRankPoints} points</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* PDF Upload Dialog */}
      <PDFUpload
        open={showPDFUpload}
        onClose={() => setShowPDFUpload(false)}
        onUploadSuccess={handlePDFUploaded}
      />
      
      {/* Customization Shop Dialog */}
      <CustomizationShop
        open={showCustomizationShop}
        onClose={() => setShowCustomizationShop(false)}
        availablePoints={userPoints}
        ownedThemes={ownedThemes}
        activeTheme={activeTheme}
        onThemePurchased={handleThemePurchased}
        onThemeActivated={handleThemeActivated}
      />
    </div>
  );
};

// Wrap the dashboard in the Web3Provider
const Index = () => (
  <Web3Provider>
    <Dashboard />
  </Web3Provider>
);

export default Index;
