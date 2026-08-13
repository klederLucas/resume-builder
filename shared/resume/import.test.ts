import { describe, expect, it } from "vitest";

import { createEmptyResume } from "./empty";
import { ResumeImportError, normalizeResume, parseResumeFile } from "./import";
import { resumeSchema } from "./schema";
import { isResumeBlank, selectResumeView } from "./view";

const OPTIONS = { templateId: "classic-teal" } as const;

const LEGACY_NESTED = {
  sidebar: {
    profile: {
      name: "ANA COSTA",
      title: "Software Engineer",
      location: "São Paulo, SP",
      phone: "+55 11 90000-0000",
      email: "ana@exemplo.com",
    },
    coreCompetencies: ["Back-End Development", "CI/CD Pipeline"],
    technicalSummary: {
      programmingLanguages: [
        { name: "TypeScript", level: 100 },
        { name: "SQL", level: 20 },
      ],
      technologies: [{ name: "Node.Js", level: 100 }],
      toolsPlatforms: [{ name: "Docker", level: 20 }],
    },
  },
  mainContent: {
    summary: "Resumo de exemplo.",
    workExperience: [
      {
        id: "1",
        date: "2023 - Present",
        title: "Senior Software Engineer",
        company: "TETRIS IT",
        description: "Liderou a migração do legado.",
        achievements: ["Reduziu bugs em 80%."],
      },
    ],
    education: [
      {
        degree: "Bacharelado em Engenharia de Software",
        institution: "Mater Dei",
      },
    ],
    licensesCertifications: [
      { name: "Scrum Master", issuer: "Scrum Institute" },
    ],
  },
};

const LEGACY_VISIBLE_WRAPPERS = {
  sidebar: {
    profile: {
      name: "LUANA SIMAO",
      title: "Analista de Suporte",
      location: "Pato Branco, PR",
      phone: "+55 46 90000-0000",
      email: "luana@exemplo.com",
    },
    coreCompetencies: { visible: true, items: ["Suporte Técnico N1"] },
    technicalSummary: {
      visible: false,
      programmingLanguages: [],
      technologies: [],
      toolsPlatforms: [],
    },
  },
  mainContent: {
    summary: "Outro resumo.",
    workExperience: [],
    education: {
      visible: true,
      items: [{ degree: "Ciências Contábeis", institution: "UNIDEP" }],
    },
    licensesCertifications: { visible: false, items: [] },
  },
};

describe("normalizeResume", () => {
  it("reads the oldest nested shape and drops skill levels", () => {
    const resume = normalizeResume(LEGACY_NESTED, OPTIONS);

    expect(resumeSchema.safeParse(resume).success).toBe(true);
    expect(resume.profile.name).toBe("ANA COSTA");
    expect(resume.coreCompetencies).toEqual([
      "Back-End Development",
      "CI/CD Pipeline",
    ]);
    expect(resume.skills.programmingLanguages).toEqual(["TypeScript", "SQL"]);
    expect(resume.experience).toHaveLength(1);
    expect(resume.experience[0].period).toBe("2023 - Present");
    expect(resume.experience[0].role).toBe("Senior Software Engineer");
    expect(resume.experience[0].achievements).toEqual(["Reduziu bugs em 80%."]);
    expect(resume.certifications[0].name).toBe("Scrum Master");
  });

  it("unwraps { visible, items } sections and honours visible: false", () => {
    const resume = normalizeResume(LEGACY_VISIBLE_WRAPPERS, OPTIONS);

    expect(resume.coreCompetencies).toEqual(["Suporte Técnico N1"]);
    expect(resume.education).toHaveLength(1);
    expect(resume.certifications).toEqual([]);
    expect(resume.skills.programmingLanguages).toEqual([]);
  });

  it("round-trips a canonical resume unchanged", () => {
    const original = normalizeResume(LEGACY_NESTED, OPTIONS);
    const roundTripped = normalizeResume(
      JSON.parse(JSON.stringify(original)),
      OPTIONS
    );

    expect(roundTripped).toEqual(original);
  });

  it("keeps the template and language stored in meta", () => {
    const resume = normalizeResume(
      { ...LEGACY_NESTED, meta: { templateId: "other", language: "en" } },
      OPTIONS
    );

    expect(resume.meta.templateId).toBe("other");
    expect(resume.meta.language).toBe("en");
  });

  it("falls back to the given template when meta is missing or bogus", () => {
    const resume = normalizeResume(
      { ...LEGACY_NESTED, meta: { language: "klingon" } },
      OPTIONS
    );

    expect(resume.meta.templateId).toBe("classic-teal");
    expect(resume.meta.language).toBe("pt");
  });

  it("rejects input that is not a resume", () => {
    expect(() => normalizeResume(42, OPTIONS)).toThrow(ResumeImportError);
    expect(() => normalizeResume({ foo: "bar" }, OPTIONS)).toThrow(
      ResumeImportError
    );
    expect(() => parseResumeFile("not json", OPTIONS)).toThrow(
      ResumeImportError
    );
  });
});

describe("selectResumeView", () => {
  it("drops blank rows and empty sections", () => {
    const resume = createEmptyResume("classic-teal");
    resume.profile.name = "  Ana Beatriz Costa  ";
    resume.coreCompetencies = ["Back-End", "   ", ""];
    resume.skills.technologies = ["  "];
    resume.experience = [
      {
        period: "2023",
        role: "",
        company: "",
        description: "",
        achievements: [],
      },
      {
        period: "2020",
        role: "Dev",
        company: "ACME",
        description: "",
        achievements: ["Fez algo", "  "],
      },
    ];

    const view = selectResumeView(resume);

    expect(view.coreCompetencies).toEqual(["Back-End"]);
    expect(view.skillGroups).toEqual([]);
    expect(view.experience).toHaveLength(1);
    expect(view.experience[0].achievements).toEqual(["Fez algo"]);
  });

  it("splits the name into a first line and a remainder", () => {
    const resume = createEmptyResume("classic-teal");

    resume.profile.name = "KLEDERSON L. MONTEIRO";
    expect(selectResumeView(resume).profile.nameLines).toEqual([
      "KLEDERSON",
      "L. MONTEIRO",
    ]);

    resume.profile.name = "LUANA SIMÃO";
    expect(selectResumeView(resume).profile.nameLines).toEqual([
      "LUANA",
      "SIMÃO",
    ]);

    resume.profile.name = "Ana";
    expect(selectResumeView(resume).profile.nameLines).toEqual(["Ana"]);
  });

  it("treats a resume with only whitespace as blank", () => {
    const resume = createEmptyResume("classic-teal");
    resume.profile.name = "   ";
    resume.coreCompetencies = ["  "];

    expect(isResumeBlank(resume)).toBe(true);

    resume.profile.name = "Ana";
    expect(isResumeBlank(resume)).toBe(false);
  });
});
