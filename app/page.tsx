import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function LandingPage() {
  const userId = await auth();

  if (userId) {
    redirect('/dashboard');
  }

  return (
    <main className="bg-[url('/images/bg.jpg')] bg-cover bg-center min-h-screen text-center p-8">
      <h1 className="text-white  text-7xl font-bold mt-20">
        Welcome to Workout Planner 
      </h1>
      <Link href="/login" className="text-yellow-500 underline block mb-10">
        Login
      </Link>
      <Link href="/login" className="text-green-500 underline">
        Register
      </Link>
    </main>
  );
}
