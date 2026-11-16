import { supabase } from '../lib/supabase';

function unwrap({ data, error }) {
  if (error) {
    if (error.code === 'PGRST116') throw new Error('Recipe not found or you are not allowed to do this.');
    throw new Error(error.message || 'Something went wrong. Please try again.');
  }
  return data;
}

const count = (rel) => (rel && rel[0] ? rel[0].count : 0);
const withCounts = (r) => ({ ...r, likesCount: count(r.likes), commentsCount: count(r.comments) });

export async function getRecipes() {
  const data = unwrap(
    await supabase.from('recipes').select('*, likes(count), comments(count)').order('created_at', { ascending: false })
  );
  return data.map(withCounts);
}

export async function getMyRecipes(userId) {
  const data = unwrap(
    await supabase
      .from('recipes')
      .select('*, likes(count), comments(count)')
      .eq('author_id', userId)
      .order('created_at', { ascending: false })
  );
  return data.map(withCounts);
}

export async function getRecipe(id) {
  return unwrap(await supabase.from('recipes').select('*').eq('id', id).single());
}

export async function createRecipe(recipe) {
  return unwrap(await supabase.from('recipes').insert(recipe).select().single());
}

export async function updateRecipe(id, recipe) {
  return unwrap(await supabase.from('recipes').update(recipe).eq('id', id).select().single());
}

export async function deleteRecipe(id) {
  unwrap(await supabase.from('recipes').delete().eq('id', id));
}

export async function getLikes(recipeId) {
  return unwrap(await supabase.from('likes').select('user_id').eq('recipe_id', recipeId));
}

export async function likeRecipe(recipeId) {
  unwrap(await supabase.from('likes').insert({ recipe_id: recipeId }));
}

export async function unlikeRecipe(recipeId, userId) {
  unwrap(await supabase.from('likes').delete().eq('recipe_id', recipeId).eq('user_id', userId));
}

export async function getComments(recipeId) {
  return unwrap(
    await supabase.from('comments').select('*').eq('recipe_id', recipeId).order('created_at', { ascending: true })
  );
}

export async function addComment(recipeId, text, authorName) {
  return unwrap(
    await supabase.from('comments').insert({ recipe_id: recipeId, text, author_name: authorName }).select().single()
  );
}

export async function deleteComment(id) {
  unwrap(await supabase.from('comments').delete().eq('id', id));
}
