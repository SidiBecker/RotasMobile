import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { ContactProvider, ContactList, Contact } from '../../providers/contact/contact';
import { EditContactPage } from '../edit-contact/edit-contact';
import { EditPresencaPage } from '../edit-presenca/edit-presenca';
import { HomePage } from '../home/home';
import { TurmaProvider, TurmaList } from '../../providers/turma/turma';
import { Storage } from '@ionic/storage';
import { ConfigProvider, ConfigList } from '../../providers/config/config';
import { TurmasPage } from '../turmas/turmas';

@IonicPage()
@Component({
  selector: 'page-cadastros',
  templateUrl: 'cadastros.html',
})
export class CadastrosPage {
  contacts: ContactList[];
  contatos: ContactList[];
  contato: Contact;
  configs: ConfigList[];
  listaTurmas: TurmaList[];
  turmaSelecionada: string;

  currentDate = new Date();
  weekdays = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
  dia = this.weekdays[this.currentDate.getDay()];
  ativo: boolean;
  verificadorNaoIra = false;
  constructor(public configProvider: ConfigProvider, public storage: Storage, public navCtrl: NavController, private contactProvider: ContactProvider, public navParams: NavParams, private toast: ToastController, public alerCtrl: AlertController, private turmaProvider: TurmaProvider) {
  }



  ionViewDidEnter() {
    this.contatos = [];
    this.storage.ready().then(() => {

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
          this.contatos = this.contacts;
          this.contatos.forEach(aluno => {
            if (aluno.contact.mudancaPresenca == false) {
              if (aluno.contact.presencaPadrao.match("Sazonalmente") && aluno.contact.diasSazonais.indexOf(this.dia.toString()) > -1) {
                aluno.contact.presenca = aluno.contact.presencaSazonal;
              } else if (aluno.contact.presencaPadrao.match("Sazonalmente") && !(aluno.contact.diasSazonais.indexOf(this.dia.toString()) > -1)) {
                aluno.contact.presenca = "Não Irá - Esse dia não está cadastrado para este aluno!";
              }
            }
          });
        });

      this.configProvider.getAll()
        .then((result) => {
          debugger
          this.configs = result.filter(x => (x.config.tipo == "config" && x.config.name == "Página de Cadastros"));
          this.configs.forEach(x => {
            this.ativo = x.config.ativo;
          });

        });

    });
  }

  ionViewWillLeave(){
    this.contatos = [];
    console.log("Saiu da página");
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CadastrosPage');
    this.contacts = [];
  }

  adicionarAluno() {
    var nav = this.navCtrl;

    this.turmaProvider.getAll()
      .then((result) => {
        this.listaTurmas = result.filter(x => (x.turma.tipo == "turma"));

        if (this.listaTurmas.length == 0) {
          this.cadastrarTurma();
        } else {
          nav.push(EditContactPage);
        }
      });


  }

  cadastrarTurma() {

    const alert = this.alerCtrl.create({
      title: 'ATENÇÃO!',
      subTitle: '<br> Cadastre uma turma!<br><br> (Ex.: Matutina, Vespertina, Noturna...)<br><br> Ela é necessaria para o cadastro de alunos e utilização desse aplicativo! <br><br> Crie sempre turmas com <strong>nomes diferentes</strong>!',
      buttons: ['Ok']
    });
    alert.present();
    this.navCtrl.push(TurmasPage);

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
        item.contact.presenca = "Não Irá - " + this.dia + " não está cadastrado para este aluno!";
      }
    }

    debugger
    let alert = this.alerCtrl.create({

      title: item.contact.name,
      message: 'Presença para hoje, ' + this.dia + ': <br><br><h5 align="center">' + item.contact.presenca + "</h5>",
      buttons: ['Ok']
    });
    alert.present()
  }


  filterItems(ev: any) {
    let val = ev.target.value;
    if (val && val.trim() !== '') {
      this.contatos = this.contacts.filter(function (item) {
        return item.contact.name.toLowerCase().includes(val.toLowerCase());
      });
    } else {
      this.contatos = this.contacts;
    }
  }


  mudarTurma() {
    debugger
    this.contacts = [];
    console.log('Turma selecionada: ' + this.turmaSelecionada);

    this.storage.set('turmaSelecionada', this.turmaSelecionada);
    this.ionViewDidEnter();
  }

  detalhes(aluno) {
    let semEmail = false;
    if (aluno.email == null || aluno.email == "") {
      semEmail = true;
      aluno.email = 'Não informado!';
    }
    const alert = this.alerCtrl.create({
      title: aluno.name,
      subTitle: '<br> Telefone: ' + aluno.phone + '<br><br>' + 'Curso: ' + aluno.curso + '<br><br>' + 'Turma: ' + aluno.turma + '<br><br>' + 'Email: ' + aluno.email,
      buttons: ['Fechar']
    });
    alert.present();

    if (semEmail == true) {
      aluno.email = "";
    }

  }

  

}