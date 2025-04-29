import { guiPrompt, guiAlert } from "./talking.js";

export async function initScene(scene) {
  scene.clearColor = new BABYLON.Color3(0.8, 0.85, 0.95);
  let camera = new BABYLON.ArcRotateCamera(
    "camera1",
    0.7,
    1,
    1,
    new BABYLON.Vector3(0, 5, -20),
    scene
  );
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);
  let light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  const ground = new BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 15, height: 15 },
    scene
  );
  const m = new BABYLON.GridMaterial("grid", scene);
  m.mainColor = new BABYLON.Color3(0.5, 0.5, 0.5);
  ground.material = m;

  const greenMat = new BABYLON.StandardMaterial("greenMat", scene);
  const redMat = new BABYLON.StandardMaterial("redMat", scene);
  const greyMat = new BABYLON.StandardMaterial("greyMat", scene);

  greenMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
  redMat.diffuseColor = new BABYLON.Color3(1, 0, 0);
  greyMat.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
  greyMat.diffuseTexture = new BABYLON.Texture("textures/stone.jpg", scene);

  const field = [];
  const fieldSize = 10;

  for (let i = 0; i < fieldSize; i++) {
    let row = [];
    for (let j = 0; j < fieldSize; j++) {
      row[j] = Math.random() > 0.5;
    }
    field[i] = row;
  }

  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      const box = BABYLON.MeshBuilder.CreateBox(
        `box-${i}-${j}` + i,
        { size: 1 },
        scene
      );
      box.position.x = -4 + j;
      box.position.z = -4 + i;
      box.material = greyMat;
      if (field[i][j]) {
        box.metadata = "bomb";
      }
    }
  }

  scene.executeWhenReady(() => {
    whenReady();
  });

  scene.onPointerDown = function (evt, info) {
    if (info.pickedMesh && info.pickedMesh.metadata === "bomb") {
      boom(scene, info.pickedMesh);
      info.pickedMesh.material = redMat;
    } else if (info.pickedMesh.name.includes("box")) {
      info.pickedMesh.material = greenMat;
    }
  };
}

async function whenReady() {}

function boom(scene, mesh) {
  BABYLON.ParticleHelper.CreateAsync("explosion", scene).then((set) => {
    set.systems.forEach((s) => {
      s.disposeOnStop = true;
      s.emitter = mesh;
    });
    set.start();
  });
}
