import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Authentication: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const switchToLogin = () => setAuthMode('login');
  const switchToRegister = () => setAuthMode('register');

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-content">
          <div className="auth-brand">
            <h1 className="auth-brand-title">🛍️ OoNt Order Tracker</h1>
            <p className="auth-brand-subtitle">
              Secure order management platform
            </p>
          </div>

          <div className="auth-forms">
            {authMode === 'login' ? (
              <LoginForm onSwitchToRegister={switchToRegister} />
            ) : (
              <RegisterForm onSwitchToLogin={switchToLogin} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;