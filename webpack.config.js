const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const MODE_PRODUCTION = 'production';
const MODE_DEVELOPMENT = 'development';

module.exports = (env, options) => {
    let config = {
        entry: './source/index.ts',
        mode: options.mode,
        module: {
            rules: [
                {
                    test: /\.ts?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                }
            ],
        },
        resolve: {
            extensions: ['.ts', '.js']
        },
        output: {
            library: 'SwToolbox',
            libraryExport: 'default',
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist')
        },
        optimization: {
            minimizer: [new UglifyJsPlugin({
                extractComments: true,
            })],
        },
    };

    if (options.mode === MODE_DEVELOPMENT) {
        config.devtool = 'inline-source-map';
    }

    return config;
};