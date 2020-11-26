import socketIOClient from 'socket.io-client';

const ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://cryptic-savannah-67902.herokuapp.com/"
    : "http://localhost:3000/";

const socket = socketIOClient(ENDPOINT);

export default socket;