
import Header from "@/components/layout/Header";
import SafetyMap from "@/components/safety/SafetyMap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MapPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Safety Map</h1>
        
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Safety Map</CardTitle>
              <CardDescription>
                View safety reports and insights shared by the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SafetyMap />
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Safety Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Reported incidents in your area from the last 7 days.
              </p>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Safe Zones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Areas marked as safe by community members.
              </p>
              <div className="text-2xl font-bold">8</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Safety insights you've shared with the community.
              </p>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MapPage;
