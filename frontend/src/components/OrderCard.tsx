import React, { useState } from 'react';
import { Order } from '../types/Order';

interface OrderCardProps {
  order: Order;
  onCancel: (orderId: string) => Promise<void>;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        setIsLoading(true);
        await onCancel(order.id);
      } catch (error) {
        console.error('Failed to cancel order:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const baseClass = "order-badge";
    switch (status) {
      case 'pending':
        return `${baseClass} pending`;
      case 'completed':
        return `${baseClass} completed`;
      case 'cancelled':
        return `${baseClass} cancelled`;
      default:
        return baseClass;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="order-card">
      <div className="order-card-header">
        <div className="order-card-info">
          <h3 className="order-product">
            {order.product}
          </h3>
          <p className="order-meta">
            Order ID: {order.id}
          </p>
          <p className="order-meta">
            User: {order.userId}
          </p>
          <p className="order-meta quantity">
            Quantity: {order.quantity}
          </p>
        </div>
        <div>
          <div className={getStatusBadgeClass(order.status)}>
            {order.status}
          </div>
        </div>
      </div>

      <div className="order-card-footer">
        <div>
          <p className="order-amount">
            {formatAmount(order.amount)}
          </p>
          <p className="order-date">
            Created: {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="order-actions">
          {order.status === 'pending' && (
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className={`cancel-button ${isLoading ? '' : ''}`}
            >
              {isLoading ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
          {order.status !== 'pending' && (
            <span className="order-status-text">
              Cannot be cancelled
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;