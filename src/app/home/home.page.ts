import { DatabaseService } from './../database.service';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public photos:any = [];
  public albums:any = [];

  constructor(private http:HttpClient, public db: DatabaseService, public loadingCtrl: LoadingController) {
  } 

  getData(){
    this.db.getDataAlbum();
  }

  crearDatabase(){
    return this.db.crearDatabase();
  }

  async mostrarImages(){
    await this.db.mostrarDatos().then((data) => {
      //console.log(data);
      this.photos = [];
      for (var i = 0; i < data.rows.length; i++) {
        this.photos.push(data.rows.item(i));
      }
      console.log(this.photos)
    });
  }

  async mostrarAlbumes(){
    await this.db.mostrarDatosAlbums().then((data) => {
      console.log(data);
      this.albums = [];
      for (var i = 0; i < data.rows.length; i++) {
        this.albums.push(data.rows.item(i));
      }
      console.log(this.albums)
    });
  }

  aniadirDatos(){
    //for(var i=0;i<10;i++){
      this.db.aniadirDatos();
    //}
  }

  aniadirDatosAlbum(){
    this.db.aniadirDatosAlbum();
  }

  aniadirDatosBatch(){
    for(var i=0;i<50;i++){
      this.db.aniadirDatosBatch(i);
    }
  }

  datosEnBD(){
    console.log(this.albums.length);
  }

  async borrarImagesBD(){
    await this.db.borrarBD();
    await this.mostrarImages();
  }

  async borrarAlbumBD(){
    await this.db.borrarBD2();
    await this.mostrarAlbumes();
  }

}
