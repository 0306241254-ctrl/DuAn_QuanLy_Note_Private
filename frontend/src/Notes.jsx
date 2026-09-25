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

  // THÊM MỚI: State cho Tìm kiếm, Lọc ngày và Phân trang
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 4; // Số lượng ghi chú tối đa trên 1 trang

  const isDark = theme === 'dark';

  /* ========================================================================
  VÙNG 2: XỬ LÝ LOGIC & GỌI API (Fetch, Save, Delete)
  ======================================================================== */
  const fetchNotes = () => {
    fetch(`http://localhost:5000/api/notes/${topic}`)
      .then(res => res.json())
      .then(data => {
        // Fix lỗi màn hình trắng: Đảm bảo data luôn là mảng
        setNotes(Array.isArray(data) ? data : []);
        setCurrentPage(1); // Reset về trang 1 mỗi khi tải lại dữ liệu
      })
      .catch(err => {
        console.error("Lỗi tải ghi chú:", err);
        setNotes([]);
      });
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

  // THÊM MỚI: Logic lọc dữ liệu và tính toán phân trang
  const safeNotes = Array.isArray(notes) ? notes : [];
  const filteredNotes = safeNotes.filter(note => {
    // 1. Lọc theo từ khóa
    const matchesSearch = 
      (note.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (note.content || '').toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Lọc theo ngày tạo (nếu backend có gửi kèm createdAt)
    let matchesDate = true;
    if (note.createdAt) {
      const noteDate = new Date(note.createdAt).toISOString().split('T')[0];
      if (startDate && noteDate < startDate) matchesDate = false;
      if (endDate && noteDate > endDate) matchesDate = false;
    }

    return matchesSearch && matchesDate;
  });

  // Tính toán dữ liệu hiển thị cho trang hiện tại
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);

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
      <div style={{ marginBottom: '15px' }}>
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

      {/* THÊM MỚI: Thanh Tìm kiếm và Lọc ngày */}
      <div style={{ ...cardStyle, marginBottom: '20px', padding: '10px' }}>
        <input
          type="text"
          placeholder="🔍 Tìm kiếm tiêu đề hoặc nội dung..."
          value={searchTerm}
          onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          style={inputStyle}
        />
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px' }}>
          <div style={{ flex: 1 }}>
            <span style={{ display: 'block', marginBottom: '4px' }}>Từ ngày:</span>
            <input
              type="date"
              value={startDate}
              onChange={e => { setStartDate(e.target.value); setCurrentPage(1); }}
              style={{ ...inputStyle, marginBottom: 0 }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ display: 'block', marginBottom: '4px' }}>Đến ngày:</span>
            <input
              type="date"
              value={endDate}
              onChange={e => { setEndDate(e.target.value); setCurrentPage(1); }}
              style={{ ...inputStyle, marginBottom: 0 }}
            />
          </div>
          {(searchTerm || startDate || endDate) && (
            <button 
              onClick={() => { setSearchTerm(''); setStartDate(''); setEndDate(''); }}
              style={{ padding: '8px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '22px' }}
            >
              ✕ Xóa lọc
            </button>
          )}
        </div>
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

      {/* 3.3. Danh sách thẻ ghi chú (Đã đổi notes.map thành currentNotes.map) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '15px' }}>
        {currentNotes.length === 0 && <p style={{ color: isDark ? '#aaa' : '#666', gridColumn: '1 / -1' }}>Không tìm thấy ghi chú nào phù hợp.</p>}
        
        {currentNotes.map(note => (
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

      {/* THÊM MỚI: Thanh Phân Trang */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '20px' }}>
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{ padding: '8px 12px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', backgroundColor: currentPage === 1 ? '#ccc' : '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}
          >
            Trang trước
          </button>
          
          <span style={{ color: isDark ? '#fff' : '#000', fontWeight: 'bold' }}>
            Trang {currentPage} / {totalPages}
          </span>

          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{ padding: '8px 12px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', backgroundColor: currentPage === totalPages ? '#ccc' : '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}
          >
            Trang sau
          </button>
        </div>
      )}

    </div>
  );
}

export default Notes;