// Получение элемента canvas
let canvas = document.getElementById("renderCanvas");

// Создание движка BABYLON с привязкой к холсту
let engine = new BABYLON.Engine(canvas, true);

// Создаем сцену
let createScene = function () {

 // Создание базового объекта сцены Babylon
 let scene = new BABYLON.Scene(engine);

 // Создание камеры
 const camera = new BABYLON.UniversalCamera("fvpCamera", new BABYLON.Vector3(-1.2, 1, -19.6), scene);

 // Закрепление камеры на холсте
 camera.attachControl(canvas, true);

 // Настройка камеры
 camera.applyGravity = true;        // Включить гравитацию
 camera.checkCollisions = true;     // Включить коллизии
 camera.collisionRetryCheck = true; // Постоянная проверка коллизий
 camera.speed = 0.1;                // Скорость движения
 camera.ellipsoid = new BABYLON.Vector3(1.2, 1.1, 1.2); // Создание эллипсоида камеры для участия в коллизиях

// Добавляем источник света
 let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

 // Создание «земли»
 const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 40, height: 40, }, scene);
 ground.position.y = 0;         // Позиционирование «земли»
 
 // СОЗДАНИЕ НЕБА
 // Создаем сферу
 const skybox = BABYLON.MeshBuilder.CreateSphere("sky", { diameter: 1000 }, scene);

 // Создаем материал сферы
 let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);

 // Отключение отсечения "задних" граней сферы (чтобы текстура была видна и изнутри)
 skyboxMaterial.backFaceCulling = false;

 // Текстура будет проецироваться на сферу как окружение.
 skyboxMaterial.reflectionTexture = new BABYLON.Texture("img/skybox2.jpg", scene, true, false);

 // Проецирует панорамную (equirectangular) текстуру на сферу, имитируя 360° окружение.
 skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.EQUIRECTANGULAR_MODE;

 // Отключение рассеянного и бликового цвета
 skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
 skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

 // Наложение материала на небесную сферу
 skybox.material = skyboxMaterial;

 // Создание материала для земли
 const groundTexture = new BABYLON.StandardMaterial("groundMat", scene);

 // Задание материалу текстуры
 groundTexture.diffuseTexture = new BABYLON.Texture("img/grass.png");

 // Наложение материала на землю
 ground.material = groundTexture;

 // Предотвращение столкновений
 ground.checkCollisions = true;


 // Включаем инспектор в совмещенном режиме
 scene.debugLayer.show({ embedMode: true, showCollisions: true });
 
 // Включаем и настраиваем туман

 scene.fogMode = BABYLON.Scene.FOGMODE_EXP2 = 2;    // Экспоненциальный квадратичный туман
 scene.fogDensity = 0.1;// Настраиваем интенсивность тумана
 scene.fogColor = new BABYLON.Color3(0.1, 0.2, 0.1); // Настраиваем цвет тумана

 return scene;
};

// Вызываем функцию создания сцены
const scene = createScene();

// Создания цикла для постоянной отрисовки сцены
engine.runRenderLoop(function () {
 scene.render();
});

// Изменение размера сцены при изменении размера экрана
window.addEventListener("resize", function () {
 engine.resize();
});