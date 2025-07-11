'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ResetPasswordPageInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!token) {
      setMessage('Invalid or missing token.');
      return;
    }

    const res = await fetch("/api/auth/reset-password", {
      method: 'POST',
      body: JSON.stringify({ token, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => router.push('/admin/login'), 3000);
    } else {
      setMessage(data.error || 'Failed to reset password');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h1 className="text-xl mb-4 text-blue-600">Reset Password</h1>
      {message && <p className="mb-4">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4 text-blue-600"
          minLength={6}
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
}
