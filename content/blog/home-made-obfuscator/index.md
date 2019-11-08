---
title: "Простой самодельный обфускатор JavaScript "
date: "2019-09-25"
cover: ./maze.jpg
thumbnail: ./maze.jpg
draft: false
---

В этой статье я покажу как можно создать свой простой JavaScript обфускатор. Чтобы проиллюстрировать его работу, мы применим его к простому [fingerprinting скрипту](https://habr.com/ru/company/oleg-bunin/blog/321294/). В оставшейся части это поста, мы будем предполагать, что работаем в директории со следующей структурой:

```js
myObfuscator/
    dist/
    src/
    test/
```

Директория **src/** будет содержать исходный JavaScript код, в то время как **dist/** директория будет содержать трансплантированные или обфусцированные версии этих файлов. Наконец, в директории **test/** будет лежать файлы, проверяющий что код работает после обфусцирования.

В этом посте я попытаюсь привести полный рабочий пример. Тем не менее, если вы просто заинтересованы только реализацией обфускатора, можете пропустить следующий раздел.

## Fingerprinting script

Для лучшего понимая применения обфускации, используем маленький скрипт для идентификации, как пример для данной статьи. Никаких знаний об этой технологии не требуется, чтобы понять оставшуюся часть поста. Тем не менее, я коротко опишу, что это за технология.
Browser fingerprinting это техника, которая собирает набор атрибутов, относящихся к пользовательскому устройству и браузеру. Чтобы собрать эти атрибуты, мы можем использовать HTTP заголовки, отправляемые браузером и так же JavaScript APIs. В этом посте, мы будем использовать только JavaScript API. Полученный отпечаток можно использовать как для отслеживания пользователя, там и для защиты от ботов и сканеров (crawlers). В контексте безопасности fingerprinting'a компании часто хотя обфусцировать скрипт сбора информации, чтобы атакующим было сложнее узнать собранные атрибуты. Действительно, поскольку JavaScript выполняется в браузере, его необходимо отправить на компьютер пользователя. Таким образом, злоумышленники могут посмотреть на содержание скрипта, отсюда и необходимость обфускации. Тем не менее, следует соблюдать осторожность , поскольку оно не идеально. При необходимом времени и усилия, злоумышленники могут разобрать скрипт.

Мы используем простой скрипт с несколькими атрибутами, чтобы его было легче понять. В каталоге **src/** мы создаем файл с именем **SimpleFingerprintCollector.js**.

```javascript
class SimpleFingerprintCollector {
    constructor() {
        this.tests = [];
        this.fingerprint = {}
    }

    registerTest(name, test) {
        this.tests.push({
            name: name,
            fn: test
        });
    }

    async collect() {
        const testsPromises = [];

        for (let test of this.tests) {
            if (test.fn.constructor.name === 'AsyncFunction') {
                testsPromises.push(new Promise(async(resolve) => {
                    testsPromises.push(test.fn().then((resTest) => {
                        this.fingerprint[test.name] = resTest;
                    }, (err) => {
                        this.fingerprint[test.name] = err;
                    }))
                }));
            } else {
                try {
                    this.fingerprint[test.name] = test.fn();
                } catch (err) {
                    this.fingerprint[test.name] = err;
                }
            }
        }

        await Promise.all(testsPromises);
        return this.fingerprint;
    }
}

const fingerprintCollector = new SimpleFingerprintCollector();
```

Он содержит класс с тремя методами. Можно добавить отпечаток используя метод **fingerprintCollector.registerTest** и собрать их с помощью **fingerprintCollector.collect**.  

Затем в каталоге **src/** мы создаем подкаталог с именем **fingerprint/**. В **src/fingerprint/** мы разместим все наши тесты. Хотя нет необходимости отделять тесты от класса **SimpleFingerprintCollector**, я сделаю это в качестве примера, чтобы показать, как использовать Gulp для объединения файлов.

В **src/fingerprint/** мы добавили canvas fingerprinting:
```javascript
// src/fingerprint/canvas.js
fingerprintCollector.registerTest('canvas', () => {
    let res = {};
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 200;
    canvas.style.display = "inline";
    const context = canvas.getContext("2d");

    try {
        context.rect(0, 0, 10, 10);
        context.rect(2, 2, 6, 6);
        res.canvasWinding = context.isPointInPath(5, 5, "evenodd");
    } catch (e) {
        res.canvasWinding = 'unknown';
    }

    try {
        context.textBaseline = "alphabetic";
        context.fillStyle = "#f60";
        context.fillRect(125, 1, 62, 20);
        context.fillStyle = "#069";
        context.font = "11pt no-real-font-123";
        context.fillText("Cwm fjordbank glyphs vext quiz, 😃", 2, 15);
        context.fillStyle = "rgba(102, 204, 0, 0.2)";
        context.font = "18pt Arial";
        context.fillText("Cwm fjordbank glyphs vext quiz, 😃", 4, 45);

        context.globalCompositeOperation = "multiply";
        context.fillStyle = "rgb(255,0,255)";
        context.beginPath();
        context.arc(50, 50, 50, 0, 2 * Math.PI, !0);
        context.closePath();
        context.fill();
        context.fillStyle = "rgb(0,255,255)";
        context.beginPath();
        context.arc(100, 50, 50, 0, 2 * Math.PI, !0);
        context.closePath();
        context.fill();
        context.fillStyle = "rgb(255,255,0)";
        context.beginPath();
        context.arc(75, 100, 50, 0, 2 * Math.PI, !0);
        context.closePath();
        context.fill();
        context.fillStyle = "rgb(255,0,255)";
        context.arc(75, 75, 75, 0, 2 * Math.PI, !0);
        context.arc(75, 75, 25, 0, 2 * Math.PI, !0);
        context.fill("evenodd");
        res.image = canvas.toDataURL();

    } catch (e) {
        res.image = 'unknown';
    }

    return res;
});
```

Соберём информацию так же и о платформе:
```javascript
// src/fingerprint/platform.js
fingerprintCollector.registerTest('platform', () => {
    if (navigator.platform) {
        return navigator.platform
    }

    return 'unknown';
});
```
Добавим ещё несколько метрик... полный [код можно найти на GitHub](https://github.com/antoinevastel/simpleJSObfuscator).


## Сборка не обфусцированного скрипта.
После этого используем Gulp, для сборки не обфусцированной версии скрипта. Для этого создадим файл **gulpfile.js** в корне проекта. На данный момент мы объявим одну задачу в gulp файле. К концу поста мы добавим ещё несколько, для вызова обфускации и минификации.

```javascript
// gulpfile.js
const {series, src, dest } = require('gulp');
const concat = require('gulp-concat');

function concatScripts() {
    return src(['src/simpleFingerprintCollector.js', 'src/fingerprint/*.js'])
        .pipe(concat('simpleFingerprintCollector.js'))
        .pipe(dest('./dist/'));
}

exports.concat = concatScripts;
```

Из корня проекта вы можете собрать не обфусцированную версию скрипта выполнив `gulp concat` в терминале. Это сгенерирует **simpleFingerprintCollector.js** в папке **dist/**. В файле будет находится наш класс и несколько вариантов взятия атрибутов (canvas, платформа).
```javascript
// dist/simpleFingerprintCollector.js

class SimpleFingerprintCollector {
    ...
}

const fingerprintCollector = new SimpleFingerprintCollector();

fingerprintCollector.registerTest('adblock', () => {
    ...
    return result;
});

fingerprintCollector.registerTest('canvas', () => {
    ...
    return result;
});

// Другие тесты ...

fingerprintCollector.registerTest('screenResolution', () => {
    ...
    return result;
});
```

## Обфускация скрипта
Сейчас, когда у нас есть fingerprinting скрипт, мы можем обфусцировать его. Существует несколько различных подходов, простые или более сложные и эффективные и не очень. Вы можете почитать об этом более подробно в [другой статье](https://antoinevastel.com/obfuscation/2017/12/06/presentation-obfuscation.html)(англ.), где я рассказывают о основных техниках обфускации. В данном посте, мы будем использовать простую технику обфускации, которая <abbr title="consists">заключается</abbr> в замене статических строк и чисел, <abbr title="as well as">а так же</abbr> к свойствам и методам объекта с помощью вызова функции, чтобы сделать его менее читаемым. Если вы хотите нечто похожее, но production-ready решение, вы можете использовать [obfuscator.io](https://obfuscator.io/) или связанный с ним npm пакет. Техника, представленная в этом после довольно похожа на **String Array** опцию в их обфускаторе.

<abbr title="The way">То</abbr>, как я реализую обфускато, явно не оптимально. Более того, я <abbr title="not consistent">не использую один стиль</abbr> по всему коду. Идея состоит в том, чтобы показать различные пути манипулирования кодом и [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree). Я использую библиотеку [shift](https://shift-ast.org/), но можно использовать и другие. Например [Esprima](https://esprima.org/).




---
consists - заключается
as well as - так же как
either - тоже, любой

Оригинал: [A simple homemade JavaScript obfuscator](https://antoinevastel.com/javascript/2019/09/04/home-made-obfuscator.html)