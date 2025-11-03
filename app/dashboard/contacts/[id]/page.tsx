"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

export default function ContactDetailPage() {
  const params = useParams();
  const contactId = params.id;
  console.log(`ContactID: ${contactId}`)
  const router = useRouter();

  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContact();
  }, [contactId]);

  async function fetchContact() {
    try {
      const res = await fetch(`/api/contacts/${contactId}`);
      if (!res.ok) throw new Error("Failed to fetch contact");
      const data = await res.json();
      setContact(data);
      setName(data.name || "");
      setPhone(data.phone || "");
      setEmail(data.email || "");
    } catch (error) {
      console.error(error);
      setError("Failed to load contact details");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/contacts/${contactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email }),
      });
      if (!res.ok) throw new Error("Failed to update contact");

      router.push("/dashboard/contacts");
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8">Loading contact...</div>;

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">Edit Contact</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="mb-4">
        <label className="block font-semibold mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Contact Name"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="+1 555 555 5555"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="email@example.com"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
