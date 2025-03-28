
import { useState } from "react";
import { Plus, Trash2, Phone, Mail, UserCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
  relationship: string;
}

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: "Jane Smith",
      phone: "555-123-4567",
      email: "jane@example.com",
      relationship: "Sister",
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    relationship: "",
  });
  
  const { toast } = useToast();

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Required Fields Missing",
        description: "Name and phone number are required.",
        variant: "destructive",
      });
      return;
    }

    const contact = {
      id: Date.now(),
      ...newContact,
    };

    setContacts([...contacts, contact]);
    setNewContact({ name: "", phone: "", email: "", relationship: "" });
    setShowAddForm(false);
    
    toast({
      title: "Contact Added",
      description: `${contact.name} has been added to your emergency contacts.`,
    });
  };

  const handleDeleteContact = (id: number) => {
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    setContacts(updatedContacts);
    
    toast({
      title: "Contact Removed",
      description: "Emergency contact has been removed.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency Contacts</CardTitle>
        <CardDescription>
          People who will be notified in case of an emergency
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {contacts.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No emergency contacts added yet
          </p>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div 
                key={contact.id} 
                className="flex items-start justify-between p-3 border rounded-md"
              >
                <div className="flex gap-3">
                  <UserCircle className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                      <Phone className="h-3 w-3" /> 
                      <span>{contact.phone}</span>
                    </div>
                    {contact.email && (
                      <div className="flex items-center gap-2 mt-1 text-sm">
                        <Mail className="h-3 w-3" /> 
                        <span>{contact.email}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteContact(contact.id)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {showAddForm ? (
          <div className="border rounded-md p-4 space-y-4 mt-4">
            <h4 className="font-medium">Add New Contact</h4>
            
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input 
                id="name" 
                value={newContact.name}
                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                placeholder="Full Name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input 
                id="phone" 
                value={newContact.phone}
                onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                placeholder="Phone Number"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={newContact.email}
                onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                placeholder="Email Address"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Input 
                id="relationship" 
                value={newContact.relationship}
                onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                placeholder="Relationship (e.g. Parent, Friend)"
              />
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddForm(false);
                  setNewContact({ name: "", phone: "", email: "", relationship: "" });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddContact}>
                <Save className="h-4 w-4 mr-2" />
                Save Contact
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Emergency Contact
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergencyContacts;
