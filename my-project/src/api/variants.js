import axiosInstance from './axios';


export const addVariant = (data) => axiosInstance.post('/variant/add', data);
export const getProductVariants = (productId) => axiosInstance.get(`/variant/${productId}`);