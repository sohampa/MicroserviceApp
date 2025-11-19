package com.example.review.service.impl;

import com.example.review.model.Review;
import com.example.review.repository.ReviewRepository;
import com.example.review.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public Review save(Review review) {
        if (review.getReviewDate() == null) {
            review.setReviewDate(java.time.LocalDateTime.now());
        }
        return reviewRepository.save(review);
    }

    @Override
    public Review updateById(Long id, Review review) {
        Review managedReview = this.findById(id);
        if (managedReview != null) {
            managedReview.setReviewerName(review.getReviewerName());
            managedReview.setRating(review.getRating());
            managedReview.setComment(review.getComment());
            return this.save(managedReview);
        }
        return null;
    }

    @Override
    public List<Review> findAll() {
        return reviewRepository.findAll();
    }

    @Override
    public Review findById(Long id) {
        return reviewRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteById(Long id) {
        reviewRepository.deleteById(id);
    }

    @Override
    public List<Review> findByProductId(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    @Override
    public Double getAverageRatingByProductId(Long productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        if (reviews.isEmpty()) {
            return 0.0;
        }
        double sum = reviews.stream()
                .mapToInt(Review::getRating)
                .sum();
        return sum / reviews.size();
    }
}


