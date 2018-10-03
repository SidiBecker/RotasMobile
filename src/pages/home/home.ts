import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, ToastController } from 'ionic-angular';
import { ContactList, Contact, ContactProvider } from '../../providers/contact/contact';
import { ListPage } from '../list/list';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  contacts: ContactList[];
  model: Contact;
  key: string;

  currentDate = new Date();
  weekdays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  dia = this.weekdays[this.currentDate.getDay()];


  constructor(public navCtrl: NavController, private contactProvider: ContactProvider, public alerCtrl: AlertController, public navParams: NavParams, private toast: ToastController) {
  }

  ionViewDidEnter() {
    this.contactProvider.getAll()
      .then((result) => {
        this.contacts = result;

      });


  }

  excluirEmbarques() {
    debugger

    let confirm = this.alerCtrl.create({
      title: 'ATENÇÃO',
      message: 'Deseja mesmo mudar o embarque dos alunos?',
      buttons: [
        {
          text: 'Não',
          handler: () => {
          }
        }, 
        {
          text: 'Sim',
          handler: () => {

            this.contactProvider.updateEmbarque().then(()=> {
              this.toast.create({ message: 'Embarques removidos para todos os alunos' }).present();

            })
          }
        }
      ]
    });
    confirm.present()
  }

  definirEmbarques(){
    this.navCtrl.push(ListPage); 
  }
}



