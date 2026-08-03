import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FavoriteButton from "../components/FavoriteButton";
import { useAuth } from "../hooks/useAuth";
import { type AuthUser } from "../lib/auth";
import {
  type Article,
  type FavoriteUpdate,
  deleteArticle,
  fetchMyArticles,
  fetchMyFavorites,
} from "../lib/articles";

function getUserField(user: AuthUser | null, key: string) {
  const value = user?.[key];

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

function getUserName(user: AuthUser | null) {
  const fullName = [getUserField(user, "first_name"), getUserField(user, "last_name")].filter(Boolean).join(" ");

  return fullName || getUserField(user, "username") || getUserField(user, "email") || "Utilisateur";
}

function getArticlePreview(article: Article) {
  return article.excerpt || article.content || article.body || "Aucun extrait disponible.";
}

function formatDate(value: string | undefined) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString();
}

type AccountArticleCardProps = {
  article: Article;
  canManage?: boolean;
  deletingSlug: string | null;
  onDelete: (slug: string) => void;
  onFavoriteChange: (article: Article, update: FavoriteUpdate) => void;
};

function AccountArticleCard({
  article,
  canManage = false,
  deletingSlug,
  onDelete,
  onFavoriteChange,
}: AccountArticleCardProps) {
  const slug = article.slug;
  const createdAt = formatDate(article.created_at);
  const updatedAt = formatDate(article.updated_at);

  return (
    <article className="border border-purple-500/40 rounded-lg bg-[#20223f] p-6">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-xl font-semibold">{article.title || "Article sans titre"}</h3>
          {(createdAt || updatedAt) && (
            <p className="mt-2 text-sm text-gray-400">
              {createdAt && <span>Publié le {createdAt}</span>}
              {createdAt && updatedAt && <span> - </span>}
              {updatedAt && <span>Modifié le {updatedAt}</span>}
            </p>
          )}
        </div>
      </div>

      <p className="text-gray-300 line-clamp-3">{getArticlePreview(article)}</p>

      <div className="mt-6 flex flex-wrap items-start gap-4">
        {slug ? (
          <>
            <Link to={`/blog/${slug}`} className="py-2 text-purple-300 hover:text-purple-200 transition">
              Voir
            </Link>
            {canManage && (
              <>
                <Link to={`/articles/${slug}/edit`} className="py-2 text-purple-300 hover:text-purple-200 transition">
                  Modifier
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(slug)}
                  disabled={deletingSlug === slug}
                  className="py-2 text-red-200 hover:text-red-100 disabled:opacity-60 transition"
                >
                  {deletingSlug === slug ? "Suppression..." : "Supprimer"}
                </button>
              </>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-400">Slug indisponible</p>
        )}

        <FavoriteButton article={article} onChange={(update) => onFavoriteChange(article, update)} />
      </div>
    </article>
  );
}

export default function Account() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [favorites, setFavorites] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [articlesMessage, setArticlesMessage] = useState("");
  const [favoritesMessage, setFavoritesMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadUserArticles() {
      try {
        const data = await fetchMyArticles();

        if (!ignore) {
          setArticles(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (!ignore) {
          setArticlesMessage(error instanceof Error ? error.message : "Impossible de charger vos articles.");
        }
      } finally {
        if (!ignore) {
          setLoadingArticles(false);
        }
      }
    }

    async function loadUserFavorites() {
      try {
        const data = await fetchMyFavorites();

        if (!ignore) {
          setFavorites(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (!ignore) {
          setFavoritesMessage(error instanceof Error ? error.message : "Impossible de charger vos favoris.");
        }
      } finally {
        if (!ignore) {
          setLoadingFavorites(false);
        }
      }
    }

    void loadUserArticles();
    void loadUserFavorites();

    return () => {
      ignore = true;
    };
  }, []);

  const profileRows = useMemo(
    () => [
      { label: "Nom", value: getUserName(user) },
      { label: "Email", value: getUserField(user, "email") || "Non renseigné" },
    ],
    [user],
  );

  function handleFavoriteChange(article: Article, update: FavoriteUpdate) {
    const updatedArticle = { ...article, ...update };

    setArticles((currentArticles) =>
      currentArticles.map((currentArticle) =>
        currentArticle.slug === article.slug ? { ...currentArticle, ...update } : currentArticle,
      ),
    );

    setFavorites((currentFavorites) => {
      if (!update.is_favorite) {
        return currentFavorites.filter((favorite) => favorite.slug !== article.slug);
      }

      const alreadyListed = currentFavorites.some((favorite) => favorite.slug === article.slug);

      return alreadyListed
        ? currentFavorites.map((favorite) => (favorite.slug === article.slug ? { ...favorite, ...update } : favorite))
        : [updatedArticle, ...currentFavorites];
    });
  }

  async function handleDelete(slug: string) {
    if (!window.confirm("Supprimer cette publication ?")) {
      return;
    }

    setActionMessage("");
    setDeletingSlug(slug);

    try {
      await deleteArticle(slug);
      setArticles((currentArticles) => currentArticles.filter((article) => article.slug !== slug));
      setFavorites((currentFavorites) => currentFavorites.filter((article) => article.slug !== slug));
      setActionMessage("Publication supprimée.");
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Impossible de supprimer cette publication.");
    } finally {
      setDeletingSlug(null);
    }
  }

  return (
    <section className="px-6 pb-20 max-w-6xl mx-auto">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Mon compte</h1>
          <p className="text-gray-300">Bonjour {getUserName(user)}.</p>
        </div>

        <Link
          to="/articles/new"
          className="inline-flex w-fit px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition"
        >
          Créer un article
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr]">
        <aside className="border border-purple-500/40 rounded-lg bg-[#20223f] p-6 h-fit">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[2px] text-purple-300 mb-2">Profil</p>
            <h2 className="text-2xl font-semibold">{getUserName(user)}</h2>
          </div>

          <dl className="space-y-5">
            {profileRows.map((row) => (
              <div key={row.label}>
                <dt className="text-sm text-gray-400">{row.label}</dt>
                <dd className="mt-1 break-words text-white">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-purple-500/30 pt-6">
            <div>
              <p className="text-sm text-gray-400">Articles</p>
              <p className="mt-1 text-3xl font-bold text-purple-300">{articles.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Favoris</p>
              <p className="mt-1 text-3xl font-bold text-pink-300">{favorites.length}</p>
            </div>
          </div>
        </aside>

        <div className="space-y-12">
          {actionMessage && <p className="text-sm text-purple-300">{actionMessage}</p>}

          <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold">Mes articles</h2>
              {loadingArticles && <p className="text-sm text-purple-300">Chargement...</p>}
            </div>

            {articlesMessage && <p className="text-purple-300">{articlesMessage}</p>}

            {!loadingArticles && !articlesMessage && articles.length === 0 && (
              <div className="border border-purple-500/40 rounded-lg bg-[#20223f] p-6">
                <p className="text-gray-300 mb-5">Vous n'avez pas encore publié d'article.</p>
                <Link to="/articles/new" className="text-purple-300 hover:text-purple-200 transition">
                  Créer votre premier article
                </Link>
              </div>
            )}

            <div className="grid gap-5">
              {articles.map((article) => (
                <AccountArticleCard
                  key={article.slug || article.title}
                  article={article}
                  canManage
                  deletingSlug={deletingSlug}
                  onDelete={handleDelete}
                  onFavoriteChange={handleFavoriteChange}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold">Mes favoris</h2>
              {loadingFavorites && <p className="text-sm text-purple-300">Chargement...</p>}
            </div>

            {favoritesMessage && <p className="text-purple-300">{favoritesMessage}</p>}

            {!loadingFavorites && !favoritesMessage && favorites.length === 0 && (
              <div className="border border-purple-500/40 rounded-lg bg-[#20223f] p-6">
                <p className="text-gray-300">Vous n'avez pas encore d'article favori.</p>
              </div>
            )}

            <div className="grid gap-5">
              {favorites.map((article) => (
                <AccountArticleCard
                  key={article.slug || article.title}
                  article={article}
                  deletingSlug={deletingSlug}
                  onDelete={handleDelete}
                  onFavoriteChange={handleFavoriteChange}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
