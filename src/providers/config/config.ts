
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';

@Injectable()
export class ConfigProvider {


  constructor(private storage: Storage, private datepipe: DatePipe) { }


  public insert(config: Config) {
    let key = 'Config cod.: ' + this.datepipe.transform(new Date(), "ddMMyyyyHHmmss");
    return this.save(key, config);
  }

  public update(key: string, config: Config) {
    return this.save(key, config);
  }


  private save(key: string, config: Config) {
    return this.storage.set(key, config);
  }

  public remove(key: string) {
    return this.storage.remove(key);
  }

  public getAll() {

    let configuracoes: ConfigList[] = [];

    return this.storage.forEach((value: Config, key: string, iterationNumber: Number) => {
      let configs = new ConfigList();
      configs.key = key;
      configs.config = value;
      configuracoes.push(configs);
    })
      .then(() => {
        return Promise.resolve(configuracoes);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }
}

export class Config {
  name: string;
  tipo: string;
  ativo: boolean;
  descricao: string;

}

export class ConfigList {
  key: string;
  config: Config;
}
