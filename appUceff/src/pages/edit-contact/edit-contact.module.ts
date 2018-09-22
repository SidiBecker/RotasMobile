import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditContactPage } from './edit-contact';

@NgModule({
  declarations: [
    EditContactPage,
  ],
  imports: [
    IonicPageModule.forChild(EditContactPage),
  ],
})
export class EditContactPageModule {}
