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

    getRoom() {
        this.socket.emit('get-room', (roomId: string) => {
            if (!roomId) {
                // No room yet. That's ok.
                return;
            }
            this._setRoom(roomId);
            console.log(`Rejoined room ${roomId}.`);
        });
    }

    _setRoom(roomId: string) {
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