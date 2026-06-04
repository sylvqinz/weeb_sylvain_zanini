import { getCurrentUserClaims, isAdminUser, type AuthUser } from "./auth";
import { type Article } from "./articles";

export function getAuthorName(article: Article) {
  if (typeof article.author === "string") {
    return article.author;
  }

  if (article.author) {
    return [article.author.first_name, article.author.last_name].filter(Boolean).join(" ") || article.author.username;
  }

  return null;
}

function normalizeOwnerValue(value: unknown) {
  if (typeof value === "string" && value.trim()) {
    return value.trim().toLowerCase();
  }

  if (typeof value === "number") {
    return String(value);
  }

  return null;
}

function addOwnerValue(values: Set<string>, value: unknown) {
  const normalizedValue = normalizeOwnerValue(value);

  if (normalizedValue) {
    values.add(normalizedValue);
  }
}

function addOwnerObjectValues(values: Set<string>, owner: unknown) {
  if (!owner || typeof owner !== "object") {
    addOwnerValue(values, owner);
    return;
  }

  const ownerData = owner as Record<string, unknown>;
  addOwnerValue(values, ownerData.id);
  addOwnerValue(values, ownerData.user_id);
  addOwnerValue(values, ownerData.username);
  addOwnerValue(values, ownerData.email);
}

function getCurrentUserValues(user: AuthUser | null) {
  const values = new Set<string>();

  if (!user) {
    return values;
  }

  addOwnerValue(values, user.id);
  addOwnerValue(values, user.user_id);
  addOwnerValue(values, user.sub);
  addOwnerValue(values, user.username);
  addOwnerValue(values, user.email);

  return values;
}

// Le backend peut exposer le proprietaire sous differents noms selon l'endpoint.
function getArticleOwnerValues(article: Article) {
  const values = new Set<string>();

  addOwnerObjectValues(values, article.author);
  addOwnerValue(values, article.author_id);
  addOwnerValue(values, article.user_id);
  addOwnerValue(values, article.owner_id);
  addOwnerObjectValues(values, article.user);
  addOwnerObjectValues(values, article.owner);
  addOwnerObjectValues(values, article.created_by);

  return values;
}

export function isCurrentUserArticle(article: Article, user: AuthUser | null) {
  const currentUserValues = getCurrentUserValues(user || getCurrentUserClaims());
  const articleOwnerValues = getArticleOwnerValues(article);

  return [...currentUserValues].some((value) => articleOwnerValues.has(value));
}

export function canManageArticle(article: Article, user: AuthUser | null) {
  const currentUser = user || getCurrentUserClaims();

  return Boolean(currentUser?.is_active && (isAdminUser(currentUser) || isCurrentUserArticle(article, currentUser)));
}
