
import { useState } from "react";
import { AlertTriangle, ShieldCheck, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ThreatDetection = () => {
  const [threatLevel, setThreatLevel] = useState("low");
  const { toast } = useToast();

  const simulateThreatDetection = (level: string) => {
    setThreatLevel(level);
    
    if (level === "high") {
      toast({
        title: "Threat Detected",
        description: "Potential threat detected in your vicinity. Stay alert.",
        variant: "destructive",
      });
    } else if (level === "medium") {
      toast({
        title: "Caution Advised",
        description: "Be cautious of your surroundings.",
        variant: "default",
      });
    } else {
      toast({
        title: "All Clear",
        description: "No threats detected in your area.",
        variant: "default",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {threatLevel === "high" && <AlertTriangle className="h-5 w-5 text-brand-alert-red" />}
          {threatLevel === "medium" && <AlertTriangle className="h-5 w-5 text-amber-500" />}
          {threatLevel === "low" && <ShieldCheck className="h-5 w-5 text-brand-safe-green" />}
          AI Threat Detection
        </CardTitle>
        <CardDescription>
          Real-time analysis of your surroundings for potential threats
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Current Status:</span>
            <span 
              className={`font-medium ${
                threatLevel === "high" 
                  ? "text-brand-alert-red" 
                  : threatLevel === "medium" 
                  ? "text-amber-500" 
                  : "text-brand-safe-green"
              }`}
            >
              {threatLevel === "high" 
                ? "High Risk" 
                : threatLevel === "medium" 
                ? "Medium Risk" 
                : "Low Risk"}
            </span>
          </div>
          
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-2">
            <div 
              className={`h-2 rounded-full ${
                threatLevel === "high" 
                  ? "bg-brand-alert-red" 
                  : threatLevel === "medium" 
                  ? "bg-amber-500" 
                  : "bg-brand-safe-green"
              }`}
              style={{ 
                width: threatLevel === "high" 
                  ? "100%" 
                  : threatLevel === "medium" 
                  ? "50%" 
                  : "10%" 
              }}
            />
          </div>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          {threatLevel === "high" && (
            <p>High risk detected. Stay alert and consider seeking assistance.</p>
          )}
          {threatLevel === "medium" && (
            <p>Exercise caution in your current location. Be aware of your surroundings.</p>
          )}
          {threatLevel === "low" && (
            <p>Area appears safe. Continue to stay alert.</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Info className="h-4 w-4 mr-2" />
              Learn More
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>About AI Threat Detection</DialogTitle>
              <DialogDescription>
                This feature uses advanced AI algorithms to analyze your surroundings through:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Analysis of movement patterns around you</li>
                  <li>Ambient sound processing for unusual activity</li>
                  <li>Location-based safety scoring using community data</li>
                  <li>Time-of-day risk assessment</li>
                </ul>
                <p className="mt-4">
                  For demonstration purposes, the simulation buttons below show 
                  how the system would respond to different threat levels.
                </p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => simulateThreatDetection("low")}
          >
            Simulate Safe
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => simulateThreatDetection("medium")}
          >
            Simulate Caution
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => simulateThreatDetection("high")}
          >
            Simulate Threat
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ThreatDetection;
