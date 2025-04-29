var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
 engine.runRenderLoop(function () {
  if (sceneToRender && sceneToRender.activeCamera) {
   sceneToRender.render();
  }
 });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };


var createScene = function () {

 var scene = new BABYLON.Scene(engine);

 var camera = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 8, 2.6485, new BABYLON.Vector3(0, 8, -12), scene);

 camera.setTarget(BABYLON.Vector3.Zero());
 camera.attachControl(canvas, true);

 var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
 light.intensity = 0.7;

 var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, scene);
 ground.position.y = -0.5;


 // Начало кода из домашнего задания


 const steps = Number(prompt('Укажите количество ступеней'));

 if (steps == 1 || steps > 50) { alert('Невозможно построить лестницу!') }
 else {
  for (let s = 0; s < steps; s++) {
   let step = new BABYLON.MeshBuilder.CreateBox(`box-${s}`, { size: 1, width: 1, height: 1 }, scene);
   step.scaling.z = 4;
   step.position = new BABYLON.Vector3(s, s, 0);
  }
 };

 // Конец кода из домашнего задания

 return scene;
};

window.initFunction = async function () {



 var asyncEngineCreation = async function () {
  try {
   return createDefaultEngine();
  } catch (e) {
   console.log("the available createEngine function failed. Creating the default engine instead");
   return createDefaultEngine();
  }
 }

 window.engine = await asyncEngineCreation();
 if (!engine) throw 'engine should not be null.';
 startRenderLoop(engine, canvas);
 window.scene = createScene();
};
initFunction().then(() => {
 sceneToRender = scene
});

// Resize
window.addEventListener("resize", function () {
 engine.resize();
});