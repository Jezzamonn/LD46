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

    socket.on('disconnect', () => {
        // TODO: mark them as idle in the game
    });

    socket.on('new-room', ({name}, fn) => {
        const room = roomManager.newRoom();
        if (!room) {
            fn();
            return;
        }
        const success = roomManager.joinRoom(room.id, clientId);
        if (!success) {
            fn();
            return;
        }
        room.game.addPlayer(clientId, name);
        console.log(`Created room ${room.id}`);
        fn(room.id);
    });

    socket.on('join-room', ({roomId, name}, fn) => {
        const room = roomManager.getRoom(roomId);
        if (!room) {
            fn();
            return;
        }
        const success = roomManager.joinRoom(room.id, clientId);
        if (!success) {
            fn();
            return;
        }
        room.game.addPlayer(clientId, name);
        console.log(`Client joined room ${room.id}`);
        fn(room.id);
    });

    socket.on('get-room', (fn) => {
        const room = roomManager.getClientRoom(clientId);
        if (!room) {
            fn();
            return;
        }
        fn(room.id);
    });

    socket.on('get-status', (fn) => {
        const room = roomManager.getClientRoom(clientId);
        if (!room) {
            fn();
            return;
        }
        const gameInfo = room.game.getGameInfo(clientId);
        const status: Status = {
            roomId: room.id,
            gameInfo
        };
        fn(status);
    });
})

// Start listening
server.listen(3000, () => {
    console.log(`Listening on 3000`);
});
