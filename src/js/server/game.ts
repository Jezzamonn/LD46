export class Game {
    state: 'start' | 'end' | 'select card' | 'select team' | 'showing result'
    players: {[key: string]: Player};

    constructor() {
        this.state = 'start';
        this.players = {}
    }

    addPlayer(playerId) {
        if (this.state != 'start') {
            // Can't add player!
            return;
        }
        
        this.players[playerId] = new Player(playerId);
    }
}

export class Player {
    // The IP address of the connecting user
    id: string;
    type: 'good' | 'bad';

    constructor(id: string) {
        this.id = id;
    }
}