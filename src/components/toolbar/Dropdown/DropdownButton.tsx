import * as React from 'react';
import styled from 'styled-components';
import KnappBase, { KnappBaseProps } from 'nav-frontend-knapper';

interface DropdownButtonProps extends KnappBaseProps {
  classNameElement: string;
  text: string;
}

const DropdownButton = (props: DropdownButtonProps) => {
  return (
    <KnappBase
      className={`confirmVeilederButton__${props.classNameElement}`}
      type={props.type}
      onClick={props.onClick}
      mini
    >
      {props.text}
    </KnappBase>
  );
};

export default DropdownButton;
