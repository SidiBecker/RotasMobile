import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, ToastController } from 'ionic-angular';
import { ContactList, Contact, ContactProvider } from '../../providers/contact/contact';
import { ListPage } from '../list/list';
import { TurmaProvider, TurmaList, Turma } from '../../providers/turma/turma';
import { Storage } from '@ionic/storage';
import { Config } from '../../providers/config/config';
import { TurmasPage } from '../turmas/turmas';
import { UtilProvider } from '../../providers/util/util';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  contacts: ContactList[];
  model: Contact;
  key: string;
  turmas: TurmaList[];
  turma: Turma;
  cargaConfig: boolean;
  quantidadeConfig: number;
  turmaSelecionada: string;
  config: Config;
  config2: Config;

  constructor(public util: UtilProvider, public storage: Storage, public navCtrl: NavController, private contactProvider: ContactProvider, public alerCtrl: AlertController, public navParams: NavParams, private toast: ToastController, private turmaProvider: TurmaProvider) {

  }

  ionViewDidEnter() {
    this.storage.ready().then(() => {

      this.storage.get("quantidadeConfig").then((val) => {
        this.quantidadeConfig = val;
      });

      this.storage.get("cargaConfig").then((val) => {

        this.cargaConfig = val;

        if (this.cargaConfig != true && !(this.quantidadeConfig > 0)) {
          this.storage.ready().then(() => {
            this.cargaConfigs();

            this.storage.set("cargaConfig", true);
          });
        }
      });

    });
  }

  cadastrarTurma() {

    const alert = this.alerCtrl.create({
      title: 'ATENÇÃO!',
      subTitle: '<br> Cadastre uma turma!<br><br> (Ex.: Matutina, Vespertina, Noturna...)<br><br> Ela é necessaria para o cadastro de alunos e utilização desse aplicativo! <br><br> Crie sempre turmas com <strong>nomes diferentes</strong>!',
      buttons: [
        {
          text: 'Cadastrar',
          handler: () => {
            this.navCtrl.push(TurmasPage);

          }
        }]
    });
    alert.present();

  }

  cargaConfigs() {

    this.config = new Config();
    this.config.name = "Página de Cadastros";
    this.config.descricao = "Dica localizada na página dos alunos cadastrados. <br><br> Menu/Alunos";
    this.chavesPadroes(this.config);
    this.salvarConfig(this.key, this.config);
    console.log("chave 1: " + this.key);

    this.config = new Config();
    this.config.name = "Página de Entradas";
    this.config.descricao = "Dica localizada na página de entradas/embarques dos alunos cadastrados para o dia atual. <br><br>Menu/Definir Entradas";
    this.chavesPadroes(this.config);
    this.salvarConfig(this.key, this.config);
    console.log("chave 2: " + this.key);

    this.cargaConfig = true;
    //this.ionViewDidEnter();
  }

  chavesPadroes(item) {
    this.key = ('Config cod.: ' + (this.quantidadeConfig + 1));
    item.ativo = true;
    item.tipo = "config";
  }

  salvarConfig(key: string, valor: Config) {

    this.storage.set(key, valor);
    this.storage.set("quantidadeConfig", this.quantidadeConfig + 1);
    this.quantidadeConfig += 1;
  }
  excluirEmbarques() {
    debugger

    let confirm = this.alerCtrl.create({
      title: 'ATENÇÃO',
      message: 'Esse processo irá restaurar as presenças diárias para seu padrão e excluir todas as entradas!<br><br>' +
        'Aconselhável executar esse processo apenas quando não houver mais alunos pendentes.<br><br>' +
        'Deseja executá-lo agora?',
      buttons: [
        {
          text: 'Não',
          handler: () => {
          }
        },
        {
          text: 'Sim',
          handler: () => {

            this.contactProvider.updateEmbarque();
            this.toast.create({ message: 'Entradas removidas e presenças restauradas para todos os alunos!', duration: 4000, position: 'botton' }).present()

          }
        }
      ]
    });
    confirm.present()
  }

  definirEmbarques() {

    this.navCtrl.push(ListPage);
    this.util.mostrarLoading();
  }

  mudarTurma() {
    debugger


    this.storage.set('turmaSelecionada', this.turmaSelecionada)
    console.log('Turma selecionada: ' + this.turmaSelecionada);

  }


}/*  */