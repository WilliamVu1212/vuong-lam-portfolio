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

// -------------------- Skills --------------------

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

export const projects: Project[] = [
  {
    id: 1,
    name: 'E-Commerce 3D Store',
    category: 'Web Application',
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
    color: '#FF6B35',
  },
  {
    id: 2,
    name: 'Real-time Dashboard',
    category: 'Web Application',
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
    color: '#FF4444',
  },
  {
    id: 3,
    name: 'AI Chat Application',
    category: 'Full-stack',
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
  {
    id: 4,
    name: 'Mobile Fitness App',
    category: 'Mobile',
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
  {
    id: 5,
    name: 'Interactive Data Globe',
    category: 'Data Visualization',
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
    color: '#FF4500',
  },
  {
    id: 6,
    name: 'This Portfolio',
    category: 'Creative Development',
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
    color: '#FF4444',
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
    name: 'Golden Core',
    chineseName: 'Kim Đan',
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
    name: 'Mahayana',
    chineseName: 'Đại Thừa',
    position: [0, 200, -550],
    radius: 60,
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
  kim_dan: {
    name: 'Kim Đan',
    english: 'Golden Core',
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
  dai_thua: {
    name: 'Đại Thừa',
    english: 'Mahayana',
    section: 'contact',
    color: '#FF4500',
  },
};
