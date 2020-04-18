const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const common = {
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-typescript']
                }
            }
        ]
    },
    stats: {
        colors: true
    },
    mode: 'development'
}

const client = {
    entry: './src/js/client/main.ts',
    output: {
        path: path.resolve(__dirname, 'build/client/js'),
        filename: 'main.bundle.js'
    },
    devtool: 'source-map'
}

const server = {
    entry: './src/js/server/server.ts',
    output: {
        path: path.resolve(__dirname, 'build/server'),
        filename: 'server.bundle.js'
    },
    target: 'node',
    externals: [nodeExternals()]
}

module.exports = [
    Object.assign({}, common, client),
    Object.assign({}, common, server),
];