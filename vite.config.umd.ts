/**
 * UMD(CDN向け)でのビルドの時だけに使う設定ファイル
 * 
 * CDN向けはグローバル名前空間にOptionalを直で展開したいが
 * 普通に「tbtk-optional.ts」だとどうやってもそれができないため
 * この設定を使ってエントリポイントを変えている。
 */
import { defineConfig } from "vite";
import { resolve } from "path";
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "./src/cdn.ts"),
      formats: ["umd"],
      fileName: _ => "index.js",
      name: "optional" // 使われないので何でもいい
    }
  }
})
