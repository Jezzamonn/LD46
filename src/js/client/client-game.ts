export class ClientGame {
    socket: SocketIOClient.Socket;
    roomId: string;
    inRoom: boolean;
    stateChange: () => void;

    constructor() {
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
		this.socket.emit('new-room', (roomId: string) => {
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
        this.socket.emit('join-room', roomId, (roomId: string) => {
            if (!roomId) {
                return;
            }
            this._setRoom(roomId);
            console.log(`Joined room ${roomId}.`);
        });
    }
}