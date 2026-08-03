import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FavoriteButton from "../components/FavoriteButton";
import { useAuth } from "../hooks/useAuth";
import { type Article, deleteArticle, fetchArticle } from "../lib/articles";
import { canManageArticle, getAuthorName } from "../lib/articleOwnership";

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { authenticated, user } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadArticle() {
      if (!slug) {
        setMessage("Article introuvable.");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchArticle(slug);

        if (!ignore) {
          setArticle(data);
        }
      } catch (error) {
        if (!ignore) {
          setMessage(error instanceof Error ? error.message : "Impossible de charger l'article.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadArticle();

    return () => {
      ignore = true;
    };
  }, [slug]);

  async function handleDelete() {
    const articleSlug = article?.slug || slug;

    if (!articleSlug || !window.confirm("Supprimer cette publication ?")) {
      return;
    }

    setActionMessage("");
    setDeleting(true);

    try {
      await deleteArticle(articleSlug);
      navigate("/blog");
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Impossible de supprimer l'article.");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <section className="px-8 pb-20 max-w-4xl mx-auto">
        <p className="text-purple-300">Chargement de l'article...</p>
      </section>
    );
  }

  if (message || !article) {
    return (
      <section className="px-8 pb-20 max-w-4xl mx-auto">
        <p className="text-purple-300 mb-6">{message || "Article introuvable."}</p>
        <Link to="/blog" className="text-purple-400 hover:text-purple-300 transition">
          Retour au blog
        </Link>
      </section>
    );
  }

  const authorName = getAuthorName(article);
  const content = article.content || article.body || "";
  const userCanManageArticle = authenticated && canManageArticle(article, user);

  return (
    <article className="px-8 pb-20 max-w-4xl mx-auto">
      <Link to="/blog" className="inline-flex mb-8 text-purple-400 hover:text-purple-300 transition">
        Retour au blog
      </Link>

      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{article.title || "Article sans titre"}</h1>

      {(authorName || article.created_at) && (
        <p className="text-sm text-gray-400 mb-10">
          {authorName && <span>{authorName}</span>}
          {authorName && article.created_at && <span> - </span>}
          {article.created_at && <time dateTime={article.created_at}>{new Date(article.created_at).toLocaleDateString()}</time>}
        </p>
      )}

      <div className="prose prose-invert max-w-none text-gray-200 whitespace-pre-line">
        {content || "Cet article ne contient pas encore de contenu."}
      </div>

      <div className="mt-8">
        <FavoriteButton
          article={article}
          onChange={(update) => setArticle((currentArticle) => currentArticle && { ...currentArticle, ...update })}
        />
      </div>

      {actionMessage && <p className="mt-8 text-sm text-purple-300">{actionMessage}</p>}

      {userCanManageArticle && (
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to={`/articles/${article.slug || slug}/edit`}
            className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition"
          >
            Modifier
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-5 py-2 rounded-lg border border-red-400 text-red-200 hover:bg-red-500/10 disabled:opacity-60 transition"
          >
            {deleting ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      )}
    </article>
  );
}
