import React from 'react';
import { OrderStatus, OrderFilters } from '../types/Order';
import { useAuth } from '../contexts/AuthContext';

interface OrderFilterProps {
  filters: OrderFilters;
  onFiltersChange: (filters: OrderFilters) => void;
  orderCounts: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  users: string[];
}

const OrderFilter: React.FC<OrderFilterProps> = ({ filters, onFiltersChange, orderCounts, users }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const handleStatusFilter = (status: OrderStatus | undefined) => {
    onFiltersChange({
      ...filters,
      status: status
    });
  };

  const handleUserFilter = (userId: string | undefined) => {
    onFiltersChange({
      ...filters,
      userId: userId
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const getButtonClass = (active: boolean) =>
    `filter-button ${active ? 'active' : 'inactive'}`;

  return (
    <div className="filter-container">
      <div className="filter-header">
        <h3 className="filter-title">
          Filter Orders
        </h3>
        {(filters.status || filters.userId) && (
          <button
            onClick={clearFilters}
            className="filter-clear-btn"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="filter-section">
        <label className="filter-label">
          Filter by Status:
        </label>
        <div className="filter-buttons">
          <button
            onClick={() => handleStatusFilter(undefined)}
            className={getButtonClass(!filters.status)}
          >
            All ({orderCounts.total})
          </button>
          <button
            onClick={() => handleStatusFilter('pending')}
            className={getButtonClass(filters.status === 'pending')}
          >
            Pending ({orderCounts.pending})
          </button>
          <button
            onClick={() => handleStatusFilter('completed')}
            className={getButtonClass(filters.status === 'completed')}
          >
            Completed ({orderCounts.completed})
          </button>
          <button
            onClick={() => handleStatusFilter('cancelled')}
            className={getButtonClass(filters.status === 'cancelled')}
          >
            Cancelled ({orderCounts.cancelled})
          </button>
        </div>
      </div>

      {isAdmin && (
        <div className="filter-section">
          <label className="filter-label">
            Filter by User:
          </label>
          <div className="filter-buttons">
            <button
              onClick={() => handleUserFilter(undefined)}
              className={getButtonClass(!filters.userId)}
            >
              All Users
            </button>
            {users.map(user => (
              <button
                key={user}
                onClick={() => handleUserFilter(user)}
                className={getButtonClass(filters.userId === user)}
              >
                {user.replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
      )}

      {(filters.status || filters.userId) && (
        <div className="filter-active">
          <strong>Active Filters:</strong>
          {filters.status && ` Status: ${filters.status}`}
          {filters.status && filters.userId && `, `}
          {filters.userId && ` User: ${filters.userId.replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())}`}
        </div>
      )}
    </div>
  );
};

export default OrderFilter;