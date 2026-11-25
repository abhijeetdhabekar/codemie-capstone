import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { itemsCount } = useCart();

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(keyword.trim() ? `/?keyword=${encodeURIComponent(keyword.trim())}` : '/');
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          STORE<span>FRONT</span>
        </Link>

        <form className="search-bar" onSubmit={submitSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit">GO</button>
        </form>

        <nav className="nav-links">
          <Link to="/" className="cart-badge">
            <span>Shop</span>
          </Link>
          <Link to="/cart" className="cart-badge">
            Cart
            {itemsCount > 0 && <span className="cart-count">{itemsCount}</span>}
          </Link>
          {user ? (
            <>
              <Link to="/orders">Orders</Link>
              {isAdmin && <Link to="/admin">Admin</Link>}
              <button className="btn btn-sm" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-sm btn-primary">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
