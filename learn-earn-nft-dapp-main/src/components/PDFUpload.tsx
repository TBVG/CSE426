
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { uploadPDF } from '@/services/pdfService';

interface PDFUploadProps {
  open: boolean;
  onClose: () => void;
  onUploadSuccess: (pdfInfo: { id: string; title: string; url: string }) => void;
}

const PDFUpload: React.FC<PDFUploadProps> = ({ open, onClose, onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if file is a PDF
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      setFile(selectedFile);
      
      // Auto-populate title from filename if not set
      if (!title) {
        const filename = selectedFile.name.replace('.pdf', '');
        setTitle(filename);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    try {
      setLoading(true);
      
      // Upload PDF
      const pdfInfo = await uploadPDF(title, file);
      
      // Call success callback
      onUploadSuccess(pdfInfo);
      
      // Show success message
      toast.success('PDF uploaded successfully');
      
      // Reset form and close dialog
      setTitle('');
      setFile(null);
      onClose();
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.error('Failed to upload PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading">Upload Study Material</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Document Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your document"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pdf-upload">PDF File</Label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer" 
              onClick={() => document.getElementById('pdf-upload')?.click()}
            >
              {file ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="text-sm text-gray-500">
                    Click to browse or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">PDF only (max 10MB)</p>
                </div>
              )}
              <Input
                id="pdf-upload"
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-study-blue hover:bg-study-blue-dark text-white"
              disabled={!file || !title.trim() || loading}
            >
              {loading ? 'Uploading...' : 'Upload PDF'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PDFUpload;
