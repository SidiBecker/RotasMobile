import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { ContactProvider, Contact } from '../../providers/contact/contact';
import { CadastrosPage } from '../cadastros/cadastros';

@Component({
  selector: 'page-edit-contact',
  templateUrl: 'edit-contact.html',
})
export class EditContactPage {
  model: Contact;
  key: string;
  curso = [ 'ADMINISTRAÇÃO',
  'AGRONOMIA',
  'ARQUITETURA E URBANISMO',
  'CIÊNCIAS CONTÁBEIS PREMIUM',
  'DIREITO',
  'ENGENHARIA CIVIL',
  'ENGENHARIA DE PRODUÇÃO',
  'GESTÃO DA TECNOLOGIA DA INFORMAÇÃO',
  'MEDICINA VETERINÁRIA',
  'PEDAGOGIA',
  'TECNOLOGIA EM ALIMENTOS'];

  constructor(public navCtrl: NavController, public navParams: NavParams, private contactProvider: ContactProvider, private toast: ToastController) {
    if (this.navParams.data.contact && this.navParams.data.key) {
  
      this.model = this.navParams.data.contact;
      this.key = this.navParams.data.key;
    } else {
      this.model = new Contact();
    }
  }

  save() {
    this.saveContact()
      .then(() => {
        this.toast.create({ message: 'Contato salvo.', duration: 3000, position: 'botton' }).present();

        this.navCtrl.setRoot(CadastrosPage);
        this.navCtrl.popToRoot();
        
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao salvar o contato.', duration: 3000, position: 'botton' }).present();
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