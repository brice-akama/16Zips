

      // app/admin/login/page.tsx
      'use client';

      import { useState } from 'react';
      import { useRouter } from 'next/navigation';
      
      const LoginPage = () => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [error, setError] = useState('');
        const router = useRouter();
      
        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
      
          const res = await fetch('/api/auth/secure-login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          const data = await res.json();
      
          if (res.ok) {
            // Store the JWT token in localStorage
            localStorage.setItem('authToken', data.token);
            router.push('/admin');  // Redirect to the admin page after successful login
          } else {
            setError(data.error || 'An error occurred');
          }
        };
      
        return (
          <div className="max-w-sm mx-auto mt-10 p-5 border shadow-lg rounded-md">
            
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
                Login
              </button>
            </form>
          </div>
        );
      };
      
      export default LoginPage;