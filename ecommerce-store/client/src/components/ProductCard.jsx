import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-card-img">
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
      <div className="product-card-body">
        <span className="product-card-cat">{product.category}</span>
        <h3 className="product-card-title">{product.name}</h3>
        <div className="stars">
          {'★'.repeat(Math.round(product.rating || 0))}
          {'☆'.repeat(5 - Math.round(product.rating || 0))}
          <span style={{ color: 'var(--gray)', marginLeft: 6 }}>({product.numReviews || 0})</span>
        </div>
        <span className="product-card-price">₹{product.price.toLocaleString('en-IN')}</span>
        {product.countInStock === 0 && <span className="badge badge-red">Out of stock</span>}
      </div>
    </Link>
  );
}
