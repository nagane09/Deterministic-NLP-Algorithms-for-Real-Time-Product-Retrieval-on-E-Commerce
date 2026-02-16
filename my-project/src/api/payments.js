import axiosInstance from './axios';

export const getPaymentByOrder = (orderId) => axiosInstance.get(`/payment/order/${orderId}`);
export const getAllPayments = () => axiosInstance.get('/payment/all');