import React from "react";
import { ClientGame } from "../client-game";

export class EntryPoint extends React.Component<{'game': ClientGame}, any> {
    constructor(props: {'game': ClientGame}) {
        super(props);
        this.state = {
            header: 'Hello!',
            roomInput: '',
            username: '',
        }
        props.game.stateChange = () => {
            this.setState({
                username: props.game.playerName,
                header: `In Room: ${props.game.roomId}`
            });
        }
    }

    roomInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({roomInput: event.target.value});
    }

    usernameInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({username: event.target.value});
        // TODO: Check if this is where you should update things, or if
        // there's a better place for it.
        this.props.game.playerName = event.target.value;
    }

    render() {
        return (
            <div>
                <p className="header">{this.state.header}</p>
                <div className="username-section">
                    Enter your name:&nbsp;
                    <input
                        type="text"
                        className="username-input"
                        value={this.state.username}
                        onChange={(e) => this.usernameInputChange(e)}>
                    </input>
                </div>
                <div className="options">
                    <div className="option">
                        <button
                            className="button new-room-button"
                            onClick={() => this.props.game.newRoom()}>
                            New Room
                        </button>
                    </div>
                    <div className="option">
                        <input
                            type="text"
                            className="room-input"
                            value={this.state.roomInput}
                            onChange={(e) => this.roomInputChange(e)}>
                        </input>
                        <button
                            className="button join-room-button"
                            onClick={() => this.props.game.joinRoom(this.state.roomInput)}>
                            Join Room
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}