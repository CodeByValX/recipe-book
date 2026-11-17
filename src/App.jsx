import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import GuestRoute from './components/GuestRoute.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Catalog from './pages/Catalog.jsx';
import RecipeDetails from './pages/RecipeDetails.jsx';
import CreateRecipe from './pages/CreateRecipe.jsx';
import EditRecipe from './pages/EditRecipe.jsx';
import MyRecipes from './pages/MyRecipes.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      {/* Nested routing: Layout renders header/footer and an <Outlet /> for children */}
      <Route element={<Layout />}>
        {/* Public routes (guests can read) */}
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="recipes" element={<Catalog />} />
        <Route path="recipes/:recipeId" element={<RecipeDetails />} />

        {/* Guest-only routes */}
        <Route element={<GuestRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Private routes */}
        <Route element={<PrivateRoute />}>
          <Route path="recipes/create" element={<CreateRecipe />} />
          <Route path="recipes/:recipeId/edit" element={<EditRecipe />} />
          <Route path="my-recipes" element={<MyRecipes />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
