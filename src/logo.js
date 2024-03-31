import chalk from "chalk";
import figlet from "figlet";

export const SpriteLogo = chalk.green(
  figlet.textSync("Sprite", {
    font: "Ghost",
    horizontalLayout: "default",
    verticalLayout: "default",
  })
);
