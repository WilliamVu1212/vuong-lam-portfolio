# VƯƠNG LÂM PORTFOLIO - Project Planning

> Portfolio Interactive kiểu Tiên Hiệp với Three.js
> Khởi tạo: 2026-01-21

---

## 📋 Mục Lục

1. [Tổng Quan Project](#1-tổng-quan-project)
2. [Concept & Theme](#2-concept--theme)
3. [Tech Stack](#3-tech-stack)
4. [Design System](#4-design-system)
5. [World Structure](#5-world-structure)
6. [Features & Interactions](#6-features--interactions)
7. [Content Details](#7-content-details)
8. [Project Structure](#8-project-structure)
9. [Development Phases](#9-development-phases)
10. [Asset Requirements](#10-asset-requirements)
11. [Performance Targets](#11-performance-targets)
12. [Deployment](#12-deployment)
13. [Progress Tracking](#13-progress-tracking)

---

## 1. Tổng Quan Project

### Thông tin cơ bản

| Field | Value |
|-------|-------|
| **Tên Project** | Vương Lâm Portfolio |
| **Loại** | Interactive 3D Portfolio |
| **Theme** | Tiên Hiệp / Cultivation |
| **Target** | Full Experience |
| **Timeline** | 8 tuần |

### Profile

```
Đạo Hiệu:     Vương Lâm
Danh Xưng:    Creative Developer / Digital Cultivator
Style:        Professional
```

### Inspiration

- Bruno Simon Portfolio (https://bruno-simon.com/)
- Cultivation/Xianxia aesthetics
- Chinese mythology

---

## 2. Concept & Theme

### 2.1 Vision Statement

> Người xem sẽ "tu tiên" qua các cảnh giới, sử dụng đạp mây, ngự kiếm,
> và cưỡi linh thú để khám phá portfolio trong một thế giới tiên hiệp 3D.

### 2.2 Cultivation Journey (User Flow)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   🌸 PHÀM NHÂN        →  Landing / Intro                       │
│   (Mortal Realm)         First impression, enter portal         │
│         │                                                       │
│         ▼ [Đạp Mây]                                            │
│   🏛️ LUYỆN KHÍ        →  About Me                              │
│   (Qi Refining)          Bio, introduction, journey             │
│         │                                                       │
│         ▼ [Đạp Mây]                                            │
│   📚 TRÚC CƠ          →  Skills                                │
│   (Foundation)           Technical skills, tools                │
│         │                                                       │
│         ▼ [Ngự Kiếm - Unlock]                                  │
│   ⚔️ KIM ĐAN          →  Projects (1-3)                        │
│   (Golden Core)          First 3 projects showcase              │
│         │                                                       │
│         ▼ [Ngự Kiếm]                                           │
│   💎 NGUYÊN ANH       →  Projects (4-6)                        │
│   (Nascent Soul)         Last 3 projects showcase               │
│         │                                                       │
│         ▼ [Cưỡi Linh Thú - Unlock]                             │
│   🐉 HÓA THẦN         →  Experience & Achievements              │
│   (Spirit Severing)      Work history, certifications           │
│         │                                                       │
│         ▼ [Cưỡi Linh Thú]                                      │
│   ☁️ ĐẠI THỪA         →  Contact                               │
│   (Mahayana)             Contact form, social links             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Visual Elements

| Element | Description |
|---------|-------------|
| **Floating Mountains** | Núi bay lơ lửng, nơi đặt các sections |
| **Cloud Sea** | Biển mây bên dưới, particles effect |
| **Cherry Blossoms** | Hoa đào rơi, ambient particles |
| **Spirit Energy** | Linh khí particles, glow effects |
| **Ancient Architecture** | Đền đài, cổng torii, pagoda |
| **Moon & Stars** | Trăng tròn lớn, bầu trời sao |
| **Fire Elements** | Theo theme Xích Hỏa - lửa, ánh đỏ |

---

## 3. Tech Stack

### 3.1 Core Technologies

```
📦 CORE
├── React 18.2+              # UI Framework
├── React Three Fiber 8+     # React renderer for Three.js
├── Three.js r160+           # 3D Engine
├── Vite 5+                  # Build tool
└── TypeScript 5+            # Type safety

🎨 3D & ANIMATION
├── @react-three/drei        # Useful helpers
├── @react-three/rapier      # Physics (Rust-based, fast)
├── @react-three/postprocessing  # Visual effects
├── GSAP 3.12+               # Timeline animations
└── Framer Motion 10+        # UI animations

🎭 UI & STYLING
├── Tailwind CSS 3.4+        # Utility-first CSS
├── Zustand 4+               # State management
└── Lucide React             # Icons

🔧 DEV TOOLS
├── Leva                     # Debug GUI
├── R3F-Perf                 # Performance monitor
└── ESLint + Prettier        # Code quality
```

### 3.2 Dependencies (package.json)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.92.0",
    "@react-three/rapier": "^1.2.0",
    "@react-three/postprocessing": "^2.15.0",
    "three": "^0.160.0",
    "gsap": "^3.12.0",
    "framer-motion": "^10.18.0",
    "zustand": "^4.4.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "@types/react": "^18.2.0",
    "@types/three": "^0.160.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "leva": "^0.9.0",
    "r3f-perf": "^7.1.0",
    "eslint": "^8.56.0",
    "prettier": "^3.2.0"
  }
}
```

---

## 4. Design System

### 4.1 Color Palette - Xích Hỏa (Fire Theme)

```css
:root {
  /* Primary - Backgrounds */
  --color-primary:        #1A0A0A;   /* Huyết Dạ - Main bg */
  --color-secondary:      #2D1B1B;   /* Ám Hồng - Section bg */
  --color-tertiary:       #3D2424;   /* Thâm Hồng - Cards */

  /* Accent - Interactive */
  --color-accent-1:       #FF4444;   /* Xích Viêm - Primary accent */
  --color-accent-2:       #FF8C00;   /* Hỏa Quang - Secondary accent */
  --color-accent-3:       #FF6B35;   /* Liệt Diệm - Tertiary */

  /* Special */
  --color-gold:           #FFD700;   /* Hoàng Kim - Important */
  --color-energy:         #FF4500;   /* Linh Hỏa - Energy/particles */

  /* Text */
  --color-text-primary:   #F5E6D3;   /* Cổ Chỉ - Main text */
  --color-text-secondary: #C4A77D;   /* Thổ Kim - Secondary text */
  --color-text-muted:     #8B7355;   /* Ám Thổ - Muted text */

  /* Gradients */
  --gradient-fire: linear-gradient(135deg, #FF4444 0%, #FF8C00 50%, #FFD700 100%);
  --gradient-dark: linear-gradient(180deg, #1A0A0A 0%, #2D1B1B 100%);
  --gradient-glow: radial-gradient(circle, #FF4444 0%, transparent 70%);
}
```

### 4.2 Typography

```css
/* Headings - Sử dụng font có chất Á Đông */
--font-heading: 'Cinzel Decorative', 'Ma Shan Zheng', serif;

/* Body - Readable */
--font-body: 'Nunito', 'Noto Sans SC', sans-serif;

/* Code/Technical */
--font-mono: 'JetBrains Mono', monospace;

/* Sizes */
--text-xs:    0.75rem;    /* 12px */
--text-sm:    0.875rem;   /* 14px */
--text-base:  1rem;       /* 16px */
--text-lg:    1.125rem;   /* 18px */
--text-xl:    1.25rem;    /* 20px */
--text-2xl:   1.5rem;     /* 24px */
--text-3xl:   1.875rem;   /* 30px */
--text-4xl:   2.25rem;    /* 36px */
--text-5xl:   3rem;       /* 48px */
--text-6xl:   3.75rem;    /* 60px */
```

### 4.3 Spacing & Layout

```css
/* Spacing scale */
--space-1:  0.25rem;   /* 4px */
--space-2:  0.5rem;    /* 8px */
--space-3:  0.75rem;   /* 12px */
--space-4:  1rem;      /* 16px */
--space-6:  1.5rem;    /* 24px */
--space-8:  2rem;      /* 32px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-24: 6rem;      /* 96px */

/* Border radius */
--radius-sm:  0.25rem;
--radius-md:  0.5rem;
--radius-lg:  1rem;
--radius-xl:  1.5rem;
--radius-full: 9999px;
```

### 4.4 Effects & Shadows

```css
/* Shadows - Fire glow effect */
--shadow-sm:    0 2px 8px rgba(255, 68, 68, 0.1);
--shadow-md:    0 4px 16px rgba(255, 68, 68, 0.15);
--shadow-lg:    0 8px 32px rgba(255, 68, 68, 0.2);
--shadow-glow:  0 0 20px rgba(255, 68, 68, 0.4);
--shadow-fire:  0 0 40px rgba(255, 140, 0, 0.3);

/* Blur */
--blur-sm:  4px;
--blur-md:  8px;
--blur-lg:  16px;
--blur-xl:  24px;
```

---

## 5. World Structure

### 5.1 3D World Layout (Top-down view)

```
                            N
                            │
            ┌───────────────┼───────────────┐
            │               │               │
            │    ☁️ CONTACT │               │
            │    (Đại Thừa) │               │
            │       ▲       │               │
            │       │       │               │
     W ─────┼───────┼───────┼───────────────┼───── E
            │       │       │               │
            │   🐉 EXPERIENCE               │
            │   (Hóa Thần)  │               │
            │       ▲       │               │
            │       │       │               │
            │   ┌───┴───┐   │               │
            │   │       │   │               │
            │  💎P4-6  ⚔️P1-3               │
            │   │       │   │               │
            │   └───┬───┘   │               │
            │       │       │               │
            │   📚 SKILLS   │               │
            │   (Trúc Cơ)   │               │
            │       ▲       │               │
            │       │       │               │
            │   🏛️ ABOUT    │               │
            │   (Luyện Khí) │               │
            │       ▲       │               │
            │       │       │               │
            │   🌸 INTRO    │               │
            │   (Phàm Nhân) │               │
            │               │               │
            └───────────────┼───────────────┘
                            │
                            S
```

### 5.2 Section Details

| Section | Position (x, y, z) | Size | Key Elements |
|---------|-------------------|------|--------------|
| **Intro** | (0, 0, 0) | 50x50 | Portal gate, title, enter button |
| **About** | (0, 30, -100) | 80x80 | Pagoda, character info |
| **Skills** | (0, 60, -200) | 100x100 | Skill tablets, energy flows |
| **Projects 1-3** | (80, 100, -300) | 120x80 | Floating islands x3 |
| **Projects 4-6** | (-80, 100, -300) | 120x80 | Floating islands x3 |
| **Experience** | (0, 150, -450) | 100x100 | Mountain peak, timeline |
| **Contact** | (0, 200, -550) | 60x60 | Cloud palace, form |

### 5.3 Environment Elements

```javascript
// Danh sách elements cần tạo
const worldElements = {
  terrain: {
    floatingMountains: 8,      // Núi bay chính
    smallRocks: 20,            // Đá nhỏ trang trí
    cloudPlatforms: 15,        // Nền mây để đạp
  },
  architecture: {
    mainGate: 1,               // Cổng chính (Intro)
    pagodas: 3,                // Đền/chùa
    bridges: 4,                // Cầu nối
    toriiGates: 6,             // Cổng torii nhỏ
    lanterns: 20,              // Đèn lồng
  },
  nature: {
    cherryTrees: 15,           // Cây hoa đào
    bambooGroves: 5,           // Bụi tre
    waterfalls: 3,             // Thác nước
    ponds: 2,                  // Ao sen
  },
  particles: {
    cherryPetals: true,        // Cánh hoa rơi
    fireflies: true,           // Đom đóm (đỏ/cam)
    energyOrbs: true,          // Cầu linh khí
    embers: true,              // Tàn lửa bay
  },
  sky: {
    moon: 1,                   // Trăng tròn lớn
    stars: true,               // Bầu trời sao
    clouds: true,              // Mây di chuyển
    aurora: true,              // Cực quang đỏ/cam
  }
};
```

---

## 6. Features & Interactions

### 6.1 Movement Systems

#### Stage 1: Đạp Mây (Cloud Stepping)
```typescript
interface CloudSteppingConfig {
  enabled: true;
  sections: ['intro', 'about', 'skills'];
  controls: {
    desktop: 'Click on clouds / Arrow keys';
    mobile: 'Tap on clouds';
  };
  physics: {
    jumpHeight: 15;
    gravity: -30;
    airControl: 0.3;
  };
  visuals: {
    cloudTrail: true;
    landingEffect: 'ripple';
  };
}
```

#### Stage 2: Ngự Kiếm (Sword Flying)
```typescript
interface SwordFlyingConfig {
  enabled: true;
  unlockCondition: 'complete_skills_section';
  sections: ['skills', 'projects_1-3', 'projects_4-6'];
  controls: {
    desktop: 'WASD + Mouse look';
    mobile: 'Virtual joystick + Gyroscope';
  };
  physics: {
    maxSpeed: 50;
    acceleration: 20;
    turnSpeed: 3;
    tilt: true;
  };
  visuals: {
    swordModel: 'chinese_jian';
    trailEffect: 'fire_streak';
    auraGlow: true;
  };
}
```

#### Stage 3: Cưỡi Linh Thú (Spirit Beast Riding)
```typescript
interface SpiritBeastConfig {
  enabled: true;
  unlockCondition: 'view_3_projects';
  sections: ['projects', 'experience', 'contact'];
  beastType: 'fire_phoenix'; // hoặc 'dragon'
  controls: {
    desktop: 'WASD + Space (ascend) + Shift (descend)';
    mobile: 'Tilt + Tap';
  };
  physics: {
    maxSpeed: 80;
    acceleration: 15;
    verticalSpeed: 30;
  };
  visuals: {
    model: 'phoenix_low_poly';
    wingAnimation: true;
    fireTrail: true;
    featherParticles: true;
  };
}
```

### 6.2 UI Components

```typescript
// UI Elements cần implement
const uiComponents = {
  // HUD - Always visible
  hud: {
    minimap: true,              // Bản đồ nhỏ góc phải
    cultivationLevel: true,     // Hiển thị cảnh giới hiện tại
    navigationHints: true,      // Gợi ý điều khiển
  },

  // Overlays - Contextual
  overlays: {
    sectionTitle: true,         // Tên section khi vào
    projectModal: true,         // Chi tiết project
    skillTooltip: true,         // Tooltip khi hover skill
  },

  // Menus
  menus: {
    mainMenu: true,             // Pause menu
    settingsMenu: true,         // Cài đặt (sound, quality)
    helpMenu: true,             // Hướng dẫn
  },

  // Mobile specific
  mobile: {
    virtualJoystick: true,      // Joystick ảo
    actionButtons: true,        // Nút tương tác
    gestureHints: true,         // Hướng dẫn gesture
  }
};
```

### 6.3 Interaction Events

```typescript
// Event system
const interactions = {
  onSectionEnter: (section) => {
    // Hiển thị title animation
    // Thay đổi ambient music
    // Update minimap
  },

  onProjectClick: (project) => {
    // Mở modal chi tiết
    // Pause movement
    // Show project showcase
  },

  onSkillHover: (skill) => {
    // Hiển thị tooltip
    // Highlight related projects
    // Play subtle sound
  },

  onUnlockTransport: (type) => {
    // Cinematic transition
    // Tutorial popup
    // Achievement notification
  },

  onContactSubmit: (data) => {
    // Send form data
    // Success animation
    // Thank you message
  }
};
```

---

## 7. Content Details

### 7.1 About Section

```yaml
name: Vương Lâm
title: Creative Developer
tagline: "Tu luyện code, ngộ đạo digital"

bio: |
  Một developer đam mê tạo ra những trải nghiệm web độc đáo và sáng tạo.
  Chuyên về Frontend Development với focus vào interactive experiences,
  3D web, và creative coding.

highlights:
  - 🔥 Passionate về Creative Development
  - ⚔️ Chuyên React & Three.js ecosystem
  - 🎨 Kết hợp Art + Technology
  - 🚀 Luôn học hỏi công nghệ mới

journey:
  - year: "Năm 1"
    title: "Nhập Môn"
    desc: "Bắt đầu học HTML, CSS, JavaScript"
  - year: "Năm 2"
    title: "Luyện Tập"
    desc: "Master React, Node.js, databases"
  - year: "Năm 3"
    title: "Đột Phá"
    desc: "Khám phá Three.js, creative coding"
  - year: "Hiện tại"
    title: "Tu Luyện"
    desc: "Building amazing web experiences"
```

### 7.2 Skills Section

```yaml
categories:
  - name: "⚔️ Kiếm Pháp (Frontend)"
    skills:
      - name: "React / Next.js"
        level: 95
        rank: "Đại Thành"
      - name: "TypeScript"
        level: 85
        rank: "Tiểu Thành"
      - name: "Three.js / R3F"
        level: 70
        rank: "Nhập Môn"
      - name: "Tailwind CSS"
        level: 95
        rank: "Đại Thành"
      - name: "Vue.js"
        level: 60
        rank: "Luyện Tập"

  - name: "🔮 Đan Pháp (Backend)"
    skills:
      - name: "Node.js"
        level: 80
        rank: "Tiểu Thành"
      - name: "Python"
        level: 65
        rank: "Nhập Môn"
      - name: "PostgreSQL"
        level: 70
        rank: "Nhập Môn"
      - name: "MongoDB"
        level: 80
        rank: "Tiểu Thành"
      - name: "REST API"
        level: 90
        rank: "Đại Thành"

  - name: "📿 Trận Pháp (DevOps & Tools)"
    skills:
      - name: "Git / GitHub"
        level: 95
        rank: "Đại Thành"
      - name: "Docker"
        level: 55
        rank: "Luyện Tập"
      - name: "AWS / Vercel"
        level: 70
        rank: "Nhập Môn"
      - name: "Figma"
        level: 80
        rank: "Tiểu Thành"
      - name: "Blender"
        level: 40
        rank: "Sơ Học"

  - name: "🌟 Thần Thông (Soft Skills)"
    skills:
      - name: "Problem Solving"
        level: 90
      - name: "Team Collaboration"
        level: 85
      - name: "Communication"
        level: 80
      - name: "Fast Learning"
        level: 95
```

### 7.3 Projects Section

```yaml
projects:
  - id: 1
    name: "E-Commerce 3D Store"
    category: "Web Application"
    description: |
      Full-stack e-commerce platform với 3D product viewer.
      Khách hàng có thể xem sản phẩm 360°, zoom chi tiết,
      và customize màu sắc trước khi mua.
    tech:
      - React
      - Three.js
      - Node.js
      - MongoDB
      - Stripe
    features:
      - 3D Product Viewer
      - Real-time customization
      - Shopping cart
      - Payment integration
    links:
      demo: "https://demo.example.com"
      github: "https://github.com/example"
    image: "/projects/ecommerce-3d.jpg"
    color: "#FF6B35"

  - id: 2
    name: "Real-time Dashboard"
    category: "Web Application"
    description: |
      Analytics dashboard với real-time data visualization.
      Hiển thị metrics, charts, và alerts cho business intelligence.
    tech:
      - React
      - D3.js
      - WebSocket
      - PostgreSQL
      - Redis
    features:
      - Live data streaming
      - Interactive charts
      - Custom alerts
      - Export reports
    links:
      demo: "https://demo.example.com"
      github: "https://github.com/example"
    image: "/projects/dashboard.jpg"
    color: "#FF4444"

  - id: 3
    name: "AI Chat Application"
    category: "Full-stack"
    description: |
      Chatbot application tích hợp AI cho customer support.
      Sử dụng OpenAI API với custom training data.
    tech:
      - Next.js
      - OpenAI API
      - Node.js
      - MongoDB
      - Socket.io
    features:
      - AI-powered responses
      - Conversation history
      - Multi-language support
      - Admin dashboard
    links:
      demo: "https://demo.example.com"
      github: "https://github.com/example"
    image: "/projects/ai-chat.jpg"
    color: "#FF8C00"

  - id: 4
    name: "Mobile Fitness App"
    category: "Mobile"
    description: |
      Workout tracker app với personalized training plans.
      Track progress, set goals, và connect với community.
    tech:
      - React Native
      - Firebase
      - Node.js
      - TensorFlow Lite
    features:
      - Workout tracking
      - Progress analytics
      - Social features
      - AI form checker
    links:
      demo: "https://demo.example.com"
      github: "https://github.com/example"
    image: "/projects/fitness-app.jpg"
    color: "#FFD700"

  - id: 5
    name: "Interactive Data Globe"
    category: "Data Visualization"
    description: |
      3D globe visualization hiển thị global data.
      Interactive exploration với real-time data updates.
    tech:
      - Three.js
      - D3.js
      - React
      - REST APIs
    features:
      - 3D Earth rendering
      - Data point animations
      - Country interactions
      - Time-lapse mode
    links:
      demo: "https://demo.example.com"
      github: "https://github.com/example"
    image: "/projects/data-globe.jpg"
    color: "#FF4500"

  - id: 6
    name: "This Portfolio"
    category: "Creative Development"
    description: |
      Portfolio website bạn đang xem! Một thế giới 3D tiên hiệp
      interactive với đạp mây, ngự kiếm, và cưỡi linh thú.
    tech:
      - React Three Fiber
      - Three.js
      - GSAP
      - Rapier Physics
      - TypeScript
    features:
      - 3D World exploration
      - Multiple transport modes
      - Physics-based movement
      - Responsive design
    links:
      demo: "https://vuonglam.dev"
      github: "https://github.com/example"
    image: "/projects/portfolio.jpg"
    color: "#FF4444"
```

### 7.4 Experience Section

```yaml
experience:
  - period: "2024 - Present"
    role: "Senior Frontend Developer"
    company: "Tech Company"
    description: "Lead frontend development cho multiple projects"
    achievements:
      - "Improved performance by 40%"
      - "Mentored junior developers"
      - "Implemented 3D features"

  - period: "2022 - 2024"
    role: "Frontend Developer"
    company: "Creative Agency"
    description: "Developed interactive websites và web applications"
    achievements:
      - "10+ successful projects"
      - "Award-winning websites"
      - "Client satisfaction 98%"

  - period: "2021 - 2022"
    role: "Junior Developer"
    company: "Startup"
    description: "Full-stack development cho startup products"
    achievements:
      - "Built MVP in 3 months"
      - "Grew to 10k users"
      - "Learned agile workflow"

certifications:
  - name: "AWS Certified Developer"
    year: 2023
  - name: "Meta Frontend Professional"
    year: 2022
```

### 7.5 Contact Section

```yaml
contact:
  email: "vuonglam@example.com"
  location: "Vietnam"
  availability: "Open for opportunities"

social:
  - platform: "GitHub"
    url: "https://github.com/vuonglam"
    icon: "github"
  - platform: "LinkedIn"
    url: "https://linkedin.com/in/vuonglam"
    icon: "linkedin"
  - platform: "Twitter"
    url: "https://twitter.com/vuonglam"
    icon: "twitter"

form_fields:
  - name: "name"
    label: "Tên của bạn"
    type: "text"
    required: true
  - name: "email"
    label: "Email"
    type: "email"
    required: true
  - name: "subject"
    label: "Chủ đề"
    type: "select"
    options:
      - "Hợp tác dự án"
      - "Cơ hội việc làm"
      - "Tư vấn"
      - "Khác"
  - name: "message"
    label: "Tin nhắn"
    type: "textarea"
    required: true
```

---

## 8. Project Structure

```
vuong-lam-portfolio/
├── 📁 public/
│   ├── 📁 models/           # 3D models (.glb, .gltf)
│   │   ├── sword.glb
│   │   ├── phoenix.glb
│   │   ├── pagoda.glb
│   │   ├── mountain.glb
│   │   └── ...
│   ├── 📁 textures/         # Textures và images
│   │   ├── sky/
│   │   ├── terrain/
│   │   └── effects/
│   ├── 📁 sounds/           # Audio files
│   │   ├── ambient/
│   │   ├── sfx/
│   │   └── music/
│   ├── 📁 fonts/            # Custom fonts
│   └── 📁 images/           # Static images
│       └── projects/
│
├── 📁 src/
│   ├── 📁 components/       # React components
│   │   ├── 📁 3d/           # 3D components
│   │   │   ├── World.tsx
│   │   │   ├── Player.tsx
│   │   │   ├── Sword.tsx
│   │   │   ├── Phoenix.tsx
│   │   │   ├── Cloud.tsx
│   │   │   ├── Mountain.tsx
│   │   │   ├── Pagoda.tsx
│   │   │   └── ...
│   │   ├── 📁 sections/     # Section components
│   │   │   ├── IntroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── SkillsSection.tsx
│   │   │   ├── ProjectsSection.tsx
│   │   │   ├── ExperienceSection.tsx
│   │   │   └── ContactSection.tsx
│   │   ├── 📁 ui/           # UI components
│   │   │   ├── HUD.tsx
│   │   │   ├── Minimap.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── MobileControls.tsx
│   │   │   └── ...
│   │   ├── 📁 effects/      # Visual effects
│   │   │   ├── Particles.tsx
│   │   │   ├── PostProcessing.tsx
│   │   │   └── Transitions.tsx
│   │   └── 📁 common/       # Shared components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── ...
│   │
│   ├── 📁 hooks/            # Custom hooks
│   │   ├── usePlayer.ts
│   │   ├── useControls.ts
│   │   ├── useAudio.ts
│   │   ├── useProgress.ts
│   │   └── ...
│   │
│   ├── 📁 stores/           # Zustand stores
│   │   ├── gameStore.ts
│   │   ├── uiStore.ts
│   │   └── audioStore.ts
│   │
│   ├── 📁 utils/            # Utility functions
│   │   ├── helpers.ts
│   │   ├── constants.ts
│   │   └── animations.ts
│   │
│   ├── 📁 data/             # Static data
│   │   ├── projects.ts
│   │   ├── skills.ts
│   │   └── content.ts
│   │
│   ├── 📁 styles/           # Global styles
│   │   ├── globals.css
│   │   └── animations.css
│   │
│   ├── 📁 types/            # TypeScript types
│   │   └── index.ts
│   │
│   ├── App.tsx              # Main app
│   ├── main.tsx             # Entry point
│   └── vite-env.d.ts
│
├── 📄 index.html
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 vite.config.ts
├── 📄 tailwind.config.js
├── 📄 postcss.config.js
├── 📄 .eslintrc.cjs
├── 📄 .prettierrc
├── 📄 .gitignore
├── 📄 README.md
└── 📄 PLANNING.md           # This file
```

---

## 9. Development Phases

### Phase 1: Setup & Foundation (Tuần 1-2)

```
Week 1:
├── [ ] Project initialization (Vite + React + TypeScript)
├── [ ] Install dependencies
├── [ ] Setup Tailwind CSS
├── [ ] Setup R3F basic scene
├── [ ] Camera controls (OrbitControls for dev)
├── [ ] Basic lighting setup
├── [ ] Debug tools (Leva, R3F-Perf)
└── [ ] Git repository setup

Week 2:
├── [ ] Player/Character controller base
├── [ ] Basic physics setup (Rapier)
├── [ ] Cloud platform prototype
├── [ ] Jump mechanics (đạp mây)
├── [ ] Simple test environment
├── [ ] State management (Zustand)
└── [ ] Mobile detection & responsive base
```

### Phase 2: World Building (Tuần 3-4)

```
Week 3:
├── [ ] Floating mountain models/geometry
├── [ ] Cloud sea (shader/particles)
├── [ ] Sky dome với stars
├── [ ] Moon placement
├── [ ] Basic section zones
├── [ ] Section triggers
└── [ ] Camera boundaries

Week 4:
├── [ ] Architecture models (pagoda, gates)
├── [ ] Nature elements (trees, bamboo)
├── [ ] Lanterns với glow
├── [ ] Waterfalls (shader)
├── [ ] Environment particles (petals, embers)
├── [ ] Day/night không cần (always night cho vibe)
└── [ ] World optimization (LOD, culling)
```

### Phase 3: Movement Systems (Tuần 5)

```
Week 5:
├── [ ] Hoàn thiện đạp mây mechanics
├── [ ] Ngự kiếm system
│   ├── [ ] Sword model
│   ├── [ ] Flight controls
│   ├── [ ] Trail effect
│   └── [ ] Unlock trigger
├── [ ] Cưỡi linh thú system
│   ├── [ ] Phoenix model
│   ├── [ ] Mount/dismount
│   ├── [ ] Flight controls
│   └── [ ] Fire trail
├── [ ] Transition animations giữa modes
└── [ ] Mobile controls (joystick, buttons)
```

### Phase 4: Sections & Content (Tuần 6)

```
Week 6:
├── [ ] Intro section
│   ├── [ ] Portal gate
│   ├── [ ] Title animation
│   └── [ ] Enter interaction
├── [ ] About section
│   ├── [ ] Pagoda building
│   ├── [ ] Bio display
│   └── [ ] Journey timeline
├── [ ] Skills section
│   ├── [ ] Skill tablets/stones
│   ├── [ ] Category organization
│   └── [ ] Hover effects
├── [ ] Projects section
│   ├── [ ] Project islands x6
│   ├── [ ] Project modals
│   └── [ ] Preview images
├── [ ] Experience section
│   ├── [ ] Mountain peak
│   └── [ ] Timeline display
└── [ ] Contact section
    ├── [ ] Cloud palace
    ├── [ ] Contact form
    └── [ ] Social links
```

### Phase 5: UI & Polish (Tuần 7)

```
Week 7:
├── [ ] HUD design
│   ├── [ ] Minimap
│   ├── [ ] Cultivation level indicator
│   └── [ ] Navigation hints
├── [ ] Menus
│   ├── [ ] Main menu
│   ├── [ ] Settings
│   └── [ ] Help/tutorial
├── [ ] Modals styling
├── [ ] Tooltips
├── [ ] Loading screen
├── [ ] Transitions between sections
├── [ ] Sound integration
│   ├── [ ] Ambient music
│   ├── [ ] SFX
│   └── [ ] Volume controls
└── [ ] Accessibility basics
```

### Phase 6: Optimization & Deploy (Tuần 8)

```
Week 8:
├── [ ] Performance optimization
│   ├── [ ] Model optimization
│   ├── [ ] Texture compression
│   ├── [ ] Code splitting
│   └── [ ] Lazy loading
├── [ ] Mobile optimization
│   ├── [ ] Touch controls polish
│   ├── [ ] Performance mode
│   └── [ ] Responsive UI
├── [ ] Cross-browser testing
├── [ ] Bug fixes
├── [ ] SEO setup
├── [ ] Analytics integration
├── [ ] Domain setup
├── [ ] Vercel deployment
├── [ ] Final testing
└── [ ] Launch! 🚀
```

---

## 10. Asset Requirements

### 10.1 3D Models Needed

| Model | Format | Poly Count | Priority |
|-------|--------|------------|----------|
| Flying Sword (Jian) | GLB | Low (<5k) | High |
| Fire Phoenix | GLB | Medium (<15k) | High |
| Floating Mountain x3 | GLB | Low (<10k each) | High |
| Pagoda | GLB | Medium (<20k) | High |
| Torii Gate | GLB | Low (<3k) | Medium |
| Cherry Blossom Tree | GLB | Low (<5k) | Medium |
| Bamboo Grove | GLB | Low (<5k) | Medium |
| Stone Lantern | GLB | Low (<2k) | Low |
| Cloud Platform | Procedural | - | High |

### 10.2 Textures

| Texture | Resolution | Type |
|---------|------------|------|
| Sky/Stars HDRI | 4K | HDR |
| Moon | 1K | PNG |
| Mountain diffuse | 2K | JPG |
| Mountain normal | 2K | PNG |
| Wood/Architecture | 1K | JPG |
| Fire/Energy | 512 | PNG sequence |

### 10.3 Audio

| Sound | Type | Duration |
|-------|------|----------|
| Ambient - Wind | Loop | 60s |
| Ambient - Night | Loop | 120s |
| Music - Main theme | Loop | 180s |
| SFX - Jump | One-shot | <1s |
| SFX - Sword whoosh | One-shot | <1s |
| SFX - Phoenix cry | One-shot | 2s |
| SFX - UI click | One-shot | <0.5s |

### 10.4 Fonts

| Font | Usage | Source |
|------|-------|--------|
| Cinzel Decorative | Headings | Google Fonts |
| Ma Shan Zheng | Chinese text | Google Fonts |
| Nunito | Body text | Google Fonts |
| JetBrains Mono | Code | Google Fonts |

---

## 11. Performance Targets

### 11.1 Frame Rate

| Device | Target FPS | Minimum FPS |
|--------|------------|-------------|
| Desktop (High) | 60 | 45 |
| Desktop (Low) | 45 | 30 |
| Mobile (High-end) | 45 | 30 |
| Mobile (Mid-range) | 30 | 24 |

### 11.2 Loading Time

| Metric | Target |
|--------|--------|
| First Contentful Paint | <2s |
| Initial 3D Load | <5s |
| Full Load | <10s |
| Time to Interactive | <3s |

### 11.3 Bundle Size

| Asset | Target Size |
|-------|-------------|
| JavaScript (gzipped) | <500KB |
| 3D Models (total) | <5MB |
| Textures (total) | <3MB |
| Audio (total) | <2MB |

### 11.4 Optimization Strategies

```typescript
const optimizations = {
  models: {
    draco: true,           // DRACO compression
    lod: true,             // Level of detail
    instancing: true,      // For repeated objects
  },
  textures: {
    ktx2: true,            // KTX2 compression
    mipmaps: true,         // Mipmapping
    maxSize: 2048,         // Max texture size
  },
  rendering: {
    frustumCulling: true,  // Don't render off-screen
    occlusionCulling: true,// Don't render hidden
    shadowMapSize: 1024,   // Reasonable shadow quality
  },
  code: {
    treeshaking: true,     // Remove unused code
    codeSplitting: true,   // Split by route/section
    lazyLoading: true,     // Load on demand
  }
};
```

---

## 12. Deployment

### 12.1 Hosting: Vercel (Recommended)

```yaml
Platform: Vercel
Reason:
  - Free tier đủ dùng
  - Automatic deployments từ GitHub
  - Edge network (fast globally)
  - Easy custom domain
  - Built-in analytics
```

### 12.2 Domain Options

```
Primary:    vuonglam.dev
Alternative: vuonglam.io
            vuonglamvn.com
```

### 12.3 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      # Vercel auto-deploys from GitHub
```

### 12.4 Environment Variables

```env
# .env.local
VITE_CONTACT_FORM_URL=https://api.example.com/contact
VITE_ANALYTICS_ID=UA-XXXXXXXX
VITE_ENABLE_DEBUG=false
```

---

## 13. Progress Tracking

### 13.1 Milestones

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Project Setup | Week 1 | ⬜ Not Started |
| Basic Movement | Week 2 | ⬜ Not Started |
| World Draft | Week 4 | ⬜ Not Started |
| All Transports | Week 5 | ⬜ Not Started |
| Content Complete | Week 6 | ⬜ Not Started |
| UI Complete | Week 7 | ⬜ Not Started |
| Launch Ready | Week 8 | ⬜ Not Started |

### 13.2 Task Status Legend

```
⬜ Not Started
🟡 In Progress
🟢 Completed
🔴 Blocked
⏸️ On Hold
```

### 13.3 Weekly Check-in Template

```markdown
## Week X Progress

### Completed
- [ ] Task 1
- [ ] Task 2

### In Progress
- [ ] Task 3 (XX% done)

### Blocked
- Issue description

### Next Week Goals
- Goal 1
- Goal 2

### Notes
- Any observations
```

---

## 📝 Notes & Ideas

### Backlog Ideas (Nice to have)
- [ ] Easter eggs (hidden cultivation manuals)
- [ ] Achievement system
- [ ] Multiple character skins
- [ ] Day/night toggle
- [ ] Weather effects (rain, thunder)
- [ ] Photo mode
- [ ] Speedrun timer
- [ ] Multi-language support

### Technical Debt to Watch
- Performance on low-end mobile
- Accessibility for screen readers
- SEO for SPA

### Resources & References
- Bruno Simon Portfolio: https://bruno-simon.com/
- Three.js Journey: https://threejs-journey.com/
- R3F Documentation: https://docs.pmnd.rs/react-three-fiber
- Drei Helpers: https://github.com/pmndrs/drei
- Rapier Physics: https://rapier.rs/

---

> **Last Updated:** 2026-01-21
> **Version:** 1.0.0
> **Author:** Vương Lâm VN
