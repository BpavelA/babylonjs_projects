import { guiConfirm, guiPrompt } from "./talking.js";

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
    { width: 100, height: 100 },
    scene
  );
  const m = new BABYLON.GridMaterial("grid", scene);
  m.mainColor = new BABYLON.Color3(0.5, 0.5, 0.5);
  ground.material = m;

  const columnBulk = await BABYLON.SceneLoader.ImportMeshAsync(
    null,
    "./models/",
    "column.glb",
    scene
  );

  const column = columnBulk.meshes[0];
  let z = 15;
  for (let i = 0; i < 10; i++) {
    const clonedColumn1 = column.clone();
    const clonedColumn2 = column.clone();
    clonedColumn1.position = new BABYLON.Vector3(-45, 0, z);
    clonedColumn2.position = new BABYLON.Vector3(-30, 0, z);
    z -= 4;
  }

  const columnCount = 10;
  const radius = 10;
  const dAlpha = (Math.PI * 2) / columnCount;

  for (let i = 0; i < columnCount; i++) {
    const clonedColumn = column.clone();
    clonedColumn.position.x = Math.sin(dAlpha * i) * radius;
    clonedColumn.position.z = Math.cos(dAlpha * i) * radius;
    clonedColumn.position.y = 8.5;
    clonedColumn.rotate(BABYLON.Axis.Y, dAlpha * i, BABYLON.Space.Local);
  }
  let d = 40;

  for (let i = 0; i < 9; i++) {
    const cyl = new BABYLON.MeshBuilder.CreateCylinder(
      "cyl",
      { height: 1, diameter: `${d}` },
      scene
    );
    d -= 2;
    cyl.position.y = i;
    const mat = new BABYLON.StandardMaterial("mat-" + i, scene);
    mat.diffuseColor = new BABYLON.Color3(1 - i / 10, i / 10, i / 10);
    cyl.material = mat;
  }

  column.dispose();
  scene.executeWhenReady(() => {
    whenReady();
  });
}

async function whenReady() {}
