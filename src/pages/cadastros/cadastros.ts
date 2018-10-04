import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { ContactProvider, ContactList, Contact } from '../../providers/contact/contact';
import { EditContactPage } from '../edit-contact/edit-contact';
import { EditPresencaPage } from '../edit-presenca/edit-presenca';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-cadastros',
  templateUrl: 'cadastros.html',
})
export class CadastrosPage {
  contacts: ContactList[];
  contato: Contact;


  currentDate = new Date();
  weekdays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  dia = this.weekdays[this.currentDate.getDay()];


  result;
  constructor(public navCtrl: NavController, private contactProvider: ContactProvider, public navParams: NavParams, private toast: ToastController, public alerCtrl: AlertController) {
  }



  ionViewDidEnter() {
    this.contactProvider.getAll()
      .then((result) => {
        this.contacts = result;

      });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CadastrosPage');
  }

  adicionarAluno() {
    var nav = this.navCtrl;

    nav.push(EditContactPage);
  }

  editContact(item: ContactList) {
    var nav = this.navCtrl;

    nav.push(EditContactPage, { key: item.key, contact: item.contact });
  }

  editPresenca(item) {
    console.log('EditPresenca');
    var nav = this.navCtrl;

    nav.push(EditPresencaPage, { key: item.key, contact: item.contact });
  }

  removeContact(item: ContactList) {
    this.contactProvider.remove(item.key)
      .then(() => {
        // Removendo do array de items
        var index = this.contacts.indexOf(item);
        this.contacts.splice(index, 1);
        this.toast.create({ message: 'Aluno ' + item.contact.name + ' ' + item.contact.sobrenome + ' removido.', duration: 3000, position: 'botton' }).present();
      })
  }

  doConfirm(item) {
    let confirm = this.alerCtrl.create({
      title: 'ATENÇÃO',
      message: 'Deseja mesmo remover o aluno ' + item.contact.name + ' ' + item.contact.sobrenome + '?',
      buttons: [
        {
          text: 'Não',
          handler: () => {
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.removeContact(item);
          }
        }
      ]
    });
    confirm.present()
  }


  mostrarPresenca(item) {
debugger
    if (item.contact.mudancaPresenca == false) {
      item.contact.presenca = item.contact.presencaPadrao;
      if(item.contact.presencaPadrao.match("Sazonalmente")){
        item.contact.presenca = item.contact.presencaSazonal;
      }
    }
    if ((item.contact.presenca.match("Sazonalmente") && item.contact.diasSazonais.indexOf(this.dia.toString()) == -1)) {
      let alert = this.alerCtrl.create({

        title: item.contact.name + ' ' + item.contact.sobrenome,
        message: 'O aluno não tem presença para este dia!',
        buttons: ['Ok']
      });
      alert.present()
    } else {
      let alert = this.alerCtrl.create({

        title: item.contact.name + ' ' + item.contact.sobrenome,
        message: 'Presença para este dia: ' + item.contact.presenca,
        buttons: ['Ok']
      });
      alert.present()
    }
    
  }

  home() {
    this.navCtrl.setRoot(HomePage);
    this.navCtrl.popToRoot();
  }

}