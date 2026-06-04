import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { canManageArticle, getAuthorName } from "../lib/articleOwnership";
import { useAuth } from "../hooks/useAuth";
import { deactivateAdminUser, fetchAdminUsers, getAdminUserId, type AdminUser, validateAdminUser } from "../lib/admin";
import { type Article, deleteArticle, fetchArticles } from "../lib/articles";

type AdminTab = "articles" | "users";

function getUserField(user: AdminUser, key: string) {
  const value = user[key];

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  return null;
}

function getUserName(user: AdminUser) {
  const fullName = [getUserField(user, "first_name"), getUserField(user, "last_name")].filter(Boolean).join(" ");

  return fullName || getUserField(user, "username") || getUserField(user, "email") || "Utilisateur";
}

function isActiveUser(user: AdminUser) {
  return user.is_active !== false;
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

export default function AdminDashboard() {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("articles");
  const [articles, setArticles] = useState<Article[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [message, setMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadArticles() {
      try {
        const data = await fetchArticles();

        if (!ignore) {
          setArticles(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (!ignore) {
          setMessage(error instanceof Error ? error.message : "Impossible de charger les publications.");
        }
      } finally {
        if (!ignore) {
          setLoadingArticles(false);
        }
      }
    }

    async function loadUsers() {
      try {
        const data = await fetchAdminUsers();

        if (!ignore) {
          setUsers(data);
        }
      } catch (error) {
        if (!ignore) {
          setMessage(error instanceof Error ? error.message : "Impossible de charger les utilisateurs.");
        }
      } finally {
        if (!ignore) {
          setLoadingUsers(false);
        }
      }
    }

    loadArticles();
    loadUsers();

    return () => {
      ignore = true;
    };
  }, []);

  const pendingUsers = useMemo(() => users.filter((user) => !isActiveUser(user)), [users]);

  async function handleDeleteArticle(slug: string) {
    if (!window.confirm("Supprimer cette publication ?")) {
      return;
    }

    setActionMessage("");
    setDeletingSlug(slug);

    try {
      await deleteArticle(slug);
      setArticles((currentArticles) => currentArticles.filter((article) => article.slug !== slug));
      setActionMessage("Publication supprimée.");
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Impossible de supprimer cette publication.");
    } finally {
      setDeletingSlug(null);
    }
  }

  async function handleUserValidation(user: AdminUser, isActive: boolean) {
    const userId = getAdminUserId(user);

    if (!userId) {
      setActionMessage("Identifiant utilisateur indisponible.");
      return;
    }

    setActionMessage("");
    setUpdatingUserId(userId);

    try {
      const updatedUser = isActive ? await deactivateAdminUser(userId) : await validateAdminUser(userId);

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          getAdminUserId(currentUser) === userId ? { ...currentUser, ...updatedUser, is_active: !isActive } : currentUser,
        ),
      );
      setActionMessage(isActive ? "Utilisateur désactivé." : "Utilisateur validé.");
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Impossible de modifier cet utilisateur.");
    } finally {
      setUpdatingUserId(null);
    }
  }

  return (
    <section className="px-6 pb-20 max-w-7xl mx-auto">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Administration</h1>
          <p className="text-gray-300">Publications, utilisateurs et validations.</p>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="border border-purple-500/40 rounded-lg bg-[#20223f] p-5">
          <p className="text-sm text-gray-400">Publications</p>
          <p className="mt-2 text-3xl font-bold text-purple-300">{articles.length}</p>
        </div>
        <div className="border border-purple-500/40 rounded-lg bg-[#20223f] p-5">
          <p className="text-sm text-gray-400">Utilisateurs</p>
          <p className="mt-2 text-3xl font-bold text-purple-300">{users.length}</p>
        </div>
        <div className="border border-purple-500/40 rounded-lg bg-[#20223f] p-5">
          <p className="text-sm text-gray-400">À valider</p>
          <p className="mt-2 text-3xl font-bold text-purple-300">{pendingUsers.length}</p>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveTab("articles")}
          className={`px-5 py-2 rounded-lg transition ${
            activeTab === "articles" ? "bg-purple-600 text-white" : "border border-purple-500/50 text-purple-200"
          }`}
        >
          Publications
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`px-5 py-2 rounded-lg transition ${
            activeTab === "users" ? "bg-purple-600 text-white" : "border border-purple-500/50 text-purple-200"
          }`}
        >
          Utilisateurs
        </button>
      </div>

      {message && <p className="mb-5 text-purple-300">{message}</p>}
      {actionMessage && <p className="mb-5 text-sm text-purple-300">{actionMessage}</p>}

      {activeTab === "articles" && (
        <div className="grid gap-5">
          {loadingArticles && <p className="text-purple-300">Chargement des publications...</p>}

          {!loadingArticles && articles.length === 0 && (
            <div className="border border-purple-500/40 rounded-lg bg-[#20223f] p-6">
              <p className="text-gray-300">Aucune publication disponible.</p>
            </div>
          )}

          {articles.map((article) => {
            const slug = article.slug;
            const authorName = getAuthorName(article);
            const createdAt = formatDate(article.created_at);
            const userCanManageArticle = canManageArticle(article, currentUser);

            return (
              <article key={slug || article.title} className="border border-purple-500/40 rounded-lg bg-[#20223f] p-6">
                <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{article.title || "Article sans titre"}</h2>
                    {(authorName || createdAt) && (
                      <p className="mt-2 text-sm text-gray-400">
                        {authorName && <span>{authorName}</span>}
                        {authorName && createdAt && <span> - </span>}
                        {createdAt && <span>Publié le {createdAt}</span>}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-gray-300 line-clamp-3">{getArticlePreview(article)}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {slug ? (
                    <>
                      <Link to={`/blog/${slug}`} className="text-purple-300 hover:text-purple-200 transition">
                        Voir
                      </Link>
                      {userCanManageArticle && (
                        <>
                          <Link to={`/articles/${slug}/edit`} className="text-purple-300 hover:text-purple-200 transition">
                            Modifier
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteArticle(slug)}
                            disabled={deletingSlug === slug}
                            className="text-red-200 hover:text-red-100 disabled:opacity-60 transition"
                          >
                            {deletingSlug === slug ? "Suppression..." : "Supprimer"}
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-400">Slug indisponible</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {activeTab === "users" && (
        <div className="grid gap-5">
          {loadingUsers && <p className="text-purple-300">Chargement des utilisateurs...</p>}

          {!loadingUsers && users.length === 0 && (
            <div className="border border-purple-500/40 rounded-lg bg-[#20223f] p-6">
              <p className="text-gray-300">Aucun utilisateur disponible.</p>
            </div>
          )}

          {users.map((user) => {
            const userId = getAdminUserId(user);
            const active = isActiveUser(user);
            const joinedAt = formatDate(user.date_joined || user.created_at);

            return (
              <article key={userId || user.email || user.username} className="border border-purple-500/40 rounded-lg bg-[#20223f] p-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{getUserName(user)}</h2>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                      {user.email && <span>{user.email}</span>}
                      {joinedAt && <span>Inscrit le {joinedAt}</span>}
                      {user.is_staff && <span>Admin</span>}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-lg px-3 py-1 text-sm ${
                        active ? "bg-emerald-500/15 text-emerald-200" : "bg-amber-500/15 text-amber-200"
                      }`}
                    >
                      {active ? "Validé" : "En attente"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUserValidation(user, active)}
                      disabled={!userId || updatingUserId === userId || user.is_staff}
                      className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white transition"
                    >
                      {updatingUserId === userId ? "Modification..." : active ? "Désactiver" : "Valider"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
