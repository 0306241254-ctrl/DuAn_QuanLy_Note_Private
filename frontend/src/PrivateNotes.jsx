/**
* ============================================================================
* COMPONENT: VÙNG KÍN & BẢO MẬT (PrivateNotes.jsx)
* ============================================================================
*/
import React, { useState } from 'react';

function PrivateNotes() {
  /* ========================================================================
  VÙNG 1: STATE (Trạng thái)
  ======================================================================== */
  const [isUnlocked, setIsUnlocked] = useState(false); // Cờ khóa màn hình
  const [passwordInput, setPasswordInput] = useState('');
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ id: null, title: '', content: '' });

  /* ========================================================================
  VÙNG 2: LOGIC (Xác thực & Fetch Data)
  ======================================================================== */
  // 2.1. Đăng nhập / Mở khóa
  const handleLogin = () => {
    if (!passwordInput) return alert("Vui lòng nhập mật khẩu!");

    fetch('http://localhost:5000/api/private/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passwordInput })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIsUnlocked(true); // Mở khóa
          fetchPrivateNotes(); // Lấy dữ liệu ghi chú kín
          setPasswordInput('');
        } else {
          alert("Sai mật khẩu, vui lòng thử lại!");
          setPasswordInput('');
        }
      })
      .catch(err => console.error("Lỗi xác thực:", err));
  };

  // 2.2. Lấy danh sách ghi chú
  const fetchPrivateNotes = () => {
    fetch('http://localhost:5000/api/private/notes')
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(err => console.error("Lỗi lấy danh sách ghi chú:", err));
  };

  // 2.3. Lưu ghi chú
  const handleSave = () => {
    if (!formData.title.trim() && !formData.content.trim()) {
      return alert("Vui lòng nhập tiêu đề hoặc nội dung!");
    }

    fetch('http://localhost:5000/api/private/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: formData.title, content: formData.content })
    })
      .then(res => res.json())
      .then(() => {
        fetchPrivateNotes();
        setFormData({ id: null, title: '', content: '' });
      })
      .catch(err => console.error("Lỗi lưu ghi chú:", err));
  };

  /* ========================================================================
  VÙNG 3: RENDER (Hiển thị)
  ======================================================================== */
  // 3.1. Nếu chưa mở khóa -> Render màn hình nhập Pass
  if (!isUnlocked) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Khu vực Bảo mật</h2>
        <p>Vui lòng nhập mật khẩu để truy cập</p>
        <input
          type="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          placeholder="Nhập mật khẩu..."
          style={{ padding: '6px' }}
        />
        <button onClick={handleLogin} style={{ marginLeft: '10px', padding: '6px 12px' }}>
          Mở khóa
        </button>
      </div>
    );
  }

  // 3.2. Nếu đã mở khóa -> Render giao diện Ghi chú riêng tư
  return (
    <div style={{ padding: '20px', backgroundColor: '#ffebee' }}>
      <h2 style={{ color: 'red' }}>Khu vực Ghi chú Riêng tư </h2>

      {/* Form nhập liệu */}
      <div style={{ border: '1px solid red', padding: '10px', marginBottom: '20px', backgroundColor: '#fff' }}>
        <input
          placeholder="Tiêu đề bí mật" 
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px', boxSizing: 'border-box' }}
        />
        <textarea
          placeholder="Nội dung bí mật" 
          value={formData.content}
          onChange={e => setFormData({ ...formData, content: e.target.value })}
          style={{ display: 'block', width: '100%', height: '80px', marginBottom: '10px', padding: '8px', boxSizing: 'border-box' }}
        />
        <button 
          onClick={handleSave} 
          style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '8px 16px', cursor: 'pointer' }}
        >
          Lưu bí mật
        </button>
      </div>

      {/* Danh sách ghi chú */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        {notes.map(note => (
          <div key={note.id} style={{ border: '1px solid red', padding: '15px', backgroundColor: '#fff' }}>
            <h4 style={{ color: 'red', marginTop: 0 }}>{note.title}</h4>
            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PrivateNotes;