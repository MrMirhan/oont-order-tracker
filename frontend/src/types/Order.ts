export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  product: string;
  quantity: number;
  amount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message: string;
  error?: string;
}