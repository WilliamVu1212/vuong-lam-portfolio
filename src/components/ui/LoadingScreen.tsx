import { motion } from 'framer-motion';

function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(180deg, #1A0A0A 0%, #2D1B1B 100%)',
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title */}
      <motion.h1
        className="text-4xl md:text-6xl font-bold mb-2"
        style={{
          fontFamily: "'Cinzel', 'Times New Roman', serif",
          background: 'linear-gradient(180deg, #FF8C00 0%, #FF4444 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        VƯƠNG LÂM
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-xl md:text-2xl text-tho-kim mb-8 italic"
        style={{ fontFamily: "'Cinzel', 'Georgia', serif" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Con Đường Tu Tiên · The Path of Cultivation
      </motion.p>

      {/* Loading Spinner */}
      <motion.div
        className="relative w-16 h-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-tham-hong"
          style={{ borderTopColor: '#FF4444' }}
        >
          <motion.div
            className="w-full h-full rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{
              border: '2px solid transparent',
              borderTopColor: '#FF4444',
            }}
          />
        </div>

        {/* Inner glow */}
        <div
          className="absolute inset-2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 68, 68, 0.3) 0%, transparent 70%)',
          }}
        />
      </motion.div>

      {/* Loading text */}
      <motion.p
        className="mt-6 text-am-tho text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Đang nạp linh khí... Loading spiritual energy...
      </motion.p>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 2 === 0 ? '#FF4444' : '#FF8C00',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default LoadingScreen;
