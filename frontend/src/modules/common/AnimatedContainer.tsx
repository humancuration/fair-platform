import { motion } from 'framer-motion';
import styled from 'styled-components';

export const AnimatedContainer = styled(motion.div)`
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

export const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -100 }
};
