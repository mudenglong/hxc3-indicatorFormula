const path = require("path");
const webpack = require("webpack");
const pkg = require('./package.json');

module.exports = {
    devtool: 'cheap-module-source-map',

    mode: 'development',

    entry: [
        './src/index.js'
    ],

    output: {
        pathinfo: true,
        filename: pkg.main,
        library: pkg.moduleName,
        libraryTarget: 'umd'
    },

    devServer: {
        compress: false,
        hot: true,
        inline: true,
        watchOptions: {
            ignored: /node_modules/
        }
    },

    module: {
        rules: [
            {
                test: /\.(js)$/,
                include: path.resolve(__dirname, "src"),
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                }
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}
