# Project: William Vu Portfolio

## CURRENT STATUS (2026-01-22)

**Overall Progress: 95%** - Phase 5 (UI & Polish)

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
5. **Experience** (Hóa Thần) - 3 monuments + 2 certification stones + **2 Thượng Cổ Đồng Chung (unlock Cưỡi Phượng)**
6. **Contact** (Anh Biến) - Cloud palace, social links, gates phía sau
7. **Vấn Đỉnh** - Peak platform, throne, celestial gates, William panel + **2 Cấm Phiên (Soul Banners)**

### Camera Controls:
- OrbitControls với zoom/rotate/pan
- LevelNavigator để chuyển section (7 levels)
- Camera animation tự dừng khi user tương tác
- **Camera Debug Panel** - Hiển thị tọa độ realtime để điều chỉnh

### Camera Config (constants.ts):
- **Initial View**: Position [0, 57, 85], Target [0, 6, -156] - Toàn cảnh (X=0 ở giữa)
- **Walking**: distance 45, height 35, lookAhead 30
- **Sword Flying**: distance 55, height 40, lookAhead 35
- **Beast Flying**: distance 65, height 50, lookAhead 40

### Flight Controls:
- **W** - Tiến về phía trước (Z âm)
- **S** - Lùi về phía sau (Z dương)
- **A** - Sang trái (X âm)
- **D** - Sang phải (X dương)
- **Q / Space** - Bay lên
- **E** - Bay xuống
- **F** - Bật/tắt chế độ bay

---

## Recent Update (2026-01-22) - Session 25

### Đã hoàn thành:
- ✅ **Complete SFX Integration**
  - Thêm `playUnlock` sound khi unlock Ngự Kiếm (AboutSection.tsx)
  - Thêm `playUnlock` sound khi unlock Cưỡi Phượng (ExperienceSection.tsx)
  - Thêm `playUIClick` sound cho LevelNavigator (all level nodes + overview button)
  - Thêm `playUIClick` sound cho Transport Mode selector (HUD)
  - AudioControls đã có sẵn playUIClick

### Files đã sửa:
- `src/components/sections/AboutSection.tsx` - Import useSoundEffects, playUnlock on sword unlock
- `src/components/sections/ExperienceSection.tsx` - Import useSoundEffects, playUnlock on beast unlock
- `src/components/ui/LevelNavigator.tsx` - Import useSoundEffects, playUIClick on navigate
- `src/App.tsx` - playUIClick in HUD cycleTransportMode

---

## Session 24

### Đã hoàn thành:
- ✅ **Mobile Joystick Controls**
  - Dual joystick layout với nipplejs library
  - Left joystick: Di chuyển W/A/S/D
  - Right joystick: Vertical control (ascend/descend khi bay)
  - Action buttons: Jump, Fly Toggle, Transport Mode
  - Auto-detect mobile/tablet devices
  - Hide keyboard ControlsHelp + CameraDebug trên mobile
  - Xích Hỏa theme styling (red/gold)

### Files mới:
- `src/components/ui/MobileControls.tsx` - Main mobile UI component
- `src/hooks/useMobileDetect.ts` - Mobile device detection hook
- `src/types/nipplejs.d.ts` - TypeScript declarations for nipplejs

### Files đã sửa:
- `src/stores/gameStore.ts` - Thêm isMobile state
- `src/utils/constants.ts` - Thêm mobile config
- `src/App.tsx` - Render MobileControls, hide desktop UI on mobile

---

## Session 23

### Đã hoàn thành:
- ✅ **Fix Phoenix Mount Unlock Bug**
  - Sửa lỗi unlock Cưỡi Phượng không hoạt động khi đang bay kiếm
  - Nguyên nhân: Code tự động đổi `transportMode` khi unlock, gây xung đột
  - Giờ chỉ unlock, không tự động chuyển mode

- ✅ **Transport Mode Selector UI**
  - Thêm UI clickable để chuyển đổi giữa các phương thức di chuyển
  - Click vào "Phương Thức" ở góc trên trái để cycle qua các mode đã unlock
  - Hiển thị icon 🔄 khi có nhiều mode
  - Cho phép đổi mode ngay cả khi đang bay (auto exit flight)

- ✅ **Cập nhật Unlock Prompt**
  - Hướng dẫn rõ hơn khi unlock Cưỡi Phượng
  - Chỉ dẫn click "Phương Thức" để chọn mode

- ✅ **Giảm tốc độ bay để tránh lag**
  - Ngự Kiếm: maxSpeed 50→35, acceleration 20→12, verticalSpeed 25→18
  - Phượng Hoàng: maxSpeed 80→50, acceleration 15→10, verticalSpeed 30→20

### Session 22:
- ✅ **Simplify Flight Controls**
  - Q/Space để bay lên, E để bay xuống (bỏ Shift)
  - Update UI trong ControlsHelp và tutorial popups
  - Sửa font button cho tiếng Việt hiển thị đẹp hơn

- ✅ **Fix Flight Bounds Logic**
  - Sửa logic bounds: chỉ chặn khi đi RA XA bounds, cho phép đi VỀ PHÍA TRONG
  - Player có thể thoát khi bị kẹt ngoài bounds

- ✅ **Remove Auto-Exit Flight**
  - Bỏ tự động thoát bay khi giữ E gần mặt đất
  - CHỈ thoát chế độ bay khi bấm F (manual toggle)

- ✅ **Fix Flight Mode Exit Bug**
  - Sửa lỗi bấm cả 2 phím cùng lúc bị thoát chế độ bay

### Session 21:
- ✅ **Audio Files Added**
  - `night-wind.mp3` - Nhạc nền ambient (Suno)
  - `main-theme.mp3` - Nhạc nền chính Tiên Hiệp (Suno)
  - `jump.mp3` - Tiếng nhảy (Pixabay)
  - `land.mp3` - Tiếng tiếp đất (Pixabay)

- ✅ **Auto-play Music on First Interaction**
  - Nhạc tự động phát khi click vào game lần đầu
  - Phát cả ambient + main theme cùng lúc
  - Fix bug: separate tracking cho ambient và music

- ✅ **Music Trigger từ Player.tsx**
  - Khi click để nhảy, nhạc cũng được trigger
  - Giải quyết vấn đề event bị canvas bắt mất

### Session 20:
- ✅ **Sound/Music Integration với Howler.js**
  - Cài đặt Howler.js cho audio management
  - Tạo `audioManager.ts` - centralized audio control
  - Tạo `useAudio.ts` hook - React integration
  - AudioStore đã có sẵn trong gameStore.ts

- ✅ **Sound Effects (SFX)**
  - Jump sound khi nhảy (keyboard + click-to-jump)
  - Land sound khi tiếp đất
  - Sword whoosh khi bật Ngự Kiếm
  - Phoenix cry khi bật Cưỡi Phượng
  - UI click sound

- ✅ **Audio Controls UI**
  - Nút 🔊 ở góc dưới phải
  - Panel điều chỉnh: Master, Music, SFX volume
  - Mute/Unmute toggle
  - Auto-start ambient khi user tương tác (browser requirement)

- ✅ **Audio Files Structure**
  - `public/sounds/ambient/` - Nhạc nền môi trường
  - `public/sounds/music/` - Nhạc nền chính
  - `public/sounds/sfx/` - Hiệu ứng âm thanh
  - README.md hướng dẫn thêm audio files

### Session 19:
- ✅ Camera góc nhìn từ trên xuống chéo
- ✅ Fix hướng di chuyển khi bay (world space)
- ✅ Fix phím F toggle flight

### Session 18:
- ✅ Fix góc nhìn ban đầu với X=0
- ✅ Nút "Toàn Cảnh" reset về góc nhìn ban đầu

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
- ✅ ~~Add sound/music integration~~ (Done - Session 20)
- ✅ ~~Add audio files~~ (Done - Session 21)
- ✅ ~~Add mobile joystick controls~~ (Done - Session 24)
- ✅ ~~Add remaining SFX~~ (Done - Session 25: sword-whoosh, phoenix-cry, ui-click, unlock)

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
│       ├── ProjectModal.tsx
│       └── MobileControls.tsx  # Mobile joystick + buttons
├── hooks/
│   ├── useKeyboardControls.ts  # Keyboard input
│   ├── useMobileDetect.ts      # Mobile device detection
│   └── useAudio.ts             # Audio hooks
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
