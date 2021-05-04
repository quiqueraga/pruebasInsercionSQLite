import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-prueba1',
  templateUrl: './pruebas.page.html',
  styleUrls: ['./pruebas.page.scss'],
})
export class Prueba1Page implements OnInit {

  public photos:any = [];

  constructor(public db: DatabaseService, public loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  crearDatabase(){
    this.db.crearDatabasePrueba();
  }

  probarCon(){
    this.db.crearImagesCon();
    console.log('Tabla creada con autoincrement');
  }

  probarSin(){
    this.db.crearImagesSin();
    console.log('Tabla creada sin autoincrement');
  }

  async aniadirDatos(){
    await this.db.aniadirDatos();
    console.log("Datos insertados con transacciones");
    //await this.mostrarDatos();
  }
  

  async aniadirDatosTransaccionAmpl(){
    let c = 0;
    for(var i=0;i<50;i++){
      await this.db.aniadirDatosAmpliado(i);
      c += this.db.con;
    }
    console.log("Datos insertados con transacciones 2");
    console.log("Tiempo total acumulado: " + c + " ms");
    this.db.con = 0;
  }

  async aniadirDatosBatch(){
    let c = 0;
    for (var cont = 0; cont < 30; cont++){
      await this.db.aniadirDatosBatch(cont);
      c += this.db.con;
    }
    console.log("Datos insertados con batch");
    console.log("Tiempo total acumulado: " + c + " ms");
    this.db.con = 0;
  }

  async mostrarDatos(){
    await this.db.mostrarDatosPrueba().then((data) => {
      this.photos = [];
      for (var i = 0; i < data.rows.length; i++) {
        this.photos.push(data.rows.item(i));
      }
    });
  }

  borrarTabla(){
    this.db.borrarImages();
    this.photos = [];
  }

}
