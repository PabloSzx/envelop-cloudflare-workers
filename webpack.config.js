const path = require("path");
require("webpack");

const mode = process.env.NODE_ENV || "production";

module.exports = {
  output: {
    filename: `worker.js`,
    path: path.join(__dirname, "dist"),
  },
  mode,
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    plugins: [],
    fallback: {
      async_hooks: path.resolve(__dirname, "async_hooks_noop.js"),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
};
