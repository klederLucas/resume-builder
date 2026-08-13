import { useRef, type ReactNode } from "react";
import { BsFillTelephoneFill } from "react-icons/bs";
import { IoIosMail, IoIosPin } from "react-icons/io";

import { A4_HEIGHT_MM } from "@/lib/paper";
import { cn } from "@/lib/utils";
import { usePageCount } from "@/templates/usePageCount";
import type {
  ResumeTemplateMode,
  ResumeTemplateProps,
} from "@/templates/types";
import type { ContactKind, SkillGroupKey } from "@shared/resume";

const ACCENT = "#124355";

const CONTACT_ICONS: Record<ContactKind, ReactNode> = {
  location: <IoIosPin aria-hidden />,
  phone: <BsFillTelephoneFill aria-hidden />,
  email: <IoIosMail aria-hidden />,
};

function SectionHeading({
  children,
  tone,
  mode,
  className,
}: {
  children: ReactNode;
  tone: "sidebar" | "main";
  mode: ResumeTemplateMode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <h3
        className={cn(
          "font-bold whitespace-nowrap",
          tone === "sidebar" ? "text-xl" : "text-2xl text-gray-900"
        )}
      >
        {children}
      </h3>
      <div
        className={cn(
          "mt-1 w-full",
          mode === "thumbnail" ? "h-[3px]" : "h-[2px]",
          tone === "sidebar" ? "bg-white" : "bg-[#124355]"
        )}
      />
    </div>
  );
}

function SkillGroupBar() {
  return (
    <div className="mb-2 flex gap-1">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="h-4 w-5 -skew-x-[20deg] bg-white" />
      ))}
    </div>
  );
}

function Bullet({ tone }: { tone: "sidebar" | "main" }) {
  return (
    <span
      className={cn(
        "mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full",
        tone === "sidebar" ? "bg-white" : "bg-gray-800"
      )}
    />
  );
}

export function ClassicTealTemplate({
  view,
  labels,
  mode = "print",
  ref,
}: ResumeTemplateProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const pageCount = usePageCount([sidebarRef, mainRef], {
    enabled: mode !== "thumbnail",
  });

  const skillLabels: Record<SkillGroupKey, string> = {
    programmingLanguages: labels.programmingLanguages,
    technologies: labels.technologies,
    toolsPlatforms: labels.toolsPlatforms,
  };

  return (
    <div
      ref={ref}
      className="resume-page flex bg-white"
      style={{ minHeight: `calc(${pageCount} * ${A4_HEIGHT_MM}mm)` }}
    >
      <aside className="w-[32%] bg-[#124355] text-white">
        <div ref={sidebarRef} className="flex flex-col gap-8 p-8">
          <div className="mt-4 flex flex-col">
            <h1 className="mb-1 text-[2.5rem] leading-[0.9] font-normal tracking-wide">
              {view.profile.nameLines.map(line => (
                <span key={line} className="block font-bold">
                  {line}
                </span>
              ))}
            </h1>

            {view.profile.title && (
              <h2 className="mt-1 text-xl font-light tracking-wide text-gray-200 italic">
                {view.profile.title}
              </h2>
            )}

            {view.profile.contacts.length > 0 && (
              <div className="mt-8 flex flex-col gap-3 text-sm font-light">
                {view.profile.contacts.map(contact => (
                  <div key={contact.kind} className="flex items-start gap-3">
                    <span className="mt-0.5 flex-shrink-0">
                      {CONTACT_ICONS[contact.kind]}
                    </span>
                    <span className="leading-tight">{contact.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {view.coreCompetencies.length > 0 && (
            <div className="flex flex-col gap-4">
              <SectionHeading tone="sidebar" mode={mode}>
                {labels.coreCompetencies}
              </SectionHeading>
              <ul className="space-y-1.5 text-[0.9rem] font-light">
                {view.coreCompetencies.map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <Bullet tone="sidebar" />
                    <span className="leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {view.skillGroups.length > 0 && (
            <div className="flex flex-col gap-6">
              <SectionHeading
                tone="sidebar"
                mode={mode}
                className="resume-keep-next"
              >
                {labels.technicalSummary}
              </SectionHeading>

              {view.skillGroups.map(group => (
                <div key={group.key} className="resume-block">
                  <h4 className="mb-2 text-sm font-bold text-gray-200">
                    {skillLabels[group.key]}
                  </h4>
                  <SkillGroupBar />
                  <ul className="space-y-1 text-[0.9rem] font-light">
                    {group.items.map(skill => (
                      <li key={skill} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      <main className="w-[68%] text-gray-800">
        <div ref={mainRef} className="flex flex-col gap-10 px-10 py-12">
          {view.summary && (
            <section>
              <div className="mb-4">
                <SectionHeading tone="main" mode={mode}>
                  {labels.summary}
                </SectionHeading>
              </div>
              <p className="text-justify text-[0.95rem] leading-relaxed font-medium text-gray-800">
                {view.summary}
              </p>
            </section>
          )}

          {view.experience.length > 0 && (
            <section>
              <div className="resume-keep-next mb-6">
                <SectionHeading tone="main" mode={mode}>
                  {labels.experience}
                </SectionHeading>
              </div>

              <div className="flex flex-col gap-8">
                {view.experience.map((job, index) => (
                  <div
                    key={`${job.company}-${job.period}-${index}`}
                    className="flex gap-2"
                  >
                    <div className="w-24 flex-shrink-0 text-[0.95rem] font-medium text-gray-900">
                      {job.period}
                    </div>
                    <div className="flex-grow">
                      <div className="resume-block mb-1">
                        {job.role && (
                          <h4 className="text-[1.05rem] font-bold text-gray-900">
                            {job.role}
                          </h4>
                        )}
                        {job.company && (
                          <h5 className="text-[0.95rem] font-medium text-gray-800 uppercase">
                            {job.company}
                          </h5>
                        )}
                      </div>

                      {job.description && (
                        <p className="mb-3 text-justify text-[0.95rem] leading-relaxed font-normal text-gray-800">
                          {job.description}
                        </p>
                      )}

                      {job.achievements.length > 0 && (
                        <div className="mt-2">
                          <p className="resume-keep-next mb-1 text-[0.95rem] font-bold text-gray-900">
                            {labels.keyAchievements}
                          </p>
                          <ul className="space-y-1">
                            {job.achievements.map(achievement => (
                              <li
                                key={achievement}
                                className="resume-block flex items-start gap-3 text-justify text-[0.95rem] text-gray-800"
                              >
                                <Bullet tone="main" />
                                <span className="leading-relaxed">
                                  {achievement}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {view.education.length > 0 && (
            <section>
              <div className="resume-keep-next mb-6">
                <SectionHeading tone="main" mode={mode}>
                  {labels.education}
                </SectionHeading>
              </div>
              <div className="flex flex-col gap-4 pl-26">
                {view.education.map((entry, index) => (
                  <div
                    key={`${entry.degree}-${index}`}
                    className="resume-block text-[0.95rem]"
                  >
                    <p className="font-bold text-gray-900">{entry.degree}</p>
                    <p className="font-light text-gray-600 italic">
                      {entry.institution}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {view.certifications.length > 0 && (
            <section>
              <div className="resume-keep-next mb-6">
                <SectionHeading tone="main" mode={mode}>
                  {labels.certifications}
                </SectionHeading>
              </div>
              <div className="flex flex-col gap-4 pl-26">
                {view.certifications.map((entry, index) => (
                  <div
                    key={`${entry.name}-${index}`}
                    className="resume-block text-[0.95rem]"
                  >
                    <p className="font-bold text-gray-900">{entry.name}</p>
                    <p className="font-light text-gray-600 italic">
                      {entry.issuer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
