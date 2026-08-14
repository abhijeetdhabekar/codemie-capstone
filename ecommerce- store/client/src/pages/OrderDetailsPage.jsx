import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';
import Message from '../components/Message';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load order'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <div className="container page"><Message>{error}</Message></div>;
  if (!order) return null;

  return (
    <div className="container page">
      <h1 className="section-title">Order #{order._id.slice(-8).toUpperCase()}</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="panel">
            <h3>Shipping Address</h3>
            <p style={{ marginTop: 8 }}>
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.line1} {order.shippingAddress.line2}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}<br />
              Phone: {order.shippingAddress.phone}
            </p>
            <span className={`badge ${order.isDelivered ? '' : 'badge-red'}`} style={{ marginTop: 12 }}>
              {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : 'Not Delivered'}
            </span>
          </div>

          <div className="panel">
            <h3>Payment Method</h3>
            <p style={{ marginTop: 8 }}>{order.paymentMethod}</p>
            <span className={`badge ${order.isPaid ? '' : 'badge-red'}`} style={{ marginTop: 12 }}>
              {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Not Paid'}
            </span>
          </div>

          <div className="panel">
            <h3 style={{ marginBottom: 12 }}>Order Items</h3>
            {order.orderItems.map((item) => (
              <div key={item.product} className="flex-between" style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={item.image} alt={item.name} style={{ width: 50, height: 50, objectFit: 'cover', border: '2px solid black' }} />
                  <span>{item.name}</span>
                </div>
                <span>{item.qty} × ₹{item.price.toLocaleString('en-IN')} = ₹{(item.qty * item.price).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel" style={{ alignSelf: 'start' }}>
          <h3 style={{ marginBottom: 16 }}>Order Summary</h3>
          <div className="flex-between"><span>Items</span><span>₹{order.itemsPrice.toLocaleString('en-IN')}</span></div>
          <div className="flex-between"><span>Shipping</span><span>₹{order.shippingPrice.toLocaleString('en-IN')}</span></div>
          <div className="flex-between"><span>Tax</span><span>₹{order.taxPrice.toLocaleString('en-IN')}</span></div>
          <hr style={{ margin: '12px 0', border: 'none', borderTop: '2px solid black' }} />
          <div className="flex-between" style={{ fontWeight: 900, fontSize: '1.1rem' }}>
            <span>Total</span><span>₹{order.totalPrice.toLocaleString('en-IN')}</span>
          </div>
          <span className="badge" style={{ marginTop: 16 }}>{order.status}</span>
        </div>
      </div>
    </div>
  );
}
