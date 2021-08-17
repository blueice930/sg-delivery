import { CircularProgress } from '@material-ui/core';
import React from 'react';
import theme from 'src/theme';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .loading {
    font-size: 30px;
    color: ${theme.dark};
    margin: 15px;
  }
`;

const Loading = () => {
  const abc = 123;
  return (
    <Container>
      <CircularProgress size={50} />
      <div className="loading">
        Loading
      </div>
    </Container>
  );
};

export default Loading;
