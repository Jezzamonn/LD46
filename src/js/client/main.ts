import io from 'socket.io-client';

const serverAddress = 'localhost:3000'
let socket = null;

function init() {
	initSocketIo();
}

function initSocketIo() {
	socket = io(serverAddress)

	socket.on('connect', () => {
		console.log('connected to server!');
	});
}

window.onload = init;