const path = require('path');

module.exports = {
    resolve: {
        fallback: {
            process: require.resolve('process/browser'),
            buffer: require.resolve('buffer/')
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    }
};
