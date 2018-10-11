import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';

@Injectable()
export class ContactProvider {

  constructor(private storage: Storage, private datepipe: DatePipe) { }

  public insert(contact: Contact) {
    let key = this.datepipe.transform(new Date(), "ddMMyyyyHHmmss");
    return this.save(key, contact);
  }

  public update(key: string, contact: Contact) {
    return this.save(key, contact);
  }

  public updateEmbarque() {
    let contacts: ContactList[] = [];

    return this.storage.forEach((value: Contact, key: string, iterationNumber: Number) => {
      debugger
      let contact = new ContactList();
      contact.key = key;
      contact.contact = value;
      contact.contact.embarque = false;
      contact.contact.presenca = contact.contact.presencaPadrao;
      if (contact.contact.mudancaPresenca == true && contact.contact.presencaPadrao.match("Sazonalmente")) {
        contact.contact.presenca = contact.contact.presencaSazonal;
      }

      contact.contact.mudancaPresenca = false;

      contacts.push(contact);

      this.save(key, value);

    })
      .then(() => {
        return Promise.resolve(contacts);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

  }

  public updateTurma(nomeAntigo: string, nomeNovo: string) {
    debugger
    let contacts: ContactList[] = [];

    return this.storage.forEach((value: Contact, key: string, iterationNumber: Number) => {
      debugger
      let contact = new ContactList();
      contact.key = key;
      contact.contact = value;
      if (contact.contact.tipo == "aluno") {
        if (contact.contact.turma.match(nomeAntigo)) {
          contact.contact.turma = nomeNovo;
        }

        contacts.push(contact);

        this.save(key, value);
      }
    })
      .then(() => {
        return Promise.resolve(contacts);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

  }




  private save(key: string, contact: Contact) {
    return this.storage.set(key, contact);
  }

  public remove(key: string) {
    return this.storage.remove(key);
  }

  public getAll() {

    let contacts: ContactList[] = [];

    return this.storage.forEach((value: Contact, key: string, iterationNumber: Number) => {
      let contact = new ContactList();
      contact.key = key;
      contact.contact = value;
      contacts.push(contact);
    })
      .then(() => {
        return Promise.resolve(contacts);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }
}

export class Contact {
  name: string;
  phone: number;
  curso: string[];
  email: string;
  presenca: string;
  embarque: boolean;
  presencaPadrao: string;
  mudancaPresenca: boolean = false; //true quando a presenca foi mudada
  diasSazonais: string[];
  presencaSazonal: string; //presenca padrao quando sazonal 
  /*  visivel : boolean; //mostrar na lista quando a presenca é sazonal (por dia) */
  tipo: string;
  turma: string;
}

export class ContactList {
  key: string;
  contact: Contact;
}
