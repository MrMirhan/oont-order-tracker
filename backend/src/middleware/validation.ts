import { Request, Response, NextFunction } from 'express';
import { OrderStatus } from '../types/Order';

export const validateCreateOrder = (req: Request, res: Response, next: NextFunction) => {
  const { userId, product, quantity, amount } = req.body;

  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    return res.status(400).json({
      error: 'userId is required and must be a non-empty string'
    });
  }

  if (!product || typeof product !== 'string' || product.trim() === '') {
    return res.status(400).json({
      error: 'product is required and must be a non-empty string'
    });
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({
      error: 'quantity is required and must be a positive integer'
    });
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({
      error: 'amount is required and must be a positive number'
    });
  }

  next();
};

export const validateUpdateOrderStatus = (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.body;
  const validStatuses: OrderStatus[] = ['pending', 'completed', 'cancelled'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      error: `status is required and must be one of: ${validStatuses.join(', ')}`
    });
  }

  next();
};

export const validateOrderId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string' || id.trim() === '') {
    return res.status(400).json({
      error: 'Order ID is required and must be a non-empty string'
    });
  }

  next();
};

export const validateQueryFilters = (req: Request, res: Response, next: NextFunction) => {
  const { status, userId } = req.query;
  const validStatuses: OrderStatus[] = ['pending', 'completed', 'cancelled'];

  if (status && !validStatuses.includes(status as OrderStatus)) {
    return res.status(400).json({
      error: `status filter must be one of: ${validStatuses.join(', ')}`
    });
  }

  if (userId && typeof userId !== 'string') {
    return res.status(400).json({
      error: 'userId filter must be a string'
    });
  }

  next();
};