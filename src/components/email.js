import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { email } from '@config';
import { Side } from '@components';
import { IconCopy, IconCheck } from '@components/icons';

const StyledLinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  &:after {
    content: '';
    display: block;
    width: 1px;
    height: 90px;
    margin: 0 auto;
    background-color: var(--light-slate);
  }

  .copy-btn {
    background: none;
    border: none;
    padding: 10px;
    cursor: pointer;
    color: var(--light-slate);
    transition: var(--transition);
    
    svg {
      width: 20px;
      height: 20px;
    }

    &:hover,
    &:focus {
      transform: translateY(-3px);
      color: var(--green);
    }
  }

  a {
    margin: 10px auto 20px;
    padding: 10px;
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    line-height: var(--fz-lg);
    letter-spacing: 0.1em;
    writing-mode: vertical-rl;

    &:hover,
    &:focus {
      transform: translateY(-3px);
    }
  }
`;

const Email = ({ isHome }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (isCopied) {
      timeoutId = setTimeout(() => {
        setIsCopied(false);
      }, 4000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isCopied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setIsCopied(true);
  };

  return (
    <Side isHome={isHome} orientation="right">
      <StyledLinkWrapper>
        <button 
          className="copy-btn" 
          onClick={handleCopy} 
          aria-label="Copy email to clipboard"
          title="Copy email"
        >
          {isCopied ? <IconCheck /> : <IconCopy />}
        </button>
        <a href={`mailto:${email}`}>{email}</a>
      </StyledLinkWrapper>
    </Side>
  );
};

Email.propTypes = {
  isHome: PropTypes.bool,
};

export default Email;
