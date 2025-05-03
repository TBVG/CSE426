
// Mock service for PDF management
// In a real application, this would interact with a backend service

// Define PDF document type
export interface PDFDocument {
  id: string;
  title: string;
  url: string;
  uploadedAt: number;
  size: number;
}

// Local storage key for PDFs
const STORAGE_KEY = 'study_pdfs';

// Get all PDFs from local storage
export const getPDFs = (): PDFDocument[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing PDFs:', e);
      return [];
    }
  }
  return [];
};

// Save PDFs to local storage
const savePDFs = (pdfs: PDFDocument[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pdfs));
  }
};

// Upload a PDF (mock implementation)
export const uploadPDF = async (title: string, file: File): Promise<PDFDocument> => {
  return new Promise((resolve) => {
    // In a real app, we would upload the file to a server or cloud storage
    // For the mock, we'll create a URL from the file
    const reader = new FileReader();
    reader.onload = () => {
      // Create a new PDF document
      const newPDF: PDFDocument = {
        id: `pdf-${Date.now()}`,
        title: title,
        url: reader.result as string, // Use the data URL as the PDF URL
        uploadedAt: Date.now(),
        size: file.size,
      };
      
      // Add to storage
      const currentPDFs = getPDFs();
      savePDFs([...currentPDFs, newPDF]);
      
      // Short timeout to simulate network delay
      setTimeout(() => resolve(newPDF), 500);
    };
    
    reader.readAsDataURL(file);
  });
};

// Get a specific PDF by ID
export const getPDFById = (id: string): PDFDocument | undefined => {
  const pdfs = getPDFs();
  return pdfs.find(pdf => pdf.id === id);
};

// Delete a PDF
export const deletePDF = (id: string): boolean => {
  const pdfs = getPDFs();
  const updatedPDFs = pdfs.filter(pdf => pdf.id !== id);
  
  if (updatedPDFs.length < pdfs.length) {
    savePDFs(updatedPDFs);
    return true;
  }
  
  return false;
};
