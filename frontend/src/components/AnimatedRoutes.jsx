// AnimatedRoutes.jsx

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './Home';
import About from './About';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence exitBeforeEnter>
      <Routes key={location.pathname} location={location}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Home />
            </motion.div>
          }
        />
        <Route
          path="/about"
          element={
            <motion.div
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              exit={{ x: -100 }}
            >
              <About />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
