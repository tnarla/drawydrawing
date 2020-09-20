import React from "react";
import Canvas from "./ui/view/canvas/canvas-view";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./ui/view/header/header-view";
import ColorPicker from "./ui/view/color-picker/color-picker-view";

type Props = {};

class App extends React.Component<Props> {
  render() {
    // check url param

    return (
      <Router>
        <Route path="/:shortId?">
          <div className="h-full">
            <Header />
            <ColorPicker />

            <Canvas />
          </div>
        </Route>
      </Router>
    );
  }
}

export default App;
