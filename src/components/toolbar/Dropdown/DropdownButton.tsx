import * as React from 'react';
import KnappBase, { KnappBaseProps } from 'nav-frontend-knapper';
import { ReactElement } from 'react';

interface DropdownButtonProps extends KnappBaseProps {
  classNameElement: string;
  text: string;
}

const DropdownButton = (props: DropdownButtonProps): ReactElement => {
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
