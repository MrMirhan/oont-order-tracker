import { Order } from '../types/Order';

const STORAGE_KEY = 'oont_orders';

export const localStorageUtils = {
  saveOrders: (orders: Order[]): void => {
    try {
      const serializedOrders = JSON.stringify(orders);
      localStorage.setItem(STORAGE_KEY, serializedOrders);
    } catch (error) {
      console.error('Failed to save orders to localStorage:', error);
    }
  },

  loadOrders: (): Order[] | null => {
    try {
      const serializedOrders = localStorage.getItem(STORAGE_KEY);
      if (serializedOrders === null) {
        return null;
      }
      return JSON.parse(serializedOrders);
    } catch (error) {
      console.error('Failed to load orders from localStorage:', error);
      return null;
    }
  },

  clearOrders: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear orders from localStorage:', error);
    }
  },

  updateOrder: (updatedOrder: Order): void => {
    try {
      const orders = localStorageUtils.loadOrders();
      if (orders) {
        const updatedOrders = orders.map(order =>
          order.id === updatedOrder.id ? updatedOrder : order
        );
        localStorageUtils.saveOrders(updatedOrders);
      }
    } catch (error) {
      console.error('Failed to update order in localStorage:', error);
    }
  },

  addOrder: (newOrder: Order): void => {
    try {
      const orders = localStorageUtils.loadOrders() || [];
      const updatedOrders = [newOrder, ...orders];
      localStorageUtils.saveOrders(updatedOrders);
    } catch (error) {
      console.error('Failed to add order to localStorage:', error);
    }
  },

  removeOrder: (orderId: string): void => {
    try {
      const orders = localStorageUtils.loadOrders();
      if (orders) {
        const updatedOrders = orders.filter(order => order.id !== orderId);
        localStorageUtils.saveOrders(updatedOrders);
      }
    } catch (error) {
      console.error('Failed to remove order from localStorage:', error);
    }
  },

  isAvailable: (): boolean => {
    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
};