import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Loader2 } from "lucide-react";
import { z } from "zod";

const fileSchema = z.object({
  type: z.string().refine(
    (type) =>
      type.startsWith("image/") || type.startsWith("video/"),
    "Only image and video files are allowed"
  ),
  size: z.number().max(50 * 1024 * 1024, "File size must be less than 50MB"),
});

interface FileUploadProps {
  onDetectionComplete: (result: any) => void;
  userId?: string;
}

const FileUpload = ({ onDetectionComplete, userId }: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = (selectedFile: File) => {
    const validation = fileSchema.safeParse({
      type: selectedFile.type,
      size: selectedFile.size,
    });

    if (!validation.success) {
      toast({
        title: "Invalid file",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDetection = async () => {
    if (!file || !userId) return;

    setLoading(true);

    try {
      // Track user activity
      await supabase.rpc("update_user_activity", { p_user_id: userId });

      // Simulate AI detection (replace with actual AI model)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const isAIGenerated = Math.random() > 0.5;
      const confidence = Math.random() * 10 + 90; // 90-100% confidence

      const result = {
        fileName: file.name,
        fileType: file.type.startsWith("image/") ? "image" : "video",
        isAIGenerated,
        confidence: confidence.toFixed(2),
        details: isAIGenerated
          ? "AI-generated content detected with high confidence"
          : "Authentic content - no AI manipulation detected",
      };

      // Save to database
      const { error } = await supabase.from("detection_history").insert({
        user_id: userId,
        file_name: file.name,
        file_type: file.type,
        detection_result: {
          isAIGenerated,
          details: result.details,
        },
        confidence_score: parseFloat(confidence.toFixed(2)),
      });

      if (error) throw error;

      onDetectionComplete(result);
      
      toast({
        title: "Detection Complete",
        description: `Analysis finished with ${result.confidence}% confidence`,
      });

      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      toast({
        title: "Detection Failed",
        description: error.message || "An error occurred during detection",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          dragActive
            ? "border-primary bg-primary/10"
            : "border-border/50 hover:border-primary/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg mb-2">
          {file ? file.name : "Drag and drop your file here"}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          or click to browse (Images & Videos, max 50MB)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleChange}
          accept="image/*,video/*"
          className="hidden"
          id="file-upload"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="border-primary/50 hover:border-primary"
        >
          Browse Files
        </Button>
      </div>

      {file && (
        <Button
          onClick={handleDetection}
          disabled={loading}
          className="w-full bg-gradient-primary hover:shadow-glow-cyan transition-all duration-300"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Start Detection"
          )}
        </Button>
      )}
    </div>
  );
};

export default FileUpload;
