import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { TurmasPage } from '../turmas/turmas';
import { Storage } from '@ionic/storage';
import { ConfigProvider, ConfigList, Config } from '../../providers/config/config';
import { UtilProvider } from '../../providers/util/util';

/**
 * Generated class for the ConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {

  cargaConfig: boolean;
  configs: ConfigList[];
  config: Config;
  config2: Config;
  quantidadeConfig: number;
  key: string;

  constructor(public util: UtilProvider, public loadingCtrl: LoadingController,public alerCtrl: AlertController, public configProvider: ConfigProvider, public storage: Storage, public navCtrl: NavController, public navParams: NavParams) {

    storage.get("quantidadeConfig").then((val) => {
      this.quantidadeConfig = val;
    });

  }
  ionViewDidEnter() {

    this.storage.ready().then(() => {
     
        this.carregarConfigs();


    });
    this.util.esconderLoading();
  }

  /*   ionViewDidLoad() {
       this.esconderLoading();
    } */
  
  carregarConfigs() {

    this.configProvider.getAll()
      .then((result) => {
        debugger
        this.configs = result.filter(x => (x.config.tipo == "config"));
      });
  }

  acessar() {
    this.navCtrl.push(TurmasPage);
  }

  mudarConfig(item) {

    item.config.ativo = !item.config.ativo;

    return this.configProvider.update(item.key, item.config);
  }

  mostrarFuncao(item) {
    let alert = this.alerCtrl.create({

      title: item.config.name,
      message: item.config.descricao,
      buttons: ['Ok']
    });
    alert.present()
  }

  chavesPadroes(item) {
    this.key = ('Config cod.: ' + (this.quantidadeConfig + 1));
    item.ativo = true;
    item.tipo = "config";
  }
}
