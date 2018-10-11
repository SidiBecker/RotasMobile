import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadastroTurmasPage } from './cadastro-turmas';

@NgModule({
  declarations: [
    CadastroTurmasPage,
  ],
  imports: [
    IonicPageModule.forChild(CadastroTurmasPage),
  ],
})
export class CadastroTurmasPageModule {}
