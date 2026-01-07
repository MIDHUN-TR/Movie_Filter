import Link from "next/link";
import Header from "./lib/Header";

export default function Page() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-950 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl shadow-2xl backdrop-blur-md px-8 py-10">
          {/* Header */}
          <Header />
          <div className="flex flex-col items-center gap-2">

            <h1 className="text-2xl font-semibold text-slate-50 mt-2">
              Welcome back
            </h1>
            <p className="text-sm text-slate-400">
              Login to continue to your dashboard.
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-200"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-200"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-orange-400 hover:text-orange-300 transition"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-orange-500 focus:ring-orange-500"
              />
              <label
                htmlFor="remember"
                className="text-xs text-slate-400 select-none"
              >
                Remember me
              </label>
            </div>

            <Link
              href='/dashboard'
              className="w-full inline-flex justify-center rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-orange-500/40 hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 focus-visible:ring-offset-slate-900 transition"
            >
              Sign in
            </Link>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-orange-400 hover:text-orange-300 transition"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
