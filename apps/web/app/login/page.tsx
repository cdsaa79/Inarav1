"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError('Invalid credentials');
    } else {
      const callbackUrl = params.get('callbackUrl') || '/dashboard';
      router.push(callbackUrl);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow p-6 space-y-4 rounded">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">
          Sign In
        </button>
        <p className="text-center text-sm">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-blue-600 underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
