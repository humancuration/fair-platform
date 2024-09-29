// DraggableWidget.jsx

import React from 'react';
import { Rnd } from 'react-rnd';

const DraggableWidget = () => (
  <Rnd
    default={{
      x: 50,
      y: 50,
      width: 200,
      height: 200,
    }}
    bounds="window"
    style={{ background: '#ffec5c', padding: '10px' }}
  >
    <p>I'm a draggable and resizable widget!</p>
  </Rnd>
);

export default DraggableWidget;
