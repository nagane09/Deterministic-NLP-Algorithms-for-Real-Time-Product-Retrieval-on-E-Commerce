import axiosInstance from './axios';

export const getAllProducts = () => axiosInstance.get('/product/list');
export const getProductById = (id) => axiosInstance.get(`/product/${id}`);
export const getProductsByCategory = (catId) => axiosInstance.get(`/product/category/${catId}`);

/**
 * @param {Object} data - The product details (name, price, etc.)
 * @param {Array} imageFiles - Array of File objects from input
 */
export const addProduct = (data, imageFiles) => {
    const formData = new FormData();
    
    formData.append('productData', JSON.stringify(data)); 

    if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach((file) => {
            formData.append('images', file);
        });
    }

    return axiosInstance.post('/product/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};