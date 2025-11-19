import React, { useEffect, useState } from "react";
import { getReviewsByProductId, deleteReviewById } from "../services/ReviewService";

export default function ReviewList({ productId, onReviewDeleted }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const reviewsData = await getReviewsByProductId(productId);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReviewById(reviewId);
        setReviews(reviews.filter(review => review.id !== reviewId));
        if (onReviewDeleted) {
          onReviewDeleted();
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Failed to delete review');
      }
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? '#ffc107' : '#e0e0e0', fontSize: '1.2em' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return <div className="text-center mt-3">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="mt-4">
        <h5>Reviews</h5>
        <p className="text-muted">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h5>Reviews ({reviews.length})</h5>
      <div className="list-group">
        {reviews.map((review) => (
          <div key={review.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <strong>{review.reviewerName || 'Anonymous'}</strong>
                    <span className="ms-2">{renderStars(review.rating)}</span>
                  </div>
                  <small className="text-muted">{formatDate(review.reviewDate)}</small>
                </div>
                <p className="mb-0">{review.comment}</p>
              </div>
              <button
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={() => handleDelete(review.id)}
                title="Delete review"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


