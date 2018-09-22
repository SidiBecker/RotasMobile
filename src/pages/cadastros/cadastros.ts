import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContactProvider, ContactList } from '../../providers/contact/contact';

/**
 * Generated class for the CadastrosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cadastros',
  templateUrl: 'cadastros.html',
})
export class CadastrosPage {
 items;
 contacts: ContactList[];
  constructor(public navCtrl: NavController, private contactProvider: ContactProvider, public navParams: NavParams) {
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

}
