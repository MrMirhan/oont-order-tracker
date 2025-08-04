import { Router, Request, Response } from 'express';
import { orderService } from '../services/OrderService';
import {
  validateCreateOrder,
  validateUpdateOrderStatus,
  validateOrderId,
  validateQueryFilters
} from '../middleware/validation';
import {
  authenticateToken,
  requireRole,
  requireOwnership,
  AuthenticatedRequest
} from '../middleware/auth';
import { OrderFilters, OrderStatus } from '../types/Order';

const router = Router();

router.get('/users', authenticateToken, requireRole(['admin']), (req: Request, res: Response) => {
  try {
    const users = orderService.getAllUsers();
    
    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
      message: 'Users retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve users'
    });
  }
});

router.post('/', authenticateToken, validateCreateOrder, (req: AuthenticatedRequest, res: Response) => {
  try {
    const orderData = {
      ...req.body,
      userId: req.user?.username
    };
    
    const order = orderService.createOrder(orderData);
    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create order'
    });
  }
});

router.get('/', authenticateToken, validateQueryFilters, (req: AuthenticatedRequest, res: Response) => {
  try {
    const filters: OrderFilters = {};
    
    if (req.query.status) {
      filters.status = req.query.status as OrderStatus;
    }
    
    if (req.user?.role === 'admin') {
      if (req.query.userId) {
        filters.userId = req.query.userId as string;
      }
    } else {
      filters.userId = req.user?.username;
    }

    const orders = orderService.getAllOrders(filters);
    
    res.status(200).json({
      success: true,
      data: orders,
      count: orders.length,
      message: 'Orders retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve orders'
    });
  }
});

router.get('/:id', authenticateToken, validateOrderId, (req: AuthenticatedRequest, res: Response) => {
  try {
    const order = orderService.getOrderById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
        message: `Order with ID ${req.params.id} does not exist`
      });
    }

    if (req.user?.role !== 'admin' && order.userId !== req.user?.username) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'You can only access your own orders'
      });
    }

    res.status(200).json({
      success: true,
      data: order,
      message: 'Order retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve order'
    });
  }
});

router.put('/:id/status', authenticateToken, validateOrderId, validateUpdateOrderStatus, (req: AuthenticatedRequest, res: Response) => {
  try {
    const existingOrder = orderService.getOrderById(req.params.id);
    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
        message: `Order with ID ${req.params.id} does not exist`
      });
    }

    if (req.user?.role !== 'admin') {
      if (existingOrder.userId !== req.user?.username) {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          message: 'You can only modify your own orders'
        });
      }
      
      if (req.body.status !== 'cancelled' || existingOrder.status !== 'pending') {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          message: 'You can only cancel your own pending orders'
        });
      }
    }

    const updatedOrder = orderService.updateOrderStatus(req.params.id, req.body.status);

    res.status(200).json({
      success: true,
      data: updatedOrder,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update order status'
    });
  }
});

router.delete('/:id', authenticateToken, requireRole(['admin']), validateOrderId, (req: Request, res: Response) => {
  try {
    const deleted = orderService.deleteOrder(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
        message: `Order with ID ${req.params.id} does not exist`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete order'
    });
  }
});

export default router;