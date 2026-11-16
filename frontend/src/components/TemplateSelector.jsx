
import React from "react";
import { resumeTemplates } from "../constants/resumeTemplates";

function TemplateSelector({ selectedTemplate, onSelect }) {
  return (
    <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-1 text-lg font-bold text-gray-800">
        Choose Resume Template
      </h2>

      <p className="mb-5 text-sm text-gray-500">
        Select a design for your professional resume.
      </p>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {resumeTemplates.map((template) => {
          const isSelected = selectedTemplate === template.id;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template.id)}
              className={`rounded-xl border-2 p-3 text-left transition hover:shadow-md ${
                isSelected
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              {/* Template Preview */}
              <div className="mb-3 h-36 rounded-md border border-gray-200 bg-white p-3">
                <div
                  className="mb-3 h-5 rounded-sm"
                  style={{ backgroundColor: template.primaryColor }}
                />

                <div className="mb-2 h-2 w-3/4 rounded bg-gray-300" />
                <div className="mb-2 h-1.5 w-full rounded bg-gray-200" />
                <div className="mb-2 h-1.5 w-5/6 rounded bg-gray-200" />

                <div
                  className="mb-2 mt-4 h-2 w-1/2 rounded"
                  style={{ backgroundColor: template.primaryColor }}
                />

                <div className="mb-2 h-1.5 w-full rounded bg-gray-200" />
                <div className="h-1.5 w-2/3 rounded bg-gray-200" />
              </div>

              {/* Template Information */}
              <div className="flex items-center justify-between gap-1">
                <span className="font-semibold text-gray-800">
                  {template.name}
                </span>

                {isSelected && (
                  <span className="text-xs font-bold text-blue-600">
                    Selected
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs text-gray-500">
                {template.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default TemplateSelector;
