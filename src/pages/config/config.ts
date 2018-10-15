import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TurmasPage } from '../turmas/turmas';
import { Storage } from '@ionic/storage';
import { ConfigProvider, ConfigList, Config } from '../../providers/config/config';

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
  paginaCadastro: Config;
  configs: ConfigList[];

  constructor(public alerCtrl: AlertController, public configProvider: ConfigProvider, public storage: Storage, public navCtrl: NavController, public navParams: NavParams) {


  }
  ionViewDidEnter() {


    this.storage.get("cargaConfig").then((val) => {

      this.cargaConfig = val;

      if (this.cargaConfig == null) {
        this.storage.set("cargaConfig", false);
        this.ionViewDidEnter();
      }

      if (this.cargaConfig == false) {
        console.log("mudanca false");
        this.paginaCadastro = new Config();

        this.paginaCadastro.name = "Página de Cadastros";
        this.paginaCadastro.descricao = "Dica localizada na página dos alunos cadastrados.";

        this.chavesPadroes(this.paginaCadastro);

        this.configProvider.insert(this.paginaCadastro);

        this.storage.set("cargaConfig", true);
        this.ionViewDidEnter();
      }
    });

    this.configProvider.getAll()
      .then((result) => {
        debugger
        this.configs = result.filter(x => (x.config.tipo == "config"));
      });

  }

  ionViewDidLoad() {

  }



  acessar() {
    this.navCtrl.push(TurmasPage);
  }

  mudarConfig(item) {

    item.config.ativo = !item.config.ativo;

    return this.configProvider.update(item.key, item.config);
  }

  mostrarFuncao(item){
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
