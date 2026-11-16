import { resumeTemplates } from "../constants/resumeTemplates";

import React, { useState } from "react";
import html2pdf from "html2pdf.js";

const SectionTitle = ({ children, template }) => {
  const color = template?.primaryColor || "#23416b";
  const style = template?.headingStyle || "bordered";

  return (
    <h2
      className={`mb-2 pb-1 text-[15px] font-bold uppercase ${style === "simple"
        ? "border-b border-gray-300"
        : "border-b-2"
        }`}
      style={{
        color,
        borderColor: color,
      }}
    >
      {children}
    </h2>
  );
};

const hasContent = (item, fields) =>
  fields.some((field) => String(item?.[field] || "").trim());

const formatDate = (start, end) => {
  if (!start && !end) return "";
  if (start && end) return `${start} – ${end}`;
  return start || end;
};

const formatMonth = (date) => {
  if (!date) return "";

  if (!String(date).includes("-")) return date;

  const [year, month] = String(date).split("-");

  if (!year || !month) return date;

  const monthName = new Date(
    Number(year),
    Number(month) - 1
  ).toLocaleString("en-US", {
    month: "short",
  });

  return `${monthName} ${year}`;
};

export default function ResumePreview({ data }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const personal = data.personalInfo || {};

  const selectedTemplate =
    resumeTemplates.find((template) => template.id === data.template) ||
    resumeTemplates[0];

  const primaryColor = selectedTemplate.primaryColor;
  const textColor = selectedTemplate.textColor;


  const isCreative = data.template === "creative";

  // EDUCATION
  const education = (data.education || []).filter((item) =>
    hasContent(item, [
      "institution",
      "degree",
      "field",
      "grade",
    ])
  );

  // EXPERIENCE
  const experience = (data.experience || []).filter((item) =>
    hasContent(item, [
      "company",
      "position",
      "description",
    ])
  );

  // PROJECTS
  const projects = (data.projects || []).filter((item) =>
    hasContent(item, [
      "name",
      "technologies",
      "description",
      "link",
    ])
  );

  const certifications = (data.certifications || []).filter((item) =>
  hasContent(item, [
    "name",
    "issuer",
    "issueDate",
    "startDate",
    "endDate",
    "credentialId",
    "credentialUrl",
  ])
);

  // ACHIEVEMENTS
  const achievements = (data.achievements || []).filter((item) =>
    hasContent(item, [
      "title",
      "organization",
      "description",
      "date",
    ])
  );

  // GROUPED TECHNICAL SKILLS
  const skillGroups = (data.skills || [])
    .map((group) => ({
      category: String(group?.category || "").trim(),
      items: Array.isArray(group?.items)
        ? group.items.filter((skill) => String(skill).trim())
        : [],
    }))
    .filter((group) => group.items.length > 0);

  // LANGUAGES
  const languages = (data.languages || []).filter((language) =>
    String(language).trim()
  );

  // CONTACT DETAILS
  const contactDetails = [
    personal.address,
    personal.phone,
    personal.email,
  ].filter(Boolean);

  // SOCIAL LINKS
  const links = [
    { label: "LinkedIn", url: personal.linkedin },
    { label: "GitHub", url: personal.github },
    { label: "Portfolio", url: personal.website },
  ].filter((item) => item.url);

  // DOWNLOAD RESUME AS PDF
  const handleDownload = async () => {
    const element = document.getElementById("resume-pdf");

    if (!element) {
      setDownloadError("Resume preview not found.");
      return;
    }

    try {
      setDownloading(true);
      setDownloadError("");

      const safeName = (personal.fullName || "My-Resume")
        .trim()
        .replace(/[<>:"/\\|?*]+/g, "-")
        .replace(/\s+/g, "-");

      const options = {
        margin: [8, 8, 8, 8],

        filename: `${safeName}.pdf`,

        image: {
          type: "jpeg",
          quality: 0.98,
        },

        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          scrollY: 0,
        },

        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
          compress: true,
        },

        pagebreak: {
          mode: ["css", "legacy"],
          avoid: ["header", ".resume-item"],
        },
      };

      await html2pdf()
        .set(options)
        .from(element)
        .save();
    } catch (error) {
      console.error("PDF download error:", error);

      setDownloadError(
        "Unable to generate PDF. Please try again."
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="resume-preview-wrapper">

      {/* PREVIEW HEADER */}
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Live Resume Preview
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Your resume updates automatically as you edit.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {downloading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Generating PDF...
            </>
          ) : (
            <>
              <span>↓</span>
              Download PDF
            </>
          )}
        </button>
      </div>

      {/* DOWNLOAD ERROR */}
      {downloadError && (
        <div className="no-print mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {downloadError}
        </div>
      )}

      {/* RESUME DOCUMENT */}
      <article
        id="resume-pdf"
        className={`resume-print-area mx-auto w-full max-w-[794px] bg-white px-8 py-10 text-[14px] leading-[1.45] shadow-xl sm:px-10 sm:py-12 ${data.template === "creative"
          ? "border-l-[10px]"
          : data.template === "professional"
            ? "border-t-4"
            : ""
          }`}
        style={{
          fontFamily:
            data.template === "professional"
              ? "Georgia, serif"
              : "Arial, Helvetica, sans-serif",
          color: textColor,
          borderColor: primaryColor,
          overflowWrap: "break-word",
        }}
      >

        {/* HEADER */}
        <header
          className={`mb-6 text-center ${data.template === "creative"
            ? "rounded-lg px-5 py-5"
            : "pb-3"
            }`}
          style={
            data.template === "creative"
              ? {
                backgroundColor: primaryColor,
                color: "#ffffff",
              }
              : {}
          }
        >
          <h1
            className="mb-1 text-[28px] font-bold uppercase leading-tight"
            style={{
              color: data.template === "creative" ? "#ffffff" : primaryColor,
            }}
          >
            {personal.fullName || "YOUR NAME"}
          </h1>

          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[13px]">
            {contactDetails.length > 0 ? (
              contactDetails.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span>|</span>}
                  <span>{item}</span>
                </React.Fragment>
              ))
            ) : (
              <span>Location | Phone | Email</span>
            )}
          </div>

          {links.length > 0 && (
            <div className="mt-1 flex flex-wrap justify-center gap-2 text-[13px]">
              {links.map((item, index) => (
                <React.Fragment key={item.label}>
                  {index > 0 && <span>|</span>}

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                    style={{
                      color: data.template === "creative" ? "#ffffff" : primaryColor,
                    }}
                  >
                    {item.label}
                  </a>
                </React.Fragment>
              ))}
            </div>
          )}
        </header>

        {/* PROFESSIONAL SUMMARY */}
        {data.summary?.trim() && (
          <section className="mb-5">
            <SectionTitle template={selectedTemplate}>
              Professional Summary
            </SectionTitle>

            <p className="whitespace-pre-line">
              {data.summary}
            </p>
          </section>
        )}

        {/* EDUCATION */}
        {education.length > 0 && (
          <section className="mb-5">
            <SectionTitle template={selectedTemplate}>Education</SectionTitle>

            {education.map((item, index) => (
              <div
                key={index}
                className="resume-item mb-3"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <strong>
                    {[item.degree, item.field]
                      .filter(Boolean)
                      .join(" ")}
                  </strong>

                  <em>
                    {formatDate(item.startDate, item.endDate)}
                  </em>
                </div>

                {item.institution && (
                  <p className="font-medium">
                    {item.institution}

                    {item.grade && (
                      <>
                        {" | "}
                        {item.gradeType || "CGPA"}: {item.grade}
                        {item.gradeType === "Percentage" ? "%" : ""}
                      </>
                    )}
                  </p>
                )}

                {!item.institution && item.grade && (
                  <p>
                    {item.gradeType || "CGPA"}: {item.grade}
                    {item.gradeType === "Percentage" ? "%" : ""}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* TECHNICAL SKILLS */}
        {skillGroups.length > 0 && (
          <section className="mb-5">
            <SectionTitle template={selectedTemplate}>Technical Skills</SectionTitle>

            <div className="space-y-1">
              {skillGroups.map((group, index) => (
                <p key={index}>
                  {group.category && (
                    <>
                      <strong>{group.category}:</strong>{" "}
                    </>
                  )}

                  {group.items.join(", ")}
                </p>
              ))}
            </div>
          </section>
        )}
        {/* LANGUAGES */}
        {languages.length > 0 && (
          <section className="mb-5">
            <SectionTitle template={selectedTemplate}>Languages</SectionTitle>

            <p>
              <strong>Languages:</strong>{" "}
              {languages.join(", ")}
            </p>
          </section>
        )}

        {/* WORK EXPERIENCE */}
        {experience.length > 0 && (
          <section className="mb-5">
            <SectionTitle template={selectedTemplate}>Experience</SectionTitle>

            {experience.map((item, index) => (
              <div
                key={index}
                className="resume-item mb-3"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <strong>{item.position}</strong>

                  <em>
                    {formatDate(
                      formatMonth(item.startDate),
                      formatMonth(item.endDate)
                    )}
                  </em>
                </div>

                {item.company && (
                  <p className="font-medium">
                    {item.company}
                  </p>
                )}

                {item.description && (
                  <p className="whitespace-pre-line">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <section className="mb-5">
            <SectionTitle template={selectedTemplate}>Projects</SectionTitle>

            {projects.map((item, index) => (
              <div
                key={index}
                className="resume-item mb-3"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <strong>{item.name}</strong>

                  {item.technologies && (
                    <em>{item.technologies}</em>
                  )}
                </div>

                {item.description && (
                  <p className="whitespace-pre-line">
                    {item.description}
                  </p>
                )}

                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all underline"
                    style={{
                      color: data.template === "creative" ? "#ffffff" : primaryColor,
                    }}
                  >
                    {item.link}
                  </a>
                )}
              </div>
            ))}
          </section>
        )}

        {/* CERTIFICATIONS */}
        {certifications.length > 0 && (
          <section className="mb-5">
            <SectionTitle template={selectedTemplate}>Certifications</SectionTitle>

            {certifications.map((item, index) => (
              <div key={index} className="resume-item mb-3">
                <div className="grid grid-cols-2 gap-4">
                  {/* Certificate Name */}
                  <div>
                    {item.name && <strong>{item.name}</strong>}
                  </div>

                  {/* Organization */}
                  <div>
                    {item.issuer && <strong>{item.issuer}</strong>}
                  </div>

                  {/* Dates: display only when filled */}
                  {(item.startDate || item.endDate) && (
                    <div className="col-span-2 grid grid-cols-2 gap-4">
                      {item.startDate && (
                        <div>
                          <span className="text-sm font-semibold">Start Date</span>
                          <p>{item.startDate}</p>
                        </div>
                      )}

                      {item.endDate && (
                        <div>
                          <span className="text-sm font-semibold">End Date</span>
                          <p>{item.endDate}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {item.credentialId && (
                  <p className="mt-1">
                    Credential ID: {item.credentialId}
                  </p>
                )}

                {item.credentialUrl && (
                  <a
                    href={item.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                    style={{
                      color: data.template === "creative" ? "#ffffff" : primaryColor,
                    }}
                  >
                    Verify Certificate
                  </a>
                )}
              </div>
            ))}
          </section>
        )}

        {/* ACHIEVEMENTS */}
        {achievements.length > 0 && (
          <section className="mb-5">
            <SectionTitle template={selectedTemplate}>Achievements</SectionTitle>

            {achievements.map((item, index) => (
              <div
                key={index}
                className="resume-item mb-2"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <strong>{item.title}</strong>

                  <em>{item.date}</em>
                </div>

                {item.organization && (
                  <p className="font-medium">
                    {item.organization}
                  </p>
                )}

                {item.description && (
                  <p className="whitespace-pre-line">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}

      </article>
    </div>
  );
}
