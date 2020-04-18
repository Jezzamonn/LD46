import Chance from 'chance';
// In memory room manager thing

export class RoomManager {
    rooms: {[key: string]: Room}
    nameGenerator: () => string;

    constructor(nameGenerator: () => string) {
        this.nameGenerator = nameGenerator;
        this.rooms = {};
    }

    roomExists(roomName: string) {
        return roomName in this.rooms;
    }

    newRoom(): Room | null {
        const maxAttempts = 100;
        for (let i = 0; i < maxAttempts; i++) {
            const roomName = this.nameGenerator();
            if (this.roomExists(roomName)) {
                continue;
            }

            return {
                name: roomName,
                lastUsed: Date.now(),
            }
        }
        return null;
    }

    // TODO: Clearing old rooms
}

interface Room {
    name: string
    lastUsed: number
}
