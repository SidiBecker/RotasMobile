import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, MenuController, Navbar } from 'ionic-angular';
import { Turma, TurmaProvider } from '../../providers/turma/turma';
import { ContactProvider } from '../../providers/contact/contact';
import { FormBuilder, FormGroup, FormControl, Validators } from '../../../node_modules/@angular/forms';
import { Storage } from '@ionic/storage';
import { UtilProvider } from '../../providers/util/util';

/**
 * Generated class for the CadastroTurmasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cadastro-turmas',
  templateUrl: 'cadastro-turmas.html',
})
export class CadastroTurmasPage {

  @ViewChild(Navbar) navBar: Navbar;

  model: Turma;
  key: string;
  nomeAntigo: any;
  formularioTurma: FormGroup;
  mostrarAlunos: boolean;
  validation_messages = {
    'nomeTurma': [
      { type: 'required', message: '*Informe o nome do Grupo.' }
    ]
  }
  turmaSelecionada: string;

  constructor(public menuCtrl: MenuController, public util: UtilProvider, public storage: Storage, public alerCtrl: AlertController, public formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams, private turmaProvider: TurmaProvider, private contactProvider: ContactProvider, private toast: ToastController) {



    if (this.navParams.data.value && this.navParams.data.key) {

      this.model = this.navParams.data.value;
      this.key = this.navParams.data.key;
      this.nomeAntigo = this.model.nomeTurma.toString();
      this.mostrarAlunos = true;

    } else {
      this.model = new Turma();
      this.mostrarAlunos = false;
    }

    let parametro = this.model;


    this.formularioTurma = this.formBuilder.group({


      nomeTurma: new FormControl(parametro.nomeTurma, Validators.required)

    });

    this.storage.get("turmaSelecionada").then((val) => {
      this.turmaSelecionada = val;
    });

  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = () => {
      this.navCtrl.pop();

      this.util.mostrarLoading();
    };

  }

  ionViewDidLeave() {
  }


  save() {

    let valores = this.formularioTurma.value;
    let turma = this.model;


    if (turma.nomeTurma == this.turmaSelecionada) {
      this.storage.set("turmaSelecionada", valores.nomeTurma);
    }

    turma.nomeTurma = valores.nomeTurma;

    this.turmaProvider.getAll().then((result) => {
      result = result.filter(x => (x.turma.tipo == "turma" && x.key != this.key && x.turma.nomeTurma.toLowerCase() == turma.nomeTurma.toLowerCase()));
      if (result.length > 0) {
        this.mostrarMsgNomeTurma(turma.nomeTurma);
      } else {
        this.saveTurma();
      }


    });

    if (turma.nomeTurma == "" || turma.nomeTurma == null) {

      const alert = this.alerCtrl.create({
        title: 'Campo inválido!',
        subTitle: '<br>O nome do grupo não pode ser vazio!',
        buttons: ['Ok']
      });

      alert.present();
    }

  }

  mostrarMsgNomeTurma(nome) {
    const alert = this.alerCtrl.create({
      title: 'Campo inválido!',
      subTitle: '<br>Já existe um grupo com o nome <strong>' + nome + '</strong>!<br><br> Por favor, escolha outro.',
      buttons: ['Ok']
    });
    alert.present();
  }

  private saveTurma() {
    if (this.key) {
      this.turmaProvider.update(this.key, this.model);
      this.contactProvider.updateTurma(this.nomeAntigo, this.model.nomeTurma)
    } else {
      this.model.tipo = "turma";
      this.turmaProvider.insert(this.model);
    }

    this.toast.create({ message: 'Grupo ' + this.model.nomeTurma + ' salvo.', duration: 1500, position: 'botton' }).present();

    this.storage.ready().then(() => {
      this.navCtrl.pop();
      this.util.mostrarLoading();
    });
  }
}
