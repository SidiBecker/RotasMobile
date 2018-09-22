import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { ContactProvider, ContactList, Contact } from '../../providers/contact/contact';
import { EditContactPage } from '../edit-contact/edit-contact';
import { ListPage } from '../list/list';

@IonicPage()
@Component({
  selector: 'page-cadastros',
  templateUrl: 'cadastros.html',
})
export class CadastrosPage {
 contacts: ContactList[];
 contato: Contact;

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

  adicionarAluno(){
    console.log('ionViewDidLoad adicionarAluno');
    var nav = this.navCtrl;

    nav.push(EditContactPage);
  }

  editContact(item: ContactList) {
    var nav = this.navCtrl;
    
    nav.push(EditContactPage, { key: item.key, contact: item.contact });
  }

  removeContact(item: ContactList) {
    this.contactProvider.remove(item.key)
      .then(() => {
        // Removendo do array de items
        var index = this.contacts.indexOf(item);
        this.contacts.splice(index, 1);
        this.toast.create({ message: 'Contato removido.', duration: 3000, position: 'botton' }).present();
      })
  }

  doConfirm(item) {
    let confirm = this.alerCtrl.create({
      title: 'ATENÇÃO',
      message: 'Deseja mesmo excluir o aluno registro?',
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



}