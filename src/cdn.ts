// 公開したいものを import して
import { Optional, just, none, ofNullable, Do } from "./tbtk-optional";

// windowに紐づける
Object.assign(window as any, { Optional, just, none, ofNullable, Do });

// windowに紐づけたのを使いたいので、exportはしないこと
