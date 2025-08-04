export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  product: string;
  quantity: number;
  amount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderRequest {
  userId: string;
  product: string;
  quantity: number;
  amount: number;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface OrderFilters {
  status?: OrderStatus;
  userId?: string;
}