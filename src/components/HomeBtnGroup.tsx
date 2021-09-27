import React, { FC } from 'react';
import styled from 'styled-components';
import { themeColor } from '../theme';

const StyledContainer = styled.div`
  color: ${themeColor.white};
  padding: 20px;
  margin: 5px;
  width: 20vw;
  border: 1px solid #00000000;
  border-radius: 4px;
  .title {
    font-size: 22px;
    font-weight: bold;
    margin: 10px 0;
  }

  :hover {
    cursor: pointer;
    background-color: ${themeColor.darkOrange};
    border: 1px solid #ff9975;
  }
`;

const StyledButton = styled.div`
  margin: 10px 20px;
  padding: 5px;
  border: 1px solid currentColor;
  border-radius: 15px;
  background-color: ${themeColor.lightOrange};
`;

export interface HomeBtnGroupProps {
  iconUrl: string;
  gotoUrl: string;
  title: string;
  description: string;
}

const HomeBtnGroup: FC<HomeBtnGroupProps> = ({
  iconUrl, gotoUrl, title, description,
}: HomeBtnGroupProps) => {
  const goto = () => {
    console.log(`goto! ${gotoUrl}`);
  };

  goto();
  return (
    <StyledContainer>
      <img src={iconUrl} alt={title} />
      <div className="title">{title}</div>
      <div className="description">{description}</div>
      <StyledButton>
        Check
      </StyledButton>
    </StyledContainer>
  );
};

export default HomeBtnGroup;
