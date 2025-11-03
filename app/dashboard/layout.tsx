"use client";
import { useSession, signOut } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const {  session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect("/auth/login");
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">Unified Inbox</h1>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          <Link 
            href="/dashboard" 
            className="text-black px-4 py-2 rounded hover:bg-gray-100 transition flex"
          >
            Inbox
          </Link>
          <Link 
            href="/dashboard/contacts" 
            className="text-black block px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Contacts
          </Link>
        </nav>

        <div className="p-4 border-t bg-gray-50">
          <p className="text-sm text-gray-600 mb-3 truncate">
            {session.user.email}
          </p>
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200 transition"
          >
            Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
