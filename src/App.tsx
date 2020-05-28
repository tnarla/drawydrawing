import React from "react";
import "./App.css";
import Header from "./ui/view/header/header-view";
import { Content } from "./App-style";
import Sidebar from "./ui/view/sidebar/sidebar-view";
import Canvas from "./ui/view/canvas/canvas-view";

function App() {
  return (
    <div className="App">
      <Header></Header>
      <Content>
        <Sidebar />
        <Canvas />
      </Content>
    </div>
  );
}

export default App;
