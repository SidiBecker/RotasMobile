import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';

/*
  Generated class for the TurmaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TurmaProvider {
  turmas: TurmaList[];
  codigo: string;
  constructor(private storage: Storage, private datepipe: DatePipe) { }

  public insert(turma: Turma) {

    this.getAll()
      .then((result) => {
        debugger 
        this.turmas = result.filter(x => (x.turma.tipo == "turma"));

        let key = ('Turma cod.: ' + (this.turmas.length + 1));

        return this.save(key, turma);
      });


  }

  public update(key: string, turma: Turma) {
    return this.save(key, turma);
  }

  private save(key: string, turma: Turma) {
    return this.storage.set(key, turma);
  }

  public remove(key: string) {
    return this.storage.remove(key);
  }

  public getAll() {

    let turmas: TurmaList[] = [];

    return this.storage.forEach((value: Turma, key: string, iterationNumber: Number) => {
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
 
     debugger
     let turmas: TurmaList[] = [];
 
     return this.storage.forEach((turmaBanco: Turma, key: string, iterationNumber: Number) => {
       debugger
 
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
  //turmaSelecionada: string;

}

export class TurmaList {
  key: string;
  turma: Turma;
}
