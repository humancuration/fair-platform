import React from 'react';
import { Parallax, ParallaxLayer } from 'react-spring/renderprops-addons';

const ParallaxSections = () => (
  <Parallax pages={3}>
    <ParallaxLayer offset={0} speed={0.5}>
      <div style={{ backgroundImage: 'url("/path/to/first-image.jpg")', backgroundSize: 'cover', height: '100%' }} />
    </ParallaxLayer>

    <ParallaxLayer offset={0} speed={1.5}>
      <h1 style={{ textAlign: 'center', marginTop: '20%' }}>Welcome to Fair Platform</h1>
    </ParallaxLayer>

    <ParallaxLayer offset={1} speed={0.5}>
      <div style={{ backgroundImage: 'url("/path/to/second-image.jpg")', backgroundSize: 'cover', height: '100%' }} />
    </ParallaxLayer>

    <ParallaxLayer offset={1} speed={1}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div style={{ background: 'rgba(255,255,255,0.8)', padding: '20px', borderRadius: '10px' }}>
          <h2>Discover Our Features</h2>
          <p>Explore the power of fair referrals and revenue sharing.</p>
        </div>
      </div>
    </ParallaxLayer>

    <ParallaxLayer offset={2} speed={0.5}>
      <div style={{ backgroundImage: 'url("/path/to/third-image.jpg")', backgroundSize: 'cover', height: '100%' }} />
    </ParallaxLayer>

    <ParallaxLayer offset={2} speed={2}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <h2>Join Our Community</h2>
        <button style={{ padding: '10px 20px', fontSize: '18px', cursor: 'pointer' }}>Sign Up Now</button>
      </div>
    </ParallaxLayer>
  </Parallax>
);

export default ParallaxSections;
