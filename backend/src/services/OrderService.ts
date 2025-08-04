import { v4 as uuidv4 } from 'uuid';
import { Order, CreateOrderRequest, OrderStatus, OrderFilters } from '../types/Order';

export class OrderService {
  private orders: Map<string, Order> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    const sampleOrders: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        userId: 'alice.smith',
        product: 'Wireless Headphones',
        quantity: 1,
        amount: 129.99,
        status: 'pending'
      },
      {
        userId: 'alice.smith',
        product: 'Bluetooth Speaker',
        quantity: 1,
        amount: 89.99,
        status: 'completed'
      },
      {
        userId: 'alice.smith',
        product: 'Phone Case',
        quantity: 2,
        amount: 25.98,
        status: 'cancelled'
      },
      {
        userId: 'bob.johnson',
        product: 'Gaming Mouse',
        quantity: 1,
        amount: 59.99,
        status: 'completed'
      },
      {
        userId: 'bob.johnson',
        product: 'Laptop Stand',
        quantity: 1,
        amount: 39.99,
        status: 'pending'
      },
      {
        userId: 'bob.johnson',
        product: 'Webcam HD',
        quantity: 1,
        amount: 79.99,
        status: 'completed'
      },
      {
        userId: 'charlie.brown',
        product: 'USB-C Cable',
        quantity: 3,
        amount: 59.97,
        status: 'cancelled'
      },
      {
        userId: 'charlie.brown',
        product: 'Mechanical Keyboard',
        quantity: 1,
        amount: 149.99,
        status: 'completed'
      },
      {
        userId: 'charlie.brown',
        product: 'Monitor Stand',
        quantity: 1,
        amount: 45.99,
        status: 'pending'
      },
      {
        userId: 'testuser',
        product: 'Smartphone',
        quantity: 1,
        amount: 699.99,
        status: 'completed'
      },
      {
        userId: 'testuser',
        product: 'Laptop Backpack',
        quantity: 1,
        amount: 89.99,
        status: 'pending'
      },
      {
        userId: 'testuser',
        product: 'Wireless Charger',
        quantity: 2,
        amount: 79.98,
        status: 'pending'
      },
      {
        userId: 'testuser',
        product: 'Bluetooth Earbuds',
        quantity: 1,
        amount: 159.99,
        status: 'cancelled'
      },
      {
        userId: 'testuser',
        product: 'Power Bank',
        quantity: 1,
        amount: 49.99,
        status: 'completed'
      }
    ];

    sampleOrders.forEach((orderData, index) => {
      const hoursAgo = Math.floor(Math.random() * 48) + 1;
      const createdAt = new Date(Date.now() - (hoursAgo * 60 * 60 * 1000));
      
      const order: Order = {
        id: uuidv4(),
        ...orderData,
        createdAt,
        updatedAt: createdAt
      };
      this.orders.set(order.id, order);
    });
  }

  createOrder(orderData: CreateOrderRequest): Order {
    const now = new Date();
    const order: Order = {
      id: uuidv4(),
      ...orderData,
      status: 'pending',
      createdAt: now,
      updatedAt: now
    };

    this.orders.set(order.id, order);
    return order;
  }

  getAllOrders(filters?: OrderFilters): Order[] {
    let orders = Array.from(this.orders.values());

    if (filters?.status) {
      orders = orders.filter(order => order.status === filters.status);
    }

    if (filters?.userId) {
      orders = orders.filter(order => order.userId === filters.userId);
    }

    return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getOrderById(id: string): Order | null {
    return this.orders.get(id) || null;
  }

  updateOrderStatus(id: string, status: OrderStatus): Order | null {
    const order = this.orders.get(id);
    if (!order) {
      return null;
    }

    const updatedOrder: Order = {
      ...order,
      status,
      updatedAt: new Date()
    };

    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  deleteOrder(id: string): boolean {
    return this.orders.delete(id);
  }

  getOrdersCount(): number {
    return this.orders.size;
  }

  getAllUsers(): string[] {
    const users = Array.from(this.orders.values()).map(order => order.userId);
    return [...new Set(users)].sort();
  }
}

export const orderService = new OrderService();