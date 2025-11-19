import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL || window.location.origin;

const reviewApiUrl = `${baseURL}/api/reviews`;

export const getReviews = async () => {
  try {
    const response = await axios.get(reviewApiUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getReviewsByProductId = async (productId) => {
  try {
    const response = await axios.get(`${reviewApiUrl}/product/${productId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getAverageRating = async (productId) => {
  try {
    const response = await axios.get(`${reviewApiUrl}/product/${productId}/average-rating`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const createReview = async (review) => {
  try {
    const response = await axios.post(reviewApiUrl, review);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getReviewById = async (id) => {
  try {
    const response = await axios.get(`${reviewApiUrl}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const updateReviewById = async (id, review) => {
  try {
    const response = await axios.put(`${reviewApiUrl}/${id}`, review);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const deleteReviewById = async (id) => {
  try {
    const response = await axios.delete(`${reviewApiUrl}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}


