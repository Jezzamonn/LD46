export class ClientGame {
    socket: SocketIOClient.Socket;
    roomId: string;
    inRoom: boolean;
    
    constructor(socket: SocketIOClient.Socket) {
        this.socket = socket;
        this.roomId = '';
        this.inRoom = false;
    }

    newRoom() {
        if (this.inRoom) {
            return;
        }
		this.socket.emit('new-room', (roomId: string) => {
            if (!roomId) {
                return;
            }
            this.roomId = roomId;
            this.inRoom = true;
            console.log(`Joined room ${roomId}.`);
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
            this.roomId = roomId;
            this.inRoom = true;
            console.log(`Joined room ${roomId}.`);
        });
    }
}