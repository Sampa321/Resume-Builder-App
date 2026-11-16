
import { generateResumeText } from "../services/aiService.js";

export const generateAIContent = async (req, res) => {
  try {
    const { task, content, tone, instruction } = req.body;

    const allowedTasks = [
      "summary",
      "improve",
      "skills",
      "education",
    ];

    const allowedTones = [
      "concise",
      "professional",
      "detailed",
    ];

    // Validate task
    if (!allowedTasks.includes(task)) {
      return res.status(400).json({
        message: "Invalid AI task.",
      });
    }

    // Validate content
    if (
      !content ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        message: "Please provide resume content.",
      });
    }

    if (content.length > 5000) {
      return res.status(400).json({
        message: "Resume content must not exceed 5000 characters.",
      });
    }

    // Validate instruction
    if (
      instruction !== undefined &&
      typeof instruction !== "string"
    ) {
      return res.status(400).json({
        message: "Invalid AI instruction.",
      });
    }

    if (instruction && instruction.length > 1000) {
      return res.status(400).json({
        message: "Instruction must not exceed 1000 characters.",
      });
    }

    // Validate tone
    const selectedTone = tone || "professional";

    if (!allowedTones.includes(selectedTone)) {
      return res.status(400).json({
        message: "Invalid writing tone.",
      });
    }

    // Generate AI content
    const result = await generateResumeText({
      task,
      content: content.trim(),
      tone: selectedTone,
      instruction: instruction?.trim() || "",
    });

    // Parse Education JSON
    if (task === "education") {
      let education;

      try {
        education = JSON.parse(result);
      } catch {
        return res.status(502).json({
          success: false,
          message: "AI returned invalid education data. Please try again.",
        });
      }

      const requiredFields = [
        "institution",
        "degree",
        "field",
        "startDate",
        "endDate",
        "gradeType",
        "grade",
      ];

      const validEducation =
        education &&
        typeof education === "object" &&
        !Array.isArray(education) &&
        requiredFields.every(
          (field) =>
            typeof education[field] === "string"
        ) &&
        ["", "CGPA", "SGPA", "Percentage"].includes(
          education.gradeType
        );

      if (!validEducation) {
        return res.status(502).json({
          success: false,
          message: "AI returned an invalid education structure.",
        });
      }

      return res.status(200).json({
        success: true,
        result: education,
      });
    }

    // Normal text response for other tasks
    return res.status(200).json({
      success: true,
      result,
    });

  } catch (error) {
    console.error("AI generation error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to generate content. Please try again.",
    });
  }
};
