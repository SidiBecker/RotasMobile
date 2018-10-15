import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TurmasPage } from '../turmas/turmas';
import { Storage } from '@ionic/storage';
import { ConfigProvider, ConfigList, Config } from '../../providers/config/config';
import { disableDebugTools } from '../../../node_modules/@angular/platform-browser';

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


  constructor(public alerCtrl: AlertController, public configProvider: ConfigProvider, public storage: Storage, public navCtrl: NavController, public navParams: NavParams) {

  }
  ionViewDidEnter() {

    this.storage.get("cargaConfig").then((val) => {

      this.cargaConfig = val;

      if (!(this.cargaConfig)) {
        this.cargaConfigs();

        this.storage.set("cargaConfig", true)

      }
      this.carregarConfigs();
    });

  }

  ionViewDidLoad() {
    this.carregarConfigs();
  }
  cargaConfigs() {


    for (let index = 1; index <= 3; index++) {
      debugger
      this.config = new Config();
      if (index == 1) {
        this.config.name = "Página de Cadastros";
        this.config.descricao = "Dica localizada na página dos alunos cadastrados. <br> Menu/Alunos";
        this.chavesPadroes(this.config);
        this.configProvider.insert(this.config);
      } else if (index == 2) {

        this.config.name = "Página de Entradas";
        this.config.descricao = "Dica localizada na página de entradas/embarques dos alunos cadastrados para o dia atual. <br>Menu/Definir Entradas";
        this.chavesPadroes(this.config);
        this.configProvider.insert(this.config);
      }

    }

  }




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
    item.ativo = true;
    item.tipo = "config";
  }
}
