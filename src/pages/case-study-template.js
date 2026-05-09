import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout } from '@components';

const StyledCaseStudyContainer = styled.main`
  width: 100%;
  margin: 0 auto;
  padding: 100px 50px;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 80px;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 80px 25px;
    gap: 40px;
  }
`;

const StyledTOC = styled.aside`
  position: sticky;
  top: 100px;
  height: max-content;
  text-align: left;
  
  @media (max-width: 900px) {
    display: none; /* Hide TOC on smaller screens, or could make it horizontal */
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      margin-bottom: 15px;
      
      a {
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
          left: -20px;
          color: var(--green);
        }
      }
    }
  }
`;

const StyledContentArea = styled.div`
  display: flex;
  flex-direction: column;
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

const StyledSection = styled.section`
  margin-bottom: 80px;
  scroll-margin-top: 100px; /* Offset for sticky nav when linking to section */

  h2 {
    font-size: clamp(24px, 5vw, 32px);
    color: var(--lightest-slate);
    margin-bottom: 30px;
    display: flex;
    align-items: center;

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

  .image-placeholder {
    width: 100%;
    min-height: 300px;
    background-color: var(--light-navy);
    border-radius: var(--border-radius);
    margin: 40px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--green);
    color: var(--light-slate);
    font-family: var(--font-mono);
    text-align: center;
    padding: 20px;
  }
`;

const CaseStudyTemplate = ({ location }) => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 150) {
          current = section.getAttribute('id');
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Layout location={location} hideSocialAndEmail={true}>
      <StyledCaseStudyContainer>
        
        {/* Sticky Table of Contents */}
        <StyledTOC>
          <ul>
            <li><a href="#summary" className={activeSection === 'summary' ? 'active' : ''}>Summary</a></li>
            <li><a href="#discovery" className={activeSection === 'discovery' ? 'active' : ''}>Discovery</a></li>
            <li><a href="#building-mvp" className={activeSection === 'building-mvp' ? 'active' : ''}>Building MVP</a></li>
            <li><a href="#launch-impact" className={activeSection === 'launch-impact' ? 'active' : ''}>Launch & Impact</a></li>
            <li><a href="#next-steps" className={activeSection === 'next-steps' ? 'active' : ''}>Next Steps & Learnings</a></li>
          </ul>
        </StyledTOC>

        <StyledContentArea>
          <StyledHero>
            <h1>Contractbook 2FA</h1>
            <p className="summary">
              I led product design process in a 3-month project to implement two-factor authentication (2FA) on Contractbook. The goal was to enhance user security without sacrificing UX. To achieve this, we chose email 2FA for a faster implementation and quicker value delivery to users.
            </p>
          </StyledHero>

          <StyledMetadataRow>
            <div className="meta-item">
              <h3>Role & Timeline</h3>
              <p>Product Designer & Researcher<br/>July 2022 - September 2022</p>
            </div>
            <div className="meta-item">
              <h3>Key Results</h3>
              <p>Enabled 2FA for all users<br/>75% 2FA health ratio<br/>Closed the gap to competitors</p>
            </div>
            <div className="meta-item">
              <h3>Methods</h3>
              <p>User Research, User Journey Mapping, Competitive Analysis, Design Audit, Visual design, Prototyping, Testing</p>
            </div>
          </StyledMetadataRow>

          <StyledSection id="summary">
            <h2>Summary</h2>
            <p>
              I was part of a crucial team tasked with closing the gap between our competition and us for Contractbook, a cloud-based contract lifecycle management software for small to medium-sized businesses. As the Product Designer, I led the product design process for adding a two-factor authentication (2FA) feature to the platform. Our challenge was to enhance security while improving user experience and reducing friction during the login process.
            </p>
            <div className="image-placeholder">Final Results Preview Placeholder</div>
          </StyledSection>

          <StyledSection id="discovery">
            <h2>Discovery</h2>
            
            <h3>Ticket Analysis</h3>
            <p>
              As a Product Designer, I implemented Two-Factor Authentication (2FA) for our platform. To understand users' needs for 2FA, I analyzed HubSpot service tickets and found few mentioned not adopting Contractbook due to a lack of 2FA and security regulations. To gather more data, I sought ways to understand user needs.
            </p>

            <h3>Competitive analysis</h3>
            <p>
              I conducted a competitive analysis to identify commonalities among competitors and gather valuable insights for building our product. This research allowed us to differentiate ourselves and provided a basis for product development.
            </p>
            <div className="image-placeholder">Notes in FigJam from competitive analysis session</div>

            <h3>User Interviews</h3>
            <p>
              We used Pendo to recruit current Contractbook customers for interviews about their 2FA experience. After users clicked 'interested' on the modal, I sent them a screening email to confirm if they were a good fit for an interview.
            </p>
            <p>Example screening questions:</p>
            <ul>
              <li>Does your company have a security policy related to 2FA?</li>
              <li>Which method of 2FA is your company using the most? Have you had any problems with it?</li>
            </ul>
            <p>
              Then, I conducted problem discovery interviews with the users who passed the screening to learn about their experience with 2FA, identify potential opportunities, and learn about their compliance requirements.
            </p>
            <p>Identified opportunities:</p>
            <ul>
              <li>Users believe that "anything is better than nothing" when it comes to 2FA.</li>
              <li>The authenticator app is the most preferred method, but users don't mind using any other method.</li>
            </ul>
          </StyledSection>

          <StyledSection id="building-mvp">
            <h2>Building MVP</h2>

            <h3>User Journey Mapping</h3>
            <p>
              After gathering the initial insights, I led a User Journey Mapping workshop with my team of seven to identify persona, goals, scenarios, and steps for users logging in with 2FA. The workshop helped visualize the process.
            </p>
            <div className="image-placeholder">User Journey Map in FigJam</div>
            <p>
              The outcome of the workshops was opportunities, which helped to identify how the user experience could be optimized. As well as the insights about "What needs to be done? What are the biggest opportunities? How are we going to measure the success?" The workshop was not only important for developing the product, but also benefited the team in having conversations and aligning the team's mental model.
            </p>

            <h3>User flow</h3>
            <p>
              I created a visual user flow to align with the team on feature functionality before designing the interface. This also contributes to a smoother navigation experience, helping users accomplish tasks efficiently.
            </p>
            <div className="image-placeholder">User flow in FigJam</div>

            <p>
              With all the necessary foundations, knowledge, and preparation in place, I began to design the interface for 2FA. We prioritized email 2FA as it's widely used, faster to implement, and all users have verified email on our platform. The design aimed to add security without compromising efficiency and prioritize user-centricity, along with easy error recognition, diagnosis, and recovery.
            </p>

            <h3>Log in screen</h3>
            <p>
              To inform users of the necessary action, I used the header "Check Your Email for the Code". Additionally, I provided contact information as a solution for users who encounter difficulties logging in.
            </p>
            <div className="image-placeholder">Log in screen interface design in Figma</div>

            <h3>Receive and enter verification code</h3>
            <p>
              To prevent email stacking and help users quickly recognize the email with the verification code, I included the Time-based one-time password (TOTP) code in the email header. Additionally, I enlarged the verification code in the email body to make it easier for users to find. However, due to technical limitations, we had to postpone the implementation of a copy function for the code in email for a future iteration.
            </p>
            <div className="image-placeholder">Receive and enter verification code interface design</div>

            <h3>Resend code & Error diagnosis</h3>
            <p>
              To assist users with expired codes or email delivery issues, we added a "Resend Verification Code" button. Clicking this button triggers a new verification code to be sent to the user's email, providing a simple and efficient solution.
            </p>
            <div className="image-placeholder">Error diagnosis interface design</div>

            <h3>Team page</h3>
            <p>
              In addition to the core 2FA feature, we added a feature on the team's page that enables team owners to view the 2FA status of their team members. This feature is important as some companies require all team members to enable 2FA in adherence to their security policies.
            </p>
          </StyledSection>

          <StyledSection id="launch-impact">
            <h2>Two-stage Launch & Impact</h2>
            
            <p>
              After designing the interface for 2FA, my PM and I decided to divide our feature release into two phases: a Sample Rollout to a smaller group of users, followed by a General Availability launch to all Contractbook users. This approach allowed us to gather feedback and address any issues before releasing the feature to all users, ensuring the success of our MVP and delivering business value quickly.
            </p>
            <div className="image-placeholder">Launch planning</div>

            <p>
              After the General Availability launch of 2FA, we utilized Hotjar recordings and Metabase data to track and address any usability issues, ensuring the achievement of our business goal. With a 2FA health ratio of 75%, we were able to calculate the number of 2FA codes required to log in to Contractbook's platform. Users who require more codes have shared accounts, which make it more challenging to receive the code in their email. Overall, the project was a success.
            </p>
          </StyledSection>

          <StyledSection id="next-steps">
            <h2>Next Steps & Learnings</h2>

            <p>
              Looking ahead, we also continued to think about ways to improve the user experience, such as adding additional 2FA options e.g., an authenticator app or SMS.
            </p>

            <h3>Reflection</h3>
            <p>
              The main challenge for this project was debating and discussing 'which 2FA method is the best?' As the sole designer, I kept an open mind but had to prioritize features that could deliver value and impact for both the user and company within the given timeframe.
            </p>
            <p>
              The biggest lesson learned was the importance of a User Journey Map. It uncovers problematic and opportunistic points early on, providing a basis and visual aid for effective collaboration among all stakeholders throughout the process.
            </p>
          </StyledSection>

        </StyledContentArea>
      </StyledCaseStudyContainer>
    </Layout>
  );
};

CaseStudyTemplate.propTypes = {
  location: PropTypes.object.isRequired,
};

export default CaseStudyTemplate;
