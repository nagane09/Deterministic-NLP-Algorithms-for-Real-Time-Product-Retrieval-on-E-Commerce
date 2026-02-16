import axiosInstance from './axios';

export const getBrands = () => axiosInstance.get('/brand/list');
export const addBrand = (formData) => axiosInstance.post('/brand/add', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});