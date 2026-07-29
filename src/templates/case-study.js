import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout } from '@components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { marked } from 'marked';


const StyledCaseStudyContainer = styled.main`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 50px;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 60px;
  justify-content: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 60px 25px;
    gap: 40px;
  }
`;

const StyledHeaderDetails = styled.div`
  width: 100%;
  margin-bottom: 40px;
  scroll-margin-top: 100px;
`;

// const StyledDivider = styled.hr`
//   border: 0;
//   height: 1px;
//   background-color: var(--lightest-navy);
//   max-width: 1100px;
//   margin: 0 auto;
//
//   @media (max-width: 900px) {
//     max-width: calc(100% - 50px);
//   }
// `;

const StyledLightbox = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(2, 12, 27, 0.98);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: zoom-out;
  padding: 40px;
  backdrop-filter: blur(5px);

  .lightbox-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  img {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
    box-shadow: 0 30px 60px -12px rgba(2, 12, 27, 0.5), 0 18px 36px -18px rgba(2, 12, 27, 0.5);
    border-radius: var(--border-radius);
    cursor: default;
  }

  .nav-btn {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(17, 34, 64, 0.7);
    border: 1px solid var(--lightest-navy);
    color: var(--green);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: var(--transition);
    z-index: 10001;

    &:hover {
      background: var(--green);
      color: var(--navy);
      border-color: var(--green);
    }

    svg {
      width: 24px;
      height: 24px;
    }
  }

  .prev-btn {
    left: 40px;
  }
  .next-btn {
    right: 40px;
  }

  .close-btn {
    position: fixed;
    top: 30px;
    right: 40px;
    background: transparent;
    border: none;
    color: var(--slate);
    font-size: 40px;
    cursor: pointer;
    transition: var(--transition);
    z-index: 10001;

    &:hover {
      color: var(--green);
      transform: rotate(90deg);
    }
  }

  .counter {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    background: rgba(17, 34, 64, 0.7);
    padding: 5px 15px;
    border-radius: 20px;
  }
`;

const StyledBanner = styled.div`
  width: 100%;
  max-width: none;
  margin: 0 0 40px 0;
  padding: 100px 0 0 0;
  position: relative;

  img, video {
    width: 100%;
    height: 680px;
    object-fit: cover;
    border-radius: 0;

    @media (max-width: 900px) {
      height: auto;
      aspect-ratio: 16/9;
    }
  }

  @media (max-width: 900px) {
    padding: 0;
    margin-top: 0;
  }
`;

const StyledSidebar = styled.aside`
  position: sticky;
  top: 100px;
  height: calc(100vh - 160px);
  align-self: start;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding-right: 40px;

  @media (max-width: 1080px) {
    padding-right: 20px;
  }

  @media (max-width: 900px) {
    position: static;
    margin-bottom: 40px;
    height: auto;
    padding-right: 0;
  }

  .back-to-top {
    background: transparent;
    border: none;
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: 13px;
    cursor: pointer;
    padding: 0;
    text-align: left;
    width: fit-content;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 8px;
    outline: none;
    margin-top: auto;
    margin-left: -20px;

    &:hover {
      color: var(--green);
    }

    svg {
      width: 14px;
      height: 14px;
      transition: var(--transition);
      transform: rotate(90deg);
    }

    &:hover svg {
      transform: translateY(-3px) rotate(90deg);
    }

    @media (max-width: 900px) {
      display: none;
      margin-left: 0;
    }
  }
`;

const StyledTOCInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  .toc-label {
    display: block;
    font-family: var(--font-sans);
    font-size: var(--fz-sm);
    color: var(--light-slate);
    font-weight: 500;
    margin-bottom: 10px;
    padding-left: 16px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 5px;
      width: 100%;

      a {
        display: flex;
        align-items: center;
        gap: 15px;
        width: 100%;
        color: var(--slate);
        font-family: var(--font-sans);
        font-size: 15px;
        text-decoration: none;
        transition: var(--transition);
        padding: 8px 16px;
        border-radius: 12px;
        font-weight: 500;

        &:hover {
          color: var(--lightest-slate);
        }

        &.active {
          color: var(--lightest-slate);
          background-color: var(--green-tint); /* Pill background */
          
          .toc-number {
            color: var(--green);
            opacity: 1;
          }
        }

        .toc-number {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--light-slate);
          opacity: 0.6;
          transition: var(--transition);
        }
      }
    }
  }
`;

const StyledContentArea = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  max-width: 800px;

  /* Global styles for Markdown generated content */
  h2 {
    font-size: clamp(22px, 3vw, 28px);
    color: var(--lightest-slate);
    margin-top: 0px;
    margin-bottom: 0px;
    display: flex;
    align-items: center;
    scroll-margin-top: 100px;
    font-weight: 700;
  }

  h3 {
    font-size: clamp(18px, 2vw, 22px);
    color: var(--lightest-slate);
    margin-top: 24px;
    margin-bottom: 8px;
    font-weight: 600;
  }

  p {
    color: var(--slate);
    font-size: 17px;
    margin-top: 8px;
    margin-bottom: 8px;
    line-height: 1.6;
  }

  /* Override padding/margin for pasted ChatGPT/AI interface elements */
  .text-token-text-primary, 
  .text-base.pb-10,
  .text-base.my-auto.mx-auto.pb-10 {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
    margin-top: 0px !important;
    margin-bottom: 0px !important;
  }

  ul {
    padding-left: 20px;
    color: var(--slate);
    margin-bottom: 16px;
    li {
      margin-bottom: 8px;
      font-size: 17px;
      line-height: 1.6;
    }
  }

  .grid {
    display: grid;
    gap: 12px;
    margin: 40px 0;
  }
  .grid-1 {
    grid-template-columns: 1fr;
  }
  .grid-2 {
    grid-template-columns: 1fr 1fr;
  }
  .grid-3 {
    grid-template-columns: 1fr 1fr 1fr;
  }

  img {
    max-width: 100% !important;
    width: auto !important;
    height: auto !important;
    display: block;
    margin: 40px auto;
    border-radius: 16px;
  }

  /* Metrics Grid */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin: 40px 0 60px;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
      gap: 15px;
    }
  }

  .metric-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    padding: 30px 20px;
    border-radius: var(--border-radius);
    text-align: center;
    transition: var(--transition);

    &:hover {
      transform: translateY(-5px);
      border-color: var(--green);
    }

    .metric-value {
      font-size: clamp(32px, 5vw, 44px);
      font-weight: 700;
      color: var(--green);
      margin-bottom: 10px;
    }

    .metric-label {
      font-size: var(--fz-sm);
      color: var(--light-slate);
      line-height: 1.4;
      margin: 0;
    }
  }

  .section-eyebrow {
    font-size: 14px;
    color: var(--green);
    margin-bottom: 12px;
    font-weight: 500;
  }

  /* Quick Context Block */
  .quick-context {
    background: var(--light-navy);
    border-left: 3px solid var(--green);
    border-radius: var(--border-radius);
    padding: 35px;
    margin: 40px 0 60px;

    .context-title {
      font-size: var(--fz-lg);
      color: var(--white);
      margin: 0 0 25px 0;
      font-weight: 600;
    }

    .context-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }

    .context-card {
      h4 {
        font-size: var(--fz-md);
        color: var(--green);
        margin: 0 0 10px 0;
        font-weight: 500;
      }
      p {
        font-size: var(--fz-sm);
        color: var(--slate);
        line-height: 1.5;
        margin: 0;
      }
    }
  }

  /* HMW Callout */
  .hmw-block {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: var(--border-radius);
    padding: 40px;
    margin: 50px 0;
    text-align: center;

    .hmw-label {
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      color: var(--green);
      text-transform: uppercase;
      letter-spacing: 2px;
      display: block;
      margin-bottom: 20px;
    }

    p {
      font-size: clamp(20px, 3.5vw, 26px);
      color: var(--lightest-slate);
      font-weight: 500;
      line-height: 1.4;
      margin: 0 auto;
      max-width: 800px;
    }
  }

  /* Decisions Grid */
  .decisions-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin: 40px 0;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .decision-card {
      background: var(--light-navy);
      border: 1px solid var(--lightest-navy);
      border-radius: var(--border-radius);
      padding: 16px;
      transition: var(--transition);

      &:hover {
        border-color: var(--green);
      }

      h3 {
        font-size: var(--fz-md);
        color: var(--green);
        margin: 0 0 12px 0;
        font-weight: 600;
      }

      p {
        font-size: var(--fz-sm);
        color: var(--slate);
        line-height: 1.5;
        margin: 0;
      }
    }
  }

  /* Callout Block (Pro Tips) */
  .callout-block {
    background: var(--light-navy);
    border: 1px solid var(--lightest-navy);
    border-radius: var(--border-radius);
    padding: 30px;
    margin: 40px 0;

    h3 {
      font-size: var(--fz-xl);
      color: var(--white);
      margin: 0 0 20px 0;
      font-weight: 600;
    }

    .callout-content {
      color: var(--slate);
      font-size: var(--fz-lg);
      line-height: 1.6;

      p {
        margin-bottom: 15px;
      }
      p:last-child {
        margin-bottom: 0;
      }

      ul {
        list-style-type: none;
        padding: 0;
        margin: 0;

        li {
          position: relative;
          padding-left: 20px;
          margin-bottom: 15px;

          &::before {
            content: '•';
            position: absolute;
            left: 0;
            color: var(--slate);
          }
        }
      }
    }
  }

  /* Cards Grid */
  .cards-grid {
    display: grid;
    gap: 12px;
    margin: 40px 0;
    overflow: hidden;

    &.cards-grid-2 { grid-template-columns: repeat(2, 1fr); }
    &.cards-grid-3 { grid-template-columns: repeat(3, 1fr); }
    &.cards-grid-4 { grid-template-columns: repeat(4, 1fr); }

    @media (max-width: 900px) {
      &.cards-grid-3, &.cards-grid-4 {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 600px) {
      grid-template-columns: 1fr !important;
    }

    .card {
      padding: 16px;
      border: 1px solid var(--lightest-navy);
      border-radius: 12px;
      background: var(--light-navy);
      
      h3 {
        font-size: 36px;
        color: var(--green);
        margin: 0 0 10px 0;
        font-weight: 700;
        line-height: 1.2;
      }

      p {
        font-size: 16px;
        color: var(--slate);
        margin: 0;
        line-height: 1.5;
      }
    }
  }

  /* Features List */
  .features-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 40px 0;

    .feature-item {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: center;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .feature-content {
        h3 {
          font-size: var(--fz-xl);
          color: var(--white);
          margin: 0 0 15px 0;
          font-weight: 600;
        }
        p {
          font-size: var(--fz-md);
          color: var(--slate);
          line-height: 1.6;
          margin: 0;
        }
      }
    }
  }

  /* Before & After Grid */
  .before-after-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin: 50px 0;
    border-top: 1px solid var(--lightest-navy);
    padding-top: 40px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 30px;
    }

    .before-column,
    .after-column {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: var(--border-radius);
      padding: 30px;

      h3 {
        font-size: var(--fz-lg);
        font-weight: 600;
        margin: 0 0 20px 0;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      ul {
        margin: 0;
        padding-left: 20px;
        li {
          font-size: var(--fz-sm);
          margin-bottom: 12px;
          line-height: 1.5;
          color: var(--slate);
        }
      }
    }

    .before-column {
      border-left: 3px solid #ff6b6b;
      h3 {
        color: #ff6b6b;
      }
    }

    .after-column {
      border-left: 3px solid var(--green);
      h3 {
        color: var(--green);
      }
    }
  }

  /* Vector Illustration / Placeholders */
  .vector-illustration {
    width: 100%;
    height: 240px;
    background-color: var(--light-navy);
    border: 1px solid var(--lightest-navy);
    border-radius: var(--border-radius);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    padding: 20px;
    text-align: center;
    position: relative;
    overflow: hidden;
    margin: 30px 0;

    svg {
      margin-bottom: 15px;
      color: var(--green);
      opacity: 0.8;
    }

    .illustration-title {
      color: var(--lightest-slate);
      font-weight: 500;
      margin-bottom: 5px;
    }

    .illustration-desc {
      color: var(--slate);
      font-size: 11px;
      max-width: 250px;
      margin: 0;
    }
  }
`;

const StyledHero = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;

  .section-eyebrow {
    font-size: 14px;
    color: var(--green);
    margin-bottom: 12px;
    font-weight: 500;
  }

  .internship-tag {
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }

  h1 {
    font-size: clamp(32px, 5vw, 48px);
    color: var(--lightest-slate);
    margin: 0 0 15px 0;
    line-height: 1.1;
    font-weight: 700;
  }

  .summary {
    color: var(--light-slate);
    font-size: 18px;
    line-height: 1.6;
    max-width: 800px;
    margin-bottom: 20px;
  }

  .tagline {
    font-size: 18px;
    line-height: 1.4;
    margin-bottom: 8px;
    color: var(--lightest-slate);
  }

  .subtagline {
    color: var(--slate);
    font-size: 16px;
    line-height: 1.5;
    font-style: italic;
    margin-bottom: 0;
  }
`;

const StyledMetadataRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  /* gap: 30px; */
  /* margin-bottom: 80px; */
  border-top: 1px solid var(--lightest-navy);
  border-bottom: 1px solid var(--lightest-navy);
  padding: 40px 0;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 30px 0;
  }

  .meta-item {
    h3 {
      font-size: var(--fz-xs);
      font-family: var(--font-mono);
      color: var(--green);
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    p,
    div {
      color: var(--light-slate);
      margin: 0;
      font-size: var(--fz-sm);
      line-height: 1.5;
    }
  }
`;

const CaseStudyTemplate = ({ data, location }) => {
  const { caseStudy } = data;

  if (!caseStudy) {
    return (
      <Layout location={location}>
        <div style={{ padding: '100px 0', textAlign: 'center' }}>
          <h2>Case Study not found</h2>
          <p>Please make sure the slug is correct and the server has been updated.</p>
        </div>
      </Layout>
    );
  }

  const {
    title,
    date,
    summary,
    details,
    role,
    results,
    methods,
    banner,
    toc_enabled,
    slug: frontSlug,
    toc_items,
    markdown,
  } = caseStudy;
  const frontmatter = {
    title,
    date,
    summary,
    details,
    role,
    results,
    methods,
    banner,
    tocEnabled: toc_enabled,
    slug: frontSlug,
    tocItems: toc_items,
  };
  const html = marked.parse(markdown || '');

  const [activeSection, setActiveSection] = useState('');
  const [lightbox, setLightbox] = useState({ isOpen: false, currentIdx: 0, images: [] });

  const hasTOC = frontmatter.tocEnabled && frontmatter.tocItems && frontmatter.tocItems.length > 0;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLightbox = (idx, images) => {
    setLightbox({ isOpen: true, currentIdx: idx, images });
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightbox(prev => ({ ...prev, isOpen: false }));
    document.body.style.overflow = '';
  };

  const nextImage = e => {
    if (e) e.stopPropagation();
    setLightbox(prev => ({
      ...prev,
      currentIdx: (prev.currentIdx + 1) % prev.images.length,
    }));
  };

  const prevImage = e => {
    if (e) e.stopPropagation();
    setLightbox(prev => ({
      ...prev,
      currentIdx: (prev.currentIdx - 1 + prev.images.length) % prev.images.length,
    }));
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -80% 0px',
      threshold: 0,
    };

    const handleIntersection = entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    const h2Elements = document.querySelectorAll('#case-study-content h2[id]');
    
    // Inject section eyebrows
    h2Elements.forEach((h2) => {
      observer.observe(h2);
      
      // Prevent duplicates in development / React re-renders
      if (h2.previousElementSibling && h2.previousElementSibling.classList.contains('section-eyebrow')) {
        return;
      }
      
      // Only show eyebrow if this heading is in the table of contents
      const tocItems = frontmatter.tocItems || [];
      const tocIndex = tocItems.findIndex(item => item.anchor === h2.id);
      
      if (tocIndex !== -1) {
        const tocItem = tocItems[tocIndex];
        const eyebrow = document.createElement('div');
        eyebrow.className = 'section-eyebrow';
        const num = (tocIndex + 2).toString().padStart(2, '0');
        eyebrow.textContent = `${num}. ${tocItem.text}`;
        
        h2.parentNode.insertBefore(eyebrow, h2);
      }
    });

    const overviewEl = document.getElementById('overview');
    if (overviewEl) observer.observe(overviewEl);

    // Reveal animations
    if (sr) {
      const fastConfig = delay => ({ ...srConfig(delay), duration: 400 });
      sr.reveal('.banner-reveal', fastConfig(100));
      sr.reveal('.header-details-reveal', fastConfig(150));
      sr.reveal('.toc-reveal', fastConfig(200));
      sr.reveal('#case-study-content > *', fastConfig(300));
    }

    const handleKeyDown = e => {
      if (!lightbox.isOpen) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeLightbox();
    };

    document.documentElement.style.scrollBehavior = 'smooth';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      h2Elements.forEach(el => observer.unobserve(el));
      const overviewEl = document.getElementById('overview');
      if (overviewEl) observer.unobserve(overviewEl);
      window.removeEventListener('keydown', handleKeyDown);
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, [lightbox.isOpen, html]);

  useEffect(() => {
    // Collect all images for the gallery
    const contentImgs = Array.from(document.querySelectorAll('#case-study-content img'));
    const bannerImg = document.querySelector('.banner-img');
    const allGalleryImages = [];

    const isBannerImage = bannerImg && bannerImg.tagName.toLowerCase() === 'img';

    if (isBannerImage) allGalleryImages.push(bannerImg.src);
    contentImgs.forEach(img => allGalleryImages.push(img.src));

    // Attach listeners
    if (isBannerImage) {
      bannerImg.style.cursor = 'zoom-in';
      bannerImg.onclick = () => openLightbox(0, allGalleryImages);
    }

    contentImgs.forEach((img, i) => {
      img.style.cursor = 'zoom-in';
      const galleryIdx = isBannerImage ? i + 1 : i;
      img.onclick = () => openLightbox(galleryIdx, allGalleryImages);
    });
  }, [html, frontmatter.banner]);

  // Removed old reveal useEffect as it's merged into the main one above

  const isVideoBanner = frontmatter.banner && (
    frontmatter.banner.startsWith('data:video/') ||
    /\.(mp4|webm|ogg|mov|m4v|ogv)($|\?)/i.test(frontmatter.banner) ||
    frontmatter.banner.includes('/video/upload/')
  );

  return (
    <Layout location={location} hideSocialAndEmail={true}>
      {frontmatter.banner && (
        <StyledBanner className="banner-reveal">
          {isVideoBanner ? (
            <video
              src={frontmatter.banner}
              autoPlay
              loop
              muted
              playsInline
              className="banner-img"
            />
          ) : (
            <img
              src={`${frontmatter.banner}${
                frontmatter.banner.includes('?') ? '&' : '?'
              }t=${new Date().getTime()}`}
              alt={frontmatter.title}
              className="banner-img"
            />
          )}
        </StyledBanner>
      )}

      <StyledCaseStudyContainer>
        <StyledSidebar className="toc-reveal">
          {hasTOC && (
            <StyledTOCInner>
              <div className="toc-label">On this page</div>
              <ul>
                <li>
                  <a href="#overview" className={activeSection === 'overview' ? 'active' : ''}>
                    <span className="toc-number">01</span>
                    Overview
                  </a>
                </li>
                {frontmatter.tocItems
                  .filter(item => item.anchor !== 'overview') // prevent duplicate
                  .map((item, idx) => (
                    <li key={idx}>
                      <a
                        href={`#${item.anchor}`}
                        className={activeSection === item.anchor ? 'active' : ''}
                      >
                        <span className="toc-number">{(idx + 2).toString().padStart(2, '0')}</span>
                        {item.text}
                      </a>
                    </li>
                  ))}
              </ul>
            </StyledTOCInner>
          )}

          {/* <button className="back-to-top" onClick={scrollToTop}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"></path>
            </svg>
            Back to top
          </button> */}
        </StyledSidebar>

        <StyledContentArea>
          {(() => {
            const roleParts = (frontmatter.role || '').split(' || ');
            const myRole = roleParts[0] || '';
            const timeline = roleParts[1] || '';

            const summaryParts = (frontmatter.summary || '').split(' || ');
            const tagline = summaryParts[0] || '';
            const subtagline = summaryParts[1] || '';

            return (
              <StyledHeaderDetails id="overview" className="header-details-reveal">
                <StyledHero>
                  {hasTOC && <div className="section-eyebrow">01. Overview</div>}
                  {myRole && <span className="internship-tag">{myRole}</span>}
                  <h1>{frontmatter.title}</h1>
                  {tagline && <div className="tagline">{tagline}</div>}
                  {subtagline && <div className="subtagline">{subtagline}</div>}
                </StyledHero>

                {frontmatter.details && frontmatter.details.length > 0 ? (
                  <StyledMetadataRow>
                    {frontmatter.details.map((detail, idx) => (
                      <div className="meta-item" key={idx}>
                        <h3>{detail.label}</h3>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: detail.value.replace(/\\n/g, '<br/>'),
                          }}
                        />
                      </div>
                    ))}
                  </StyledMetadataRow>
                ) : (
                  (frontmatter.role || frontmatter.results || frontmatter.methods) && (
                    <StyledMetadataRow>
                      {frontmatter.results && frontmatter.results !== 'N/A' && (
                        <div className="meta-item">
                          <h3>Project Type</h3>
                          <p>{frontmatter.results}</p>
                        </div>
                      )}
                      {frontmatter.methods && frontmatter.methods !== 'N/A' && (
                        <div className="meta-item">
                          <h3>Team</h3>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: frontmatter.methods.replace(/\\n/g, '<br/>'),
                            }}
                          />
                        </div>
                      )}
                      {myRole && myRole !== 'N/A' && (
                        <div className="meta-item">
                          <h3>My Role</h3>
                          <p>{myRole}</p>
                        </div>
                      )}
                      {timeline && timeline !== 'N/A' && (
                        <div className="meta-item">
                          <h3>Timeline</h3>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: timeline.replace(/\\n/g, '<br/>'),
                            }}
                          />
                        </div>
                      )}
                    </StyledMetadataRow>
                  )
                )}
              </StyledHeaderDetails>
            );
          })()}

          <div
            id="case-study-content"
            className="content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </StyledContentArea>
      </StyledCaseStudyContainer>

      {lightbox.isOpen && (
        <StyledLightbox onClick={closeLightbox}>
          <button className="close-btn" onClick={closeLightbox}>
            &times;
          </button>

          <button className="nav-btn prev-btn" onClick={prevImage}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="lightbox-content">
            <img
              src={lightbox.images[lightbox.currentIdx]}
              alt="Fullscreen preview"
              onClick={e => e.stopPropagation()}
            />
          </div>

          <button className="nav-btn next-btn" onClick={nextImage}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div className="counter">
            {lightbox.currentIdx + 1} / {lightbox.images.length}
          </div>
        </StyledLightbox>
      )}
    </Layout>
  );
};

CaseStudyTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default CaseStudyTemplate;

export const pageQuery = graphql`
  query ($slug: String!) {
    caseStudy: mongodbPortfolioCaseStudies(slug: { eq: $slug }) {
      title
      date
      summary
      details {
        label
        value
      }
      role
      results
      methods
      banner
      toc_enabled
      slug
      toc_items {
        text
        anchor
      }
      markdown
    }
  }
`;
