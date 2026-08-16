import { RESUME_LANGUAGES, type ResumeLanguage } from "@shared/resume";

/**
 * The interface and the document support the same two languages, but they are
 * picked independently: the locale is a browser preference stored per device,
 * the document language is part of the resume itself.
 */
export const APP_LOCALES = RESUME_LANGUAGES;
export type AppLocale = ResumeLanguage;

/** A piece of copy that lives outside this file, e.g. a template's name. */
export type LocalizedText = Record<AppLocale, string>;

export const LOCALE_HTML_LANG: Record<AppLocale, string> = {
  pt: "pt-BR",
  en: "en",
};

const pt = {
  documentTitle: "Gerador de Currículo",

  locale: {
    label: "Idioma da página",
  },

  footer: {
    enjoying: "Este gerador é gratuito e sem anúncios.",
    buyMeACoffee: "Me pague um café",
  },

  steps: {
    navLabel: "Etapas",
    style: "Estilo",
    data: "Dados",
    preview: "Visualizar",
    lockedHint: "Preencha os campos obrigatórios para visualizar",
  },

  picker: {
    title: "Escolha o estilo do currículo",
    description:
      "Selecione um modelo e o idioma. Você pode trocar os dois a qualquer momento, sem perder o que já preencheu.",
    resumeLanguageTitle: "Idioma do currículo",
    resumeLanguageDescription:
      "Define os títulos das seções do documento gerado. O idioma da interface é escolhido separadamente, no topo da página.",
    viewExample: "Ver exemplo completo",
    exampleTitle: (templateName: string) =>
      `${templateName} — exemplo preenchido`,
    exampleDescription:
      "Currículo fictício, no idioma selecionado, para você ver como o modelo fica com conteúdo real.",
    useExample: "Usar estes dados de exemplo",
    close: "Fechar",
    start: "Começar",
    continueDraft: "Continuar rascunho",
    draftHint: "Você tem um currículo em andamento salvo neste navegador.",
    sampleLoaded: "Dados de exemplo carregados. É só editar.",
  },

  editor: {
    title: "Seus dados",
    description:
      "Só nome, cargo, localização, telefone e e-mail são obrigatórios. As demais seções aparecem no currículo apenas se você preenchê-las.",
    import: "Importar",
    export: "Exportar",
    example: "Exemplo",
    clear: "Limpar",
    imported: "Currículo importado.",
    exampleLoaded: "Dados de exemplo carregados.",
    draftCleared: "Rascunho limpo.",
    invalidForm: "Revise os campos obrigatórios destacados.",
    saving: "Salvando…",
    savedNow: "Rascunho salvo agora",
    savedMinutesAgo: (minutes: number) => `Rascunho salvo há ${minutes} min`,
    savedHoursAgo: (hours: number) => `Rascunho salvo há ${hours} h`,
    identification: "Identificação",
    identificationHint: "Campos obrigatórios.",
    submit: "Visualizar currículo",
    sections: {
      summary: "Sumário",
      competencies: "Principais competências",
      skills: "Resumo técnico",
      experience: "Experiência profissional",
      education: "Formação acadêmica",
      certifications: "Licenças e certificações",
    },
    clearDialog: {
      title: "Limpar todos os dados?",
      description:
        "Isso apaga o currículo salvo neste navegador. O estilo e o idioma escolhidos são mantidos. Se quiser guardar o que preencheu, use “Exportar” antes.",
      cancel: "Cancelar",
      confirm: "Limpar mesmo assim",
    },
  },

  preview: {
    title: "Visualizar e imprimir",
    description:
      "Confira o resultado e gere o PDF. Na caixa de impressão: destino “Salvar como PDF”, margens “Nenhuma”, escala 100%. Evite “Microsoft Print to PDF” — esse destino gera um arquivo sem texto selecionável.",
    resumeLanguageLabel: "Idioma do currículo",
    back: "Voltar aos dados",
    print: "Imprimir PDF",
    incomplete: "Preencha os campos obrigatórios antes de visualizar.",
  },

  form: {
    hiddenWhenEmpty:
      "Se você deixar esta seção vazia, ela não aparece no currículo.",
    addItem: "Adicionar item",
    itemAria: (label: string, position: number) => `${label} ${position}`,
    removeItemAria: (label: string, position: number) =>
      `Remover ${label} ${position}`,
    moveUp: "Mover para cima",
    moveDown: "Mover para baixo",
    remove: "Remover",

    name: { label: "Nome completo", placeholder: "Ana Beatriz Costa" },
    role: {
      label: "Cargo / área",
      placeholder: "Engenheira de Software",
      description: "Aparece em itálico logo abaixo do nome.",
    },
    location: {
      label: "Localização",
      placeholder: "São Paulo, SP - Brasil",
    },
    phone: { label: "Telefone", placeholder: "+55 11 90000-0000" },
    email: { label: "E-mail", placeholder: "ana.costa@exemplo.com" },

    summary: {
      label: "Sumário profissional",
      placeholder:
        "Um parágrafo sobre sua atuação, especialidade e o que você procura.",
      description: "Aparece no topo da coluna principal.",
    },

    competencies: {
      label: "Competências",
      description:
        "Itens curtos, listados na barra lateral. Enter adiciona a próxima.",
      placeholder: "Desenvolvimento Back-End",
      add: "Adicionar competência",
    },

    programmingLanguages: {
      label: "Linguagens de programação",
      placeholder: "TypeScript",
      add: "Adicionar linguagem",
    },
    technologies: {
      label: "Tecnologias",
      placeholder: "Node.js",
      add: "Adicionar tecnologia",
    },
    toolsPlatforms: {
      label: "Ferramentas e plataformas",
      placeholder: "Docker",
      add: "Adicionar ferramenta",
    },

    experience: {
      emptyTitle: "Nenhuma experiência adicionada",
      add: "Adicionar experiência",
      entryLabel: "Experiência",
      jobRole: {
        label: "Cargo",
        placeholder: "Engenheira de Software Sênior",
      },
      company: { label: "Empresa", placeholder: "Norte Digital" },
      period: {
        label: "Período",
        placeholder: "2022 - Atual",
        description: "Texto livre — aparece na coluna à esquerda da entrada.",
      },
      description: {
        label: "Descrição",
        placeholder:
          "O que você fazia, com que tecnologias e com qual responsabilidade.",
      },
      achievements: {
        label: "Principais conquistas",
        description:
          "Resultados concretos, de preferência com número. Enter adiciona a próxima.",
        placeholder: "Reduziu o tempo de resposta da API em 70%.",
        add: "Adicionar conquista",
      },
    },

    education: {
      emptyTitle: "Nenhuma formação adicionada",
      add: "Adicionar formação",
      entryLabel: "Formação",
      degree: {
        label: "Curso / grau",
        placeholder: "Bacharelado em Ciência da Computação",
      },
      institution: {
        label: "Instituição",
        placeholder: "Universidade Federal do Paraná, 2015",
      },
    },

    certifications: {
      emptyTitle: "Nenhuma certificação adicionada",
      add: "Adicionar certificação",
      entryLabel: "Certificação",
      name: {
        label: "Certificação",
        placeholder: "AWS Certified Solutions Architect",
      },
      issuer: {
        label: "Emissor",
        placeholder: "Amazon Web Services, 2023",
      },
    },
  },

  validation: {
    name: "Informe seu nome completo.",
    title: "Informe seu cargo ou área de atuação.",
    location: "Informe sua cidade e estado.",
    phone: "Informe um telefone para contato.",
    email: "Informe um e-mail para contato.",
    emailInvalid: "E-mail inválido.",
  },

  importError: {
    "not-json": "O arquivo não é um JSON válido.",
    "not-object": "O arquivo não contém um objeto JSON válido.",
    "not-resume":
      "O arquivo não parece ser um currículo exportado por este app.",
    unknown: "Não foi possível ler o arquivo.",
  },

  notFound: {
    title: "Página não encontrada",
    description:
      "A página que você procura não existe. Ela pode ter sido movida ou removida.",
    goHome: "Ir para o início",
  },

  errorBoundary: {
    title: "Ocorreu um erro inesperado.",
    reload: "Recarregar a página",
  },
};

export type Messages = typeof pt;

const en: Messages = {
  documentTitle: "Resume Builder",

  locale: {
    label: "Interface language",
  },

  footer: {
    enjoying: "This builder is free and ad-free.",
    buyMeACoffee: "Buy me a coffee",
  },

  steps: {
    navLabel: "Steps",
    style: "Style",
    data: "Content",
    preview: "Preview",
    lockedHint: "Fill in the required fields to preview",
  },

  picker: {
    title: "Choose the resume style",
    description:
      "Pick a template and a language. You can change both at any time without losing what you have filled in.",
    resumeLanguageTitle: "Resume language",
    resumeLanguageDescription:
      "Sets the section headings of the generated document. The interface language is chosen separately, at the top of the page.",
    viewExample: "See a full example",
    exampleTitle: (templateName: string) => `${templateName} — filled example`,
    exampleDescription:
      "A fictional resume, in the selected language, so you can see how the template looks with real content.",
    useExample: "Use this example data",
    close: "Close",
    start: "Get started",
    continueDraft: "Continue draft",
    draftHint: "You have a resume in progress saved in this browser.",
    sampleLoaded: "Example data loaded. Just edit it.",
  },

  editor: {
    title: "Your details",
    description:
      "Only name, job title, location, phone and e-mail are required. Every other section shows up on the resume only if you fill it in.",
    import: "Import",
    export: "Export",
    example: "Example",
    clear: "Clear",
    imported: "Resume imported.",
    exampleLoaded: "Example data loaded.",
    draftCleared: "Draft cleared.",
    invalidForm: "Check the highlighted required fields.",
    saving: "Saving…",
    savedNow: "Draft saved just now",
    savedMinutesAgo: (minutes: number) => `Draft saved ${minutes} min ago`,
    savedHoursAgo: (hours: number) => `Draft saved ${hours} h ago`,
    identification: "Identification",
    identificationHint: "Required fields.",
    submit: "Preview resume",
    sections: {
      summary: "Summary",
      competencies: "Core competencies",
      skills: "Technical summary",
      experience: "Work experience",
      education: "Education",
      certifications: "Licenses and certifications",
    },
    clearDialog: {
      title: "Clear all data?",
      description:
        "This deletes the resume saved in this browser. The chosen template and language are kept. Use “Export” first if you want to keep what you filled in.",
      cancel: "Cancel",
      confirm: "Clear anyway",
    },
  },

  preview: {
    title: "Preview and print",
    description:
      "Check the result and generate the PDF. In the print dialog: destination “Save as PDF”, margins “None”, scale 100%. Avoid “Microsoft Print to PDF” — that destination produces a file with no selectable text.",
    resumeLanguageLabel: "Resume language",
    back: "Back to content",
    print: "Print PDF",
    incomplete: "Fill in the required fields before previewing.",
  },

  form: {
    hiddenWhenEmpty:
      "If you leave this section empty it will not appear on the resume.",
    addItem: "Add item",
    itemAria: (label: string, position: number) => `${label} ${position}`,
    removeItemAria: (label: string, position: number) =>
      `Remove ${label} ${position}`,
    moveUp: "Move up",
    moveDown: "Move down",
    remove: "Remove",

    name: { label: "Full name", placeholder: "Ana Beatriz Costa" },
    role: {
      label: "Job title / field",
      placeholder: "Software Engineer",
      description: "Shown in italics right below the name.",
    },
    location: {
      label: "Location",
      placeholder: "Austin, TX - USA",
    },
    phone: { label: "Phone", placeholder: "+1 512 000-0000" },
    email: { label: "E-mail", placeholder: "ana.costa@example.com" },

    summary: {
      label: "Professional summary",
      placeholder:
        "One paragraph about what you do, your specialty and what you are looking for.",
      description: "Shown at the top of the main column.",
    },

    competencies: {
      label: "Competencies",
      description:
        "Short items, listed in the sidebar. Enter adds the next one.",
      placeholder: "Back-End Development",
      add: "Add competency",
    },

    programmingLanguages: {
      label: "Programming languages",
      placeholder: "TypeScript",
      add: "Add language",
    },
    technologies: {
      label: "Technologies",
      placeholder: "Node.js",
      add: "Add technology",
    },
    toolsPlatforms: {
      label: "Tools and platforms",
      placeholder: "Docker",
      add: "Add tool",
    },

    experience: {
      emptyTitle: "No experience added",
      add: "Add experience",
      entryLabel: "Experience",
      jobRole: {
        label: "Job title",
        placeholder: "Senior Software Engineer",
      },
      company: { label: "Company", placeholder: "Norte Digital" },
      period: {
        label: "Period",
        placeholder: "2022 - Present",
        description: "Free text — shown in the column left of the entry.",
      },
      description: {
        label: "Description",
        placeholder:
          "What you did, with which technologies and with what responsibility.",
      },
      achievements: {
        label: "Key achievements",
        description:
          "Concrete results, ideally with a number. Enter adds the next one.",
        placeholder: "Cut API response time by 70%.",
        add: "Add achievement",
      },
    },

    education: {
      emptyTitle: "No education added",
      add: "Add education",
      entryLabel: "Education",
      degree: {
        label: "Course / degree",
        placeholder: "BSc in Computer Science",
      },
      institution: {
        label: "Institution",
        placeholder: "University of Texas, 2015",
      },
    },

    certifications: {
      emptyTitle: "No certification added",
      add: "Add certification",
      entryLabel: "Certification",
      name: {
        label: "Certification",
        placeholder: "AWS Certified Solutions Architect",
      },
      issuer: {
        label: "Issuer",
        placeholder: "Amazon Web Services, 2023",
      },
    },
  },

  validation: {
    name: "Enter your full name.",
    title: "Enter your job title or field.",
    location: "Enter your city and state.",
    phone: "Enter a contact phone number.",
    email: "Enter a contact e-mail.",
    emailInvalid: "Invalid e-mail.",
  },

  importError: {
    "not-json": "The file is not valid JSON.",
    "not-object": "The file does not contain a valid JSON object.",
    "not-resume": "The file does not look like a resume exported by this app.",
    unknown: "The file could not be read.",
  },

  notFound: {
    title: "Page not found",
    description:
      "The page you are looking for does not exist. It may have been moved or deleted.",
    goHome: "Go home",
  },

  errorBoundary: {
    title: "An unexpected error occurred.",
    reload: "Reload page",
  },
};

export const MESSAGES: Record<AppLocale, Messages> = { pt, en };
