/**
* ============================================================================
* COMPONENT: VÙNG KÍN & BẢO MẬT (PrivateNotes.jsx)
* ============================================================================
*/
import React, { useState } from 'react';

function PrivateNotes({ theme }) {
  /* ========================================================================
  VÙNG 1: STATE (Trạng thái)
  ======================================================================== */
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ id: null, title: '', content: '' });

  const isDark = theme === 'dark';

  /* ========================================================================
  VÙNG 2: LOGIC (Xác thực & Call API)
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
          setIsUnlocked(true);
          fetchPrivateNotes();
          setPasswordInput('');
        } else {
          alert("Sai mật khẩu, vui lòng thử lại!");
          setPasswordInput('');
        }
      })
      .catch(err => console.error("Lỗi xác thực:", err));
  };

  // 2.2. Lấy danh sách ghi chú kín
  const fetchPrivateNotes = () => {
    fetch('http://localhost:5000/api/private/notes')
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(err => console.error("Lỗi tải ghi chú kín:", err));
  };

  // 2.3. Thêm mới hoặc Cập nhật ghi chú kín
  const handleSave = () => {
    if (!formData.title.trim() && !formData.content.trim()) {
      return alert("Vui lòng nhập tiêu đề hoặc nội dung!");
    }

    const isEditing = formData.id !== null;
    const url = isEditing 
      ? `http://localhost:5000/api/private/notes/${formData.id}`
      : 'http://localhost:5000/api/private/notes';
    const method = isEditing ? 'PUT' : 'POST';

    fetch(url, {
      method,
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

  // 2.4. Xóa ghi chú kín
  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa ghi chú bảo mật này?")) return;

    fetch(`http://localhost:5000/api/private/notes/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => fetchPrivateNotes())
      .catch(err => console.error("Lỗi xóa ghi chú:", err));
  };

  // 2.5. Chỉnh sửa (Đưa dữ liệu lên form)
  const handleEdit = (note) => {
    setFormData({ id: note.id, title: note.title, content: note.content });
  };

  // 2.6. Khóa lại khu vực bảo mật
  const handleLock = () => {
    setIsUnlocked(false);
    setNotes([]);
    setFormData({ id: null, title: '', content: '' });
  };

  /* ========================================================================
  VÙNG 3: RENDER (Hiển thị)
  ======================================================================== */
  // 3.1. Giao diện Màn hình khóa
  if (!isUnlocked) {
    return (
      <div style={{ 
        padding: '60px 20px', 
        textAlign: 'center', 
        maxWidth: '400px', 
        margin: '40px auto',
        border: isDark ? '1px solid #444' : '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: isDark ? '#222' : '#fff'
      }}>
        <h2 style={{ color: '#dc3545', marginBottom: '10px' }}>🔒 Khu vực Bảo mật</h2>
        <p style={{ marginBottom: '20px', opacity: 0.8 }}>Vui lòng nhập mật khẩu để truy cập</p>
        
        <input
          type="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          placeholder="Nhập mật khẩu riêng tư..."
          style={{ 
            padding: '10px', 
            width: '80%', 
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginBottom: '15px'
          }}
        />
        <br />
        <button 
          onClick={handleLogin} 
          style={{ 
            padding: '10px 24px', 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Mở khóa
        </button>
      </div>
    );
  }

  // 3.2. Giao diện Vùng kín (Đã mở khóa)
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#dc3545', margin: 0 }}>🛡️ Ghi chú Riêng tư</h2>
        <button 
          onClick={handleLock} 
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer' 
          }}
        >
          🔒 Khóa lại
        </button>
      </div>

      {/* Form Nhập / Sửa */}
      <div style={{ 
        border: '1px solid #dc3545', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '25px',
        backgroundColor: isDark ? '#2a1a1a' : '#fff5f5'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#dc3545' }}>
          {formData.id ? 'Sửa ghi chú bảo mật' : 'Thêm ghi chú bảo mật mới'}
        </h4>
        <input
          placeholder="Tiêu đề bí mật..." 
          value={formData.title}
          onChange={e => setFormData({...formData, title: e.target.value})}
          style={{ 
            display: 'block', 
            width: '100%', 
            padding: '8px',
            marginBottom: '10px',
            boxSizing: 'border-box',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
        <textarea
          placeholder="Nội dung bí mật..." 
          value={formData.content}
          onChange={e => setFormData({...formData, content: e.target.value})}
          style={{ 
            display: 'block', 
            width: '100%', 
            height: '80px', 
            padding: '8px',
            marginBottom: '10px',
            boxSizing: 'border-box',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleSave} 
            style={{ 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {formData.id ? 'Cập nhật' : 'Lưu bí mật'}
          </button>
          {formData.id && (
            <button 
              onClick={() => setFormData({ id: null, title: '', content: '' })}
              style={{ 
                backgroundColor: '#6c757d', 
                color: 'white', 
                border: 'none', 
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer' 
              }}
            >
              Hủy
            </button>
          )}
        </div>
      </div>

      {/* Danh sách Ghi chú */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
        {notes.length === 0 ? (
          <p style={{ opacity: 0.6 }}>Chưa có ghi chú bảo mật nào.</p>
        ) : (
          notes.map(note => (
            <div 
              key={note.id} 
              style={{ 
                border: '1px solid #dc3545', 
                padding: '15px', 
                borderRadius: '8px',
                backgroundColor: isDark ? '#1e1e1e' : '#fff',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}
            >
              <div>
                <h4 style={{ margin: '0 0 10px 0', color: '#dc3545' }}>{note.title}</h4>
                <p style={{ whiteSpace: 'pre-wrap', margin: '0 0 15px 0', fontSize: '14px' }}>{note.content}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => handleEdit(note)} 
                  style={{ padding: '4px 8px', cursor: 'pointer' }}
                >
                  Sửa
                </button>
                <button 
                  onClick={() => handleDelete(note.id)} 
                  style={{ padding: '4px 8px', color: 'red', cursor: 'pointer' }}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PrivateNotes;