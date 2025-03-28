
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SOSButton = () => {
  const [sosActive, setSosActive] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const { toast } = useToast();

  const handleSOSClick = () => {
    setShowConfirmDialog(true);
  };

  const activateSOS = () => {
    setSosActive(true);
    setShowConfirmDialog(false);
    
    // Simulate SOS activation
    let countdownTimer = 5;
    const timer = setInterval(() => {
      countdownTimer -= 1;
      setCountdown(countdownTimer);
      
      if (countdownTimer <= 0) {
        clearInterval(timer);
        
        // Simulate sending alert to emergency contacts
        setTimeout(() => {
          toast({
            title: "Alert Sent",
            description: "Your emergency contacts have been notified of your location.",
            duration: 5000,
          });
        }, 500);
      }
    }, 1000);
  };

  const cancelSOS = () => {
    setSosActive(false);
    toast({
      title: "SOS Cancelled",
      description: "Your SOS alert has been cancelled.",
      variant: "default",
    });
  };

  return (
    <>
      <button
        className="sos-button"
        onClick={handleSOSClick}
        aria-label="SOS Emergency Button"
      >
        SOS
      </button>

      {/* SOS Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center flex flex-col items-center gap-2">
              <AlertCircle className="h-8 w-8 text-destructive" />
              Emergency Alert
            </DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to activate an emergency alert?
              This will notify your emergency contacts.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              variant="ghost" 
              onClick={() => setShowConfirmDialog(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={activateSOS}
              className="w-full sm:w-auto"
            >
              Yes, Send Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Active SOS Dialog */}
      <Dialog open={sosActive} onOpenChange={setSosActive}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-destructive">
              SOS ALERT ACTIVE
            </DialogTitle>
            <DialogDescription className="text-center">
              {countdown > 0 ? (
                <span className="text-lg font-semibold">
                  Sending alert in {countdown} seconds...
                </span>
              ) : (
                <span className="text-lg font-semibold">
                  Alert sent! Help is on the way.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center my-4">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={cancelSOS}
              className="w-full"
            >
              Cancel SOS
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SOSButton;
