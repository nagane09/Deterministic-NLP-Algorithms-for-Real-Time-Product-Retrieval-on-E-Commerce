import axiosInstance from './axios';

export const getCart = () => axiosInstance.get('/cart');
export const addToCart = (productId, variantId, quantity) => 
    axiosInstance.post('/cart/add', { productId, variantId, quantity });
export const updateCartQuantity = (productId, variantId, quantity) => 
    axiosInstance.post('/cart/update', { productId, variantId, quantity });
export const removeFromCart = (productId, variantId) => 
    axiosInstance.post('/cart/remove', { productId, variantId });