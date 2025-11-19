import React, { useRef, useState } from "react";
import { createReview } from "../services/ReviewService";

export default function CreateReviewForm({ productId, onReviewCreated }) {
  const reviewerNameRef = useRef();
  const ratingRef = useRef();
  const commentRef = useRef();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const newReview = {
        productId: parseInt(productId),
        reviewerName: reviewerNameRef.current.value || 'Anonymous',
        rating: parseInt(ratingRef.current.value),
        comment: commentRef.current.value
      };

      if (newReview.rating < 1 || newReview.rating > 5) {
        alert('Rating must be between 1 and 5');
        setSubmitting(false);
        return;
      }

      await createReview(newReview);
      
      // Reset form
      reviewerNameRef.current.value = '';
      ratingRef.current.value = '5';
      commentRef.current.value = '';

      if (onReviewCreated) {
        onReviewCreated();
      }

      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error creating review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <h5>Write a Review</h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="reviewerName" className="form-label">Your Name (Optional)</label>
          <input
            ref={reviewerNameRef}
            type="text"
            className="form-control"
            id="reviewerName"
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="rating" className="form-label">Rating</label>
          <select ref={ratingRef} className="form-select" id="rating" defaultValue="5" required>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="comment" className="form-label">Comment</label>
          <textarea
            ref={commentRef}
            className="form-control"
            id="comment"
            rows="4"
            placeholder="Write your review here..."
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}


