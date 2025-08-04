import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  if (!user) return null;

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">
            🛍️ OoNt Order Tracker
          </h1>
          <p className="app-subtitle">
            Manage your orders efficiently and effectively
          </p>
        </div>

        <div className="header-right">
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">
                {user.firstName} {user.lastName}
              </span>
              <span className="user-email">{user.email}</span>
              <span className={`user-role role-${user.role}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="logout-button"
              disabled={isLoading}
              title="Logout"
            >
              {isLoading ? '...' : '🚪 Logout'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;