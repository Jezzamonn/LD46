import Chance from 'chance';

const minPlayers = 3;
const cardsPerPlayer = 3;

export class Game {
    state: GameState;
    players: Player[];
    activePlayer: Player | null;
    rng: Chance.Chance;
    deck: Card[];
    round: number;

    constructor() {
        this.state = 'start';
        this.players = [];
        this.activePlayer = null;

        this.rng = new Chance();
        this.deck = [];
        this.round = 0;
    }

    // Getters and such

    get numBadPlayers(): number {
        return Math.ceil(this.players.length / 2) - 1;
    }

    get numPlayersPerChoice(): number {
        return Math.ceil(this.players.length / 2) - 1;
    }

    getPlayer(playerId: string): Player | null {
        for (const player of this.players) {
            if (player.id === playerId) {
                return player;
            }
        }
        return null;
    }

    getChosenPlayers(): Player[] {
        return this.players.filter(p => p.chosen);
    }

    allPlayersSelected(): boolean {
        return this.players.every(p => p.selectedCard != null);
    }

    drawCard(): Card {
        if (this.deck.length == 0) {
            // Set up the 'deck' with cards;
            const deck = [];
            const cardsPerDeck = cardsPerPlayer * this.players.length * 5;
            for (let i = 0; cardsPerDeck; i += cardsPerPlayer) {
                deck.push(
                    {suit: 'star'},
                    {suit: 'heart'},
                    {suit: 'clover'}
                );
            }
            this.deck = this.rng.shuffle(deck);
        }
        return this.deck.pop();
    }

    getGameInfo(playerId: string): GameInfo {
        const requestingPlayer = this.getPlayer(playerId);
        if (requestingPlayer == null) {
            // that's weird.
            // TODO: support spectating?
            return;
        }

        const gameInfo: GameInfo = {
            state: this.state,
            players: [],
        };
        for (const player of this.players) {
            const getFullInfo = player == requestingPlayer;
            const showType = requestingPlayer.type == 'bad';
            const showSelection = this.state == 'show results';

            const playerInfo = player.getPlayerInfo({
                getFullInfo, showType, showSelection});
            playerInfo.active = (player === this.activePlayer);

            gameInfo.players.push(playerInfo);
        }
        return gameInfo;
    }

    // Actions that can happen on the game.

    addPlayer(playerId: string) {
        if (this.state != 'start') {
            // Can't add player!
            return;
        }

        const player = new Player(playerId);
        player.owner = this.players.length == 0;

        this.players.push(player);
    }

    start(): boolean {
        // TODO: filter out idle players?
        // TODO: Max players
        if (this.players.length < minPlayers) {
            // Not enough players to start
            return false;
        }

        // TODO: Shuffle player order?
        this.assignRoles();
        this.dealCards();
        this.round = 0;

        this.activePlayer = this.rng.pick(this.players);
        // TODO: transition to next start
        return true;
    }

    selectCard(playerId: string, selection?: number) {
        const player = this.getPlayer(playerId);
        if (!player) {
            // Weird. Not good.
            return;
        }

        if (selection == null || selection < 0 || selection >= cardsPerPlayer) {
            // no choice, or invalid choice.
            player.selectedCard = this.rng.pick(player.cards);
            return;
        }
        player.selectedCard = player.cards[selection];

        // TODO: If all players selected, next state
    }

    choosePlayer(playerId: string, choiceIndex: number, chosen: boolean) {
        const player = this.getPlayer(playerId);
        if (!player) {
            // Weird.
            return;
        }

        if (choiceIndex < 0 || choiceIndex >= this.players.length) {
            return;
        }

        const chosenPlayers = this.getChosenPlayers();
        if (chosen && chosenPlayers.length >= this.numPlayersPerChoice) {
            // Can't pick another player
            return;
        }
        this.players[choiceIndex].chosen = chosen;
    }

    confirmPlayerChoice(playerId: string) {
        const player = this.getPlayer(playerId);
        if (!player) {
            // Weird.
            return;
        }

        const chosenPlayers = this.getChosenPlayers();
        if (chosenPlayers.length < this.numPlayersPerChoice) {
            // Need to pick more players
            return;
        };

        // TODO: Result of picking a card

        // TODO: Show the result of picking, move to the next player
    }

    // Internal stuff the game does

    assignRoles() {
        const badPlayers = this.rng.pickset(this.players, this.numBadPlayers);
        for (const player of badPlayers) {
            player.type = 'bad';
        }
    }

    dealCards() {
        for (const player of this.players) {
            while (player.cards.length < cardsPerPlayer) {
                player.cards.push(this.drawCard());
            }
        }
    }

}

export class Player {
    // TODO: player names

    // The IP address of the connecting user
    id: string;
    type: PlayerType;
    owner: boolean;
    cards: Card[];
    selectedCard: Card | null;
    chosen: boolean;

    constructor(id: string) {
        this.id = id;
        this.type = 'good';
        this.owner = false;
        this.cards = [];
        this.selectedCard = null;
        this.chosen = false;
    }

    getPlayerInfo({
        getFullInfo,
        showType,
        showSelection
    }: {
        getFullInfo: boolean,
        showType: boolean,
        showSelection: boolean,
    }): PlayerInfo {
        const info: PlayerInfo = {
            owner: this.owner,
            chosen: this.chosen,
            cards: [],
            selectedCard: null,
        };

        if (getFullInfo) {
            info.type = this.type;
            info.cards = this.cards;
        }
        else {
            info.cards = this.cards.map(c => <Card>{suit: 'unknown'});
        }

        if (showSelection) {
            info.selectedCard = this.selectedCard;
        }
        else {
            if (this.selectedCard == null) {
                info.selectedCard = null;
            }
            else {
                info.selectedCard = {suit: 'unknown'};
            }
        }

        if (showType) {
            info.type = this.type;
        }

        return info;
    }
}
