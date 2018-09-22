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

    this.initializeItems();
  }

  ionViewDidEnter() {
    this.contactProvider.getAll()
      .then((result) => {
        this.contacts = result;
      });
    }


  initializeItems() {
    this.items = [
      'Pokémon Yellow',
      'Super Metroid',
      'Mega Man X',
      'The Legend of Zelda',
      'Pac-Man',
      'Super Mario World',
      'Street Fighter II',
      'Half Life',
      'Final Fantasy VII',
      'Star Fox',
      'Tetris',
      'Donkey Kong III',
      'GoldenEye 007',
      'Doom',
      'Fallout',
      'GTA',
      'Halo'
    ];
  }
  getItems(ev) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }




  ionViewDidLoad() {
    console.log('ionViewDidLoad CadastrosPage');
  }

}
