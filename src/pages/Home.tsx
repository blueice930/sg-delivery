import React from 'react';
import styled from 'styled-components';

import { themeColor } from 'src/theme';
import HomeFooter from 'src/components/HomeFooter';
import HomeBtnGroup from 'src/components/HomeBtnGroup';
import Banner1 from 'src/assets/home-banner.jpeg';
import Icon1 from 'src/assets/icon1.png';
import Background from 'src/assets/bg.jpeg';

const Container = styled.div`
  width: 100vw;

  img.banner1 {
    width: 100%;
  }
`;

const StyledContainer = styled.div`
  padding: 20px;
  background-color: ${themeColor.orange};
  display: flex;
  justify-content: space-between;
`;
const StyledBgContainer = styled.div`
  background: url(${Background}) repeat left top;
  padding: 20px 0;

  .why-choose-us {
    width:  100%;
    background: #000000AA;
    padding: 20px 0;

    .title {
      color: ${themeColor.white};
      font-size: 30px;
    }
  }
`;

const Home = () => (
  <Container>
    <img className="banner1" alt="banner1" src={Banner1} />
    <StyledContainer>
      <HomeBtnGroup
        iconUrl={Icon1}
        title="My Account"
        description="Register & Order"
        gotoUrl="/"
      />
      <HomeBtnGroup
        iconUrl={Icon1}
        title="Delivery Process"
        description="Register & Order"
        gotoUrl="/"
      />
      <HomeBtnGroup
        iconUrl={Icon1}
        title="Price"
        description="Register & Order"
        gotoUrl="/"
      />
      <HomeBtnGroup
        iconUrl={Icon1}
        title="Shopping"
        description="Register & Order"
        gotoUrl="/"
      />
    </StyledContainer>
    <StyledBgContainer>
      {/* intro video */}
      <iframe width="560" height="315" src="https://www.youtube.com/embed/oQX39Q3Lazs" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />

      <div className="why-choose-us">
        <div className="title">Why Choose Us?</div>

      </div>
    </StyledBgContainer>
    <HomeFooter />
  </Container>

);

export default Home;
