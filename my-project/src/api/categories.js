import axiosInstance from './axios';

export const getCategories = () => axiosInstance.get('/category/list');

export const getCategoryById = (id) => axiosInstance.get(`/category/${id}`);

export const addCategory = (formData) => axiosInstance.post('/category/add', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});