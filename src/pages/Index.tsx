import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, TrendingUp, Image, Video, BarChart3 } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-in slide-in-from-bottom duration-700">
              AI Detection Platform
            </h1>
            <p className="text-xl md:text-2xl text-foreground/90 animate-in slide-in-from-bottom duration-700 delay-100">
              Detect AI-generated images and videos with unparalleled precision
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom duration-700 delay-200">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-gradient-primary hover:shadow-glow-cyan transition-all duration-300 text-lg px-8"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/auth")}
                className="border-primary/50 hover:border-primary text-lg px-8"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground">
            Industry-leading AI detection technology
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm hover:shadow-glow-cyan transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Image className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Image Detection</CardTitle>
              <CardDescription>
                Advanced algorithms detect AI-generated images with exceptional accuracy
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-secondary/20 bg-card/80 backdrop-blur-sm hover:shadow-glow-purple transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Video className="h-8 w-8 text-secondary" />
              </div>
              <CardTitle>Video Analysis</CardTitle>
              <CardDescription>
                Frame-by-frame video analysis for comprehensive deepfake detection
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm hover:shadow-glow-cyan transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>High Precision</CardTitle>
              <CardDescription>
                Near-perfect detection accuracy with detailed confidence scoring
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-secondary/20 bg-card/80 backdrop-blur-sm hover:shadow-glow-purple transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-8 w-8 text-secondary" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Instant results with optimized processing algorithms
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm hover:shadow-glow-cyan transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Track usage patterns and detection history with detailed insights
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-secondary/20 bg-card/80 backdrop-blur-sm hover:shadow-glow-purple transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-8 w-8 text-secondary" />
              </div>
              <CardTitle>Continuous Learning</CardTitle>
              <CardDescription>
                AI models constantly updated with latest detection techniques
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-border/50 bg-gradient-primary/10 backdrop-blur-sm shadow-glow-cyan">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of users already using our platform to detect AI-generated content
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-gradient-primary hover:shadow-glow-cyan transition-all duration-300 text-lg px-12"
            >
              Start Detecting Now
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
