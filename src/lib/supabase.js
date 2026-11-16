const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin({ email, password }) {
  const e = {};
  if (!EMAIL_RE.test(email.trim())) e.email = 'Enter a valid email address.';
  if (!password) e.password = 'Password is required.';
  return e;
}

export function validateRegister({ username, email, password, confirm }) {
  const e = {};
  if (username.trim().length < 3) e.username = 'Username must be at least 3 characters.';
  else if (username.trim().length > 20) e.username = 'Username must be at most 20 characters.';
  if (!EMAIL_RE.test(email.trim())) e.email = 'Enter a valid email address.';
  if (password.length < 6) e.password = 'Password must be at least 6 characters.';
  if (confirm !== password) e.confirm = 'Passwords do not match.';
  return e;
}

export function validateRecipe({ title, cook_time, image_url, ingredients, instructions }) {
  const e = {};
  const t = title.trim();
  if (t.length < 3 || t.length > 80) e.title = 'Title must be between 3 and 80 characters.';

  const minutes = Number(cook_time);
  if (!cook_time || !Number.isInteger(minutes) || minutes < 1 || minutes > 1440)
    e.cook_time = 'Cooking time must be a whole number between 1 and 1440 minutes.';

  if (image_url.trim()) {
    try {
      const u = new URL(image_url.trim());
      if (!['http:', 'https:'].includes(u.protocol)) throw new Error();
    } catch {
      e.image_url = 'Image must be a valid http(s) URL.';
    }
  }

  if (ingredients.trim().length < 10) e.ingredients = 'List the ingredients (at least 10 characters).';
  if (instructions.trim().length < 20) e.instructions = 'Describe the steps (at least 20 characters).';
  return e;
}

export function validateComment(text) {
  const t = text.trim();
  if (t.length < 2) return 'Comment must be at least 2 characters.';
  if (t.length > 500) return 'Comment must be at most 500 characters.';
  return '';
}