+++
categories = ["Web", "Computer Graphics"]
date = "2017-07-28T11:00:38+03:00"
draft = false
excerpt = "Рассмотрим создание анимации перемещения по туннелю с помощью Three.JS"
image = "tunnel-animation-1/cover.jpg"
tags = ["HTML","JavaScript", "WebGL", "3D", "ThreeJS", "spline", "light"]
thumbnail = "tunnel-animation-1/thumbnail.jpg"
title = "Анимация туннеля - Часть 1"

[translate]
  avatar = "tunnel-animation-1/avatar.jpg"
  name = "Louis Hoebregts"
  url = "https://codepen.io/Mamboleoo/post/tunnel-animation-1"
+++

Привет, читатель! 👋  
Есть одна вещь, которую я действительно люблю, это туннельную анимацию 😍. Не понимаешь о чём?
Тогда посмотри мои демки, которые я делал раньше:

<ul class="examples">
  <li>
    <a rel="noreferrer" href="https://codepen.io/Mamboleoo/full/NdGPvJ/">
      <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/127738/tunnel_mario.jpg">
    </a>
  </li>
<li>
  <a rel="noreferrer" href="https://codepen.io/Mamboleoo/full/qqQbzv/">
    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/127738/tunnel_torus.jpg">
  </a>
  </li>
<li>
  <a rel="noreferrer" href="https://codepen.io/Mamboleoo/full/LbMOLZ/">
    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/127738/tunnel_pool.jpg">
  </a>
  </li>
<li>
  <a rel="noreferrer" href="https://codepen.io/Mamboleoo/full/mJWLVJ/">
    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/127738/tunnel_dot.jpg">
  </a>
  </li>
</ul>

<style>
.examples {
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    margin-left: 0 !important;
}
.examples li {
    flex-basis: calc(50% - 5px);
    flex-grow: 1;
}
.examples li:nth-child(even) {
    margin-left: 10px;
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
</style>

Я даже использовал этот тип анимации для своей поздравительной открытки 2017 года.  
<ul class="examples">
  <li>
    <a rel="noreferrer" href="http://2017.emakina.com/">
      <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/127738/tunnel_emakina.jpg">
    </a>
  </li>
</ul>

Я попытаюсь в этом посте раскрыть основные моменты создания таких демок. Первым шагом нам надо создать трубу и анимацию перемещения в ней. А далее уже будем изменять внешний вид трубы и как то её приводить в божеский вид.

Для это демо я собираюсь использовать [Three.js](https://threejs.org/) для всего, что относится к WebGL. Если вы понимаете, что  ничего не понимаете в WebGL и Three.js частности, то вы можете прочитать пост [Rachel Smith](https://codepen.io/rachsmith/post/beginning-with-3d-webgl-pt-1-the-scene) об этом. (На английском) 

{{% toc %}}
<!-- TOC -->

- [Настройка сцены](#настройка-сцены)
- [Создание геометрии трубы](#создание-геометрии-трубы)
- [Создание трубы из SVG полигонов](#создание-трубы-из-svg-полигонов)
- [Перемещение камеры внутри трубы](#перемещение-камеры-внутри-трубы)
- [Добавляем освещение](#добавляем-освещение)
- [Давайте оторвемся](#давайте-оторвемся)

<!-- /TOC -->
{{% /toc %}}


## Настройка сцены

Для начала я добавлю в<!--  --> моё демо все, что нужно для инициализации сцены Three.js

* `canvas` элемент в HTML
* Немного CSS для лучшего вида
* Рендеринга WebGL'ом сцены, камеры и красного куба, чтобы быть уверенным, что все работает нормально.

Не забудьте подключить Three.js библиотеку в вашу демку/страницу.

<p data-height="265" data-theme-id="dark" data-slug-hash="qrpGXx" data-default-tab="result" data-user="Mamboleoo" data-embed-version="2" data-pen-title="Setup the scene" class="codepen">See the Pen <a href="https://codepen.io/Mamboleoo/pen/qrpGXx/">Setup the scene</a> by Louis Hoebregts (<a href="https://codepen.io/Mamboleoo">@Mamboleoo</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Если вы видите красный вращающийся куб, это значит что все отлично и можно продолжать 📦 !

## Создание геометрии трубы
Чтобы создать трубу в Three.js нам надо в начале создать путь её следования. Для этого будем использовать `THREE.CatmullRomCurve3()` конструктор. Он позволяет  нам создать сглаженную линию из массива вершин. Для этого демо, я просто создам массив, который еонвернирую в `Vector3()`.

Когда у нас есть наш массив вершин, мы можем создать путь с помощью конструктора функции.
```javascript
// Жестко закодированный массив точек
var points = [
    [0, 2],
    [2, 10],
    [-1, 15],
    [-3, 20],
    [0, 25]
];

// Переводим массив точек в вершины
for (var i = 0; i < points.length; i++) {
    var x = points[i][0];
    var y = 0;
    var z = points[i][1];
    points[i] = new THREE.Vector3(x, y, z);
}
// Создание пути из вершин
var path = new THREE.CatmullRomCurve3(points);
```

Получив путь, мы теперь можем создать трубу, основываясь на них.
```javascript
// Создание геометрии трубы из пути
// 1й параметр это сам путь
// 2й параметр это кол-во сегментов, из которых будет сделана труба
// 3й параметр это радиус трубы
// 4й параметр это кол-во сегментов по радиусу
// 5й параметр это специфический памеремт, если мы хотим закрытую трубу или нет
var geometry = new THREE.TubeGeometry( path, 64, 2, 8, false );
// Добавим материал с красным цветом
var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
// Создание меша
var tube = new THREE.Mesh( geometry, material );
// Добавляем трубу на сцену
scene.add( tube );
```

<p data-height="265" data-theme-id="dark" data-slug-hash="LWeomr" data-default-tab="result" data-user="Mamboleoo" data-embed-version="2" data-pen-title="Create a tube geometry" class="codepen">See the Pen <a href="https://codepen.io/Mamboleoo/pen/LWeomr/">Create a tube geometry</a> by Louis Hoebregts (<a href="https://codepen.io/Mamboleoo">@Mamboleoo</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Теперь мы можем видеть красную, вращающуюся трубу на сцене 😊.

## Создание трубы из SVG полигонов

В большинстве  случаев нам не надо просто записывать точки пути на наш код. Вы можете написать функцию генерации случайного набора точек с помощью одного из алгоритмов. Но в нашем случае мы можем взять значения из **SVG**, который мы создадим в одном из векторных редакторов, например в _Adobe Illustrator_.  
Если в не выберите кривые безье на созданной кривой, то Illustrator экспортирует ваш путь в виде многоугольников следующим образом:

```html
<svg viewBox="0 0 346.4 282.4">
	<polygon points="68.5,185.5 1,262.5 270.9,281.9 345.5,212.8 178,155.7 240.3,72.3 153.4,0.6 52.6,53.3 "/>
</svg>
```
Этот многоугольник вы можете преобразовать вручную в массив:
```javascript
var points = [
    [68.5,185.5],
    [1,262.5],
    [270.9,281.9],
    [345.5,212.8],
    [178,155.7],
    [240.3,72.3],
    [153.4,0.6],
    [52.6,53.3],
    [68.5,185.5]
];
// Не забудьте установить последний параметр как True, чтобы труба была замкнутой
var geometry = new THREE.TubeGeometry( path, 300, 2, 20, true );
```
Так же, если вы достаточно ленивы для того, чтобы каждый раз брать вручную набор координат, мы можете создать функцию для автоматического конвертации SVG строки в массив 😉
<p data-height="397" data-theme-id="dark" data-slug-hash="zZpQyp" data-default-tab="result" data-user="Mamboleoo" data-embed-version="2" data-pen-title="Create a tube from a SVG polygon" class="codepen">See the Pen <a href="https://codepen.io/Mamboleoo/pen/zZpQyp/">Create a tube from a SVG polygon</a> by Louis Hoebregts (<a href="https://codepen.io/Mamboleoo">@Mamboleoo</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Перемещение камеры внутри трубы

Теперь у нас есть труба, нам осталась самая важная часть - анимация!  
Мы будем использовать полезную функцию нашей траектории `path.getPointAt(t)`.
Эта функция возвращает координаты на нашей траектории в зависимости от _процента_. Процент (t) - это нормализованное значение от 0 до 1. Нулевое значение это начало пути, а Единица это последняя точка нашего пути.
  
Мы используем функию, которая на каждом кадре будет перемещать камеру внутри. Нужно ещё увеличивать **t** каждый кадр, чтобы магия сработала.

```javascript
// Начинаем с 0 процентов
var percentage = 0;
function render(){
    // Увеличиваем процент
    percentage += 0.001;
    // Получаем координату в  зависимости от нашего процента
    var p1 = path.getPointAt(percentage%1);
    // Устанавливаем камеру в эти координаты
    camera.position.set(p1.x,p1.y,p1.z);

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);
```

Поскольку `.getPointAt()` принимает значение только от 0 до 1, то нам надо взять остаток от деления на единицу, чтобы он не когда становился больше единицы.  
  
Это будет работать отлично, Сейчас камера всегда смотрит в одном направлении. Для исправления этого нам надо сделать, чтобы камера смотрела на точку, которая так же находится на нашей траектории, но немного дальше. Теперь каждый кадр мы будем вычислять точку где камера должна оказаться и куда она будет смотреть.

```javascript
var percentage = 0;
function render(){
    percentage += 0.001;
    var p1 = path.getPointAt(percentage%1);
    // Получить другую точку на нашем пути, но чуть дальше
    var p2 = path.getPointAt((percentage + 0.01)%1);
    camera.position.set(p1.x,p1.y,p1.z);
    // Повернуть камеру в направлении второй точки
    camera.lookAt(p2);

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
```
Так же нам надо обновить наш материал. У нас есть материал, но тогда стенки трубы смотрели наружу. Сейчас же наша камера ВНУТРИ трубы и следовательно стенки надо развернуть внутрь. И так как у нас пока нет освещения на сцене, мы переключимся на режим отображения сетки, так что мы легко сможем увидеть что происходит.
```javascript
var material = new THREE.MeshBasicMaterial({
    color: 0xff0000, // Красный цвет
    side : THREE.BackSide, // Развернуть стенки внутрь
    wireframe:true // Отображать трубу как сетку
});
```
И вуаля, наша камера летит внутри трубы! 🎉
<p data-height="550" data-theme-id="dark" data-slug-hash="QpaXWG" data-default-tab="result" data-user="Mamboleoo" data-embed-version="2" data-pen-title="Move the camera inside the tube" class="codepen">See the Pen <a href="https://codepen.io/Mamboleoo/pen/QpaXWG/">Move the camera inside the tube</a> by Louis Hoebregts (<a href="https://codepen.io/Mamboleoo">@Mamboleoo</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Добавляем освещение
Я не собираюсь вдаваться в подробности освещения в этом посте, поэтому я просто покажу как настроить освещение в нашё трубе. Принцип будет таким же как с камерой, мы будем использовать координаты точки где находится камера, для расположения источника освещения. 

* Для начале создадим PointLight и добавим его на сцену 💡.

```javascript
// Создание точечного источника освещения на нашей сцене
var light = new THREE.PointLight(0xffffff,1, 50);
scene.add(light);
```
* Затем мы уберём в нашём материале параметр показа сетки, чтобы освещение начало работать.  

```javascript
var material = new THREE.MeshLambertMaterial({
    color: 0xff0000,
    side : THREE.BackSide
});
```
* И наконец мы обновим функцию рендринга, для перемещения нашего источника освещения.  
 
```javascript
var percentage = 0;
function render(){
    percentage += 0.0003;
    var p1 = path.getPointAt(percentage%1);
    var p2 = path.getPointAt((percentage + 0.02)%1);
    camera.position.set(p1.x,p1.y,p1.z);
    camera.lookAt(p2);
    light.position.set(p2.x, p2.y, p2.z);

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
```
Наконец результат ! 

<p data-height="600" data-theme-id="dark" data-slug-hash="OpQQEY" data-default-tab="result" data-user="Mamboleoo" data-embed-version="2" data-pen-title="Add a light" class="codepen">See the Pen <a href="https://codepen.io/Mamboleoo/pen/OpQQEY/">Add a light</a> by Louis Hoebregts (<a href="https://codepen.io/Mamboleoo">@Mamboleoo</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Давайте оторвемся
Основываясь на последнем шаге, я форкну его и поиграюсь с некоторыми параметрами, для создания разных видов анимации. Посмотрите исходники, если вам интересно 😉

* Для этого примера, я установил случайный цвет для каждой грани. Получился веселый мозаичный узор.
<p data-height="500" data-theme-id="dark" data-slug-hash="PpQejJ" data-default-tab="result" data-user="Mamboleoo" data-embed-version="2" data-pen-title="Crazy 1" class="codepen">See the Pen <a href="https://codepen.io/Mamboleoo/pen/PpQejJ/">Crazy 1</a> by Louis Hoebregts (<a href="https://codepen.io/Mamboleoo">@Mamboleoo</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

* В этом случае я играюсь с Y позицией точек генерации траектории. Таким образом траектория изменяется не в плоскости, а в пространстве.
<p data-height="500" data-theme-id="dark" data-slug-hash="MpQGrx" data-default-tab="result" data-user="Mamboleoo" data-embed-version="2" data-pen-title="Crazy 2" class="codepen">See the Pen <a href="https://codepen.io/Mamboleoo/pen/MpQGrx/">Crazy 2</a> by Louis Hoebregts (<a href="https://codepen.io/Mamboleoo">@Mamboleoo</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

* В последнем примере я создаю пять туннелей с различным радиусом и цветом. Они также имеют различную прозрачность, что делает всех их видимыми.  

 <p data-height="500" data-theme-id="dark" data-slug-hash="wJyjYX" data-default-tab="result" data-user="Mamboleoo" data-embed-version="2" data-pen-title="Crazy 3" class="codepen">See the Pen <a href="https://codepen.io/Mamboleoo/pen/wJyjYX/">Crazy 3</a> by Louis Hoebregts (<a href="https://codepen.io/Mamboleoo">@Mamboleoo</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

 ---
Вот и закончилась первая часть. В следующем посте я объясню как создать туннель из частиц, без использования `TubeGeometry()` из  ThreeJS. Вы можете найти все демки из поста в этой [коллекции](https://codepen.io/collection/XPGVKE/).  

Я надеюсь вы что-то почерпнули из этого поста! Если у вас остались вопросы, задавайте их в комментариях.