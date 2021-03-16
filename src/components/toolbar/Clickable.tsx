import React, { ReactElement } from 'react';
import styled from 'styled-components';
import themes from '../../styles/themes';

const ClickableStyled = styled.span`
  color: ${(props) =>
    props.className === 'active' ? themes.color.deepBlue : themes.color.navBla};
  font-weight: ${(props) => (props.className === 'active' ? 'bold' : 'normal')};
  cursor: ${(props) => (props.className === 'active' ? 'normal' : 'pointer')};
`;

const Clickable = (props: {
  index: number;
  setPage: (page: number) => void;
  currentPage: number;
}): ReactElement => {
  const isActive = props.index === props.currentPage ? 'active' : undefined;

  const page = props.index + 1;
  return (
    <ClickableStyled
      className={isActive}
      onClick={() => {
        props.setPage(props.index);
      }}
    >
      {page}
    </ClickableStyled>
  );
};

export default Clickable;
