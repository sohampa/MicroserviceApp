import React, {useEffect, useContext, useState} from "react";
import {NavLink, useParams, useNavigate} from "react-router-dom";
import {deleteProductById, getProductById} from "../services/ApiService";
import {ProductContext} from "../context/ProductContext";
import { getAverageRating } from "../services/ReviewService";
import ReviewList from "./ReviewList";
import CreateReviewForm from "./CreateReviewForm";

export default function ProductDetail() {

  const { id } = useParams();
  const { product, updateProduct, removeProductById } = useContext(ProductContext);
  const navigate = useNavigate();
  const [averageRating, setAverageRating] = useState(0);
  const [reviewKey, setReviewKey] = useState(0); // Force re-render of ReviewList

  useEffect(() => {

    async function fetchData() {
      try {
        const product = await getProductById(id);
        updateProduct(product);
        // Fetch average rating
        try {
          const rating = await getAverageRating(id);
          setAverageRating(rating || 0);
        } catch (error) {
          console.error('Error fetching average rating:', error);
          setAverageRating(0);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    fetchData();
  }, [id]);

  const handleReviewCreated = () => {
    // Refresh reviews and rating
    setReviewKey(prev => prev + 1);
    fetchAverageRating();
  };

  const handleReviewDeleted = () => {
    fetchAverageRating();
  };

  const fetchAverageRating = async () => {
    try {
      const rating = await getAverageRating(id);
      setAverageRating(rating || 0);
    } catch (error) {
      console.error('Error fetching average rating:', error);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} style={{ color: '#ffc107', fontSize: '1.2em' }}>★</span>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span key={i} style={{ color: '#ffc107', fontSize: '1.2em' }}>½</span>
        );
      } else {
        stars.push(
          <span key={i} style={{ color: '#e0e0e0', fontSize: '1.2em' }}>★</span>
        );
      }
    }
    return stars;
  };

  async function deleteProduct() {
    try {
      await deleteProductById(id);
      removeProductById(id);
      navigate("/");
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  return(
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <NavLink to="/">Products</NavLink>
          </li>
          <li className="breadcrumb-item">
            <NavLink active to={`/${id}`}>{id}</NavLink>
          </li>
        </ol>
      </nav>
      <h4 className="text-center mb-5 mt-5">Product Info: {id}</h4>
      {averageRating > 0 && (
        <div className="text-center mb-3">
          <strong>Average Rating: </strong>
          {renderStars(averageRating)}
          <span className="ms-2">({averageRating.toFixed(1)})</span>
        </div>
      )}
      <table className="table">
        <tbody>
        <tr>
          <th scope="row">Title</th>
          <td>{product.title}</td>
        </tr>
        <tr>
          <th scope="row">Price</th>
          <td>${product.price}</td>
        </tr>
        <tr>
          <th scope="row">Quantity</th>
          <td>{product.quantity}</td>
        </tr>
        </tbody>
      </table>
      <div>
        <div className="row">
          <div className="col-6">
            <NavLink className="btn btn-light" to={`/${id}/edit`}>Edit</NavLink>
          </div>
          <div className="col-6 text-end">
            <button onClick={deleteProduct} className="btn btn-danger pull-right">Delete</button>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      <CreateReviewForm productId={id} onReviewCreated={handleReviewCreated} />
      <ReviewList key={reviewKey} productId={id} onReviewDeleted={handleReviewDeleted} />
    </div>
  );

}