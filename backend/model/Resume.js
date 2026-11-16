
import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      default: "Untitled Resume",
      trim: true,
    },

    personalInfo: {
      fullName: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      website: { type: String, default: "" },
    },

    summary: {
      type: String,
      default: "",
    },

    education: [
      {
        institution: {
          type: String,
          default: "",
        },
        degree: {
          type: String,
          default: "",
        },
        startDate: {
          type: String,
          default: "",
        },
        endDate: {
          type: String,
          default: "",
        },
        gradeType: {
          type: String,
          enum: ["CGPA", "SGPA", "Percentage"],
          default: "CGPA",
        },
        grade: {
          type: String,
          default: "",
        },
      },
    ],

    experience: {
      type: [
        {
          company: { type: String, default: "" },
          position: { type: String, default: "" },
          startDate: { type: String, default: "" },
          endDate: { type: String, default: "" },
          description: { type: String, default: "" },
        },
      ],
      default: [],
    },

    projects: {
      type: [
        {
          name: { type: String, default: "" },
          technologies: { type: String, default: "" },
          description: { type: String, default: "" },
          link: { type: String, default: "" },
        },
      ],
      default: [],
    },


    skills: [
      {
        category: {
          type: String,
          trim: true,
          default: "",
        },
        items: {
          type: [String],
          default: [],
        },
      },
    ],


    gradeType: {
      type: String,
      enum: ["CGPA", "SGPA", "Percentage"],
      default: "CGPA"
    },
    grade: {
      type: String,
      default: ""
    },

    languages: {
      type: [String],
      default: [],
    },

    certifications: {
      type: [
        {
          name: { type: String, default: "" },
          issuer: { type: String, default: "" },
          issueDate: { type: String, default: "" },
          credentialId: { type: String, default: "" },
          credentialUrl: { type: String, default: "" },
        },
      ],
      default: [],
    },

    achievements: {
      type: [
        {
          title: { type: String, default: "" },
          organization: { type: String, default: "" },
          date: { type: String, default: "" },
          description: { type: String, default: "" },
        },
      ],
      default: [],
    },

    template: {
  type: String,
  enum: ["modern", "professional", "minimal", "creative"],
  default: "modern",
},
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
