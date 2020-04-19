import io from 'socket.io-client';
import { ClientGame } from './client-game';
import { Root } from './views/root';
import ReactDOM from 'react-dom';
import React from 'react';

const serverAddress = '192.168.1.134:3000'
let socket: SocketIOClient.Socket = null;

let game: ClientGame = null;
let connectedOnce = false;

function init() {
	// TODO: Think about restructing this so we don't have to do all this building before rendering
	game = new ClientGame();

	const reactContainer = document.querySelector('.react-container');
	const rootComponent = React.createElement(Root, {game});
	ReactDOM.render(rootComponent, reactContainer);

	initSocketIo();

	// TODO... what if something happens before this happens?
	game.socket = socket;
}

function initSocketIo() {
	socket = io(serverAddress)

	socket.on('connect', () => {
		console.log('connected to server!');
		if (!connectedOnce) {
			game.getStatus();
		}
		connectedOnce = true;
	});

	socket.on('status-update', (status: Status) => {
		game.setStatus(status);
	})
}

window.onload = init;
