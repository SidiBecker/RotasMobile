import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { ContactList, Contact, ContactProvider } from '../../providers/contact/contact';
import { TurmaProvider, TurmaList } from '../../providers/turma/turma';
import { Storage } from '@ionic/storage';
import { ConfigProvider, ConfigList } from '../../providers/config/config';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  contacts: ContactList[];
  indefinidos: ContactList[];
  definidos: ContactList[];
  model: Contact;
  contatos: ContactList[];
  configs: ConfigList[];
  key: string;
  ativo: boolean;

  currentDate = new Date();
  weekdays = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
  dia = this.weekdays[this.currentDate.getDay()];
  listaTurmas: TurmaList[];
  turmaSelecionada: string;
  contatosDefinidos: ContactList[];
  contatosIndefinidos: ContactList[];

  constructor(public configProvider: ConfigProvider, public storage: Storage, public navCtrl: NavController, private contactProvider: ContactProvider, public alerCtrl: AlertController, private turmaProvider: TurmaProvider, public navParams: NavParams, private toast: ToastController) {
  }

  ionViewDidEnter() {

    this.storage.ready().then(() => {

      //this.contacts = [];
      /*  this.indefinidos = [];

      this.contatosDefinidos = [];
      this.contatosIndefinidos = []; */

      this.turmaProvider.getAll()
        .then((result) => {
          debugger
          this.listaTurmas = result.filter(x => (x.turma.tipo == "turma"));
        });
      this.storage.get("turmaSelecionada").then((val) => {
        this.turmaSelecionada = val;
        console.log(this.turmaSelecionada + "<== turma");
      });




      this.contactProvider.getAll()
        .then((result) => {

          this.contacts = result.filter(x => (x.contact.tipo == "aluno" && (x.contact.turma.indexOf(this.turmaSelecionada) > 1 || x.contact.turma.match(this.turmaSelecionada))));

          this.contacts = this.contacts.filter(x => (
            ((x.contact.diasSazonais.indexOf(this.dia.toString()) > -1) && !(x.contact.presenca.match("Não Irá"))) ||
            ((x.contact.presenca.match("Ida") || x.contact.presenca.match("Volta")) && (!(x.contact.presencaPadrao.match("Sazonalmente")) || x.contact.mudancaPresenca == true))));

          this.contacts.forEach(aluno => {
            if (aluno.contact.mudancaPresenca == false) {
              if (aluno.contact.presencaPadrao.match("Sazonalmente") && aluno.contact.diasSazonais.indexOf(this.dia.toString()) > -1) {
                aluno.contact.presenca = aluno.contact.presencaSazonal;
              } else if (aluno.contact.presencaPadrao.match("Sazonalmente") && !(aluno.contact.diasSazonais.indexOf(this.dia.toString()) > -1)) {
                aluno.contact.presenca = "Não Irá - Esse dia não está cadastrado para este aluno!";
              }
            }
          });
          this.indefinidos = this.contacts.filter(x => (x.contact.embarque == false));
          this.definidos = this.contacts.filter(x => (x.contact.embarque == true));

          this.contatosDefinidos = this.definidos;
          this.contatosIndefinidos = this.indefinidos;
        });

      this.configProvider.getAll()
        .then((result) => {
          debugger
          this.configs = result.filter(x => (x.config.tipo == "config" && x.config.name == "Página de Entradas"));
          this.configs.forEach(x => {
            this.ativo = x.config.ativo;
          });

        });

    });
  }



  save(item, contato) {
    debugger
    this.model = contato;
    this.key = item.key;

    let confirm = this.alerCtrl.create({
      title: 'ATENÇÃO',
      message: 'Deseja mesmo mudar o embarque do aluno ' + item.contact.name + '?',
      buttons: [
        {
          text: 'Não',
          handler: () => {

            this.ionViewDidEnter();
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.model.embarque = !this.model.embarque;
            this.saveContact();

            if (this.model.embarque == true) {

              let index = this.model.name.indexOf(' ');

              if (index > -1) {
                this.toast.create({ message: 'Embarque atribuído para ' + this.model.name.substring(0, index), duration: 3000, position: 'botton' }).present();
              } else {
                this.toast.create({ message: 'Embarque atribuído para ' + this.model.name, duration: 3000, position: 'botton' }).present();
              }


            } else {
              let index = this.model.name.indexOf(' ');

              if (index > -1) {
                this.toast.create({ message: 'Embarque removido para ' + this.model.name.substring(0, index), duration: 3000, position: 'botton' }).present();
              } else {
                this.toast.create({ message: 'Embarque removido para ' + this.model.name, duration: 3000, position: 'botton' }).present();
              }


            }
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
            this.ionViewDidEnter();
          }
        }
      ]
    });
    confirm.present()
  }


  mostrarPresenca(item) {

    if (item.contact.mudancaPresenca == false) {
      if (item.contact.presencaPadrao.match("Sazonalmente") && item.contact.diasSazonais.indexOf(this.dia.toString()) > -1) {
        item.contact.presenca = item.contact.presencaSazonal;
      }
    }

    let alert = this.alerCtrl.create({
      title: item.contact.name,
      message: 'Presença para este dia: ' + item.contact.presenca,
      buttons: ['Ok']
    });
    alert.present()
  }


  private saveContact() {
    debugger
    if (this.key) {
      return this.contactProvider.update(this.key, this.model);
    } else {
      return this.contactProvider.insert(this.model);
    }
  }

  filterItems(ev: any) {
    let val = ev.target.value;
    if (val && val.trim() !== '') {
      this.contatosDefinidos = this.definidos.filter(function (item) {
        return item.contact.name.toLowerCase().includes(val.toLowerCase());
      });
      this.contatosIndefinidos = this.indefinidos.filter(function (item) {
        return item.contact.name.toLowerCase().includes(val.toLowerCase());
      });

    } else {
      this.contatosDefinidos = this.definidos;
      this.contatosIndefinidos = this.indefinidos;
    }
  }
  mudarTurma() {
    debugger

    console.log('Turma selecionada: ' + this.turmaSelecionada);

    //this.turmaProvider.updateSelecionada(this.turmaSelecionada);
    this.storage.set('turmaSelecionada', this.turmaSelecionada)
    this.ionViewDidEnter();
  }
}
