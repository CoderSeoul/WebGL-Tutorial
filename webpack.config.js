const path = require('path');

module.exports = {
    entry: {
        '8Multiple-textures': './src/8Multiple-textures.js',
        '13Simple-animation': './src/13Simple-animation.js',
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.glsl$/,
                use: 'raw-loader'
            },
            {
                test: /\.jpg$/,
                use: 'url-loader',
            },
        ]
    },
    mode: 'development',
};