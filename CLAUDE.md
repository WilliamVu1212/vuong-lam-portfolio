# Project: Vuong Lam Portfolio

## 🔥 CURRENT STATUS (2026-01-21)

### Vấn đề cần giải quyết ngay:
**SVG Icons không phù hợp phong cách 3D minimalist của dự án**

- File: `src/components/ui/XianxiaIcons.tsx` (16 custom SVG icons)
- Vấn đề: Icons có nhiều đường nét chi tiết, trông "2D line art", không hòa hợp với style 3D geometric + glow
- Các section đang dùng: SkillsSection, ProjectsSection, ExperienceSection

### Đề xuất giải pháp (user chưa chọn):
1. **Option 1**: Bỏ icon, dùng hình học 3D thuần túy (chỉ màu sắc phân biệt)
2. **Option 2**: Icon đơn giản cực độ (1-2 nét: `/` `○` `△` `✦`)
3. **Option 3**: Dùng 1 ký tự Hán đơn lẻ (劍 丹 陣 龍)
4. **Option 4**: Không icon, chỉ glow orb (đã có sẵn) - **RECOMMENDED**

### Phong cách hiện tại của dự án:
- 3D geometric minimalist
- Glow/emissive effects
- Dark theme (Xích Hỏa - Fire theme)
- Colors: #FF4444, #FF8C00, #FFD700, #FF6B35

---

## Skills Reference
Các skills Three.js nằm tại: `../.claude/skills/`

Available skills:
- threejs-animation
- threejs-fundamentals
- threejs-geometry
- threejs-interaction
- threejs-lighting
- threejs-loaders
- threejs-materials
- threejs-postprocessing
- threejs-shaders
- threejs-textures

Khi làm việc với Three.js, hãy tham khảo các skill tương ứng.

---

## Quick Commands
- Dev server: `npm run dev` (port 3001)
- Build: `npm run build`
- Progress: Xem `PROGRESS.md`
