import React, { useState, useEffect } from 'react';

function Settings({ theme, setTheme }) {
  const [displayName, setDisplayName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Lấy dữ liệu profile từ Backend khi load trang
  useEffect(() => {
    fetch('http://localhost:5000/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.displayName) setDisplayName(data.displayName);
        if (data.theme) setTheme(data.theme);
      })
      .catch(err => console.error('Lỗi tải profile:', err));
  }, [setTheme]);

  // Xử lý đổi theme
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  // Xử lý lưu thay đổi
  const handleSave = () => {
    // Nếu nhập mật khẩu mới mà bỏ trống mật khẩu hiện tại
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
          alert(data.message);
          // Reset lại các ô mật khẩu sau khi lưu thành công
          setCurrentPassword('');
          setNewPassword('');
        } else {
          alert(data.message); // Hiển thị thông báo nếu sai mật khẩu hiện tại
        }
      })
      .catch(err => console.error('Lỗi lưu profile:', err));
  };

  const isDark = theme === 'dark';

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Cài đặt hệ thống</h2>

      <div style={{ marginTop: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Tên hiển thị: </label>
        <input 
          type="text"
          value={displayName} 
          onChange={(e) => setDisplayName(e.target.value)} 
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginTop: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Giao diện: </label>
        <select 
          value={theme} 
          onChange={handleThemeChange}
          style={{ 
            width: '100%',
            padding: '8px', 
            borderRadius: '4px',
            backgroundColor: isDark ? '#333' : '#fff',
            color: isDark ? '#fff' : '#000',
            border: '1px solid #ccc'
          }}
        >
          <option value="light">Sáng</option>
          <option value="dark">Tối</option>
        </select>
      </div>

      <hr style={{ margin: '20px 0', borderColor: isDark ? '#444' : '#ccc' }} />
      <h3>Đổi mật khẩu riêng tư</h3>

      <div style={{ marginTop: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Mật khẩu hiện tại: </label>
        <input 
          type="password" 
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)} 
          placeholder="Nhập mật khẩu cũ nếu muốn đổi"
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginTop: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Mật khẩu mới: </label>
        <input 
          type="password" 
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)} 
          placeholder="Nhập mật khẩu mới"
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <button 
        onClick={handleSave} 
        style={{ 
          marginTop: '20px', 
          padding: '10px 20px', 
          backgroundColor: '#28a745', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer' 
        }}
      >
        Lưu thay đổi
      </button>
    </div>
  );
}

export default Settings;