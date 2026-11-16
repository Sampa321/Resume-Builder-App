
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FileText,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Moon,
  Sun,
  CheckCircle2,
  Sparkles,
  LayoutTemplate,
  Download,
  ShieldCheck,
  BriefcaseBusiness
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Login() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/auth/login`,
        formData
      );

      const { token, user } = response.data;

      if (!token) {
        throw new Error("Authentication token was not received.");
      }

      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white transition-colors duration-300 dark:bg-[#090d1a]">

      {/* THEME BUTTON */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="fixed right-6 top-6 z-50 flex items-center gap-2 rounded-xl border border-gray-200 bg-white/90 px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur transition hover:bg-gray-100 dark:border-white/10 dark:bg-[#151e33] dark:text-white dark:hover:bg-white/10"
      >
        {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        <span className="hidden sm:inline">
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </span>
      </button>

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-800 to-purple-900 px-7 py-12 text-white sm:px-12 lg:px-16 lg:py-14">

          {/* Background Decorations */}
          <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-purple-400/20 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-blue-400/20 blur-[100px]" />

          {/* Logo */}
          <Link to="/" className="relative z-10 flex items-center gap-3">
            <div className="rounded-xl bg-white/15 p-3 backdrop-blur">
              <FileText size={27} />
            </div>

            <span className="text-2xl font-extrabold tracking-tight">
              Resume<span className="text-indigo-200">Craft</span>
            </span>
          </Link>

          {/* Main Content */}
          <div className="relative z-10 mx-auto my-16 max-w-xl lg:my-0">

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              <Sparkles size={16} className="text-yellow-300" />
              Build Your Future With Confidence
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl xl:text-6xl">
              Your Dream Job
              <span className="mt-2 block text-indigo-200">
                Starts Here.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-indigo-100 sm:text-lg">
              Create a professional resume that highlights your skills,
              experience and achievements. Make your first impression
              unforgettable with ResumeCraft.
            </p>

            {/* Features */}
            <div className="mt-10 space-y-6">

              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-white/15 p-3">
                  <LayoutTemplate size={23} />
                </div>

                <div>
                  <h3 className="font-bold">
                    Professional Templates
                  </h3>
                  <p className="mt-1 text-sm text-indigo-200">
                    Beautiful designs for every career.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-white/15 p-3">
                  <BriefcaseBusiness size={23} />
                </div>

                <div>
                  <h3 className="font-bold">
                    Showcase Your Skills
                  </h3>
                  <p className="mt-1 text-sm text-indigo-200">
                    Highlight your experience and achievements.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-white/15 p-3">
                  <Download size={23} />
                </div>

                <div>
                  <h3 className="font-bold">
                    Download Your Resume
                  </h3>
                  <p className="mt-1 text-sm text-indigo-200">
                    Export your resume in PDF format.
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Message */}
            <div className="mt-12 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-yellow-300">
                <ShieldCheck size={20} />
                <span className="text-sm font-bold">
                  Your Career, Your Story
                </span>
              </div>

              <p className="mt-3 text-sm leading-7 text-indigo-100">
                Every great career begins with an opportunity.
                Let your resume open the door.
              </p>
            </div>

          </div>

          {/* Left Footer */}
          <div className="relative z-10 mt-8 text-sm text-indigo-200 lg:mt-12">
            © {new Date().getFullYear()} ResumeCraft. Build your future.
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center bg-gray-50 px-5 py-16 dark:bg-[#090d1a] sm:px-10 lg:px-14">

          <div className="w-full max-w-md">

            {/* Welcome Header */}
            <div className="mb-9">

              <div className="mb-6 inline-flex rounded-2xl bg-indigo-100 p-4 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                <FileText size={30} />
              </div>

              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Welcome Back
              </p>

              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Login to Your Account
              </h2>

              <p className="mt-4 leading-7 text-gray-500 dark:text-gray-400">
                Enter your credentials to continue creating
                your professional resume.
              </p>

            </div>

            {/* Login Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-200/50 dark:border-white/10 dark:bg-[#11182a] dark:shadow-black/20 sm:p-8">

              {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* EMAIL */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-[#090d1a] dark:text-white dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-12 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-[#090d1a] dark:text-white dark:placeholder:text-gray-500"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login to Account
                      <ArrowRight size={19} />
                    </>
                  )}
                </button>

              </form>

              {/* REGISTER LINK */}
              <div className="mt-7 border-t border-gray-100 pt-6 text-center text-sm text-gray-600 dark:border-white/10 dark:text-gray-400">
                Don't have an account?

                <Link
                  to="/register"
                  className="ml-1 font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  Create Account
                </Link>
              </div>

            </div>

            {/* Security Message */}
            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-gray-400">
              <CheckCircle2 size={15} className="text-green-500" />
              Your information is protected by secure authentication.
            </div>

            {/* Home Link */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-sm font-semibold text-gray-500 transition hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
              >
                ← Back to Home
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
