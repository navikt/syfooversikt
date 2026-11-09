import React, { ReactNode } from "react";
import { defaultErrorTexts } from "@/api/errors";
import { LocalAlert } from "@navikt/ds-react";

interface Props {
  children: ReactNode;
}

type State = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex justify-center">
          <div className="flex flex-col w-[50rem] m-8">
            <LocalAlert status="error">
              <LocalAlert.Header>
                <LocalAlert.Title>
                  {defaultErrorTexts.generalError}
                </LocalAlert.Title>
              </LocalAlert.Header>
            </LocalAlert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
