import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, Navbar } from 'ionic-angular';
import { Contact, ContactProvider } from '../../providers/contact/contact';
import { UtilProvider } from '../../providers/util/util';


@IonicPage()
@Component({
  selector: 'page-edit-presenca',
  templateUrl: 'edit-presenca.html',
})
export class EditPresencaPage {

  @ViewChild(Navbar) navBar: Navbar;
  
  model: Contact;
  key: string;
  presenca;

  currentDate = new Date();
  weekdays = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
  dia = this.weekdays[this.currentDate.getDay()];

  constructor(private util: UtilProvider, public navCtrl: NavController, public navParams: NavParams, public alerCtrl: AlertController, private toast: ToastController, private contactProvider: ContactProvider) {
    if (this.navParams.data.contact && this.navParams.data.key) {

      this.model = this.navParams.data.contact;
      this.key = this.navParams.data.key;


      if (this.model.mudancaPresenca == false) {
        if (this.model.presencaPadrao.match("Sazonalmente") && this.model.diasSazonais.indexOf(this.dia.toString()) > -1) {
          this.model.presenca = this.model.presencaSazonal;
        } else if (this.model.presencaPadrao.match("Sazonalmente") && !(this.model.diasSazonais.indexOf(this.dia.toString()) > -1)) {
          this.model.presenca = "Não Irá - " + this.dia + " não está cadastrado para este aluno!";
        }
      }




    } else {
      this.model = new Contact();
    }
  }

  ionViewDidLoad() {

    this.navBar.backButtonClick = () => {
    this.navCtrl.pop();

      this.util.mostrarLoading();
    };

  }


  editar(item) {
    


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

        this.model.presenca = data;

        this.model.mudancaPresenca = true;

        this.save(this.model);
      }
    });

    alert.present();
  }

  save(item) {
    this.saveContact();
    this.util.mostrarLoading();

    let index = item.name.indexOf(' ');

    if (index > -1) {
      this.toast.create({ message: 'Presença para esta ' + this.dia + ' redefinida para ' + item.name.substring(0, index) + '!', duration: 3000, position: 'botton' }).present();
    } else {
      this.toast.create({ message: 'Presença para esta ' + this.dia + ' redefinida para ' + item.name + '!', duration: 3000, position: 'botton' }).present();

    }
    this.util.esconderLoading();

  }
  private saveContact() {
    if (this.key) {
      return this.contactProvider.update(this.key, this.model);
    } else {
      return this.contactProvider.insert(this.model);
    }
  }

}
