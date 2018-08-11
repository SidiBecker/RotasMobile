import { NgModule, Injectable } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormularioClientePage } from './formulario-cliente';


@NgModule({
  declarations: [
    FormularioClientePage,
  ],
  imports: [
    IonicPageModule.forChild(FormularioClientePage),
  ],
  exports:[
    FormularioClientePage
  ]
})
export class FormularioClientePageModule {}
