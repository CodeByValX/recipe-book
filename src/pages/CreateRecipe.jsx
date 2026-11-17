import { useNavigate } from 'react-router-dom';
import { createRecipe } from '../api/recipes.js';
import { useAuth } from '../context/AuthContext.jsx';
import RecipeForm from '../components/RecipeForm.jsx';

export default function CreateRecipe() {
  const navigate = useNavigate();
  const { username } = useAuth();

  async function handleCreate(values) {
    const created = await createRecipe({
      title: values.title.trim(),
      category: values.category,
      cook_time: Number(values.cook_time),
      image_url: values.image_url.trim() || null,
      ingredients: values.ingredients.trim(),
      instructions: values.instructions.trim(),
      author_name: username,
    });
    navigate(`/recipes/${created.id}`);
  }

  return (
    <section className="narrow">
      <h1>Add a recipe</h1>
      <RecipeForm onSubmit={handleCreate} submitLabel="Publish recipe" />
    </section>
  );
}
