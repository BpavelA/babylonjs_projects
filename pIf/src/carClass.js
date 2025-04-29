//Абстрактный класс Car
class GermanCar {
  mesh; scene; position; size;
  
  constructor(mesh, position, size, scene,) {
    this.mesh = mesh;
    this.scene = scene;
    this.position = position;
    this.size = size;
    }
}
    
//Дочерний класс Bmw
class Bmw extends GermanCar {
  constructor(mesh, position, size, scene, model, price) {
    super(mesh, position, size, scene);
    this.model = model;
    this.price = price;
  }
  setInfo(model, price) {this.model = model, this.price = price}
} 

//Дочерний класс Vw
class Vw extends GermanCar {
  constructor(mesh, position, size, scene, year, body) {
    super(mesh, position, size, scene);
    this.year = 2010;
    this.body = body;
  }
  setBody(body) {this.body = body}
} 

//Дочерний класс Porsche
class Porsche extends GermanCar {
  constructor(mesh, position, size, scene, maxSpeed, color) {
    super(mesh, position, size, scene);
    this.maxSpeed = 300;
    this.color = 'yellow';
  }
  }

// Создание экземпляров, получение и изменение информации

let x5 = new Bmw();
x5.setInfo('x5', 10000)
console.log(x5);

let carrera = new Porsche();
console.log(carrera.color);

let polo = new Vw();
polo.setBody = 'hatchback';
console.log(polo);
