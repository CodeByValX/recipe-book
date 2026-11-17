import { Link } from 'react-router-dom';
import { getRecipes } from '../api/recipes.js';
import { useFetch } from '../hooks/useFetch.js';
import RecipeCard from '../components/RecipeCard.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { data, loading, error, reload } = useFetch(getRecipes, []);
  const latest = (data || []).slice(0, 3);

  return (
    <>
      <section className="hero">
        <h1>Cook it. Share it. Love it.</h1>
        <p>A community cookbook where everyone can discover and share their favourite recipes.</p>
        <div className="hero-actions">
          <Link to="/recipes" className="btn btn-primary">
            Browse recipes
          </Link>
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-outline">
              Join for free
            </Link>
          )}
        </div>
      </section>

      <h2>Latest recipes</h2>
      {loading && <Spinner />}
      <ErrorMessage message={error} onRetry={reload} />
      {!loading && !error && latest.length === 0 && <p className="muted">No recipes yet — add the first one!</p>}
      <div className="grid">
        {latest.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </div>
    </>
  );
}
