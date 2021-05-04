import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from './../database.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-images',
  templateUrl: './images.page.html',
  styleUrls: ['./images.page.scss'],
})
export class ImagesPage implements OnInit {

  public photos:any = [];

  constructor(public db: DatabaseService, public http: HttpClient, public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  getData(){
    this.db.getData();
  }

  mostrarDatabase(){
    this.db.mostrarDatos().then((data) => {
      console.log(data);
      this.photos = []
      for (var i = 0; i < data.rows.length; i++) {
        this.photos.push(data.rows.item(i));
      }
      console.log(this.photos.length);
    });
  }

  aniadirDatos(){
      this.db.aniadirDatos();
  }

  borrarBD(){
    this.db.borrarBD();
    return this.mostrarDatabase();
  }

}
