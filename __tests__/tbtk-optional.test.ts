import {Do, just, none, ofNullable} from "../src/tbtk-optional";

test("Doを呼ぶと空オブジェクトが入ったOptionalが作成される。", (): void => {
  expect(Do().get()).toEqual(({}));
});

test("noneを呼ぶとnone状態のOptionalが作成される。", (): void => {
  expect(none().isNone()).toEqual(true);
  expect(none().isPresent()).toEqual(false);
});

test("justを呼ぶと値を持つOptionalが作成される。", (): void => {
  expect(just(1).isNone()).toEqual(false);
  expect(just(2).isPresent()).toEqual(true);
  expect(just(2).get()).toEqual(2);
});

test("justにundefinedかnullを渡すと値を持つOptionalが作成される。", (): void => {
  expect(just(undefined).isPresent()).toEqual(true);
  expect(just(null).isPresent()).toEqual(true);
  expect(just(undefined).get()).toEqual(undefined);
  expect(just(null).get()).toEqual(null);
});

test("ofNullableにundefinedかnullを渡すとnone状態のOptionalが作成される。", (): void => {
  expect(ofNullable(null).isNone()).toEqual(true);
  expect(ofNullable(undefined).isNone()).toEqual(true);
});

test("ofNullableに通常の値を渡すとそれらを持つOptionalが作成される", (): void => {
  expect(ofNullable(1).isPresent()).toEqual(true);
  expect(ofNullable(false).isPresent()).toEqual(true);
  expect(ofNullable(1).get()).toEqual(1);
  expect(ofNullable(false).get()).toEqual(false);
});

test("justにgetを呼ぶとその値が帰ってくる。", (): void => {
  expect(just("あいうえお").get()).toEqual("あいうえお");
});

test("noneにgetを呼ぶとErrorが発生する", (): void => {
  expect(() => {none().get()}).toThrow("No Such Element");
});

test("justにgetOrElseを呼ぶと現在値が戻ってくる。", (): void => {
  expect(just("あいうえお").getOrElse("かきくけこ")).toEqual("あいうえお");
});

test("noneにgetOrElseを呼ぶと引数に指定した値が戻る。", (): void => {
  expect(none().getOrElse("かきくけこ")).toEqual("かきくけこ");
});

test("justにgetOrElseFuncを呼ぶと関数は呼ばれずに現在値が戻る。", (): void => {
  expect(just("あいうえお").getOrElseFunc(() => { throw new Error("呼ばれない"); })).toEqual("あいうえお");
});

test("noneにgetOrElseFuncを呼ぶと関数の戻り値が戻る。", (): void => {
  expect(none().getOrElseFunc(() => "かきくけこ")).toEqual("かきくけこ");
});

test("justにorElseを呼ぶと現在値が戻ってくる。", (): void => {
  expect(just("あいうえお").orElse(just("かきくけこ")).get()).toEqual("あいうえお");
});

test("noneにorElseを呼ぶと引数に指定したOptionalが戻る。", (): void => {
  expect(none().orElse(just("かきくけこ")).get()).toEqual("かきくけこ");
});

test("justにtrueを返す関数でfilterを呼ぶと、justがそのまま戻る。", (): void => {
  expect(just("あいうえお").filter(p => p === "あいうえお").get()).toEqual("あいうえお");
});

test("justにfalseを返す関数でfilterを呼ぶと、noneが戻る", (): void => {
  expect(just("あいうえお").filter(p => p === "かきくけこ").isNone()).toEqual(true);
});

test("noneにfilterを呼ぶと関数は呼ばれずにnoneが戻る。", (): void => {
  expect(none().filter(() => { throw new Error("呼ばれない"); }).isNone()).toEqual(true);
});

test("justにfalseを返す関数でfilterNotを呼ぶと、justがそのまま戻る。", (): void => {
  expect(just("あいうえお").filterNot(p => p === "かきくけこ").get()).toEqual("あいうえお");
});

test("justにtrueを返す関数でfilterNotを呼ぶと、noneが戻る", (): void => {
  expect(just("あいうえお").filterNot(p => p === "あいうえお").isNone()).toEqual(true);
});

test("noneにfilterNotを呼ぶと関数は呼ばれずにnoneが戻る。", (): void => {
  expect(none().filterNot(() => { throw new Error("呼ばれない"); }).isNone()).toEqual(true);
});

test("justに一致する値でcontainsを呼ぶとtrueが戻る。", (): void => {
  expect(just("あいうえお").contains("あいうえお")).toEqual(true);
});

test("justに一致しない値でcontainsを呼ぶとfalseが戻る。", (): void => {
  expect(just("あいうえお").contains("かきくけこ")).toEqual(false);
});

test("noneにcontainsを呼ぶとfalseが戻る。", (): void => {
  expect(just("あいうえお").filter(() => false).contains("あいうえお")).toEqual(false);
});

test("justにtrueを返す関数でforallを呼ぶとtrueが戻る。", (): void => {
  expect(just("あいうえお").forall(p => p === "あいうえお")).toEqual(true);
});

test("justにfalseを返す関数でforallを呼ぶとfalseが戻る。", (): void => {
  expect(just("あいうえお").forall(p => p === "かきくけこ")).toEqual(false);
});

test("noneにforallを呼ぶと関数は呼ばれずにtrueが戻る。", (): void => {
  expect(none().forall(() => { throw new Error("呼ばれない"); })).toEqual(true);
});

test("justにtrueを返す関数でexistsを呼ぶとtrueが戻る。", (): void => {
  expect(just("あいうえお").exists(p => p === "あいうえお")).toEqual(true);
});

test("justにfalseを返す関数でexistsを呼ぶとfalseが戻る。", (): void => {
  expect(just("あいうえお").exists(p => p === "かきくけこ")).toEqual(false);
});

test("noneにexistsを呼ぶと関数は呼ばれずにfalseが戻る。", (): void => {
  expect(none().exists(() => { throw new Error("呼ばれない"); })).toEqual(false);
});

test("justのforeachに関数を指定して呼ぶと、その関数が呼ばれる。", (): void => {
  let vVal = "";
  just("あいうえお").foreach(p => vVal = p + "かきくけこ");
  expect(vVal).toEqual("あいうえおかきくけこ");
});

test("noneのforeachに関数を指定して呼ぶと、その関数は呼ばれない", (): void => {
  let vVal = "";
  none().foreach(() => { throw new Error("呼ばれない"); });
  expect(vVal).toEqual("");
});

test("justにfoldを呼び出すと、成功側の関数が呼ばれて値が戻ってくる。", (): void => {
  expect(
    just("10").fold(
      () => { throw new Error("呼ばれない"); },
      (p) => parseInt(p) * 10
    )
  ).toEqual(100);
});

test("noneにfoldを呼び出すと、失敗の関数が呼ばれて値が戻ってくる。", (): void => {
  expect(
    none().fold(
      () => 10,
      (_) => { throw new Error("呼ばれない"); }
    )
  ).toEqual(10);
});

test("justにmapをすると、関数の値による変換が行われる。", (): void => {
  expect(just(10).map(p => `値は${p}`).get()).toEqual("値は10");
});

test("noneにmapをすると、関数は呼ばれずnoneが戻る。", (): void => {
  expect(none().map(_ => {throw new Error("呼ばれない");}).isNone()).toEqual(true);
});

test("justにflatMapをすると、関数の値による変換が行われたOptionalが戻る。", (): void => {
  expect(just(10).flatMap(p => just(`値は${p}`)).get()).toEqual("値は10");
});

test("justにflatMapをしたときに、関数がnoneを戻せば全体がnoneになる。", (): void => {
  expect(just(10).flatMap(_ => none()).isNone()).toEqual(true);
});

test("noneにflatMapをすると、関数は呼ばれずnoneが戻る。", (): void => {
  expect(none().flatMap(_ => {throw new Error("呼ばれない");}).isNone()).toEqual(true);
});

test("doとbindのflatMap版の例が意図通りに動作する", (): void => {
  const two_x = (a: number) => just(a * 2);
  const four_x = (a: number) => just(a * 4);
  const eight_x = (a: number) => just(a * 8);

  expect(just(2).flatMap(
    a => two_x(a).flatMap(
      b => four_x(a).flatMap(
        c => eight_x(a).map(
          d => `2x=${b}, 4x=${c}, 8x=${d}`
        )
      )
    )
  ).get()).toEqual("2x=4, 4x=8, 8x=16");
});

test("doとbindのdo版が例の意図通りに動作する。", (): void => {
  const two_x = (a: number) => just(a * 2);
  const four_x = (a: number) => just(a * 4);
  const eight_x = (a: number) => just(a * 8);

  expect(
    Do()
      .bind("a", _ => just(2))
      .bind("b", m => two_x(m.a))
      .bind("c", m => four_x(m.a))
      .bind("d", m => eight_x(m.a))
      .map(m => `2x=${m.b}, 4x=${m.c}, 8x=${m.d}`)
      .get()
  ).toEqual("2x=4, 4x=8, 8x=16");
});

test("doとbindのdo版の途中でnoneになるものが例の意図通りに動作する。", (): void => {
  const two_x = (a: number) => just(a * 2);
  const four_x = (_: number) => none();

  expect(
    Do()
      .bind("a", _ => just(2))
      .bind("b", m => two_x(m.a))
      .bind("c", m => four_x(m.a))
      .bind("d", _ => { throw new Error("呼ばれない") })
      .map(_ => { throw new Error("呼ばれない") })
      .isNone()
  ).toEqual(true);
});
