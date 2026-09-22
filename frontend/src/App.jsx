import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';

import Notes from './Notes';
import PrivateNotes from './PrivateNotes';
import Settings from './Settings';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app_theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    // Cập nhật màu nền màn hình ngoài theo Dark/Light mode
    document.body.style.backgroundColor = theme === 'dark' ? '#111827' : '#e5e7eb';
  }, [theme]);

  const navItemStyle = ({ isActive }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 0',
    flex: 1,
    textDecoration: 'none',
    color: isActive ? '#3b82f6' : '#9ca3af',
    transition: 'color 0.2s ease',
  });

  return (
    <Router>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        backgroundColor: theme === 'dark' ? '#111827' : '#e5e7eb',
        fontFamily: "'Segoe UI', Roboto, Helvetica, sans-serif",
        transition: 'background-color 0.3s ease'
      }}>
        
        {/* KHUNG ĐIỆN THOẠI */}
        <div style={{ 
          width: '100%', 
          maxWidth: '414px', 
          height: '100vh', 
          maxHeight: '850px', 
          backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', 
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '12px'
        }}>
          
          {/* Header Bar */}
          <div style={{ 
            backgroundColor: theme === 'dark' ? '#111827' : '#ffffff', 
            padding: '16px 20px', 
            textAlign: 'center', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            zIndex: 10 
          }}>
            <h2 style={{ margin: 0, color: theme === 'dark' ? '#ffffff' : '#1f2937', fontSize: '20px', fontWeight: 'bold' }}>
              📝 My Notes
            </h2>
          </div>

          {/* Nội dung cuộn */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '16px',
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#000000'
          }}>
            <Routes>
              <Route path="/" element={<Notes theme={theme} />} />
              <Route path="/private" element={<PrivateNotes theme={theme} />} />
              <Route path="/settings" element={<Settings theme={theme} setTheme={setTheme} />} />
            </Routes>
          </div>

          {/* Bottom Navigation Bar */}
          <div style={{ 
            display: 'flex', 
            backgroundColor: theme === 'dark' ? '#111827' : '#ffffff', 
            borderTop: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.03)'
          }}>
            <NavLink to="/" style={navItemStyle}>
              <span style={{ fontSize: '22px', marginBottom: '2px' }}>📓</span>
              <span style={{ fontSize: '11px', fontWeight: '700' }}>Ghi chú</span>
            </NavLink>
            
            <NavLink to="/private" style={navItemStyle}>
              <span style={{ fontSize: '22px', marginBottom: '2px' }}>🔒</span>
              <span style={{ fontSize: '11px', fontWeight: '700' }}>Riêng tư</span>
            </NavLink>
            
            <NavLink to="/settings" style={navItemStyle}>
              <span style={{ fontSize: '22px', marginBottom: '2px' }}>⚙️</span>
              <span style={{ fontSize: '11px', fontWeight: '700' }}>Cài đặt</span>
            </NavLink>
          </div>

        </div>
      </div>
    </Router>
  );
}

export default App;