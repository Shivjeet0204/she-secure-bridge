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
import { sendSMS, sendEmail, getCurrentLocation, createGoogleMapsLink } from "@/utils/messagingService";
import { toast } from "@/hooks/use-toast";

const SOSButton = () => {
  const [sosActive, setSosActive] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showContactsDialog, setShowContactsDialog] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isSending, setIsSending] = useState(false);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const { toast } = useToast();
  const { contacts, toggleContactSelection, getSelectedContacts } = useEmergencyContacts();

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const position = await getCurrentLocation();
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      } catch (error) {
        console.error("Error getting location:", error);
        toast({
          title: "Location Error",
          description: "Unable to get your current location. Location will not be shared in alerts.",
          variant: "destructive",
        });
      }
    };
    
    fetchLocation();
  }, []);

  const handleSOSClick = () => {
    if (contacts.length > 0 && getSelectedContacts().length > 0) {
      setShowConfirmDialog(true);
    } else {
      setShowContactsDialog(true);
    }
  };

  const activateSOS = async () => {
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
    setIsSending(true);
    
    let countdownTimer = 5;
    const timer = setInterval(() => {
      countdownTimer -= 1;
      setCountdown(countdownTimer);
      
      if (countdownTimer <= 0) {
        clearInterval(timer);
        sendEmergencyAlerts(selectedContacts);
      }
    }, 1000);
  };

  const sendEmergencyAlerts = async (selectedContacts) => {
    try {
      if (!userLocation) {
        try {
          const position = await getCurrentLocation();
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        } catch (error) {
          console.error("Error getting location during alert:", error);
        }
      }

      const locationText = userLocation 
        ? `\nMy current location: ${createGoogleMapsLink(userLocation.latitude, userLocation.longitude)}`
        : "\nLocation information is not available.";

      const messageText = `EMERGENCY SOS ALERT: I need help immediately. This is an emergency.${locationText}`;
      
      const messagePromises = selectedContacts.map(async (contact) => {
        const messageContent = {
          recipientPhone: contact.phone,
          recipientEmail: contact.email,
          message: messageText,
          location: userLocation
        };

        const smsResult = await sendSMS(messageContent);
        
        let emailResult = false;
        if (contact.email) {
          emailResult = await sendEmail(messageContent);
        }

        return { contact, smsResult, emailResult };
      });

      const results = await Promise.all(messagePromises);
      
      const successfulSends = results.filter(r => r.smsResult || r.emailResult).length;
      
      setIsSending(false);
      
      if (successfulSends > 0) {
        toast({
          title: "Alert Sent",
          description: `Alert sent to ${successfulSends} emergency contact${successfulSends > 1 ? 's' : ''}.`,
          duration: 5000,
        });
      } else {
        toast({
          title: "Alert Sending Failed",
          description: "Unable to send alerts. Please try again or contact emergency services directly.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error sending alerts:", error);
      setIsSending(false);
      toast({
        title: "Alert Sending Failed",
        description: "An error occurred while sending alerts. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
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
                  {isSending ? "Sending alerts..." : "Alert sent! Help is on the way."}
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
              disabled={countdown <= 0 && isSending}
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
