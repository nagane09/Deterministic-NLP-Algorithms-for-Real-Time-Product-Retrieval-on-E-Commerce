import axiosInstance from './axios';

export const getProductReviews = (productId) => axiosInstance.get(`/review/product/${productId}`);
export const addReview = (data) => axiosInstance.post('/review/create', data);
export const deleteReview = (id) => axiosInstance.delete(`/review/${id}`);