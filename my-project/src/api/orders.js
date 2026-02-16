import axiosInstance from './axios';

export const createOrder = (paymentMethod) => axiosInstance.post('/order/create', { paymentMethod });
export const confirmPayment = (paymentIntentId) => axiosInstance.post('/order/confirm-payment', { paymentIntentId });
export const getMyOrders = () => axiosInstance.get('/order/my-orders');
export const getAllOrders = () => axiosInstance.get('/order/all');
export const updateOrderStatus = (orderId, status) => axiosInstance.put(`/order/${orderId}/status`, { status });