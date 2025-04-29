
const sceneWidth = 10;
const sceneHeight = 10;

let currentAG, previousAG;

let movingRight = false,
    movingLeft = false,
    movingForward = false,
    movingBack = false,
    running = false;

const runSpeed = 0.1;
const walkSpeed = 0.05;

let things = [];

let walkingAG, idleAG, runningAG, dyingAG, workingAG;

export async function initScene(scene) {
    scene.clearColor = new BABYLON.Color3(0.0, 0.0, 0.0);
    // let camera = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 8, 2.6485, new BABYLON.Vector3(0, 8, -12), scene);
    let camera = new BABYLON.FollowCamera("camera1", new BABYLON.Vector3(-5, 5, 5), scene);
    camera.setTarget(new BABYLON.Vector3(5, 0, 0));
    camera.attachControl(canvas)
    let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    const ground = new BABYLON.MeshBuilder.CreateGround('ground', { width: 40, height: 40 }, scene);

    const m = new BABYLON.StandardMaterial();
    m.diffuseTexture = new BABYLON.Texture('textures/sand.jpg')
    m.diffuseTexture.uScale = 15;
    m.diffuseTexture.vScale = 15;
    ground.material = m;

    skybox('./textures/sky.jpg', scene);

    scene.executeWhenReady(() => {
        whenReady();
    });

    let field = [
        [0, 0, 1, 0, 0, 0, 1, 1, 1, 1],
        [0, 0, 2, 3, 4, 5, 1, 1, 1, 1],
        [0, 6, 0, 0, 0, 0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 1, 0, 1],
        [0, 0, 6, 0, 6, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 1, 0, 1],
        [1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
        [1, 1, 0, 0, 6, 0, 1, 1, 1, 1]
    ]


    //let blue = await BABYLON.SceneLoader.ImportMeshAsync(null,'./models/','blue.glb',scene)
    //let gem = await BABYLON.SceneLoader.ImportMeshAsync(null,'./models/','gem.glb',scene)

    //let magic = await BABYLON.SceneLoader.ImportMeshAsync(null,'./models/','magic.glb',scene)

    //let magic = await BABYLON.SceneLoader.ImportMeshAsync(null,'./models/','chaos_emerald.glb',scene)

    let blue = await BABYLON.SceneLoader.LoadAssetContainerAsync('/models/', 'blue.glb', scene);

    let magic = await BABYLON.SceneLoader.LoadAssetContainerAsync('/models/', 'magic.glb', scene);

    let gem = await BABYLON.SceneLoader.LoadAssetContainerAsync('/models/', 'gem.glb', scene);

    let chaos = await BABYLON.SceneLoader.LoadAssetContainerAsync('/models/', 'chaos_emerald.glb', scene);

    let bombMesh = await BABYLON.SceneLoader.LoadAssetContainerAsync('/models/', 'dynamite2.glb', scene);

    let swat = BABYLON.MeshBuilder.CreateBox();
    swat.rotationQuaternion = null;
    swat.rotation.y = Math.PI;

    let swat_meshes = await BABYLON.SceneLoader.ImportMeshAsync(null, './models/', 'swat2.glb', scene);
    let swatMesh = swat_meshes.meshes[0];
    swatMesh.name = 'swatMesh';
    swatMesh.position.x = 0;
    swatMesh.parent = swat;
    swat.isVisible = false;
    swat_meshes.animationGroups[6].play(true);
    

    walkingAG = scene.getAnimationGroupByName('Walking');
    runningAG = scene.getAnimationGroupByName('Running');
    dyingAG = scene.getAnimationGroupByName('Dying');
    workingAG = scene.getAnimationGroupByName('Working');
    idleAG = scene.getAnimationGroupByName('Idle');
    currentAG = idleAG;

    camera.lockedTarget = swat;

    let matWall = new BABYLON.StandardMaterial('wall', scene);
    matWall.diffuseTexture = new BABYLON.Texture('./textures/stone.jpg')
    let thing;
/*
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            switch (field[i][j]) {
                case 1:
                    let box = new BABYLON.MeshBuilder.CreateBox('box', { size: 1 }, scene);
                    box.position.x = i;
                    box.position.z = j;
                    box.position.y = 1;
                    box.scaling = new BABYLON.Vector3(1, 2, 1);
                    box.material = matWall;
                    break;
                case 2:
                    thing = blue.instantiateModelsToScene();
                    thing = thing.rootNodes[0];
                    thing.position = new BABYLON.Vector3(i, 0, j);
                    thing.metadata = 'crystal';
                    things.push(thing);
                    break;
                case 3:
                    thing = gem.instantiateModelsToScene();
                    thing = thing.rootNodes[0];
                    thing.position = new BABYLON.Vector3(i, 0, j);
                    thing.metadata = 'crystal';
                    things.push(thing);
                    break;
                case 4:
                    thing = magic.instantiateModelsToScene();
                    thing = thing.rootNodes[0];
                    thing.position = new BABYLON.Vector3(i, 0, j);
                    thing.metadata = 'crystal';
                    things.push(thing);

                    break;

                case 5:
                    thing = chaos.instantiateModelsToScene();
                    thing = thing.rootNodes[0];
                    thing.position = new BABYLON.Vector3(i, 0, j);
                    thing.metadata = 'crystal';
                    things.push(thing);
                    break;
                case 6:
                    thing = bombMesh.instantiateModelsToScene();
                    thing = thing.rootNodes[0];
                    thing.position = new BABYLON.Vector3(i, 0, j);
                    thing.metadata = 'bomb';
                    things.push(thing);
                    break;
            }

        }
    }
*/
    window.addEventListener('keydown', keydown)

    function keydown(event) {
        switch (event.code) {
            case 'KeyW': movingForward = true; movingBack = false; console.log(event.code); break;
            case 'KeyA': movingLeft = true; movingRight = false; console.log(event.code); break;
            case 'KeyS': movingForward = false; movingBack = true; console.log(event.code); break;
            case 'KeyD': movingLeft = false; movingRight = true; console.log(event.code); break;
            case 'ShiftLeft': running = true; console.log(event.code); break;
        }
    }


    window.addEventListener('keyup', keyup)

    function keyup(event) {
        switch (event.code) {
            case 'KeyW': movingForward = false; break;
            case 'KeyA': movingLeft = false; break;
            case 'KeyS': movingBack = false; break;
            case 'KeyD': movingRight = false; break;
            case 'ShiftLeft': running = false; break;
        }
    }


    function updatePosition() {
        let speed;

        let cx = Math.round(swat.position.x);
        let cz = Math.round(swat.position.z);

        previousAG = currentAG;
        if (movingBack || movingForward || movingLeft || movingRight) {
            if (running) {
                speed = runSpeed;
                currentAG = runningAG;
            } else {
                speed = walkSpeed;
                currentAG = walkingAG;
            }
               
        } else currentAG = idleAG; 

        if (previousAG && previousAG !== currentAG) {
            previousAG.stop();
            currentAG.play(true)
        }
        

        swatMesh.rotationQuaternion = null;
        let newPos = swat.position;

        if (movingForward) {
            if (canGo(swat.position.x, swat.position.z + speed, cx, cz + 1)) {
                newPos.z += speed;
            }
            swatMesh.rotation.y = 0;
        }

        if (movingBack) {
            if (canGo(swat.position.x, swat.position.z - speed, cx, cz - 1)) {
                newPos.z -= speed;
            }
            swatMesh.rotation.y = Math.PI;
        }

        if (movingLeft) {
            if (canGo(swat.position.x - speed, swat.position.z, cx - 1, cz)) {
                newPos.x -= speed;
            }
            swatMesh.rotation.y = -Math.PI / 2;
        }

        if (movingRight) {
            if (canGo(swat.position.x + speed, swat.position.z, cx + 1, cz)) {
                newPos.x += speed;
            }
            swatMesh.rotation.y = Math.PI / 2;
        }

        swat.position = newPos;
    }

    function canGo(px, pz, bx, bz) {
        if (bz < 0 || bx < 0 || bz >9 || bx > 9 ) return false;
        if (field[bx][bz] !== 1) return true;
        return !collide(px - 0.5, pz - 0.5,
            px + 0.5, pz + 0.5,
            bx - 0.5, bz - 0.5,
            bx + 0.5, bz + 0.5);
    }

    function checkThingsCollisions() {
        let x = Math.round(swat.position.x);
        let z = Math.round(swat.position.z);

        for(let t of things){
            if(collide(swat.position.x-0.5,
                        swat.position.z-0.5,
                        swat.position.x+0.5,
                        swat.position.z+0.5,
                        t.position.x-0.5,
                        t.position.z-0.5,                
                        t.position.x+0.5,
                        t.position.z+0.5
                )){
                  
                    switch (t.metadata) {
                        case 'crystal':
                            things.splice(things.indexOf(t),1)
                            scene.removeMesh(t);
                            t.dispose();
                            break;
                        case 'bomb':
                            boom(scene, new BABYLON.Vector3(t.position.x, 0, t.position.z));
                            things.splice(things.indexOf(t),1)
                            scene.removeMesh(t);
                            t.dispose();
                            break;
                    }
                }
        }

        
        
    }

    scene.beforeRender = function () {
        updatePosition();
        checkThingsCollisions();
    }
}

async function whenReady() {

}

//Функция проверяет пересечение двух прямоугольников
function checkRectOverlap(rect1, rect2) {
    if ((rect1[0][0] <= rect2[0][0] && rect2[0][0] <= rect1[1][0])
        || (rect1[0][0] <= rect2[1][0] && rect2[1][0] <= rect1[1][0])
        || (rect2[0][0] <= rect1[0][0] && rect1[1][0] <= rect2[1][0])) {
        if ((rect1[0][1] <= rect2[0][1] && rect2[0][1] <= rect1[1][1])
            || (rect1[0][1] <= rect2[1][1] && rect2[1][1] <= rect1[1][1])
            || (rect2[0][1] <= rect1[0][1] && rect1[1][1] <= rect2[1][1])) {
            return true;
        }
    }
    return false;
}

function collide(ax1, az1, ax2, az2, bx1, bz1, bx2, bz2) {
    return checkRectOverlap([[ax1, az1], [ax2, az2]],
        [[bx1, bz1], [bx2, bz2]])
}



function boom(scene, mesh) {
    BABYLON.ParticleHelper.CreateAsync("explosion", scene).then((set) => {
        set.systems.forEach(s => {
            s.disposeOnStop = true;
            s.emitter = mesh;
        });
        set.start();
    });
}

function skybox(texture, scene) {
    const skybox = BABYLON.MeshBuilder.CreateSphere('sky', { diameter: 1000 }, scene);

    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.Texture(texture, scene, true, false);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.EQUIRECTANGULAR_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
}