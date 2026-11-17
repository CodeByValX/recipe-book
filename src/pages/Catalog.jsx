import { useMemo, useState } from 'react';
import { getRecipes } from '../api/recipes.js';
import { useFetch } from '../hooks/useFetch.js';
import RecipeCard from '../components/RecipeCard.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { CATEGORIES } from '../components/RecipeForm.jsx';

export default function Catalog() {
  const { data, loading, error, reload } = useFetch(getRecipes, []);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');

  const recipes = useMemo(() => {
    let list = data || [];
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((r) => r.title.toLowerCase().includes(q));
    if (category) list = list.filter((r) => r.category === category);

    const sorted = [...list];
    if (sort === 'popular') sorted.sort((a, b) => b.likesCount - a.likesCount);
    else if (sort === 'quickest') sorted.sort((a, b) => a.cook_time - b.cook_time);
    return sorted;
  }, [data, search, category, sort]);

  return (
    <>
      <h1>Recipes</h1>

      <div className="toolbar">
        <input
          type="search"
          aria-label="Search recipes"
          placeholder="Search by title…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select aria-label="Sort recipes" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="popular">Most liked</option>
          <option value="quickest">Quickest</option>
        </select>
      </div>

      {loading && <Spinner />}
      <ErrorMessage message={error} onRetry={reload} />
      {!loading && !error && recipes.length === 0 && <p className="muted">No recipes found.</p>}

      <div className="grid">
        {recipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </div>
    </>
  );
}
