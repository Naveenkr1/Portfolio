import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, Hero, About, Jobs, Featured, Projects, Contact } from '@components';
import './CustomCursor.css';
import './pointer.css';

const StyledRnMain = styled.main`
  counter-reset: section;
  position: relative;
  background-color: transparent !important;

  /* Subtle noise/grid background */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #050505; /* utsav dark theme */
    background-image: radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    background-size: 24px 24px;
    z-index: -2;
    pointer-events: none;
  }

  /* Spotlight effect tracking mouse */
  .mouse-spotlight {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: -1;
    background: radial-gradient(
      800px circle at var(--mouse-x) var(--mouse-y),
      rgba(255, 255, 255, 0.03),
      transparent 40%
    );
  }

  /* Override Project Cards in this page only */
  section#projects ul li.project, section#jobs .jobs-inner {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
    background: rgba(255, 255, 255, 0.02) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    backdrop-filter: blur(12px) saturate(180%) !important;
    border-radius: 24px !important;
    position: relative;
    overflow: hidden !important;
    z-index: 1;
  }

  /* Spotlight inside the card */
  section#projects ul li.project::before, section#jobs .jobs-inner::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      600px circle at var(--mouse-x-relative, 0) var(--mouse-y-relative, 0),
      rgba(255, 255, 255, 0.08),
      transparent 40%
    );
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
    z-index: 0;
  }

  /* The glowing border effect on hover */
  section#projects ul li.project::after, section#jobs .jobs-inner::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    border: 1px solid transparent;
    background: radial-gradient(
      400px circle at var(--mouse-x-relative, 0) var(--mouse-y-relative, 0),
      rgba(255, 255, 255, 0.6),
      transparent 40%
    ) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
    z-index: 2;
  }

  section#projects ul li.project:hover, section#jobs .jobs-inner:hover {
    box-shadow: 0 30px 60px -15px rgba(0,0,0,0.8) !important;
    background: rgba(255, 255, 255, 0.04) !important;
    border-color: rgba(255, 255, 255, 0.1) !important;
  }
  
  section#projects ul li.project:hover::after, section#projects ul li.project:hover::before,
  section#jobs .jobs-inner:hover::after, section#jobs .jobs-inner:hover::before {
    opacity: 1;
  }

  /* Make image transition smooth */
  section#projects ul li.project .project-image img {
    transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
  }
  section#projects ul li.project:hover .project-image img {
    transform: scale(1.08) !important;
  }
`;

const RnPage = ({ location }) => {
  const containerRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      setCursorPosition({ x: clientX, y: clientY });
      
      if (containerRef.current) {
        containerRef.current.style.setProperty('--mouse-x', `${clientX}px`);
        containerRef.current.style.setProperty('--mouse-y', `${clientY}px`);
        
        // Update relative coordinates for each project card's glowing border and 3D tilt
        const cards = containerRef.current.querySelectorAll('.project, .jobs-inner');
        cards.forEach(card => {
          const rect = card.getBoundingClientRect();
          const x = clientX - rect.left;
          const y = clientY - rect.top;
          card.style.setProperty('--mouse-x-relative', `${x}px`);
          card.style.setProperty('--mouse-y-relative', `${y}px`);
          
          // 3D Tilt calculation
          // Only tilt if the mouse is ACTUALLY inside this specific card
          if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Adjust max rotation degrees (lower is more subtle)
            const maxRotation = 4;
            
            const rotateX = ((y - centerY) / centerY) * -maxRotation;
            const rotateY = ((x - centerX) / centerX) * maxRotation;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'transform 0.1s ease-out';
          } else {
            // Reset to flat when mouse leaves the card
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease';
          }
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Layout location={location}>
      <StyledRnMain className="fillHeight rn-page" ref={containerRef}>
        <div className="mouse-spotlight" />
        <Hero />
        <Featured />
        <About />
        <Jobs />
        <Contact />
      </StyledRnMain>
      <div
        className="custom-cursor"
        style={{ transform: `translate3d(${cursorPosition.x}px, ${cursorPosition.y}px, 0)` }}
      />
    </Layout>
  );
};

RnPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default RnPage;
