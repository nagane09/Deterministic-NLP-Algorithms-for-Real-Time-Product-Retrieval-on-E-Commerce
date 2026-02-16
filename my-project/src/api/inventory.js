import axiosInstance from './axios';

export const getAllInventory = () => axiosInstance.get('/inventory/list');
export const updateInventory = (data) => axiosInstance.post('/inventory/add', data);
export const getInventoryByProduct = (productId) => axiosInstance.get(`/inventory/product/${productId}`);
export const addVariant = (data) => axiosInstance.post('/variant/add', data);