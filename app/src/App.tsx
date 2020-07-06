import React, { useState, useEffect } from "react";
import "./App.css";
import { Content } from "./App-style";
import Sidebar from "./ui/view/sidebar/sidebar-view";
import Canvas from "./ui/view/canvas/canvas-view";
import * as shortid from "shortid";
import {useRoutes, useNavigate} from "itsy-bitsy-router";


// get a random shortid


//




// they pass in a random short id

function App() {
  const [penColor, setPenColor] = useState<string>("#f94144");
  const [penSize, setPenSize] = useState<number>(5);
  const navigate = useNavigate();

  const content = ( <Content>
    <Sidebar
      setColor={setPenColor}
      setSize={setPenSize}
      penColor={penColor}
    />
    <Canvas penColor={penColor} penSize={penSize} />
  </Content>);

  const Router = useRoutes(
    [
      { path: "/:shortId", element: content},
    ],
    <p>404</p>
  );
  const shortId = shortid.generate();
  navigate(`/${shortId}`);

  return (
    <Router render={({ children }) => (<div className="App">
      {children}
  </div>)} />
    
  );
}

export default App;
