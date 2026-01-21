// ==========================================
// VƯƠNG LÂM PORTFOLIO - Content Data
// ==========================================

import type {
  Project,
  SkillCategory,
  Experience,
  Certification,
  ContactInfo,
  SectionZone,
} from '../types';

// -------------------- Profile --------------------

export const profile = {
  name: 'Vương Lâm',
  title: 'Creative Developer',
  tagline: 'Tu luyện code, ngộ đạo digital',
  bio: `Một developer đam mê tạo ra những trải nghiệm web độc đáo và sáng tạo.
Chuyên về Frontend Development với focus vào interactive experiences,
3D web, và creative coding.`,
  highlights: [
    '🔥 Passionate về Creative Development',
    '⚔️ Chuyên React & Three.js ecosystem',
    '🎨 Kết hợp Art + Technology',
    '🚀 Luôn học hỏi công nghệ mới',
  ],
  journey: [
    {
      year: 'Năm 1',
      title: 'Nhập Môn',
      desc: 'Bắt đầu học HTML, CSS, JavaScript',
    },
    {
      year: 'Năm 2',
      title: 'Luyện Tập',
      desc: 'Master React, Node.js, databases',
    },
    {
      year: 'Năm 3',
      title: 'Đột Phá',
      desc: 'Khám phá Three.js, creative coding',
    },
    {
      year: 'Hiện tại',
      title: 'Tu Luyện',
      desc: 'Building amazing web experiences',
    },
  ],
};

// -------------------- Võ Công theo Cảnh Giới (Tiên Nghịch) --------------------
// Hệ thống võ công của Vương Lâm theo từng tầng tu luyện

export const cultivationTechniques = {
  // Phàm Nhân - Chưa tu luyện, chỉ có căn cơ
  pham_nhan: {
    name: 'Phàm Nhân',
    techniques: [
      { name: 'Căn Cơ Phàm Trần', desc: 'Nền tảng ban đầu' },
    ],
    color: '#8B7355',
  },
  // Luyện Khí - Tam Giai Ngưng Khí (Ba thuật cơ bản)
  luyen_khi: {
    name: 'Luyện Khí',
    techniques: [
      { name: 'Hấp Dẫn Thuật', desc: 'Hút vật từ xa' },
      { name: 'Hỏa Cầu Thuật', desc: 'Phóng cầu lửa' },
      { name: 'Liệt Địa Thuật', desc: 'Chẻ đất nứt nẻ' },
    ],
    color: '#C4A77D',
  },
  // Trúc Cơ - Bắt đầu tu luyện chính thức
  truc_co: {
    name: 'Trúc Cơ',
    techniques: [
      { name: 'Thổ Độn Thuật', desc: 'Ẩn mình trong đất' },
      { name: 'Triệu Hồn Thuật', desc: 'Triệu hồi linh hồn' },
      { name: 'Huyết Luyện Thuật', desc: 'Luyện huyết cường hóa' },
    ],
    color: '#FF8C00',
  },
  // Kết Đan - Hoàng Tuyền Thăng Thiên Công
  ket_dan: {
    name: 'Kết Đan',
    techniques: [
      { name: 'Hoàng Tuyền Chỉ', desc: 'Chỉ pháp Hoàng Tuyền' },
      { name: 'Tịch Diệt Chỉ', desc: 'Chỉ pháp tịch diệt' },
      { name: 'Hóa Ma Chỉ', desc: 'Chỉ pháp hóa ma' },
    ],
    color: '#FFD700',
  },
  // Nguyên Anh - Thần thông cấp cao
  nguyen_anh: {
    name: 'Nguyên Anh',
    techniques: [
      { name: 'Thần Đạo', desc: 'Đại thần thông thần đạo' },
      { name: 'Đoạt Cơ Đại Pháp', desc: 'Đoạt căn cơ người khác' },
      { name: 'Định Thân Thuật', desc: 'Định thân bất động' },
    ],
    color: '#FF4444',
  },
  // Hóa Thần - Đại thần thông, ngộ Đạo
  hoa_than: {
    name: 'Hóa Thần',
    techniques: [
      { name: 'Tê Thiên', desc: 'Xé rách bầu trời' },
      { name: 'Cổ Thần Khôi Lỗi', desc: 'Búp bê Cổ Thần' },
      { name: 'Thiên Băng Địa Liệt', desc: 'Trời băng đất nứt' },
    ],
    color: '#FF4500',
  },
  // Anh Biến - Nguyên Anh biến hóa
  anh_bien: {
    name: 'Anh Biến',
    techniques: [
      { name: 'Hồn Phiên Tam Pháp', desc: 'Ba pháp lật hồn' },
      { name: 'Mộng Về Viễn Cổ', desc: 'Mơ về thời cổ đại' },
      { name: 'Âm Nguyệt Đại Pháp', desc: 'Đại pháp trăng âm' },
    ],
    color: '#9400D3',
  },
  // Vấn Đỉnh - Lĩnh ngộ Quy Tắc
  van_dinh: {
    name: 'Vấn Đỉnh',
    techniques: [
      { name: 'Sinh Tử Quy Tắc', desc: 'Quy tắc sinh tử' },
      { name: 'Nhân Quả Quy Tắc', desc: 'Quy tắc nhân quả' },
      { name: 'Bản Nguyên Lĩnh Ngộ', desc: 'Lĩnh ngộ bản nguyên' },
    ],
    color: '#00CED1',
  },
};

// -------------------- Skills (mapping với võ công) --------------------

export const skillCategories: SkillCategory[] = [
  {
    name: '⚔️ Kiếm Pháp (Frontend)',
    icon: 'sword',
    skills: [
      { name: 'React / Next.js', level: 95, rank: 'Đại Thành' },
      { name: 'TypeScript', level: 85, rank: 'Tiểu Thành' },
      { name: 'Three.js / R3F', level: 70, rank: 'Nhập Môn' },
      { name: 'Tailwind CSS', level: 95, rank: 'Đại Thành' },
      { name: 'Vue.js', level: 60, rank: 'Luyện Tập' },
    ],
  },
  {
    name: '🔮 Đan Pháp (Backend)',
    icon: 'cauldron',
    skills: [
      { name: 'Node.js', level: 80, rank: 'Tiểu Thành' },
      { name: 'Python', level: 65, rank: 'Nhập Môn' },
      { name: 'PostgreSQL', level: 70, rank: 'Nhập Môn' },
      { name: 'MongoDB', level: 80, rank: 'Tiểu Thành' },
      { name: 'REST API', level: 90, rank: 'Đại Thành' },
    ],
  },
  {
    name: '📿 Trận Pháp (DevOps & Tools)',
    icon: 'formation',
    skills: [
      { name: 'Git / GitHub', level: 95, rank: 'Đại Thành' },
      { name: 'Docker', level: 55, rank: 'Luyện Tập' },
      { name: 'AWS / Vercel', level: 70, rank: 'Nhập Môn' },
      { name: 'Figma', level: 80, rank: 'Tiểu Thành' },
      { name: 'Blender', level: 40, rank: 'Sơ Học' },
    ],
  },
  {
    name: '🌟 Thần Thông (Soft Skills)',
    icon: 'spirit',
    skills: [
      { name: 'Problem Solving', level: 90, rank: 'Đại Thành' },
      { name: 'Team Collaboration', level: 85, rank: 'Tiểu Thành' },
      { name: 'Communication', level: 80, rank: 'Tiểu Thành' },
      { name: 'Fast Learning', level: 95, rank: 'Đại Thành' },
    ],
  },
];

// -------------------- Projects --------------------
// Võ công theo phong cách Tiên Nghịch - Vương Lâm

export const projects: Project[] = [
  // ===== Luyện Khí - Võ công sơ cấp =====
  {
    id: 1,
    name: 'Hấp Dẫn Thuật',
    category: 'Luyện Khí',
    description: `Full-stack e-commerce platform với 3D product viewer.
Khách hàng có thể xem sản phẩm 360°, zoom chi tiết,
và customize màu sắc trước khi mua.`,
    tech: ['React', 'Three.js', 'Node.js', 'MongoDB', 'Stripe'],
    features: [
      '3D Product Viewer',
      'Real-time customization',
      'Shopping cart',
      'Payment integration',
    ],
    links: {
      demo: 'https://demo.example.com',
      github: 'https://github.com/example',
    },
    image: '/images/projects/ecommerce-3d.jpg',
    color: '#8B7355',
  },
  {
    id: 2,
    name: 'Ngưng Khí Quyết',
    category: 'Luyện Khí',
    description: `Analytics dashboard với real-time data visualization.
Hiển thị metrics, charts, và alerts cho business intelligence.`,
    tech: ['React', 'D3.js', 'WebSocket', 'PostgreSQL', 'Redis'],
    features: [
      'Live data streaming',
      'Interactive charts',
      'Custom alerts',
      'Export reports',
    ],
    links: {
      demo: 'https://demo.example.com',
      github: 'https://github.com/example',
    },
    image: '/images/projects/dashboard.jpg',
    color: '#C4A77D',
  },
  // ===== Trúc Cơ - Võ công nền tảng =====
  {
    id: 3,
    name: 'Trục Địa Ấn',
    category: 'Trúc Cơ',
    description: `Chatbot application tích hợp AI cho customer support.
Sử dụng OpenAI API với custom training data.`,
    tech: ['Next.js', 'OpenAI API', 'Node.js', 'MongoDB', 'Socket.io'],
    features: [
      'AI-powered responses',
      'Conversation history',
      'Multi-language support',
      'Admin dashboard',
    ],
    links: {
      demo: 'https://demo.example.com',
      github: 'https://github.com/example',
    },
    image: '/images/projects/ai-chat.jpg',
    color: '#FF8C00',
  },
  // ===== Kim Đan - Võ công thành tựu =====
  {
    id: 4,
    name: 'Tế Thần Thuật',
    category: 'Kim Đan',
    description: `Workout tracker app với personalized training plans.
Track progress, set goals, và connect với community.`,
    tech: ['React Native', 'Firebase', 'Node.js', 'TensorFlow Lite'],
    features: [
      'Workout tracking',
      'Progress analytics',
      'Social features',
      'AI form checker',
    ],
    links: {
      demo: 'https://demo.example.com',
      github: 'https://github.com/example',
    },
    image: '/images/projects/fitness-app.jpg',
    color: '#FFD700',
  },
  // ===== Nguyên Anh - Võ công cao cấp =====
  {
    id: 5,
    name: 'Nguyên Anh Tự Bạo',
    category: 'Nguyên Anh',
    description: `3D globe visualization hiển thị global data.
Interactive exploration với real-time data updates.`,
    tech: ['Three.js', 'D3.js', 'React', 'REST APIs'],
    features: [
      '3D Earth rendering',
      'Data point animations',
      'Country interactions',
      'Time-lapse mode',
    ],
    links: {
      demo: 'https://demo.example.com',
      github: 'https://github.com/example',
    },
    image: '/images/projects/data-globe.jpg',
    color: '#FF4444',
  },
  // ===== Hóa Thần - Võ công tối thượng =====
  {
    id: 6,
    name: 'Sinh Tử Luân Hồi',
    category: 'Hóa Thần',
    description: `Portfolio website bạn đang xem! Một thế giới 3D tiên hiệp
interactive với đạp mây, ngự kiếm, và cưỡi linh thú.`,
    tech: ['React Three Fiber', 'Three.js', 'GSAP', 'Rapier Physics', 'TypeScript'],
    features: [
      '3D World exploration',
      'Multiple transport modes',
      'Physics-based movement',
      'Responsive design',
    ],
    links: {
      demo: 'https://vuonglam.dev',
      github: 'https://github.com/example',
    },
    image: '/images/projects/portfolio.jpg',
    color: '#FF4500',
  },
];

// -------------------- Experience --------------------

export const experiences: Experience[] = [
  {
    period: '2024 - Present',
    role: 'Senior Frontend Developer',
    company: 'Tech Company',
    description: 'Lead frontend development cho multiple projects',
    achievements: [
      'Improved performance by 40%',
      'Mentored junior developers',
      'Implemented 3D features',
    ],
  },
  {
    period: '2022 - 2024',
    role: 'Frontend Developer',
    company: 'Creative Agency',
    description: 'Developed interactive websites và web applications',
    achievements: [
      '10+ successful projects',
      'Award-winning websites',
      'Client satisfaction 98%',
    ],
  },
  {
    period: '2021 - 2022',
    role: 'Junior Developer',
    company: 'Startup',
    description: 'Full-stack development cho startup products',
    achievements: [
      'Built MVP in 3 months',
      'Grew to 10k users',
      'Learned agile workflow',
    ],
  },
];

export const certifications: Certification[] = [
  { name: 'AWS Certified Developer', year: 2023 },
  { name: 'Meta Frontend Professional', year: 2022 },
];

// -------------------- Contact --------------------

export const contactInfo: ContactInfo = {
  email: 'vuonglam@example.com',
  location: 'Vietnam',
  availability: 'Open for opportunities',
  social: [
    {
      platform: 'GitHub',
      url: 'https://github.com/vuonglam',
      icon: 'github',
    },
    {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/vuonglam',
      icon: 'linkedin',
    },
    {
      platform: 'Twitter',
      url: 'https://twitter.com/vuonglam',
      icon: 'twitter',
    },
  ],
};

// -------------------- World Sections --------------------

export const sectionZones: SectionZone[] = [
  {
    id: 'intro',
    name: 'Mortal Realm',
    chineseName: 'Phàm Nhân',
    position: [0, 0, 0],
    radius: 50,
  },
  {
    id: 'about',
    name: 'Qi Refining',
    chineseName: 'Luyện Khí',
    position: [0, 30, -100],
    radius: 80,
  },
  {
    id: 'skills',
    name: 'Foundation Building',
    chineseName: 'Trúc Cơ',
    position: [0, 60, -200],
    radius: 100,
  },
  {
    id: 'projects',
    name: 'Core Formation',
    chineseName: 'Kết Đan',
    position: [0, 100, -300],
    radius: 150,
  },
  {
    id: 'experience',
    name: 'Spirit Severing',
    chineseName: 'Hóa Thần',
    position: [0, 150, -450],
    radius: 100,
  },
  {
    id: 'contact',
    name: 'Infant Transformation',
    chineseName: 'Anh Biến',
    position: [0, 200, -550],
    radius: 60,
  },
  {
    id: 'vandinh',
    name: 'Questioning the Peak',
    chineseName: 'Vấn Đỉnh',
    position: [0, 260, -650],
    radius: 80,
  },
];

// -------------------- Cultivation Levels --------------------

export const cultivationLevels = {
  pham_nhan: {
    name: 'Phàm Nhân',
    english: 'Mortal',
    section: 'intro',
    color: '#8B7355',
  },
  luyen_khi: {
    name: 'Luyện Khí',
    english: 'Qi Refining',
    section: 'about',
    color: '#C4A77D',
  },
  truc_co: {
    name: 'Trúc Cơ',
    english: 'Foundation Building',
    section: 'skills',
    color: '#FF8C00',
  },
  ket_dan: {
    name: 'Kết Đan',
    english: 'Core Formation',
    section: 'projects',
    color: '#FFD700',
  },
  nguyen_anh: {
    name: 'Nguyên Anh',
    english: 'Nascent Soul',
    section: 'projects',
    color: '#FF6B35',
  },
  hoa_than: {
    name: 'Hóa Thần',
    english: 'Spirit Severing',
    section: 'experience',
    color: '#FF4444',
  },
  anh_bien: {
    name: 'Anh Biến',
    english: 'Infant Transformation',
    section: 'contact',
    color: '#9400D3',
  },
  van_dinh: {
    name: 'Vấn Đỉnh',
    english: 'Questioning the Peak',
    section: 'vandinh',
    color: '#00CED1',
  },
};
