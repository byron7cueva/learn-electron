const path = require("path");

module.exports = {
  resolve: {
    extensions: [".ts", ".js"],
  },
  devtool: "source-map",
  entry: "./src/electron/main.ts",
  target: "electron-main",
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      }
    ],
  },
  node: {
    __dirname: false,
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
};
