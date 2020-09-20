import React from "react";
import { SidebarModalContainer } from "./sidebar-modal-style";

interface Props {
  readonly children?: React.ReactNode;
  readonly show: boolean;
  readonly top: number;
}
type State = {
  showModal: boolean;
}

export default class SidebarModal extends React.Component<Props, State> {
  state: State = {
    showModal: false,
  };

  render() {
    const { show, top, children } = this.props;
    const finalShow = show || this.state.showModal;

    return (
      <SidebarModalContainer
        onMouseOver={() => {
          this.setState({ showModal: true });
        }}
        show={finalShow}
        top={top}
      >
        {children}
      </SidebarModalContainer>
    );
  }
}
