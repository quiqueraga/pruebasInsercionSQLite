import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Prueba1PageRoutingModule } from './pruebas-routing.module';

import { Prueba1Page } from './pruebas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Prueba1PageRoutingModule
  ],
  declarations: [Prueba1Page]
})
export class Prueba1PageModule {}
