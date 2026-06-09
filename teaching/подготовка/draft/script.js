// Получение элемента canvas
let canvas = document.getElementById("renderCanvas");

// Создание движка BABYLON с привязкой к холсту
let engine = new BABYLON.Engine(canvas, true);

// Функция, которая создает сцену
let createScene = function () {

 // Создание базового объекта сцены
 var scene = new BABYLON.Scene(engine);

 // Создание камеры
 var camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(0), BABYLON.Tools.ToRadians(57.3), 10, BABYLON.Vector3.Zero(), scene
 );
 camera.attachControl(canvas, true);

 // Закрепление камеры за сценой
 camera.attachControl(canvas, true);

 // Создание полусферического источника света
 var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

 // Задание источнику сцета интенсивности
 light.intensity = 0.7;

 // Создание земли
 var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 12, height: 12 }, scene);

 // Создание материала
 const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);

 // Задание текстуры
 groundMaterial.diffuseTexture = new BABYLON.Texture("grass.jpg");

 // Наложение материала на землю
 ground.material = groundMaterial;

 BABYLON.ImportMeshAsync("blue.glb", scene).then((stone) => {
  stone.meshes[0].position = new BABYLON.Vector3(0, 0.1, 0);
  stone.meshes[0].scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
 });

 // Включение отладчика (инспектора)
 scene.debugLayer.show({ embedMode: true, showCollisions: true });

 return scene;
}

// Вызов функции createScene, которая создает сцену
const scene = createScene();

// Создания цикла для постоянной отрисовки сцены
engine.runRenderLoop(function () { scene.render(); });

// Изменение размера сцены при изменении размера экрана
window.addEventListener("resize", function () { engine.resize(); });