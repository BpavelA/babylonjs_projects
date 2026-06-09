// Импорт файла json с нанстройками ui
const ui = await(await fetch('guiTexture.json')).json();

// Получение элемента canvas
let canvas = document.getElementById("renderCanvas");

// Создание движка BABYLON с привязкой к холсту
let engine = new BABYLON.Engine(canvas, true);

// Создаем счетчики кристаллов за пределами сцены
let blueCounter = 0,
  greenCounter = 0,
  magicCounter = 0;

let blueText;
let greenText;
let magicText;

// Функция, которая создает сцену
let createScene = function () {

  // Создание базового объекта сцены
  var scene = new BABYLON.Scene(engine);

  // Создание физического движка
  scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin(true, CANNON));

  // Создание камеры
  const camera = new BABYLON.UniversalCamera("fpsCamera", new BABYLON.Vector3(-1.2, 1, -19.6), scene);

  // Закрепление камеры за сценой
  camera.attachControl(canvas, true);

  // Настройка камеры
  camera.applyGravity = true;        // Включить гравитацию
  camera.checkCollisions = true;     // Включить коллизии
  camera.collisionRetryCheck = true; // Постоянная проверка коллизий
  camera.speed = 0.1;                // Скорость движения
  camera.ellipsoid = new BABYLON.Vector3(1.2, 1.1, 1.2); // Создание эллипсоида камеры для участия в коллизиях


  // Создание полусферического источника света
  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // Задание источнику сцета интенсивности
  light.intensity = 0.7;

  // Создание земли
  var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 40, height: 40 }, scene);

  // Позиционирование «земли»
  ground.position.y = 0;

  // Создание материала земли
  const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);

  // Задание текстуры
  groundMaterial.diffuseTexture = new BABYLON.Texture("textures/grass.png");

  // Наложение материала на землю
  ground.material = groundMaterial;

  // Предотвращение столкновений с землей
  ground.checkCollisions = true;

  // Физика земли
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.7 }, scene);

  // СОЗДАНИЕ НЕБА
  // Создаем сферу
  const skybox = BABYLON.MeshBuilder.CreateSphere("sky", { diameter: 1000 }, scene);

  // Создаем материал сферы
  let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);

  // Отключение отсечения "задних" граней сферы (чтобы текстура была видна и изнутри)
  skyboxMaterial.backFaceCulling = false;

  // Текстура будет проецироваться на сферу как окружение.
  skyboxMaterial.reflectionTexture = new BABYLON.Texture("textures/skybox2.jpg", scene, true, false);

  // Проецирует панорамную (equirectangular) текстуру на сферу, имитируя 360° окружение.
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.EQUIRECTANGULAR_MODE;

  // Отключение рассеянного и бликового цвета
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

  // Наложение материала на небесную сферу
  skybox.material = skyboxMaterial;

  // СОЗДАНИЕ ЛАБИРИНТА
  // Создание матрицы поля
  let field = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1],
    [1, 0, 3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 5, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 4, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 4, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 5, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ].reverse();

  // Создание материала стен
  let matWal = new BABYLON.StandardMaterial('wall', scene);

  // Наложение текстуры на материал стен
  matWal.diffuseTexture = new BABYLON.Texture('textures/floor.png');

  // Сдвиг кубов в соответствии с размером поля
  const fieldShift = -19.5;

  let crystals = []; // Создание пустого массива для кристаллов

  function makeCrystals(type, result, i, j) {
    let crystal = result.meshes[0];
    crystal.position = new BABYLON.Vector3(i + fieldShift, 0, j + fieldShift);
    crystal.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);
    crystal.name = type;
    crystal.getChildMeshes().forEach(child => {
      child.ellipsoid = new BABYLON.Vector3(2, 2, 2);
      child.checkCollisions = true;
    });
    crystals.push(crystal);
  };

  // Цикл, создающий кубы (стены лабиринта) и кристаллы в матрице
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[0].length; j++) {
      switch (field[j][i]) {
        case 1:
          let box = new BABYLON.MeshBuilder.CreateBox(`field[${j}:${i}]`, { size: 1, height: 4 }, scene);
          box.position.x = i + fieldShift;
          box.position.z = j + fieldShift;
          box.position.y = 2;
          box.material = matWal;
          box.checkCollisions = true;
          box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.7 }, scene);
          break;

        case 3: BABYLON.ImportMeshAsync("models/blue.glb", scene).then((result) => {
          makeCrystals('blue', result, i, j)
        });
          break;

        case 4: BABYLON.ImportMeshAsync("models/gem.glb", scene).then((result) => {
          makeCrystals('green', result, i, j)
        });
          break;

        case 5: BABYLON.ImportMeshAsync("models/magic.glb", scene).then((result) => {
          makeCrystals('magic', result, i, j)
        });
          break;
      };
    };
  };

  // Включение отладчика (инспектора)
  scene.debugLayer.show({ embedMode: true, showCollisions: true });
  // scene.debugLayer.show();

  // Создание элементов пользовательского интерфейса
  let uiTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  // Получение доступа к необходимым элементам
  uiTexture.parseSerializedObject(ui);
  let root = uiTexture.getChildren()[0];
  blueText = root.getDescendants(false, function (node) { return node.name === 'blueText'; })[0];
  greenText = root.getDescendants(false, function (node) { return node.name === 'greenText'; })[0];
  magicText = root.getDescendants(false, function (node) { return node.name === 'magicText'; })[0];

  return scene;
}

// Вызов функции createScene, которая создает сцену
const scene = createScene();

// Создания цикла для постоянной отрисовки сцены
engine.runRenderLoop(function () { scene.render(); });

// Изменение размера сцены при изменении размера экрана
window.addEventListener("resize", function () { engine.resize(); });