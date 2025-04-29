import { ask, input, guiPrompt, guiAlert } from "./talking.js";

let dialogActive = false;
let healthText;

function makeVisible(mesh, visible) {
  if (mesh.hasOwnProperty("isVisible")) mesh.isVisible = visible;
  if ("getChildren" in mesh) {
    let children = mesh.getChildren();
    for (let child of children) {
      makeVisible(child, visible);
    }
  }
}

export async function initScene(scene) {
  scene.clearColor = new BABYLON.Color3(0.8, 0.85, 0.95);
  let camera = new BABYLON.ArcRotateCamera(
    "camera1",
    0.7,
    1,
    1,
    new BABYLON.Vector3(0, 5, -10),
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
  m.mainColor = new BABYLON.Color3(0.5, 0.5, 0.5);
  ground.material = m;

  let sword = await BABYLON.SceneLoader.ImportMeshAsync(
    null,
    "./models/",
    "sword2.glb",
    scene
  );
  sword = sword.meshes[0];
  sword.position.y = 1;
  sword.position.x = 0;
  makeVisible(sword, false);

  let currentWeapon = sword;

  let axe = await BABYLON.SceneLoader.ImportMeshAsync(
    null,
    "./models/",
    "axe2.glb",
    scene
  );
  axe = axe.meshes[0];
  axe.position.y = 1;
  axe.position.x = 1;
  makeVisible(axe, false);

  let grenade = await BABYLON.SceneLoader.ImportMeshAsync(
    null,
    "./models/",
    "grenade.glb",
    scene
  );
  grenade = grenade.meshes[0];
  grenade.position.y = 1;
  grenade.position.x = 2;
  makeVisible(grenade, false);

  let katana = await BABYLON.SceneLoader.ImportMeshAsync(
    null,
    "./models/",
    "katana2.glb",
    scene
  );
  katana = katana.meshes[0];
  katana.position.y = 1;
  katana.position.x = 3;
  makeVisible(katana, false);

  let magic_stick = await BABYLON.SceneLoader.ImportMeshAsync(
    null,
    "./models/",
    "magic_stick2.glb",
    scene
  );
  magic_stick = magic_stick.meshes[0];
  magic_stick.position.y = 1;
  magic_stick.position.x = 4;
  makeVisible(magic_stick, false);

  let rifle = await BABYLON.SceneLoader.ImportMeshAsync(
    null,
    "./models/",
    "rifle2.glb",
    scene
  );
  rifle = rifle.meshes[0];
  makeVisible(rifle, false);
  rifle.position.y = 1;
  rifle.position.x = 5;

  //Невидимый параллелепипед, который отрабтывает щелчки мышкой по деду
  let dedbox = new BABYLON.MeshBuilder.CreateBox("dedbox", {
    height: 5,
    width: 1,
    depth: 1,
  });
  dedbox.position.x = -2;
  dedbox.isVisible = false;
  dedbox.isClickable = true;

  //swat
  let meshes = await BABYLON.SceneLoader.ImportMeshAsync(
    null,
    "./models/",
    "swat.glb",
    scene
  );
  let swat = meshes.meshes[0];
  swat.name = "swat";
  swat.rotate(BABYLON.Axis.Y, Math.PI * 2, BABYLON.Space.LOCAL);
  swat.position.x = -2;
  swat.position.z = -2;

  // ded

  let meshes2 = await BABYLON.SceneLoader.ImportMeshAsync(
    null,
    "./models/",
    "oldster.glb",
    scene
  );
  let ded = meshes2.meshes[0];
  ded.name = "ded";
  ded.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.LOCAL);
  ded.position.x = -2;

  window.addEventListener("keydown", keydown);
  function keydown(event) {
    switch (event.code) {
      case "KeyW":
        swat.position.z = swat.position.z + 1;
        break;
      case "KeyA":
        swat.position.x = swat.position.x - 1;
        break;
      case "KeyS":
        swat.position.z = swat.position.z - 1;
        break;
      case "KeyD":
        swat.position.x = swat.position.x + 1;
        break;
      case "Digit1":
        setWeapon(sword);
        break;
      case "Digit2":
        setWeapon(rifle);
        break;
      case "Digit3":
        setWeapon(axe);
        break;
      case "Digit4":
        setWeapon(katana);
        break;
      case "Digit5":
        setWeapon(grenade);
        break;
      case "Digit6":
        setWeapon(magic_stick);
        break;
    }
    console.log(event.code);
  }

  function setWeapon(newWeapon) {
    if (currentWeapon !== undefined) {
      makeVisible(currentWeapon, false);
      currentWeapon = newWeapon;
      makeVisible(currentWeapon, true);
    }
  }
  makeUI();

  scene.executeWhenReady(() => {
    whenReady();
  });
  scene.onPointerPick = function (evt, info) {
    if ((info.pickedMesh.name = "dedbox")) {
      dialog();
    }
  };

  async function dialog() {
    if (dialogActive) return;
    dialogActive = true;
    makeVisible(sword, false);
    makeVisible(rifle, false);
    makeVisible(axe, false);
    makeVisible(katana, false);
    makeVisible(grenade, false);
    makeVisible(magic_stick, false);

    let answer = await ask(
      dedbox,
      "Приветствую! Чем могу вам помочь?",
      ["Спасибо, я только посмотреть.", "Я хотел бы приобрести оружие."],
      scene
    );
    if (answer == 0) {
      await ask(dedbox, "Как пожелаете. Смотрите на здоровье.", ["OK"], scene);
    } else {
      answer = await ask(
        dedbox,
        "С какой целью, позвольте спросить?",
        ["Люблю охоту", "Буду драться на дуэли"],
        scene
      );
      if (answer == 0) {
        answer = await ask(
          dedbox,
          "Все ясно. Вам что-нибудь по мощнее или по изящнее?",
          ["Что-нибудь необычное у вас есть?", "Давай самое убойное!"],
          scene
        );
        if (answer == 0) {
          await ask(
            dedbox,
            "Вот, пожалуйста, волшебный посох!",
            ["Превосходно, я беру."],
            scene
          );
        } else {
          await ask(
            dedbox,
            "Вот великий топор!\nРубите на здоровье",
            ["Великолепно"],
            scene
          );
        }
      } else {
        answer = await ask(
          dedbox,
          "Какое оружие предпочитаете?",
          ["Мне нужна катана", "Мы будем сражаться на вилках!"],
          scene
        );
        if (answer == 0) {
          await ask(
            dedbox,
            "Конечно, только осторожнее, она очень острая.",
            ["OK"],
            scene
          );
        } else {
          await ask(dedbox, "Извините, такого не держим", ["OK"], scene);
        }
      }
    }

    dialogActive = false;
  }
}

async function whenReady() {}

function makeUI() {
  var advancedTexture =
    BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  var rect1 = new BABYLON.GUI.Rectangle();
  rect1.width = 0.2;
  rect1.height = "40px";
  rect1.cornerRadius = 20;
  rect1.color = "Orange";
  rect1.thickness = 4;
  rect1.background = "black";
  rect1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  rect1.verticalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_BOTTOM;

  advancedTexture.addControl(rect1);
  healthText = new BABYLON.GUI.TextBlock();
  healthText.text = "90";
  healthText.color = "white";
  healthText.fontSize = 24;

  rect1.addControl(healthText);
}

function setHealthText(text, color) {
  healthText.text = text;
  healthText.color = color.toHexString();
  console.log(color.toHexString());
}
