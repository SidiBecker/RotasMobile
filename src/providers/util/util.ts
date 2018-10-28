
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

/*
  Generated class for the UtilProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilProvider {
  public loading: any;

  constructor(public loadingCtrl: LoadingController) {
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
    this.loading.dismiss();
    this.loading = null;
  }

}
