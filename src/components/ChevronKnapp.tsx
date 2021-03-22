import React, { ReactElement } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import Chevron from 'nav-frontend-chevron';
import themes from '../styles/themes';

const ChevronButton = styled.button`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  padding: 0.25em;
  cursor: ${(props) =>
    props.className === 'disabled' ? 'default' : 'pointer'};
`;

const ChevronStyled = styled(Chevron)`
  color: ${(props) =>
    props.className === 'disabled'
      ? `${themes.color.navGra40}`
      : `${themes.color.navBla}`};
`;

interface ChevronKnappProps {
  type?: 'høyre' | 'venstre' | 'opp' | 'ned';
  text?: string;
  disabled: boolean;
  onClick(): void;
}

const ChevronKnapp = ({
  type = 'venstre',
  disabled,
  onClick,
}: ChevronKnappProps): ReactElement => {
  const colorClassname = classNames(disabled ? 'disabled' : 'enabled');

  return (
    <ChevronButton className={colorClassname} onClick={onClick}>
      <ChevronStyled className={colorClassname} type={type} />
    </ChevronButton>
  );
};

export default ChevronKnapp;
