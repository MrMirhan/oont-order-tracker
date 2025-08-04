import React from 'react';
import { useOrders } from '../hooks/useOrders';
import OrderCard from './OrderCard';
import OrderFilter from './OrderFilter';

const OrderList: React.FC = () => {
  const {
    orders,
    users,
    loading,
    error,
    filters,
    cancelOrder,
    updateFilters,
    getOrdersCount,
    refetch
  } = useOrders();

  const orderCounts = getOrdersCount();

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      console.log('Order cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel order:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">
          Loading orders...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">
            !
          </div>
          <div>
            <h3 className="error-title">
              Error Loading Orders
            </h3>
            <p className="error-message">
              {error}
            </p>
          </div>
        </div>
        <button
          onClick={refetch}
          className="error-button"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <OrderFilter
        filters={filters}
        onFiltersChange={updateFilters}
        orderCounts={orderCounts}
        users={users}
      />

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            📦
          </div>
          <h3 className="empty-title">
            No Orders Found
          </h3>
          <p className="empty-message">
            {filters.status
              ? `No ${filters.status} orders to display.`
              : 'No orders to display.'
            }
          </p>
          {filters.status && (
            <button
              onClick={() => updateFilters({})}
              className="empty-button"
            >
              Show All Orders
            </button>
          )}
        </div>
      ) : (
        <div>
          <div className="order-stats">
            <p>
              Showing {orders.length} of {orderCounts.total} orders
              {filters.status && ` (filtered by: ${filters.status})`}
            </p>
          </div>
          
          <div className="orders-container">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onCancel={handleCancelOrder}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;