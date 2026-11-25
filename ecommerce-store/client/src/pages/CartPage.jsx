import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { items, updateQty, removeFromCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container page">
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p style={{ margin: '12px 0' }}>Add some products to get started.</p>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1 className="section-title">Shopping Cart</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item) => (
            <div key={item._id} className="panel flex-between">
              <img
                src={item.image}
                alt={item.name}
                style={{ width: 70, height: 70, objectFit: 'cover', border: '2px solid black' }}
              />
              <div style={{ flex: 1, marginLeft: 16 }}>
                <Link to={`/product/${item._id}`} style={{ fontWeight: 800 }}>
                  {item.name}
                </Link>
                <p style={{ color: 'var(--red)', fontWeight: 800 }}>
                  ₹{item.price.toLocaleString('en-IN')}
                </p>
              </div>
              <select
                value={item.qty}
                onChange={(e) => updateQty(item._id, Number(e.target.value))}
                style={{ marginRight: 12 }}
              >
                {Array.from({ length: Math.min(item.countInStock, 10) }, (_, i) => i + 1).map(
                  (n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  )
                )}
              </select>
              <button className="btn btn-sm" onClick={() => removeFromCart(item._id)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="panel" style={{ alignSelf: 'start' }}>
          <h3 style={{ marginBottom: 16 }}>Order Summary</h3>
          <div className="flex-between">
            <span>Subtotal</span>
            <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
          </div>
          <p style={{ color: 'var(--gray)', fontSize: '0.85rem', margin: '8px 0' }}>
            Shipping & tax calculated at checkout.
          </p>
          <button className="btn btn-primary btn-block" onClick={handleCheckout} style={{ marginTop: 12 }}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
