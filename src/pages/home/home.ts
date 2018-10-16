import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, ToastController } from 'ionic-angular';
import { ContactList, Contact, ContactProvider } from '../../providers/contact/contact';
import { ListPage } from '../list/list';
import { TurmaProvider, TurmaList, Turma } from '../../providers/turma/turma';
import { Storage } from '@ionic/storage';
import { Config } from '../../providers/config/config';

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

  constructor(public storage: Storage, public navCtrl: NavController, private contactProvider: ContactProvider, public alerCtrl: AlertController, public navParams: NavParams, private toast: ToastController, private turmaProvider: TurmaProvider) {
    storage.get("quantidadeConfig").then((val) => {
      this.quantidadeConfig = val;
    });
  }

  ionViewDidEnter() {

    this.storage.ready().then(() => {
      this.storage.get("cargaConfig").then((val) => {

        this.cargaConfig = val;

        if (this.cargaConfig != true && !(this.quantidadeConfig > 0)) {
          this.cargaConfigs();

          this.storage.set("cargaConfig", true)
        }

      });
      this.contactProvider.getAll()
        .then((result) => {
          this.contacts = result;

        });

      this.turmaProvider.getAll()
        .then((result) => {
          debugger
          this.turmas = result.filter(x => (x.turma.tipo == "turma"));
        });

      this.storage.get("turmaSelecionada").then((val) => {
        this.turmaSelecionada = val;
        console.log(this.turmaSelecionada + "<== turma");
      });

    });
  }

  cargaConfigs() {

    this.config = new Config();
    this.config.name = "Página de Cadastros";
    this.config.descricao = "Dica localizada na página dos alunos cadastrados. <br> Menu/Alunos";
    this.chavesPadroes(this.config);
    this.salvarConfig(this.key, this.config);
    console.log("chave 1: " + this.key);

    this.config2 = new Config();
    this.config2.name = "Página de Entradas";
    this.config2.descricao = "Dica localizada na página de entradas/embarques dos alunos cadastrados para o dia atual. <br>Menu/Definir Entradas";
    this.chavesPadroes(this.config2);
    this.salvarConfig(this.key, this.config2);
    console.log("chave 2: " + this.key);


    this.ionViewDidEnter();
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
      message: 'Esse processo irá restaurar as presenças diárias para seu padrão e excluir todos os embarques!<br><br>' +
        'Aconselhável executar esse processo apenas no fim do dia.<br><br>' +
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
            this.toast.create({ message: 'Embarques removidos e presenças restauradas para todos os alunos!', duration: 4000, position: 'botton' }).present()

          }
        }
      ]
    });
    confirm.present()
  }

  definirEmbarques() {
    this.navCtrl.push(ListPage);
  }

  mudarTurma() {
    debugger


    this.storage.set('turmaSelecionada', this.turmaSelecionada)
    console.log('Turma selecionada: ' + this.turmaSelecionada);

  }


}/*  */