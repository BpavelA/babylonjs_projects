// Получение элемента canvas
let canvas = document.getElementById("renderCanvas"); 

// Создание движка BABYLON 3D
var engine = new BABYLON.Engine(canvas, true); 

//////////////////////////////////////////////////////////////////////////////

// Создание сцены
var createScene = function () {

  
  // Создание базового объекта сцены Babylon
 var scene = new BABYLON.Scene(engine);

 const axes = new BABYLON.AxesViewer(scene, 5); // 2 — размер осей
 axes.xAxis.color = BABYLON.Color3.Red();    // X — красный
 axes.yAxis.color = BABYLON.Color3.Green(); // Y — зелёный
 axes.zAxis.color = BABYLON.Color3.Blue();  // Z — синий
  

  // Создание и позиционирование камеры
  var camera = new BABYLON.ArcRotateCamera("camera", Math.PI*1.5, 1, 30, new BABYLON.Vector3(0, 0, 1));

    // Закрепление камеры на холсте
    camera.attachControl(canvas, true);

  // Создание источника света
 const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // Создание персонажа (сфера)
  const ball = BABYLON.MeshBuilder.CreateSphere("ball", { diameter: 0.5, }, scene);
 
    // Позиционирование персонажа
    ball.position = new BABYLON.Vector3(0, 0.5, -9.5);

  // Создание "земли"
  const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 20, height: 20, }, scene);


   // Создание материала для земли
  const groundTexture = new BABYLON.StandardMaterial("groundMat", scene);

   // Задание материалу текстуры
    groundTexture.diffuseTexture = new BABYLON.Texture("grass.png");

   // Наложение материала на землю
    ground.material = groundTexture;

  // Создание лабиринта
  
    // Создание матрицы поля
    let field = [
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ].reverse();
  
    // Сдвиг
      const fieldShift = -9.5;
    
    // Создание материала стен
      let matWal = new BABYLON.StandardMaterial('wall', scene);
      matWal.diffuseTexture = new BABYLON.Texture('floor.png');

    // Цикл, создающий кубы по матрице
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      if (field[j][i] == 1) {
        let box = new BABYLON.MeshBuilder.CreateBox(`field[${j}:${i}]`, { size: 1, height: 2 }, scene);
        box.position.x = i + fieldShift;
        box.position.z = j + fieldShift;
        box.position.y = 1;
        box.material = matWal; break;
      };
    };
  };


  
  
  
  
 // Включаем инспектор в совмещенном режиме
 scene.debugLayer.show({ embedMode: true, });
 
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
window.addEventListener("resize", function () {engine.resize();});