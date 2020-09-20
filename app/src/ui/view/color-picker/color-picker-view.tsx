import { observer } from "mobx-react";
import React from "react";
import { store } from "../../../models/store";

class ColorPicker extends React.PureComponent<{}> {
  render() {
    const colors = [
      "#f94144",
      "#f3722c",
      "#f8961e",
      "#f9c74f",
      "#90be6d",
      "#43aa8b",
      "#577590",
      "#A163F5",
      "#774936",
      "#011627",
      "#fdfffc",
    ];

    return (
      <div className="absolute z-10 bottom-0 flex space-x-1 p-6 cursor-pointer">
        {colors.map((color) => (
          <div
            className={`p-1 rounded-full  border-4 opacity-75 hover:opacity-100 transition duration-150 ${
              store.pen.color === color
                ? "border-indigo-600 opacity-100"
                : "border-transparent"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full `}
              onClick={() => store.pen.setColor(color)}
              style={{ backgroundColor: color }}
            ></div>
          </div>
        ))}
      </div>
    );
  }
}

export default observer(ColorPicker);
