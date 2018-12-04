import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, MenuController } from 'ionic-angular';
import { TurmaProvider, TurmaList } from '../../providers/turma/turma';
import { CadastroTurmasPage } from '../cadastro-turmas/cadastro-turmas';
import { Storage } from '@ionic/storage';
import { UtilProvider } from '../../providers/util/util';
import { ContactProvider, ContactList } from '../../providers/contact/contact';


@IonicPage()
@Component({
  selector: 'page-turmas',
  templateUrl: 'turmas.html',
})
export class TurmasPage {
  turmas: TurmaList[];
  turmaSelecionada: string;
  listaAlunos: ContactList[];
  mostrarMsgVazio: boolean;

  constructor(public util: UtilProvider, public storage: Storage, public navCtrl: NavController, public navParams: NavParams, private alunos: ContactProvider, private turmaProvider: TurmaProvider, private alerCtrl: AlertController, private toast: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TurmasPage');
  }

  ionViewDidEnter() {
    
    this.storage.ready().then(() => {

      this.turmaProvider.getAll()
        .then((result) => {

          this.turmas = result.filter(x => (x.turma.tipo == "turma"));

          if(this.turmas.length == 0){
            this.mostrarMsgVazio = true;
          }else{
           this.mostrarMsgVazio = false;
          }

          this.turmas.forEach(x => {

            this.alunos.getAll().then((result) => {
              this.listaAlunos = result;
              this.listaAlunos = this.listaAlunos.filter(x => (x.contact.tipo == "aluno"));
              console.log(this.listaAlunos)

              let turma = x.turma;

              let quantidade = this.listaAlunos.filter(x => (x.contact.turma.toString().match(turma.nomeTurma.toString()))).length;

               turma.quantidadeAlunos =  quantidade;
      
               this.turmaProvider.update(x.key, turma); 
              console.log(turma);
            });


          });
        });
    });

    
    this.util.esconderLoading();
  }

  adicionarTurma() {
    this.navCtrl.push(CadastroTurmasPage);
  }
  editarTurma(item) {
    
    this.navCtrl.push(CadastroTurmasPage, { key: item.key, value: item.turma });
  }

  doConfirm(item) {
    let confirm = this.alerCtrl.create({
      title: 'ATENÇÃO',
      subTitle: '<br>Este processo irá <strong>deletar todos os alunos</strong> referentes à este grupo! <br><br> Deseja mesmo remover o grupo ' + item.turma.nomeTurma + '?',
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

    if (item.turma.nomeTurma == this.turmaSelecionada) {
      this.storage.set("turmaSelecionada", "SEM_TURMA_SELECIONADA");
    }
    this.turmaProvider.remove(item.key, item.turma.nomeTurma)
      .then(() => {
        // Removendo do array de items
        var index = this.turmas.indexOf(item);
        this.turmas.splice(index, 1);
        this.toast.create({ message: 'Grupo ' + item.turma.nomeTurma + ' removido.', duration: 1500, position: 'botton' }).present();
      })
  }

}
