const RemovePlugin = require("remove-files-webpack-plugin");

/**
 * CDN用の「index.js」を作成するのために必要となる
 */
module.exports = {
  mode: "production",
  entry: "./src/cdn.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: "tsconfig.cdn.json",
          }
        }
      }
    ]
  },
  output: {
    filename: "index.js",
    globalObject: "window", // DOMを使うタイプのライブラリなので、windowの下に生やす
    libraryTarget: "umd"    // CDN向けなので、ユニバーサルにする
  },
  resolve: {
    extensions: [".ts"]
  },
  plugins: [
    // cdn系はindex.jsだけあればいいので、混乱を招かないよう消す
    new RemovePlugin({
      after: {
        include: ["./dist/cdn.js", "./dist/cdn.d.ts"]
      }
    })
  ]
};
