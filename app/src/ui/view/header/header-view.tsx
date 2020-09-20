import React from "react";
import { HeaderContainer } from "./header-view-style";

interface Props {}

export default function Header(props: Props) {
  return (
    <div className="absolute z-10 right-0 flex space-x-2 p-6">
      <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
        Create a room
      </button>
      <button className="bg-transparent hover:bg-indigo-500 text-indigo-700 font-semibold hover:text-white py-2 px-4 border border-indigo-500 hover:border-transparent rounded">
        Join a room
      </button>
    </div>
  );
}
