import { useState, useEffect, useCallback } from 'react';
import { Order, OrderFilters, OrderStatus } from '../types/Order';
import { orderAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OrderFilters>({});

  const fetchOrders = useCallback(async (currentFilters?: OrderFilters) => {
    try {
      setLoading(true);
      setError(null);

      const allOrdersData = await orderAPI.getOrders({});
      setAllOrders(allOrdersData);

      const filteredFilters = currentFilters || filters;
      const fetchedOrders = await orderAPI.getOrders(filteredFilters);
      setOrders(fetchedOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const cancelOrder = useCallback(async (orderId: string) => {
    try {
      setError(null);
      const updatedOrder = await orderAPI.cancelOrder(orderId);

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? updatedOrder : order
        )
      );
      setAllOrders(prev =>
        prev.map(order =>
          order.id === orderId ? updatedOrder : order
        )
      );

      return updatedOrder;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel order';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const createOrder = useCallback(async (orderData: { userId: string; product: string; quantity: number; amount: number }) => {
    try {
      setError(null);
      const newOrder = await orderAPI.createOrder(orderData);

      setOrders(prev => [newOrder, ...prev]);
      setAllOrders(prev => [newOrder, ...prev]);

      return newOrder;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const updateFilters = useCallback((newFilters: OrderFilters) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const getOrdersByStatus = useCallback((status: OrderStatus) => {
    return orders.filter(order => order.status === status);
  }, [orders]);

  const getOrdersCount = useCallback(() => {
    const ordersToCount = filters.userId
      ? allOrders.filter(order => order.userId === filters.userId)
      : allOrders;

    return {
      total: ordersToCount.length,
      pending: ordersToCount.filter(order => order.status === 'pending').length,
      completed: ordersToCount.filter(order => order.status === 'completed').length,
      cancelled: ordersToCount.filter(order => order.status === 'cancelled').length,
    };
  }, [allOrders, filters.userId]);

  const fetchUsers = useCallback(async () => {
    try {
      const fetchedUsers = await orderAPI.getUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [fetchOrders, fetchUsers, user?.role]);

  return {
    orders,
    users,
    loading,
    error,
    filters,
    fetchOrders,
    cancelOrder,
    createOrder,
    updateFilters,
    clearFilters,
    getOrdersByStatus,
    getOrdersCount,
    refetch: () => fetchOrders(),
  };
};