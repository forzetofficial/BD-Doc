import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

export default function CookieDebug() {
  const [cookies, setCookies] = useState<Record<string, string>>({});
  const location = useLocation();

  useEffect(() => {
    const allCookies = Cookies.get();
    setCookies(allCookies);
  }, []);

  if (location.pathname !== '/auth/login') {
    return null;
  }

  const clearCookies = () => {
    Object.keys(cookies).forEach(key => {
      Cookies.remove(key);
    });
    setCookies({});
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '20px', 
      right: '20px', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px', 
      border: 'none',
      borderRadius: '16px',
      fontSize: '14px',
      maxWidth: '320px',
      zIndex: 1000,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h4 style={{ 
        margin: '0 0 16px 0', 
        fontSize: '16px', 
        fontWeight: '600',
        color: 'white',
        textAlign: 'center'
      }}>
        🍪 Сохраненные данные
      </h4>
      {Object.keys(cookies).length === 0 ? (
        <p style={{ 
          margin: '0', 
          textAlign: 'center', 
          opacity: 0.8,
          fontStyle: 'italic'
        }}>
          Нет сохраненных данных
        </p>
      ) : (
        <div>
          {Object.entries(cookies).map(([key, value]) => (
            <div key={key} style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '8px 12px',
              margin: '8px 0',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <strong style={{ color: '#ffd700' }}>{key}:</strong> 
              <span style={{ marginLeft: '8px' }}>
                {key === 'password' ? '••••••••' : value}
              </span>
            </div>
          ))}
          <button 
            onClick={clearCookies}
            style={{
              marginTop: '16px',
              padding: '10px 16px',
              background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              width: '100%',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.3)';
            }}
          >
            🗑️ Очистить все
          </button>
        </div>
      )}
    </div>
  );
}
