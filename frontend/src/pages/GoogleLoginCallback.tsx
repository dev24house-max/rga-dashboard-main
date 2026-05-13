import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { apiClient } from '@/services/api-client';
import { setTokens } from '@/lib/token-manager';
import { useAuthStore } from '@/stores/auth-store';

export default function GoogleLoginCallback() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();
  const setUser = useAuthStore((state) => state.setUser);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    const params = new URLSearchParams(hash);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (!accessToken || !refreshToken) {
      setError('Google login failed. Missing tokens.');
      setLoading(false);
      return;
    }

    setTokens(accessToken, refreshToken);

    apiClient
      .get('/auth/me')
      .then((response) => {
        setUser(response.data);
        initializeAuth();
        setLocation('/dashboard');
      })
      .catch((err) => {
        console.error('Google login callback failed', err);
        setError('Google login failed. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [initializeAuth, setLocation, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4">
      <div className="max-w-xl w-full rounded-3xl border border-slate-800 bg-slate-900/95 p-10 text-center shadow-2xl shadow-black/30">
        {loading ? (
          <>
            <h1 className="text-xl font-semibold mb-3">Signing you in with Google…</h1>
            <p className="text-sm text-slate-300">Please wait while we complete your login.</p>
          </>
        ) : error ? (
          <>
            <h1 className="text-xl font-semibold mb-3 text-rose-400">Google login failed</h1>
            <p className="text-sm text-slate-300 mb-6">{error}</p>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-100 transition"
              onClick={() => setLocation('/login')}
            >
              Return to login
            </button>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold mb-3">Redirecting…</h1>
            <p className="text-sm text-slate-300">If you are not redirected, please click the button below.</p>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-100 transition mt-6"
              onClick={() => setLocation('/dashboard')}
            >
              Go to dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
