/**
 * UMD以外のビルドで使う設定ファイル
 */
import { defineConfig } from "vite"
import { resolve } from "path";
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "./src/tbtk-optional.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => {
        // 名前はわかりにくいのでカスタマイズする
        if (format === "cjs") {
          return "index.cjs.js"
        }
        else if (format === "es") {
          return "index.esm.mjs"
        }
        return "[name]"
      }
    }
  }
})
