import { ask, input, guiPrompt, guiAlert } from "./talking.js";
import {Weapon, Sword, Grenade, Axe, Rifle, Katana, Magic_Stick } from "./weaponClass.js";

let dialogActive = false;
let healthText = 0;
function makeVisible(mesh, visible) {
  if ("isVisible" in mesh) mesh.isVisible = visible;
  if ("getChildren" in mesh) {
    let children = mesh.getChildren();
    for (let child of children) {
      makeVisible(child, visible);
    }
  }
}

export async function initScene(scene) {
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
  ground.material = m;

  // await initWeapons(scene);
  // const weapons = await loadWeapon(scene);

  
  //Невидимый параллелепипед, который отрабтывает щелчки мышкой по деду
  let dedbox = new BABYLON.MeshBuilder.CreateBox("dedbox", {
    height: 5,
    width: 1,
    depth: 1,
  });
  dedbox.position.x = -2;
  dedbox.isVisible = false;
  dedbox.isClickable = true;

  //ded
  let meshes = await BABYLON.SceneLoader.ImportMeshAsync(
    null,
    "./models/",
    "oldster.glb",
    scene
  );
  let buddy = meshes.meshes[0];
  buddy.name = "ded";
  buddy.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.LOCAL);
  buddy.position.x = -2;

  makeUI();

  scene.executeWhenReady(() => {
    whenReady();
  });

  scene.onPointerPick = function (evt, info) {
    if ((info.pickedMesh.name = "dedbox")) {
      dialog();
    }
  };


  // Создаем меч
let sword = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./models/",
      "sword2.glb",
      scene
    );
makeVisible(sword.meshes[0], false);
  sword = new Sword(sword.meshes[0], new BABYLON.Vector3(0, 1, 0), 1, scene);
  
  // Создаем гранату
  
let grenade = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./models/",
      "grenade.glb",
      scene
    );
  makeVisible(grenade.meshes[0], false);
  grenade = new Grenade(
    grenade.meshes[0],
    new BABYLON.Vector3(0, 1, 0),
    1,
    scene
  );

// Диалог
  async function dialog() {
    
    if (dialogActive) return;
    dialogActive = true;
    
    let age = await input(dedbox, "Сколько тебе лет?", scene);
    age = parseInt(age);
    if (age < 18 || age > 70) {
      await ask(dedbox, "Старикам и детям оружие не продаем!", ["ОК"], scene);
    } else {
      let r = await ask(
        dedbox,
        "Привет. Ты мужчина или женщина?",
        ["Мужчина", "Женщина", "Не помню"],
        scene
      );
      if (r == 0) {
        let weapon = await ask(
          dedbox,
          "Добро пожаловать, о великий воин!\n Какое оружие ты предпочитаешь?",
          ["Меч", "Винтовка", "Топор"],
          scene
        );
        if (weapon == 0) sword.showcaseWeapon();
        if (weapon == 1) makeVisible(rifle, true);
        if (weapon == 2) makeVisible(axe, true);
        if (weapon === 2)
          await ask(dedbox, "Топоры закончились!", ["ОК"], scene);
      } else if (r == 1) {
        let weapon = await ask(
          dedbox,
          "Добро пожаловать, о великая воительница!\n Какое оружие ты предпочитаешь?",
          ["Катана", "Граната", "Посох"],
          scene
        );
        if (weapon == 0) makeVisible(katana, true);
        if (weapon == 1) grenade.showcaseWeapon();
        if (weapon == 2) makeVisible(magic_stick, true);
      } else {
        await ask(dedbox, "Сначала вспомни! До свидания", ["ОК"], scene);
      }
    }

    dialogActive = false;
  }
}

async function initWeapons(scene) {
    
    let axe = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./models/",
      "axe2.glb",
      scene
    );
    
    let katana = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./models/",
      "katana2.glb",
      scene
    );
    let magic_stick = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./models/",
      "magic_stick2.glb",
      scene
    );
    let rifle = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./models/",
      "rifle2.glb",
      scene
    );

  
  makeVisible(rifle.meshes[0], false);
  makeVisible(axe.meshes[0], false);
  makeVisible(katana.meshes[0], false);
  
  makeVisible(magic_stick.meshes[0], false);

  
  
  katana = new Katana(katana.meshes[0], new BABYLON.Vector3(0, 1, 0), 1, scene);
  magic_stick = new Magic_Stick(
    magic_stick.meshes[0],
    new BABYLON.Vector3(0, 1, 0),
    1,
    scene
  );
  rifle = new Rifle(rifle.meshes[0], new BABYLON.Vector3(0, 1, 0), 1, scene);
  axe = new Axe(axe.meshes[0], new BABYLON.Vector3(0, 1, 0), 1, scene);
  
  
  // sword.showcaseWeapon();
  // grenade.showcaseWeapon();
  // axe.showcaseWeapon();
  // katana.showcaseWeapon();
  // magic_stick.showcaseWeapon();
  // rifle.showcaseWeapon();
}

async function whenReady() {
  let color;
  let health = 95;
  health = parseInt(health);
  color = new BABYLON.Color3(0, 1, 0);
  setHealthText(health, color);
}

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
  healthText.text = "90%";
  healthText.color = "white";
  healthText.fontSize = 24;

  rect1.addControl(healthText);
}

function setHealthText(text, color) {
  healthText.text = text;
  healthText.color = color.toHexString();
  console.log(color.toHexString());
}
