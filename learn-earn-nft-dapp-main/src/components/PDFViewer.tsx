
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Clock, Timer } from 'lucide-react';

interface PDFViewerProps {
  pdfUrl: string;
  title: string;
  onEarnPoints: (minutes: number) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, title, onEarnPoints }) => {
  const [loading, setLoading] = useState(true);
  const [studyStartTime, setStudyStartTime] = useState<number | null>(null);
  const [studySeconds, setStudySeconds] = useState(0);
  const [studyMinutes, setStudyMinutes] = useState(0);
  const [studyActive, setStudyActive] = useState(false);

  // Track study time with more precision (seconds)
  useEffect(() => {
    if (!studyActive) return;

    const interval = setInterval(() => {
      if (studyStartTime) {
        const elapsedSeconds = Math.floor((Date.now() - studyStartTime) / 1000);
        setStudySeconds(elapsedSeconds % 60);
        setStudyMinutes(Math.floor(elapsedSeconds / 60));
      }
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [studyActive, studyStartTime]);

  const handleStartStudying = () => {
    setStudyActive(true);
    setStudyStartTime(Date.now());
    toast.info("Study session started. Points will be earned for each minute studied.");
  };

  const handleFinishStudying = () => {
    if (studyMinutes > 0 || studySeconds > 0) {
      // Round up seconds to the nearest minute for point calculation
      const totalMinutes = studyMinutes + (studySeconds > 0 ? 1 : 0);
      onEarnPoints(totalMinutes);
      toast.success(`You earned ${totalMinutes * 10} points for studying ${totalMinutes} minute${totalMinutes !== 1 ? 's' : ''}!`);
    }
    setStudyActive(false);
    setStudyStartTime(null);
    setStudySeconds(0);
    setStudyMinutes(0);
  };

  // Format time display
  const formatTime = () => {
    const minutes = studyMinutes.toString().padStart(2, '0');
    const seconds = studySeconds.toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-heading flex justify-between items-center">
          <span>{title}</span>
          {studyActive && (
            <div className="flex items-center text-sm font-normal bg-amber-100 px-3 py-1 rounded-full">
              <Timer className="h-4 w-4 mr-1 text-amber-600" />
              <span className="font-mono">{formatTime()}</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <Skeleton className="w-full h-[500px]" />
        )}
        <div className="w-full h-[500px] border rounded overflow-hidden">
          <iframe 
            src={`${pdfUrl}#toolbar=0`} 
            className="w-full h-full"
            title={title}
            onLoad={() => setLoading(false)}
          />
        </div>
        
        <div className="flex justify-between">
          {!studyActive ? (
            <Button 
              onClick={handleStartStudying}
              className="w-full bg-study-blue hover:bg-study-blue-dark text-white"
            >
              Start Studying
            </Button>
          ) : (
            <Button 
              onClick={handleFinishStudying}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Finish Study Session ({formatTime()})
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFViewer;
