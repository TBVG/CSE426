
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
import { uploadMetadata } from '@/services/ipfsService';
import { generateNFTMetadata } from '@/services/studyService';
import { toast } from 'sonner';

interface MintNFTFormProps {
  open: boolean;
  onClose: () => void;
  onMint: (metadataUri: string) => Promise<void>;
}

const subjects = [
  'Blockchain Development',
  'Smart Contract Security',
  'Web3 Fundamentals',
  'Solidity Programming',
  'Cryptography',
  'DeFi Concepts'
];

const MintNFTForm: React.FC<MintNFTFormProps> = ({ open, onClose, onMint }) => {
  const [subject, setSubject] = useState(subjects[0]);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Generate token ID (in production this would come from the contract)
      const mockTokenId = Math.floor(Math.random() * 1000);
      
      // Generate initial metadata
      const metadata = {
        name: `Study NFT #${mockTokenId}`,
        description: `This NFT represents your study progress in ${subject}`,
        image: `https://ipfs.io/ipfs/QmXrFhcyvEb3HYfYg9vHMJtPj6YzdnXVG5hjW5Kh7evqQh`, // Placeholder image
        attributes: [
          {
            trait_type: "Level",
            value: 1
          },
          {
            trait_type: "Study Hours",
            value: 0
          },
          {
            trait_type: "Subject",
            value: subject
          }
        ]
      };
      
      // Upload metadata to IPFS
      const metadataUri = await uploadMetadata(metadata);
      
      // Mint the NFT
      await onMint(metadataUri);
      
      // Close the dialog
      onClose();
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast.error("Failed to mint NFT");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading">Mint Study NFT</DialogTitle>
          <DialogDescription>
            Create your first Study NFT to start tracking your progress.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Primary Study Subject</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select your main subject" />
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
          
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-study-blue hover:bg-study-blue-dark text-white"
              disabled={loading}
            >
              {loading ? 'Minting...' : 'Mint NFT'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MintNFTForm;
