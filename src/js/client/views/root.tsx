import React from 'react';
import { EntryPoint } from './entry-point';
import { ClientGame } from '../client-game';

export class Root extends React.Component<{'game': ClientGame}> {

    render() {
        return (
            <EntryPoint game={this.props.game}/>
        )
    }
}