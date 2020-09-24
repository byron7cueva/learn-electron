const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  resolve: {
    extensions: [".ts", ".js"],
    mainFields: ["main", "module", "browser"],
  },
  entry: {
    index: "./src/renderer/mainWindow/app.ts",
    preferences: "./src/renderer/prefsWindow/preferences.ts"
  },
  target: "electron-renderer",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(jpg|png|gif|woff|eot|ttf|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: 'assets/',
              name: "[name].[ext]",
              esModule: true
            }
          }
        ],
      },
      {
        test: require.resolve('./src/renderer/lib/filterous2-2.0.0.min.js'),
        use: 'exports-loader?exports=default|filterous',
      }
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, "../dist/renderer"),
    historyApiFallback: true,
    compress: true,
    hot: true,
    port: 4000,
    publicPath: "/",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunks:['index'],
      template: path.resolve(__dirname, "src/renderer/index.html"),
    }),
    new HtmlWebpackPlugin({
      chunks: ['preferences'],
      filename: 'preferences.html',
      template: path.resolve(__dirname, "src/renderer/preferences.html")
    })
  ],
};