import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import TextField from "../components/TextField";
import { createArticle, fetchArticle, updateArticle } from "../lib/articles";

export default function CreateArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(Boolean(slug));
  // La meme page sert a creer ou modifier selon la presence du slug dans l'URL.
  const isEditing = Boolean(slug);

  useEffect(() => {
    let ignore = false;

    async function loadArticle() {
      if (!slug) {
        setInitialLoading(false);
        return;
      }

      try {
        const article = await fetchArticle(slug);

        if (!ignore) {
          setTitle(article.title || "");
          setContent(article.content || article.body || "");
        }
      } catch (error) {
        if (!ignore) {
          setLoadError(error instanceof Error ? error.message : "Impossible de charger l'article.");
        }
      } finally {
        if (!ignore) {
          setInitialLoading(false);
        }
      }
    }

    loadArticle();

    return () => {
      ignore = true;
    };
  }, [slug]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
      };
      const article = slug ? await updateArticle(slug, payload) : await createArticle(payload);

      setMessage(isEditing ? "Article modifié avec succès." : "Article créé avec succès.");
      navigate(article.slug ? `/blog/${article.slug}` : "/blog");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `Impossible de ${isEditing ? "modifier" : "créer"} l'article.`);
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <section className="px-8 pb-20 max-w-4xl mx-auto">
        <p className="text-purple-300">Chargement de l'article...</p>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="px-8 pb-20 max-w-4xl mx-auto">
        <p className="text-purple-300 mb-6">{loadError}</p>
        <Link to="/blog" className="text-purple-400 hover:text-purple-300 transition">
          Retour au blog
        </Link>
      </section>
    );
  }

  return (
    <section className="px-8 pb-20 max-w-4xl mx-auto">
      <Link to={slug ? `/blog/${slug}` : "/blog"} className="inline-flex mb-8 text-purple-400 hover:text-purple-300 transition">
        {isEditing ? "Retour à l'article" : "Retour au blog"}
      </Link>

      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {isEditing ? "Modifier l'article" : "Créer un article"}
        </h1>
        <p className="text-gray-300">
          {isEditing ? "Mettez à jour votre publication." : "Rédigez un nouvel article pour le blog Weeb."}
        </p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <TextField label="Titre" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <TextField
          label="Contenu"
          multiline
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          fieldClassName="resize-y"
        />

        {message && <p className="text-sm text-purple-300">{message}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="px-8"
        >
          {loading ? (isEditing ? "Modification..." : "Création...") : isEditing ? "Enregistrer" : "Publier"}
        </Button>
      </form>
    </section>
  );
}
