
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { logStudySession, generateNFTMetadata } from '@/services/studyService';
import { uploadMetadata } from '@/services/ipfsService';
import { toast } from 'sonner';

interface StudyFormProps {
  open: boolean;
  onClose: () => void;
  tokenId: number | null;
  onMetadataUpdated: (tokenId: number, metadataUri: string) => Promise<void>;
}

const subjects = [
  'Blockchain Development',
  'Smart Contract Security',
  'Web3 Fundamentals',
  'Solidity Programming',
  'Cryptography',
  'DeFi Concepts'
];

const StudyForm: React.FC<StudyFormProps> = ({ open, onClose, tokenId, onMetadataUpdated }) => {
  const [subject, setSubject] = useState(subjects[0]);
  const [duration, setDuration] = useState('60');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tokenId) {
      toast.error("No NFT selected");
      return;
    }
    
    try {
      setLoading(true);
      
      // Log study session
      const progress = logStudySession(subject, parseInt(duration));
      
      // Generate new metadata
      const metadata = generateNFTMetadata(tokenId);
      
      // Upload metadata to IPFS
      const metadataUri = await uploadMetadata(metadata);
      
      // Update the NFT token URI
      await onMetadataUpdated(tokenId, metadataUri);
      
      // Show success message
      toast.success("Study session logged successfully!");
      
      if (progress.leveledUp) {
        toast.success("🎉 Congratulations! You've reached the next level!");
      }
      
      // Close the dialog
      onClose();
    } catch (error) {
      console.error("Error logging study session:", error);
      toast.error("Failed to log study session");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading">Log Study Session</DialogTitle>
          <DialogDescription>
            Record your study time to level up your NFT.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subj) => (
                  <SelectItem key={subj} value={subj}>
                    {subj}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              type="number"
              min="5"
              max="480"
            />
          </div>
          
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-study-blue hover:bg-study-blue-dark text-white"
              disabled={loading}
            >
              {loading ? 'Logging...' : 'Log Study Time'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudyForm;
