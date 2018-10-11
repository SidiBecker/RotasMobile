import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TurmasPage } from './turmas';

@NgModule({
  declarations: [
    TurmasPage,
  ],
  imports: [
    IonicPageModule.forChild(TurmasPage),
  ],
})
export class TurmasPageModule {}
