# 1. “vite” 를 terminal에 입력했을때 생기는 일

> 왜 command not found가 발생할까요?
![1](https://github.com/Sunset-Kim/generate-svg-icon-cli/assets/77092632/75c3252d-f8d9-4c19-9a5a-3617b26604fb)

```jsx
echo $PATH
```

## 동작원리를 유추하기

**`yarn run`** 또는 **`npm run`**을 사용할 때, 이 도구들은 자동으로 프로젝트의 **`node_modules/.bin`** 디렉토리를 현재 세션의 **`PATH`**에 일시적으로 추가합니다. 이를 통해 프로젝트의 로컬 의존성으로 설치된 실행 파일을 마치 전역에 설치된 것처럼 실행할 수 있게 됩니다. 이 과정은 명시적으로 경로를 지정하지 않고도 로컬 패키지의 실행 파일을 사용할 수 있도록 해줍니다.

### **작동 원리**

- **로컬 실행 파일 호출**: **`package.json`**의 **`scripts`** 항목에 정의된 스크립트를 실행할 때, **`npm`** 또는 **`yarn`**은 해당 스크립트에서 참조하는 명령어를 **`node_modules/.bin`** 디렉토리 내에서 먼저 찾습니다. 이 디렉토리에는 프로젝트의 모든 로컬 의존성이 설치될 때 함께 설치된 실행 가능한 파일들이 저장됩니다.
- **PATH 확장**: 스크립트 실행 시, **`npm`**과 **`yarn`**은 내부적으로 **`PATH`** 환경 변수를 임시로 수정하여 **`node_modules/.bin`**을 포함시킵니다. 이로 인해 해당 세션에서는 로컬에 설치된 패키지를 전역에 설치된 것처럼 사용할 수 있게 됩니다.
- **명령어 실행**: 이러한 방식으로, 사용자는 로컬 패키지를 쉽게 실행할 수 있으며, 프로젝트 간의 의존성 충돌을 방지할 수 있습니다. 예를 들어, 다른 프로젝트에서 다른 버전의 같은 도구를 사용할 때, 각각의 프로젝트 설정에 맞는 도구 버전을 사용할 수 있습니다.

### **직접 실행 파일 추가하기**

직접적으로 **`node_modules/.bin`**에 파일을 추가하는 것은 개발 환경에 변동을 줄 수 있으므로 일반적으로는 피해야 합니다. 하지만, 단순히 파일이 어떻게 추가되는지 보여주는 예시를 원한다면, 다음과 같은 방법으로 시뮬레이션할 수 있습니다.

- **임시 실행 파일 생성**: 예를 들어, **`hello-world.js`**라는 간단한 Node.js 스크립트를 작성하고, 이를 **`node_modules/.bin`** 디렉토리에 복사합니다.
- **[셔뱅](https://ko.wikipedia.org/wiki/%EC%85%94%EB%B1%85) 인터프리터 지시자**
  셔뱅(**`#!/usr/bin/env node`**)을 스크립트 파일의 첫 줄에 추가하는 주된 이유는 해당 스크립트가 직접 실행될 때 사용할 인터프리터를 지정하기 위해서입니다. 셔뱅 라인은 유닉스 기반 시스템에서 스크립트의 실행 환경을 설정하는 데 사용되며, 이 경우 Node.js 환경에서 스크립트를 실행하도록 지정합니다.
  ### **셔뱅의 구성요소**
  - **`#!`**: 이 조합은 셔뱅이라고 하며, 스크립트 파일이 실행될 때 사용해야 하는 인터프리터의 경로를 알려주는 역할을 합니다.
  - **`/usr/bin/env node`**: 이 부분은 **`env`** 명령어를 사용해 시스템에서 **`node`** 명령어의 위치를 동적으로 찾아내 실행하라는 의미입니다. **`env`**를 사용하는 이유는 시스템마다 **`node`**의 설치 위치가 다를 수 있기 때문에, 직접 경로를 지정하는 대신 **`env`** 명령어를 통해 해당 환경에서 **`node`**를 찾아 실행하도록 합니다.
  ### **셔뱅 사용의 중요성**
  - **이식성**: **`/usr/bin/env`**를 사용함으로써, 다양한 유닉스 기반 시스템에서 스크립트의 호환성을 높일 수 있습니다. 시스템마다 **`node`**의 설치 경로가 다를 수 있는데, **`env`**를 사용하면 이 문제를 해결할 수 있습니다.
  - **직접 실행**: 셔뱅이 포함된 스크립트 파일에 실행 권한을 부여(**`chmod +x yourscript.js`**)하면, 스크립트 파일을 직접 실행 파일처럼 사용할 수 있습니다. 이렇게 하면 사용자는 스크립트를 **`node yourscript.js`** 대신 **`./yourscript.js`**로 직접 실행할 수 있게 됩니다. 이는 특히 CLI 도구를 개발할 때 유용합니다.
  - **명확성**: 셔뱅을 사용하면 스크립트 파일을 보는 사람이 해당 파일이 Node.js 환경에서 실행되도록 의도되었음을 쉽게 알 수 있습니다. 이는 코드의 가독성과 유지 관리성을 높여줍니다.
  셔뱅 라인의 사용은 스크립트 파일이 더 이식성 있고, 사용하기 쉬우며, 목적이 명확해지도록 해줍니다

```bash
#!/bin/bash
echo 'hello world'

```

- **실행 권한 부여**: Unix 기반 시스템에서는 스크립트에 실행 권한을 부여해야 합니다.

```bash
chmod +x node_modules/.bin/hello
```

- **`package.json`에서 스크립트 설정**: **`package.json`**에 다음과 같이 스크립트를 추가합니다.

```json
"scripts": {
  "hello": "hello"
}
```

- **스크립트 실행**: 다음 명령어를 통해 스크립트를 실행합니다.

```bash
npm run hello
```

![2](https://github.com/Sunset-Kim/generate-svg-icon-cli/assets/77092632/28f7039c-8ef4-49ec-ae4d-42a3784fcf36)

> 깨달음1. `node_modules/.bin` 안에 스크립트를 추가할 수 있다면 우리는 그 명령어를 사용할 수 있다.

# 2. 깨달음의 확장

![3](https://github.com/Sunset-Kim/generate-svg-icon-cli/assets/77092632/e605b2cd-21ee-4670-954f-4554b1b24ad8)

vite library의 package.json

![4](https://github.com/Sunset-Kim/generate-svg-icon-cli/assets/77092632/cc555d31-3ce8-4105-b6bc-3618795a500c)

라이브러리를 만들 때 **`node_modules/.bin`** 디렉토리에 특정 실행 파일을 추가하고자 한다면, 라이브러리의 **`package.json`** 파일에서 **`bin`** 섹션을 설정하여 이를 구현할 수 있습니다. **`bin`** 속성을 사용하면 npm 패키지를 설치할 때 자동으로 **`node_modules/.bin`**에 명령어를 **링크**해줍니다. 이 방식은 패키지를 전역적으로(install -g) 또는 로컬 프로젝트 내에 설치할 때 유용하게 사용됩니다.

```bash
ls -l node_modules/.bin # 직접확인해보기
```

# 3. 본격적으로 만들어보기

## **입력값을 받아보기: Argument를 편하게 편집하는 yargs**

**`yargs`** 라이브러리는 Node.js에서 커맨드 라인 인터페이스(CLI)를 쉽게 만들고 관리할 수 있게 해주는 도구입니다. 사용자가 입력한 argument를 해석하고, 필요한 옵션을 쉽게 추가하며, 사용자에게 유용한 도움말과 가이드를 제공할 수 있습니다.

### 설치 방법

**`yargs`**를 사용하기 위해 먼저 npm을 통해 프로젝트에 설치해야 합니다.

```bash
npm install yargs
```

### 기본 사용법

**`yargs`**를 사용하여 명령어 옵션을 정의하고, 사용자의 입력을 쉽게 처리할 수 있습니다. 예를 들어, 입력 디렉토리와 출력 디렉토리를 지정하는 CLI 도구를 만들 때, 다음과 같이 **`yargs`**를 사용할 수 있습니다:

```jsx
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv))
  .option("i", {
    alias: "input",
    describe: "Input directory",
    type: "string",
    demandOption: true,
  })
  .option("o", {
    alias: "output",
    describe: "Output directory",
    type: "string",
    demandOption: true,
  })
  .help()
  .alias("help", "h")
  .parse();

console.log(`Input Directory: ${argv.i}`);
console.log(`Output Directory: ${argv.o}`);
```

### 고급 기능

- **명령어 정의**: **`yargs`**는 여러 명령어와 해당 명령어의 옵션을 정의할 수 있게 해줍니다. 각 명령어에 대한 처리 함수도 지정할 수 있어, 복잡한 CLI 애플리케이션을 구성하는 데 유용합니다.
- **도움말 자동 생성**: **`yargs`**는 옵션과 명령어에 대한 도움말을 자동으로 생성해줍니다. 사용자가 **`h`** 또는 **`-help`**를 사용하면, 등록된 옵션과 명령어에 대한 설명을 볼 수 있습니다.
- **입력 검증**: 옵션에 대한 입력값을 검증하고, 필수 옵션이 누락되었을 때 알림을 제공합니다. 사용자가 올바르지 않은 형식의 입력을 제공했을 때, 적절한 에러 메시지와 함께 도움말을 보여줄 수 있습니다.

## 더 예쁘게 보여주고 싶어 - chalk, boxen, figlet

CLI 애플리케이션의 사용자 경험을 향상시키고 싶다면, 텍스트 스타일링과 포맷팅 라이브러리인 Chalk, Boxen, 그리고 Figlet을 활용할 수 있습니다. 이 도구들은 커맨드 라인 인터페이스에 색상, 테두리, 아트웍 등을 추가하여, 사용자의 시선을 끌고 정보를 더 명확하게 전달할 수 있도록 도와줍니다.

### Chalk

Chalk는 터미널의 텍스트에 색상을 쉽게 추가할 수 있게 해주는 라이브러리입니다. 설치 후, 텍스트에 다양한 스타일을 적용할 수 있습니다.

```bash
npm install chalk

```

```jsx
import chalk from "chalk";

console.log(chalk.blue("Hello world!"));
console.log(chalk.red.bold.underline("Error!"));
```

### Boxen

Boxen은 텍스트 주변에 상자를 그려주는 라이브러리로, 중요한 메시지를 돋보이게 할 수 있습니다.

```bash
npm install boxen
```

```jsx
import boxen from "boxen";
import chalk from "chalk";

console.log(
  boxen(chalk.green("Success!"), {
    padding: 1,
    margin: 1,
    borderColor: "green",
  })
);
```

### Figlet

Figlet은 텍스트를 ASCII 아트로 변환해주는 라이브러리입니다. CLI 애플리케이션의 로고나 제목 등을 돋보이게 할 때 유용합니다.

```bash
npm install figlet
```

```jsx
import figlet from "figlet";

figlet("Hello World!", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
});
```

### 통합 예시

이 도구들을 조합하여 CLI 애플리케이션의 시작 메시지를 예쁘게 꾸며보겠습니다:

```jsx
import chalk from "chalk";
import boxen from "boxen";
import figlet from "figlet";

console.log(
  chalk.yellow(figlet.textSync("My CLI", { horizontalLayout: "full" }))
);

console.log(
  boxen(chalk.green("Welcome to My CLI!"), {
    padding: 1,
    borderColor: "green",
    margin: 1,
  })
);
```

Chalk, Boxen, Figlet을 활용하면, CLI 애플리케이션의 인터페이스를 더욱 매력적으로 만들어 사용자의 경험을 향상시킬 수 있습니다. 이러한 도구들은 정보를 전달하는 동시에 시각적인 즐거움을 제공하여, 사용자가 CLI와의 상호작용을 더 즐길 수 있게 만들어 줍니다.

## Svgo : svg를 최적화 하자

SVGO(SVG Optimizer)는 SVG 파일을 최적화하여 파일 크기를 줄이는 데 사용되는 도구입니다. 웹 페이지나 애플리케이션에서 SVG 파일을 사용할 때, 파일 크기가 작을수록 로딩 시간이 단축되고, 성능이 향상됩니다. SVGO는 불필요한 메타데이터, 주석, 공백 등을 제거하고, 경로를 단순화하는 등의 방법으로 SVG 파일을 최적화합니다.

### 설치 방법

SVGO는 Node.js 패키지로 제공되므로 npm을 통해 설치할 수 있습니다.

```bash
npm install -g svgo
```

글로벌 설치를 통해 CLI 도구로서 사용할 수 있으며, 프로젝트의 개발 의존성으로 추가하여 사용할 수도 있습니다.

### CLI로 사용하기

SVGO는 커맨드 라인 인터페이스를 제공합니다. 설치 후 다음과 같이 사용할 수 있습니다:

```bash
svgo input.svg
```

또는, 디렉토리 내의 모든 SVG 파일을 최적화하려면:

```bash
svgo -f path/to/svg/directory
```

### Node.js에서 사용하기

SVGO는 Node.js 스크립트 내에서도 사용할 수 있습니다. 이를 통해 자동화된 빌드 프로세스나 웹 애플리케이션 내에서 동적으로 SVG를 최적화할 수 있습니다.

```jsx
import { optimize } from "svgo";

const optimizedSvg = optimize(svgString, {
  // 옵션 설정
});

console.log(optimizedSvg.data);
```

### 옵션과 설정

SVGO는 다양한 최적화 옵션을 제공합니다. 예를 들어, 색상을 변환하거나, 특정 속성을 제거하는 등의 작업을 수행할 수 있습니다. `svgo.config.js` 파일을 생성하여 프로젝트별 설정을 관리할 수 있으며, 다음과 같이 구성할 수 있습니다:

```jsx
module.exports = {
  plugins: [
    { name: "removeDoctype", active: true },
    { name: "removeComments", active: true },
    {
      name: "cleanupNumericValues",
      active: true,
      params: { floatPrecision: 2 },
    },
    // 기타 플러그인 설정
  ],
};
```

### SVGO로 성능 향상

웹 사이트나 애플리케이션에서 SVG 파일의 크기를 최소화하면, 네트워크 대역폭 사용을 줄이고, 로딩 시간을 단축시킬 수 있습니다. 이는 사용자 경험을 개선하고, 특히 모바일 환경에서의 성능 이슈를 줄이는 데 도움이 됩니다. SVGO는 이러한 최적화 과정을 자동화하고, SVG 파일을 효율적으로 관리할 수 있게 해주는 강력한 도구입니다.

## SVG 스프라이트 만들기 : svg-sprite

`svg-sprite`는 여러 SVG 파일을 단일 스프라이트 시트로 결합하는 도구입니다. 웹 개발에서 스프라이트를 사용하면 HTTP 요청의 수를 줄이고, 페이지 로딩 시간을 단축시킬 수 있습니다. `svg-sprite`는 이러한 SVG 스프라이트 생성 과정을 자동화해주며, CSS, HTML, SVG 사용법 등 다양한 스프라이트 사용 시나리오를 지원합니다.

### 설치 방법

`svg-sprite`는 Node.js 패키지로 제공되므로 npm을 통해 설치할 수 있습니다. 프로젝트의 개발 의존성으로 추가하기 위해서는 다음과 같이 실행합니다:

```bash
npm install svg-sprite --save-dev

```

### 기본 사용법

`svg-sprite`를 사용하여 SVG 스프라이트를 생성하는 기본적인 방법은 아래와 같습니다. Node.js 스크립트를 통해 간단하게 SVG 파일들을 하나의 스프라이트로 결합할 수 있습니다.

```jsx
const SVGSprite = require("svg-sprite");
const path = require("path");
const fs = require("fs");

// SVGSprite 설정 객체 생성
const config = {
  mode: {
    symbol: {
      // 스프라이트 모드 설정 (예: symbol 모드)
      dest: "output", // 출력 디렉토리
      sprite: "sprite.svg", // 생성될 스프라이트 파일 이름
    },
  },
};

// 새로운 SVGSprite 인스턴스 생성
const spriter = new SVGSprite(config);

// SVG 파일 추가
fs.readdirSync("path/to/svg/files").forEach((file) => {
  if (path.extname(file) === ".svg") {
    spriter.add(
      path.resolve("path/to/svg/files", file),
      null,
      fs.readFileSync(file, { encoding: "utf-8" })
    );
  }
});

// 스프라이트 생성
spriter.compile((error, result) => {
  for (let mode in result) {
    for (let resource in result[mode]) {
      fs.writeFileSync(
        path.join("output", resource),
        result[mode][resource].contents
      );
    }
  }
});
```

### 설정과 옵션

`svg-sprite`는 여러 가지 모드(`css`, `view`, `defs`, `symbol`, `stack` 등)를 지원하며, 각 모드에 따라 다양한 설정을 제공합니다. 예를 들어, `css` 모드에서는 CSS 파일을 함께 생성할 수 있고, `symbol` 모드에서는 SVG 파일을 `<symbol>` 태그로 변환하여 HTML 내에서 사용하기 용이하게 만들어줍니다.

### SVG 스프라이트의 이점

- **네트워크 요청 감소**: 여러 SVG 파일을 하나의 파일로 결합함으로써, 웹 페이지나 애플리케이션에서 필요한 네트워크 요청의 수를 줄일 수 있습니다.
- **성능 향상**: 페이지 로딩 시간 단축 및 사용자 경험 개선.
- **유지보수 용이**: 공통 아이콘, 로고 등의 SVG 그래픽을 한 곳에서 관리할 수 있어 유지보수가 편리합니다.

`svg-sprite`를 사용하여 SVG 스프라이트를 생성함으로써 웹 개발 프로젝트의 효율성을 높이고, 성능을 최적화할 수 있습니다.
