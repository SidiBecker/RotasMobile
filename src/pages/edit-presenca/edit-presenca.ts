import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Contact, ContactProvider } from '../../providers/contact/contact';
import { CadastrosPage } from '../cadastros/cadastros';

@IonicPage()
@Component({
  selector: 'page-edit-presenca',
  templateUrl: 'edit-presenca.html',
})
export class EditPresencaPage {
  model: Contact;
  key: string;
  presenca;

  currentDate = new Date();
  weekdays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  dia = this.weekdays[this.currentDate.getDay()];

  constructor(public navCtrl: NavController, public navParams: NavParams, public alerCtrl: AlertController, private toast: ToastController, private contactProvider: ContactProvider) {
    if (this.navParams.data.contact && this.navParams.data.key) {

      this.model = this.navParams.data.contact;
      this.key = this.navParams.data.key;
      if (this.model.mudancaPresenca != true) {
        if (this.model.presencaPadrao.match("Sazonalmente") && !(this.model.diasSazonais.indexOf(this.dia.toString()) > -1)) {
          this.model.presenca = "Não Irá";

        } else if (this.model.presencaPadrao.match("Sazonalmente") && this.model.diasSazonais.indexOf(this.dia.toString()) > -1) {

          if (this.model.presenca != this.model.presencaSazonal) {
            this.model.presenca = this.model.presencaSazonal;
          }
        }
      } else {
        if (this.model.presencaPadrao.match("Sazonalmente") && !(this.model.diasSazonais.indexOf(this.dia.toString()) > -1)) {
          this.model.presenca = "Não Irá";
        }
      }




    } else {
      this.model = new Contact();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPresencaPage');

  }


  editar(item) {
    debugger


    let ida = false;
    let volta = false;
    let idaVolta = false;
    let naoIra = false;

    let alert = this.alerCtrl.create();
    alert.setTitle('Controle de Entradas');


    if (item.presenca.match("Só Ida")) {
      ida = true;
    } else if (item.presenca.match("Só Volta")) {
      volta = true;
    } else if (item.presenca.match("Ida e Volta")) {
      idaVolta = true;
    } else if (item.presenca.match("Não Irá")) {
      naoIra = true;
    }

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

    if (!this.model.presenca.match("Sazonalmente")) {
      alert.addInput({
        type: 'radio',
        label: 'Não Irá',
        value: 'Não Irá',
        checked: naoIra
      });
    }


    alert.addButton('Cancelar');
    alert.addButton({
      text: 'Ok',
      handler: data => {
        console.log('Radio data:', data);

        this.model.presenca = data;

        this.model.mudancaPresenca = true;

        this.save();
      }
    });

    alert.present();
  }

  save() {
    this.saveContact()
      .then(() => {
        this.toast.create({ message: 'Presença para o atual dia definida!', duration: 3000, position: 'botton' }).present();


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
