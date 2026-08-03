import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FavoriteButton from "../components/FavoriteButton";
import { useAuth } from "../hooks/useAuth";
import { type Article, fetchArticles } from "../lib/articles";

function getArticleText(article: Article) {
  return article.excerpt || article.content || article.body || "Lire cet article pour découvrir la suite.";
}

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const { authenticated } = useAuth();

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
          setMessage(error instanceof Error ? error.message : "Impossible de charger les articles.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadArticles();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="px-8 pb-20 max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Blog</h1>
        <p className="text-gray-300 max-w-2xl">
          Retrouvez les derniers articles publiés par l'équipe Weeb.
        </p>
      </div>

      {authenticated && (
        <div className="mb-8">
          <Link
            to="/articles/new"
            className="inline-flex px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition"
          >
            Créer un article
          </Link>
        </div>
      )}

      {loading && <p className="text-purple-300">Chargement des articles...</p>}
      {message && <p className="text-purple-300">{message}</p>}

      {!loading && !message && articles.length === 0 && <p className="text-gray-300">Aucun article disponible.</p>}

      <div className="grid gap-6 md:grid-cols-2">
        {articles.map((article) => {
          const slug = article.slug;

          return (
            <article key={slug || article.title} className="border border-purple-500/50 rounded-lg p-6 bg-[#20223f]">
              <h2 className="text-2xl font-semibold mb-3">{article.title || "Article sans titre"}</h2>
              <p className="text-gray-300 mb-6 line-clamp-3">{getArticleText(article)}</p>
              <div className="flex flex-wrap items-start justify-between gap-4">
                {slug ? (
                  <Link to={`/blog/${slug}`} className="py-2 text-purple-400 font-medium hover:text-purple-300 transition">
                    Lire l'article
                  </Link>
                ) : (
                  <p className="text-sm text-gray-400">Slug indisponible</p>
                )}
                <FavoriteButton
                  article={article}
                  onChange={(update) => {
                    setArticles((currentArticles) =>
                      currentArticles.map((currentArticle) =>
                        currentArticle.slug === slug ? { ...currentArticle, ...update } : currentArticle,
                      ),
                    );
                  }}
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
