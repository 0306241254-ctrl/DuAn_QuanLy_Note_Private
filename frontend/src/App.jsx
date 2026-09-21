import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';

// Import 3 component của bạn
import Notes from './Notes';
import PrivateNotes from './PrivateNotes';
import Settings from './Settings';

function App() {
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