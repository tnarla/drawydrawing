import React, { useState, useCallback } from "react";
import { SidebarModalContainer } from "./sidebar-modal-style";

interface Props {
  readonly children?: React.ReactNode;
  readonly show: boolean;
  readonly top: number;
}

export default function SidebarModal(props: Props) {
  const { show, top, children } = props;
  const [showModal, setShowModal] = useState<boolean>(false);

  const finalShow = show || showModal;

  return (
    <SidebarModalContainer
      onMouseOver={useCallback(() => {
        setShowModal(true);
      }, [showModal])}
      show={finalShow}
      top={top}
    >
      {children}
    </SidebarModalContainer>
  );
}
