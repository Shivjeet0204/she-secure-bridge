
import { useState, useEffect } from "react";
import { AlertCircle, UserCheck, UserX } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useEmergencyContacts } from "@/hooks/use-emergency-contacts";

const SOSButton = () => {
  const [sosActive, setSosActive] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showContactsDialog, setShowContactsDialog] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const { toast } = useToast();
  const { contacts, toggleContactSelection, getSelectedContacts } = useEmergencyContacts();

  const handleSOSClick = () => {
    // If we have contacts, show confirmation dialog immediately
    if (contacts.length > 0 && getSelectedContacts().length > 0) {
      setShowConfirmDialog(true);
    } else {
      // If no contacts or none selected, show contacts selection dialog
      setShowContactsDialog(true);
    }
  };

  const activateSOS = () => {
    const selectedContacts = getSelectedContacts();
    
    if (selectedContacts.length === 0) {
      toast({
        title: "No Contacts Selected",
        description: "Please select at least one emergency contact to alert.",
        variant: "destructive",
      });
      setShowContactsDialog(true);
      return;
    }
    
    setSosActive(true);
    setShowConfirmDialog(false);
    
    // Simulate SOS activation
    let countdownTimer = 5;
    const timer = setInterval(() => {
      countdownTimer -= 1;
      setCountdown(countdownTimer);
      
      if (countdownTimer <= 0) {
        clearInterval(timer);
        
        // Simulate sending alert to selected emergency contacts
        setTimeout(() => {
          toast({
            title: "Alert Sent",
            description: `Alert sent to ${selectedContacts.length} emergency contact${selectedContacts.length > 1 ? 's' : ''}.`,
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

  const handleContactSelection = (id: number) => {
    toggleContactSelection(id);
  };

  const proceedToConfirmation = () => {
    const selectedContacts = getSelectedContacts();
    
    if (selectedContacts.length === 0) {
      toast({
        title: "No Contacts Selected",
        description: "Please select at least one emergency contact to alert.",
        variant: "destructive",
      });
      return;
    }
    
    setShowContactsDialog(false);
    setShowConfirmDialog(true);
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

      {/* Contact Selection Dialog */}
      <Dialog open={showContactsDialog} onOpenChange={setShowContactsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex flex-col items-center gap-2">
              Select Emergency Contacts
            </DialogTitle>
            <DialogDescription className="text-center">
              Choose which contacts will receive your SOS alert.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 max-h-60 overflow-y-auto py-2">
            {contacts.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No emergency contacts found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add contacts in your profile page
                </p>
              </div>
            ) : (
              contacts.map((contact) => (
                <div key={contact.id} className="flex items-center space-x-2 border p-3 rounded-md">
                  <Checkbox 
                    id={`contact-${contact.id}`}
                    checked={contact.selected}
                    onCheckedChange={() => handleContactSelection(contact.id)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor={`contact-${contact.id}`} className="font-medium">
                      {contact.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">{contact.phone}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              variant="ghost" 
              onClick={() => setShowContactsDialog(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={proceedToConfirmation}
              className="w-full sm:w-auto"
              disabled={getSelectedContacts().length === 0}
            >
              Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              This will notify your selected emergency contacts.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm font-medium mb-2">
              Alert will be sent to {getSelectedContacts().length} contact{getSelectedContacts().length !== 1 ? 's' : ''}:
            </p>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {getSelectedContacts().map(contact => (
                <div key={contact.id} className="flex items-center gap-2 text-sm">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <span>{contact.name}</span>
                </div>
              ))}
            </div>
          </div>
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
