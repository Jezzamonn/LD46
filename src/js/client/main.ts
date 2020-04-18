import io from 'socket.io-client';
import { ClientGame } from './client-game';

const serverAddress = '192.168.1.134:3000'
let socket: SocketIOClient.Socket = null;
let game: ClientGame = null;

function init() {
	initSocketIo();

	game = new ClientGame(socket);

	document.querySelector('.new-room-button').addEventListener('click', () => {
		game.newRoom();
	});

	const roomInput = <HTMLInputElement> document.querySelector('.room-input');
	document.querySelector('.join-room-button').addEventListener('click', () => {
		game.joinRoom(roomInput.value);
	});
}

function initSocketIo() {
	socket = io(serverAddress)

	socket.on('connect', () => {
		console.log('connected to server!');
	});
}

window.onload = init;
