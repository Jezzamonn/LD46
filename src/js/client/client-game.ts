export class ClientGame {
    socket: SocketIOClient.Socket;
    stateChange: () => void;

    playerName: string;
    roomId: string;
    inRoom: boolean;

    constructor() {
        this.playerName = '';
        this.roomId = '';
        this.inRoom = false;
        this.stateChange = () => {};
    }

    getStatus() {
        this.socket.emit('get-status', (status: Status) => {
            if (!status) {
                // No status. That might just mean we opened the page with no game yet. That's ok.
                return;
            }
            this.setStatus(status);
        });
    }

    setStatus(status: Status): void {
        this._setRoom(status.roomId);
        this.playerName = status.gameInfo.players[status.gameInfo.indexOfRequester].name;
        this.stateChange();
    }

    _setRoom(roomId: string) {
        if (roomId == this.roomId) {
            // Nothing to update
            return;
        }
        console.log(`Rejoined room ${roomId}.`);
        this.roomId = roomId;
        this.inRoom = true;
        this.stateChange();
    }

    newRoom() {
        if (this.inRoom) {
            return;
        }
        if (!this.playerName) {
            // TODO: notify user on error
            return;
        }
		this.socket.emit('new-room', {name: this.playerName}, (roomId: string) => {
            if (!roomId) {
                return;
            }
            this._setRoom(roomId);
            console.log(`Joined new room ${roomId}.`);
		});
    }

    joinRoom(roomId: string) {
        if (this.inRoom) {
            return;
        }
        if (!this.playerName) {
            // TODO: notify user on error
            return;
        }
        this.socket.emit('join-room', {name: this.playerName, roomId}, (roomId: string) => {
            if (!roomId) {
                return;
            }
            this._setRoom(roomId);
            console.log(`Joined room ${roomId}.`);
        });
    }
}