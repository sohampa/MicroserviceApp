package com.example.review.service;

import com.example.review.model.Review;

import java.util.List;

public interface ReviewService {
    Review save(Review review);

    Review updateById(Long id, Review review);

    List<Review> findAll();

    Review findById(Long id);

    void deleteById(Long id);

    List<Review> findByProductId(Long productId);

    Double getAverageRatingByProductId(Long productId);
}


