import { OrderService } from '../services/OrderService';
import { CreateOrderRequest, OrderStatus } from '../types/Order';

describe('OrderService', () => {
  let orderService: OrderService;

  beforeEach(() => {
    orderService = new OrderService();
  });

  describe('createOrder', () => {
    it('should create a new order with pending status', () => {
      const orderData: CreateOrderRequest = {
        userId: 'test-user',
        product: 'Test Product',
        quantity: 2,
        amount: 99.99
      };

      const order = orderService.createOrder(orderData);

      expect(order.id).toBeDefined();
      expect(order.userId).toBe(orderData.userId);
      expect(order.product).toBe(orderData.product);
      expect(order.quantity).toBe(orderData.quantity);
      expect(order.amount).toBe(orderData.amount);
      expect(order.status).toBe('pending');
      expect(order.createdAt).toBeInstanceOf(Date);
      expect(order.updatedAt).toBeInstanceOf(Date);
    });

    it('should generate unique IDs for different orders', () => {
      const orderData: CreateOrderRequest = {
        userId: 'test-user',
        product: 'Test Product',
        quantity: 1,
        amount: 99.99
      };

      const order1 = orderService.createOrder(orderData);
      const order2 = orderService.createOrder(orderData);

      expect(order1.id).not.toBe(order2.id);
    });
  });

  describe('getAllOrders', () => {
    it('should return all orders when no filters are applied', () => {
      const initialCount = orderService.getAllOrders().length;

      const orderData: CreateOrderRequest = {
        userId: 'test-user',
        product: 'Test Product',
        amount: 99.99
      };

      orderService.createOrder(orderData);
      const orders = orderService.getAllOrders();

      expect(orders).toHaveLength(initialCount + 1);
    });

    it('should filter orders by status', () => {
      const orderData: CreateOrderRequest = {
        userId: 'test-user',
        product: 'Test Product',
        quantity: 1,
        amount: 99.99
      };

      const order = orderService.createOrder(orderData);
      orderService.updateOrderStatus(order.id, 'completed');

      const pendingOrders = orderService.getAllOrders({ status: 'pending' });
      const completedOrders = orderService.getAllOrders({ status: 'completed' });

      expect(completedOrders.some(o => o.id === order.id)).toBe(true);
      expect(pendingOrders.some(o => o.id === order.id)).toBe(false);
    });

    it('should filter orders by userId', () => {
      const orderData1: CreateOrderRequest = {
        userId: 'user1',
        product: 'Test Product 1',
        quantity: 1,
        amount: 99.99
      };

      const orderData2: CreateOrderRequest = {
        userId: 'user2',
        product: 'Test Product 2',
        quantity: 2,
        amount: 149.99
      };

      const order1 = orderService.createOrder(orderData1);
      const order2 = orderService.createOrder(orderData2);

      const user1Orders = orderService.getAllOrders({ userId: 'user1' });
      const user2Orders = orderService.getAllOrders({ userId: 'user2' });

      expect(user1Orders.some(o => o.id === order1.id)).toBe(true);
      expect(user1Orders.some(o => o.id === order2.id)).toBe(false);
      expect(user2Orders.some(o => o.id === order2.id)).toBe(true);
      expect(user2Orders.some(o => o.id === order1.id)).toBe(false);
    });
  });

  describe('getOrderById', () => {
    it('should return the correct order when it exists', () => {
      const orderData: CreateOrderRequest = {
        userId: 'test-user',
        product: 'Test Product',
        quantity: 3,
        amount: 99.99
      };

      const createdOrder = orderService.createOrder(orderData);
      const retrievedOrder = orderService.getOrderById(createdOrder.id);

      expect(retrievedOrder).toEqual(createdOrder);
    });

    it('should return null when order does not exist', () => {
      const retrievedOrder = orderService.getOrderById('non-existent-id');
      expect(retrievedOrder).toBeNull();
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status successfully', () => {
      const orderData: CreateOrderRequest = {
        userId: 'test-user',
        product: 'Test Product',
        quantity: 1,
        amount: 99.99
      };

      const order = orderService.createOrder(orderData);
      
      const originalTime = order.updatedAt.getTime();
      
      const updatedOrder = orderService.updateOrderStatus(order.id, 'completed');

      expect(updatedOrder).not.toBeNull();
      expect(updatedOrder!.status).toBe('completed');
      expect(updatedOrder!.updatedAt.getTime()).toBeGreaterThanOrEqual(originalTime);
      expect(updatedOrder!.id).toBe(order.id);
      expect(updatedOrder!.userId).toBe(order.userId);
      expect(updatedOrder!.product).toBe(order.product);
      expect(updatedOrder!.amount).toBe(order.amount);
    });

    it('should return null when trying to update non-existent order', () => {
      const result = orderService.updateOrderStatus('non-existent-id', 'completed');
      expect(result).toBeNull();
    });

    it('should update order status to all valid statuses', () => {
      const orderData: CreateOrderRequest = {
        userId: 'test-user',
        product: 'Test Product',
        quantity: 1,
        amount: 99.99
      };

      const order = orderService.createOrder(orderData);
      const statuses: OrderStatus[] = ['completed', 'cancelled', 'pending'];

      statuses.forEach(status => {
        const updatedOrder = orderService.updateOrderStatus(order.id, status);
        expect(updatedOrder!.status).toBe(status);
      });
    });
  });

  describe('deleteOrder', () => {
    it('should delete an existing order successfully', () => {
      const orderData: CreateOrderRequest = {
        userId: 'test-user',
        product: 'Test Product',
        quantity: 1,
        amount: 99.99
      };

      const order = orderService.createOrder(orderData);
      const deleteResult = orderService.deleteOrder(order.id);

      expect(deleteResult).toBe(true);
      expect(orderService.getOrderById(order.id)).toBeNull();
    });

    it('should return false when trying to delete non-existent order', () => {
      const deleteResult = orderService.deleteOrder('non-existent-id');
      expect(deleteResult).toBe(false);
    });
  });

  describe('getOrdersCount', () => {
    it('should return the correct count of orders', () => {
      const initialCount = orderService.getOrdersCount();

      const orderData: CreateOrderRequest = {
        userId: 'test-user',
        product: 'Test Product',
        quantity: 1,
        amount: 99.99
      };

      orderService.createOrder(orderData);
      const newCount = orderService.getOrdersCount();

      expect(newCount).toBe(initialCount + 1);
    });
  });
});