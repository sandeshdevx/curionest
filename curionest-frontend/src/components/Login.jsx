import { useState } from 'react';

export default function Login({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const url = isRegistering ? 'http://localhost:8080/api/auth/register' : 'http://localhost:8080/api/auth/login';
    const body = isRegistering 
      ? { email, password, username, firstName: username } 
      : { email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const user = await response.json();
        onLogin(user);
      } else {
        const text = await response.text();
        setError(text || 'Authentication failed');
      }
    } catch (err) {
      setError('Could not connect to the server. Is the Spring Boot backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-[2rem] w-full max-w-md p-10 relative overflow-hidden shadow-2xl">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-serif font-bold text-slate-900 mb-3 tracking-tight">
          CurioNest
        </h1>
        <p className="text-slate-500 text-lg">
          {isRegistering ? 'Start building better habits' : 'Welcome back, tracking awaits.'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {isRegistering && (
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Username</label>
            <input 
              type="text" 
              placeholder="e.g. johndoe" 
              className="glass-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
        )}
        
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">Email Address</label>
          <input 
            type="email" 
            placeholder="john@example.com" 
            className="glass-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            className="glass-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        
        <button type="submit" disabled={loading} className="btn-primary w-full mt-4">
          {loading ? 'Loading...' : (isRegistering ? 'Create Account' : 'Sign In')}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button 
          onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
          className="text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
}
