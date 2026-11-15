-- Recipe Book schema: recipes, likes, comments + Row Level Security

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  author_name text not null default 'Anonymous',
  title text not null check (char_length(title) between 3 and 80),
  category text not null default 'Other',
  cook_time integer not null check (cook_time between 1 and 1440),
  image_url text,
  ingredients text not null check (char_length(ingredients) >= 10),
  instructions text not null check (char_length(instructions) >= 20),
  created_at timestamptz not null default now()
);

create table public.likes (
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (recipe_id, user_id)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  author_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  author_name text not null default 'Anonymous',
  text text not null check (char_length(text) between 2 and 500),
  created_at timestamptz not null default now()
);

create index recipes_author_idx on public.recipes(author_id);
create index comments_recipe_idx on public.comments(recipe_id);

alter table public.recipes enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;

-- Everyone (guests too) can read
create policy "recipes are public" on public.recipes for select using (true);
create policy "likes are public" on public.likes for select using (true);
create policy "comments are public" on public.comments for select using (true);

-- Only logged-in users can create; only the author can edit / delete
create policy "auth users create recipes" on public.recipes
  for insert to authenticated with check (auth.uid() = author_id);
create policy "author updates recipe" on public.recipes
  for update to authenticated using (auth.uid() = author_id) with check (auth.uid() = author_id);
create policy "author deletes recipe" on public.recipes
  for delete to authenticated using (auth.uid() = author_id);

create policy "auth users like" on public.likes
  for insert to authenticated with check (auth.uid() = user_id);
create policy "user removes own like" on public.likes
  for delete to authenticated using (auth.uid() = user_id);

create policy "auth users comment" on public.comments
  for insert to authenticated with check (auth.uid() = author_id);
create policy "author deletes comment" on public.comments
  for delete to authenticated using (auth.uid() = author_id);
