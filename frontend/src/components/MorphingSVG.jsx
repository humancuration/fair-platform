import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(MorphSVGPlugin);

const shapes = {
  marketplace: "M50,50 C75,0 125,0 150,50 C175,100 125,150 100,150 C75,150 25,100 50,50 Z",
  community: "M50,50 C75,75 125,75 150,50 C175,25 125,-25 100,0 C75,25 25,25 50,50 Z",
  referrals: "M100,10 L150,90 L50,90 Z"
};

const colors = {
  marketplace: "#ff6f61",
  community: "#4ecdc4",
  referrals: "#45b7d1"
};

const MorphingSVG = ({ initialShape = 'marketplace' }) => {
  const svgRef = useRef(null);
  const shapeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(shapeRef.current, {
        duration: 2,
        morphSVG: shapes.community,
        fill: colors.community,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        onRepeat: () => {
          const nextShape = Object.keys(shapes)[Math.floor(Math.random() * Object.keys(shapes).length)];
          gsap.to(shapeRef.current, {
            duration: 2,
            morphSVG: shapes[nextShape],
            fill: colors[nextShape],
            ease: "power1.inOut"
          });
        }
      });
    }, svgRef);

    return () => ctx.revert();
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 200 200" style={{ width: '200px', height: '200px' }}>
      <path
        ref={shapeRef}
        d={shapes[initialShape]}
        fill={colors[initialShape]}
      />
    </svg>
  );
};

export default MorphingSVG;
