import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Item, AlertController } from 'ionic-angular';
import { ContactList, Contact, ContactProvider } from '../../providers/contact/contact';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  contacts: ContactList[];
  model: Contact;
  key: string;

  constructor(public navCtrl: NavController, private contactProvider: ContactProvider, public alerCtrl: AlertController, public navParams: NavParams, private toast: ToastController) {
  }

  ionViewDidEnter() {
    this.contactProvider.getAll()
      .then((result) => {
        this.contacts = result;

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
          }
        },
        {
          text: 'Sim',
          handler: () => {

            this.saveContact()
              .then(() => {
                if (this.model.embarque == true) {
                  this.toast.create({ message: 'Embarque atribuído para ' + this.model.name, duration: 3000, position: 'botton' }).present();
                  this.contacts = [];
                  this.ionViewDidEnter();
                } else {
                  this.toast.create({ message: 'Embarque removido para ' + this.model.name, duration: 3000, position: 'botton' }).present();
                }
                this.navCtrl.popToRoot();

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
    let alert = this.alerCtrl.create({
      title: item.contact.name + ' ' + item.contact.sobrenome,
      message: item.contact.presenca,
      buttons: ['Ok']
    });
    alert.present()
  }


  private saveContact() {
    debugger
    if (this.key) {
      this.model.embarque = !this.model.embarque;
      return this.contactProvider.update(this.key, this.model);
    } else {
      return this.contactProvider.insert(this.model);
    }
  }
}
