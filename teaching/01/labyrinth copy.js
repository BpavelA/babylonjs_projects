// Получение элемента canvas
let canvas = document.getElementById("renderCanvas");

// Создание движка BABYLON 3D
var engine = new BABYLON.Engine(canvas, true);

//////////////////////////////////////////////////////////////////////////////

// Создание сцены
var createScene = function () {


  // Создание базового объекта сцены Babylon
  var scene = new BABYLON.Scene(engine);

  // Создание физического движка
  scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin(true, CANNON));

  scene.collisionsEnabled = true; // Включить коллизии для всей сцены
  scene.gravity = new BABYLON.Vector3(0, -9.81, 0); // Гравитация

  // КАМЕРА

  // UNIVERSAL
  const camera = new BABYLON.UniversalCamera("fpsCamera", new BABYLON.Vector3(0.5, 0.75, -8.5), scene);
  camera.setTarget(BABYLON.Vector3.Zero());

  camera.applyGravity = true;        // Включить гравитацию
  camera.checkCollisions = true;     // Включить коллизии
  camera.speed = 0.05;                // Скорость движения
  camera.ellipsoid = new BABYLON.Vector3(0.4, 0.4, 0.4);
  camera.collisionRetryCheck = true;
  
  // Закрепление камеры на холсте
  camera.attachControl(canvas, true);

  // Создание источника света
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // Создание "земли"
  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 20, height: 20, }, scene);

  // Создание материала для земли
  const groundTexture = new BABYLON.StandardMaterial("groundMat", scene);

  // Задание материалу текстуры
  groundTexture.diffuseTexture = new BABYLON.Texture("grass.png");

  // Наложение материала на землю
  ground.material = groundTexture;

  // Предотвращение столкновений
  ground.checkCollisions = true;

  // СОЗДАНИЕ ЛАБИРИНТА
  // Создание матрицы поля
  let field = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1],
    [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1],
    [1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1],
    [1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ].reverse();

  // Создание материала стен
  let matWal = new BABYLON.StandardMaterial('wall', scene);

  // Наложение материала на стены
  matWal.diffuseTexture = new BABYLON.Texture('floor.png');

  // Сдвиг в соответствии с размером поля
  const fieldShift = -9.5;

  // Цикл, создающий кубы по матрице
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[0].length; j++) {
      if (field[j][i] == 1) {

        let box = new BABYLON.MeshBuilder.CreateBox(`field[${j}:${i}]`, { size: 1, height: 1.5 }, scene);
        box.position.x = i + fieldShift;
        box.position.z = j + fieldShift;
        box.position.y = 0.75;
        box.material = matWal;
        box.checkCollisions = true;
      };
    };
  };

  // СОЗДАНИЕ НЕБА
  // Создаем сферу
  const skybox = BABYLON.MeshBuilder.CreateSphere("sky", { diameter: 1000 }, scene);
  // Создаем материал сферы
  let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  // Отключение отсечения "задних" граней сферы (чтобы текстура была видна и изнутри)
  skyboxMaterial.backFaceCulling = false;
  // Текстура будет проецироваться на сферу как окружение.
  skyboxMaterial.reflectionTexture = new BABYLON.Texture("skybox2.jpg", scene, true, false);
  // Проецирует панорамную (equirectangular) текстуру на сферу, имитируя 360° окружение.
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.EQUIRECTANGULAR_MODE;
  // Отключение рассеянного и бликового цвета
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  // Наложение материала на небесную сферу
  skybox.material = skyboxMaterial;

  // Включаем инспектор в совмещенном режиме
  scene.debugLayer.show({ embedMode: true, showCollisions: true});

  return scene;
};

//////////////////////////////////////////////////////////////////////////////

// Вызов функции createScene, которая создает сцену
const scene = createScene();

// Создания цикла для постоянной отрисовки сцены
engine.runRenderLoop(function () {
  scene.render();
});

// Изменение размера сцены при изменении размера экрана
window.addEventListener("resize", function () { engine.resize(); });