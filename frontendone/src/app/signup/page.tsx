"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { useDispatch } from "react-redux";
import { authService } from "../../services/authService";
import { setLoading, setError } from "../../store/slices/authSlice";

export default function SignUpPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setLocalError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      dispatch(setLoading(true));
      // backend expects keys: user_name, user_email, password
      await authService.signup({ user_name: name, user_email: email, password });
      // After successful signup, navigate to signin
      router.push("/signin");
    } catch (err) {
      const message = err?.response?.data?.detail || err?.message || "Sign up failed";
      dispatch(setError(message));
      setLocalError(message);
    } finally {
      setIsLoading(false);
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
        Homepage / <span className="text-gray-800">Signup Page</span>
      </div>

      {/* Main Content */}
      <div className="flex min-h-screen flex items-center justify-center pt-12 pb-24 px-4">
        {/* Note Card */}
        <div className="relative bg-amber-100 rounded-lg shadow-lg p-8 w-full max-w-sm" style={{ backgroundColor: '#fde8c8' }}>
          {/* Card Header */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div className="text-xs font-semibold text-gray-700">Signup</div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            </div>
          </div>

          {/* Form */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Sign up</h2>

            {localError && (
              <div className="mb-4 p-2 rounded bg-red-100 border border-red-300 text-red-700 text-sm">
                {localError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">User name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400 bg-white"
                  required
                />
              </div>

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

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400 bg-white"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-green-400 hover:bg-green-500 text-gray-800 font-medium py-2 px-4 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isLoading ? 'Loading...' : 'Register'}
                </button>
                <Link href="/signin" className="flex-1">
                  <button
                    type="button"
                    className="w-full bg-orange-300 hover:bg-orange-400 text-gray-800 font-medium py-2 px-4 rounded text-sm transition"
                  >
                    Login
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