import React, { useState, useEffect } from 'react';
import { graphql, Link } from 'gatsby';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout } from '@components';
import sr from '@utils/sr';
import { srConfig } from '@config';

const StyledCaseStudyContainer = styled.main`
  width: 100%;
  max-width: ${props => (props.hasTOC ? '1200px' : '900px')};
  margin: 0 auto;
  padding: 0 50px 100px;
  display: grid;
  grid-template-columns: ${props => (props.hasTOC ? '250px 1fr' : '1fr')};
  gap: 80px;
  justify-content: center;

  @media (max-width: 1080px) {
    gap: 40px;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 0 25px 80px;
  }
`;

const StyledOtherWorkSection = styled.section`
  max-width: 1200px;
  margin: 100px auto 0;
  padding: 0 50px 100px;

  h2 {
    font-size: clamp(24px, 5vw, 32px);
    margin-bottom: 40px;
    color: var(--lightest-slate);
    text-align: center;
  }

  @media (max-width: 768px) {
    padding: 0 25px 80px;
  }
`;

const StyledOtherWorkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledWorkCard = styled.a`
  display: block;
  background: var(--light-navy);
  border: 1px solid var(--green);
  border-radius: 16px;
  padding: 16px;
  transition: var(--transition);
  text-decoration: none !important;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(100, 255, 218, 0.05);
    transition: var(--transition);
    z-index: 2;
    pointer-events: none;
  }

  &:hover::after {
    background-color: transparent;
  }

  &:hover {
    transform: translateY(-5px);
    background: var(--lightest-navy);
    box-shadow: 0 10px 30px -15px rgba(2, 12, 27, 0.7);
  }

  .card-image {
    width: 100%;
    height: 200px;
    background: var(--navy);
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      margin: 0 !important;
      border-radius: 8px !important;
      transition: var(--transition);
    }
  }

  .card-content {
    padding: 16px 0 0;

    h3 {
      font-size: 20px;
      color: var(--white);
      margin-bottom: 8px;
      transition: var(--transition);
    }

    p {
      font-size: 14px;
      color: var(--slate);
      line-height: 1.5;
    }
  }

  &:hover h3 {
    color: var(--green);
  }
`;

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

  .prev-btn { left: 40px; }
  .next-btn { right: 40px; }

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
  margin: 40px auto 60px;
  padding: 0 50px;
  height: 60vh;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px;
  }

  @media (max-width: 900px) {
    height: 40vh;
    padding: 0 25px;
    margin-top: 20px;
  }
`;

const StyledBackContainer = styled.div`
  max-width: 100%;
  margin: 100px auto 0;
  padding: 0 50px;

  @media (max-width: 900px) {
    padding: 0 25px;
    margin-top: 80px;
  }
`;

const StyledBackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--green);
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  text-decoration: none;
  width: fit-content;
  transition: var(--transition);

  &:hover {
    color: var(--green-tint);
    transform: translateX(-5px);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const StyledTOC = styled.aside`
  position: sticky;
  top: 100px;
  height: fit-content;
  align-self: start;
  
  @media (max-width: 900px) {
    display: none;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    border-left: none;
    
    li {
      margin-bottom: 15px;
      
      a {
        display: block;
        padding-left: 20px;
        color: var(--slate);
        font-family: var(--font-mono);
        font-size: var(--fz-sm);
        text-decoration: none;
        transition: var(--transition);
        position: relative;
        
        &:hover,
        &.active {
          color: var(--green);
        }

        &.active:before {
          content: '▹';
          position: absolute;
          left: -15px;
          color: var(--green);
        }
      }
    }
  }
`;

const StyledContentArea = styled.div`
  display: flex;
  flex-direction: column;

  /* Global styles for Markdown generated content to match the original template's StyledSection */
  h2 {
    font-size: clamp(24px, 5vw, 32px);
    color: var(--lightest-slate);
    margin-top: 80px;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    scroll-margin-top: 100px;

    &:before {
      content: '▹';
      color: var(--green);
      margin-right: 15px;
      font-size: 24px;
    }
  }

  h3 {
    font-size: var(--fz-xl);
    color: var(--white);
    margin-bottom: 20px;
    margin-top: 40px;
  }

  p {
    color: var(--slate);
    font-size: var(--fz-lg);
    margin-bottom: 20px;
    line-height: 1.6;
  }

  ul {
    padding-left: 20px;
    color: var(--slate);
    margin-bottom: 20px;
    li {
      margin-bottom: 10px;
      font-size: var(--fz-lg);
      line-height: 1.6;
    }
  }

  .grid {
    display: grid;
    gap: 20px;
    margin: 40px 0;
  }
  .grid-1 { grid-template-columns: 1fr; }
  .grid-2 { grid-template-columns: 1fr 1fr; }
  .grid-3 { grid-template-columns: 1fr 1fr 1fr; }

  img {
    max-width: 100% !important;
    width: auto !important;
    height: auto !important;
    display: block;
    margin: 30px auto;
    border-radius: var(--border-radius);
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
`;

const StyledHero = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 80px;

  h1 {
    font-size: clamp(40px, 8vw, 60px);
    color: var(--lightest-slate);
    margin-bottom: 30px;
  }

  .summary {
    color: var(--light-slate);
    font-size: var(--fz-xl);
    line-height: 1.5;
    max-width: 800px;
    margin-bottom: 30px;
  }
`;

const StyledMetadataRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 80px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  border-top: 1px solid var(--lightest-navy);
  border-bottom: 1px solid var(--lightest-navy);
  padding: 40px 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 30px 0;
  }

  .meta-item {
    h3 {
      font-size: var(--fz-xs);
      font-family: var(--font-mono);
      color: var(--green);
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    p {
      color: var(--light-slate);
      margin: 0;
      font-size: var(--fz-sm);
      line-height: 1.5;
    }
  }
`;

const CaseStudyTemplate = ({ data, location }) => {
  const { markdownRemark, featured } = data;
  
  // Get 2 other projects for "Other Work"
  const otherProjects = featured?.edges
    ? featured.edges
        .filter(({ node }) => node.frontmatter.slug !== markdownRemark?.frontmatter?.slug)
        .slice(0, 2)
    : [];
  
  if (!markdownRemark) {
    return (
      <Layout location={location}>
        <div style={{ padding: '100px 0', textAlign: 'center' }}>
          <h2>Case Study not found</h2>
          <p>Please make sure the slug is correct and the server has been updated.</p>
        </div>
      </Layout>
    );
  }

  const { frontmatter, html } = markdownRemark;
  const [activeSection, setActiveSection] = useState('');
  const [lightbox, setLightbox] = useState({ isOpen: false, currentIdx: 0, images: [] });

  const openLightbox = (idx, images) => {
    setLightbox({ isOpen: true, currentIdx: idx, images });
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightbox(prev => ({ ...prev, isOpen: false }));
    document.body.style.overflow = '';
  };

  const nextImage = (e) => {
    if (e) e.stopPropagation();
    setLightbox(prev => ({
      ...prev,
      currentIdx: (prev.currentIdx + 1) % prev.images.length
    }));
  };

  const prevImage = (e) => {
    if (e) e.stopPropagation();
    setLightbox(prev => ({
      ...prev,
      currentIdx: (prev.currentIdx - 1 + prev.images.length) % prev.images.length
    }));
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -80% 0px',
      threshold: 0,
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    const h2Elements = document.querySelectorAll('#case-study-content h2[id]');
    h2Elements.forEach((el) => observer.observe(el));

    // Reveal animations
    if (sr) {
      const fastConfig = (delay) => ({ ...srConfig(delay), duration: 400 });
      sr.reveal('.back-link-reveal', fastConfig(0));
      sr.reveal('.banner-reveal', fastConfig(100));
      sr.reveal('.toc-reveal', fastConfig(200));
      sr.reveal('#case-study-content > *', fastConfig(300));
      sr.reveal('.other-work-reveal', fastConfig(400));
    }

    const handleKeyDown = (e) => {
      if (!lightbox.isOpen) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeLightbox();
    };

    document.documentElement.style.scrollBehavior = 'smooth';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      h2Elements.forEach((el) => observer.unobserve(el));
      window.removeEventListener('keydown', handleKeyDown);
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, [lightbox.isOpen, html]);

  useEffect(() => {
    // Collect all images for the gallery
    const contentImgs = Array.from(document.querySelectorAll('#case-study-content img'));
    const bannerImg = document.querySelector('.banner-img');
    const allGalleryImages = [];
    
    if (bannerImg) allGalleryImages.push(bannerImg.src);
    contentImgs.forEach(img => allGalleryImages.push(img.src));

    // Attach listeners
    if (bannerImg) {
      bannerImg.style.cursor = 'zoom-in';
      bannerImg.onclick = () => openLightbox(0, allGalleryImages);
    }

    contentImgs.forEach((img, i) => {
      img.style.cursor = 'zoom-in';
      const galleryIdx = bannerImg ? i + 1 : i;
      img.onclick = () => openLightbox(galleryIdx, allGalleryImages);
    });
  }, [html, frontmatter.banner]);



  // Removed old reveal useEffect as it's merged into the main one above

  return (
    <Layout location={location} hideSocialAndEmail={true}>
      <StyledBackContainer className="back-link-reveal">
        <StyledBackLink to="/">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Portfolio
        </StyledBackLink>
      </StyledBackContainer>

      {frontmatter.banner && (
        <StyledBanner className="banner-reveal">
          <img 
            src={`${frontmatter.banner}${frontmatter.banner.includes('?') ? '&' : '?'}t=${new Date().getTime()}`} 
            alt={frontmatter.title} 
            className="banner-img" 
          />
        </StyledBanner>
      )}
      <StyledCaseStudyContainer hasTOC={frontmatter.tocEnabled && frontmatter.tocItems && frontmatter.tocItems.length > 0}>
        
        {frontmatter.tocEnabled && frontmatter.tocItems && frontmatter.tocItems.length > 0 && (
          <StyledTOC className="toc-reveal">
            <ul>
              {frontmatter.tocItems.map((item, idx) => (
                <li key={idx}>
                  <a 
                    href={`#${item.anchor}`} 
                    className={activeSection === item.anchor ? 'active' : ''}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </StyledTOC>
        )}

        <StyledContentArea>
          <StyledHero>
            <h1>{frontmatter.title}</h1>
            {frontmatter.summary && (
              <p className="summary">{frontmatter.summary}</p>
            )}
          </StyledHero>

          {(frontmatter.role || frontmatter.results || frontmatter.methods) && (
            <StyledMetadataRow>
              <div className="meta-item">
                <h3>Role & Timeline</h3>
                <div dangerouslySetInnerHTML={{ __html: frontmatter.role ? frontmatter.role.replace(/\n/g, '<br/>') : 'N/A' }} />
              </div>
              <div className="meta-item">
                <h3>Key Results</h3>
                <div dangerouslySetInnerHTML={{ __html: frontmatter.results ? frontmatter.results.replace(/\n/g, '<br/>') : 'N/A' }} />
              </div>
              <div className="meta-item">
                <h3>Methods</h3>
                <div dangerouslySetInnerHTML={{ __html: frontmatter.methods ? frontmatter.methods.replace(/\n/g, '<br/>') : 'N/A' }} />
              </div>
            </StyledMetadataRow>
          )}

          <div
            id="case-study-content"
            className="content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </StyledContentArea>
      </StyledCaseStudyContainer>

      {otherProjects.length > 0 && (
        <StyledOtherWorkSection className="other-work-reveal">
          <h2>Other Work</h2>
          <StyledOtherWorkGrid>
            {otherProjects.map(({ node }, i) => {
              const { frontmatter } = node;
              const { title, summary, cover, slug, role } = frontmatter;
              const imageSrc = cover?.publicURL || '';
              return (
                <StyledWorkCard key={i} href={`/case-study/${slug}`}>
                  <div className="card-image">
                    {imageSrc && <img src={imageSrc} alt={title} />}
                  </div>
                  <div className="card-content">
                    <h3>{title}</h3>
                    <p>{role || summary || 'View project details'}</p>
                  </div>
                </StyledWorkCard>
              );
            })}
          </StyledOtherWorkGrid>
        </StyledOtherWorkSection>
      )}

      {lightbox.isOpen && (
        <StyledLightbox onClick={closeLightbox}>
          <button className="close-btn" onClick={closeLightbox}>&times;</button>
          
          <button className="nav-btn prev-btn" onClick={prevImage}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          
          <div className="lightbox-content">
            <img src={lightbox.images[lightbox.currentIdx]} alt="Fullscreen preview" onClick={(e) => e.stopPropagation()} />
          </div>

          <button className="nav-btn next-btn" onClick={nextImage}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
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
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date
        summary
        role
        results
        methods
        banner
        tocEnabled
        slug
        tocItems {
          text
          anchor
        }
      }
    }
    featured: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/featured/" } }
    ) {
      edges {
        node {
          frontmatter {
            title
            slug
            cover {
              publicURL
            }
            summary
            role
          }
        }
      }
    }
  }
`;
