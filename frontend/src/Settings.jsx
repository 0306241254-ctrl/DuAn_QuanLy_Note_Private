import React, { useState, useEffect } from 'react';

function Settings({ theme = 'light', setTheme }) {
  const [displayName, setDisplayName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const isDark = theme === 'dark';

  // Lấy dữ liệu profile từ Backend khi load trang
  useEffect(() => {
    fetch('http://localhost:5000/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.displayName) setDisplayName(data.displayName);
        if (data.theme && setTheme) setTheme(data.theme);
      })
      .catch(err => console.error('Lỗi tải profile:', err));
  }, [setTheme]);

  // Xử lý đổi theme
  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    if (setTheme) setTheme(selectedTheme);
  };

  // Xử lý lưu thay đổi
  const handleSave = () => {
    if (newPassword && !currentPassword) {
      alert("Vui lòng nhập mật khẩu hiện tại để xác nhận đổi mật khẩu!");
      return;
    }

    const bodyData = {
      displayName,
      theme,
      currentPassword,
      newPassword
    };

    fetch('http://localhost:5000/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert(data.message || "Lưu cài đặt thành công!");
          setCurrentPassword('');
          setNewPassword('');
        } else {
          alert(data.message || "Lưu cài đặt thất bại!");
        }
      })
      .catch(err => console.error('Lỗi lưu profile:', err));
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    boxSizing: 'border-box',
    borderRadius: '4px',
    border: isDark ? '1px solid #555' : '1px solid #ccc',
    backgroundColor: isDark ? '#333' : '#fff',
    color: isDark ? '#fff' : '#000',
    marginTop: '5px'
  };

  return (
    <div style={{ padding: '10px' }}>
      <h2 style={{ marginTop: 0 }}>⚙️ Cài đặt hệ thống</h2>

      {/* Tên hiển thị */}
      <div style={{ marginTop: '15px' }}>
        <label style={{ fontWeight: 'bold' }}>Tên hiển thị: </label>
        <input 
          type="text"
          value={displayName} 
          onChange={(e) => setDisplayName(e.target.value)} 
          style={inputStyle}
          placeholder="Nhập tên hiển thị..."
        />
      </div>

      {/* Giao diện */}
      <div style={{ marginTop: '15px' }}>
        <label style={{ fontWeight: 'bold' }}>Giao diện: </label>
        <select 
          value={theme} 
          onChange={handleThemeChange}
          style={inputStyle}
        >
          <option value="light">☀️ Sáng (Light)</option>
          <option value="dark">🌙 Tối (Dark)</option>
        </select>
      </div>

      <hr style={{ margin: '20px 0', borderColor: isDark ? '#444' : '#eee' }} />

      {/* Đổi mật khẩu */}
      <h3 style={{ marginTop: 0 }}>🔑 Đổi mật khẩu riêng tư</h3>

      <div style={{ marginTop: '10px' }}>
        <label style={{ fontSize: '14px' }}>Mật khẩu hiện tại: </label>
        <input 
          type="password" 
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)} 
          placeholder="Nhập mật khẩu cũ nếu muốn đổi..."
          style={inputStyle}
        />
      </div>

      <div style={{ marginTop: '10px' }}>
        <label style={{ fontSize: '14px' }}>Mật khẩu mới: </label>
        <input 
          type="password" 
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)} 
          placeholder="Nhập mật khẩu mới..."
          style={inputStyle}
        />
      </div>

      {/* Nút lưu */}
      <button 
        onClick={handleSave} 
        style={{ 
          marginTop: '20px', 
          width: '100%',
          padding: '10px 20px', 
          backgroundColor: '#28a745', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: 'pointer' 
        }}
      >
        Lưu thay đổi
      </button>
    </div>
  );
}

export default Settings;