import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Turma, TurmaProvider } from '../../providers/turma/turma';
import { ContactProvider } from '../../providers/contact/contact';
import { FormBuilder, FormGroup, FormControl, Validators } from '../../../node_modules/@angular/forms';
import { Storage } from '@ionic/storage';

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
  model: Turma;
  key: string;
  nomeAntigo: any;
  formularioTurma: FormGroup;

  validation_messages = {
    'nomeTurma': [
      { type: 'required', message: '*Informe o nome da turma.' }
    ]
  }
  turmaSelecionada:string;

  constructor(public storage: Storage, public alerCtrl: AlertController, public formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams, private turmaProvider: TurmaProvider, private contactProvider: ContactProvider, private toast: ToastController) {

    debugger
    if (this.navParams.data.value && this.navParams.data.key) {

      this.model = this.navParams.data.value;
      this.key = this.navParams.data.key;
      this.nomeAntigo = this.model.nomeTurma.toString();
      debugger
    } else {
      this.model = new Turma();
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
  }


  save() {

    let valores = this.formularioTurma.value;
    let turma = this.model;

    console.log(turma.nomeTurma + "<== turma|| turma selecionada ==>" + this.turmaSelecionada);
   
    if(turma.nomeTurma == this.turmaSelecionada){
      this.storage.set("turmaSelecionada", valores.nomeTurma);
    }

    turma.nomeTurma = valores.nomeTurma;

    if (turma.nomeTurma == "" || turma.nomeTurma == null) {

      const alert = this.alerCtrl.create({
        title: 'Campo inválido!',
        subTitle: '<br>O nome da turma não pode ser vazio!',
        buttons: ['Ok']
      });

      alert.present();
    } else {
      this.saveTurma();

      this.toast.create({ message: 'Turma ' + this.model.nomeTurma + ' salva.', duration: 1500, position: 'botton' }).present();

      this.storage.ready().then(() => {
      this.navCtrl.pop();
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
