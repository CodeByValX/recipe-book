import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  deleteRecipe,
  getComments,
  getLikes,
  getRecipe,
  likeRecipe,
  unlikeRecipe,
} from '../api/recipes.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useFetch } from '../hooks/useFetch.js';
import Spinner from '../components/Spinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Comments from '../components/Comments.jsx';
import { PLACEHOLDER_IMG } from '../components/RecipeCard.jsx';

export default function RecipeDetails() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Re-fetches whenever the URL parameter changes
  const { data, loading, error, reload } = useFetch(
    async () => {
      const [recipe, likes, comments] = await Promise.all([
        getRecipe(recipeId),
        getLikes(recipeId),
        getComments(recipeId),
      ]);
      return { recipe, likes, comments };
    },
    [recipeId]
  );

  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [actionError, setActionError] = useState('');
  const [busy, setBusy] = useState(false);

  // Sync local interactive state when fresh data arrives
  useEffect(() => {
    if (data) {
      setLikes(data.likes);
      setComments(data.comments);
    }
  }, [data]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;
  if (!data) return null;

  const { recipe } = data;
  const isOwner = user?.id === recipe.author_id;
  const liked = likes.some((l) => l.user_id === user?.id);

  async function toggleLike() {
    setActionError('');
    setBusy(true);
    try {
      if (liked) {
        await unlikeRecipe(recipe.id, user.id);
        setLikes((prev) => prev.filter((l) => l.user_id !== user.id));
      } else {
        await likeRecipe(recipe.id);
        setLikes((prev) => [...prev, { user_id: user.id }]);
      }
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this recipe? This cannot be undone.')) return;
    setActionError('');
    try {
      await deleteRecipe(recipe.id);
      navigate('/recipes');
    } catch (err) {
      setActionError(err.message);
    }
  }

  return (
    <article className="details">
      <img
        className="details-img"
        src={recipe.image_url || PLACEHOLDER_IMG}
        alt={recipe.title}
        onError={(e) => {
          e.currentTarget.src = PLACEHOLDER_IMG;
        }}
      />
      <div className="details-head">
        <span className="badge">{recipe.category}</span>
        <h1>{recipe.title}</h1>
        <p className="muted">
          ⏱ {recipe.cook_time} min · by {recipe.author_name} · {new Date(recipe.created_at).toLocaleDateString()}
        </p>
      </div>

      <ErrorMessage message={actionError} />

      <div className="actions">
        {isAuthenticated ? (
          <button type="button" className={liked ? 'btn btn-primary' : 'btn btn-outline'} onClick={toggleLike} disabled={busy}>
            {liked ? '♥ Liked' : '♡ Like'} ({likes.length})
          </button>
        ) : (
          <span className="muted">
            ♥ {likes.length} · <Link to="/login">Log in</Link> to like
          </span>
        )}
        {isOwner && (
          <>
            <Link to={`/recipes/${recipe.id}/edit`} className="btn btn-outline">
              Edit
            </Link>
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </>
        )}
      </div>

      <section>
        <h2>Ingredients</h2>
        <p className="pre">{recipe.ingredients}</p>
      </section>
      <section>
        <h2>Instructions</h2>
        <p className="pre">{recipe.instructions}</p>
      </section>

      <Comments recipeId={recipe.id} comments={comments} onChange={setComments} />
    </article>
  );
}
