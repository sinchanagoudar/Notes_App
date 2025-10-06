"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { useDispatch, useSelector } from "react-redux";
import { authService } from "../../services/authService";
import { setCredentials, setError, setLoading } from "../../store/slices/authSlice";

export default function SignInPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const { loading } = useSelector((state: any) => state.auth || { loading: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (!email.trim() || !password.trim()) {
      setLocalError("Email and password are required");
      return;
    }

    try {
      dispatch(setLoading(true));
      // backend expects keys: user_email, password
      const data = await authService.signin({ user_email: email, password });
      // store token and user (if provided) in redux
      dispatch(setCredentials({ token: data.access_token || null, user: data.user || null }));
      router.push("/");
    } catch (err) {
      const message = err?.response?.data?.detail || err?.message || "Sign in failed";
      dispatch(setError(message));
      setLocalError(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-amber-50" style={{ backgroundColor: '#f5e6d3' }}>
      {/* Header */}
      <header className="bg-teal-400 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="text-gray-700 font-semibold text-lg">Keep Notes</div>
        <nav className="flex gap-6 text-sm text-gray-700">
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/account" className="hover:underline">Account</Link>
          <Link href="/signin" className="hover:underline">Login</Link>
        </nav>
      </header>

      {/* Breadcrumb */}
      <div className="px-6 py-2 text-sm text-gray-600">
        Homepage / <span className="text-gray-800">Login Page</span>
      </div>

      {/* Main Content */}
      <div className="flex min-h-screen justify-center items-center">
        {/* Note Card */}
        <div className="relative bg-amber-100 rounded-lg shadow-lg p-8 w-full max-w-sm" style={{ backgroundColor: '#fde8c8' }}>
          {/* Card Header */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div className="text-xs font-semibold text-gray-700">Login</div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            </div>
          </div>

          {/* Form */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Login</h2>

            {localError && (
              <div className="mb-4 p-2 rounded bg-red-100 border border-red-300 text-red-700 text-sm">
                {localError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400 bg-white"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-orange-300 hover:bg-orange-400 text-gray-800 font-medium py-2 px-4 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Signing in...' : 'Login'}
                </button>
                <Link href="/signup" className="flex-1">
                  <button
                    type="button"
                    className="w-full bg-blue-300 hover:bg-blue-400 text-gray-800 font-medium py-2 px-4 rounded text-sm transition"
                  >
                    Register
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}