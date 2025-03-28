
import { Shield, Bell, MapPin, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import SOSButton from "@/components/sos/SOSButton";
import ThreatDetection from "@/components/safety/ThreatDetection";
import FeatureCard from "@/components/home/FeatureCard";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

const features = [
  {
    icon: Bell,
    title: "Instant SOS Alerts",
    description: "Send emergency alerts with your real-time location to your trusted contacts with one tap.",
  },
  {
    icon: Shield,
    title: "AI Threat Detection",
    description: "Advanced algorithms analyze your surroundings to detect potential threats before they occur.",
  },
  {
    icon: MapPin,
    title: "Safety Map",
    description: "Access community-driven safety insights to identify safer routes and areas.",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Connect with others and share safety information to create a safer environment for everyone.",
  },
];

const Index = () => {
  useEffect(() => {
    // Check if the app is running properly
    console.log("Index page loaded successfully");
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container px-4 py-8">
        <section className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent safety-gradient">
              Your Safety Companion
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Empowering women with smart security solutions for peace of mind
              wherever you go.
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center space-y-6">
            <SOSButton />
            <p className="text-sm text-muted-foreground mt-2">
              Press the SOS button in case of emergency
            </p>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Threat Detection</h2>
          <ThreatDetection />
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </section>
      </main>
      
      <footer className="mt-auto py-6 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>SheBridge - Empowering safety through technology</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
