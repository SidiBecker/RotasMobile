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
}



