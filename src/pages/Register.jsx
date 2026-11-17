import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useForm } from '../hooks/useForm.js';
import { validateRegister } from '../lib/validators.js';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [notice, setNotice] = useState('');

  const { values, errors, submitError, submitting, handleChange, handleSubmit } = useForm(
    { username: '', email: '', password: '', confirm: '' },
    validateRegister,
    async ({ username, email, password }) => {
      const { needsConfirmation } = await register(username.trim(), email.trim(), password);
      if (needsConfirmation) {
        setNotice('Account created! Check your email to confirm it, then log in.');
      } else {
        navigate('/recipes', { replace: true });
      }
    }
  );

  return (
    <section className="narrow">
      <h1>Create account</h1>
      {notice && <p className="alert alert-success">{notice}</p>}
      <form className="form" onSubmit={handleSubmit} noValidate>
        <ErrorMessage message={submitError} />
        <div className="field">
          <label htmlFor="username">Username</label>
          <input id="username" name="username" value={values.username} onChange={handleChange} autoComplete="username" />
          {errors.username && <p className="field-error">{errors.username}</p>}
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={values.email} onChange={handleChange} autoComplete="email" />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={values.password} onChange={handleChange} autoComplete="new-password" />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>
        <div className="field">
          <label htmlFor="confirm">Confirm password</label>
          <input id="confirm" name="confirm" type="password" value={values.confirm} onChange={handleChange} autoComplete="new-password" />
          {errors.confirm && <p className="field-error">{errors.confirm}</p>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Creating…' : 'Sign up'}
        </button>
        <p className="muted">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
}
