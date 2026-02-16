import axiosInstance from './axios';

export const sendAiMessage = (message) => axiosInstance.post('/ai/chat', { message });