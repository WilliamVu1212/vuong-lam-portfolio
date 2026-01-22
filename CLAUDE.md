# Project: William Vu Portfolio

## CURRENT STATUS (2026-01-22)

**Overall Progress: 93%** - Phase 5 (UI & Polish)

### Dự án là gì?
- Portfolio Interactive 3D kiểu Tiên Hiệp với Three.js
- User "tu tiên" qua các cảnh giới, khám phá portfolio trong thế giới 3D
- Tech: React + Three.js (R3F) + Rapier Physics + Tailwind CSS

### Phong cách hiện tại:
- 3D geometric minimalist
- Crystals clickable trực tiếp (không còn glow orbs)
- Dark theme (Xích Hỏa - Fire theme)
- Colors: #FF4444, #FF8C00, #FFD700, #FF6B35, #00CED1 (Vấn Đỉnh)

### Font chữ Tiên Hiệp:
- **Cinzel** - Display/heading chính
- **Cinzel Decorative** - Heading trang trí
- **Dancing Script** - Font thư pháp (cursive) hỗ trợ tiếng Việt đầy đủ
- **Cormorant Garamond** - Body/accent (italic đẹp)
- **Crimson Pro** - Body phụ

### Các section đã hoàn thành (7 cảnh giới):
1. **Intro** (Phàm Nhân) - Landing với rings, runes
2. **About** (Luyện Khí) - Pagoda, InfoStones, Torii gates
3. **Skills** (Trúc Cơ) - 4 pillars với clickable crystals + 2 thác nước
4. **Projects** (Kết Đan + Nguyên Anh) - 6 floating islands với clickable crystals + 2 thác nước
5. **Experience** (Hóa Thần) - 3 monuments + 2 certification stones + **2 Trảm La Kiếm (Soul Slaying Swords)**
6. **Contact** (Anh Biến) - Cloud palace, social links, gates phía sau + **2 Thượng Cổ Đồng Chung (Ancient Divine Bell)**
7. **Vấn Đỉnh** - Peak platform, throne, celestial gates, William panel + **2 Cấm Phiên (Soul Banners)**

### Camera Controls:
- OrbitControls với zoom/rotate/pan
- LevelNavigator để chuyển section (7 levels)
- Camera animation tự dừng khi user tương tác
- **Camera Debug Panel** - Hiển thị tọa độ realtime để điều chỉnh

### Camera Config (constants.ts):
- **Initial View**: Position [0, 57, 85], Target [0, 6, -156] - Toàn cảnh (X=0 ở giữa)
- **Walking**: distance 35, height 25
- **Sword Flying**: distance 40, height 20
- **Beast Flying**: distance 50, height 30

---

## Recent Update (2026-01-22) - Session 18

### Đã hoàn thành:
- ✅ **Fix góc nhìn ban đầu với X=0**
  - Camera position: [0, 57, 85] (X=0 để ở giữa màn hình)
  - Camera lookAt: [0, 6, -156]

- ✅ **Nút "Toàn Cảnh" reset về góc nhìn ban đầu**
  - Khi bấm nút Toàn Cảnh → camera trả về đúng vị trí ban đầu

### Session 17:
- ✅ Camera System cải thiện với góc nhìn toàn cảnh
- ✅ Camera Debug Panel UI

### Session 16:
- ✅ Camera Follow Player khi di chuyển

### Session 15:
- ✅ Di chuyển vị trí 4 thác nước phân bố hợp lý

### Session 14:
- ✅ Di chuyển Ngự Kiếm unlock từ Kết Đan xuống Trúc Cơ

### Sessions trước:
- Session 13: Di chuyển vị trí unlock từ Kết Đan/Anh Biến sang vị trí mới
- Session 12: Thượng Cổ Đồng Chung (Ancient Divine Bell)
- Session 11: Cưỡi Linh Thú (Phoenix Mount System)
- Session 10: UX Sword Unlock Hint
- Session 9: Ngự Kiếm (Sword Flying Mode)
- Session 8: Cấm Phiên, Trảm La Kiếm

---

## Next Steps (chưa làm)

### Short-term:
- Add sound/music integration
- Add mobile joystick controls

### Medium-term:
- Performance optimization (bundle ~3.6MB cần giảm)
- Cross-browser testing
- Deploy to Vercel

### Đã hoàn thành từ Phase 3:
- ✅ Ngự Kiếm (Sword Flying) - Session 9
- ✅ Cưỡi Linh Thú (Phoenix Mount) - Session 11
- ⬜ Transition animations giữa các mode (partial)

---

## Key Files Structure

```
src/
├── components/
│   ├── 3d/
│   │   ├── Experience.tsx      # Main scene + CameraController
│   │   ├── Player.tsx          # Player với physics + sword flight
│   │   ├── FlyingSword.tsx     # Flying sword model + trail effects
│   │   └── CloudPlatforms.tsx  # Cloud stepping
│   ├── sections/
│   │   ├── SkillsSection.tsx   # 4 pillars (clickable crystals)
│   │   ├── ProjectsSection.tsx # 6 islands (clickable crystals)
│   │   ├── ExperienceSection.tsx # 3 monuments + 2 stones + 2 Phoenix Flames
│   │   ├── AboutSection.tsx
│   │   ├── ContactSection.tsx  # Social links + gates phía sau
│   │   └── VanDinhSection.tsx  # Đỉnh cao + William panel + gates phía sau
│   └── ui/
│       ├── LevelNavigator.tsx  # Navigation dọc (7 levels)
│       ├── LoadingScreen.tsx
│       └── ProjectModal.tsx
├── stores/gameStore.ts         # Zustand (game, UI, audio)
├── data/content.ts             # Content data (7 cảnh giới)
└── App.tsx                     # Main app
```

---

## Cảnh Giới Mapping

| Level | Section | Color | English |
|-------|---------|-------|---------|
| Phàm Nhân | intro | #8B7355 | Mortal |
| Luyện Khí | about | #C4A77D | Qi Refining |
| Trúc Cơ | skills | #FF8C00 | Foundation Building |
| Kết Đan | projects | #FFD700 | Core Formation |
| Nguyên Anh | projects | #FF6B35 | Nascent Soul |
| Hóa Thần | experience | #FF4444 | Spirit Severing |
| Anh Biến | contact | #9400D3 | Infant Transformation |
| Vấn Đỉnh | vandinh | #00CED1 | Questioning the Peak |

---

## Skills Reference
Các skills Three.js nằm tại: `../.claude/skills/`

Available: threejs-animation, threejs-fundamentals, threejs-geometry, threejs-interaction, threejs-lighting, threejs-loaders, threejs-materials, threejs-postprocessing, threejs-shaders, threejs-textures

---

## Quick Commands
- Dev server: `npm run dev` (port 3001)
- Build: `npm run build`
- Progress chi tiết: Xem `PROGRESS.md`
