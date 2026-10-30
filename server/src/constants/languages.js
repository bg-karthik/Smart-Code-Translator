export const SUPPORTED_LANGUAGES = [
  { id: "c", name: "C", extension: ".c" },
  { id: "cpp", name: "C++", extension: ".cpp" },
  { id: "csharp", name: "C#", extension: ".cs" },
  { id: "java", name: "Java", extension: ".java" },
  { id: "python", name: "Python", extension: ".py" },
];

export const isValidLanguageId = (languageId) => {
  return typeof languageId === "string" && SUPPORTED_LANGUAGES.some((l) => l.id === languageId.toLowerCase().trim());
};

export const getLanguageName = (languageId) => {
  const normalized = typeof languageId === "string" ? languageId.toLowerCase().trim() : "";
  const lang = SUPPORTED_LANGUAGES.find((l) => l.id === normalized);
  return lang ? lang.name : "Unknown";
};
