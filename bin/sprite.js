#!/usr/bin/env node
import chalk from "chalk";
import boxen from "boxen";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { generateSpriteAndMetadata } from "../src/index.js";
import { SpriteLogo } from "../src/logo.js";
import ora from "ora";
import clear from "clear";

const usage = chalk.green(
  boxen(chalk.green("\n" + SpriteLogo + "\n"), {
    padding: 1,
    borderColor: "green",
    dimBorder: true,
  }) +
    "\n" +
    "Usage: sprite -i <inputDir> -o <outputDir> \n"
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

clear();
const spinner = ora("Processing your SVGs...\n").start();

generateSpriteAndMetadata(argv.i, argv.o)
  .then(() => {
    spinner.succeed(
      chalk.greenBright("Sprite and metadata generated successfully\n")
    );
  })
  .catch((error) => {
    spinner.fail(
      chalk.redBright("Error occurred while generating sprite and metadata\n")
    );
  });
