import ui from './ui/mainMenu.json'
export async function initScene(scene) {
    scene.clearColor = new BABYLON.Color3(0.8, 0.85, 0.95);
    let camera = new BABYLON.ArcRotateCamera("camera1",-3.5982,1.0040,5.6485,new BABYLON.Vector3(0,0,0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    const ground = new BABYLON.MeshBuilder.CreateGround('ground',{width:10,height:10},scene);
    const m=new BABYLON.GridMaterial('grid',scene);
    m.mainColor = new BABYLON.Color3(0.5,0.5,0.5);
    ground.material=m;

    scene.executeWhenReady(()=>{
        whenReady();
    });
    let alpha=0;
    let int =setInterval(()=>{
        alpha+=0.01;
        if (alpha>=2*Math.PI)
            alpha=0;
        camera.alpha=alpha;
    },50)
    //Загрузили модель персонажа
    let sceneObject = await BABYLON.SceneLoader.ImportMeshAsync(null,'./models/','garage.glb',scene);
    let uiTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
    uiTexture.parseSerializedObject(ui);
    scene.debugLayer.show()
}

async function whenReady(){

}
