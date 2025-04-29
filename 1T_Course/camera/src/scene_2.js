import { DefaultLoadingScreen } from "babylonjs";
import { guiAlert } from "./talking.js";

const sceneWidth = 10;
const sceneHeight = 10;

let movingRight = false,
    movingLeft = false,
    movingForward = false,
    movingBack = false,
    running = false;

const runSpeed = 0.1;
const walkSpeed = 0.05;

let things = [];

let walkingAG, workingAG, runningAG, idleAG, dyingAG;

let curAnimGrp, prevAnimGrp;

let healthText, timerText;

let health = 100;
let timer = 10;
let dead = false;

let sniperMode = false;

export async function initScene(scene) {
    scene.clearColor = new BABYLON.Color3(0.0, 0.0, 0.0);
    let arcCamera = new BABYLON.ArcRotateCamera("arcCamera", 4.61, 1.2, 5, new BABYLON.Vector3(0, 0, 0), scene);
    // let camera = new BABYLON.FollowCamera("camera1", new BABYLON.Vector3(-3, 3, 5), scene);
    let camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0, 1, 0), scene);
    scene.activeCamera = arcCamera;
    arcCamera.attachControl(canvas);
    // camera.setTarget(new BABYLON.Vector3(5, 0, 0));
    
    let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    const ground = new BABYLON.MeshBuilder.CreateGround('ground', { width: 40, height: 40 }, scene);
    ground.checkCollisions = true;
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

    // arcCamera.parent = swat;
    // arcCamera.minZ = 0.01;
    // arcCamera.fov = 0.95;

    let mapCamera = new BABYLON.UniversalCamera('mapCam', new BABYLON.Vector3(0, 10, 0), scene);
    mapCamera.setTarget(BABYLON.Vector3.Zero());
    mapCamera.parent = swat;

    mapCamera.viewport = new BABYLON.Viewport(0,0,0.2,0.2);
    arcCamera.viewport = new BABYLON.Viewport(0.0,0.0,1,1);

    scene.activeCameras.push(arcCamera);
    scene.activeCameras.push(mapCamera);

    //let swat_meshes = await BABYLON.SceneLoader.ImportMeshAsync(null, './models/', 'swat2.glb', scene);
    let swat_meshes = await BABYLON.SceneLoader.ImportMeshAsync(null, './models/', 'swat2.glb', scene);
    console.log(swat_meshes)

    // scene.debugLayer.show();
    walkingAG = scene.getAnimationGroupByName('Walking');
    workingAG = scene.getAnimationGroupByName('Working');
    runningAG = scene.getAnimationGroupByName('Running');
    dyingAG = scene.getAnimationGroupByName('Dying');
    idleAG = scene.getAnimationGroupByName('Idle');

    curAnimGrp = idleAG;
    idleAG.play(true);

    let swatMesh = swat_meshes.meshes[0];
    swatMesh.name = 'swatMesh';
    swatMesh.position.x = 0;
    swatMesh.parent = swat;
    swat.isVisible = false;

    // makeVisible(swat, true);

    arcCamera.lockedTarget = swat;

    let matWall = new BABYLON.StandardMaterial('wall', scene);
    matWall.diffuseTexture = new BABYLON.Texture('./textures/stone.jpg')
    let thing;

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
                    box.checkCollisions = true;
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
                    //                    thing.metadata = 'crystal';
                    thing.metadata = 'crystal';
                    things.push(thing);
                    break;
                case 6:
                    thing = bombMesh.instantiateModelsToScene();
                    thing = thing.rootNodes[0];
                    thing.position = new BABYLON.Vector3(i, 0, j);
                    thing.metadata = 'bomb';
                    // thing.name='bomb'
                    things.push(thing);
                    break;
            }

        }
    }

    window.addEventListener('keydown', keydown);

    
    function keydown(event) {
        switch (event.code) {
            case 'KeyW':
                movingForward = true; movingBack = false; console.log(event.code);
                break;
            case 'KeyA': movingLeft = true; movingRight = false; console.log(event.code);  break;
            case 'KeyS': movingForward = false; movingBack = true; console.log(event.code); break;
            case 'KeyD': movingLeft = false; movingRight = true; console.log(event.code); break;
            case 'ShiftLeft': running = true; console.log(event.code); break;
        }
    }

    scene.onPointerDown = (e)=> {
        if (e.button == 2) {
            sniperMode = !sniperMode;
            if (sniperMode) {
                arcCamera.fov = 0.3;
            } else { arcCamera.fov = 0.95; }
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

        if(dead){ return};
        let speed;

        prevAnimGrp = curAnimGrp;
        if (movingRight || movingLeft || movingForward || movingBack) {
            if (running) {
                speed = runSpeed;
                curAnimGrp = runningAG;
            } else {
                speed = walkSpeed;
                curAnimGrp = walkingAG;
            }
        } else {
            curAnimGrp = idleAG;
        }
        
        if (prevAnimGrp && prevAnimGrp !== curAnimGrp) {
            prevAnimGrp.stop();
            curAnimGrp.play(true);
        }

        let cx = Math.round(swat.position.x);
        let cz = Math.round(swat.position.z);

        swatMesh.rotationQuaternion = null;
        let newPos = swat.position;

        let fwdVector = scene.activeCameras[0].getDirection(BABYLON.Vector3.Forward());
        fwdVector.y = 0;
        fwdVector.normalize();

        let leftVector = fwdVector.cross(BABYLON.Axis.Y);

        if (movingForward) { swat.moveWithCollisions(fwdVector.scale(speed)) };

        if (movingBack) { swat.moveWithCollisions(fwdVector.scale(-speed)) };

        if (movingLeft) { swat.moveWithCollisions(leftVector.scale(speed)) };

        if (movingRight) { swat.moveWithCollisions(leftVector.scale(-speed)) };

        swat.position.y = 0;
        swat.rotationQuaternion = BABYLON.Quaternion.FromLookDirectionRH(fwdVector.negate(), BABYLON.Vector3.Up());



        // if (movingForward) {
        //     if (canGo(swat.position.x, swat.position.z + speed, cx, cz + 1)) {
        //         newPos.z += speed;
        //     }
        //     swatMesh.rotation.y = 0;
        // }

        // if (movingBack) {
        //     if (canGo(swat.position.x, swat.position.z - speed, cx, cz - 1)) {
        //         newPos.z -= speed;
        //     }
        //     swatMesh.rotation.y = Math.PI;
        // }

        // if (movingLeft) {
        //     if (canGo(swat.position.x - speed, swat.position.z, cx - 1, cz)) {
        //         newPos.x -= speed;
        //     }
        //     swatMesh.rotation.y = -Math.PI / 2;
        // }

        // if (movingRight) {
        //     if (canGo(swat.position.x + speed, swat.position.z, cx + 1, cz)) {
        //         newPos.x += speed;
        //     }
        //     swatMesh.rotation.y = Math.PI / 2;
        // }

        // swat.position = newPos;
    }

    function canGo(px, pz, bx, bz) {
        if (bz < 0 || bx < 0 || bz > 9 || bx > 9) return false;
        if (field[bx][bz] !== 1) return true;
        return !collide(px - 0.5, pz - 0.5,
            px + 0.5, pz + 0.5,
            bx - 0.5, bz - 0.5,
            bx + 0.5, bz + 0.5);
    }

    function checkThingsCollisions() {
        let x = Math.round(swat.position.x);
        let z = Math.round(swat.position.z);

        for (let t of things) {
            if (collide(swat.position.x - 0.5,
                swat.position.z - 0.5,
                swat.position.x + 0.5,
                swat.position.z + 0.5,
                t.position.x - 0.5,
                t.position.z - 0.5,
                t.position.x + 0.5,
                t.position.z + 0.5
            )) {

                switch (t.metadata) {
                    case 'crystal':
                        onTouchCrystal(swat,t,scene)
                        break;
                    case 'bomb':
                        onTouchBomb(swat,t,scene)    
                        break;
                }
            }
        }
    }

    function onTouchCrystal(player,t,scene){
        things.splice(things.indexOf(t), 1)
        scene.removeMesh(t);
        t.dispose();
    }

    function onTouchBomb(player,t,scene){
        things.splice(things.indexOf(t), 1);
        setTimeout(() => {
            let distance = player.position.subtract(t.position).length();
            if (distance <=4) {
                health-=Math.round((4-distance)*25);
            }
            let color = getColor(health)
            setHealthText(health,color);

            boom(scene, new BABYLON.Vector3(t.position.x, 0, t.position.z));
            scene.removeMesh(t);
            t.dispose();
            if(health<=0){
                dead=true;
                curAnimGrp.stop();
                dyingAG.reset();
                dyingAG.play(false);
            }
        }, 1500);
    }

    makeUI();

    function setGameTimer(){
    let interval =
        setInterval(function () {
            timer--;
            timerText.text = timer;
            let cnt = things.filter((t) => {
                return t.metadata == 'bomb';
            }).length;
            if (timer == 0) {
                if (cnt > 0) {
                    guiAlert('Вы проиграли!')
                } else {
                    guiAlert('Мины обезврежены!')
                }
                clearInterval(interval);
            }
        }, 1000);
    }

    // setGameTimer();
    
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
function getColor(health) {
    let color;
    if (health >= 90) color = new BABYLON.Color3(0, 1, 0);
    if (health >= 70 && health < 90) color = new BABYLON.Color3(1, 1, 0);
    if (health >= 40 && health < 70) color = new BABYLON.Color3(0.7, 0.7, 0.2);
    if (health >= 20 && health < 40) color = new BABYLON.Color3(0.5, 0.5, 0.2);
    if (health > 0 && health < 20) color = new BABYLON.Color3(0.5, 0.1, 0.1);
    if (health <= 0) color = new BABYLON.Color3(0.5, 0.5, 0.5);
    return color;
}

function makeUI() {

    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var rect1 = new BABYLON.GUI.Rectangle();
    rect1.width = "80px";
    rect1.height = "40px";
    rect1.cornerRadius = 20;
    rect1.color = "Orange";
    rect1.thickness = 4;
    rect1.background = "black";
    rect1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    rect1.verticalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_BOTTOM;

    advancedTexture.addControl(rect1);
    healthText = new BABYLON.GUI.TextBlock();
    healthText.text = "100";
    healthText.color = "white";
    healthText.fontSize = 24;
    //healthText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    //healthText.verticalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_TOP;
    // healthText.top='0px';
    rect1.addControl(healthText);

    // sp.addControl(healthText); 

    var rect2 = new BABYLON.GUI.Rectangle();
    rect2.width = "80px";
    rect2.height = "40px";
    rect2.top = '50px';
    rect2.cornerRadius = 20;
    rect2.color = "Orange";
    rect2.thickness = 4;
    rect2.background = "black";
    rect2.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    rect2.verticalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_BOTTOM;
    advancedTexture.addControl(rect2);
    timerText = new BABYLON.GUI.TextBlock();
    timerText.text = "01:00";
    timerText.color = "white";
    timerText.fontSize = 24;
    rect2.addControl(timerText);

}

function setHealthText(text, color) {
    healthText.text = text;
    healthText.color = color.toHexString();
    console.log(color.toHexString())
}

function makeVisible(mesh, visible) {
    if ('isVisible' in mesh)
        mesh.isVisible = visible;
    if ('getChildren' in mesh) {
        let children = mesh.getChildren();
        for (let child of children) {
            makeVisible(child, visible)
        }
    }
}
