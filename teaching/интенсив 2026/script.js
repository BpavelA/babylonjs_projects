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

// Функция, которая создает сцену
let createScene = function () {

  // Создание базового объекта сцены
  let scene = new BABYLON.Scene(engine);

  // Создание камеры
  //  let camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(0), BABYLON.Tools.ToRadians(57.3), 10, BABYLON.Vector3.Zero(), scene
  //  );

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
  let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  // Задание источнику сцета интенсивности
  light.intensity = 0.7;

  // Добавление дополнительных источников света
  const light2 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(-40, 30, 20), scene);
  light2.intensity = 1;

  // Инициализируем генератор теней
  const shadowGenerator = new BABYLON.ShadowGenerator(1024, light2);
  shadowGenerator.usePoissonSampling = true;
  shadowGenerator.useBlurExponentialShadowMap = true;
  shadowGenerator.blurKernel = 32;

  // Включаем и настраиваем туман
  scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
  scene.fogColor = new BABYLON.Color3(0.3, 0.3, 0.3);
  scene.fogDensity = 0.2;

  // Создаем в небе луну
  let mond = new BABYLON.MeshBuilder.CreateSphere('mond', { diameter: 6 }, scene);
  mond.position = light2.position;
  mond.infiniteDistance = true;
 let mondMat = new BABYLON.StandardMaterial('mondmat', scene);
  mondMat.emissiveColor = new BABYLON.Color3(1, 1, 0.522);
  mond.material = mondMat;

  // Добавление звуков в игру

  const ambientSound = new Audio("sounds/ambient_sound.mp3");
  const fetchedCrystalSound = new Audio("sounds/fetched_crystal.wav");
  // ambientSound.play();
  ambientSound.loop = true;


  // Создание земли
  let ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 40, height: 40 }, scene);

  ground.position.y = 0;

  // Создаем материал
  let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);

  // Накладываем на материал текстуру
  groundMaterial.diffuseTexture = new BABYLON.Texture("textures/grass.png", scene);

  // Накладываем материал с текстурой на объект
  ground.material = groundMaterial;

  // Предотвращение столкновений
  ground.checkCollisions = true;

  // Земля получает тени 
  ground.receiveShadows = true;

  // СОЗДАНИЕ НЕБА
  // Создаем сферу
  const skybox = BABYLON.MeshBuilder.CreateSphere("sky", { diameter: 1000 }, scene);

  // Создаем материал сферы
  let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);

  // Отключение отсечения "задних" граней сферы (чтобы текстура была видна и изнутри)
  skyboxMaterial.backFaceCulling = false;

  // Текстура будет проецироваться на сферу как окружение.
  skyboxMaterial.reflectionTexture = new BABYLON.Texture("textures/nightsky.jpg", scene, true, false);

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

  // Функция, наделяющая кристаллы определенными свойствами0

  let crystals = []; // Создание пустого массива для кристаллов

  function makeCrystals(type, result, i, j) {
    let crystal = result.meshes[0];
    crystal.position = new BABYLON.Vector3(i + fieldShift, 0, j + fieldShift);
    crystal.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);
    crystal.name = type;

    // Анимация кристаллов
    const frameRate = 25;
    const crystalUpDownAnimation = new BABYLON.Animation("crystalUpDownAnimation", "position.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    const crystalUpDownAnimationKeys = [];
    crystalUpDownAnimationKeys.push({ frame: 0, value: 0.4 });
    crystalUpDownAnimationKeys.push({ frame: frameRate * 2, value: 0.5 });
    crystalUpDownAnimationKeys.push({ frame: frameRate * 4, value: 0.6 });
    crystalUpDownAnimationKeys.push({ frame: frameRate * 6, value: 0.5 });
    crystalUpDownAnimationKeys.push({ frame: frameRate * 8, value: 0.4 });
    crystalUpDownAnimation.setKeys(crystalUpDownAnimationKeys);
    crystal.animations = [crystalUpDownAnimation];
    scene.beginAnimation(crystal, 0, frameRate * 8, true);

    crystal.getChildMeshes().forEach(child => {
      child.ellipsoid = new BABYLON.Vector3(2, 2, 2);
      child.checkCollisions = true;
      // Кристаллы дают тени
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
          // Стены лабиринта дают тени
          shadowGenerator.addShadowCaster(box, true);
          break;

        // Добавление кристаллов в цикле
        case 3: BABYLON.ImportMeshAsync("models/blue.glb", scene).then((result) => {
          makeCrystals('blue', result, i, j)
        });
          break;

        case 4: BABYLON.ImportMeshAsync("models/green.glb", scene).then((result) => {
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
  // scene.debugLayer.show({ embedMode: true, showCollisions: true });

  // Создание элементов пользовательского интерфейса
  let uiTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  // let blueText;
  // let greenText;
  // let magicText;

  // Получение доступа к необходимым элементам
  uiTexture.parseSerializedObject(ui);
  let root = uiTexture.getChildren()[0];
  let blueText = root.getDescendants(false, function (node) { return node.name === 'blueText'; })[0];
  let greenText = root.getDescendants(false, function (node) { return node.name === 'greenText'; })[0];
  let magicText = root.getDescendants(false, function (node) { return node.name === 'magicText'; })[0];

  // Функция изменения количества собранных кристаллов
  function onTouchCrystal(crystalName) {
    switch (crystalName) {
      case 'blue': blueText.text = ++blueCounter; break;
      case 'green': greenText.text = ++greenCounter; break;
      case 'magic': magicText.text = ++magicCounter; break;
    };
  };

  // Отлавливаем столкновение камеры с кристаллами и обновляем счетчики
  scene.registerBeforeRender(() => {
    crystals.forEach(crystal => {
      const distance = BABYLON.Vector3.Distance(camera.position, crystal.position);
      if (distance < 3 && crystal.name != 'fetched') {
        fetchedCrystalSound.play()
        onTouchCrystal(crystal.name);
        crystal.setEnabled(false);
        crystal.name = 'fetched';
      };
    });

  });

  // Добавление иконки включения и выключения звука
  // Создание переменных для управления

  let flagSoundOn = true;

  // Создание и добавление иконки в интерфейс
  let soundButton = BABYLON.GUI.Button.CreateImageOnlyButton("soundIcon", "img/speaker.png");
  soundButton.height = "48px";
  soundButton.width = "48px";
  soundButton.top = "-10px";
  soundButton.left = "10px";
  soundButton.color = new BABYLON.Color4(0, 0, 0.0, 0.0).toHexString();
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

  return scene;

}

// Вызов функции createScene, которая создает сцену
const scene = createScene();

// Создания цикла для постоянной отрисовки сцены
engine.runRenderLoop(function () { scene.render(); });

// Изменение размера сцены при изменении размера экрана
window.addEventListener("resize", function () { engine.resize(); });