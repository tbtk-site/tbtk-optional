import express from "express";
import { just, none } from "@tbtk-site/tbtk-optional";

const app = express();

function optionalTest(optional) {
  return optional.getOrElse("空文字");
}

app.get("/", (req, res) => {
  res.send(optionalTest(just("文字列は")) + optionalTest(none()));
});

app.listen(3000, () => {
  console.log(`Example app listening on port ${3000}`);
});
