import React from "react";
import { Content } from "./App-style";
import Sidebar from "./ui/view/sidebar/sidebar-view";
import Canvas from "./ui/view/canvas/canvas-view";
import { BrowserRouter as Router, Route } from "react-router-dom";

type Props = {};
type State = {
  penColor: string;
  penSize: number;
};

class App extends React.Component<Props, State> {
  state: State = {
    penColor: "#f94144",
    penSize: 5,
  };

  setPenColor = (penColor: string) => {
    this.setState({
      penColor,
    });
  };

  setPenSize = (penSize: number) => {
    this.setState({
      penSize,
    });
  };

  render() {
    // check url param

    return (
      <Router>
        <Route path="/:shortId?">
          <Content>
            <Sidebar
              setColor={this.setPenColor}
              setSize={this.setPenSize}
              penColor={this.state.penColor}
            />

            <Canvas
              penColor={this.state.penColor}
              penSize={this.state.penSize}
            />
          </Content>
        </Route>
      </Router>
    );
  }
}

export default App;
