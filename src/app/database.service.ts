import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public con = 0;
  public con2 = 0;
  public items: any = [];
  public albums: any = [];
  private url: string = 'https://jsonplaceholder.typicode.com/photos';
  private urlAlbum: string = 'https://jsonplaceholder.typicode.com/albums';
  storage: SQLiteObject;


  constructor(private sqlite: SQLite, public http: HttpClient, public loadingCtrl: LoadingController) {
  }



  async getData() {
    this.http.get(this.url).subscribe(res => {
      this.items = res;
    });
  }

  async getDataAlbum() {
    this.http.get(this.urlAlbum).subscribe(res => {
      this.albums = res;
    });
  }

  async crearDatabase() {
    this.albums = this.getDataAlbum();
    this.items = this.getData();
    await this.sqlite.create({
      name: "db.db",
      location: "default",
    }).then((db: SQLiteObject) => {
      this.storage = db;
    }).catch((e) => {
      alert("error on creating database " + JSON.stringify(e));
    });

    await this.crearTablas();
  }

  async crearTablas() {
    await this.storage.transaction(function (tx) {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS images (albumId INTEGER, id INTEGER PRIMARY KEY, title VARCHAR(255), url VARCHAR(255), thumbnailUrl VARCHAR(255))`,
        []
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS albums (userId INTEGER, id INTEGER PRIMARY KEY, title VARCHAR(255))`,
        []
      );
    }).catch(e => console.log(e));
  }

  async crearDatabasePrueba() {
    this.getData();
    await this.sqlite.create({
      name: "db",
      location: "default",
    }).then((db: SQLiteObject) => {
      this.storage = db;
    }).catch((e) => {
      alert("error on creating database " + JSON.stringify(e));
    });
  }

  async crearImagesSin() {
    await this.storage.transaction(function (tx) {
      console.time();
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS images (albumId INTEGER, id INTEGER PRIMARY KEY, title VARCHAR(255), url VARCHAR(255), thumbnailUrl VARCHAR(255))`,
        []
      );
      console.timeEnd();
    }).catch(e => console.log(e));
  }

  async crearImagesCon() {
    await this.storage.transaction(function (tx) {
      console.time();
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS images (albumId INTEGER, id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(255), url VARCHAR(255), thumbnailUrl VARCHAR(255))`,
        []
      );
      console.timeEnd();
    }).catch(e => console.log(e));
  }

  async aniadirDatosAlbum() {
    let datos = this.albums;
    console.log("Añadiendo albumes a la base de datos");
    const loading = await this.loadingCtrl.create({ message: 'Insertando datos', spinner: "circles" });
    loading.present();
    return await this.storage.transaction(function (tx) {
      console.time();
      for (var cont = 0; cont < 1; cont++) {
        for (var i = 0; i < datos.length; i++) {
          tx.executeSql(`INSERT INTO albums (userId, id, title) VALUES (?, ?, ?)`,
          [datos[i].userId, datos[i].id + (cont * datos.length), datos[i].title]);
        }
        loading.dismiss();
      }
      console.timeEnd();
    }).then()
      .catch(e => console.log(e));
  }

  async aniadirDatos() {
    let datos = this.items;
    const loading = await this.loadingCtrl.create({ message: 'Insertando datos', spinner: "circles" });
    loading.present();
    var t0 = performance.now();
    await this.storage.transaction(function (tx) {
      for (var cont = 0; cont < 50; cont++) {
        for (var i = 0; i < datos.length; i++) {
          tx.executeSql(`INSERT INTO images (albumId, id, title, url, thumbnailUrl) VALUES (?, ?, ?, ?, ?)`,
          [datos[i].albumId, datos[i].id + (cont * datos.length), datos[i].title, datos[i].url, datos[i].thumbnailUrl]);
        }
      }
      loading.dismiss();
      var t1 = performance.now();
      var time = t1 - t0;
      console.log("Tiempo total acumulado: " + time + " ms");
    }).then()
      .catch(e => console.log(e));
  }

  async aniadirDatosAmpliado(lim) {
    let datos = this.items;
    let timer = 0;
    const loading = await this.loadingCtrl.create({ message: 'Insertando stack ' + (lim+1) + ' de datos', spinner: "circles" });
    loading.present();
    var t0 = performance.now();
    await this.storage.transaction(function (tx) {
      for (var i = 0; i < datos.length; i++) {
        tx.executeSql(`INSERT INTO images (albumId, id, title, url, thumbnailUrl) VALUES (?, ?, ?, ?, ?)`,
        [datos[i].albumId, datos[i].id + (lim * datos.length), datos[i].title, datos[i].url, datos[i].thumbnailUrl]);
      }
      loading.dismiss();
      var t1 = performance.now();
      var time2 = t1 - t0;
      timer += time2;
    }).then().catch(e => console.log(e));
    this.con = timer;
  }

  async aniadirDatosBatch(lim) {
    let datos = this.items;
    let sql = [];
    let timer = 0;
    const loading = await this.loadingCtrl.create({ message: 'Insertando stack ' + (lim+1) + ' de datos', spinner: "circles" });
    loading.present();
    var t0 = performance.now();
     {
      datos.forEach(item => {
        sql.push(["INSERT INTO images (albumId, id, title, url, thumbnailUrl) VALUES (?, ?, ?, ?, ?)", 
        [item.albumId, item.id + (lim * datos.length), item.title, item.url, item.thumbnailUrl]]);
      });
    }
    await this.storage.sqlBatch(sql).then((res) => {
      loading.dismiss();
      var t1 = performance.now();
      var time = t1 - t0;
      timer+=time;    
    }).catch(e => console.log(e));
    this.con = timer;
  }

  async mostrarDatos() {
    const loading = await this.loadingCtrl.create({ message: 'Cargando datos', spinner: "circles" });
    loading.present();
    return this.storage.executeSql(`SELECT * FROM images`, []).then(res => {
      console.log(res);
      loading.dismiss();
      return res;
    }).catch(e => {
      return "error on getting photos " + JSON.stringify(e);
    });
  }

  async mostrarDatosAlbums() {
    const loading = await this.loadingCtrl.create({ message: 'Cargando albumes', spinner: "circles" });
    loading.present();
    return this.storage.executeSql(`SELECT * FROM albums`, []).then(res => {
      loading.dismiss();
      return res;
    }).catch(e => {
      return "error on getting albums " + JSON.stringify(e);
    })
  }

  async mostrarDatosPrueba() {
    return this.storage.executeSql(`SELECT * FROM images WHERE images.id > 249990`, []).then(res => {
      return res;
    }).catch(e => {
      return "error on getting albums " + JSON.stringify(e);
    })
  }

  async borrarImages() {
    await this.storage.transaction(function (tx) {
      tx.executeSql(
        `DROP TABLE images`,
        []
      );
      console.log("Tabla Images borrada");
    }).catch(e => console.log(e));
  }

  async borrarBD() {
    return this.storage.executeSql(`DELETE FROM images`, []).then(res => {
      console.log("Borrando fotos");
      return res;
    }).catch(e => {
      return "error on getting categories " + JSON.stringify(e);
    });
  }
  async borrarBD2() {
    return this.storage.executeSql(`DELETE FROM albums`, []).then(res => {
      console.log("Borrando albumes");
      return res;
    }).catch(e => {
      return "error on getting categories " + JSON.stringify(e);
    });
  }
}
