import { useState } from 'react';
import { Link } from 'react-router-dom';
import { addComment, deleteComment } from '../api/recipes.js';
import { useAuth } from '../context/AuthContext.jsx';
import { validateComment } from '../lib/validators.js';
import ErrorMessage from './ErrorMessage.jsx';

export default function Comments({ recipeId, comments, onChange }) {
  const { user, isAuthenticated, username } = useAuth();
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const problem = validateComment(text);
    if (problem) return setError(problem);

    setBusy(true);
    setError('');
    try {
      const created = await addComment(recipeId, text.trim(), username);
      onChange([...comments, created]);
      setText('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    setError('');
    try {
      await deleteComment(id);
      onChange(comments.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="comments">
      <h2>Comments ({comments.length})</h2>
      <ErrorMessage message={error} />

      {comments.length === 0 && <p className="muted">No comments yet. Be the first!</p>}
      <ul className="comment-list">
        {comments.map((c) => (
          <li key={c.id} className="comment">
            <div className="comment-head">
              <strong>{c.author_name}</strong>
              <span className="muted">{new Date(c.created_at).toLocaleString()}</span>
            </div>
            <p>{c.text}</p>
            {user?.id === c.author_id && (
              <button type="button" className="btn btn-outline btn-sm" onClick={() => handleDelete(c.id)}>
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="form" noValidate>
          <div className="field">
            <label htmlFor="comment">Add a comment</label>
            <textarea id="comment" rows="3" value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? 'Posting…' : 'Post comment'}
          </button>
        </form>
      ) : (
        <p className="muted">
          <Link to="/login">Log in</Link> to leave a comment.
        </p>
      )}
    </section>
  );
}
