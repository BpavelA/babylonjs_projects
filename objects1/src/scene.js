const sceneWidth = 10;
const sceneHeight = 10;
let movingRight = false,
    movingLeft = false,
    movingForward = false,
    movingBack = false;


const fieldShift = -4.5;
let field = [];
export async function initScene(scene) {
    scene.clearColor = new BABYLON.Color3(0.0, 0.0, 0.0);
    let camera = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 2, 2.6485, new BABYLON.Vector3(0, 8, -12), scene);
    camera.setTarget(new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas)
    let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    const ground = new BABYLON.MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene);
    const m = new BABYLON.GridMaterial('grid', scene);
    m.mainColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    ground.material = m;

    scene.executeWhenReady(() => {
        whenReady();
    });

    let swat_meshes = await BABYLON.SceneLoader.ImportMeshAsync(null, './models/', 'swat.glb', scene);
    let swat = swat_meshes.meshes[0];
    swat.name = 'swat';
    swat.position.x = 1.5;
    swat.position.z = -4;

    let blue = await BABYLON.SceneLoader.LoadAssetContainerAsync('./models/', 'blue.glb', scene);
    let magic = await BABYLON.SceneLoader.LoadAssetContainerAsync('./models/', 'magic.glb', scene);
    let gem = await BABYLON.SceneLoader.LoadAssetContainerAsync('./models/', 'gem.glb', scene);
    let chaos = await BABYLON.SceneLoader.LoadAssetContainerAsync('./models/', 'chaos_emerald.glb', scene);


    field = [
        [1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 2, 1],
        [1, 0, 2, 0, 0, 0, 0, 0, 0, 1],
        [1, 4, 0, 0, 0, 0, 2, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
        [1, 1, 0, 0, 1, 1, 0, 1, 1, 1],
        [1, 0, 3, 0, 0, 0, 0, 0, 0, 3],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
        [1, 0, 1, 1, 1, 5, 1, 1, 1, 0]
    ];

    let crystal;

    let matWal = new BABYLON.StandardMaterial('wall', scene);
    matWal.diffuseTexture = new BABYLON.Texture('./textures/stone.jpg');

    // let changedMatWal = new BABYLON.StandardMaterial('changedWall', scene);
    // changedMatWal.diffuseColor = new BABYLON.Color3(1, 0, 0);

    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[0].length; j++) {
            switch (field[j][i]) {
                case 1: let box = new BABYLON.MeshBuilder.CreateBox(`field[${j}:${i}]`, { size: 1, height: 2 }, scene);
                box.position.x = i + fieldShift;
                box.position.z = j + fieldShift;
                box.position.y = 1;
                    box.material = matWal; break;
                case 2: crystal = blue.instantiateModelsToScene();
                    crystal = crystal.rootNodes[0];
                    crystal.position = new BABYLON.Vector3(i + fieldShift, 0, j + fieldShift); break;
                case 3: crystal = magic.instantiateModelsToScene();
                    crystal = crystal.rootNodes[0];
                    crystal.position = new BABYLON.Vector3(i + fieldShift, 0, j + fieldShift); break;
                case 4: crystal = gem.instantiateModelsToScene();
                    crystal = crystal.rootNodes[0];
                    crystal.position = new BABYLON.Vector3(i + fieldShift, 0, j + fieldShift); break;
                case 5: crystal = chaos.instantiateModelsToScene();
                    crystal = crystal.rootNodes[0];
                    crystal.position = new BABYLON.Vector3(i + fieldShift, 0, j + fieldShift); break;
                }
            }
            
        }
        
    function updatePosition() {
        let speed = 0.05;
        swat.rotationQuaternion = null;
        let newPos = swat.position;
        if (movingForward) {
            newPos.z += speed;
            swat.rotation.y = Math.PI;
        }
        if (movingBack) {
            newPos.z -= speed;
            swat.rotation.y = 0;
        } 
        if (movingRight) {
            newPos.x += speed;
            swat.rotation.y = - Math.PI / 2;
        }
            
        if (movingLeft) {
            newPos.x -= speed;
            swat.rotation.y = Math.PI / 2; 
        }
            
    } 
    
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);

    window.addEventListener('click', ()=>console.log('Hello!'));    

    function keydown(event) {
        let newPos = swat.position.clone();
        switch (event.code) {
            case 'KeyW': movingForward = true; movingBack = false; break;
            case 'KeyA': movingLeft = true; movingRight = false; break;
            case 'KeyS': movingBack = true; movingForward = false; ; break;
            case 'KeyD': movingRight = true; movingLeft = false;  break;
        }
    }

    function keyup(event) {
        switch (event.code) {
            case 'KeyW': movingForward = false; break;
            case 'KeyA': movingLeft = false; break;
            case 'KeyS': movingBack = false; break;
            case 'KeyD': movingRight = false; break;
        }
    }
    scene.onBeforeRenderObservable.add(()=> {updatePosition()})
}

async function whenReady() {

}

function collide(ax1, az1, ax2, az2, bx1, bz1, bx2, bz2){return checkTectOverlap([[ax1,az1],[ax2, az2]], [[bx1,bz1],[bx2,bz2]])}

function checkPosition(px, pz, bx, bz) {
    if (bx < 0 || bz < 0 || bz > 9 || bx > 9) return false;
    if (field[bx][bz] != 1) return true;
    return !collide(px-0.5, pz-0.5, px+0.5, pz+0.5, bx-0.5, bz-0.5, bx+0.5, bz+0.5)
};