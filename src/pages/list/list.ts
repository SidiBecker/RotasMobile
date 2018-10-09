import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Item, AlertController } from 'ionic-angular';
import { ContactList, Contact, ContactProvider } from '../../providers/contact/contact';
import { IfObservable } from '../../../node_modules/rxjs/observable/IfObservable';

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

  constructor(public navCtrl: NavController, private contactProvider: ContactProvider, public alerCtrl: AlertController, public navParams: NavParams, private toast: ToastController) {
  }

  ionViewDidEnter() {
    debugger
    this.contactProvider.getAll()
      .then((result) => {

        this.contacts = result.filter(x => (
          ((x.contact.diasSazonais.indexOf(this.dia.toString()) > -1) && !(x.contact.presenca.match("Não Irá"))) ||
          ((x.contact.presenca.match("Ida") || x.contact.presenca.match("Volta")) && (!(x.contact.presencaPadrao.match("Sazonalmente")) || x.contact.mudancaPresenca==true))));

      });
  }

  save(item, contato) {
    debugger
    this.model = contato;
    this.key = item.key;

    let confirm = this.alerCtrl.create({
      title: 'ATENÇÃO',
      message: 'Deseja mesmo mudar o embarque do aluno ' + item.contact.name + ' ' + item.contact.sobrenome + '?',
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
                  this.toast.create({ message: 'Embarque atribuído para ' + this.model.name, duration: 3000, position: 'botton' }).present();
                  this.contacts = [];
                  this.ionViewDidEnter();
                } else {
                  this.toast.create({ message: 'Embarque removido para ' + this.model.name, duration: 3000, position: 'botton' }).present();
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

    if (item.contact.presencaPadrao.match("Sazonalmente") && item.contact.diasSazonais.indexOf(this.dia.toString()) > -1) {
      item.contact.presenca = item.contact.presencaSazonal;
    }


    let alert = this.alerCtrl.create({
      title: item.contact.name + ' ' + item.contact.sobrenome,
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
}
