import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { ContactProvider, Contact } from '../../providers/contact/contact';
import { CadastrosPage } from '../cadastros/cadastros';

@Component({
  selector: 'page-edit-contact',
  templateUrl: 'edit-contact.html',

})
export class EditContactPage {

  model: Contact;
  key: string;
  curso = ['ADMINISTRAÇÃO',
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

  currentDate = new Date();
  weekdays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  dia = this.weekdays[this.currentDate.getDay()];

  presencas = ['Só ida', 'Só Volta', 'Ida e Volta', 'Sazonalmente'];

  constructor(public navCtrl: NavController, public navParams: NavParams, public alerCtrl: AlertController, private contactProvider: ContactProvider, private toast: ToastController) {

    if (this.navParams.data.contact && this.navParams.data.key) {

      this.model = this.navParams.data.contact;
      this.key = this.navParams.data.key;
    } else {
      this.model = new Contact();
    }

  }

  escolherDias(item) {
    debugger
    if (!item.presencaPadrao.match("Sazonalmente")) {
      this.model.presencaSazonal = "";
      this.save();
    } else {

      if(this.key == null){
        this.model.diasSazonais = [];
        this.model.presenca = "";
      }


      let alert = this.alerCtrl.create();
      alert.setTitle('Escolher dias padrões');

      let segunda = false;
      let terca = false; 
      let quarta = false;
      let quinta = false;
      let sexta = false;

      if (this.model.diasSazonais.indexOf('Segunda') > -1) {
        segunda = true;
      }
      if (this.model.diasSazonais.indexOf('Terça') > -1) {
        terca = true;
      } if (this.model.diasSazonais.indexOf('Quarta') > -1) {
        quarta = true;
      } if (this.model.diasSazonais.indexOf('Quinta') > -1) {
        quinta = true;
      } if (this.model.diasSazonais.indexOf('Sexta') > -1) {
        sexta = true;
      }


      alert.addInput({
        type: 'checkbox',
        label: this.weekdays[1],
        value: this.weekdays[1],
        checked: segunda
      });

      alert.addInput({
        type: 'checkbox',
        label: this.weekdays[2],
        value: this.weekdays[2],
        checked: terca
      });
      alert.addInput({
        type: 'checkbox',
        label: this.weekdays[3],
        value: this.weekdays[3],
        checked: quarta
      });
      alert.addInput({
        type: 'checkbox',
        label: this.weekdays[4],
        value: this.weekdays[4],
        checked: quinta
      });
      alert.addInput({
        type: 'checkbox',
        label: this.weekdays[5],
        value: this.weekdays[5],
        checked: sexta
      });

      alert.addButton({
        text: 'Ok',
        handler: data => {
          console.log('Radio data:', data);
          this.model.diasSazonais = data;
          this.escolherEmbarques(item);
        }
      });
      alert.present();
    }
  }

  escolherEmbarques(item) {

    
    let ida = false;
    let volta = false;
    let idaVolta = false


    if (item.presenca.match("Só Ida")) {
      ida = true;
    } else if (item.presenca.match("Só Volta")) {
      volta = true;
    } else if (item.presenca.match("Ida e Volta")) {
      idaVolta = true;
    } 



    let alert = this.alerCtrl.create();
    alert.setTitle('Presença para os dias');

    alert.addInput({
      type: 'radio',
      label: 'Só Ida',
      value: 'Só Ida',
      checked: ida

    });
 
    alert.addInput({
      type: 'radio',
      label: 'Só Volta',
      value: 'Só Volta',
      checked: volta
    });

    alert.addInput({
      type: 'radio',
      label: 'Ida e Volta',
      value: 'Ida e Volta',
      checked: idaVolta
    });

    alert.addButton({
      text: 'Ok',
      handler: data => {
        console.log('Radio data:', data);
        this.model.presencaSazonal = data;
        this.save();
      }
    });
    alert.present();
  }



  save() {

    this.model.presenca = this.model.presencaPadrao;

    this.saveContact()
      .then(() => {
        this.toast.create({ message: 'Contato salvo.', duration: 3000, position: 'botton' }).present();
        this.navCtrl.setRoot(CadastrosPage);
        this.navCtrl.popToRoot


      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao salvar o contato.', duration: 3000, position: 'botton' }).present();
      });
  } 

  private saveContact() {
    if (this.key) {
      return this.contactProvider.update(this.key, this.model);
    } else {
      this.model.embarque = false;
      this.model.mudancaPresenca = false;
      this.model.visivel = true;
      return this.contactProvider.insert(this.model);
    }
  }

}