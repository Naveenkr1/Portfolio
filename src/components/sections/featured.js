import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';
// import CaseStudy from '../../pages/case-study';

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
  gap: 30px;
  padding: 16px;
  border-radius: 5px;
  align-items: center;
  border: solid 1px #45B09F;
  margin-bottom: 100px;

  &:hover {
    background: rgba(69, 176, 159, 0.05);
  }

  @media (max-width: 1080px) {
    gap: 20px;
    padding: 1.5rem;
  }

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    padding: 16px;
    border: solid 1px #45B09F;
    background: rgba(2, 12, 27, 0.4) !important;
    margin-bottom: 50px;
  }

  .project-content {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media (max-width: 768px) {
      width: 100%;
      padding: 10px 0 0 0;
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

    @media (max-width: 768px) {
      color: var(--white);
      font-size: 20px;
      margin-top: 5px;
      margin-bottom: 0;
    }
  }

  .project-type {
    margin-top: -5px;
    margin-bottom: 20px;

    @media (max-width: 768px) {
      display: none;
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

    @media (max-width: 768px) {
      display: none;
    }
  }

  .project-description {
    position: relative;
    z-index: 2;
    color: var(--light-slate);
    font-size: var(--fz-lg);
    padding-right: 20px;
    text-align: justify;
    box-shadow: none;

    &:hover {
      box-shadow: none;
    }

    @media (max-width: 768px) {
      display: none;
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
    margin: 10px 0 20px;
    padding: 0;
    list-style: none;

    li {
      margin: 0 20px 5px 0;
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      white-space: nowrap;
    }

    @media (max-width: 768px) {
      display: none;
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

      svg {
        width: 20px;
        height: 20px;
      }
    }

    @media (max-width: 768px) {
      display: none;
    }
  }

  .project-image {
    flex: 1.3;
    position: relative;
    z-index: 1;
    border-radius: 4px;
    overflow: hidden;

    @media (max-width: 768px) {
      width: 100%;
    }

    a {
      display: block;
      width: 100%;
      height: 100%;
      background-color: var(--green);
      border-radius: var(--border-radius);
      vertical-align: middle;
      transition: var(--transition);

      @media (max-width: 768px) {
        background-color: transparent;
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
      width: 100%;
      height: auto;
      display: block;
      border-radius: 4px;
      object-fit: cover;
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1) brightness(90%);
      transition: var(--transition);

      &.is-gif {
        mix-blend-mode: normal !important;
        filter: none !important;
      }

      @media (max-width: 957px) {
        width: 100%;
        height: auto;
        aspect-ratio: 3 / 2;
      }

      @media (max-width: 768px) {
        object-fit: cover;
        width: 100%;
        height: auto;
        aspect-ratio: 3 / 2;
        filter: none !important;
        mix-blend-mode: normal !important;
      }
    }
  }
`;

const Featured = () => {
  const data = useStaticQuery(graphql`
    {
      featured: allMongodbPortfolioProjects(
        filter: { published: { eq: true } }
        sort: { fields: [date], order: ASC }
      ) {
        edges {
          node {
            title
            cover
            tech
            external
            role
            button
            cta
            description
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
        Selected Work
      </h2>

      <StyledProjectsGrid>
        {featuredProjects &&
          featuredProjects.map(({ node }, i) => {
            const { external, button, role, title, tech, cover, cta, description } = node;
            const isGif = cover && cover.toLowerCase().endsWith('.gif');

            return (
              <StyledProject key={i} ref={el => (revealProjects.current[i] = el)}>
                <div className="project-content">
                  <div>
                    <h3 className="project-title">
                      <a href={external}>{title}</a>
                      {/* <a href="/case-study">{title}</a> */} 
                      {/* I have changed here */}
                    </h3>

                    <ul className="project-tech-list">
                      {tech && tech.map((techItem, idx) => (
                        <li key={idx}>{techItem}</li>
                      ))}
                    </ul>

                    <div
                      className="project-description"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </div>
                 
                  <a href={external}>  {/* I have changed here */}

                  <button className='project-study' >{button}</button>
                  </a>
                </div>

                <div className="project-image">
                  <a href={external}>
                    <img src={cover} alt={title} className={`img ${isGif ? 'is-gif' : ''}`} />
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
