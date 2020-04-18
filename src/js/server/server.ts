import http from 'http';
import SocketIO from 'socket.io';
import { RoomManager } from './room-manager';
import { Chance } from 'chance';

const server = http.createServer();
const io = SocketIO(server);

const rng = new Chance('some seed');
const roomManager = new RoomManager(() => rng.string({length: 5, alpha: true, casing: 'upper'}));

io.on('connection', (socket) => {
    console.log(`user connected, id ${socket.request.connection.remoteAddress}.`);

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
})

// Start listening
server.listen(3000, () => {
    console.log(`Listening on 3000`);
});
