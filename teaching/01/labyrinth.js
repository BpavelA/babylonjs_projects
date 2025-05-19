// Получение элемента canvas
let canvas = document.getElementById("renderCanvas");

// Создание движка BABYLON 3D
var engine = new BABYLON.Engine(canvas, true);

//////////////////////////////////////////////////////////////////////////////

// Переменные для управления персонажем
let movingRight = false,
  movingLeft = false,
  movingForward = false,
  movingBack = false;

// Создание сцены
var createScene = function () {


  // Создание базового объекта сцены Babylon
  var scene = new BABYLON.Scene(engine);

  // const axes = new BABYLON.AxesViewer(scene, 5); // 2 — размер осей
  // axes.xAxis.color = BABYLON.Color3.Red();    // X — красный
  // axes.yAxis.color = BABYLON.Color3.Green(); // Y — зелёный
  // axes.zAxis.color = BABYLON.Color3.Blue();  // Z — синий

  scene.collisionsEnabled = true; // Включить коллизии для всей сцены
  scene.gravity = new BABYLON.Vector3(0, -0.98, 0); // Гравитация (если нужно падение)

  // КАМЕРА

  // ARC ROTATE
  // var camera = new BABYLON.ArcRotateCamera("camera", Math.PI * 1.5, 1, 30, new BABYLON.Vector3(0, 0, 1));
  
  // UNIVERSAL
  const camera = new BABYLON.UniversalCamera("fpsCamera", new BABYLON.Vector3(0.5, 0.5, -8.5), scene);
  camera.setTarget(BABYLON.Vector3.Zero())


  // FOLLOW
  
  // const camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0.5, 0.5, -10.5), scene);
  
  // camera.radius = -2;   // Высота цели камеры над локальной точкой (центром) цели
  // camera.heightOffset = 0;   // Целевой поворот камеры вокруг локального начала (центра) цели в плоскости x, y
  // camera.rotationOffset = 0;   // Ускорение камеры при переходе от текущей позиции к цели
  // camera.cameraAcceleration = 0.005;   // Скорость, при которой ускорение прекращается
  // camera.maxCameraSpeed = 5;   // Максимальная скорость камеры
  // scene.activeCamera = camera; // Активация камеры
  
  // Настройки камеры
  // camera.applyGravity = true;        // Включить гравитацию (если нужно)
  // camera.checkCollisions = true;     // Включить коллизии
  // camera.speed = 0.05;                // Скорость движения
  // camera.angularSensibility = 2000;  // Чувствительность мыши (чем больше, тем медленнее)
  // camera.keysUp = [87];              // W (вперед)
  // camera.keysDown = [83];            // S (назад)
  // camera.keysLeft = [65];            // A (влево)
  // camera.keysRight = [68];           // D (вправо)
  // camera.upperBetaLimit = Math.PI / 2; // Макс. угол наклона вниз (90°)
  // camera.lowerBetaLimit = Math.PI / 4; // Мин. угол наклона вверх (45°)
  
  
  

  // Закрепление камеры на холсте
  camera.attachControl(canvas, true);

  // Создание источника света
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // Создание физического движка
  scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin(true, CANNON));



  // Создание персонажа (сфера)
  const ball = BABYLON.MeshBuilder.CreateSphere("ball", { diameter: 0.5, }, scene);

  // Позиционирование персонажа
  ball.position = new BABYLON.Vector3(0.5, 0.5, -8.5);
  

  // Дополнительные настройки камеры
  
  // camera.parent = ball;
  // camera.lockedTarget = ball;  // закрепленни камеры на цели
  // camera.minZ = 0.01;
  // camera.fov = 0.3;
  scene.registerBeforeRender(() => {
    camera.position = new BABYLON.Vector3(ball.position.x, ball.position.y, ball.position.z - 1);
    camera.setTarget(ball.position);
  });

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
        box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0, restitution: 0 }, scene);
        box.checkCollisions = true;
      };
    };
  };

  // ФИЗИКА ОБЪЕКТОВ
  // Создание физических импосторов для объектов
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, scene);
  ball.physicsImpostor = new BABYLON.PhysicsImpostor(ball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0 }, scene);


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
  scene.debugLayer.show({ embedMode: true, });

  // УПРАВЛЕНИЕ ПЕРСОНАЖЕМ

  // Функция обновления позиции
  function updatePosition() {
    let speed = 0.05;
    let newPos = ball.position;
    if (movingForward) {
      newPos.z += speed;
    }
    if (movingBack) {
      newPos.z -= speed;
    }
    if (movingRight) {
      newPos.x += speed;
    }
    if (movingLeft) {
      newPos.x -= speed;
    }
  }

  // Обработчики событий нажатия и отпускания клавиш
  window.addEventListener('keydown', keydown);
  window.addEventListener('keyup', keyup);

  // Функция обновления переменных при нажатии клавиш
  function keydown(event) {
    let newPos = ball.position.clone();
    // Отображение кода события в консоли
    console.log(event.code)

    switch (event.code) {
      case 'KeyW': movingForward = true; movingBack = false; break;
      case 'KeyA': movingLeft = true; movingRight = false; break;
      case 'KeyS': movingBack = true; movingForward = false;; break;
      case 'KeyD': movingRight = true; movingLeft = false; break;
    }
  }

  // Функция обновления переменных при отпускании клавиш
  function keyup(event) {
    switch (event.code) {
      case 'KeyW': movingForward = false; break;
      case 'KeyA': movingLeft = false; break;
      case 'KeyS': movingBack = false; break;
      case 'KeyD': movingRight = false; break;
    }
  }
  // Наблюдение за выполнением функции обновления позиции
  scene.onBeforeRenderObservable.add(() => { updatePosition() });

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