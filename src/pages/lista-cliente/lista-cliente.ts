import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { Cliente } from '../../models/cliente';
import { Proxy } from '../../providers/proxy/proxy';
import { Util } from '../utils/tools/util';
import { FormularioClientePage } from '../formulario-cliente/formulario-cliente';


@IonicPage()
@Component({
  selector: 'page-lista-cliente',
  templateUrl: 'lista-cliente.html',
})
export class ListaClientePage {

  items: Cliente[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public proxy: Proxy, public util: Util, private events: Events, public alertCtrl: AlertController) {

    events.subscribe('listarClientes', () => {
      this.listarClientes();
    });

  }


  adicionarCliente(event) {

    this.navCtrl.push(FormularioClientePage.name, { cliente: null })
  }

  ionViewDidLoad() {
    this.listarClientes();
  }

  confirmaExclusao(item) {
    var me = this;

    let alert = this.alertCtrl.create({
      title: 'Atenção',
      message: 'Deseja realmente excluir este registro?',
      buttons: [
        {
          text: 'NÃO',
          role: 'nao'
        },
        {
          text: 'SIM',
          handler: () => {
            me.excluirCliente(item);

          }
        }
      ]
    });
    alert.present();

  }

  excluirCliente(item) {

    let me = this;

    var parametro = { codigos: [item.id] };

    let sucesso = function (obj) {

      me.listarClientes();

    }

    let falha = function (obj) {
      me.util.alerta(obj.mensagem);
    }

    me.proxy.delete('clienteService/excluir', parametro, sucesso, falha, true);
  }

  editar(item) {
    this.navCtrl.push(FormularioClientePage.name, { cliente: item });
  }

  listarClientes() {
    var me = this;

    let sucesso = function (obj) {

      me.items = obj;

    }

    let falha = function (obj) {
      me.util.alerta(obj.mensagem);
    }

    me.proxy.get('clienteService/listar', null, sucesso, falha, true);
  }

}
