import http from 'http';
import SocketIO from 'socket.io';

let server = http.createServer();
let io = new SocketIO(server);

console.log('server is running!');

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
})

// Start listening
server.listen(3000, () => {
    console.log(`Listening on 3000`);
});