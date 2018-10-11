import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { ContactProvider, ContactList, Contact } from '../../providers/contact/contact';
import { EditContactPage } from '../edit-contact/edit-contact';
import { EditPresencaPage } from '../edit-presenca/edit-presenca';
import { HomePage } from '../home/home';
import { TurmaProvider, TurmaList, Turma } from '../../providers/turma/turma';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-cadastros',
  templateUrl: 'cadastros.html',
})
export class CadastrosPage {
  contacts: ContactList[];
  contato: Contact;

  listaTurmas: TurmaList[];
  turmaSelecionada: string;

  currentDate = new Date();
  weekdays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  dia = this.weekdays[this.currentDate.getDay()];

  constructor(public storage: Storage, public navCtrl: NavController, private contactProvider: ContactProvider, public navParams: NavParams, private toast: ToastController, public alerCtrl: AlertController, private turmaProvider: TurmaProvider) {
  }



  ionViewDidEnter() {

    this.turmaProvider.getAll()
      .then((result) => {
        debugger
        this.listaTurmas = result.filter(x => (x.turma.tipo == "turma"));
      });
    this.storage.get("turmaSelecionada").then((val) => {
      this.turmaSelecionada = val;
      console.log(this.turmaSelecionada + "<== turma");
    });

    debugger
    this.contactProvider.getAll()
      .then((result) => {
        this.contacts = result.filter(x => (x.contact.tipo == "aluno" && (x.contact.turma.indexOf(this.turmaSelecionada) > 1 || x.contact.turma.match(this.turmaSelecionada))));
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
        this.toast.create({ message: 'Aluno ' + item.contact.name + ' removido.', duration: 1500, position: 'botton' }).present();
      })
  }

  doConfirm(item) {
    let confirm = this.alerCtrl.create({
      title: 'ATENÇÃO',
      message: 'Deseja mesmo remover o aluno ' + item.contact.name + '?',
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
      if (item.contact.presencaPadrao.match("Sazonalmente") && item.contact.diasSazonais.indexOf(this.dia.toString()) > -1) {
        item.contact.presenca = item.contact.presencaSazonal;
      } else if (item.contact.presencaPadrao.match("Sazonalmente") && !(item.contact.diasSazonais.indexOf(this.dia.toString()) > -1)) {
        item.contact.presenca = "Não Irá - Esse dia não está cadastrado para este aluno!";
      }
    }

    debugger
    if ((item.contact.presenca.match("Sazonalmente") && item.contact.diasSazonais.indexOf(this.dia.toString()) == -1)) {
      let alert = this.alerCtrl.create({

        title: item.contact.name,
        message: 'O aluno não tem presença para este dia!',
        buttons: ['Ok']
      });
      alert.present()
    } else {
      let alert = this.alerCtrl.create({

        title: item.contact.name,
        message: 'Presença para esta ' + this.dia + ': <br><br>' + item.contact.presenca,
        buttons: ['Ok']
      });
      alert.present()
    }

  }

  home() {
    this.navCtrl.setRoot(HomePage);
    this.navCtrl.popToRoot();
  }

  mudarTurma() {
    debugger

    console.log('Turma selecionada: ' + this.turmaSelecionada);

    this.storage.set('turmaSelecionada', this.turmaSelecionada)
    this.navCtrl.setRoot(CadastrosPage);
    this.navCtrl.popToRoot();
  }


}