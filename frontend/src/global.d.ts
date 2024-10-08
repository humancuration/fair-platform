import React from 'react'
declare module 'react';
declare module 'react-router-dom';
// Add other modules as needed
declare global {
    namespace JSX {
      interface IntrinsicElements {
        [elemName: string]: any;
      }
    }
  }