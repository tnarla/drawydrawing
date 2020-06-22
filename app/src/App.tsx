import React, { useState, useEffect } from "react";
import "./App.css";
import { Content } from "./App-style";
import Sidebar from "./ui/view/sidebar/sidebar-view";
import Canvas from "./ui/view/canvas/canvas-view";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:5000";

function App() {
  const [penColor, setPenColor] = useState<string>("#f94144");
  const [penSize, setPenSize] = useState<number>(5);
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("update", (data: any) => {
      setResponse(data);
    });
  }, []);

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
