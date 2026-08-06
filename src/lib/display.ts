import { type Article } from "./articles";

type DisplayableRecord = Record<string, unknown> | null | undefined;

export function getDisplayField(source: DisplayableRecord, key: string) {
  const value = source?.[key];

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "Oui" : "Non";
  }

  return null;
}

export function getDisplayName(source: DisplayableRecord) {
  const fullName = [getDisplayField(source, "first_name"), getDisplayField(source, "last_name")]
    .filter(Boolean)
    .join(" ");

  return fullName || getDisplayField(source, "username") || getDisplayField(source, "email") || "Utilisateur";
}

export function getArticlePreview(article: Article) {
  return article.excerpt || article.content || article.body || "Aucun extrait disponible.";
}

export function formatDate(value: string | undefined) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString();
}
