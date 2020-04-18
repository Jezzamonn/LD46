import Chance from 'chance';
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

            const newRoom = {
                id: roomId,
                lastUsed: Date.now(),
                clients: {},
            }
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

        const client = {
            id: clientId,
            lastPing: Date.now(),
        }

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

interface Room {
    id: string;
    lastUsed: number;
    clients: {[key: string]: Client};
}

interface Client {
    id: string,
    lastPing: number;
}