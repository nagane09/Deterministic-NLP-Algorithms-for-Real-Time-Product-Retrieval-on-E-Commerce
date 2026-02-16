import axiosInstance from './axios';

export const registerUser = (data) => axiosInstance.post('/user/register', data);
export const loginUser = (data) => axiosInstance.post('/user/login', data);
export const logoutUser = () => axiosInstance.get('/user/logout');
export const checkUserAuth = () => axiosInstance.get('/user/is-auth');

export const loginSeller = (data) => axiosInstance.post('/seller/login', data);
export const logoutSeller = () => axiosInstance.get('/seller/logout');
export const checkSellerAuth = () => axiosInstance.get('/seller/is-auth');