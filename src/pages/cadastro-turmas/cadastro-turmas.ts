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

  constructor(public menuCtrl : MenuController, public util: UtilProvider, public storage: Storage, public alerCtrl: AlertController, public formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams, private turmaProvider: TurmaProvider, private contactProvider: ContactProvider, private toast: ToastController) {

   
    debugger
    if (this.navParams.data.value && this.navParams.data.key) {

      this.model = this.navParams.data.value;
      this.key = this.navParams.data.key;
      this.nomeAntigo = this.model.nomeTurma.toString();
      this.mostrarAlunos = true;
      debugger
    } else {
      this.model = new Turma();
      this.mostrarAlunos = false;
    }

    let parametro = this.model;


    this.formularioTurma = this.formBuilder.group({


      nomeTurma: new FormControl(parametro.nomeTurma, Validators.required)

    });

    console.log(this.model.nomeTurma);

    this.storage.get("turmaSelecionada").then((val) => {
      this.turmaSelecionada = val;
      console.log(this.turmaSelecionada + "<== turma");
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadastroTurmasPage');
    this.navBar.backButtonClick = () => {
      console.log("clicou sair")
      this.navCtrl.pop();
      
      this.util.mostrarLoading();
    };

  }

  ionViewDidLeave() {
    console.log("Saiu");
  }


  save() {

    let valores = this.formularioTurma.value;
    let turma = this.model;

    console.log(turma.nomeTurma + "<== turma|| turma selecionada ==>" + this.turmaSelecionada);

    if (turma.nomeTurma == this.turmaSelecionada) {
      this.storage.set("turmaSelecionada", valores.nomeTurma);
    }

    turma.nomeTurma = valores.nomeTurma;

    if (turma.nomeTurma == "" || turma.nomeTurma == null) {

      const alert = this.alerCtrl.create({
        title: 'Campo inválido!',
        subTitle: '<br>O nome do grupo não pode ser vazio!',
        buttons: ['Ok']
      });

      alert.present();
    } else {
      this.saveTurma();

      this.toast.create({ message: 'Grupo ' + this.model.nomeTurma + ' salvo.', duration: 1500, position: 'botton' }).present();

      this.storage.ready().then(() => {
        this.navCtrl.pop();
        this.util.mostrarLoading();
      });
    }


  }

  private saveTurma() {
    if (this.key) {
      this.turmaProvider.update(this.key, this.model);
      return this.contactProvider.updateTurma(this.nomeAntigo, this.model.nomeTurma)
    } else {
      this.model.tipo = "turma";
      return this.turmaProvider.insert(this.model);
    }
  }



}
