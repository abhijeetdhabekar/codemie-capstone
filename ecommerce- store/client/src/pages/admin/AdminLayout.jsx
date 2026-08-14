import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  const linkStyle = ({ isActive }) => ({
    padding: '10px 18px',
    border: '2px solid black',
    fontWeight: 800,
    textTransform: 'uppercase',
    background: isActive ? 'var(--red)' : 'var(--white)',
    color: isActive ? 'var(--white)' : 'var(--black)'
  });

  return (
    <div className="container page">
      <h1 className="section-title">Admin Dashboard</h1>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <NavLink to="/admin/products" style={linkStyle}>
          Products
        </NavLink>
        <NavLink to="/admin/orders" style={linkStyle}>
          Orders
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
}
