import { io } from 'socket.io-client';

let socket;

export const initSocket = (token) => {
    // Automatically detect if we are on localhost or the live site
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const SOCKET_URL = isLocalhost ? 'http://localhost:5000' : 'https://evolve-website.onrender.com';

    socket = io(SOCKET_URL, {
        auth: {
            token: token
        }
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
    }
};

export const getSocket = () => socket;