import React, { useState, useCallback } from "react";
import {
  SidebarContainer,
  SidebarContent,
  SidebarAction as SidebarActionContainer,
} from "./sidebar-view-style";

export type SidebarAction = "color" | "draw" | "erase" | undefined;

export default function Sidebar() {
  const [selectedAction, setSelectedAction] = useState<SidebarAction>(
    undefined
  );

  return (
    <SidebarContainer>
      <SidebarContent>
        <SidebarActionContainer
          selected={selectedAction === "color"}
          onClick={useCallback(() => {
            setSelectedAction("color");
          }, [selectedAction])}
        >
          🎨
        </SidebarActionContainer>
        <SidebarActionContainer
          selected={selectedAction === "draw"}
          onClick={useCallback(() => {
            setSelectedAction("draw");
          }, [selectedAction])}
        >
          ✨
        </SidebarActionContainer>
        <SidebarActionContainer
          selected={selectedAction === "erase"}
          onClick={useCallback(() => {
            setSelectedAction("erase");
          }, [selectedAction])}
        >
          👌
        </SidebarActionContainer>
      </SidebarContent>
    </SidebarContainer>
  );
}
