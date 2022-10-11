/**
 * いわゆるMaybeモナド的なクラスです。
 * 中身はJavaのOptionalとScalaのOptionを混ぜて、個人的に好みのほうに合わせた感じになっています。
 *
 * 特徴として、TypeScriptは今のところ演算子オーバーロードがないので、どうしても{@link Optional.flatMap}な処理を繋げるとネストが深くなりますが
 * それの対策のために、Haskellのdo記法もどきができる{@link Optional.bind}を搭載しているので
 * Optionalの糊付けが綺麗に記載できます。
 */
export class Optional<T> {
  /**
   * コンストラクタ
   *
   * 基本的にこれは自分では呼び出さず、{@link just()}、{@link ofNullable()}、{@link none()}
   * から生成を行ってください。
   *
   * @param p_value
   *   引数を何も指定しなかった場合は{@link none()}が出来ます。
   *   引数を1個指定した場合、その値を持つ{@link just()}が出来ます。
   *
   *   2つ以上の引数を指定した場合でも落ちたりはしませんが特に意味はありません。
   *
   *   なお、第一引数に「undefined」を指定した場合は「undefinedを格納したjust」が出来ます。
   *   ここで「none」を作りたい場合は{@link ofNullable()}で作成する必要があります。
   */
  constructor(...p_value: [...T[]]) {
    if (p_value.length >= 1) {
      this.FIsPresent = true;
      this.FValue = p_value[0];
    }
    else {
      this.FIsPresent = false;
      this.FValue = undefined;
    }
  }

  /**
   * 現在のOptionalに値が入っているかを調べます。
   *
   * @returns 中身が{@link just()}ならtrue、違えばfalse
   * @see {@link isNone()}
   */
  isPresent(): boolean {
    return this.FIsPresent;
  }

  /**
   * 現在のOptionalに値が入っているかを調べます。
   * @returns 中身が{@link none()}ならtrue、違えばfalse
   * @see {@link isPresent()}
   */
  isNone(): boolean {
    return !this.FIsPresent;
  }

  /**
   * {@link just()}の値を直接取得します。
   * {@link none()}の時に触った場合はErrorを発行するので注意してください。
   * @returns 値
   */
  get(): T | undefined {
    if (this.isNone()) {
      throw new Error("No Such Element");
    }
    return this.FValue;
  }

  /**
   * {@link just()}ならその値を、{@link none()}なら引数で渡した値をそのまま返します。
   * 値ではなく{@link Optional}を返したい場合は{@link orElse()}を呼びます。
   *
   * @param p_failed_value noneの時に変わりに返したい値
   * @returns 説明欄の通りの値
   */
  getOrElse(p_failed_value: T): T {
    return this.FIsPresent ? this.FValue! : p_failed_value;
  }

  /**
   * {@link just()}ならその値を、{@link none()}なら引数で渡した関数を呼び出し
   * その戻り値をそのまま返します。
   *
   * @param p_failed_function Tを返す関数
   * @returns 説明欄の通りの値
   */
  getOrElseFunc(p_failed_function: () => T): T {
    return this.FIsPresent ? this.FValue! : p_failed_function();
  }

  /**
   * {@link just()}なら自分を、{@link none()}なら引数で渡した{@link Optional}を返します。
   *
   * このメソッドはJavaのOptionalとScalaのOptionの両方にありますが
   * 効果的にはScalaのほうに寄せています。JavaのorElse相当の機能は{@link getOrElse()}を使ってください。
   *
   * @param p_failed_optional noneの時に変わりに返したい{@link Optional}。
   * @returns 説明欄の通りの値
   */
  orElse(p_failed_optional: Optional<T>): Optional<T> {
    return this.FIsPresent ? this : p_failed_optional;
  }

  /**
   * 引数に指定の関数を使って、値のチェックを行った上で
   * {@link just()}または{@link none()}のどちらかを返します。
   *
   * @param p_filter 現在値を受け取り真偽値を返す関数。
   * @returns
   *   - 現在値が{@link none()}
   *       - 指定の関数は呼ばずに常に{@link none()}
   *   - 現在値が{@link just()}
   *       - 指定の関数がtrueを返せば現在のインスタンスがそのまま、falseを返せば{@link none()}
   * @see {@link filterNot}
   */
  filter(p_filter: (p: T) => boolean): Optional<T> {
    if (this.FIsPresent) {
      return p_filter(this.FValue!) ? this : none();
    }
    else {
      return none();
    }
  }

  /**
   * 引数に指定の関数を使って、値のチェックを行った上で
   * {@link just()}または{@link none()}のどちらかを返します。
   *
   * @param p_filter 現在値を受け取り真偽値を返す関数。
   * @returns
   *   - 現在値が{@link none()}
   *       - 指定の関数は呼ばずに常に{@link none()}
   *   - 現在値が{@link just()}
   *       - 指定の関数がfalseを返せば現在のインスタンスがそのまま、falseを返せば{@link none()}
   * @see {@link filter}
   */
  filterNot(p_filter: (p: T) => boolean): Optional<T> {
    if (this.FIsPresent) {
      return p_filter(this.FValue!) ? none() : this;
    }
    else {
      return none();
    }
  }

  /**
   * 現在の値がp_testで指定した値かどうかを調べます。
   *
   * @param p_test 検証したい値
   * @returns 現在値が{@link none()}ならfalse、そうでない場合は「p_test === 現在値」の結果。
   */
  contains(p_test: T) : boolean {
    return this.FIsPresent ? this.FValue === p_test : false;
  }

  /**
   * 現在値が{@link none()}だった場合はtrueが、
   * そうでなければ指定関数の戻り値を返します。
   *
   * {@link exists()}との違いは、{@link none()}時の戻り値です。
   *
   * @param p_filter 現在値を取り、真偽値を返す関数
   * @returns 説明欄の通りの値。
   */
  forall(p_filter: (p: T) => boolean): boolean {
    return this.FIsPresent ? p_filter(this.FValue!) : true;
  }

  /**
   * 現在値が{@link none()}だった場合はfalseが、
   * そうでなければ指定関数の戻り値を返します。
   *
   * {@link forall()}との違いは、{@link none()}時の戻り値です。
   *
   * @param p_filter 現在値を取り、真偽値を返す関数
   * @returns 説明欄の通りの値。
   */
  exists(p_filter: (p: T) => boolean): boolean {
    return this.FIsPresent ? p_filter(this.FValue!) : false;
  }

  /**
   * 現在が{@link just()}の場合にだけに関数を呼びます。
   * 値は返せません。
   *
   * @param p_function {@link just()}だったときに呼ばれる、現在値を引数に取る関数。
   */
  foreach(p_function: (p: T) => void): void {
    if (this.FIsPresent) {
      p_function(this.FValue!);
    }
  }

  /**
   * 現在の状態にあわせた値を返す関数を呼び出して、それらの値を取得します。
   *
   * @param p_none_function {@link none()}だったときに呼ばれる値を返す関数。
   * @param p_just_function {@link just()}だったときに呼ばれる、現在値を引数に取って値を返す関数。
   * @returns どちらかの関数が返した値。
   */
  fold<T2>(p_none_function: () => T2, p_just_function: (p: T) => T2): T2 {
    return (this.FIsPresent) ? p_just_function(this.FValue!) : p_none_function();
  }

  /**
   * Optionalに入っている値を引数にとって、新たな値を返す関数を渡すことで
   * 新たなOptionalにします。
   *
   * 仕様上、このメソッドでjustなOptionalをnoneにすることは不可能です。
   * そういうことがしたい場合は{@link flatMap()}を使います。
   *
   * @param p_map 現在の{@link just()}の値を取り、新たな値を返す関数
   * @returns 関数の適用結果。現在値が{@link none()}なら、関数は呼ばれず{@link none()}が戻ります。
   */
  map<T2>(p_map: (p: T) => T2): Optional<T2> {
    return this.FIsPresent ? just(p_map(this.FValue!)) : none();
  }

  /**
   * Optionalに入っている値を引数にとって、新たなOptionalを返す関数を渡すおとで
   * 新たなOptionalにします。
   *
   * {@link map}との違いは、あちらが値を返す関数を渡す仕様で
   * こちらはOptionalそのものを返す関数を取ることです。
   *
   * これにより、こちらはjustなOptionalを途中でnoneに作り変えることができます。
   *
   * @param p_flatMap  現在の{@link just()}の値を取り、新たな{@link Optional}を返す関数。
   * @returns p_flatMapの関数が戻してきた{@link Optional}。現在値が{@link none()}なら、関数は呼ばれず{@link none()}が戻ります。
   */
  flatMap<T2>(p_flatMap: (p: T) => Optional<T2>): Optional<T2> {
    return this.FIsPresent ? p_flatMap(this.FValue!) : none();
  }

  /**
   * do記法っぽいことをやるメソッドです。
   * 呼び出すたびに、戻り値がObjectに集約されていくため{@link flatMap}のネストを見やすく書き下せます。
   *
   * 具体的には以下の使い方例を参照ください。
   *
   * ```
   * // 成功例
   * const two_x = a => just(a * 2);
   * const four_x = a => just(a * 4);
   * const eight_x = a => just(a * 8);
   *
   * Do()
   *   .bind("a", _ => just(2))
   *   .bind("b", m => two_x(m.a))
   *   .bind("c", m => four_x(m.a))
   *   .bind("d", m => eight_x(m.a))
   *   .map(m => `2x=${m.b}, 4x=${m.c}, 8x=${m.d}`);
   *
   * // 失敗例
   * const two_x = a => just(a * 2);
   * const four_x = _ => none();     // 以降は呼ばれない
   *
   * Do()
   *   .bind("a", _ => just(2))
   *   .bind("b", m => two_x(m.a))
   *   .bind("c", m => four_x(m.a))
   *   .bind("d", _ => { throw new Error("呼ばれない") }) // 呼ばれない
   *   .map(_ => { throw new Error("呼ばれない") });      // 呼ばれない
   * ```
   *
   * なお、このメソッドを「{@link just()}」に呼び出す場合は、中身は必ずObjectである必要があります。
   *
   * そうでない場合の動作は不定です。{@link Do()}を用いると、空のObjectが戻るため
   * そこから始めると見た目がスマートになります。
   *
   * @param p_key
   *   指定した関数の戻り値が返す{@link Optional}の値を格納する、Objectのキー。
   *
   *   すでに前段の{@link bind}呼び出しで使ったキーを指定した場合は、その値は上書きされます。
   * @param p_flatmap
   *   {@link flatMap}に渡すのと同じ機能をする関数を渡します。
   *
   *   ここで戻した{@link Optional}が{@link just()}を返した場合は、その値がp_keyのキーの値を持つオブジェクトとなり
   *   現在のOptionalが持つオブジェクトとマージされた上で、値として格納されることになります。
   *
   *   これが{@link none()}を返した場合は全体がnoneとなり、それ以降の処理は実行されません。
   *
   * @return
   *   蓄積されたObjectを持つjustかnone状態のOptional
   */
  bind<K extends string, T2>(p_key: K, p_flatmap: (p: T) => Optional<T2>): Optional<T & {[p_key in K]: T2}> {
    return this.flatMap(a =>                              // 今がnoneならそれを返し、そうでないならば
      p_flatmap(a).map(b =>                               // 今のObject値を引数に「p_flatmap」を呼び出して、その結果を得て
        ({...a, ...({[p_key]: b}) as {[p_key in K]: T2}}) // その結果がnoneならそれを返し、そうでないなら今のObjectに「p_key」の値をキーに持つObjectを足して返す
      )
    );
  }

  private FIsPresent: boolean;
  private FValue: T | undefined;
}

/**
 * 引数に指定した値で{@link Optional}のインスタンスを作成します。
 * 値にnullやundefinedを指定した場合でも、有効な{@link Optional}が生成されます。
 *
 * @param p_value 包みたい値
 * @returns just値
 */
export function just<T>(p_value: T) : Optional<T> {
  return new Optional<T>(p_value);
}

/**
 * 値がないことを表す{@link Optional}を生成します。
 *
 * 基本的に型についてはTypeScriptが自動で推論してくれますが
 * 状況から推論することが不可能な場合は、明示的に指定もできます。
 *
 * ```
 * none<Hoge>();
 * ```
 *
 * @returns none状態の{@link Optional}
 */
export function none<T>() : Optional<T> {
  return new Optional<T>();
}

/**
 * 引数に指定した値で{@link Optional}のインスタンスを作成します。
 *
 * ただし、その値が「null」または「undefined」であるのなら「{@link none()}」が
 * それ以外なら「{@link just()}」が生成されます。
 *
 * @param p_value 包みたい値。
 * @returns 説明欄の通りのOptional
 */
export function ofNullable<T>(p_value: T) : Optional<T> {
  return (null == p_value) ? none<T>() : just<T>(p_value);
}

/**
 * 空オブジェクトを持つ{@link just()}を返します。
 *
 * これ自体は別に何か嬉しい機能があるわけではないですが、{@link Optional.bind}によるDo記法の起点として使います。
 *
 * @returns 空のオブジェクトを持つ{@link just()}
 */
export function Do() : Optional<{}> {
  return just({});
}
