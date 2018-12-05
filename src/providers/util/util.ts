
import { Injectable, ViewChild } from '@angular/core';
import { LoadingController, MenuController, AlertController, Platform, NavController, App } from 'ionic-angular';

@Injectable()
export class UtilProvider {
  public loading: any;
  @ViewChild('content') nav: NavController;

  constructor(public app: App, public loadingCtrl: LoadingController, public menuCtrl: MenuController, public alertCtrl: AlertController, public platform: Platform) {

  }

  mostrarLoading() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: 'Carregando ...',
        cssClass: 'loading'
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
