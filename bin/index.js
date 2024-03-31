#!/usr/bin/env node
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const argv = yargs(hideBin(process.argv))
  .usage("$0 [옵션]", "명령어 사용법")
  .option("l", {
    alias: "language",
    describe: "Translate to language",
    type: "string",
    demandOption: false,
  })
  .option("s", {
    alias: "sentence",
    describe: "Sentence to be translated",
    type: "string",
    demandOption: false,
  })
  .help(true)
  .demandOption(true)
  .parse();
