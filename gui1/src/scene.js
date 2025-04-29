import { makeSyncFunction } from 'babylonjs';
import {guiPrompt, guiAlert} from './talking.js'

let coloredMeshes, jacketMesh, pantsMesh, headBone;
let rightBicep, leftBicep,rightForeArm,leftForeArm;

let headScale=1,strength=1,strength2=1;

export async function initScene (scene) {
    scene.clearColor = new BABYLON.Color3(0.8, 0.85, 0.95);
    let camera = new BABYLON.ArcRotateCamera("camera1",-Math.PI/2,Math.PI/2,15,new BABYLON.Vector3(0,8,0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    const ground = new BABYLON.MeshBuilder.CreateGround('ground',{width:10,height:10},scene);
    const m=new BABYLON.GridMaterial('grid',scene);
    m.mainColor = new BABYLON.Color3(0.5,0.5,0.5);
    ground.material=m;

    scene.executeWhenReady(()=>{
        whenReady();
    });

    //Загрузили модель персонажа
    let dudeObject = await BABYLON.SceneLoader.ImportMeshAsync(null,'./models/','dude.babylon',scene);
    let skeletons = dudeObject.skeletons;
    let dude = dudeObject.meshes[0];
    dude.scaling = new BABYLON.Vector3(0.08,0.08,0.08)
    //Запустили анимацию
    scene.beginAnimation(skeletons[0], 0, 100, true, 1.0);

    //Выбрали объекты, которые нужно окрашивать(жилет и ноги)
    //let meshes = dude.getChildMeshes(false,(n)=>{return  n.name==' / 2' || n.name==' / 1'})
    jacketMesh =dude.getChildMeshes(false,(n)=>{return n.name==' / 1'})[0]
    pantsMesh =dude.getChildMeshes(false,(n)=>{return n.name==' / 2'})[0]
    
        headBone = skeletons[0].bones[7];
	
    //Кости плечей и предплечий
    rightBicep = skeletons[0].bones[13];
	leftBicep = skeletons[0].bones[32];
    rightForeArm = skeletons[0].bones[14];
	leftForeArm = skeletons[0].bones[33];
  
    //Функция при рассчете каждого кадра, 
    //Которая устанавливает размеры рук и головы
    scene.registerBeforeRender(function () {
        headBone.scale(headScale, headScale, headScale, true);
        rightBicep.scale(1, strength, true);
        leftBicep.scale(1, strength, true);
        rightForeArm.scale(1, strength2,strength2, true);
        leftForeArm.scale(1, strength2,strength2, true);
    });
    scene.debugLayer.show()
    makeUI(); 
}

async function whenReady(){

}

function makeUI() {
    let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
    let rect = new BABYLON.GUI.Rectangle();
    rect.name = 'rect';
    rect.width = '250px';
    rect.height = 1;
    // rect.background = '#f0f0f0a0';
    rect.background = new BABYLON.Color4(0.0, 0.5, 0.4, 0.5).toHexString();
    rect.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    rect.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(rect);

    let stackPanel = new BABYLON.GUI.StackPanel();
    stackPanel.name = 'stackpanel';
    stackPanel.width = '220px';
    stackPanel.fontSize = '14px';
    rect.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    rect.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    rect.addControl(stackPanel);

    let nameLabel = new BABYLON.GUI.TextBlock();
    nameLabel.text = 'Имя игрока';
    nameLabel.name = "label";
    nameLabel.height = '40px';
    nameLabel.color = 'Black';
    nameLabel.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    stackPanel.addControl(nameLabel);

    let nameInput = new BABYLON.GUI.InputText();
    nameInput.name = "nameInput";
    nameInput.width = 1;
    nameInput.height = '30px';
    nameInput.color = 'black';
    nameInput.fontSize = '14px';
    nameInput.background = '#f0f0ff';
    nameInput.focusedBackground = 'white';
    stackPanel.addControl(nameInput);
    
    let iQlabel = new BABYLON.GUI.TextBlock();
    iQlabel.text = 'Интеллект';
    iQlabel.name = "iQlabel";
    iQlabel.height = '40px';
    iQlabel.color = 'Black';
    iQlabel.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    stackPanel.addControl(iQlabel);

    let iqSlider = new BABYLON.GUI.Slider();
    iqSlider.minimum = 0.5;
    iqSlider.maximum = 2;
    iqSlider.value = headScale;
    iqSlider.color = 'green';
    iqSlider.name = 'iqSlider';
    iqSlider.width = '200px';
    iqSlider.height = '20px';
    stackPanel.addControl(iqSlider);

    iqSlider.onValueChangedObservable.add(function (value) { headScale = value; })

 let bicepsLabel = new BABYLON.GUI.TextBlock();
    bicepsLabel.text = 'Бицепсы';
    bicepsLabel.name = "bicepsLabel";
    bicepsLabel.height = '40px';
    bicepsLabel.color = 'Black';
    bicepsLabel.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    stackPanel.addControl(bicepsLabel);

    let bicepsSlider = new BABYLON.GUI.Slider();
    bicepsSlider.minimum = 0.5;
    bicepsSlider.maximum = 2;
    bicepsSlider.value = strength;
    bicepsSlider.color = 'green';
    bicepsSlider.name = 'bicepsSlider';
    bicepsSlider.width = '200px';
    bicepsSlider.height = '20px';
    stackPanel.addControl(bicepsSlider);

    bicepsSlider.onValueChangedObservable.add(function (value) { strength = value; })


    let forearmLabel = new BABYLON.GUI.TextBlock();
    forearmLabel.text = 'Предплечья';
    forearmLabel.name = "forearmLabel";
    forearmLabel.height = '40px';
    forearmLabel.color = 'Black';
    forearmLabel.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    stackPanel.addControl(forearmLabel);

    let forearmSlider = new BABYLON.GUI.Slider();
    forearmSlider.minimum = 0.5;
    forearmSlider.maximum = 2;
    forearmSlider.value = strength2;
    forearmSlider.color = 'green';
    forearmSlider.name = 'bicepsSlider';
    forearmSlider.width = '200px';
    forearmSlider.height = '20px';
    stackPanel.addControl(forearmSlider);
    forearmSlider.onValueChangedObservable.add(function (value) { strength2 = value; })

    let jacketLabel = new BABYLON.GUI.TextBlock();
    jacketLabel.text = 'Цвет куртки';
    jacketLabel.name = "jacketLabel";
    jacketLabel.height = '40px';
    jacketLabel.color = 'Black';
    jacketLabel.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    stackPanel.addControl(jacketLabel);

    let jacketColPicker = new BABYLON.GUI.ColorPicker();
    jacketColPicker.name = 'jacketColPicker';
    jacketColPicker.width = '150px';
    jacketColPicker.height = '150px';
    jacketColPicker.value = new BABYLON.Color3(0,0,0);
    stackPanel.addControl(jacketColPicker);
    jacketColPicker.onValueChangedObservable.add(function (value) {
        let mat = new BABYLON.StandardMaterial();
        mat.diffuseColor = value;
        jacketMesh.material = mat;
    })

    let pantsLabel = new BABYLON.GUI.TextBlock();
    pantsLabel.text = 'Цвет штанов';
    pantsLabel.name = "jacketLabel";
    pantsLabel.height = '40px';
    pantsLabel.color = 'Black';
    pantsLabel.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    stackPanel.addControl(pantsLabel);

    let pantsColPicker = new BABYLON.GUI.ColorPicker();
    pantsColPicker.name = 'jacketColPicker';
    pantsColPicker.width = '150px';
    pantsColPicker.height = '150px';
    pantsColPicker.value = new BABYLON.Color3(0,0,0);
    stackPanel.addControl(pantsColPicker);
    pantsColPicker.onValueChangedObservable.add(function (value) {
        let mat = new BABYLON.StandardMaterial();
        mat.diffuseColor = value;
        pantsMesh.material = mat;
    })

}
 
