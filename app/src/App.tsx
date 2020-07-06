import React, { useState, useEffect } from "react";
import "./App.css";
import { Content } from "./App-style";
import Sidebar from "./ui/view/sidebar/sidebar-view";
import Canvas from "./ui/view/canvas/canvas-view";
import {useRoutes, useNavigate, useParams} from "itsy-bitsy-router";

function App() {
  const [penColor, setPenColor] = useState<string>("#f94144");
  const [penSize, setPenSize] = useState<number>(5);

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

  // check url param 
  
  return (
    <Router render={({ children }) => (<div className="App">
      {children}
  </div>)} />
    
  );
}

export default App;
