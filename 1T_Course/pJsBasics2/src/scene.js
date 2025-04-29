import { guiAlert, guiPrompt } from "./talking.js";
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

  function olympicDraw(inpX, inpY, inpZ, scene) {
    let tor0 = new BABYLON.MeshBuilder.CreateTorus(
      "tor0",
      { diameter: 1, thickness: 0.1 },
      scene
    );
    let tor1 = new BABYLON.MeshBuilder.CreateTorus(
      "tor1",
      { diameter: 1, thickness: 0.1 },
      scene
    );
    let tor2 = new BABYLON.MeshBuilder.CreateTorus(
      "tor2",
      { diameter: 1, thickness: 0.1 },
      scene
    );
    let tor3 = new BABYLON.MeshBuilder.CreateTorus(
      "tor3",
      { diameter: 1, thickness: 0.1 },
      scene
    );
    let tor4 = new BABYLON.MeshBuilder.CreateTorus(
      "tor4",
      { diameter: 1, thickness: 0.1 },
      scene
    );
    tor0.position.x = -1 + inpX;
    tor0.position.z = inpZ;

    tor1.position.x = -0.5 + inpX;
    tor1.position.z = -0.7 + inpZ;

    tor2.position.x = 0 + inpX;
    tor2.position.z = inpZ;

    tor3.position.x = 0.5 + inpX;
    tor3.position.z = -0.7 + inpZ;

    tor4.position.x = 1 + inpX;
    tor4.position.z = inpZ;

    tor0.position.y = inpY;
    tor1.position.y = inpY;
    tor2.position.y = inpY;
    tor3.position.y = inpY;
    tor4.position.y = inpY;

    let matTor0 = new BABYLON.StandardMaterial("matTor0", scene);
    let matTor1 = new BABYLON.StandardMaterial("matTor1", scene);
    let matTor2 = new BABYLON.StandardMaterial("matTor2", scene);
    let matTor3 = new BABYLON.StandardMaterial("matTor3", scene);
    let matTor4 = new BABYLON.StandardMaterial("matTor4", scene);

    matTor0.diffuseColor = new BABYLON.Color3(0, 0, 1);
    matTor1.diffuseColor = new BABYLON.Color3(1, 1, 0);
    matTor2.diffuseColor = new BABYLON.Color3(0, 0, 0);
    matTor3.diffuseColor = new BABYLON.Color3(0, 1, 0);
    matTor4.diffuseColor = new BABYLON.Color3(1, 0, 0);

    tor0.material = matTor0;
    tor1.material = matTor1;
    tor2.material = matTor2;
    tor3.material = matTor3;
    tor4.material = matTor4;
  }

  window.addEventListener("click", clickToDraw);
  let i = 0;
  //     function pushToDraw(evt) {
  //     console.log(evt);

  //     if ("d" == evt.key) {
  //       let x = Math.random() * 5 + -1;
  //       let y = Math.random() * 5 + -0;
  //       let z = Math.random() * 5 + -1;

  //       olympicDraw(x, y, z, scene);
  //       i++;
  //       console.log(`Кольца добавлены. Всего ${i}`);
  //     }
  //   }

  function clickToDraw(evt) {
    console.log(evt);

    let x = Math.floor(this.event.clientX / 100);
    let y = Math.floor(this.event.clientY / 100);
    let z = x - y;

    olympicDraw(x, y, z, scene);
    i++;
    console.log(
      `Кольца добавлены. Координаты фигуры: ${x},${y},${z}. Всего ${i}`
    );
  }

  scene.executeWhenReady(() => {
    whenReady();
  });
}

async function whenReady() {}
