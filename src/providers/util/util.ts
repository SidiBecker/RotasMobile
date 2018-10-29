
import { Injectable, ViewChild } from '@angular/core';
import { LoadingController, MenuController, AlertController, Platform, NavController, App } from 'ionic-angular';
import { EditContactPage } from '../../pages/edit-contact/edit-contact';
import { CadastroTurmasPage } from '../../pages/cadastro-turmas/cadastro-turmas';
import { EditPresencaPage } from '../../pages/edit-presenca/edit-presenca';
import { HomePage } from '../../pages/home/home';


/*
  Generated class for the UtilProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilProvider {
  public loading: any;
  @ViewChild('content') nav: NavController;

  constructor(public app: App, public loadingCtrl: LoadingController, public menuCtrl: MenuController, public alertCtrl: AlertController, public platform: Platform) {
    console.log('Hello UtilProvider Provider');
  }

  mostrarLoading() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: 'Carregando ...'
      });
      this.loading.present();
    }
  }
  esconderLoading() {
    if(this.loading){
      this.loading.dismiss();
      this.loading = null;
    }
  
  }

}
