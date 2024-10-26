import { motion } from 'framer-motion';
import styled from 'styled-components';

export const FloatingReaction = styled(motion.div)`
  position: absolute;
  pointer-events: none;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
`;

export const reactionVariants = {
  heart: {
    initial: { scale: 0, rotate: -30 },
    animate: {
      scale: [0, 1.2, 1],
      rotate: [-30, 0],
      y: [0, -100],
      opacity: [0, 1, 0],
    },
    transition: {
      duration: 1.5,
      times: [0, 0.2, 1],
      ease: "easeOut"
    }
  },
  bounce: {
    initial: { scale: 0, y: 0 },
    animate: {
      scale: [0, 1.2, 1],
      y: [0, -20, -100],
      opacity: [0, 1, 0],
    },
    transition: {
      duration: 2,
      times: [0, 0.2, 1],
      ease: "backOut"
    }
  },
  spiral: {
    initial: { scale: 0, rotate: 0 },
    animate: {
      scale: [0, 1.2, 1],
      rotate: [0, 360],
      y: [0, -100],
      opacity: [0, 1, 0],
    },
    transition: {
      duration: 1.8,
      times: [0, 0.3, 1],
      ease: "circOut"
    }
  },
  wave: {
    initial: { scale: 0, x: -50 },
    animate: {
      scale: [0, 1.2, 1],
      x: [-50, 0],
      y: [0, -30, -100],
      opacity: [0, 1, 0],
    },
    transition: {
      duration: 1.6,
      times: [0, 0.2, 1],
      ease: "easeOut"
    }
  }
};

export const gestureVariants = {
  dance: {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.1, 1, 1.1, 1],
      rotate: [0, -10, 10, -10, 0],
      y: [0, -10, 0, -10, 0],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  },
  jump: {
    initial: { y: 0 },
    animate: {
      y: [-20, 0],
      scaleY: [0.9, 1.1, 1],
    },
    transition: {
      duration: 0.5,
      repeat: Infinity,
      ease: "easeOut"
    }
  },
  spin: {
    initial: { rotate: 0 },
    animate: {
      rotate: 360,
      scale: [1, 1.2, 1],
    },
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  },
  wave: {
    initial: { rotate: -20 },
    animate: {
      rotate: [20, -20],
      x: [-5, 5],
    },
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};

export const groupDanceVariants = {
  circle: {
    initial: { scale: 1, rotate: 0 },
    animate: {
      scale: [1, 1.1, 1],
      rotate: [0, 360],
    },
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "linear"
    }
  },
  wave: {
    initial: { y: 0 },
    animate: {
      y: (custom: number) => [0, -20 * Math.sin(custom * Math.PI), 0],
    },
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export const ParticleEffect = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  background: ${props => props.color || '#fff'};
  border-radius: 50%;
  pointer-events: none;
`;

export const createParticles = (count: number, origin: { x: number, y: number }) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `particle-${i}`,
    initial: { x: origin.x, y: origin.y, opacity: 1 },
    animate: {
      x: origin.x + (Math.random() - 0.5) * 100,
      y: origin.y + (Math.random() - 0.5) * 100,
      opacity: 0,
    },
    transition: {
      duration: 0.5 + Math.random() * 0.5,
      ease: "easeOut"
    }
  }));
};
