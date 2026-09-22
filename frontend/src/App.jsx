import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Notes from './Notes';
import PrivateNotes from './PrivateNotes';
import Settings from './Settings';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app_theme') || 'light';
  });

  // Cập nhật màu cho toàn bộ body
  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    const isDark = theme === 'dark';
    
    document.body.style.backgroundColor = isDark ? '#1e1e1e' : '#ffffff';
    document.body.style.color = isDark ? '#ffffff' : '#000000';
  }, [theme]);

  const isDark = theme === 'dark';

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
        
        {/* --- SIDEBAR: THANH ĐIỀU HƯỚNG BÊN TRÁI --- */}
        <nav style={{ 
          width: '240px', 
          backgroundColor: isDark ? '#252526' : '#f8f9fa',
          padding: '20px', 
          borderRight: isDark ? '1px solid #3c3c3c' : '1px solid #dee2e6' 
        }}>
          {/* Đổi màu chữ tiêu đề theo theme */}
          <h3 style={{ marginTop: 0, color: isDark ? '#ffffff' : '#333333' }}>
            Quản Lý Ghi Chú
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2' }}>
            <li>
              <Link to="/" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
                📝 Ghi chú công khai
              </Link>
            </li>
            <li>
              <Link to="/private" style={{ textDecoration: 'none', color: '#dc3545', fontWeight: 'bold' }}>
                🔒 Riêng tư (Bảo mật)
              </Link>
            </li>
            <li>
              <Link to="/settings" style={{ textDecoration: 'none', color: '#28a745', fontWeight: 'bold' }}>
                ⚙️ Cài đặt hệ thống
              </Link>
            </li>
          </ul>
        </nav>

        {/* --- MAIN CONTENT: VÙNG HIỂN THỊ NỘI DUNG --- */}
        <main style={{ 
          flex: 1, 
          padding: '20px',
          backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
          color: isDark ? '#ffffff' : '#000000'
        }}>
          <Routes>
            <Route path="/" element={<Notes theme={theme} />} />
            <Route path="/private" element={<PrivateNotes theme={theme} />} />
            {/* TRUYỀN PROPS THEME VÀ SETTHEME XUỐNG SETTINGS */}
            <Route path="/settings" element={<Settings theme={theme} setTheme={setTheme} />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;