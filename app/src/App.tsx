import React, { useState, useEffect } from "react";
import "./App.css";
import { Content } from "./App-style";
import Sidebar from "./ui/view/sidebar/sidebar-view";
import Canvas from "./ui/view/canvas/canvas-view";


function App() {
  const [penColor, setPenColor] = useState<string>("#f94144");
  const [penSize, setPenSize] = useState<number>(5);

  return (
    <div className="App">
      <Content>
        <Sidebar
          setColor={setPenColor}
          setSize={setPenSize}
          penColor={penColor}
        />
        <Canvas penColor={penColor} penSize={penSize} />
      </Content>
    </div>
  );
}

export default App;
