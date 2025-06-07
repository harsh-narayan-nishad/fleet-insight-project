
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface DataUploadProps {
  onUploadComplete: () => void;
}

const DataUpload = ({ onUploadComplete }: DataUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        setIsOpen(false);
        setSelectedFile(null);
        setUploadProgress(0);
        onUploadComplete();
        
        toast({
          title: "Upload Successful",
          description: "Fleet data has been processed and updated successfully.",
        });
      }, 500);
    } catch (error) {
      setIsUploading(false);
      toast({
        title: "Upload Failed",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white">
          Upload Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Fleet Data</DialogTitle>
          <DialogDescription>
            Upload your WEM Excel export file to update the fleet database.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            {selectedFile && (
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline">{selectedFile.name}</Badge>
                <Badge variant="secondary">{(selectedFile.size / 1024).toFixed(1)} KB</Badge>
              </div>
            )}
          </div>
          
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              {isUploading ? "Processing..." : "Upload & Process"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataUpload;
