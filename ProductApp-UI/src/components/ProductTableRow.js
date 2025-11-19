import { NavLink } from "react-router-dom";
import {deleteProductById} from "../services/ApiService";
import {useContext, useEffect, useState} from 'react';
import {ProductContext} from "../context/ProductContext";
import { getAverageRating } from "../services/ReviewService";

export default function ProductTableRow ({id, title, price, quantity}) {

  const {removeProductById} = useContext(ProductContext);
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    // Fetch average rating for this product
    const fetchRating = async () => {
      try {
        const rating = await getAverageRating(id);
        setAverageRating(rating || 0);
      } catch (error) {
        // If no reviews exist, rating will be 0
        setAverageRating(0);
      }
    };
    fetchRating();
  }, [id]);

  async function deleteProduct() {
    try {
      await deleteProductById(id);
      removeProductById(id);

    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  const renderStars = (rating) => {
    if (rating === null || rating === 0) {
      return <span className="text-muted">No ratings</span>;
    }
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} style={{ color: '#ffc107', fontSize: '0.9em' }}>★</span>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span key={i} style={{ color: '#ffc107', fontSize: '0.9em' }}>½</span>
        );
      } else {
        stars.push(
          <span key={i} style={{ color: '#e0e0e0', fontSize: '0.9em' }}>★</span>
        );
      }
    }
    return <span>{stars} <small>({rating.toFixed(1)})</small></span>;
  };

  return(
    <tr>
      <th scope="row">{id}</th>
      <td>{title}</td>
      <td>${price}</td>
      <td>{quantity}</td>
      <td>{renderStars(averageRating)}</td>
      <td>
        <div className="btn-group">
          <NavLink className="btn btn-info" to={`/${id}`}>View</NavLink>
          <NavLink className="btn btn-light" to={`/${id}/edit`}>Edit</NavLink>
          <button onClick={deleteProduct} className="btn btn-danger">Delete</button>
        </div>
      </td>
    </tr>
  );
}