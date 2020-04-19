import React from "react";
import { ClientGame } from "../client-game";

export class EntryPoint extends React.Component<{'game': ClientGame}, any> {
    constructor(props) {
        super(props);
        this.state = {
            header: 'Hello!',
            roomInput: '',
        }
    }

    handleRoomInputChange(event) {
        this.setState({roomInput: event.target.value});
    }
    
    render() {
        return (
            <div>
                <p className="header">{this.state.header}</p>
                <div className="options">
                    <div className="option">
                        <button
                            className="button new-room-button"
                            onClick={this.props.game.newRoom}>
                            New Room
                        </button>
                    </div>
                    <div className="option">
                        <input
                            type="text"
                            className="room-input"
                            value={this.state.roomInput}
                            onChange={this.handleRoomInputChange}>
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