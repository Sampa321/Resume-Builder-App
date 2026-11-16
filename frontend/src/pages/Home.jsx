
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

import {
  FileText,
  ArrowRight,
  CheckCircle2,
  Palette,
  Download,
  Zap,
  User,
  LayoutTemplate,
  Sparkles,
  Menu,
  X,
  Moon,
  Sun,
  ShieldCheck,
  WandSparkles,
  BriefcaseBusiness,
  GraduationCap,
  Code2,
  Star,
  ChevronRight
} from "lucide-react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: LayoutTemplate,
      title: "Professional Templates",
      description:
        "Choose beautiful, professionally designed templates that make your resume stand out.",
      color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400"
    },
    {
      icon: Palette,
      title: "Easy Customization",
      description:
        "Personalize your resume with your education, skills, projects and experience.",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400"
    },
    {
      icon: Download,
      title: "PDF Download",
      description:
        "Download your completed resume in PDF format, ready to share with recruiters.",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
    },
    {
      icon: Zap,
      title: "Quick & Simple",
      description:
        "Create a polished resume in minutes with an easy-to-use resume editor.",
      color: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
    }
  ];

  const steps = [
    {
      number: "01",
      icon: User,
      title: "Create Your Account",
      description:
        "Sign up and access your personal dashboard to start building your resume."
    },
    {
      number: "02",
      icon: FileText,
      title: "Build Your Resume",
      description:
        "Add your personal details, education, skills, projects and experience."
    },
    {
      number: "03",
      icon: Download,
      title: "Download & Apply",
      description:
        "Preview your professional resume and download it as a PDF."
    }
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen overflow-hidden bg-white text-gray-900 transition-colors duration-300 dark:bg-[#090d1a] dark:text-white">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#090d1a]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-2.5 text-white shadow-lg shadow-indigo-500/25">
              <FileText size={23} />
            </div>

            <span className="text-2xl font-extrabold tracking-tight">
              Resume<span className="text-indigo-600">Craft</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-gray-600 transition hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-gray-600 transition hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
            >
              How It Works
            </a>

            <Link
              to="/login"
              className="text-sm font-semibold text-gray-700 hover:text-indigo-600 dark:text-gray-200 dark:hover:text-indigo-400"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-700"
            >
              Get Started <ArrowRight size={15} className="ml-1 inline" />
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              className="rounded-xl border border-gray-200 p-2.5 text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:text-yellow-300 dark:hover:bg-white/10"
            >
              {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-lg border border-gray-200 p-2 dark:border-white/10"
            >
              {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation"
              className="rounded-lg p-2 text-gray-800 dark:text-white"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="border-t border-gray-200 bg-white px-6 py-5 dark:border-white/10 dark:bg-[#11182a] md:hidden">
            <div className="flex flex-col gap-5">
              <a href="#features" onClick={closeMenu} className="font-medium text-gray-700 dark:text-gray-200">
                Features
              </a>

              <a href="#how-it-works" onClick={closeMenu} className="font-medium text-gray-700 dark:text-gray-200">
                How It Works
              </a>

              <Link to="/login" onClick={closeMenu} className="font-medium text-gray-700 dark:text-gray-200">
                Login
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-center font-semibold text-white"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-[#0d1428] dark:via-[#090d1a] dark:to-[#17112d]">

        {/* Background Decoration */}
        <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-indigo-300/20 blur-[100px] dark:bg-indigo-600/20" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-purple-300/20 blur-[100px] dark:bg-purple-600/20" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 py-20 sm:px-8 md:grid-cols-2 md:py-28">

          {/* Hero Content */}
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-300">
              <Sparkles size={16} />
              Your career starts with a great resume
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
              Build a Resume
              <span className="mt-2 block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                That Opens Doors.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-gray-600 dark:text-gray-300 sm:text-lg">
              Create a professional resume that tells your story. Choose a
              beautiful template, customize every section and download your
              resume in minutes.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-3 rounded-xl bg-indigo-600 px-7 py-4 font-bold text-white shadow-xl shadow-indigo-500/25 transition duration-300 hover:-translate-y-1 hover:bg-indigo-700"
              >
                Build My Resume
                <ArrowRight size={20} />
              </Link>

              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-7 py-4 font-semibold text-gray-800 transition hover:border-indigo-500 hover:text-indigo-600 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-indigo-400 dark:hover:text-indigo-300"
              >
                Explore Features
                <ChevronRight size={19} />
              </a>
            </div>

            {/* Trust Points */}
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600 dark:text-gray-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-green-500" />
                Easy to use
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-green-500" />
                Professional templates
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-green-500" />
                PDF export
              </span>
            </div>
          </div>

          {/* Resume Preview */}
          <div className="relative mx-auto w-full max-w-[470px]">

            <div className="absolute -left-12 top-10 h-48 w-48 rounded-full bg-indigo-400/20 blur-3xl" />
            <div className="absolute -right-10 bottom-10 h-48 w-48 rounded-full bg-purple-400/20 blur-3xl" />

            <div className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl shadow-indigo-900/10 dark:border-white/10 dark:bg-[#fdfdfd] sm:p-8">

              {/* Resume Header */}
              <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <User size={32} />
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-gray-900">
                    Alex Johnson
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-indigo-600">
                    Full Stack Developer
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    alex@example.com | New York
                  </p>
                </div>
              </div>

              {/* Profile */}
              <div className="mt-6">
                <h3 className="mb-3 text-xs font-extrabold uppercase tracking-widest text-indigo-600">
                  Professional Summary
                </h3>
                <p className="text-xs leading-6 text-gray-600">
                  Passionate developer with experience building modern,
                  responsive web applications using React and Node.js.
                </p>
              </div>

              {/* Experience */}
              <div className="mt-6">
                <h3 className="mb-3 text-xs font-extrabold uppercase tracking-widest text-indigo-600">
                  Experience
                </h3>

                <div className="border-l-2 border-indigo-200 pl-4">
                  <h4 className="text-sm font-bold text-gray-900">
                    Frontend Developer
                  </h4>
                  <p className="mt-1 text-xs text-gray-500">
                    Tech Company · 2026 – Present
                  </p>
                  <div className="mt-3 h-1.5 w-full rounded-full bg-gray-100" />
                  <div className="mt-2 h-1.5 w-4/5 rounded-full bg-gray-100" />
                </div>
              </div>

              {/* Education */}
              <div className="mt-6">
                <h3 className="mb-3 text-xs font-extrabold uppercase tracking-widest text-indigo-600">
                  Education
                </h3>
                <h4 className="text-sm font-bold text-gray-900">
                  Bachelor of Computer Science
                </h4>
                <p className="mt-1 text-xs text-gray-500">
                  University · 2023 – 2027
                </p>
              </div>

              {/* Skills */}
              <div className="mt-6">
                <h3 className="mb-3 text-xs font-extrabold uppercase tracking-widest text-indigo-600">
                  Technical Skills
                </h3>

                <div className="flex flex-wrap gap-2">
                  {["React", "JavaScript", "Node.js", "MongoDB", "Git"].map(
                    (skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="mt-7 flex items-center justify-between border-t border-gray-200 pt-4">
                <span className="text-xs font-semibold text-gray-400">
                  RESUMECRAFT
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                  <ShieldCheck size={14} />
                  Professional Resume
                </span>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-5 flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-[#171f33] sm:-left-10">
              <div className="rounded-lg bg-green-100 p-2 text-green-600">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  Resume Ready!
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ready to download
                </p>
              </div>
            </div>

            {/* Template Badge */}
            <div className="absolute -right-3 -top-5 flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-xl dark:border-white/10 dark:bg-[#171f33] sm:-right-8">
              <Star size={17} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-gray-800 dark:text-white">
                Modern Templates
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="bg-white px-5 py-24 dark:bg-[#090d1a] sm:px-8"
      >
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              Powerful Features
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Everything You Need to
              <span className="block text-indigo-600 dark:text-indigo-400">
                Build Your Resume
              </span>
            </h2>

            <p className="mt-5 leading-7 text-gray-600 dark:text-gray-400">
              All the essential tools to create, customize and manage your
              professional resume in one place.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className="group rounded-2xl border border-gray-200 bg-gray-50/70 p-7 transition duration-300 hover:-translate-y-2 hover:border-indigo-300 hover:bg-white hover:shadow-xl dark:border-white/10 dark:bg-[#11182a] dark:hover:border-indigo-500/50 dark:hover:bg-[#151e33]"
                >
                  <div className={`mb-6 inline-flex rounded-xl p-4 ${feature.color}`}>
                    <Icon size={27} />
                  </div>

                  <h3 className="text-lg font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-indigo-600 opacity-0 transition group-hover:opacity-100 dark:text-indigo-400">
                    Learn more <ArrowRight size={15} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="border-y border-gray-100 bg-gray-50 px-5 py-24 dark:border-white/5 dark:bg-[#0d1425] sm:px-8"
      >
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              Simple Process
            </span>

            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              Your Resume in 3 Easy Steps
            </h2>

            <p className="mt-4 text-gray-600 dark:text-gray-400">
              No complicated formatting. Just follow three simple steps.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#151e33]"
                >
                  <div className="flex items-center justify-between">
                    <div className="rounded-xl bg-indigo-100 p-4 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                      <Icon size={27} />
                    </div>

                    <span className="text-5xl font-black text-indigo-100 dark:text-indigo-400/20">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-bold">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>

                  {index !== 2 && (
                    <ArrowRight
                      size={22}
                      className="absolute -right-5 top-1/2 z-10 hidden -translate-y-1/2 text-indigo-400 md:block"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section className="bg-white px-5 py-20 dark:bg-[#090d1a] sm:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 dark:border-indigo-400/10 dark:from-[#141c34] dark:to-[#211634] sm:p-12">

          <div className="grid items-center gap-10 md:grid-cols-2">

            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Built for Everyone
              </span>

              <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
                Make Your First Impression Count.
              </h2>

              <p className="mt-5 leading-8 text-gray-600 dark:text-gray-300">
                Whether you are a student, fresher or experienced
                professional, create a resume that highlights your skills,
                achievements and career journey.
              </p>

              <Link
                to="/register"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
              >
                Start Building <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                <GraduationCap size={30} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="mt-5 font-bold">Students</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  Showcase education, skills and projects.
                </p>
              </div>

              <div className="rounded-2xl border border-white bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                <BriefcaseBusiness size={30} className="text-purple-600 dark:text-purple-400" />
                <h3 className="mt-5 font-bold">Professionals</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  Highlight experience and achievements.
                </p>
              </div>

              <div className="rounded-2xl border border-white bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                <Code2 size={30} className="text-blue-600 dark:text-blue-400" />
                <h3 className="mt-5 font-bold">Developers</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  Showcase technical skills and projects.
                </p>
              </div>

              <div className="rounded-2xl border border-white bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                <WandSparkles size={30} className="text-amber-600 dark:text-amber-400" />
                <h3 className="mt-5 font-bold">Freshers</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  Create your first professional resume.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="px-5 py-20 dark:bg-[#090d1a] sm:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 px-7 py-16 text-center text-white shadow-2xl shadow-indigo-900/20 sm:px-16">

          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full border-[40px] border-white/10" />
          <div className="absolute -bottom-32 -right-16 h-80 w-80 rounded-full border-[50px] border-white/10" />

          <div className="relative">
            <Sparkles size={35} className="mx-auto mb-6 text-indigo-200" />

            <h2 className="text-3xl font-extrabold sm:text-5xl">
              Ready to Build Your Resume?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-indigo-100">
              Take the next step in your career. Create your professional
              resume and get ready for new opportunities.
            </p>

            <Link
              to="/register"
              className="mt-9 inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 font-bold text-indigo-700 shadow-lg transition hover:-translate-y-1 hover:bg-indigo-50"
            >
              Create Your Free Resume
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-gray-50 px-5 py-10 dark:border-white/10 dark:bg-[#0d1425] sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">

          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-lg bg-indigo-600 p-2 text-white">
              <FileText size={20} />
            </div>

            <span className="text-xl font-extrabold">
              Resume<span className="text-indigo-600">Craft</span>
            </span>
          </Link>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} ResumeCraft. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Login
            </Link>

            <Link to="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Register
            </Link>

            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Features
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
