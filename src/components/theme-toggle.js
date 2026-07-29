import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledToggle = styled.button`
  position: fixed;
  bottom: 35px;
  right: 35px;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--light-navy);
  border: 1px solid var(--green);
  color: var(--green);
  box-shadow: 0 10px 30px -15px var(--navy-shadow);
  cursor: pointer;
  transition: var(--transition);
  backdrop-filter: blur(10px);
  padding: 0;

  &:hover,
  &:focus {
    transform: scale(1.1) rotate(12deg);
    background-color: var(--green-tint);
    border-color: var(--green);
    color: var(--green);
    outline: none;
    box-shadow: 0 20px 30px -15px var(--navy-shadow);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 22px;
    height: 22px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: var(--transition);
  }
`;

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <StyledToggle onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'light' ? (
        // Moon Icon (representing toggle back to dark)
        <svg viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        // Sun Icon (representing toggle to light)
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )}
    </StyledToggle>
  );
};

ThemeToggle.propTypes = {
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default ThemeToggle;
