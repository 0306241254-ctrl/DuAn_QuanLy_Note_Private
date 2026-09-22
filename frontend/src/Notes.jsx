/**
* ============================================================================
* COMPONENT: GIAO DIỆN QUẢN LÝ GHI CHÚ (Notes.jsx)
* Author: Frontend Dev
* ============================================================================
*/
import React, { useState, useEffect } from 'react';

function Notes({ theme = 'light' }) {
  /* ========================================================================
  VÙNG 1: KHỞI TẠO STATE (Trạng thái dữ liệu)
  ======================================================================== */
  const [topic, setTopic] = useState('hoc-tap');
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ id: null, title: '', content: '' });

  const isDark = theme === 'dark';

  /* ========================================================================
  VÙNG 2: XỬ LÝ LOGIC & GỌI API (Fetch, Save, Delete)
  ======================================================================== */
  const fetchNotes = () => {
    fetch(`http://localhost:5000/api/notes/${topic}`)
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(err => console.error("Lỗi tải ghi chú:", err));
  };

  useEffect(() => { 
    fetchNotes(); 
    setFormData({ id: null, title: '', content: '' }); // Reset form khi đổi chủ đề
  }, [topic]);

  const handleSave = () => {
    if (!formData.title.trim() && !formData.content.trim()) {
      return alert("Vui lòng nhập tiêu đề hoặc nội dung!");
    }

    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id
      ? `http://localhost:5000/api/notes/${topic}/${formData.id}`
      : `http://localhost:5000/api/notes/${topic}`;

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: formData.title, content: formData.content })
    })
      .then(res => res.json())
      .then(() => {
        fetchNotes();
        setFormData({ id: null, title: '', content: '' });
      })
      .catch(err => console.error("Lỗi lưu ghi chú:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa ghi chú này?')) {
      fetch(`http://localhost:5000/api/notes/${topic}/${id}`, { method: 'DELETE' })
        .then(() => fetchNotes())
        .catch(err => console.error("Lỗi xóa ghi chú:", err));
    }
  };

  const handleEdit = (note) => {
    setFormData({ id: note.id, title: note.title, content: note.content });
  };

  /* ========================================================================
  VÙNG 3: RENDER GIAO DIỆN (UI/CSS)
  ======================================================================== */
  const cardStyle = {
    backgroundColor: isDark ? '#2d2d2d' : '#ffffff',
    borderColor: isDark ? '#3b82f6' : '#007bff',
    color: isDark ? '#ffffff' : '#000000',
    border: '1px solid',
    padding: '15px',
    borderRadius: '6px'
  };

  const inputStyle = {
    display: 'block',
    width: '100%',
    marginBottom: '10px',
    padding: '8px',
    boxSizing: 'border-box',
    backgroundColor: isDark ? '#333333' : '#ffffff',
    color: isDark ? '#ffffff' : '#000000',
    border: isDark ? '1px solid #555' : '1px solid #ccc',
    borderRadius: '4px'
  };

  return (
    <div style={{ padding: '10px' }}>
      <h2 style={{ marginTop: 0, color: isDark ? '#ffffff' : '#000000' }}>📝 Ghi chú Công khai</h2>
      
      {/* 3.1. Vùng chọn chủ đề */}
      <div style={{ marginBottom: '20px' }}>
        <strong>Chủ đề: </strong>
        <select 
          value={topic} 
          onChange={(e) => setTopic(e.target.value)}
          style={{ 
            padding: '6px 12px', 
            borderRadius: '4px',
            backgroundColor: isDark ? '#333' : '#fff',
            color: isDark ? '#fff' : '#000',
            border: '1px solid #ccc'
          }}
        >
          <option value="hoc-tap">🎓 Học tập</option>
          <option value="cong-viec">💼 Công việc</option>
          <option value="ca-nhan">👤 Cá nhân</option>
        </select>
      </div>

      {/* 3.2. Form Nhập liệu */}
      <div style={{ ...cardStyle, marginBottom: '20px' }}>
        <h3 style={{ marginTop: 0, color: isDark ? '#ffffff' : '#000000' }}>
          {formData.id ? '✏️ Sửa ghi chú' : '➕ Thêm ghi chú mới'}
        </h3>
        <input
          placeholder="Tiêu đề..." 
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          style={inputStyle}
        />
        <textarea
          placeholder="Nội dung..." 
          value={formData.content}
          onChange={e => setFormData({ ...formData, content: e.target.value })}
          style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
        />
        <button 
          onClick={handleSave}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          {formData.id ? 'Cập nhật' : 'Thêm mới'}
        </button>
        {formData.id && (
          <button 
            onClick={() => setFormData({ id: null, title: '', content: '' })}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Hủy
          </button>
        )}
      </div>

      {/* 3.3. Danh sách thẻ ghi chú */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '15px' }}>
        {notes.length === 0 && <p style={{ color: isDark ? '#aaa' : '#666' }}>Chưa có ghi chú nào trong danh mục này.</p>}
        {notes.map(note => (
          <div key={note.id} style={cardStyle}>
            <h4 style={{ margin: '0 0 10px 0', color: isDark ? '#ffffff' : '#007bff' }}>{note.title}</h4>
            <p style={{ whiteSpace: 'pre-wrap', margin: 0, fontSize: '14px' }}>{note.content}</p>
            <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: isDark ? '1px solid #444' : '1px solid #eee' }}>
              <button 
                onClick={() => handleEdit(note)} 
                style={{ 
                  marginRight: '10px', 
                  padding: '4px 10px', 
                  cursor: 'pointer',
                  backgroundColor: '#28a745',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                Sửa
              </button>
              <button 
                onClick={() => handleDelete(note.id)} 
                style={{ 
                  padding: '4px 10px', 
                  cursor: 'pointer',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;