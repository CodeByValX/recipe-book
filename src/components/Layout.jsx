import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import '../styles/layout.css';

export default function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="container main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">Recipe Book · SoftUni React Retake Project</div>
      </footer>
    </div>
  );
}
