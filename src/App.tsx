import React, { useState } from "react";
import "./App.css";
import Header from "./ui/view/header/header-view";
import { Content } from "./App-style";
import Sidebar from "./ui/view/sidebar/sidebar-view";
import Canvas from "./ui/view/canvas/canvas-view";

function App() {
  const [penColor, setPenColor] = useState<string>("#f94144");

  function setColor(color: string) {
    setPenColor(color);
  }

  return (
    <div className="App">
      <Content>
        <Sidebar setColor={setColor} />
        <Canvas penColor={penColor} />
      </Content>
    </div>
  );
}

export default App;
