# Project: William Vu Portfolio

## CURRENT STATUS (2026-01-21)

**Overall Progress: 88%** - Phase 5 (UI & Polish)

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
6. **Contact** (Anh Biến) - Cloud palace, social links, gates phía sau + **2 Thần Phượng (Băng Phượng + Hỏa Phượng)**
7. **Vấn Đỉnh** - Peak platform, throne, celestial gates, William panel + **2 Cấm Phiên (Soul Banners)**

### Camera Controls:
- OrbitControls với zoom/rotate/pan
- LevelNavigator để chuyển section (7 levels)
- Camera animation tự dừng khi user tương tác

---

## Recent Update (2026-01-21) - Session 9

### Đã hoàn thành:
- ✅ **Ngự Kiếm (Sword Flying Mode)** - Hoàn toàn có thể bay kiếm!
  - **FlyingSword.tsx** - Thanh kiếm vàng kim với trail effect khi bay
  - **Flight Physics** - Bay tự do 3D với WASD + Space(lên) + Shift(xuống)
  - **Unlock System** - Đến gần Trảm La Kiếm ở Hóa Thần để unlock
  - **Camera Follow** - Camera tự động theo sau khi bay
  - **UI Updates** - HUD hiển thị trạng thái bay, hướng dẫn điều khiển
  - **Controls**: F để bật/tắt bay, WASD di chuyển, Space/Q lên, Shift/E xuống

### Session trước:
- ✅ **Thần Phượng (Divine Phoenix)** ở Anh Biến
- ✅ **Cấm Phiên (Soul Banner)** ở Vấn Đỉnh
- ✅ **Trảm La Kiếm (Soul Slaying Sword)** ở Hóa Thần

---

## Next Steps (chưa làm)

### Short-term:
- Add sound/music integration
- Add mobile joystick controls

### Medium-term:
- Performance optimization (bundle 3.5MB cần giảm)
- Cross-browser testing
- Deploy to Vercel

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
