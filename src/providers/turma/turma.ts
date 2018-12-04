import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { ContactProvider, ContactList } from '../contact/contact';

/*
  Generated class for the TurmaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TurmaProvider {
  turmas: TurmaList[];
  codigo: string;
  listaAlunos: ContactList[];
  alunosRelacionados: ContactList[];
  seq: number;
  constructor(private storage: Storage, private alunos: ContactProvider) { }

  public insert(turma: Turma) {

    this.getAll()
      .then((result) => {

        this.turmas = result.filter(x => (x.turma.tipo == "turma"));
     
        this.storage.get("seq_grupo").then((val) => {
          this.seq = val;
          if (this.seq == null) {
            this.seq = 0;
          }

          this.storage.set("seq_grupo", this.seq + 1);

          let key = ('Turma cod.: ' + (this.seq + 1));

          return this.save(key, turma);
        });


      });
  }

  public update(key: string, turma: Turma) {
    return this.save(key, turma);
  }

  private save(key: string, turma: Turma) {
    return this.storage.set(key, turma);
  }

  public remove(key: string, nomeTurma: string) {

    this.alunos.getAll().then((result) => {
      this.listaAlunos = result;
  
      this.listaAlunos = this.listaAlunos.filter(x => (x.contact.tipo == "aluno"));// && x.contact.turma == nomeTurma.trim()));

      this.listaAlunos.forEach(x => {
        if (x.contact.turma.trim() == nomeTurma) {
          this.alunos.remove(x.key);
        }

      });
    });

    return this.storage.remove(key);
  }

  public async getAll() {

    let turmas: TurmaList[] = [];

    return await this.storage.forEach((value: Turma, key: string, iterationNumber: Number) => {
      let turma = new TurmaList();
      turma.key = key;
      turma.turma = value;
      turmas.push(turma);
    })
      .then(() => {
        return Promise.resolve(turmas);
      })
      .catch((error) => {
        return Promise.reject(error);
      });


  }


  /*  public updateSelecionada(turmaSelecionada: string) {
 
     
     let turmas: TurmaList[] = [];
 
     return this.storage.forEach((turmaBanco: Turma, key: string, iterationNumber: Number) => {
       
 
       if (turmaBanco.tipo == "turma") {
         let turma = new TurmaList();
         turma.key = key;
         turma.turma = turmaBanco;
 
         turma.turma.turmaSelecionada = turmaSelecionada;
 
         turmas.push(turma);
 
         this.save(key, turma.turma);
       }
     })
       .then(() => {
         return Promise.resolve(turmas);
       })
       .catch((error) => {
         return Promise.reject(error);
       });
 
   }
  */
}

export class Turma {
  nomeTurma: string;
  tipo: string;
  quantidadeAlunos: number;
  //turmaSelecionada: string;

}

export class TurmaList {
  key: string;
  turma: Turma;
}
