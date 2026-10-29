import { io } from 'socket.io-client';

const URL = 'https://chat-backend-m4jk.onrender.com';

export const socket = io(URL);



