import React, { useState, useEffect } from "react";
import "./App.css";
import { Content } from "./App-style";
import Sidebar from "./ui/view/sidebar/sidebar-view";
import Canvas from "./ui/view/canvas/canvas-view";

import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  const [penColor, setPenColor] = useState<string>("#f94144");
  const [penSize, setPenSize] = useState<number>(5);

  // check url param

  return (
    <Router>
      <Route path="/:shortId?">
        <Content>
          <Sidebar
            setColor={setPenColor}
            setSize={setPenSize}
            penColor={penColor}
          />

          <Canvas penColor={penColor} penSize={penSize} />
        </Content>
      </Route>
    </Router>
  );
}

export default App;
