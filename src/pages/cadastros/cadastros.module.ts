import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadastrosPage } from './cadastros';

@NgModule({
  declarations: [
    CadastrosPage,
  ],
  imports: [
    IonicPageModule.forChild(CadastrosPage),
  ],
})
export class CadastrosPageModule {}
