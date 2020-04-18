import http from 'http';
import SocketIO from 'socket.io';
import { RoomManager } from './room-manager';
import { Chance } from 'chance';

const server = http.createServer();
const io = SocketIO(server);

const rng = new Chance('some seed');
const roomManager = new RoomManager(() => rng.string({length: 5, alpha: true, casing: 'upper'}));

io.on('connection', (socket) => {
    const clientId = socket.request.connection.remoteAddress;
    console.log(`user connected, id ${clientId}.`);

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('new-room', (fn) => {
        const room = roomManager.newRoom();
        if (room == null) {
            fn();
            return;
        }
        const success = roomManager.joinRoom(room.id, clientId);
        if (!success) {
            fn();
            return;
        }
        console.log(`Created room ${room.id}`);
        fn(room.id);
    });

    socket.on('join-room', (roomId, fn) => {
        const room = roomManager.getRoom(roomId);
        if (room == null) {
            fn();
            return;
        }
        const success = roomManager.joinRoom(room.id, clientId);
        if (!success) {
            fn();
            return;
        }
        console.log(`Client joined room ${room.id}`);
        fn(room.id);
    });
})

// Start listening
server.listen(3000, () => {
    console.log(`Listening on 3000`);
});
