import axiosInstance from './axios';

export const getDiscounts = () => axiosInstance.get('/discount/list');

export const addDiscount = (data) => axiosInstance.post('/discount/add', data);


export const getDiscountById = (id) => axiosInstance.post('/discount/get', { id });