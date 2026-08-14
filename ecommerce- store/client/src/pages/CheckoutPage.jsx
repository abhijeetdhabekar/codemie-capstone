import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import Message from '../components/Message';

const initialAddress = {
  fullName: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  phone: ''
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState(initialAddress);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const shipping = subtotal > 999 ? 0 : 49;
  const tax = Number((0.05 * subtotal).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));

  const handleChange = (field) => (e) => setAddress((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const orderItems = items.map((i) => ({ product: i._id, name: i.name, image: i.image, price: i.price, qty: i.qty }));
      const { data } = await api.post('/orders', { orderItems, shippingAddress: address, paymentMethod });
      clearCart();
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container page">
      <h1 className="section-title">Checkout</h1>
      {error && <Message>{error}</Message>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div className="panel">
          <h3 style={{ marginBottom: 16 }}>Shipping Address</h3>
          <div className="field">
            <label>Full Name</label>
            <input required value={address.fullName} onChange={handleChange('fullName')} />
          </div>
          <div className="field">
            <label>Address Line 1</label>
            <input required value={address.line1} onChange={handleChange('line1')} />
          </div>
          <div className="field">
            <label>Address Line 2 (optional)</label>
            <input value={address.line2} onChange={handleChange('line2')} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field">
              <label>City</label>
              <input required value={address.city} onChange={handleChange('city')} />
            </div>
            <div className="field">
              <label>State</label>
              <input required value={address.state} onChange={handleChange('state')} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field">
              <label>Postal Code</label>
              <input required value={address.postalCode} onChange={handleChange('postalCode')} />
            </div>
            <div className="field">
              <label>Country</label>
              <input required value={address.country} onChange={handleChange('country')} />
            </div>
          </div>
          <div className="field">
            <label>Phone</label>
            <input required value={address.phone} onChange={handleChange('phone')} />
          </div>

          <h3 style={{ margin: '20px 0 12px' }}>Payment Method</h3>
          <div className="field">
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="COD">Cash on Delivery</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
            </select>
          </div>
        </div>

        <div className="panel" style={{ alignSelf: 'start' }}>
          <h3 style={{ marginBottom: 16 }}>Order Summary</h3>
          {items.map((i) => (
            <div key={i._id} className="flex-between" style={{ marginBottom: 8, fontSize: '0.9rem' }}>
              <span>{i.name} × {i.qty}</span>
              <span>₹{(i.price * i.qty).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <hr style={{ margin: '12px 0', border: 'none', borderTop: '2px solid black' }} />
          <div className="flex-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
          <div className="flex-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
          <div className="flex-between"><span>Tax (5%)</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
          <hr style={{ margin: '12px 0', border: 'none', borderTop: '2px solid black' }} />
          <div className="flex-between" style={{ fontWeight: 900, fontSize: '1.1rem' }}>
            <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={submitting} style={{ marginTop: 16 }}>
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
