+++
categories = ["Web", "Computer Graphics"]
date = "2017-07-28T21:00:38+03:00"
draft = false
excerpt = "Продолжение первой стать, где от простой геометрии перейдём к созданию туннеля из частиц"
image = "tunnel-animation-2/cover.jpg"
tags = ["HTML","JavaScript", "WebGL", "3D", "ThreeJS", "spline", "light", "point", "random color"]
thumbnail = "tunnel-animation-2/thumbnail.jpg"
title = "Эффект путешествия в туннеле - Часть 2"

[translate]
  avatar = "tunnel-animation-2/avatar.jpg"
  name = "Louis Hoebregts"
  url = "https://codepen.io/Mamboleoo/post/tunnel-animation-2"
+++

<div class="alert">
Это вторая часть гайда по созданию эффекта путешествия в туннеле.<br>
Если вы не читали первую статью, то пожалуйста, перейдите оп ссылке :<br>
<a rel="noreferrer" href="http://grishy.ru/post/tunnel-animation-1/">Анимация туннеля - Часть 1</a>
</div>

С возвращением! 🖖 Спасибо что продолжаете читать, я предполагаю что первая часть вам понравилась и вы хотели бы узнать больше! Как я и сказал в конце прошлой части, вы сейчас увидите как сгенерировать туннель с помощью частиц, вместо поверхности `TubeGeometry()`.

<ul class="examples">
  <li>
    <a rel="noreferrer" href="https://codepen.io/Mamboleoo/full/NdGPvJ/">
      <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/127738/tunnel_mario.jpg">
    </a>
    <span class="legend">Это один из видов эффекта, который вы сможете создать в конце</span>  
  </li>
</ul>

{{% toc %}}
<!-- TOC -->

- [Вычисление позиции частиц](#вычисление-позиции-частиц)
- [Создание трубы](#создание-трубы)
- [Заставляем все двигаться](#заставляем-все-двигаться)
- [Немного безумства](#немного-безумства)
    - [Яркие туннели](#яркие-туннели)
    - [Квадратная пещера](#квадратная-пещера)
    - [Восьмигранные туннели](#восьмигранные-туннели)

<!-- /TOC -->
{{% /toc %}}

## Вычисление позиции частиц
Чтобы сделать, что мы задумали, надо генерировать круги частиц на всем протяжении пути. Three.js использует такой же способ генерации геометрии трубы, с одним отличием, что он использует грани для создания поверхности трубы.  
Для начала нам надо уточнить некоторые детали:  

* Радиус  
* Кол-во сегментов  
* Кол-во частиц в одном сегменте  
  
```javascript
// Кол-во кругов, из которых будет состоять весь маршрут
var segments = 500;
// Кол-во частей, которые будут формировать каждый круг
var circlesDetail = 10;
// Радиус трубы
var radius = 5;
```

Сейчас мы знаем кол-во частиц, которы нам надо для всего туннеля <span class="small">(спойлер: segments * circlesDetail)</span>, теперь нам надо вычислить `Frenet frames`.  
Если честно, я не эксперт в этой области <span class="small">(слова автора оригинальной статьи 😉 )</span>, но насколько я понял, frenet frames это значения вычисленные для всех сегментов трубы. Каждый кадр сделан при помощи векторов: касательной, нормали и бинормали (перпендикулярна двум предыдущим). Грубо говоря, эти значения показывают значение поворота для каждого сегмента и  куда он смотрит.  
Если вы хотите узнать как находятся эти значения, то советую прочитать эту [статью на  Wikipedia](https://ru.wikipedia.org/wiki/%D0%A2%D1%80%D1%91%D1%85%D0%B3%D1%80%D0%B0%D0%BD%D0%BD%D0%B8%D0%BA_%D0%A4%D1%80%D0%B5%D0%BD%D0%B5).  
Благодаря Three.js нам не надо понимать, как это все работает и мы можем использовать функцию для генерации кадров (frames) из нашего пути.

```javascript
var frames = path.computeFrenetFrames(segments, true);
// Второй параметр показывает наш путь закрыт или нет, в нашем случае это true.
```

В возвращаемым значение этой функции будет три массива `Vector3()`.  
![](/image/tunnel-animation-2/frenetFrames.jpg)  
Сейчас у нас есть все, что нужно для каждого сегмента и мы можем начать генерировать частицы для каждого сегмента. Мы будем хранить каждую частицу как `Vector3()` в `Geometry()`, чтобы использовать позже.
```js
// Создать пустую Geometry, куда мы будем записывать все частицы
var geometry = new THREE.Geometry();
```
Сейчас у нас есть положение каждой частицы сегмента. Это то, почему я буду итерироваться по всем сегментам. Я не буду описывать как это работает, все можно понять по коду и комментария к нему ниже! ⬇️
```js
// Цикл по всем сегментам
for (var i = 0; i < segments; i++) {

    // Получение значения нормали сегмента из Frenet frames
    var normal = frames.normals[i];
    // Получение значения бинормали сегмента из Frenet frames
    var binormal = frames.binormals[i];

    // Вычисление индекса сегмента (от 0 до 1)
    var index = i / segments;

    // Получение координат точки в центре сегмента
    // Мы используем функию, которая применялась для передвижения
    // камеры в первой части
    var p = path.getPointAt(index);

    // Цикл для частиц, находящимся на каждом сегменте
    for (var j = 0; j < circlesDetail; j++) {

        // Клонирование точки в центр круга
        var position = p.clone();

        // Нам нужно получить позицию каждой точки, основываясь
        // на угле от 0 до Pi*2
        // Если вы хотите получить только половину трубы (как 
        // на водной горке) то надо вычислить значения от 0 до Pi.
        var angle = (j / circlesDetail) * Math.PI * 2;

        // Вычисление синуса угла
        var sin = Math.sin(angle);
        // Вычисление отрицательного косинуса угла
        var cos = -Math.cos(angle);

        // Вычисление нормали (длинна равна единице прим. перев.
        // каждой точки, основываясь на угле и
        // векторов нормали, бинормали каждого сегмента.
        var normalPoint = new THREE.Vector3(0,0,0);
        normalPoint.x = (cos * normal.x + sin * binormal.x);
        normalPoint.y = (cos * normal.y + sin * binormal.y);
        normalPoint.z = (cos * normal.z + sin * binormal.z);

        // Умножаем полученный вектор на радиус, чтобы у нас не была труба с единичным радиусом
        normalPoint.multiplyScalar(radius);

        // Добавляем значение нормали к центру круга
        position.add(normalPoint);

        // И добавляем вектор в нашу геометрию.
        geometry.vertices.push(position);
    }
}
```
Фуух, это самый сложный участок нашего проекта, который не так прост для понимания. Мне даже пришлось лазить в исходники Three.js, чтобы убедиться в том, что я не накосячил.  
  
Вы можете проверить как это работает, посмотрев демо ниже, и увидеть как частицы добавляются одна за другой.  
<span class="small">(Нажмите Ruturn, если вы потеряли туннель)</span>

<p data-height="420" data-theme-id="dark" data-slug-hash="Npmqyo" data-default-tab="result" data-user="Mamboleoo" data-embed-version="2" data-pen-title="Calculate the positions of the particles" class="codepen">See the Pen <a href="https://codepen.io/Mamboleoo/pen/Npmqyo/">Calculate the positions of the particles</a> by Louis Hoebregts (<a href="https://codepen.io/Mamboleoo">@Mamboleoo</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Создание трубы
Сейчас у нас есть объект Geometry с вершинами. В Three.js мы  можем создать прекрасное демо из частиц, используя `Points` конструктор. Это позволит вам рендерить простые точки с прекрасной производительностью. Вы можете видоизменить эти точки, например поменяв цвет или выбрав текстуру для них.  
Точно так же, как когда-то мы создавали `Mesh`, нам опять понадобятся две вещи для создания объекта `Points`. Нам нужен материал и геометрия. С прошлого шага у нас есть геометрия, остается только определить материал.

```js
var material = new THREE.PointsMaterial({
    size: 1, // Размер каждой точки
    sizeAttenuation: true, 
    // Если мы хотим, чтобы точка изменяла свои в размеры в
    // зависимости от расстояния до камеры
    color: 0xff0000 // Цвет точки
});
```
Наконец, мы создаем наш объект Points и добавляем его на сцену таким образом:
```js
var tube = new THREE.Points(geometry, material);
scene.add(tube);
```

<p data-height="440" data-theme-id="dark" data-slug-hash="aWzGrJ" data-default-tab="result" data-user="Mamboleoo" data-embed-version="2" data-pen-title="Create the tube" class="codepen">See the Pen <a href="https://codepen.io/Mamboleoo/pen/aWzGrJ/">Create the tube</a> by Louis Hoebregts (<a href="https://codepen.io/Mamboleoo">@Mamboleoo</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Заставляем все двигаться
Чтобы все пришло в движение, мы переиспользуем некоторый код из прошлой части.
```js
var percentage = 0;
function render() {

  // Увеличиваем процент
  percentage += 0.0005;
  // Получаем точку, где камера должна находиться
  var p1 = path.getPointAt(percentage % 1);
  // Получаем точку, куда должна смотреть камера
  var p2 = path.getPointAt((percentage + 0.01) % 1);
  camera.position.set(p1.x, p1.y, p1.z);
  camera.lookAt(p2);

  // Рендерим цену
  renderer.render(scene, camera);

  // Вызываем следующий кадр
  requestAnimationFrame(render);
}
```

🎉 Ураа, у нас наконец-то появился уровень, сделанный из частиц 🎉
<p data-height="440" data-theme-id="dark" data-slug-hash="evxYob" data-default-tab="result" data-user="Mamboleoo" data-embed-version="2" data-pen-title="Moving particle tunnel" class="codepen">See the Pen <a href="https://codepen.io/Mamboleoo/pen/evxYob/">Moving particle tunnel</a> by Louis Hoebregts (<a href="https://codepen.io/Mamboleoo">@Mamboleoo</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Немного безумства
Что мы узнали во второй части достаточно для создания неограниченного кол-ва туннелей! Ниже находятся примеры туннелей, которые были основаны на том, что мы узнали в этой части.

### Яркие туннели
Для этого примера я задаю для каждой точки случайный цвет. Ещё я добавил туман на сцену, для создания эффекта затухания в туннеле.

<p data-height="380" data-theme-id="dark" data-slug-hash="BWMyZr" data-default-tab="result" data-user="Mamboleoo" data-embed-version="2" data-pen-title="Crazy 4" class="codepen">See the Pen <a href="https://codepen.io/Mamboleoo/pen/BWMyZr/">Crazy 4</a> by Louis Hoebregts (<a href="https://codepen.io/Mamboleoo">@Mamboleoo</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

```js
// В начале создадим новый цвет, основываясь на индексе
var color = new THREE.Color("hsl(" + (index * 360 * 4) + ", 100%, 50%)");
// Добавить новый цвет в массив всех цветов, расположенных в Geometry
geometry.colors.push(color);

var material = new THREE.PointsMaterial({
  size: 0.2,
  vertexColors: THREE.VertexColors // Мы указываем, что цве надо брать из Geometry
});

// Добавить немножко тумана на сцену
scene.fog = new THREE.Fog(0x000000, 30, 150);
```

### Квадратная пещера
В этом примере я использовал только Кубы. Для их расстановки я использовал объект `Points`, я создаю новый Mesh для каждой позиции точки. Ещё я раскашиваю его, основываясь на шуме Перлина.

<p data-height="380" data-theme-id="dark" data-slug-hash="OpdPvZ" data-default-tab="result" data-user="Mamboleoo" data-embed-version="2" data-pen-title="Crazy 5" class="codepen">See the Pen <a href="https://codepen.io/Mamboleoo/pen/OpdPvZ/">Crazy 5</a> by Louis Hoebregts (<a href="https://codepen.io/Mamboleoo">@Mamboleoo</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

### Восьмигранные туннели
<p data-height="380" data-theme-id="dark" data-slug-hash="EmaReQ" data-default-tab="result" data-user="Mamboleoo" data-embed-version="2" data-pen-title="Crazy 6" class="codepen">See the Pen <a href="https://codepen.io/Mamboleoo/pen/EmaReQ/">Crazy 6</a> by Louis Hoebregts (<a href="https://codepen.io/Mamboleoo">@Mamboleoo</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
Тут я соединил точки в каждом сегменте, для создания линии. Я поигрался с углом и цветом для создания иллюзии поворота.
```js
for (var i = 0; i < tubeDetail; i++) {
    // Создания новой геометрии для каждого сегмента
    var circle = new THREE.Geometry();
    for (var j = 0; j < circlesDetail; j++) {
        // Добавить позицию каждой вершины
        circle.vertices.push(position);
    }
    // Создаем дубликат первой вершины для создания замкнутой линии
    circle.vertices.push(circle.vertices[0]);
    // Создаем материал с уникальным цветом
    var material = new THREE.LineBasicMaterial({
        color: new THREE.Color("hsl("+(noise.simplex2(index*10,0)*60 + 300)+",50%,50%)")
    });
    // Создание объекта линии
    var line = new THREE.Line(circle, material);
    // Добавляем его на сцену
    scene.add(line);
}
```
 ---
Спасибо за прочтение моего поста о создании эффекта путешествия в туннеле!  
Пожалуйста, не стесняётесь задавать вопросы в комментариях, если вам что-то не понятно. 😉


<style>
.examples {
    list-style-type: none;
    margin-left: 0 !important;
}

.examples .legend {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 0.8em;
    padding: 5px 0;
    font-style: italic;
}
.examples a {
    text-decoration: none;
    border: none;
    display: block;
    transition: 0.2s ease-out;
    font-size: 0;
}
.examples a:hover {
    opacity: 0.8;
}

.alert {
    text-align: center;
    font-size: 1em;
    margin-bottom: 2em;
}

.alert:before {
    font-size: 1.3em;
    content: "⚠️";
    display: block;
    font-style: initial;
}


.small {
    font-size: 0.8em;
    font-style: italic;
}
</style>
