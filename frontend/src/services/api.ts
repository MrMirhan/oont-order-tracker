import axios from 'axios';
import { Order, OrderFilters, CreateOrderRequest, UpdateOrderStatusRequest, ApiResponse } from '../types/Order';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);

    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      console.warn('Authentication failed, clearing stored credentials');
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export const orderAPI = {
  getOrders: async (filters?: OrderFilters): Promise<Order[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.userId) params.append('userId', filters.userId);

      const response = await api.get<ApiResponse<Order[]>>(`/orders?${params.toString()}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  getOrderById: async (id: string): Promise<Order> => {
    try {
      const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
      if (!response.data.data) {
        throw new Error('Order not found');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    try {
      const response = await api.post<ApiResponse<Order>>('/orders', orderData);
      if (!response.data.data) {
        throw new Error('Failed to create order');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  updateOrderStatus: async (id: string, statusData: UpdateOrderStatusRequest): Promise<Order> => {
    try {
      const response = await api.put<ApiResponse<Order>>(`/orders/${id}/status`, statusData);
      if (!response.data.data) {
        throw new Error('Failed to update order status');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  deleteOrder: async (id: string): Promise<void> => {
    try {
      await api.delete<ApiResponse<void>>(`/orders/${id}`);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },

  cancelOrder: async (id: string): Promise<Order> => {
    return orderAPI.updateOrderStatus(id, { status: 'cancelled' });
  },

  getUsers: async (): Promise<string[]> => {
    try {
      const response = await api.get<ApiResponse<string[]>>('/orders/users');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
};

export default api;