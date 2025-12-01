import { apiClient } from './client';

export const categoriesApi = {
    getAll: async () => {
        const response = await apiClient.get('/categories');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await apiClient.get(`/categories/${id}`);
        return response.data;
    },

    create: async (data: any) => {
        const response = await apiClient.post('/categories', data);
        return response.data;
    },

    update: async (id: number, data: any) => {
        const response = await apiClient.put(`/categories/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await apiClient.delete(`/categories/${id}`);
        return response.data;
    },
};

export const stockApi = {
    getMovements: async () => {
        const response = await apiClient.get('/stock/movements');
        return response.data;
    },

    createMovement: async (data: any) => {
        const response = await apiClient.post('/stock/movements', data);
        return response.data;
    },

    getItemMovements: async (itemId: number) => {
        const response = await apiClient.get(`/stock/movements/item/${itemId}`);
        return response.data;
    },
};
