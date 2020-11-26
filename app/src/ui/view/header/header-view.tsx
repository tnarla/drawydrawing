import React, { useState } from "react";
import Create from "../modal/create";
import Join from "../modal/join";
import SocketEvents from "./SocketEvents";

export default function Header() {
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  const onCreateRoomClick = () => {
    setCreateOpen(true);
  };

  const onJoinRoomClick = () => {
    setJoinOpen(true);
  };

  return (
    <>
      <SocketEvents onRequestPassword={() => setJoinOpen(true)} />

      <div className="absolute z-10 right-0 flex space-y-2  p-6 flex-col md:flex-row md:space-x-2 md:space-y-0">
        <button
          onClick={onCreateRoomClick}
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Create a room
        </button>
        <Create isOpen={createOpen} onClose={() => setCreateOpen(false)} />
        <button
          onClick={onJoinRoomClick}
          className="bg-transparent hover:bg-indigo-500 text-indigo-700 font-semibold hover:text-white py-2 px-4 border border-indigo-500 hover:border-transparent rounded"
        >
          Join a room
        </button>
        <Join isOpen={joinOpen} onClose={() => setJoinOpen(false)} />
      </div>
    </>
  );
}
