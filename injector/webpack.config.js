const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const basePkg = require("../package.json");

module.exports = (env, argv) => ({
  mode: "development",
  target: "node",
  devtool: argv.mode === "production" ? undefined : "eval-source-map",
  entry: "./src/index.js",
  output: {
    filename: "injector.js",
    path: path.resolve(__dirname, "..", "dist")
  },
  externals: {
    electron: `require("electron")`,
    fs: `require("fs")`,
    path: `require("path")`,
    request: `require("request")`,
    events: `require("events")`,
    rimraf: `require("rimraf")`,
    yauzl: `require("yauzl")`,
    mkdirp: `require("mkdirp")`,
    module: `require("module")`,
    child_process: `require("child_process")`,
  },
  resolve: {
    extensions: [".js"],
    alias: {
      common: path.resolve(__dirname, "..", "common")
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.__VERSION__": JSON.stringify(basePkg.version)
    })
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {drop_debugger: false},
          keep_classnames: true
        }
      })
    ]
  }
});