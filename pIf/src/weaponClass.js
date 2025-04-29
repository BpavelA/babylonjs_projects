// let weapons;
// async function loadWeapon(scene) {
//   weapons = new Map();
//   const weaponsInfo = [
//     { name: "sword", file: "sword2.glb" },
//     { name: "grenade", file: "grenade.glb" },
//     { name: "axe", file: "axe2.glb" },
//     { name: "katana", file: "katana2.glb" },
//     { name: "rifle", file: "rifle2.glb" },
//     { name: "magic_stick", file: "magic_stick2.glb" }];
  
//   for (const { name, file } of weaponsInfo) {
//     const res = await BABYLON.SceneLoader.ImportMeshAsync(null, "./models/", file, scene);
//     makeVisible(res.meshes[0]);
//     weapons.set(name, res);
//   }
//   return weapons;
// }


//Абстрактный класс Weapon
class Weapon {
  mesh;
  scene;
  position;
  size;

  constructor(mesh, position, size, scene) {
    this.mesh = mesh.clone();
    this.scene = scene;
    this.position = position;
    this.size = size;
    this.pad = new BABYLON.MeshBuilder.CreateCylinder(
      `pad-${this.mesh.name}`,
      { diameterTop: 1.8, daimeterBottom: 1, height: 0.8 },
      scene
    );
    this.setSize(this.size);
    this.setVisible(false);
    this.setPosition(this.position);
    this.pad.position = this.mesh.position.subtract(
      new BABYLON.Vector3(0, 1, 0)
    );
  }

  setPosition(position) {
    this.mesh.position = position;
  }
  setSize(size) {
    this.mesh.scaling = new BABYLON.Vector3(size, size, size);
  }
  setVisible(visibility) {
    makeVisible(this.mesh, visibility);
    this.pad.isVisible = visibility;
  }

  startRotation() {this.rotationObserver = this.scene.onBeforeRenderObservable.add(()=>{this.mesh.rotate(BABYLON.Axis.Y, 0.005)})}
  
  stopRotation() {this.rotationObserver.remove() }
    
  showcaseWeapon() {
    this.setVisible(true);
    this.startRotation()
  }
  dispose() {
    this.mesh.dispose();
  }

  rotateAroundPoint(point, axis, angle) {
    this.mesh.position.subtractInPlace(point); 
    this.mesh.rotate(axis, angle)
    this.mesh.position.addInPlace(point)
  }
}
//Дочерний класс Sword
class Sword extends Weapon {
  constructor(mesh, position, size, scene) {
    super(mesh, position, size, scene);
    this.mesh.rotate(BABYLON.Axis.Z, 3 * Math.PI / 5, BABYLON.Space.LOCAL);
  }
  startRotation() {
    this.setVisible(true);
    this.rotationObserver = this.scene.onBeforeRenderObservable.add(() => {this.rotateAroundPoint(this.pad.position.add(new BABYLON.Vector3(0, 2, 0)), BABYLON.Axis.Y, 0.01); });
  }
} 

//Дочерний класс Grenade
class Grenade extends Weapon {
  constructor(mesh, position, size, scene) {
    super(mesh, position, size, scene);
    this.t = 0;
    this.setSize(4)
  }
  startRotation() {
    this.rotationObserver = this.scene.onBeforeRenderObservable.add(() => {
      this.rotateAroundPoint(this.pad.position.add(new BABYLON.Vector3(0, 2, 0)), BABYLON.Axis.Y, 0.01);
      this.mesh.position.y = Math.abs(Math.sin(this.t)) + 1;
      this.t += 0.005;
     });
  }
} 

//Дочерний класс Axe
class Axe extends Weapon {
  constructor(mesh, position, size, scene) {
    super(mesh, position, size, scene);
    this.setSize(0.8);
    this.position.y = 1.5;
  }
  startRotation() {
    this.rotationObserver = this.scene.onBeforeRenderObservable.add(() => {
      this.rotateAroundPoint(this.pad.position.add(new BABYLON.Vector3(0, 2, 0)), BABYLON.Axis.Y, 0.01);
      });
  }
}

//Дочерний класс Katana
class Katana extends Weapon {
  constructor(mesh, position, size, scene) {
    super(mesh, position, size, scene);
    this.setSize(1)
    this.mesh.rotate(BABYLON.Axis.Z, 4 * Math.PI / 5, BABYLON.Space.LOCAL);
    this.position.y = 1.5
  }
  startRotation() {
    this.rotationObserver = this.scene.onBeforeRenderObservable.add(() => {
      this.rotateAroundPoint(this.pad.position.add(new BABYLON.Vector3(0, 2, 0)), BABYLON.Axis.Y, 0.01);
      });
  }
}

//Дочерний класс Rifle
class Rifle extends Weapon {
  constructor(mesh, position, size, scene) {
    super(mesh, position, size, scene);
    this.setSize(1)
  }
  startRotation() {
    this.rotationObserver = this.scene.onBeforeRenderObservable.add(() => {
      this.rotateAroundPoint(this.pad.position.add(new BABYLON.Vector3(0, 2, 0)), BABYLON.Axis.Y, 0.01);
      });
  }
}

//Дочерний класс Magic_Stick
class Magic_Stick extends Weapon {
  constructor(mesh, position, size, scene) {
    super(mesh, position, size, scene);
    this.setSize(0.8);
    this.position.y = 1.5;
  }
  startRotation() {
    this.rotationObserver = this.scene.onBeforeRenderObservable.add(() => {
      this.rotateAroundPoint(this.pad.position.add(new BABYLON.Vector3(0, 2, 0)), BABYLON.Axis.Y, 0.01);
     });
  }
}


function makeVisible(mesh, visible) {
  if ("isVisible" in mesh) mesh.isVisible = visible;
  if ("getChildren" in mesh) {
    let children = mesh.getChildren();
    for (let child of children) {
      makeVisible(child, visible);
    }
  }
}
export {Weapon, Sword, Grenade, Axe, Rifle, Katana, Magic_Stick}