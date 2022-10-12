## What is this?

This is a TypeScript implementation of the so-called Optional, Maybe, Option.

There are plenty of such libraries on the Web, but I could not find one with an API that was easy for me to use, so I created my own.

## Install

```bash
# npm
npm install @tbtk-site/tbtk-optional

# yarn
yarn add @tbtk-site/tbtk-optional
```

Using jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/npm/@tbtk-site/tbtk-optional/dist/index.min.js"></script>
```

RunKit Demo

[https://runkit.com/tbtk-site/634689649aecdd0008e362c6](https://runkit.com/tbtk-site/634689649aecdd0008e362c6)

## How to use

Please refer to the test case for detailed usage.

```typescript
import { just, none } from "@tbtk-site/tbtk-optional";

function optionalTest(optional) {
  return optional.getOrElse("none");
}

res.send(optionalTest(just("just")) + optionalTest(none())); // justnone
```

## DO notation style

Haskell has a syntax called DO notation, which allows you to glue monadic chains in a way that all intermediate results can be used.
This library provides Do and bind to write Optional chains in a similar way.

As an example, a function that doubles a number, a function that multiplies a number by 4, and a function that multiplies a number by 8 may all fail.
Suppose you have a "function that converts all intermediate results into strings" and want to call them by connecting them in a method chain.

If you don't want the intermediate result, you can just method chain the flatMap, but this time it's what you want.
I think that if you write this with flatMap naively, it will be nested as follows.

```typescript
const two_x = a => just(a * 2);
const four_x = a => just(a * 4);
const eight_x = a => just(a * 8);

just(2).flatMap(
  a => two_x(a).flatMap(
    b => four_x(a).flatMap(
      c => eight_x(a).map(
        d => `2x=${b}, 4x=${c}, 8x=${d}`
      )
    )
  )
);
```

It is not easy to read at all. This is what happens when you use Do and bind.

```typescript
const two_x = a => just(a * 2);
const four_x = a => just(a * 4);
const eight_x = a => just(a * 8);

Do()
  .bind("a", _ => just(2))
  .bind("b", m => two_x(m.a))
  .bind("c", m => four_x(m.a))
  .bind("d", m => eight_x(m.a))
  .map(m => `2x=${m.b}, 4x=${m.c}, 8x=${m.d}`);
```

Nesting is eliminated, which is beautiful. Naturally, even in Do, if none is reached in the middle of the process, subsequent processing is terminated.

```typescript
  const two_x = a => just(a * 2);
  const four_x = _ => none();     // Not called after that.

  Do()
    .bind("a", _ => just(2))
    .bind("b", m => two_x(m.a))
    .bind("c", m => four_x(m.a))
    .bind("d", _ => { throw new Error("Not called") }) // Not called
    .map(_ => { throw new Error("Not called") });      // Not called
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
