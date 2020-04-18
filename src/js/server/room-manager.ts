// In memory room manager thing

export class RoomManager {
    rooms: {[key: string]: Room}

    constructor() {
        this.rooms = {};
    }

    roomExists(roomName: string) {
        return roomName in this.rooms;
    }

    // TODO: Clearing old rooms
}

interface Room {
    name: string
    lastUsed: number
}
