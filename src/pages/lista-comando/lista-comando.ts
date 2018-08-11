import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Comando } from '../../models/comando';
import { Proxy } from '../../providers/proxy/proxy';
import { Util } from '../utils/tools/util';
import { Cliente } from '../../models/cliente';


@IonicPage()
@Component({
  selector: 'page-lista-comando',
  templateUrl: 'lista-comando.html',
})
export class ListaComandoPage {

  items: Comando[];
  clientes: Cliente[];
  clienteSelecionado: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public proxy: Proxy, public util: Util, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.carregarClientes();
  }


  /**A chamada da função  escolherBanco deve ficar comentada até criarmos um novo script*/
  executarComando(item, nomeContainer) {

    if (item.id === 18 || item.id === 19) {
      this.confirmaAcao(item, nomeContainer);
    } /*else if (item.id === 12) {
      this.escolherBanco(item, nomeContainer);
    }*/ else {
      this.executar(item, nomeContainer, null);
    }
  }

  executar(item, nomeContainer, nomeBanco) {
    var me = this;

    let sucesso = function (obj) {

      me.util.alerta(obj.resultado);

    }

    let falha = function (obj) {
      me.util.alerta(obj.mensagem);
      me.clienteSelecionado = null;
    }

    me.proxy.post('comandoService/aplicar', { codigoCliente: me.clienteSelecionado, codigoComando: item.id, nomeContainer: nomeContainer, nomeBanco: nomeBanco }, sucesso, falha, false,item.timeout);
  }

  carregarClientes() {
    var me = this;

    let sucesso = function (obj) {

      me.clientes = obj;

    }

    let falha = function (obj) {
      me.util.alerta(obj.mensagem);
    }

    me.proxy.get('clienteService/listar', null, sucesso, falha, true);
  }

  carregarComandos(codigoCliente) {
    var me = this;

    let sucesso = function (obj) {

      me.items = obj;

    }

    let falha = function (obj) {
      me.util.alerta(obj.mensagem);
      me.clienteSelecionado = 0;
    }

    me.proxy.get('comandoService/listarPorCliente', { id: codigoCliente }, sucesso, falha, true);
  }

  escolherBanco(item, nomeContainer) {
    var me = this;

    let alert = this.alertCtrl.create();
    alert.setTitle('Qual banco utilizar?');

    alert.addInput({
      type: 'radio',
      label: 'PostgreSQL',
      value: 'postgresql',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'Oracle',
      value: 'oracle'
    });

    
    alert.addButton('Cancelar');
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        me.executar(item, nomeContainer, data);
      }
    });

    alert.present();

  }

  confirmaAcao(item, nomeContainer) {
    var me = this;

    let alert = this.alertCtrl.create({
      title: 'Atenção',
      message: 'Deseja realmente executar este comando?',
      buttons: [
        {
          text: 'NÃO',
          role: 'nao'
        },
        {
          text: 'SIM',
          handler: () => {
            me.executar(item, nomeContainer, null);

          }
        }
      ]
    });
    alert.present();

  }

  onSelectChange(selectedValue: any) {
    this.clienteSelecionado = selectedValue;
    if (this.clienteSelecionado > 0) {
      this.carregarComandos(selectedValue);
    }
  }

}
