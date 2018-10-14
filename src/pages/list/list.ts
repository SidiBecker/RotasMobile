import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { ContactList, Contact, ContactProvider } from '../../providers/contact/contact';
import { TurmaProvider, TurmaList } from '../../providers/turma/turma';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  contacts: ContactList[];
  model: Contact;
  //result: ContactList[];
  key: string;


  currentDate = new Date();
  weekdays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  dia = this.weekdays[this.currentDate.getDay()];
  listaTurmas: TurmaList[];
  turmaSelecionada: string;

  constructor(public storage: Storage, public navCtrl: NavController, private contactProvider: ContactProvider, public alerCtrl: AlertController, private turmaProvider: TurmaProvider, public navParams: NavParams, private toast: ToastController) {
  }

  ionViewDidEnter() {
    debugger

    this.contacts = [];


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
            this.saveContact()
              .then(() => {
                if (this.model.embarque == true) {

                  let index = this.model.name.indexOf(' ');

                  if (index > -1) {
                    this.toast.create({ message: 'Embarque atribuído para ' + this.model.name.substring(0, index), duration: 3000, position: 'botton' }).present();
                  } else {
                    this.toast.create({ message: 'Embarque atribuído para ' + this.model.name, duration: 3000, position: 'botton' }).present();
                  }

                  this.contacts = [];

                  this.ionViewDidEnter();

                } else {
                  let index = this.model.name.indexOf(' ');
                  this.toast.create({ message: 'Embarque removido para ' + this.model.name.substring(0, index), duration: 3000, position: 'botton' }).present();
                }

              })
              .catch(() => {
                this.toast.create({ message: 'Erro ao salvar o contato.', duration: 3000, position: 'botton' }).present();
              });
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


  mudarTurma() {
    debugger

    console.log('Turma selecionada: ' + this.turmaSelecionada);

    //this.turmaProvider.updateSelecionada(this.turmaSelecionada);
    this.storage.set('turmaSelecionada', this.turmaSelecionada)
    this.navCtrl.setRoot(ListPage);
    this.navCtrl.popToRoot();
  }
}
