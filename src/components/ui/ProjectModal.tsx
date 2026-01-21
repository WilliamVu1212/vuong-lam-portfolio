import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github } from 'lucide-react';
import { useUIStore } from '@/stores/gameStore';
import type { Project } from '@/types';

export function ProjectModal() {
  const isModalOpen = useUIStore((state) => state.isModalOpen);
  const modalType = useUIStore((state) => state.modalType);
  const modalData = useUIStore((state) => state.modalData);
  const closeModal = useUIStore((state) => state.closeModal);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal]);

  if (modalType !== 'project' || !modalData) return null;

  const project = modalData as Project;

  return (
    <AnimatePresence>
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-huyet-da/80 backdrop-blur-sm z-40"
            onClick={closeModal}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full z-50"
          >
            <div className="glass rounded-2xl overflow-hidden h-full md:h-auto max-h-[90vh] flex flex-col">
              {/* Header with gradient */}
              <div
                className="relative p-6 pb-8"
                style={{
                  background: `linear-gradient(135deg, ${project.color}33 0%, transparent 100%)`,
                }}
              >
                {/* Close button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 p-2 rounded-full bg-huyet-da/50 hover:bg-huyet-da transition-colors"
                >
                  <X className="w-5 h-5 text-co-chi" />
                </button>

                {/* Category badge */}
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                  style={{ backgroundColor: `${project.color}33`, color: project.color }}
                >
                  {project.category}
                </span>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-co-chi">
                  {project.name}
                </h2>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-tho-kim text-sm uppercase tracking-wider mb-2">Mô Tả</h3>
                  <p className="text-co-chi leading-relaxed whitespace-pre-line">
                    {project.description}
                  </p>
                </div>

                {/* Tech Stack */}
                <div>
                  <h3 className="text-tho-kim text-sm uppercase tracking-wider mb-3">Công Nghệ</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium"
                        style={{
                          backgroundColor: `${project.color}22`,
                          color: project.color,
                          border: `1px solid ${project.color}44`,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-tho-kim text-sm uppercase tracking-wider mb-3">Tính Năng</h3>
                  <ul className="space-y-2">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-co-chi">
                        <span style={{ color: project.color }}>✦</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer with links */}
              <div className="p-6 border-t border-am-hong/30 flex gap-3">
                {project.links.demo && (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-co-chi transition-all hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${project.color} 0%, ${project.color}cc 100%)`,
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Xem Demo</span>
                  </a>
                )}
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-co-chi bg-am-hong/50 hover:bg-am-hong/70 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>Source Code</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ProjectModal;
