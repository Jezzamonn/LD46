type GameState = 'start' | 'end' | 'select card' | 'select team' | 'show results';
type PlayerType = 'good' | 'bad';

interface Status {
    roomId: string;
    gameInfo: GameInfo;
}

interface GameInfo {
    state: GameState;
    players: PlayerInfo[];
    indexOfRequester: number;
}

interface PlayerInfo {
    name: string;
    type?: PlayerType;
    owner: boolean;
    cards: Card[];
    selectedCard: Card | null;
    chosen: boolean;
    active?: boolean;
}
