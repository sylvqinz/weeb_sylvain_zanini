import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  type Article,
  type FavoriteUpdate,
  favoriteArticle,
  unfavoriteArticle,
} from "../lib/articles";

type FavoriteButtonProps = {
  article: Article;
  onChange: (update: FavoriteUpdate) => void;
};

export default function FavoriteButton({ article, onChange }: FavoriteButtonProps) {
  const { authenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const isFavorite = article.is_favorite === true;
  const favoritesCount = typeof article.favorites_count === "number" ? article.favorites_count : 0;

  async function handleFavorite() {
    if (!authenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    if (!article.slug || pending) {
      return;
    }

    setPending(true);
    setMessage("");

    try {
      const update = isFavorite
        ? await unfavoriteArticle(article.slug)
        : await favoriteArticle(article.slug);

      onChange({
        is_favorite: update.is_favorite,
        favorites_count: update.favorites_count,
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Impossible de modifier ce favori.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleFavorite}
        disabled={pending || !article.slug}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 transition disabled:cursor-not-allowed disabled:opacity-60 ${
          isFavorite
            ? "border-pink-400/70 bg-pink-500/10 text-pink-300 hover:bg-pink-500/20"
            : "border-purple-500/50 text-purple-200 hover:bg-purple-500/10"
        }`}
      >
        <span aria-hidden="true">{isFavorite ? "★" : "☆"}</span>
        <span>{pending ? "Mise à jour..." : favoritesCount}</span>
      </button>
      {message && <span className="max-w-xs text-sm text-red-200">{message}</span>}
    </div>
  );
}
