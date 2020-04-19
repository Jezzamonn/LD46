import Chance from 'chance';
import { Game } from './game';
// In memory room manager thing

export class RoomManager {
    roomsByRoomId: {[key: string]: Room}
    roomsByClientId: {[key: string]: Room}
    roomIdGenerator: () => string;

    constructor(roomIdGenerator: () => string) {
        this.roomIdGenerator = roomIdGenerator;
        this.roomsByRoomId = {};
        this.roomsByClientId = {};
    }

    getRoom(roomId: string): Room | null {
        roomId = roomId.toUpperCase();
        if (roomId in this.roomsByRoomId) {
            return this.roomsByRoomId[roomId];
        }
        return null;
    }

    newRoom(): Room | null {
        const maxAttempts = 100;
        for (let i = 0; i < maxAttempts; i++) {
            const roomId = this.roomIdGenerator();
            if (this.getRoom(roomId) != null) {
                continue;
            }

            const newRoom = new Room(roomId);
            newRoom.lastUsed = Date.now();

            this.roomsByRoomId[roomId] = newRoom;

            return newRoom;
        }
        return null;
    }

    getClientRoom(clientId: string): Room | null {
        if (clientId in this.roomsByClientId) {
            return this.roomsByClientId[clientId];
        }
        return null;
    }

    joinRoom(roomId: string, clientId: string): boolean {
        const room = this.getRoom(roomId);
        if (room == null) {
            return false;
        }

        const clientRoom = this.getClientRoom(clientId);
        if (clientRoom != null) {
            // client already has a room. that's wrong.
            return false;
        }

        const client = new Client(clientId);
        client.lastPing = Date.now();

        room.clients[clientId] = client;
        this.roomsByClientId[clientId] = room;
        return true;
    }

    leaveRoom(roomId: string, clientId: string): boolean {
        const room = this.getRoom(roomId);
        if (room == null) {
            return false;
        }

        const clientRoom = this.getClientRoom(clientId);
        if (clientRoom == null) {
            // Client doesn't have a room?
            return false;
        }

        if (room !== clientRoom) {
            // client isn't in this room.
            console.error(`Client ${clientId} attempting to leave room ${roomId} but in a different room`);
            return false;
        }

        delete clientRoom.clients[clientId];
        delete this.roomsByClientId[clientId];

        return true;
    }

    // TODO: Clearing old rooms
}

class Room {
    id: string;
    lastUsed: number;
    clients: {[key: string]: Client};
    game: Game;

    constructor(id: string) {
        this.id = id;
        this.clients = {};
        this.game = new Game();
    }
}

class Client {
    id: string;
    lastPing: number;

    constructor(id: string) {
        this.id = id;
    }
}