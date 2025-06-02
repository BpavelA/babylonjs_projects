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
  const camera = new BABYLON.UniversalCamera("fpsCamera", new BABYLON.Vector3(-1.2, 1, -19.6), scene);
  // camera.setTarget(BABYLON.Vector3.Zero());

  // Закрепление камеры на холсте
  camera.attachControl(canvas, true);

  camera.applyGravity = true;        // Включить гравитацию
  camera.checkCollisions = true;     // Включить коллизии
  camera.collisionRetryCheck = true;
  camera.speed = 0.1;                // Скорость движения
  camera.ellipsoid = new BABYLON.Vector3(1.2, 1.1, 1.2);

  // Создание источника света
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // Создание "земли"
  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 40, height: 40, }, scene);
  ground.position.y = 0;

  // Создание материала для земли
  const groundTexture = new BABYLON.StandardMaterial("groundMat", scene);

  // Задание материалу текстуры
  groundTexture.diffuseTexture = new BABYLON.Texture("grass.png");

  // Наложение материала на землю
  ground.material = groundTexture;

  // Предотвращение столкновений
  ground.checkCollisions = true;

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

  // Создание материала стен и шаров
  let matWal = new BABYLON.StandardMaterial('wall', scene);
  let matBall = new BABYLON.StandardMaterial('ball', scene);

  // Наложение материала на стены и шары
  matWal.diffuseTexture = new BABYLON.Texture('floor.png');
  matBall.emissiveColor = new BABYLON.Color3(1, 1, 0);
  // matBall.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);

  // Сдвиг в соответствии с размером поля
  const fieldShift = -19.5;

  let crystals = [];

  // Цикл, создающий кубы по матрице
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

        case 2: let ball = new BABYLON.MeshBuilder.CreateSphere(`ball[${j}:${i}]`, { diameter: 0.4 }, scene);
          ball.position = new BABYLON.Vector3(i + fieldShift, 1, j + fieldShift);
          ball.physicsImpostor = new BABYLON.PhysicsImpostor(ball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 1 }, scene);
          ball.material = matBall;
          break;

        case 3: BABYLON.ImportMeshAsync("models/blue.glb", scene).then((result) => {
          let crystal = result.meshes[0];
          crystal.position = new BABYLON.Vector3(i + fieldShift, 0.3, j + fieldShift);
          crystal.scaling = new BABYLON.Vector3(3, 3, 3);
          // crystal.name = `blue[${j}:${i}]`;
          crystal.getChildMeshes().forEach(child => {
            child.ellipsoid = new BABYLON.Vector3(3, 3, 3);
            child.checkCollisions = true;
          });
          crystals.push(crystal);
        });
          break;

        case 4: BABYLON.ImportMeshAsync("models/gem.glb", scene).then((result) => {
          let crystal = result.meshes[0];
          crystal.position = new BABYLON.Vector3(i + fieldShift, 0.3, j + fieldShift);
        });
          break;

        case 5: BABYLON.ImportMeshAsync("models/magic.glb", scene).then((result) => {
          let crystal = result.meshes[0];
          crystal.position = new BABYLON.Vector3(i + fieldShift, 0.3, j + fieldShift);
        });

          break;
      };
    };
  };

  console.log(crystals);

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

  const allMeshes = scene.meshes;

  // console.log(allMeshes);

  // allMeshes.forEach(mesh => {

  //   if (mesh.name == 'Object_2') {
  //     mesh.checkCollisions = true;
  //   }
  // });

  scene.registerBeforeRender(() => {

    // const wall = scene.getMeshByName('field[0:10]');
    // const distance = BABYLON.Vector3.Distance(camera.position, wall.position);
    // if (distance < 2) { wall.setEnabled(false) };

    allMeshes.forEach(mesh => {
      if (mesh.name == 'Object_2') {
        const boundingInfo = mesh.getBoundingInfo();
        if (boundingInfo.boundingBox.intersectsPoint(camera.globalPosition)) {
          // mesh.dispose();
          mesh.setEnabled(false);
        }
      }
    });



    crystals.forEach(crystal => {
      const boundingInfo = crystal.getBoundingInfo();
      if (boundingInfo.boundingBox.intersectsPoint(camera.globalPosition)) {
        // crystal.dispose();
        crystal.setEnabled(false);
      }
    });
  });


  // Включаем инспектор в совмещенном режиме
  scene.debugLayer.show({ embedMode: true, showCollisions: true });
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