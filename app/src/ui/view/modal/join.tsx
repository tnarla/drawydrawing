import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { RouteComponentProps, useRouteMatch } from "react-router-dom";
import socket from "../../../socket";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function Join(props: Props) {
  const match = useRouteMatch<{ shortId?: string }>();
  const [code, setCode] = useState(match.params.shortId ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleError = (reason: string) => {
      setError(reason);
    };

    socket.on("joinFailed", handleError);
    return () => {
      socket.off("joinFailed", handleError);
    };
  }, []);

  const handleJoinRoom = () => {
    socket.emit("join", code, password).on("joined", props.onClose);
    setError(null);
  };

  return (
    <Modal
      appElement={document.getElementById("root")!}
      isOpen={props.isOpen}
      onRequestClose={() => props.onClose()}
      overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
      className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full "
    >
      <div>
        <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Join Room
          </h3>
        </div>

        <div className="p-4 space-y-4">
          {error && (
            <div className="text-red-500 font-bold text-sm">{error}</div>
          )}

          <div>
            <label
              htmlFor="createCode"
              className="block text-sm font-medium text-gray-700"
            >
              Room Code
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="createCode"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="createPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Room Password
            </label>
            <div className="mt-1">
              <input
                type="password"
                id="createPassword"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-x-4 flex items-center justify-end">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-400 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={() => props.onClose()}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleJoinRoom}
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
