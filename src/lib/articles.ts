import { request } from "./api";

export type Article = {
  title?: string;
  content?: string;
  body?: string;
  slug?: string;
  excerpt?: string;
  created_at?: string;
  updated_at?: string;
  author?: string | { id?: string | number; username?: string; email?: string; first_name?: string; last_name?: string };
  [key: string]: unknown;
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
