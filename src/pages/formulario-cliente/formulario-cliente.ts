import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Util } from '../utils/tools/util';
import { Proxy } from '../../providers/proxy/proxy';
import { ListaClientePage } from '../lista-cliente/lista-cliente';


@IonicPage()
@Component({
  selector: 'page-formulario-cliente',
  templateUrl: 'formulario-cliente.html',
})
export class FormularioClientePage {

  private formularioCliente: FormGroup;


  validation_messages = {
    'nome': [
      { type: 'required', message: '*Informe o nome do cliente.' }
    ],
    'servidor': [
      { type: 'required', message: '*Informe o endereço do servidor.' }
    ],
    'numeroPorta': [
      { type: 'required', message: '*Informe o número da porta.' }
    ],
    'usuario': [
      { type: 'required', message: '*Informe o usuário root.' }
    ],
    'senha': [
      { type: 'required', message: '*Informe a senha.' }
    ]
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public util: Util, private proxy: Proxy, private events: Events) {

    let parametro = navParams.get('cliente');
    if (parametro == null) {
      parametro = { id: null, nome: null, servidor: null, numeroPorta: null, usuario: null, senha: null };
    }


    this.formularioCliente = this.formBuilder.group({
      id:parametro.id,
      nome: new FormControl(parametro.nome, Validators.required),
      servidor: new FormControl(parametro.servidor, Validators.required),
      numeroPorta: new FormControl(parametro.numeroPorta, Validators.required),
      usuario: new FormControl(parametro.usuario, Validators.required),
      senha: new FormControl(parametro.senha, Validators.required)
    });
  }


  salvar() {


    var me = this;

    let formularioClienteValues = me.formularioCliente.value;

    let sucesso = function (obj) {
      me.events.publish('listarClientes');
      me.navCtrl.popTo(ListaClientePage.name);
    }

    let falha = function (obj) {
      me.util.alerta(obj.mensagem);

    }

    me.proxy.post('clienteService/salvar', formularioClienteValues, sucesso, falha)

  }

}
