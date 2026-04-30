import * as React from 'react';
import { Knapp, KnappBaseProps } from 'nav-frontend-knapper';
import { ReactElement } from 'react';

interface DropdownButtonProps extends KnappBaseProps {
  classNameElement: string;
  text: string;
}

export const DropdownButton = (props: DropdownButtonProps): ReactElement => {
  return (
    <Knapp
      className={`confirmVeilederButton__${props.classNameElement}`}
      type={props.type}
      onClick={props.onClick}
      mini
    >
      {props.text}
    </Knapp>
  );
};
