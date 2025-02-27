import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div>
      // ...existing code...
      <Link 
        to={`/product/${product._id}`} 
        className="view-details-button"
      >
        View Details
      </Link>
    </div>
  );
};
