const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  resolve: {
    extensions: [".ts", ".js"],
    mainFields: ["main", "module", "browser"],
  },
  entry: "./src/renderer/app.ts",
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
                name: "[path][name].[ext]",
                esModule: false
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
      template: path.resolve(__dirname, "src/renderer/index.html"),
    })
  ],
};