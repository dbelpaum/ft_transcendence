const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = function(options) {
    return {
        ...options,
        entry: ['webpack/hot/poll?100', path.join(__dirname, 'src/main.ts')],
        watch: true,
        externals: [
            nodeExternals({
                allowlist: ['webpack/hot/poll?100'],
            }),
        ],
        plugins: [
            ...options.plugins,
            new webpack.HotModuleReplacementPlugin(),
        ],
    };
};
