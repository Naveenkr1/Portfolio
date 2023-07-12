import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, Hero, About, Jobs, Featured, Projects, Contact, naveen } from '@components';
import CaseStudy from './case-study';
import './CustomCursor.css';
import './pointer.css';


const StyledMainContainer = styled.main`
  counter-reset: section;
`;


const IndexPage = ({ location }) => (
  <Layout location={location}>
    <StyledMainContainer className="fillHeight">
      <Hero />
      <About />
      <Featured />
      { <Jobs /> }
      {<Projects /> }      
      <Contact />
    </StyledMainContainer>
  </Layout>
);

IndexPage.propTypes = {
  location: PropTypes.object.isRequired,
};


function App() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    setCursorPosition({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div>
      {/* Rest of your component */}
      <div
        className="custom-cursor"
        style={{ transform: `translate3d(${cursorPosition.x}px, ${cursorPosition.y}px, 0)` }}
      />
    </div>
  );
}


export default IndexPage;
