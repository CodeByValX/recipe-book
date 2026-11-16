import { useForm } from '../hooks/useForm.js';
import { validateRecipe } from '../lib/validators.js';
import ErrorMessage from './ErrorMessage.jsx';

export const CATEGORIES = ['Breakfast', 'Soup', 'Main course', 'Salad', 'Dessert', 'Snack', 'Drink', 'Other'];

const EMPTY = {
  title: '',
  category: 'Main course',
  cook_time: '',
  image_url: '',
  ingredients: '',
  instructions: '',
};

export default function RecipeForm({ initialValues, onSubmit, submitLabel }) {
  const { values, errors, submitError, submitting, handleChange, handleSubmit } = useForm(
    { ...EMPTY, ...initialValues },
    validateRecipe,
    onSubmit
  );

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <ErrorMessage message={submitError} />

      <div className="field">
        <label htmlFor="title">Title</label>
        <input id="title" name="title" value={values.title} onChange={handleChange} placeholder="e.g. Grandma's banitsa" />
        {errors.title && <p className="field-error">{errors.title}</p>}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={values.category} onChange={handleChange}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="cook_time">Cooking time (minutes)</label>
          <input id="cook_time" name="cook_time" type="number" min="1" value={values.cook_time} onChange={handleChange} />
          {errors.cook_time && <p className="field-error">{errors.cook_time}</p>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="image_url">Image URL (optional)</label>
        <input id="image_url" name="image_url" value={values.image_url} onChange={handleChange} placeholder="https://…" />
        {errors.image_url && <p className="field-error">{errors.image_url}</p>}
      </div>

      <div className="field">
        <label htmlFor="ingredients">Ingredients</label>
        <textarea id="ingredients" name="ingredients" rows="5" value={values.ingredients} onChange={handleChange} placeholder="One ingredient per line" />
        {errors.ingredients && <p className="field-error">{errors.ingredients}</p>}
      </div>

      <div className="field">
        <label htmlFor="instructions">Instructions</label>
        <textarea id="instructions" name="instructions" rows="7" value={values.instructions} onChange={handleChange} placeholder="Describe the steps" />
        {errors.instructions && <p className="field-error">{errors.instructions}</p>}
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
