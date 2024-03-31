#!/usr/bin/env node
import chalk from "chalk";
import boxen from "boxen";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import figlet from "figlet";
import pkg from "../src/index.cjs";
const { generateSpriteAndMetadata } = pkg;

const Sprite = figlet.textSync("Sprite", {
  font: "Ghost",
  horizontalLayout: "default",
  verticalLayout: "default",
});

const usage = chalk.green(
  boxen(chalk.green("\n" + Sprite + "\n"), {
    padding: 1,
    borderColor: "green",
    dimBorder: true,
  }) +
    "\n" +
    "Usage: mycli -i <inputDir> -o <outputDir> \n"
);

const argv = yargs(hideBin(process.argv))
  .usage(usage)
  .option("i", {
    alias: "input Directory",
    describe: "Input directory",
    type: "string",
    demandOption: true,
  })
  .option("o", {
    alias: "output Directory",
    describe: "Output directory",
    type: "string",
    demandOption: true,
  })
  .help(true)
  .parse();

generateSpriteAndMetadata(argv.i, argv.o);
