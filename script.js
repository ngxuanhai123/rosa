// --- CẤU HÌNH ---
// 1. Thay đổi đường dẫn này bằng Public URL Bucket R2 của bạn
const R2_BASE_URL = "https://c000d38d86c5d98c143749e20cad45a4.r2.cloudflarestorage.com/rosa"; 

// 2. Tên file nhạc bạn đã upload lên R2 (Ví dụ: vui-vi.mp3, joyful-en.mp3...)
const RESOURCES = {
    vi: {
        joyful: "vui-vi.mp3",       // Năm sự Vui
        sorrowful: "thuong-vi.mp3", // Năm sự Thương
        glorious: "mung-vi.mp3",    // Năm sự Mừng
        luminous: "sang-vi.mp3",    // Năm sự Sáng
        labels: {
            joyful: "Năm Sự Vui",
            sorrowful: "Năm Sự Thương",
            glorious: "Năm Sự Mừng",
            luminous: "Năm Sự Sáng",
            loading: "Đang tải...",
            sub: "Kinh Mân Côi trọn bộ"
        }
    },
    en: {
        joyful: "joyful-en.mp3",
        sorrowful: "sorrowful-en.mp3",
        glorious: "glorious-en.mp3",
        luminous: "luminous-en.mp3",
        labels: {
            joyful: "Joyful Mysteries",
            sorrowful: "Sorrowful Mysteries",
            glorious: "Glorious Mysteries",
            luminous: "Luminous Mysteries",
            loading: "Loading...",
            sub: "Daily Holy Rosary"
        }
    },
    id: {
        joyful: "joyful-id.mp3",
        sorrowful: "sorrowful-id.mp3",
        glorious: "glorious-id.mp3",
        luminous: "luminous-id.mp3",
        labels: {
            joyful: "Peristiwa Gembira",
            sorrowful: "Peristiwa Sedih",
            glorious: "Peristiwa Mulia",
            luminous: "Peristiwa Terang",
            loading: "Memuat...",
            sub: "Rosario Suci Harian"
        }
    }
};

// --- LOGIC XỬ LÝ ---

// Lấy ngôn ngữ từ localStorage hoặc mặc định là tiếng Việt
let currentLang = localStorage.getItem('rosary_lang') || 'vi';

function getMysteryType() {
    const day = new Date().getDay(); // 0 = Chủ Nhật, 1 = Thứ 2...
    
    // Logic Phụng vụ:
    // T2 (1) & T7 (6): Vui
    // T3 (2) & T6 (5): Thương
    // T4 (3) & CN (0): Mừng
    // T5 (4): Sáng
    switch(day) {
        case 1: case 6: return 'joyful';
        case 2: case 5: return 'sorrowful';
        case 4:         return 'luminous';
        case 0: case 3: return 'glorious';
        default:        return 'joyful';
    }
}

function updateUI() {
    const mysteryKey = getMysteryType();
    const data = RESOURCES[currentLang];
    
    // Cập nhật text
    document.getElementById('mystery-name').textContent = data.labels[mysteryKey];
    document.getElementById('sub-text').textContent = data.labels.sub;

    // Cập nhật ngày tháng
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    // Format ngày theo ngôn ngữ (vi-VN, en-US, id-ID)
    const localeMap = { vi: 'vi-VN', en: 'en-US', id: 'id-ID' };
    document.getElementById('date-display').textContent = new Date().toLocaleDateString(localeMap[currentLang], dateOptions);

    // Cập nhật Audio Link
    const audioPlayer = document.getElementById('audio-player');
    const fileName = data[mysteryKey];
    const newSrc = `${R2_BASE_URL}/${fileName}`;

    // Chỉ load lại nếu source thay đổi để tránh gián đoạn nếu user bấm lung tung
    if (!audioPlayer.src.includes(fileName)) {
        audioPlayer.src = newSrc;
        audioPlayer.load(); 
    }

    // Cập nhật nút active
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${currentLang}`).classList.add('active');
}

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('rosary_lang', lang); // Lưu nhớ cho lần sau
    updateUI();
}

// Chạy khi web tải xong
document.addEventListener('DOMContentLoaded', updateUI);
