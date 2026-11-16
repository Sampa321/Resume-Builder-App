
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Download,
  LogOut,
  Moon,
  Sun,
  LayoutDashboard,
  Clock,
  Search,
  Sparkles,
  MoreVertical
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const token = localStorage.getItem("token");

  // Redirect if user is not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchResumes();
  }, []);

  // Fetch all resumes
  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/resumes`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = response.data;

      setResumes(
        Array.isArray(data)
          ? data
          : data.resumes || []
      );
   } catch (err) {
  console.error("Fetch resumes error:", err);

  if (err.response) {
    console.error("Status:", err.response.status);
    console.error("Backend response:", err.response.data);

    setError(
      err.response.data?.message ||
      `Server error: ${err.response.status}`
    );
  } else if (err.request) {
    setError(
      "Cannot connect to the backend. Check whether your server is running on port 5000."
    );
  } else {
    setError(err.message || "Unable to load resumes.");
  }
} finally {
  setLoading(false);
}
  };

  // Delete resume
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/resumes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setResumes((prev) =>
        prev.filter((resume) => resume._id !== id)
      );

      alert("Resume deleted successfully!");
    } catch (err) {
      console.error("Delete resume error:", err);

      alert(
        err.response?.data?.message ||
        "Failed to delete resume."
      );
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const filteredResumes = resumes.filter((resume) =>
    (resume.title || "Untitled Resume")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-[#090d1a] dark:text-white">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#090d1a]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-2.5 text-white">
              <FileText size={22} />
            </div>

            <span className="text-xl font-extrabold">
              Resume<span className="text-indigo-600">Craft</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">

            <button
              onClick={toggleTheme}
              className="rounded-xl border border-gray-200 p-2.5 hover:bg-gray-100 dark:border-white/10 dark:hover:bg-white/10"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon size={19} />
              ) : (
                <Sun size={19} />
              )}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
            >
              <LogOut size={17} />
              <span className="hidden sm:inline">Logout</span>
            </button>

          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">

        {/* PAGE HEADER */}
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              <LayoutDashboard size={17} />
              Dashboard
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              My Resumes
            </h1>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Create, manage and download your professional resumes.
            </p>
          </div>

          <Link
            to="/builder"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-1 hover:bg-indigo-700"
          >
            <Plus size={20} />
            Create New Resume
          </Link>

        </div>

        {/* STATS */}
        <div className="mb-10 grid gap-5 sm:grid-cols-2">

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#11182a]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Resumes
                </p>

                <h2 className="mt-2 text-3xl font-extrabold">
                  {resumes.length}
                </h2>
              </div>

              <div className="rounded-xl bg-indigo-100 p-4 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                <FileText size={25} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#11182a]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Account Status
                </p>

                <h2 className="mt-2 text-xl font-extrabold text-green-600">
                  Active
                </h2>
              </div>

              <div className="rounded-xl bg-green-100 p-4 text-green-600 dark:bg-green-500/15 dark:text-green-400">
                <Sparkles size={25} />
              </div>
            </div>
          </div>

        </div>

        {/* RESUME LIST HEADER */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h2 className="text-xl font-bold">
              Your Documents
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage all your saved resumes here.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search resumes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-[#11182a] dark:text-white"
            />
          </div>

        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            {error}
            <button
              onClick={fetchResumes}
              className="ml-3 font-bold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        ) : filteredResumes.length > 0 ? (

          /* RESUME CARDS */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {filteredResumes.map((resume) => (

              <div
                key={resume._id}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl dark:border-white/10 dark:bg-[#11182a] dark:hover:border-indigo-500/50"
              >

                <div className="mb-5 flex items-start justify-between">

                  <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                    <FileText size={25} />
                  </div>

                  <button
                    onClick={() => handleDelete(resume._id)}
                    title="Delete resume"
                    className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

                <h3 className="truncate text-lg font-bold">
                  {resume.title || "Untitled Resume"}
                </h3>

                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock size={15} />
                  Updated{" "}
                  {resume.updatedAt
                    ? new Date(resume.updatedAt).toLocaleDateString()
                    : "Recently"}
                </div>

                <div className="mt-6 flex gap-3">

                  <Link
                    to={`/builder/${resume._id}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    <Pencil size={15} />
                    Edit
                  </Link>

                  <Link
                    to={`/builder/${resume._id}`}
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:border-indigo-400 hover:text-indigo-600 dark:border-white/10 dark:text-gray-300"
                    title="Open resume"
                  >
                    <Download size={16} />
                  </Link>

                </div>

              </div>

            ))} 
          </div>

        ) : (

          /* EMPTY STATE */
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-[#11182a]">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
              <FileText size={38} />
            </div>

            <h3 className="mt-6 text-xl font-bold">
              {search
                ? "No matching resumes found"
                : "No resumes yet"}
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500 dark:text-gray-400">
              {search
                ? "Try searching with another resume title."
                : "You haven't created a resume yet. Start building your professional resume today."}
            </p>

            {!search && (
              <Link
                to="/builder"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700"
              >
                <Plus size={19} />
                Create Your First Resume
              </Link>
            )}

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500 dark:border-white/10 dark:text-gray-400">
        © {new Date().getFullYear()} ResumeCraft. All rights reserved.
      </footer>

    </div>
  );
}
