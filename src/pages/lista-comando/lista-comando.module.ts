import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaComandoPage } from './lista-comando';

@NgModule({
  declarations: [
    ListaComandoPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaComandoPage),
  ],
  exports:[
    ListaComandoPage
  ]
})
export class ListaComandoPageModule {}
