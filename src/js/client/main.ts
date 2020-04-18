import io from 'socket.io-client';
import { ClientGame } from './client-game';
import { GameViewModel } from './game-viewmodel';

const serverAddress = '192.168.1.134:3000'
let socket: SocketIOClient.Socket = null;

let game: ClientGame = null;
let viewModel: GameViewModel = null;
let connectedOnce = false;

function init() {
	initSocketIo();

	game = new ClientGame(socket);
	viewModel = new GameViewModel(game);
}

function initSocketIo() {
	socket = io(serverAddress)

	socket.on('connect', () => {
		console.log('connected to server!');
		if (!connectedOnce) {
			viewModel.start();
		}
		connectedOnce = true;
	});
}

window.onload = init;
