import { apiClient } from './client';

export const itemsApi = {
    getAll: async () => {
        const response = await apiClient.get('/items');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await apiClient.get(`/items/${id}`);
        return response.data;
    },

    getLowStock: async () => {
        const response = await apiClient.get('/items/low-stock');
        return response.data;
    },

    create: async (data: any) => {
        const response = await apiClient.post('/items', data);
        return response.data;
    },

    update: async (id: number, data: any) => {
        const response = await apiClient.put(`/items/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await apiClient.delete(`/items/${id}`);
        return response.data;
    },
};
