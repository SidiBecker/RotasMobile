import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Contact, ContactProvider } from '../../providers/contact/contact';
import { CadastrosPage } from '../cadastros/cadastros';

/**
 * Generated class for the EditPresencaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-presenca',
  templateUrl: 'edit-presenca.html',
})
export class EditPresencaPage { 
  model: Contact;
  key: string;
  presenca;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alerCtrl: AlertController, private toast: ToastController, private contactProvider: ContactProvider) {
    if (this.navParams.data.contact && this.navParams.data.key) {
  
      this.model = this.navParams.data.contact;
      this.key = this.navParams.data.key;
    } else {
      this.model = new Contact();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPresencaPage');
  }


  editar(item) {
    let alert = this.alerCtrl.create();
    alert.setTitle('Controle de Entradas');
    alert.addInput({
      type: 'radio',
      label: 'Só Ida',
      value: 'Só Ida'
    });

    alert.addInput({
      type: 'radio',
      label: 'Só Volta',
      value: 'Só Volta'
    });

    alert.addInput({
      type: 'radio',
      label: 'Ida e Volta',
      value: 'Ida e Volta'
      
    });

   
    alert.addButton('Cancelar');
    alert.addButton({
      text: 'Ok',
      handler: data => {
        console.log('Radio data:', data);
        this.model.presenca = data;
        this.save();
      }
    });

    alert.present();
  }

  save() {
    this.saveContact()
      .then(() => {
        this.toast.create({ message: 'Presença definida!.', duration: 3000, position: 'botton' }).present();

        this.navCtrl.setRoot(CadastrosPage);
        this.navCtrl.popToRoot();
        
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao definir a presença!.', duration: 3000, position: 'botton' }).present();
      });
  }  
  private saveContact() {
    if (this.key) {
      return this.contactProvider.update(this.key, this.model);
    } else {
      return this.contactProvider.insert(this.model);
    }
  }

}
