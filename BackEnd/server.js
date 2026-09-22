const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ============================================================================
// CẤU HÌNH ĐƯỜNG DẪN DỮ LIỆU THEO USER
// ============================================================================
const DEFAULT_USER = 'anhvu'; // Username mặc định để test
const userDir = path.join(__dirname, 'data', 'users', DEFAULT_USER);
const notesDir = path.join(userDir, 'notes');

const profilePath = path.join(userDir, 'profile.json');
const privateNotesFile = path.join(userDir, 'private.json');

// Helper lấy đường dẫn file ghi chú public theo chủ đề
const getPublicFilePath = (topic) => path.join(notesDir, `${topic}.json`);

// ============================================================================
// KHỞI TẠO DỮ LIỆU MẶC ĐỊNH (DATA INITIALIZATION)
// ============================================================================
function initDefaultData() {
    // 1. Tạo các thư mục theo cấu trúc /data/users/[username]/notes
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
    if (!fs.existsSync(notesDir)) fs.mkdirSync(notesDir, { recursive: true });

    // 2. Khởi tạo profile.json chuẩn định dạng
    if (!fs.existsSync(profilePath)) {
        const defaultProfile = {
            displayName: "Anh Vũ",
            theme: "dark",
            preferences: {
                theme: "dark",
                primaryColor: "#ff5722"
            },
            password: "123", // Mật khẩu truy cập ghi chú riêng tư
            privatePasswordHash: "$2b$10$wK/example_hash_here" 
        };
        fs.writeFileSync(profilePath, JSON.stringify(defaultProfile, null, 2), 'utf8');
    }

    // 3. Khởi tạo private.json kèm dữ liệu mẫu
    if (!fs.existsSync(privateNotesFile)) {
        const defaultPrivateNotes = [
            {
                id: "p_1",
                title: "Tài khoản bảo mật",
                content: "Mật khẩu truy cập phần riêng tư mặc định là: 123",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        fs.writeFileSync(privateNotesFile, JSON.stringify(defaultPrivateNotes, null, 2), 'utf8');
    }

    // 4. Khởi tạo dữ liệu mẫu cho các topic (hoc-tap.json & cong-viec.json)
    const hocTapPath = getPublicFilePath('hoc-tap');
    if (!fs.existsSync(hocTapPath)) {
        const defaultHocTap = [
            {
                id: "ht_1",
                title: "Kế hoạch bảo vệ đồ án",
                content: "1. Tối ưu code Backend.\n2. Kiểm tra lại giao diện Frontend.\n3. Chuẩn bị slide thuyết trình.",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        fs.writeFileSync(hocTapPath, JSON.stringify(defaultHocTap, null, 2), 'utf8');
    }

    const congViecPath = getPublicFilePath('cong-viec');
    if (!fs.existsSync(congViecPath)) {
        const defaultCongViec = [
            {
                id: "cv_1",
                title: "Nhiệm vụ phát triển ứng dụng",
                content: "Hoàn thiện hệ thống quản lý ghi chú đa người dùng.",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        fs.writeFileSync(congViecPath, JSON.stringify(defaultCongViec, null, 2), 'utf8');
    }
}

// Chạy khởi tạo thư mục và dữ liệu khi khởi động server
initDefaultData();

// ============================================================================
// API MODULE: PROFILE
// ============================================================================
app.get('/api/profile', (req, res) => {
    try {
        const rawData = fs.readFileSync(profilePath, 'utf8');
        const profile = JSON.parse(rawData);
        
        if (!profile.theme && profile.preferences?.theme) {
            profile.theme = profile.preferences.theme;
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: "Lỗi đọc file profile" });
    }
});

app.put('/api/profile', (req, res) => {
    try {
        let currentProfile = {};
        if (fs.existsSync(profilePath)) {
            currentProfile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
        }

        const { displayName, theme, currentPassword, newPassword } = req.body;

        // 1. Kiểm tra và thực hiện đổi mật khẩu
        if (newPassword && String(newPassword).trim() !== '') {
            if (String(currentPassword).trim() !== String(currentProfile.password).trim()) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Mật khẩu hiện tại không chính xác!" 
                });
            }

            // Ghi đè mật khẩu mới vào trường password chính
            currentProfile.password = String(newPassword).trim();
        }

        // 2. Cập nhật các trường thông tin khác
        if (displayName) currentProfile.displayName = displayName;
        if (theme) {
            currentProfile.theme = theme;
            if (!currentProfile.preferences) currentProfile.preferences = {};
            currentProfile.preferences.theme = theme;
        }

        // 3. Xóa các biến tạm thời tránh làm rác file profile.json
        delete currentProfile.currentPassword;
        delete currentProfile.newPassword;

        // 4. Lưu lại file profile.json
        fs.writeFileSync(profilePath, JSON.stringify(currentProfile, null, 2), 'utf8');
        
        res.json({ success: true, message: "Đã cập nhật Profile thành công!", profile: currentProfile });
    } catch (error) {
        res.status(500).json({ message: "Lỗi ghi file profile" });
    }
});

// ============================================================================
// API MODULE: PRIVATE NOTES
// ============================================================================
// POST /api/private/auth
app.post('/api/private/auth', (req, res) => {
    try {
        const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
        
        const inputPass = String(req.body.password || '').trim();
        const savedPass = String(profile.password || '').trim();

        if (inputPass !== '' && inputPass === savedPass) {
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: "Sai mật khẩu!" });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi xác thực mật khẩu" });
    }
});

app.get('/api/private/notes', (req, res) => {
    try {
        const data = fs.readFileSync(privateNotesFile, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ message: "Lỗi đọc ghi chú riêng tư" });
    }
});

app.post('/api/private/notes', (req, res) => {
    try {
        let notes = JSON.parse(fs.readFileSync(privateNotesFile, 'utf8'));
        const newNote = {
            id: Date.now().toString(),
            title: req.body.title || "Ghi chú bảo mật",
            content: req.body.content || "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        notes.push(newNote);
        fs.writeFileSync(privateNotesFile, JSON.stringify(notes, null, 2), 'utf8');
        res.json({ success: true, note: newNote });
    } catch (error) {
        res.status(500).json({ message: "Lỗi thêm ghi chú kín" });
    }
});

app.put('/api/private/notes/:id', (req, res) => {
    try {
        let notes = JSON.parse(fs.readFileSync(privateNotesFile, 'utf8'));
        const index = notes.findIndex(n => n.id === req.params.id);
        if (index !== -1) {
            notes[index].title = req.body.title ?? notes[index].title;
            notes[index].content = req.body.content ?? notes[index].content;
            notes[index].updatedAt = new Date().toISOString();
            fs.writeFileSync(privateNotesFile, JSON.stringify(notes, null, 2), 'utf8');
            return res.json({ success: true, message: "Đã sửa thành công" });
        }
        res.status(404).json({ message: "Không tìm thấy ghi chú" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật ghi chú kín" });
    }
});

app.delete('/api/private/notes/:id', (req, res) => {
    try {
        let notes = JSON.parse(fs.readFileSync(privateNotesFile, 'utf8'));
        const newNotes = notes.filter(n => n.id !== req.params.id);
        fs.writeFileSync(privateNotesFile, JSON.stringify(newNotes, null, 2), 'utf8');
        res.json({ success: true, message: "Đã xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi xóa ghi chú kín" });
    }
});

// ============================================================================
// API MODULE: PUBLIC NOTES BY TOPIC
// ============================================================================
app.get('/api/notes/:topic', (req, res) => {
    const filePath = getPublicFilePath(req.params.topic);
    try {
        if (!fs.existsSync(filePath)) return res.json([]);
        const data = fs.readFileSync(filePath, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ message: "Lỗi đọc danh sách ghi chú" });
    }
});

app.post('/api/notes/:topic', (req, res) => {
    const filePath = getPublicFilePath(req.params.topic);
    try {
        let notes = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : [];
        const newNote = {
            id: Date.now().toString(),
            title: req.body.title || "Không tiêu đề",
            content: req.body.content || "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        notes.push(newNote);
        fs.writeFileSync(filePath, JSON.stringify(notes, null, 2), 'utf8');
        res.json({ success: true, note: newNote });
    } catch (error) {
        res.status(500).json({ message: "Lỗi thêm ghi chú" });
    }
});

app.put('/api/notes/:topic/:id', (req, res) => {
    const filePath = getPublicFilePath(req.params.topic);
    try {
        if (!fs.existsSync(filePath)) return res.status(404).json({ message: "Không tìm thấy ghi chú" });
        let notes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const index = notes.findIndex(n => n.id === req.params.id);
        if (index !== -1) {
            notes[index].title = req.body.title ?? notes[index].title;
            notes[index].content = req.body.content ?? notes[index].content;
            notes[index].updatedAt = new Date().toISOString();
            fs.writeFileSync(filePath, JSON.stringify(notes, null, 2), 'utf8');
            return res.json({ success: true, message: "Đã sửa thành công" });
        }
        res.status(404).json({ message: "Không tìm thấy ghi chú" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật ghi chú" });
    }
});

app.delete('/api/notes/:topic/:id', (req, res) => {
    const filePath = getPublicFilePath(req.params.topic);
    try {
        if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File không tồn tại" });
        let notes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const newNotes = notes.filter(n => n.id !== req.params.id);
        fs.writeFileSync(filePath, JSON.stringify(newNotes, null, 2), 'utf8');
        res.json({ success: true, message: "Đã xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi xóa ghi chú" });
    }
});

// Route trả về danh sách danh mục chủ đề
app.get('/api/categories', (req, res) => {
    const categories = [
        { id: 'hoc-tap', name: 'Học tập', slug: 'hoc-tap' },
        { id: 'cong-viec', name: 'Công việc', slug: 'cong-viec' },
        { id: 'ca-nhan', name: 'Cá nhân', slug: 'ca-nhan' }
    ];
    res.json(categories);
});

// ============================================================================
// CHẠY SERVER
// ============================================================================
const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));