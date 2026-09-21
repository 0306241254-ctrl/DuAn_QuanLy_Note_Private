<<<<<<< HEAD
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';

// Import 3 component của bạn
=======
HEAD
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
>>>>>>> 7249880b23f3b7d1bfbd09a0638e11b124b21770
import Notes from './Notes';
import PrivateNotes from './PrivateNotes';
import Settings from './Settings';

function App() {
<<<<<<< HEAD
  // Hàm tạo style cho các nút bấm ở đáy màn hình
  const navItemStyle = ({ isActive }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 0',
    flex: 1,
    textDecoration: 'none',
    color: isActive ? '#3b82f6' : '#9ca3af', // Màu xanh khi đang chọn, màu xám khi không chọn
    transition: 'color 0.2s ease',
  });

  return (
    <Router>
      {/* 1. KHUNG NỀN (Hiển thị như mặt bàn để đặt chiếc "điện thoại" lên) */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        backgroundColor: '#e5e7eb', // Màu xám tối màn hình ngoài
        fontFamily: "'Segoe UI', Roboto, Helvetica, sans-serif"
      }}>
        
        {/* 2. KHUNG ĐIỆN THOẠI (Mobile Container) */}
        <div style={{ 
          width: '100%', 
          maxWidth: '414px', // Chiều rộng chuẩn của các dòng Plus/Pro Max
          height: '100vh', 
          maxHeight: '850px', // Giới hạn chiều cao trên màn PC
          backgroundColor: '#f3f4f6', 
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)', // Bóng đổ giả lập độ dày thiết bị
          position: 'relative',
          overflow: 'hidden' // Ẩn những thứ tràn ra ngoài khung
        }}>
          
          {/* App Bar (Thanh tiêu đề trên cùng của App) */}
          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '16px 20px', 
            textAlign: 'center', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            zIndex: 10 
          }}>
            <h2 style={{ margin: 0, color: '#1f2937', fontSize: '20px', fontWeight: 'bold' }}>
              📝 My Notes
            </h2>
          </div>

          {/* Content (Vùng giữa chứa nội dung cuộn được) */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', // Cho phép vuốt lên xuống
            padding: '16px',
            paddingBottom: '20px',
            backgroundColor: '#ffffff'
          }}>
            <Routes>
              <Route path="/" element={<Notes />} />
              <Route path="/private" element={<PrivateNotes />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>

          {/* Bottom Navigation (Thanh Menu dưới cùng đặc trưng của App) */}
          <div style={{ 
            display: 'flex', 
            backgroundColor: '#ffffff', 
            borderTop: '1px solid #f3f4f6',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.03)',
            paddingBottom: 'env(safe-area-inset-bottom)' // Chừa phần cạnh đáy của điện thoại tràn viền
          }}>
            <NavLink to="/" style={navItemStyle}>
              <span style={{ fontSize: '24px', marginBottom: '4px' }}>📓</span>
              <span style={{ fontSize: '11px', fontWeight: '700' }}>Ghi chú</span>
            </NavLink>
            
            <NavLink to="/private" style={navItemStyle}>
              <span style={{ fontSize: '24px', marginBottom: '4px' }}>🔒</span>
              <span style={{ fontSize: '11px', fontWeight: '700' }}>Riêng tư</span>
            </NavLink>
            
            <NavLink to="/settings" style={navItemStyle}>
              <span style={{ fontSize: '24px', marginBottom: '4px' }}>⚙️</span>
              <span style={{ fontSize: '11px', fontWeight: '700' }}>Cài đặt</span>
            </NavLink>
          </div>

        </div>
      </div>
    </Router>
  );
}

export default App;
=======
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
        
        {/* --- SIDEBAR: THANH ĐIỀU HƯỚNG BÊN TRÁI --- */}
        <nav style={{ 
          width: '240px', 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRight: '1px solid #dee2e6' 
        }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Quản Lý Ghi Chú</h3>
          <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2' }}>
            <li>
              <Link to="/" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
                📝 Ghi chú công khai
              </Link>
            </li>
            <li>
              <Link to="/private" style={{ textDecoration: 'none', color: '#dc3545', fontWeight: 'bold' }}>
                🔒 Vùng kín (Bảo mật)
              </Link>
            </li>
            <li>
              <Link to="/settings" style={{ textDecoration: 'none', color: '#28a745', fontWeight: 'bold' }}>
                ⚙️ Cài đặt hệ thống
              </Link>
            </li>
          </ul>
        </nav>

        {/* --- MAIN CONTENT: VÙNG HIỂN THỊ NỘI DUNG THAY ĐỔI THEO ROUTE --- */}
        <main style={{ flex: 1, backgroundColor: '#fff' }}>
          <Routes>
            <Route path="/" element={<Notes />} />
            <Route path="/private" element={<PrivateNotes />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;

import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App

>>>>>>> 7249880b23f3b7d1bfbd09a0638e11b124b21770
