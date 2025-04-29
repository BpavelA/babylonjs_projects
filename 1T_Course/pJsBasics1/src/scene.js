import { guiAlert, guiPrompt } from "./talking.js";

let cube;
let buddy;
let ded;

// BABYLON.ArcRotateCamera("camera1", 0.7, 1, 1, new BABYLON.Vector3(0, 5, -10), scene);
// BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -20), scene);
export async function initScene(scene) {
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
    { width: 10, height: 10 },
    scene
  );
  const m = new BABYLON.GridMaterial("grid", scene);
  ground.material = m;

  buddy = await BABYLON.SceneLoader.ImportMeshAsync(
    null,
    "./",
    "oldster.glb",
    scene
  );
  ded = buddy.meshes[0];
  ded.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.Local);

  scene.onPointerDown = onPointerDown;
  scene.executeWhenReady(() => {
    whenReady();
  });
}

async function whenReady() {
  let x = await guiPrompt("Введите целое число - смещение по оси X");
  let size = await guiPrompt("Введите целое число - размер модели");
  ded.position.x = parseInt(x);
  ded.scalingDeterminant = parseInt(size);
}

async function onPointerDown(scene) {}
