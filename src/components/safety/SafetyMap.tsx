
import { useState, useEffect } from "react";
import { MapPin, AlertTriangle, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Simulated safety incidents data
const MOCK_INCIDENTS = [
  { id: 1, lat: 30, lng: 30, type: "alert", title: "Street harassment reported", time: "2 hours ago" },
  { id: 2, lat: 45, lng: 20, type: "alert", title: "Unsafe area at night", time: "1 day ago" },
  { id: 3, lat: 20, lng: 40, type: "alert", title: "Suspicious activity", time: "3 hours ago" },
  { id: 4, lat: 35, lng: 35, type: "safe", title: "Well-lit safe path", time: "5 hours ago" },
  { id: 5, lat: 40, lng: 10, type: "safe", title: "Active community watch", time: "2 days ago" },
];

const SafetyMap = () => {
  const [selectedIncident, setSelectedIncident] = useState<number | null>(null);
  const [currentLocation, setCurrentLocation] = useState({ lat: 25, lng: 25 });
  const { toast } = useToast();

  useEffect(() => {
    // Simulate getting user location
    const interval = setInterval(() => {
      // Random movement on the map
      setCurrentLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 2,
        lng: prev.lng + (Math.random() - 0.5) * 2,
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleAddSafetyReport = () => {
    toast({
      title: "Report Added",
      description: "Your safety report has been added to the community map.",
      duration: 3000,
    });
  };

  return (
    <div className="map-container relative bg-slate-100 dark:bg-slate-700">
      {/* Simulated map background */}
      <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/0,0,1,0,0/800x600?access_token=placeholder')] bg-cover bg-center opacity-50"></div>
      
      {/* Current location pin */}
      <div 
        className="absolute w-4 h-4 rounded-full bg-brand-purple border-2 border-white shadow-lg z-10 animate-pulse"
        style={{ 
          left: `${(currentLocation.lng + 50) / 100 * 100}%`, 
          top: `${(currentLocation.lat + 50) / 100 * 100}%` 
        }}
      />

      {/* Map pins for incidents */}
      <TooltipProvider>
        {MOCK_INCIDENTS.map((incident) => (
          <Tooltip key={incident.id}>
            <TooltipTrigger asChild>
              <button
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-20 ${
                  selectedIncident === incident.id ? 'scale-125' : ''
                } transition-all duration-200`}
                style={{ 
                  left: `${(incident.lng + 50) / 100 * 100}%`, 
                  top: `${(incident.lat + 50) / 100 * 100}%` 
                }}
                onClick={() => setSelectedIncident(
                  selectedIncident === incident.id ? null : incident.id
                )}
              >
                {incident.type === 'alert' ? (
                  <AlertTriangle className="h-5 w-5 text-brand-alert-red" />
                ) : (
                  <Shield className="h-5 w-5 text-brand-safe-green" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">{incident.title}</p>
              <p className="text-xs text-muted-foreground">{incident.time}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>

      {/* Map controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <Button 
          variant="secondary" 
          size="sm" 
          className="rounded-full" 
          onClick={handleAddSafetyReport}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Add Report
        </Button>
      </div>
    </div>
  );
};

export default SafetyMap;
