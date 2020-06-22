import React from "react";
import { HeaderContainer } from "./header-view-style";

interface Props {}

export default function Header(props: Props) {
  return (
    <HeaderContainer>
      <div style={{ fontSize: 48 }}>pizazzo 🎨</div>
      <div>OOO</div>
    </HeaderContainer>
  );
}
