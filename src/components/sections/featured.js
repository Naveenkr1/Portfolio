import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

// import GifVideo from '../../../video';

// import iotterGIF from '../../../static/igif.gif'
// import (GifVideo)

const StyledProjectsGrid = styled.ul`
  ${({ theme }) => theme.mixins.resetList};
    margin-top: 80px;

  a {
    position: relative;
    z-index: 1;
  }
`;

const StyledProject = styled.li`
  position: relative;
  display: flex;
  flex-direction: row-reverse;
  gap: 10px;
  padding: 1rem;
  border-radius: 5px;
  align-items: center;
  border: solid 1px #45B09F;
  &:hover
  {
    background: rgba(69, 176, 159, 0.14);
  }

  @media (max-width: 768px) {
    border: none;
    flex-direction: column-reverse;
    padding: 0;
  }


    margin-bottom: 50px;
    @media (max-width: 768px) {
      margin-bottom: 50px;
    }

    @media (max-width: 480px) {
      margin-bottom: 50px;
    }
  

 
    .project-links {
      justify-content: flex-end;
      margin-left: 0;
      margin-right: -10px;

      @media (max-width: 768px) {
        justify-content: flex-start;
        margin-left: -10px;
        margin-right: 0;
      }
    }
    .project-image {

      @media (max-width: 768px) {
      }
    }
  }



  .project-content {
    margin-left: 1.7rem;
    position: relative;
    @media (max-width: 1080px) {
    }
    
    @media (max-width: 768px) {
      width: 100%;
      box-shadow: none;
      display: flex; 
      justify-content: space-between;
      align-items: center;
      margin-left: 0;
      z-index: 5;
    }
  }

  .project-overline {
    margin: 10px 0;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    font-weight: 400;

    @media (max-width: 768px) {
      display: none;
  }
}

  .project-title {
    color: var(--lightest-slate);
    font-size: clamp(24px, 5vw, 28px);

    @media (min-width: 768px) {
     
    }

    @media (max-width: 768px) {
      color: var(--white);
      font-size: 20px;
      margin-top: 10px;
      margin-bottom: 10px;

      a {
        position: static;

        &:before {
          content: '';
          display: block;
          position: absolute;
          z-index: 0;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
      }
    }
  }

  .project-type{
    margin-top: -5px;
    margin-bottom: 20px;

    @media (max-width: 768px) {
      margin-top: 3px;
      margin-bottom: 0;
      font-size: 14px;
    }
  }
  .project-study {
    margin-top: 20px;
    color: var(--green);
    background-color: transparent;
    border: 1px solid var(--green);
    border-radius: var(--border-radius);
    padding: 0.75rem 1rem;
    font-size: var(--fz-xs);
    font-family: var(--font-mono);
    line-height: 1;
    text-decoration: none;
    cursor: pointer;
    transition: var(--transition);
    &:hover,
    &:focus,
    &:active {
      background-color: var(--green-tint);
      outline: none;
    }
    &:after {
      display: none !important;
    }
    font-size: var(--fz-xs);

    @media (max-width: 768px){
      display: none;
      margin-top: 0;
      font-size: 12px !important;
      padding: 0.5rem .9rem;
      margin-left: 20px;
    }
  }

  .project-description {
    position: relative;
    z-index: 2;
    color: var(--light-slate);
    font-size: var(--fz-lg);
    padding-right: 20px;
    text-align: justify;
    
    box-shadow:none;
    &:hover {
      box-shadow: none;
    }

    @media (max-width: 768px) {
      display: none;
      padding: 20px 0;
      background-color: transparent;
      box-shadow: none;
      text-align: justify;

      &:hover {
        box-shadow: none;
      }
    }

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }

    strong {
      color: var(--white);
      font-weight: normal;
    }
  }

  .project-tech-list {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    z-index: 2;
    margin: 25px 0 10px;
    padding: 0;
    list-style: none;

    li {
      margin: 0 20px 5px 0;
      color: var(--light-slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      white-space: nowrap;
    }

    @media (max-width: 768px) {
      margin: 10px 0;

      li {
        margin: 0 10px 5px 0;
        color: var(--lightest-slate);
      }
    }
  }

  .project-links {
    display: flex;
    align-items: center;
    position: relative;
    margin-top: 10px;
    margin-left: -10px;
    color: var(--lightest-slate);

    a {
      ${({ theme }) => theme.mixins.flexCenter};
      padding: 10px;

      &.external {
        svg {
          width: 22px;
          height: 22px;
          margin-top: -4px;
        }
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }

    .cta {
      ${({ theme }) => theme.mixins.smallButton};
      margin: 10px;
    }
  }

  .project-image {
    ${({ theme }) => theme.mixins.boxShadow};
    grid-column: 6 / -1;
    grid-row: 1 / -1;
    position: relative;
    z-index: 1;



    @media (max-width: 768px) {
      grid-column: 1 / -1;
      height: 100%;
      opacity: 1;
      box-shadow: none;
      border: 1px solid #45B09F;
      padding: .6rem;
      border-radius: 5px;;
    }

    a {
      width: 100%;
      height: 100%;
      background-color: var(--green);
      border-radius: var(--border-radius);
      vertical-align: middle;

      @media (max-width: 768px) {
        background-color: transparent;
        border-radius: 5px;
      }

      @media (min-width: 768px) {
        &:hover,
      &:focus {
        background: transparent;
        outline: 0;

        &:before,
        .img {
          background: transparent;
          filter: none;
        }
      }

      &:before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 3;
        transition: var(--transition);
        background-color: var(--navy);
        mix-blend-mode: screen;
      }
        
      }
    }

    .img {
      width: 30rem;
      height: 20rem;
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1) brightness(90%);

      @media (max-width: 957px) {
        width: 20rem;
        height: 13rem;
      }

      @media (max-width: 768px) {
        object-fit: cover;
        width: auto;
        height: 100%;
        filter: none;
        mix-blend-mode: normal;
      }
    }
  }
`;

const Featured = () => {
  const data = useStaticQuery(graphql`
    {
      featured: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/featured/" } }
        sort: { fields: [frontmatter___date], order: ASC }
      ) {
        edges {
          node {
            frontmatter {
              title
              cover {
                childImageSharp {
                  gatsbyImageData(width: 700, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
                }
              }
              tech
              github
              external
              cta
            }
            html
          }
        }
      }
    }
  `);

  const featuredProjects = data.featured.edges.filter(({ node }) => node);
  const revealTitle = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  return (
    <section id="projects">
      <h2 className="numbered-heading" ref={revealTitle}>
        Featured Work
      </h2>

      <StyledProjectsGrid>
        {featuredProjects &&
          featuredProjects.map(({ node }, i) => {
            const { frontmatter, html } = node;
            const { external, title, tech, github, cover, cta } = frontmatter;
            const image = getImage(cover);

            return (
              <StyledProject key={i} ref={el => (revealProjects.current[i] = el)}>
                <div className="project-content">
                  <div>
                    <p className="project-overline">Featured Project</p>

                    <h3 className="project-title">
                      <a href={external}>{title}</a>
                    </h3>

                    <p className="project-type">UI/UX Designer</p>

                    <div
                      className="project-description"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  </div>
                  <a href={external ? external : github ? github : '#'}>
                  <button className='project-study'>View Case Study</button>
                  </a>
                </div>

                <div className="project-image">
                  <a href={external ? external : github ? github : '#'}>
                    { <GatsbyImage image={image} alt={title} className="img"  />}
                    {/* <img src={image} alt="Otter dancing with a fish" /> */}

                  
                    
                  </a>
                </div>
              </StyledProject>
            );
          })}
      </StyledProjectsGrid>
    </section>
  );
};

export default Featured;
