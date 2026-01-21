# Project: Vuong Lam Portfolio

## 🔥 CURRENT STATUS (2026-01-21)

**Overall Progress: 70%** - Phase 5 (UI & Polish)

### Dự án là gì?
- Portfolio Interactive 3D kiểu Tiên Hiệp với Three.js
- User "tu tiên" qua các cảnh giới, khám phá portfolio trong thế giới 3D
- Tech: React + Three.js (R3F) + Rapier Physics + Tailwind CSS

### Phong cách hiện tại:
- 3D geometric minimalist
- Glow orbs thay vì icons (CSS radial-gradient + box-shadow)
- Dark theme (Xích Hỏa - Fire theme)
- Colors: #FF4444, #FF8C00, #FFD700, #FF6B35

### Các section đã hoàn thành:
1. **Intro** (Phàm Nhân) - Landing với rings, runes
2. **About** (Luyện Khí) - Pagoda, InfoStones, Torii gates
3. **Skills** (Trúc Cơ) - 4 pillars với glow orbs, click để xem chi tiết
4. **Projects** (Kim Đan + Nguyên Anh) - 6 floating islands với glow orbs
5. **Experience** (Hóa Thần) - 3 monuments + 2 certification stones (đã sắp xếp cân xứng)
6. **Contact** (Đại Thừa) - Cloud palace style

### Camera Controls:
- OrbitControls với zoom/rotate/pan
- LevelNavigator để chuyển section
- Camera animation tự dừng khi user tương tác

---

## 🔮 Next Steps (chưa làm)

### Short-term:
- Add sound/music integration
- Implement sword flying mode (Ngự Kiếm)
- Add mobile joystick controls

### Medium-term:
- Performance optimization (bundle 3.5MB cần giảm)
- Cross-browser testing
- Deploy to Vercel

---

## 📁 Key Files Structure

```
src/
├── components/
│   ├── 3d/
│   │   ├── Experience.tsx      # Main scene + CameraController
│   │   ├── Player.tsx          # Player với physics
│   │   └── CloudPlatforms.tsx  # Cloud stepping
│   ├── sections/
│   │   ├── SkillsSection.tsx   # 4 pillars (glow orbs)
│   │   ├── ProjectsSection.tsx # 6 islands (glow orbs)
│   │   ├── ExperienceSection.tsx # 3 monuments + 2 stones (tam giác đều)
│   │   ├── AboutSection.tsx
│   │   └── ContactSection.tsx
│   └── ui/
│       ├── LevelNavigator.tsx  # Navigation dọc
│       ├── LoadingScreen.tsx
│       └── ProjectModal.tsx
├── stores/gameStore.ts         # Zustand (game, UI, audio)
├── data/content.ts             # Content data
└── App.tsx                     # Main app
```

---

## Skills Reference
Các skills Three.js nằm tại: `../.claude/skills/`

Available: threejs-animation, threejs-fundamentals, threejs-geometry, threejs-interaction, threejs-lighting, threejs-loaders, threejs-materials, threejs-postprocessing, threejs-shaders, threejs-textures

---

## Quick Commands
- Dev server: `npm run dev` (port 3001)
- Build: `npm run build`
- Progress chi tiết: Xem `PROGRESS.md`
