import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, Hero, About, Jobs, Featured, Projects, Contact } from '@components';
import './CustomCursor.css';
import './pointer.css';

const StyledRnMain = styled.main`
  counter-reset: section;
  position: relative;
  background-color: #050505 !important; /* utsav dark theme */

  /* Subtle noise/grid background */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-image: radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    background-size: 24px 24px;
    z-index: -1;
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
  ul li.project {
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
    background: rgba(25, 25, 25, 0.4) !important;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
    backdrop-filter: blur(12px) saturate(180%) !important;
    border-radius: 20px !important;
    overflow: visible !important;
    position: relative;
  }

  /* The glowing border effect on hover */
  ul li.project::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    border: 1px solid transparent;
    background: radial-gradient(
      400px circle at var(--mouse-x-relative, 0) var(--mouse-y-relative, 0),
      rgba(255, 255, 255, 0.3),
      transparent 40%
    ) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
  }

  ul li.project:hover {
    transform: translateY(-8px) scale(1.02) !important;
    box-shadow: 0 20px 40px -15px rgba(0,0,0,0.5) !important;
    background: rgba(40, 40, 40, 0.5) !important;
    border-color: transparent !important;
  }
  
  ul li.project:hover::after {
    opacity: 1;
  }

  /* Make image transition smooth */
  ul li.project .project-image img {
    transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
  }
  ul li.project:hover .project-image img {
    transform: scale(1.05) !important;
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
        
        // Update relative coordinates for each project card's glowing border
        const cards = containerRef.current.querySelectorAll('.project');
        cards.forEach(card => {
          const rect = card.getBoundingClientRect();
          const x = clientX - rect.left;
          const y = clientY - rect.top;
          card.style.setProperty('--mouse-x-relative', `${x}px`);
          card.style.setProperty('--mouse-y-relative', `${y}px`);
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
