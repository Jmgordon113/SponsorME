import React, { useEffect } from 'react';

declare global {
  interface Window {
    AppleID?: any;
  }
}

const AppleLoginButton: React.FC = () => {
  useEffect(() => {
    if (window.AppleID) {
      window.AppleID.auth.init({
        clientId: 'com.example.sponsorme',
        scope: 'name email',
        redirectURI: 'http://localhost:3000',
        usePopup: true,
      });
    }
  }, []);

  const handleAppleLogin = () => {
    if (window.AppleID) {
      window.AppleID.auth.signIn().then((response: any) => {
        fetch('/api/auth/apple-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_token: response.authorization.id_token }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.token) {
              localStorage.setItem('token', data.token);
              const userRole = data.role;
              window.location.href = userRole === 'sponsor' ? '/dashboard-sponsor' : '/dashboard-sponsee';
            } else {
              alert('Apple login failed');
            }
          })
          .catch((err) => console.error('Apple login error:', err));
      }).catch((error: any) => {
        alert('Apple login failed. Please try again.');
      });
    } else {
      alert('Apple Sign-In is not available.');
    }
  };

  return (
    <button onClick={handleAppleLogin} className="apple-login-button">
      Sign in with Apple
    </button>
  );
};

export default AppleLoginButton;
