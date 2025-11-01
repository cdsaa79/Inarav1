"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'CONSUMER' | 'PROVIDER'>('CONSUMER');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role }),
      });
      if (!res.ok) {
        const text = await res.text();
        setError(text || 'Registration failed');
        return;
      }
      // Auto-login after registration
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      router.push('/dashboard');
    } catch (err) {
      setError('Registration failed');
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow p-6 space-y-4 rounded">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
          />
        </div>
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
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'CONSUMER' | 'PROVIDER')}
            className="mt-1 w-full p-2 border rounded"
          >
            <option value="CONSUMER">Consumer</option>
            <option value="PROVIDER">Provider</option>
          </select>
        </div>
        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">
          Create account
        </button>
        <p className="text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 underline">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}
