import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Prueba1Page } from './pruebas.page';

const routes: Routes = [
  {
    path: '',
    component: Prueba1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Prueba1PageRoutingModule {}
