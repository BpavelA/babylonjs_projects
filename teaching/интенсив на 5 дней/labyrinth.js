// Импорт файла json с нанстройками ui
const ui = await(await fetch('./guiTexture.json')).json();

// Получение элемента canvas
let canvas = document.getElementById("renderCanvas");

// Создание движка BABYLON 3D
var engine = new BABYLON.Engine(canvas, true);

//////////////////////////////////////////////////////////////////////////////


// Создаем счетчики кристаллов
let blueCounter = 0,
  greenCounter = 0,
  magicCounter = 0;

let blueText;
let greenText;
let magicText;


// Создание сцены
var createScene = function () {



  // Создание базового объекта сцены Babylon
  var scene = new BABYLON.Scene(engine);

  // Создание физического движка
  scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin(true, CANNON));

  scene.collisionsEnabled = true; // Включить коллизии для всей сцены
  scene.gravity = new BABYLON.Vector3(0, -9.81, 0); // Гравитация
  // scene.ambientColor = new BABYLON.Color3(1, 1, 1);

  // КАМЕРА
  // UNIVERSAL
  const camera = new BABYLON.UniversalCamera("fpsCamera", new BABYLON.Vector3(-1.2, 1, -19.6), scene);

  // Закрепление камеры на холсте
  camera.attachControl(canvas, true);

  camera.applyGravity = true;        // Включить гравитацию
  camera.checkCollisions = true;     // Включить коллизии
  camera.collisionRetryCheck = true;
  camera.speed = 0.1;                // Скорость движения
  camera.ellipsoid = new BABYLON.Vector3(1.2, 1.1, 1.2);

  // Создание источника света

  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  const light2 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(-40, 30, 20), scene);

  // const light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 0), scene);

  // const light = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(-Math.cos(Math.PI / 6), 20, -Math.sin(Math.PI / 6)), new BABYLON.Vector3(0, -1, 0), Math.PI / 2, 1.5, scene);

  // Создаем в небе луну
  let mond = new BABYLON.MeshBuilder.CreateSphere('mond', { diameter: 2 }, scene);
  mond.position = light2.position;
  mond.infiniteDistance = true;
  let mondMat = new BABYLON.StandardMaterial('mondmat', scene);
  mondMat.emissiveColor = new BABYLON.Color3(1, 1, 0.522);
  mond.material = mondMat;

  // Изменяем интенсивность света
  light.intensity = 0.3;
  light2.intensity = 0.5;



  // Добавляем свету цвет
  // light.diffuse = new BABYLON.Color3(1, 0, 0);
  // light.specular = new BABYLON.Color3(0, 1, 0);
  // light.groundColor = new BABYLON.Color3(0, 1, 0);

  // Инициализируем генератор теней
  const shadowGenerator = new BABYLON.ShadowGenerator(1024, light2);
  shadowGenerator.usePoissonSampling = true;
  shadowGenerator.useBlurExponentialShadowMap = true;
  shadowGenerator.blurKernel = 32;

  // Добавляем фоновый звук

  const ambientSound = new Audio("sounds/ambient_sound.mp3");
  const fetchedCrystal = new Audio("sounds/fetched_crystal.wav");
  ambientSound.autoplay = true;
  ambientSound.loop = true;
  

  // Создание "земли"
  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 40, height: 40, }, scene);
  ground.position.y = 0;

  // Создание материала для земли
  const groundTexture = new BABYLON.StandardMaterial("groundMat", scene);

  // Задание материалу текстуры
  groundTexture.diffuseTexture = new BABYLON.Texture("img/grass.png");

  // Наложение материала на землю
  ground.material = groundTexture;


  // Предотвращение столкновений
  ground.checkCollisions = true;

  // Земля получает тени 
  ground.receiveShadows = true;

  // Физика земли
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.7 }, scene);

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

  // Наложение материала на стены
  matWal.diffuseTexture = new BABYLON.Texture('img/floor.png');

  // Сдвиг в соответствии с размером поля
  const fieldShift = -19.5;

  let crystals = [];

  function makeCrystals(type, result, i, j) {
    let crystal = result.meshes[0];
    crystal.position = new BABYLON.Vector3(i + fieldShift, 0, j + fieldShift);
    crystal.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);
    crystal.name = type;
    crystal.getChildMeshes().forEach(child => {
      child.ellipsoid = new BABYLON.Vector3(2, 2, 2);
      child.checkCollisions = true;
      shadowGenerator.addShadowCaster(child, true);
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
          shadowGenerator.addShadowCaster(box, true);
          // box.ambientColor = new BABYLON.Color3(1, 1, 1);
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







  // СОЗДАНИЕ НЕБА
  // Создаем сферу
  const skybox = BABYLON.MeshBuilder.CreateSphere("sky", { diameter: 1000 }, scene);
  // Создаем материал сферы
  let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  // Отключение отсечения "задних" граней сферы (чтобы текстура была видна и изнутри)
  skyboxMaterial.backFaceCulling = false;
  // Текстура будет проецироваться на сферу как окружение.
  skyboxMaterial.reflectionTexture = new BABYLON.Texture("img/nightsky.jpg", scene, true, false);
  // Проецирует панорамную (equirectangular) текстуру на сферу, имитируя 360° окружение.
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.EQUIRECTANGULAR_MODE;
  // Отключение рассеянного и бликового цвета
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  // Наложение материала на небесную сферу
  skybox.material = skyboxMaterial;

  // Включаем и настраиваем туман

  scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
  scene.fogColor = new BABYLON.Color3(0.1, 0.2, 0.1);

  // Отлавливаем столкновение камеры с кристаллами и обновляем счетчики
  scene.registerBeforeRender(() => {
    crystals.forEach(crystal => {
      const distance = BABYLON.Vector3.Distance(camera.position, crystal.position);
      if (distance < 3 && crystal.name != 'fetched') {

        fetchedCrystal.play(); 
        onTouchCrystal(crystal.name);
        crystal.setEnabled(false);
        crystal.name = 'fetched';
      };
    });
    scene.fogDensity = 0.1 + Math.sin(Date.now() * 0.001) * 0.005;
  });



  // Включаем инспектор в совмещенном режиме
  // scene.debugLayer.show({ embedMode: true, showCollisions: true });

  // Создание элементов пользовательского интерфейса и получение значения полей счетчика
  let uiTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  uiTexture.parseSerializedObject(ui);
  let root = uiTexture.getChildren()[0];
  blueText = root.getDescendants(false, function (node) { return node.name === 'blueText'; })[0];
  greenText = root.getDescendants(false, function (node) { return node.name === 'greenText'; })[0];
  magicText = root.getDescendants(false, function (node) { return node.name === 'magicText'; })[0];

  let iconPath = "img/speaker.png";
  let flagSoundOn = true;

  let soundButton = BABYLON.GUI.Button.CreateImageOnlyButton("soundIcon", iconPath);
  soundButton.height = "48px";
  soundButton.width = "48px";
  soundButton.top = "-10px";
  soundButton.left = "10px";
  soundButton.color = new BABYLON.Color4(0.0, 0.0, 0.0, 0.0).toHexString();
  soundButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  soundButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

  uiTexture.addControl(soundButton);

  // Функция для обновления иконки
  function updateIcon() {
    soundButton.image.source = flagSoundOn ? "img/speaker.png" : "img/no_sound.png";
  }

  // Обработчик клика для Babylon.GUI
  soundButton.onPointerClickObservable.add(() => {
    flagSoundOn = !flagSoundOn; // Инвертируем значение
    updateIcon();

    // Логика управления звуком
    if (flagSoundOn) {
      ambientSound.play(); // Включить звук
    } else {
      ambientSound.pause(); // Выключить звук
    };
  });

  

  // Функция изменения количества собранных кристаллов
  function onTouchCrystal(crystalName) {
    switch (crystalName) {
      case 'blue': blueText.text = ++blueCounter; break;
      case 'green': greenText.text = ++greenCounter; break;
      case 'magic': magicText.text = ++magicCounter; break;
    };
  };

  // let rect = new BABYLON.GUI.Rectangle();
  // rect.name = 'rect';
  // rect.width = '250px';
  // rect.height = '500px';
  // rect.background = rect.color = new BABYLON.Color4(0.5, 0.5, 0.5, 0.5).toHexString();
  // rect.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  // rect.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  // advancedTexture.addControl(rect);

  // let stackpanel = new BABYLON.GUI.StackPanel();
  // stackpanel.name = 'stackpanel';
  // stackpanel.width = '220px';
  // // stackpanel.height = '480px';
  // stackpanel.fontSize = '14px';
  // stackpanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  // stackpanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  // rect.addControl(stackpanel);

  // let blueStoneIco = new BABYLON.GUI.Image('blueStoneIco', 'img/blue.png');
  // blueStoneIco.width = '50px';
  // blueStoneIco.height = '50px';
  // blueStoneIco.left = '10px';
  // blueStoneIco.top = '10px';
  // blueStoneIco.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  // blueStoneIco.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  // rect.addControl(blueStoneIco);


  
  

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

