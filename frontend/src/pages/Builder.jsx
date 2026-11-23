
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import AIAssistant from "../components/AIAssistant";

import {
  FileText,
  ArrowLeft,
  Save,
  Award,
  Plus,
  Trash2,
  Moon,
  Sun,
  User,
  GraduationCap,
  BriefcaseBusiness,
  FolderKanban,
  FileUser,
  LoaderCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const initialForm = {
  title: "My Professional Resume",
  template: "modern",

  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    github: "",
    website: "",
  },

  summary: "",

  education: [
    {
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
      gradeType: "CGPA",
      grade: "",
    },
  ],

  experience: [
    {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ],

  projects: [
    {
      name: "",
      technologies: "",
      description: "",
      link: "",
    },
  ],

  skills: [
    {
      category: "",
      items: [],
    },
  ],

  languages: [],

  certifications: [
    {
      name: "",
      issuer: "",
      issueDate: "",
      credentialId: "",
      credentialUrl: "",
    },
  ],

  achievements: [
    {
      title: "",
      organization: "",
      date: "",
      description: "",
    },
  ],
};

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-[#090d1a]";

const cardClass =
  "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#11182a] sm:p-8";

export default function Builder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme, toggleTheme } = useTheme();

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState(initialForm);

  const [skillInput, setSkillInput] = useState({});
  const [languageInput, setLanguageInput] = useState("");

  const [educationInput, setEducationInput] = useState("");
  const [educationLoading, setEducationLoading] = useState(false);

  const [experienceAiLoading, setExperienceAiLoading] = useState({});
const [experienceResponsibilities, setExperienceResponsibilities] =
  useState({});

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(Boolean(id));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Change resume template
  const handleTemplateChange = (templateId) => {
    setFormData((prev) => ({
      ...prev,
      template: templateId,
    }));
  };

  // Apply AI-generated professional summary
  const applySummary = (value) => {
    setFormData((prev) => ({
      ...prev,
      summary: value,
    }));
  };

  // Apply AI-suggested skills
  const applySkills = (value) => {
    const suggestedSkills = value
      .split(/[\n,;•]+/)
      .map((skill) =>
        skill.replace(/^[\s\-*•\d.)]+/, "").trim()
      )
      .filter(Boolean);

    setFormData((prev) => {
      const groups = prev.skills?.length
        ? prev.skills
        : [{ category: "", items: [] }];

      const existingSkills = groups.flatMap(
        (group) => group.items || []
      );

      const newSkills = suggestedSkills.filter(
        (skill) =>
          !existingSkills.some(
            (existing) =>
              existing.toLowerCase() === skill.toLowerCase()
          )
      );

      if (newSkills.length === 0) return prev;

      return {
        ...prev,
        skills: groups.map((group, index) =>
          index === 0
            ? {
                ...group,
                items: [
                  ...(group.items || []),
                  ...newSkills,
                ],
              }
            : group
        ),
      };
    });
  };

  // Generate and apply AI education details
  const generateEducation = async () => {
    if (!educationInput.trim()) {
      setError("Please enter your education details first.");
      return;
    }

    try {
      setEducationLoading(true);
      setError("");
      setMessage("");

      const response = await axios.post(
        `${API_URL}/ai/generate`,
        {
          task: "education",
          content: educationInput,
          tone: "professional",
          instruction:
            "Extract my education details into institution, degree, startDate, endDate, gradeType, and grade. Do not include field of study as a separate field. Do not invent missing information. Return empty strings for information that is not provided.",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const education = response.data.result;

      if (
        !education ||
        typeof education !== "object" ||
        !education.institution
      ) {
        throw new Error(
          "AI could not identify the institution. Please provide clearer details."
        );
      }

      const newEducation = {
        institution: education.institution || "",
        degree: education.degree || "",
        startDate: education.startDate || "",
        endDate: education.endDate || "",
        gradeType: education.gradeType || "CGPA",
        grade: education.grade || "",
      };

      setFormData((prev) => {
        const currentEducation = prev.education || [];

        const emptyIndex = currentEducation.findIndex(
          (item) =>
            !item.institution &&
            !item.degree &&
            !item.startDate &&
            !item.endDate &&
            !item.grade
        );

        if (emptyIndex !== -1) {
          return {
            ...prev,
            education: currentEducation.map((item, index) =>
              index === emptyIndex ? newEducation : item
            ),
          };
        }

        return {
          ...prev,
          education: [
            ...currentEducation,
            newEducation,
          ],
        };
      });

      setEducationInput("");
      setMessage("Education details generated successfully!");
    } catch (err) {
      console.error("Education AI error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to generate education details."
      );
    } finally {
      setEducationLoading(false);
    }
  };

  // Update top-level fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update personal information
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value,
      },
    }));
  };

  // Update array section fields
  const handleArrayChange = (section, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index
          ? { ...item, [field]: value }
          : item
      ),
    }));
  };

  // Add a new item to a section
  const addItem = (section, emptyItem) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [
        ...prev[section],
        { ...emptyItem },
      ],
    }));
  };

  // Remove an item from any section
  const removeItem = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter(
        (_, i) => i !== index
      ),
    }));
  };

  // Add another skill group
  const addSkillCategory = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          category: "",
          items: [],
        },
      ],
    }));
  };

  // Update skill category
  const updateSkillCategory = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.map((group, i) =>
        i === index
          ? { ...group, category: value }
          : group
      ),
    }));
  };

  // Delete skill group
  const removeSkillCategory = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter(
        (_, i) => i !== index
      ),
    }));

    setSkillInput((prev) => {
      const updated = {};

      Object.keys(prev).forEach((key) => {
        const oldIndex = Number(key);

        if (oldIndex < index) {
          updated[oldIndex] = prev[key];
        } else if (oldIndex > index) {
          updated[oldIndex - 1] = prev[key];
        }
      });

      return updated;
    });
  };

  // Add skill
  const addSkillToCategory = (index) => {
    const skill = (skillInput[index] || "").trim();

    if (!skill) return;

    const exists = formData.skills[index]?.items.some(
      (item) => item.toLowerCase() === skill.toLowerCase()
    );

    if (exists) {
      setError("This skill already exists.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.map((group, i) =>
        i === index
          ? {
              ...group,
              items: [...group.items, skill],
            }
          : group
      ),
    }));

    setSkillInput((prev) => ({
      ...prev,
      [index]: "",
    }));

    setError("");
  };

  // Remove individual skill
  const removeSkillFromCategory = (
    categoryIndex,
    skillIndex
  ) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.map((group, i) =>
        i === categoryIndex
          ? {
              ...group,
              items: group.items.filter(
                (_, j) => j !== skillIndex
              ),
            }
          : group
      ),
    }));
  };

  // Add a language
  const addLanguage = () => {
    const language = languageInput.trim();

    if (!language) return;

    const exists = formData.languages.some(
      (item) =>
        item.toLowerCase() === language.toLowerCase()
    );

    if (exists) {
      setError("This language has already been added.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      languages: [...prev.languages, language],
    }));

    setLanguageInput("");
    setError("");
  };

  // Fetch existing resume
  const fetchResume = async () => {
    try {
      setFetching(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/resumes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resume = response.data.resume || response.data;

      let normalizedSkills = [];

      if (Array.isArray(resume.skills)) {
        if (
          resume.skills.length > 0 &&
          typeof resume.skills[0] === "string"
        ) {
          normalizedSkills = [
            {
              category: "Technologies",
              items: resume.skills,
            },
          ];
        } else {
          normalizedSkills = resume.skills.map((group) => ({
            category: group.category || "",
            items: Array.isArray(group.items)
              ? group.items
              : [],
          }));
        }
      } else {
        normalizedSkills = initialForm.skills;
      }

      setFormData({
        ...initialForm,
        ...resume,

        personalInfo: {
          ...initialForm.personalInfo,
          ...(resume.personalInfo || {}),
        },

        education: resume.education?.length
          ? resume.education.map((item) => ({
              institution: item.institution || "",
              degree: item.degree || "",
              startDate: item.startDate || "",
              endDate: item.endDate || "",
              gradeType: item.gradeType || "CGPA",
              grade: item.grade || item.SGPA || "",
            }))
          : initialForm.education,

        experience: resume.experience?.length
          ? resume.experience
          : initialForm.experience,

        projects: resume.projects?.length
          ? resume.projects
          : initialForm.projects,

        skills: normalizedSkills,

        languages: resume.languages || [],

        certifications: resume.certifications?.length
          ? resume.certifications
          : initialForm.certifications,

        achievements: resume.achievements?.length
          ? resume.achievements
          : initialForm.achievements,
      });
    } catch (err) {
      console.error("Fetch resume error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load this resume."
      );
    } finally {
      setFetching(false);
    }
  };

  // Redirect unauthenticated users and load resume
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (id) {
      fetchResume();
    } else {
      setFetching(false);
    }
  }, [id, token, navigate]);

  // Save resume
  const handleSave = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const dataToSave = {
        ...formData,
        template: formData.template || "modern",

        education: formData.education.map(
          ({
            institution,
            degree,
            startDate,
            endDate,
            gradeType,
            grade,
          }) => ({
            institution,
            degree,
            startDate,
            endDate,
            gradeType,
            grade,
          })
        ),

        skills: formData.skills.map((group) => ({
          category: group.category,
          items: group.items,
        })),
      };

      let response;

      if (id) {
        response = await axios.put(
          `${API_URL}/resumes/${id}`,
          dataToSave,
          config
        );
      } else {
        response = await axios.post(
          `${API_URL}/resumes`,
          dataToSave,
          config
        );
      }

      const savedResume =
        response.data.resume || response.data;

      if (!id && savedResume._id) {
        navigate(`/builder/${savedResume._id}`, {
          replace: true,
        });
      }

      setMessage("Resume saved successfully!");
    } catch (err) {
      console.error("Save resume error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save your resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  // Generate a professional work experience description with AI.
  const handleGenerateExperience = async (index) => {
    const item = formData.experience[index];
    const responsibilities = experienceResponsibilities[index] || "";

    if (!item.company?.trim() || !item.position?.trim()) {
      setError("Please enter the company name and job title first.");
      return;
    }

    if (!responsibilities.trim()) {
      setError("Please enter your responsibilities or tasks first.");
      return;
    }

    try {
      setExperienceAiLoading((prev) => ({ ...prev, [index]: true }));
      setError("");
      setMessage("");

      const response = await axios.post(
        `${API_URL}/ai/generate`,
        {
          task: "experience",
          content: JSON.stringify({
            company: item.company,
            position: item.position,
            startDate: item.startDate,
            endDate: item.endDate || "Present",
            responsibilities,
          }),
          tone: "professional",
          instruction:
            "Write a concise, professional resume work experience description using only the supplied information. Improve grammar and wording. Do not invent responsibilities, technologies, achievements, outcomes, or metrics. Return only the description as plain text.",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const generatedDescription = response.data?.result;

      if (typeof generatedDescription !== "string" || !generatedDescription.trim()) {
        throw new Error("AI did not return a valid experience description.");
      }

      handleArrayChange(
        "experience",
        index,
        "description",
        generatedDescription.trim()
      );
      setMessage("Experience description generated. Review it before saving.");
    } catch (err) {
      console.error("Experience AI error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to generate experience description."
      );
    } finally {
      setExperienceAiLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#090d1a]">
        <LoaderCircle
          className="animate-spin text-indigo-600"
          size={40}
        />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#090d1a] dark:text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#090d1a]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            to="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="rounded-xl bg-indigo-600 p-2.5 text-white">
              <FileText size={22} />
            </div>

            <span className="text-xl font-extrabold">
              Resume<span className="text-indigo-600">Craft</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xl border border-gray-200 p-2.5 dark:border-white/10"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon size={19} />
              ) : (
                <Sun size={19} />
              )}
            </button>

            <Link
              to="/dashboard"
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold hover:border-indigo-500 dark:border-white/10"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">
                Dashboard
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            <FileUser size={18} />
            Resume Editor
          </div>

          <h1 className="text-3xl font-extrabold sm:text-4xl">
            {id ? "Edit Your Resume" : "Create Your Resume"}
          </h1>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Fill in your details to create a professional resume.
          </p>
        </div>

        {/* STATUS */}
        {message && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
            <CheckCircle2 size={18} />
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-2">
          {/* LEFT SIDE - FORM */}
          <div className="min-w-0">
            <form
              onSubmit={handleSave}
              className="space-y-8"
            >
              <TemplateSelector
                selectedTemplate={formData.template}
                onSelect={handleTemplateChange}
              />

              {/* RESUME TITLE */}
              <section className={cardClass}>
                <h2 className="mb-5 text-xl font-bold">
                  Resume Title
                </h2>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Software Developer Resume"
                  className={inputClass}
                  required
                />
              </section>

              {/* PERSONAL INFORMATION */}
              <section className={cardClass}>
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                    <User size={23} />
                  </div>

                  <h2 className="text-xl font-bold">
                    Personal Information
                  </h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {[
                    ["fullName", "Full Name", "Enter your full name"],
                    ["email", "Email Address", "Enter your email"],
                    ["phone", "Phone Number", "Enter your phone number"],
                    ["address", "Address", "City, State, Country"],
                    ["linkedin", "LinkedIn Profile", "LinkedIn URL"],
                    ["github", "GitHub Profile", "GitHub URL"],
                    ["website", "Portfolio Website", "Website URL"],
                  ].map(([name, label, placeholder]) => (
                    <div key={name}>
                      <label className="mb-2 block text-sm font-semibold">
                        {label}
                      </label>

                      <input
                        type="text"
                        name={name}
                        value={formData.personalInfo[name]}
                        onChange={handlePersonalChange}
                        placeholder={placeholder}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* AI RESUME ASSISTANT */}
              <AIAssistant
                resumeData={formData}
                onApplySummary={applySummary}
                onApplySkills={applySkills}
              />

              {/* PROFESSIONAL SUMMARY */}
              <section className={cardClass}>
                <h2 className="mb-5 text-xl font-bold">
                  Professional Summary
                </h2>

                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Write a short professional introduction about yourself..."
                  className={`${inputClass} resize-y leading-7`}
                />
              </section>

              {/* EDUCATION */}
              <section className={cardClass}>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400">
                      <GraduationCap size={23} />
                    </div>

                    <h2 className="text-xl font-bold">
                      Education
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      addItem("education", {
                        institution: "",
                        degree: "",
                        startDate: "",
                        endDate: "",
                        gradeType: "CGPA",
                        grade: "",
                      })
                    }
                    className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                  >
                    <Plus size={16} />
                    Add Education
                  </button>
                </div>

                {/* AI EDUCATION ASSISTANT */}
                <div className="mb-7 rounded-xl border border-purple-200 bg-purple-50/50 p-5 dark:border-purple-500/20 dark:bg-purple-500/5">
                  <div className="mb-4 flex items-center gap-2">
                    <Award
                      size={21}
                      className="text-purple-600 dark:text-purple-400"
                    />

                    <h3 className="font-bold">
                      AI Education Assistant
                    </h3>
                  </div>

                  <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                    Enter your school or college name, degree,
                    study years, and academic marks. AI will
                    organize them into your Education section.
                  </p>

                  <textarea
                    value={educationInput}
                    onChange={(e) =>
                      setEducationInput(e.target.value)
                    }
                    rows={4}
                    placeholder={`Example:
Swami Vivekananda University
B.Tech in Computer Science
2023 - 2027
CGPA: 8.71`}
                    className={`${inputClass} resize-y leading-7`}
                  />

                  <button
                    type="button"
                    onClick={generateEducation}
                    disabled={educationLoading}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 font-bold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {educationLoading ? (
                      <>
                        <LoaderCircle
                          size={19}
                          className="animate-spin"
                        />
                        AI is extracting education...
                      </>
                    ) : (
                      <>
                        <Award size={19} />
                        Generate Education with AI
                      </>
                    )}
                  </button>
                </div>

                {/* EDUCATION FORM ENTRIES */}
                {formData.education.map((item, index) => (
                  <div
                    key={index}
                    className="mb-6 rounded-xl border border-gray-200 p-5 last:mb-0 dark:border-white/10"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className="font-bold">
                        Education #{index + 1}
                      </h3>

                      {formData.education.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeItem("education", index)
                          }
                          className="text-red-500 hover:text-red-700"
                          aria-label="Remove education"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        ["institution", "Institution", "School or university name"],
                        ["degree", "Degree / Qualification", "B.Tech, Higher Secondary, etc."],
                      ].map(([field, label, placeholder]) => (
                        <div key={field}>
                          <label className="mb-2 block text-sm font-semibold">
                            {label}
                          </label>

                          <input
                            type="text"
                            value={item[field] || ""}
                            onChange={(e) =>
                              handleArrayChange(
                                "education",
                                index,
                                field,
                                e.target.value
                              )
                            }
                            placeholder={placeholder}
                            className={inputClass}
                          />
                        </div>
                      ))}

                      {["startDate", "endDate"].map((field) => (
                        <div key={field}>
                          <label className="mb-2 block text-sm font-semibold">
                            {field === "startDate"
                              ? "Start Year"
                              : "End Year"}
                          </label>

                          <input
                            type="text"
                            value={item[field] || ""}
                            onChange={(e) =>
                              handleArrayChange(
                                "education",
                                index,
                                field,
                                e.target.value
                              )
                            }
                            placeholder={
                              field === "startDate"
                                ? "e.g. 2023"
                                : "e.g. 2027 or Present"
                            }
                            className={inputClass}
                          />
                        </div>
                      ))}

                      <div>
                        <label className="mb-2 block text-sm font-semibold">
                          Grade Type
                        </label>

                        <select
                          value={item.gradeType || "CGPA"}
                          onChange={(e) =>
                            handleArrayChange(
                              "education",
                              index,
                              "gradeType",
                              e.target.value
                            )
                          }
                          className={inputClass}
                        >
                          <option value="CGPA">CGPA</option>
                          <option value="SGPA">SGPA</option>
                          <option value="Percentage">Percentage</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold">
                          Grade Value
                        </label>

                        <input
                          type="text"
                          value={item.grade || ""}
                          onChange={(e) =>
                            handleArrayChange(
                              "education",
                              index,
                              "grade",
                              e.target.value
                            )
                          }
                          placeholder="e.g. 8.71 or 78.89"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* TECHNICAL SKILLS */}
              <section className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Technical Skills
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Add a title and skill names if needed.
                  </p>
                </div>

                {formData.skills.map((group, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 p-5 dark:border-white/10"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        Skill Group {index + 1}
                      </h3>

                      {formData.skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeSkillCategory(index)
                          }
                          className="flex items-center gap-1 text-sm text-red-500"
                        >
                          <Trash2 size={16} />
                          Delete Group
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={group.category}
                      onChange={(e) =>
                        updateSkillCategory(
                          index,
                          e.target.value
                        )
                      }
                      placeholder="Add title (optional), e.g. Technologies"
                      className={inputClass}
                    />

                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <input
                        type="text"
                        value={skillInput[index] || ""}
                        onChange={(e) =>
                          setSkillInput((prev) => ({
                            ...prev,
                            [index]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkillToCategory(index);
                          }
                        }}
                        placeholder="Enter skill name, e.g. Java"
                        className={inputClass}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          addSkillToCategory(index)
                        }
                        className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                      >
                        + Add Skill
                      </button>
                    </div>

                    {group.items.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {group.items.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                          >
                            {skill}

                            <button
                              type="button"
                              onClick={() =>
                                removeSkillFromCategory(
                                  index,
                                  skillIndex
                                )
                              }
                              className="font-bold text-red-500"
                              aria-label={`Remove ${skill}`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addSkillCategory}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-400 px-4 py-4 font-semibold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                >
                  <Plus size={18} />
                  Add Another Skill Group
                </button>
              </section>

              {/* WORK EXPERIENCE */}
              <section className={cardClass}>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                      <BriefcaseBusiness size={23} />
                    </div>

                    <h2 className="text-xl font-bold">
                      Work Experience
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      addItem("experience", {
                        company: "",
                        position: "",
                        startDate: "",
                        endDate: "",
                        description: "",
                      })
                    }
                    className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                  >
                    <Plus size={16} />
                    Add Experience
                  </button>
                </div>

                {formData.experience.map((item, index) => (
                  <div
                    key={index}
                    className="mb-6 rounded-xl border border-gray-200 p-5 last:mb-0 dark:border-white/10"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className="font-bold">
                        Experience #{index + 1}
                      </h3>
                      {formData.experience.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeItem("experience", index)
                          }
                          className="text-red-500"
                          aria-label="Remove experience"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>

                    

                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        ["company", "Company", "Company name"],
                        ["position", "Job Title", "Software Developer"],
                      ].map(([field, label, placeholder]) => (
                        <div key={field}>
                          <label className="mb-2 block text-sm font-semibold">
                            {label}
                          </label>

                          <input
                            value={item[field] || ""}
                            onChange={(e) =>
                              handleArrayChange(
                                "experience",
                                index,
                                field,
                                e.target.value
                              )
                            }
                            placeholder={placeholder}
                            className={inputClass}
                          />
                        </div>
                      ))}

                      

                      {["startDate", "endDate"].map((field) => (
                        <div key={field}>
                          <label className="mb-2 block text-sm font-semibold">
                            {field === "startDate"
                              ? "Start Date"
                              : "End Date"}
                          </label>

                          <input
                            type="month"
                            value={item[field] || ""}
                            onChange={(e) =>
                              handleArrayChange(
                                "experience",
                                index,
                                field,
                                e.target.value
                              )
                            }
                            className={inputClass}
                          />
                        </div>
                      ))}

                      <div className="sm:col-span-2">
                        <label className="mb-2 block text-sm font-semibold">
                          Responsibilities / Tasks for AI
                        </label>

                        <textarea
                          rows="4"
                          value={experienceResponsibilities[index] || ""}
                          onChange={(e) =>
                            setExperienceResponsibilities((prev) => ({
                              ...prev,
                              [index]: e.target.value,
                            }))
                          }
                          placeholder="Enter the tasks you actually performed. For example: Developed React components, fixed UI bugs, integrated REST APIs..."
                          className={`${inputClass} leading-7`}
                        />

                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          Enter real responsibilities. AI will improve the wording without adding unprovided achievements or skills.
                        </p>

                        <button
                          type="button"
                          onClick={() => handleGenerateExperience(index)}
                          disabled={Boolean(experienceAiLoading[index])}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {experienceAiLoading[index] ? (
                            <>
                              <LoaderCircle size={18} className="animate-spin" />
                              Generating Description...
                            </>
                          ) : (
                            <>
                              <Sparkles size={18} />
                              Generate Description with AI
                            </>
                          )}
                        </button>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-2 block text-sm font-semibold">
                          Professional Description (Editable)
                        </label>

                        <textarea
                          rows="5"
                          value={item.description || ""}
                          onChange={(e) =>
                            handleArrayChange(
                              "experience",
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Your professional experience description will appear here. You can edit it before saving."
                          className={`${inputClass} leading-7`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* PROJECTS */}
              <section className={cardClass}>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-amber-100 p-3 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
                      <FolderKanban size={23} />
                    </div>

                    <h2 className="text-xl font-bold">
                      Projects
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      addItem("projects", {
                        name: "",
                        technologies: "",
                        description: "",
                        link: "",
                      })
                    }
                    className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                  >
                    <Plus size={16} />
                    Add Project
                  </button>
                </div>

                {formData.projects.map((item, index) => (
                  <div
                    key={index}
                    className="mb-6 rounded-xl border border-gray-200 p-5 last:mb-0 dark:border-white/10"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className="font-bold">
                        Project #{index + 1}
                      </h3>

                      {formData.projects.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeItem("projects", index)
                          }
                          className="text-red-500"
                          aria-label="Remove project"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {[
                        ["name", "Project Name", "Enter project name"],
                        ["technologies", "Technologies", "React, Node.js, MongoDB"],
                        ["link", "Project Link", "GitHub or live project URL"],
                      ].map(([field, label, placeholder]) => (
                        <div key={field}>
                          <label className="mb-2 block text-sm font-semibold">
                            {label}
                          </label>

                          <input
                            value={item[field] || ""}
                            onChange={(e) =>
                              handleArrayChange(
                                "projects",
                                index,
                                field,
                                e.target.value
                              )
                            }
                            placeholder={placeholder}
                            className={inputClass}
                          />
                        </div>
                      ))}

                      <div>
                        <label className="mb-2 block text-sm font-semibold">
                          Project Description
                        </label>

                        <textarea
                          rows="3"
                          value={item.description || ""}
                          onChange={(e) =>
                            handleArrayChange(
                              "projects",
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Explain what your project does..."
                          className={`${inputClass} leading-7`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* CERTIFICATIONS */}
              <section className={cardClass}>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400">
                      <Award size={23} />
                    </div>

                    <h2 className="text-xl font-bold">
                      Certifications
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      addItem("certifications", {
                        name: "",
                        issuer: "",
                        issueDate: "",
                        credentialId: "",
                        credentialUrl: "",
                      })
                    }
                    className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                  >
                    <Plus size={16} />
                    Add Certification
                  </button>
                </div>

                {formData.certifications.map((item, index) => (
                  <div
                    key={index}
                    className="mb-6 rounded-xl border border-gray-200 p-5 last:mb-0 dark:border-white/10"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className="font-bold">
                        Certification #{index + 1}
                      </h3>

                      {formData.certifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeItem("certifications", index)
                          }
                          className="text-red-500 hover:text-red-700"
                          aria-label="Remove certification"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        ["name", "Certificate Name", "e.g. Programming in Java"],
                        ["issuer", "Issuing Organization", "e.g. NPTEL"],
                        ["issueDate", "Issue Date", "e.g. October 2025"],
                        ["credentialId", "Credential ID", "Certificate ID"],
                        ["credentialUrl", "Credential URL", "Verification URL"],
                      ].map(([field, label, placeholder]) => (
                        <div
                          key={field}
                          className={
                            field === "credentialUrl"
                              ? "sm:col-span-2"
                              : ""
                          }
                        >
                          <label className="mb-2 block text-sm font-semibold">
                            {label}
                          </label>

                          <input
                            type="text"
                            value={item[field] || ""}
                            onChange={(e) =>
                              handleArrayChange(
                                "certifications",
                                index,
                                field,
                                e.target.value
                              )
                            }
                            placeholder={placeholder}
                            className={inputClass}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>

              {/* ACHIEVEMENTS */}
              <section className={cardClass}>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-amber-100 p-3 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
                      <Award size={23} />
                    </div>

                    <h2 className="text-xl font-bold">
                      Achievements
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      addItem("achievements", {
                        title: "",
                        organization: "",
                        date: "",
                        description: "",
                      })
                    }
                    className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                  >
                    <Plus size={16} />
                    Add Achievement
                  </button>
                </div>

                {formData.achievements.map((item, index) => (
                  <div
                    key={index}
                    className="mb-6 rounded-xl border border-gray-200 p-5 last:mb-0 dark:border-white/10"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className="font-bold">
                        Achievement #{index + 1}
                      </h3>

                      {formData.achievements.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeItem("achievements", index)
                          }
                          className="text-red-500 hover:text-red-700"
                          aria-label="Remove achievement"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        ["title", "Achievement Title", "e.g. Solved 800+ coding problems"],
                        ["organization", "Organization / Platform", "e.g. GeeksforGeeks"],
                        ["date", "Date", "e.g. November 2026"],
                      ].map(([field, label, placeholder]) => (
                        <div key={field}>
                          <label className="mb-2 block text-sm font-semibold">
                            {label}
                          </label>

                          <input
                            type="text"
                            value={item[field] || ""}
                            onChange={(e) =>
                              handleArrayChange(
                                "achievements",
                                index,
                                field,
                                e.target.value
                              )
                            }
                            placeholder={placeholder}
                            className={inputClass}
                          />
                        </div>
                      ))}

                      <div className="sm:col-span-2">
                        <label className="mb-2 block text-sm font-semibold">
                          Description
                        </label>

                        <textarea
                          rows="3"
                          value={item.description || ""}
                          onChange={(e) =>
                            handleArrayChange(
                              "achievements",
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Describe your achievement..."
                          className={`${inputClass} leading-7`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* LANGUAGES */}
              <section className={cardClass}>
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                    <FileText size={23} />
                  </div>

                  <h2 className="text-xl font-bold">
                    Languages
                  </h2>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={languageInput}
                    onChange={(e) =>
                      setLanguageInput(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addLanguage();
                      }
                    }}
                    placeholder="e.g. English, Bengali, Hindi"
                    className={`min-w-0 flex-1 ${inputClass}`}
                  />

                  <button
                    type="button"
                    onClick={addLanguage}
                    className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                  >
                    <Plus size={18} />
                    Add Language
                  </button>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {formData.languages.map((language, index) => (
                    <span
                      key={`${language}-${index}`}
                      className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                    >
                      {language}

                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            languages: prev.languages.filter(
                              (_, i) => i !== index
                            ),
                          }))
                        }
                        className="hover:text-red-500"
                        aria-label={`Remove ${language}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {formData.languages.length === 0 && (
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    No languages added yet.
                  </p>
                )}
              </section>

              {/* SAVE BUTTON */}
              <div className="flex flex-col justify-between gap-4 border-t border-gray-200 pt-6 dark:border-white/10 sm:flex-row sm:items-center">
                <Link
                  to="/dashboard"
                  className="text-center text-sm font-semibold text-gray-600 hover:text-indigo-600 dark:text-gray-400"
                >
                  Cancel and return to Dashboard
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-1 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <LoaderCircle
                        size={19}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={19} />
                      Save Resume
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT SIDE - LIVE PREVIEW */}
          <div className="min-w-0 xl:sticky xl:top-24">
            <ResumePreview data={formData} />
          </div>
        </div>
      </main>
    </div>
  );
}


