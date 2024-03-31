import fs from "fs";
import path from "path";
import SVGSprite from "svg-sprite";
import chalk from "chalk";
import { parseStringPromise } from "xml2js";
import { optimize } from "svgo";
import boxen from "boxen";
import { SpriteLogo } from "./logo.js";

async function extractMetadata(filePath) {
  const svgContent = fs.readFileSync(filePath, "utf-8");
  const result = await parseStringPromise(svgContent);
  return {
    width: result.svg.$.width,
    height: result.svg.$.height,
  };
}

function createSprite(svgFiles, inputDir) {
  const sprite = new SVGSprite({
    mode: {
      symbol: {
        dest: ".",
        sprite: "sprite.svg",
      },
    },
  });

  svgFiles.forEach((file) => {
    const filePath = path.join(inputDir, file);
    const svgContent = fs.readFileSync(filePath, "utf-8");
    const optimizedSvgContents = optimize(svgContent, { path: filePath });

    if (optimizedSvgContents.error) {
      console.log(
        chalk.red("Failed to optimize SVG:", optimizedSvgContents.error)
      );
      return;
    }

    sprite.add(filePath, null, optimizedSvgContents.data); // 가정한 너비와 높이 값입니다.
  });

  return sprite;
}

// 스프라이트 파일을 최적화하고 저장하는 함수를 프로미스 기반으로 변경
function saveSprite(sprite, outputDir) {
  return new Promise((resolve, reject) => {
    sprite.compile((error, result) => {
      if (error) {
        console.log(chalk.red("Failed to compile sprite:", error));
        reject(error);
        return;
      }
      for (const mode in result) {
        for (const resource in result[mode]) {
          const svgContents = result[mode][resource].contents.toString("utf-8");

          fs.mkdirSync(path.dirname(outputDir), {
            recursive: true,
          });
          fs.writeFileSync(path.join(outputDir, "sprite.svg"), svgContents);
        }
      }
      resolve();
    });
  });
}

function createOutputDir(outputDir) {
  const isExist = fs.existsSync(outputDir);

  if (isExist) {
    console.log(chalk.blue("Output directory already exists"));
    return;
  }

  fs.mkdirSync(outputDir, { recursive: true });
}

export async function generateSpriteAndMetadata(inputDir, outputDir) {
  const svgFiles = fs
    .readdirSync(inputDir)
    .filter((file) => file.endsWith(".svg"));
  const metaInfo = {};

  for (const file of svgFiles) {
    const filePath = path.join(inputDir, file);
    metaInfo[path.basename(file, ".svg")] = await extractMetadata(filePath);
  }

  createOutputDir(outputDir);

  const sprite = createSprite(svgFiles, inputDir);
  await saveSprite(sprite, outputDir);

  fs.writeFileSync(
    path.join(outputDir, "sprite.json"),
    JSON.stringify(metaInfo, null, 2)
  );

  console.log(
    SpriteLogo +
      "\n" +
      boxen(chalk.greenBright("Sprite and metadata generated successfully"), {
        padding: 1,
        borderColor: "green",
        dimBorder: true,
      })
  );
}
