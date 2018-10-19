import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { TurmaProvider, TurmaList } from '../../providers/turma/turma';
import { CadastroTurmasPage } from '../cadastro-turmas/cadastro-turmas';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the TurmasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-turmas',
  templateUrl: 'turmas.html',
})
export class TurmasPage {
  turmas: TurmaList[];

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams, private turmaProvider: TurmaProvider, private alerCtrl: AlertController, private toast: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TurmasPage');
  }

  ionViewDidEnter() {
    debugger

    this.storage.ready().then(() => {
      this.turmaProvider.getAll()
        .then((result) => {

          this.turmas = result.filter(x => (x.turma.tipo == "turma"));

        });
    });
  }

  adicionarTurma() {
    this.navCtrl.push(CadastroTurmasPage);
  }
  editarTurma(item) {
    debugger
    this.navCtrl.push(CadastroTurmasPage, { key: item.key, value: item.turma });
  }

  doConfirm(item) {
    let confirm = this.alerCtrl.create({
      title: 'ATENÇÃO',
      message: 'Deseja mesmo remover a turma ' + item.turma.nomeTurma + '?',
      buttons: [
        {
          text: 'Não',
          handler: () => {
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.remover(item);
          }
        }
      ]
    });
    confirm.present()
  }

  remover(item: TurmaList) {
    this.turmaProvider.remove(item.key)
      .then(() => {
        // Removendo do array de items
        var index = this.turmas.indexOf(item);
        this.turmas.splice(index, 1);
        this.toast.create({ message: 'Turma ' + item.turma.nomeTurma + ' removido.', duration: 1500, position: 'botton' }).present();
      })
  }

}
