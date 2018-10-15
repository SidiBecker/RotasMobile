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
  quantidadeConfig: number;
  key: string;

  constructor(public alerCtrl: AlertController, public configProvider: ConfigProvider, public storage: Storage, public navCtrl: NavController, public navParams: NavParams) {

    storage.get("quantidadeConfig").then((val) => {
      this.quantidadeConfig = val;
    });

  }
  ionViewDidEnter() {

    this.storage.get("cargaConfig").then((val) => {

      this.cargaConfig = val;

      if (this.cargaConfig != true && !(this.quantidadeConfig > 0)) {
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

    this.config = new Config();
    this.config.name = "Página de Cadastros";
    this.config.descricao = "Dica localizada na página dos alunos cadastrados. <br> Menu/Alunos";
    this.chavesPadroes(this.config);
    this.save(this.key, this.config);
    console.log("chave 1: " + this.key);

    this.config2 = new Config();
    this.config2.name = "Página de Entradas";
    this.config2.descricao = "Dica localizada na página de entradas/embarques dos alunos cadastrados para o dia atual. <br>Menu/Definir Entradas";
    this.chavesPadroes(this.config2);
    this.save(this.key, this.config2);
    console.log("chave 2: " + this.key);


    this.ionViewDidEnter();
  }


  save(key: string, valor: Config) {

    this.storage.set(key, valor);
    this.storage.set("quantidadeConfig", this.quantidadeConfig + 1);
    this.quantidadeConfig += 1;
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
    this.key = ('Config cod.: ' + (this.quantidadeConfig + 1));
    item.ativo = true;
    item.tipo = "config";
  }
}
