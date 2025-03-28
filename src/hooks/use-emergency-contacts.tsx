
import { useState, useEffect } from "react";

export interface EmergencyContact {
  id: number;
  name: string;
  phone: string;
  email: string;
  relationship: string;
  selected: boolean;
}

export function useEmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);

  // Load contacts from localStorage on initial render
  useEffect(() => {
    const savedContacts = localStorage.getItem("emergencyContacts");
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    } else {
      // Default contact if none exist
      const defaultContacts = [
        {
          id: 1,
          name: "Jane Smith",
          phone: "555-123-4567",
          email: "jane@example.com",
          relationship: "Sister",
          selected: true,
        }
      ];
      setContacts(defaultContacts);
      localStorage.setItem("emergencyContacts", JSON.stringify(defaultContacts));
    }
  }, []);

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem("emergencyContacts", JSON.stringify(contacts));
    }
  }, [contacts]);

  const addContact = (contact: Omit<EmergencyContact, "id" | "selected">) => {
    const newContact = {
      ...contact,
      id: Date.now(),
      selected: true,
    };
    setContacts([...contacts, newContact]);
  };

  const updateContact = (id: number, updates: Partial<EmergencyContact>) => {
    setContacts(
      contacts.map((contact) =>
        contact.id === id ? { ...contact, ...updates } : contact
      )
    );
  };

  const deleteContact = (id: number) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  const toggleContactSelection = (id: number) => {
    setContacts(
      contacts.map((contact) =>
        contact.id === id ? { ...contact, selected: !contact.selected } : contact
      )
    );
  };

  const getSelectedContacts = () => {
    return contacts.filter(contact => contact.selected);
  };

  return {
    contacts,
    addContact,
    updateContact,
    deleteContact,
    toggleContactSelection,
    getSelectedContacts
  };
}
