import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Turma, TurmaProvider } from '../../providers/turma/turma';
import { TurmasPage } from '../turmas/turmas';
import { ContactProvider } from '../../providers/contact/contact';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, private turmaProvider: TurmaProvider, private contactProvider: ContactProvider, private toast: ToastController) {

debugger
    if (this.navParams.data.value && this.navParams.data.key) {

      this.model = this.navParams.data.value;
      this.key = this.navParams.data.key;
      this.nomeAntigo = this.model.nomeTurma;
      debugger
    } else {
      this.model = new Turma();
    }

    console.log(this.model.nomeTurma);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadastroTurmasPage');
  }

  save() {

    this.saveTurma() 
      .then(() => {
        this.toast.create({ message: 'Turma' + this.model.nomeTurma + ' salva.', duration: 1500, position: 'botton' }).present();
        this.navCtrl.setRoot(TurmasPage);
        this.navCtrl.popToRoot 


      }) 
      .catch(() => {
        this.toast.create({ message: 'Erro ao salvar a turma.', duration: 3000, position: 'botton' }).present();
      });  
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
