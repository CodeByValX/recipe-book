import { Link } from 'react-router-dom';

export const PLACEHOLDER_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#f3e9df"/><text x="50%" y="52%" font-size="72" text-anchor="middle">🍽️</text></svg>`
  );

export default function RecipeCard({ recipe }) {
  return (
    <article className="card">
      <img
        className="card-img"
        src={recipe.image_url || PLACEHOLDER_IMG}
        alt={recipe.title}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = PLACEHOLDER_IMG;
        }}
      />
      <div className="card-body">
        <span className="badge">{recipe.category}</span>
        <h3 className="card-title">{recipe.title}</h3>
        <p className="muted">
          ⏱ {recipe.cook_time} min · by {recipe.author_name}
        </p>
        <p className="muted">
          ♥ {recipe.likesCount ?? 0} · 💬 {recipe.commentsCount ?? 0}
        </p>
        <Link to={`/recipes/${recipe.id}`} className="btn btn-primary btn-block">
          View details
        </Link>
      </div>
    </article>
  );
}
