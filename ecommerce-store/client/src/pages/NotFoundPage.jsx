import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container page empty-state">
      <h1 style={{ fontSize: '4rem' }}>404</h1>
      <p style={{ margin: '12px 0' }}>Page not found.</p>
      <Link to="/" className="btn btn-primary">
        Go Home
      </Link>
    </div>
  );
}
