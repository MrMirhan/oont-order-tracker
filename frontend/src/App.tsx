import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Authentication from './components/Authentication';
import Header from './components/Header';
import OrderList from './components/OrderList';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Authentication />;
  }

  return (
    <div className="app-container">
      <div className="app-content">
        <Header />

        <main>
          <OrderList />
        </main>

        <footer className="app-footer">
          <p>
            OoNt Order Tracker - Built with React & TypeScript
          </p>
          <p>
            © 2025 OoNt. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;