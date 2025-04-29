var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
};

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () {
  return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  });
};
var createScene = function () {
  // This creates a basic Babylon Scene object (non-mesh)
  var scene = new BABYLON.Scene(engine);

  // This creates and positions a free camera (non-mesh)
  var camera = new BABYLON.ArcRotateCamera(
    "camera1",
    0.7,
    1,
    1,
    new BABYLON.Vector3(0, 5, -20),
    scene
  );

  // This targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'ground' shape.
  var ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 40, height: 40 },
    scene
  );

  const mat = new BABYLON.StandardMaterial("mat", scene);
  mat.diffuseColor = new BABYLON.Color3(0, 1, 0);

  const fieldSize = 20;
  const field = [];

  for (let i = 0; i < fieldSize; i++) {
    let row = [];
    for (let j = 0; j < fieldSize; j++) {
      if ((i == 19 || j == 0 || j == 19) && i % 2 == 0) {
        row[j] = true;
      } else {
        row[j] = false;
      }
    }
    field[i] = row;
  }

  console.log(field);
  for (let i = 0; i < fieldSize; i++) {
    for (let j = 0; j < fieldSize; j++) {
      const box = BABYLON.MeshBuilder.CreateBox(
        `box-${i}-${j}`,
        { size: 1, height: 1, width: 1 },
        scene
      );
      box.position.x = -10 + i;
      box.position.z = -10 + j;
      box.position.y = 0.5;
      box.material = mat;
      if (field[i][j]) {
        const cyl = BABYLON.MeshBuilder.CreateCylinder(
          `cyl-${i}-${j}`,
          { height: 5, diameter: 1 },
          scene
        );
        cyl.position = new BABYLON.Vector3(-10 + i, 3.5, -10 + j);
      }
    }
  }

  return scene;
};
window.initFunction = async function () {
  var asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log(
        "the available createEngine function failed. Creating the default engine instead"
      );
      return createDefaultEngine();
    }
  };

  window.engine = await asyncEngineCreation();
  if (!engine) throw "engine should not be null.";
  startRenderLoop(engine, canvas);
  window.scene = createScene();
};
initFunction().then(() => {
  sceneToRender = scene;
});

// Resize
window.addEventListener("resize", function () {
  engine.resize();
});
