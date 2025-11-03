"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    try {
      const res = await fetch("/api/contacts");
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      console.error("Failed to load contacts", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-8">Loading contacts...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Contacts</h2>

      <Link
        href="/dashboard/contacts/new"
        className="inline-block mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        + New Contact
      </Link>

      {contacts.length === 0 ? (
        <p>No contacts found.</p>
      ) : (
        <ul>
          {contacts.map((c) => (
            <li key={c.id} className="border-b py-2">
              <Link href={`/dashboard/contacts/${c.id}`} className="text-blue-600 hover:underline">
                {c.name} {c.phone && `- ${c.phone}`}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
