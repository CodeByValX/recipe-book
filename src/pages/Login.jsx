import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useForm } from '../hooks/useForm.js';
import { validateLogin } from '../lib/validators.js';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { values, errors, submitError, submitting, handleChange, handleSubmit } = useForm(
    { email: '', password: '' },
    validateLogin,
    async ({ email, password }) => {
      await login(email.trim(), password);
      navigate(location.state?.from || '/recipes', { replace: true });
    }
  );

  return (
    <section className="narrow">
      <h1>Login</h1>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <ErrorMessage message={submitError} />
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={values.email} onChange={handleChange} autoComplete="email" />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={values.password} onChange={handleChange} autoComplete="current-password" />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Login'}
        </button>
        <p className="muted">
          No account? <Link to="/register">Sign up</Link>
        </p>
      </form>
    </section>
  );
}
