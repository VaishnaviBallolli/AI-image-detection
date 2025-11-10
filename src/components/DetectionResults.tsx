import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, FileImage, FileVideo } from "lucide-react";

interface DetectionResultsProps {
  result: {
    fileName: string;
    fileType: string;
    isAIGenerated: boolean;
    confidence: string;
    details: string;
  };
}

const DetectionResults = ({ result }: DetectionResultsProps) => {
  const isAI = result.isAIGenerated;
  const confidence = parseFloat(result.confidence);

  return (
    <Card className="border-border/50 bg-card/95 backdrop-blur-sm shadow-glow-cyan animate-in slide-in-from-bottom duration-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {result.fileType === "image" ? (
              <FileImage className="h-5 w-5 text-primary" />
            ) : (
              <FileVideo className="h-5 w-5 text-secondary" />
            )}
            Detection Results
          </CardTitle>
          <Badge
            variant={isAI ? "destructive" : "default"}
            className={isAI ? "bg-destructive" : "bg-primary"}
          >
            {isAI ? (
              <AlertCircle className="mr-1 h-3 w-3" />
            ) : (
              <CheckCircle className="mr-1 h-3 w-3" />
            )}
            {isAI ? "AI Generated" : "Authentic"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">File Name</p>
          <p className="font-medium">{result.fileName}</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Confidence Score</p>
            <p className="text-2xl font-bold text-primary">{result.confidence}%</p>
          </div>
          <Progress value={confidence} className="h-2" />
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1">Analysis Details</p>
          <p className="text-sm">{result.details}</p>
        </div>

        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Detection completed using advanced AI analysis algorithms
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetectionResults;
