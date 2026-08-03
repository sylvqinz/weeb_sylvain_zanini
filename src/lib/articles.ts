import { request } from "./api";

export type Article = {
  title?: string;
  content?: string;
  body?: string;
  slug?: string;
  excerpt?: string;
  created_at?: string;
  updated_at?: string;
  is_favorite?: boolean;
  favorites_count?: number;
  author?: string | { id?: string | number; username?: string; email?: string; first_name?: string; last_name?: string };
  [key: string]: unknown;
};

export type FavoriteUpdate = {
  is_favorite: boolean;
  favorites_count: number;
};

export type ArticlePayload = {
  title: string;
  content: string;
  [key: string]: unknown;
};

export function fetchArticles() {
  return request<Article[]>("/articles/");
}

export function fetchArticle(slug: string) {
  return request<Article>(`/articles/${slug}/`);
}

export function fetchMyArticles() {
  return request<Article[]>("/users/me/articles/");
}

export function fetchMyFavorites() {
  return request<Article[]>("/users/me/favorites/");
}

export function favoriteArticle(slug: string) {
  return request<FavoriteUpdate>(`/articles/${slug}/favorite/`, {
    method: "POST",
  });
}

export function unfavoriteArticle(slug: string) {
  return request<FavoriteUpdate>(`/articles/${slug}/favorite/`, {
    method: "DELETE",
  });
}

export function createArticle(payload: ArticlePayload) {
  return request<Article>("/articles/", {
    method: "POST",
    data: payload,
  });
}

export function updateArticle(slug: string, payload: ArticlePayload) {
  return request<Article>(`/articles/${slug}/`, {
    method: "PUT",
    data: payload,
  });
}

export function patchArticle(slug: string, payload: Partial<ArticlePayload>) {
  return request<Article>(`/articles/${slug}/`, {
    method: "PATCH",
    data: payload,
  });
}

export function deleteArticle(slug: string) {
  return request<void>(`/articles/${slug}/`, {
    method: "DELETE",
  });
}
