import React from 'react';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Layout } from '@components';
import { Icon } from '@components/icons';

const StyledAIPlayContainer = styled.main`
  padding: 130px 40px 80px;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1080px) {
    padding: 120px 30px 70px;
  }
  @media (max-width: 768px) {
    padding: 100px 24px 60px;
  }
  @media (max-width: 480px) {
    padding: 85px 16px 40px;
  }
`;

const StyledHeader = styled.header`
  margin-bottom: 35px;
  text-align: left;

  .label {
    display: inline-block;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 12px;
    letter-spacing: 0;
    word-spacing: normal;
  }

  .title {
    font-size: clamp(28px, 5vw, 48px);
    font-weight: 700;
    color: var(--lightest-slate);
    line-height: 1.15;
    margin: 0 0 16px;
    letter-spacing: -0.5px;
  }

  .subtext {
    color: var(--slate);
    font-size: clamp(15px, 2vw, 17px);
    line-height: 1.6;
    max-width: 760px;
    margin: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 25px;

    .title {
      font-size: clamp(24px, 6vw, 36px);
      margin-bottom: 12px;
    }

    .subtext {
      font-size: 15px;
      line-height: 1.55;
    }
  }
`;

const SectionHeader = styled.h2`
  display: flex;
  align-items: center;
  position: relative;
  margin: 15px 0 0px;
  width: 100%;
  font-size: clamp(20px, 3.5vw, 24px);
  white-space: nowrap;
  color: var(--lightest-slate);

  &:after {
    content: '';
    display: block;
    position: relative;
    top: -2px;
    flex: 1;
    max-width: 300px;
    height: 1px;
    margin-left: 20px;
    background-color: var(--lightest-navy);

    @media (max-width: 768px) {
      margin-left: 12px;
    }
  }

  @media (max-width: 768px) {
    margin: 10px 0 0px;
    font-size: 20px;
  }
`;

const ProjectsGrid = styled.ul`
  ${({ theme }) => theme.mixins.resetList};
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  margin: 20px 0 70px;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 18px;
    margin: 18px 0 60px;
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
    grid-gap: 16px;
    margin: 16px 0 50px;
  }
`;

const StyledProject = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  height: 100%;
  overflow: hidden;
  box-shadow: 0 10px 30px -15px var(--navy-shadow);

  &:hover {
    transform: translateY(-5px);
    border-color: var(--green);
    box-shadow: 0 20px 30px -15px var(--navy-shadow);
    
    .cover-image-container img {
      transform: scale(1.05);
    }
  }

  .cover-image-container {
    width: 100%;
    height: 200px;
    overflow: hidden;
    position: relative;
    background: var(--dark-navy);
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    @media (max-width: 650px) {
      height: 180px;
    }

    @media (max-width: 480px) {
      height: 170px;
    }
  }

  .project-content {
    padding: 1.25rem 1.25rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    @media (max-width: 480px) {
      padding: 1rem;
    }
  }

  .project-title {
    margin: 0 0 10px;
    color: var(--lightest-slate);
    font-size: var(--fz-xl);
    font-weight: 600;
    
    /* 1 liner */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    a {
      color: inherit;
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

  .project-description {
    color: var(--light-slate);
    font-size: 15px;
    line-height: 1.5;
    flex-grow: 1;
    text-align: left;
    
    /* 2 liner */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;

    p {
      margin: 0;
      display: inline;
    }
  }

  .project-links-footer {
    display: flex;
    gap: 15px;
    margin-top: 15px;
    position: relative;
    z-index: 2;

    a {
      color: var(--light-slate);
      transition: var(--transition);
      display: flex;
      align-items: center;
      justify-content: center;
      
      svg {
        width: 20px;
        height: 20px;
      }
      
      &:hover {
        color: var(--green);
      }
    }
  }

  .project-tech-list {
    display: none;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--lightest-slate);
      background: var(--tech-bg);
      border: 1px solid var(--tech-border);
      padding: 6px 12px;
      border-radius: 20px;
      transition: background 0.2s ease;

      &:hover {
        background: var(--green-tint);
        border-color: var(--green);
        color: var(--green);
      }

      img {
        width: 14px;
        height: 14px;
        filter: var(--tech-img-filter);
        opacity: 0.8;
      }
      
      &:hover img {
        filter: none;
        opacity: 1;
      }
    }
  }
`;

const getTechIconSlug = (name) => {
  const n = name.toLowerCase();
  if (n.includes('react')) return 'react';
  if (n.includes('node')) return 'nodedotjs';
  if (n.includes('python')) return 'python';
  if (n.includes('openai') || n.includes('chatgpt')) return 'openai';
  if (n.includes('langchain')) return 'langchain';
  if (n.includes('tensor')) return 'tensorflow';
  if (n.includes('pytorch')) return 'pytorch';
  if (n.includes('typescript')) return 'typescript';
  if (n.includes('javascript') || n === 'js') return 'javascript';
  if (n.includes('next')) return 'nextdotjs';
  if (n.includes('vue')) return 'vuedotjs';
  if (n.includes('tailwind')) return 'tailwindcss';
  if (n.includes('aws')) return 'amazonaws';
  if (n.includes('docker')) return 'docker';
  if (n.includes('firebase')) return 'firebase';
  if (n.includes('mongo')) return 'mongodb';
  if (n.includes('postgres')) return 'postgresql';
  if (n.includes('vercel')) return 'vercel';
  if (n.includes('html')) return 'html5';
  if (n.includes('css')) return 'css3';
  if (n.includes('git')) return 'git';
  return n.replace(/[^a-z0-9]/g, '');
};

const ProjectCard = ({ node }) => {
  const { frontmatter, html } = node;
  const { github, external, title, tech, coverUrl } = frontmatter;
  
  // Format the cover image URL if it exists
  const imgUrl = coverUrl ? (coverUrl.startsWith('http') ? coverUrl : `/${coverUrl}`) : '/uploads/ai-play-default.png';
  const linkUrl = external || github || '#';

  return (
    <StyledProject>
      <div className="cover-image-container">
        <img src={imgUrl} alt={`${title} cover`} />
      </div>

      <div className="project-content">
        <h3 className="project-title">
          <a href={linkUrl} target="_blank" rel="noreferrer">
            {title}
          </a>
        </h3>
        
        <div className="project-description" dangerouslySetInnerHTML={{ __html: html }} />

        {tech && (
          <ul className="project-tech-list">
            {tech.map((item, i) => (
              <li key={i}>
                <img 
                  src={`https://cdn.simpleicons.org/${getTechIconSlug(item)}`} 
                  alt="" 
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                {item}
              </li>
            ))}
          </ul>
        )}

        {github && external && (
          <div className="project-links-footer">
            <a href={github} target="_blank" rel="noreferrer" aria-label="GitHub Link">
              <Icon name="GitHub" />
            </a>
          </div>
        )}
      </div>
    </StyledProject>
  );
};

const AIPlayPage = ({ location, data }) => {
  const aiProjects = data.aiProjects.edges.filter(({ node }) => node);
  const otherProjects = data.otherProjects.edges.filter(({ node }) => node);

  return (
    <Layout location={location} hideSocialAndEmail={true}>
      <Helmet title="AI Lab" />

      <StyledAIPlayContainer>
        <StyledHeader>
          <span className="label">AI Lab</span>
          <h1 className="title">Building ideas & experiments</h1>
          <p className="subtext">
            These are (a few) of my experiments in code and craft. Even as a design leader, I
            believe the only way to master the medium is to build. This space is dedicated to
            hands-on exploration, using AI to translate ideas into reality.
          </p>
        </StyledHeader>

        <SectionHeader>AI Projects</SectionHeader>
        <ProjectsGrid>
          {aiProjects.map(({ node }, i) => (
            <ProjectCard key={i} node={node} />
          ))}
        </ProjectsGrid>

        <SectionHeader>Other Projects</SectionHeader>
        <ProjectsGrid>
          {otherProjects.map(({ node }, i) => (
            <ProjectCard key={i} node={node} />
          ))}
        </ProjectsGrid>
      </StyledAIPlayContainer>
    </Layout>
  );
};

export default AIPlayPage;

export const pageQuery = graphql`
  query {
    aiProjects: allMarkdownRemark(
      filter: {
        fileAbsolutePath: { regex: "/content/ai-projects/" }
        frontmatter: { showInProjects: { ne: false } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            title
            tech
            github
            external
            coverUrl
          }
          html
        }
      }
    }
    otherProjects: allMarkdownRemark(
      filter: {
        fileAbsolutePath: { regex: "/content/projects/" }
        frontmatter: { showInProjects: { ne: false } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            title
            tech
            github
            external
            coverUrl
          }
          html
        }
      }
    }
  }
`;
