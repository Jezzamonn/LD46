import { ClientGame } from "./client-game";

export class GameViewModel {
    game: ClientGame;

    constructor(game: ClientGame) {
        this.game = game;
    }

    start() {
        document.querySelector('.new-room-button').addEventListener('click', () => {
            this.game.newRoom();
        });
    
        const roomInput = <HTMLInputElement> document.querySelector('.room-input');
        document.querySelector('.join-room-button').addEventListener('click', () => {
            this.game.joinRoom(roomInput.value);
        });

        const header = <HTMLParagraphElement> document.querySelector('.header');
        this.game.setMessage = (message) => {
            header.innerText = message;
        }

        this.game.getRoom();
    }

    setMessage() {
        
    }
}