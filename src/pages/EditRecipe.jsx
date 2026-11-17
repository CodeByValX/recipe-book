import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getRecipe, updateRecipe } from '../api/recipes.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useFetch } from '../hooks/useFetch.js';
import RecipeForm from '../components/RecipeForm.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function EditRecipe() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: recipe, loading, error, reload } = useFetch(() => getRecipe(recipeId), [recipeId]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;
  if (!recipe) return null;

  // Owner guard: only the author may edit
  if (recipe.author_id !== user.id) return <Navigate to={`/recipes/${recipe.id}`} replace />;

  async function handleUpdate(values) {
    await updateRecipe(recipe.id, {
      title: values.title.trim(),
      category: values.category,
      cook_time: Number(values.cook_time),
      image_url: values.image_url.trim() || null,
      ingredients: values.ingredients.trim(),
      instructions: values.instructions.trim(),
    });
    navigate(`/recipes/${recipe.id}`);
  }

  return (
    <section className="narrow">
      <h1>Edit recipe</h1>
      <RecipeForm
        initialValues={{
          title: recipe.title,
          category: recipe.category,
          cook_time: String(recipe.cook_time),
          image_url: recipe.image_url || '',
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
        }}
        onSubmit={handleUpdate}
        submitLabel="Save changes"
      />
    </section>
  );
}
