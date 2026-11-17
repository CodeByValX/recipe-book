import { Link } from 'react-router-dom';
import { getMyRecipes } from '../api/recipes.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useFetch } from '../hooks/useFetch.js';
import RecipeCard from '../components/RecipeCard.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function MyRecipes() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch(() => getMyRecipes(user.id), [user.id]);

  return (
    <>
      <h1>My recipes</h1>
      {loading && <Spinner />}
      <ErrorMessage message={error} onRetry={reload} />
      {!loading && !error && data?.length === 0 && (
        <p className="muted">
          You haven't added any recipes yet. <Link to="/recipes/create">Add your first one</Link>.
        </p>
      )}
      <div className="grid">
        {(data || []).map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </div>
    </>
  );
}
