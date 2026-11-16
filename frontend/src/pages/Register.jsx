import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

import {
  FileText,
  User,
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
  BriefcaseBusiness,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Register() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirmPassword } = formData;

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/auth/register`, {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      const { token, user } = response.data;

      if (!token) {
        throw new Error(
          "Registration succeeded but no token was returned."
        );
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
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: LayoutTemplate,
      title: "Professional Templates",
      description: "Choose from beautiful, job-ready resume designs.",
    },
    {
      icon: BriefcaseBusiness,
      title: "Showcase Your Skills",
      description: "Present your experience and achievements effectively.",
    },
    {
      icon: Download,
      title: "Easy PDF Download",
      description: "Download your resume whenever you need it.",
    },
  ];

  return (
    <div className="grid min-h-screen bg-white dark:bg-gray-950 lg:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-700 to-violet-900 p-10 text-white lg:flex xl:p-14">

        {/* Background Decoration */}
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl" />

        {/* Logo */}
        <Link to="/" className="relative z-10 flex items-center gap-3">
          <div className="rounded-xl bg-white/15 p-3 backdrop-blur-md">
            <FileText size={28} />
          </div>

          <span className="text-2xl font-bold">
            ResumeCraft
          </span>
        </Link>

        {/* Main Content */}
        <div className="relative z-10 my-12 max-w-xl">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-md">
            <Sparkles size={16} />
            <span>Your career journey starts here</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
            Create Your Future.
            <span className="mt-2 block text-indigo-200">
              Build Your Resume.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-indigo-100 xl:text-lg">
            Join ResumeCraft and create a professional resume that
            highlights your skills, experience, and achievements.
            Take the next step toward your dream career.
          </p>

          {/* Features */}
          <div className="mt-10 space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="rounded-xl bg-white/15 p-3">
                    <Icon size={23} />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {feature.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-indigo-200">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Card */}
        <div className="relative z-10 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-400/20 p-2">
              <CheckCircle2 size={22} className="text-green-300" />
            </div>

            <div>
              <h3 className="font-semibold">
                Start building for free
              </h3>

              <p className="mt-1 text-sm text-indigo-200">
                Create, customize, and manage your resumes in one place.
              </p>
            </div>
          </div>
        </div>

        <p className="relative z-10 mt-8 text-xs text-indigo-200">
          © {new Date().getFullYear()} ResumeCraft. All rights reserved.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative flex min-h-screen items-center justify-center bg-gray-50 px-5 py-12 dark:bg-gray-950 sm:px-10">

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="absolute right-6 top-6 rounded-xl border border-gray-200 bg-white p-3 text-gray-600 shadow-sm transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>

        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <Link
            to="/"
            className="mb-8 flex items-center justify-center gap-2 lg:hidden"
          >
            <div className="rounded-xl bg-indigo-600 p-3 text-white">
              <FileText size={25} />
            </div>

            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              Resume<span className="text-indigo-600">Craft</span>
            </span>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <Sparkles size={15} />
              Create your free account
            </div>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Create Account
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Sign up to start building your professional resume.
            </p>
          </div>

          {/* Register Card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/20 sm:p-8">

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={19}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200/50 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-none"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={19} />
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-7 text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Security */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck size={16} />
            Your information is protected and secure.
          </div>

          <p className="mt-5 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} ResumeCraft. All rights reserved.
          </p>

          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-sm font-medium text-gray-500 transition hover:text-indigo-600 dark:text-gray-400"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}