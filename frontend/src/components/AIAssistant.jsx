
import { useState } from "react";
import { Sparkles, Copy, Check, WandSparkles } from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AIAssistant({
  resumeData,
  onApplySummary,
}) {
  const [content, setContent] = useState(resumeData?.summary || "");
  const [instruction, setInstruction] = useState(
    "Correct my professional summary. Make it attractive, professional, concise and ATS-friendly. Preserve my actual skills and experience."
  );

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!content.trim()) {
      setError("Please write or paste your content first.");
      return;
    }

    if (!instruction.trim()) {
      setError("Please enter an instruction for AI.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first.");
      }

      const response = await fetch(`${API_URL}/ai/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          task: "summary",
          content,
          instruction,
          tone: "professional",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "AI generation failed.");
      }

      setResult(data.result || "");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!result.trim()) return;

    onApplySummary?.(result);
    setContent(result);
    setResult("");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
  };

  return (
    <section className="mb-8 overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#11182a]">

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/20 p-3">
            <Sparkles size={25} />
          </div>

          <div>
            <h2 className="text-xl font-bold">
              AI Resume Writing Assistant
            </h2>
            <p className="mt-1 text-sm text-purple-100">
              Write, instruct and improve your resume with AI.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-6">

        {/* Original Content */}
        <div>
          <label className="mb-2 block text-sm font-bold">
            Your Original Content
          </label>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            placeholder="Write or paste your professional summary here..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-7 outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-[#090d1a]"
          />
        </div>

        {/* AI Instruction */}
        <div>
          <label className="mb-2 block text-sm font-bold">
            Tell AI What You Want
          </label>

          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            rows={3}
            placeholder="Example: Correct my summary and make it professional and ATS-friendly..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-7 outline-none focus:border-purple-500 dark:border-white/10 dark:bg-[#090d1a]"
          />

          <p className="mt-2 text-xs text-gray-500">
            You can give any specific instruction to AI.
          </p>
        </div>

        {/* Generate */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 font-bold text-white hover:opacity-90 disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              AI is writing...
            </>
          ) : (
            <>
              <WandSparkles size={19} />
              Generate with AI
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-4 rounded-xl border border-green-200 bg-green-50/50 p-5 dark:border-green-500/20 dark:bg-green-500/5">

            <div className="flex items-center gap-2 font-bold text-green-700 dark:text-green-400">
              <Sparkles size={19} />
              AI Improved Content
            </div>

            <textarea
              value={result}
              onChange={(e) => setResult(e.target.value)}
              rows={6}
              className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm leading-7 outline-none focus:border-green-500 dark:border-white/10 dark:bg-[#090d1a]"
            />

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleApply}
                className="rounded-lg bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-700"
              >
                Apply to Resume
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold dark:border-white/10"
              >
                {copied ? <Check size={17} /> : <Copy size={17} />}
                {copied ? "Copied" : "Copy"}
              </button>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="rounded-lg border border-indigo-300 px-4 py-3 text-sm font-semibold text-indigo-600 dark:text-indigo-400"
              >
                Regenerate
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
