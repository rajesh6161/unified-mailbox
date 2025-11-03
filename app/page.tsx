import { Mail } from 'lucide-react'; // Import an icon
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4 font-sans">
      <main className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl sm:p-10">
        <div className="flex flex-col items-center space-y-6 sm:items-start">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <Mail size={28} />
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-zinc-900">
              Unified Mail Box
            </h1>
            <p className="text-zinc-600">
              Welcome! Log in or create an account to continue.
            </p>
          </div>

          <div className="flex w-full flex-col gap-4 pt-4 sm:flex-row">
            <Link href="/auth/login" className="w-full rounded-lg bg-indigo-600 px-5 py-3 text-center font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto">
              Login
            </Link>
    
            <Link href="/auth/signup" className="w-full rounded-lg px-5 py-3 text-center font-semibold text-zinc-900 ring-1 ring-inset ring-zinc-300 transition-colors hover:bg-zinc-100 sm:w-auto">
              Signup
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}