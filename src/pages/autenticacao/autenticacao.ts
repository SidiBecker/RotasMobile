import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage, App, TextInput } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Proxy } from '../../providers/proxy/proxy';
import { Util } from '../utils/tools/util';
import { Storage } from '../../storage';
import { Pages } from '../utils/tools/pages';
import { Constantes } from '../utils/tools/constantes';
import { MenuController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-autenticacao',
  templateUrl: 'autenticacao.html'
})
export class AutenticacaoPage {

  private autenticacao: FormGroup;
  public navCtrl: NavController;
  public parametro1: String;
  private passwordType: String = 'password';
  private countFalha: number = 0;
  public digitado: Boolean = false;
  public leitorBiometricoDisponivel: Boolean = false;
  public estaLigado: Boolean = false;
  linkId: String;

  @ViewChild('campoSenha') campoSenha: TextInput;

  constructor(
    public formBuilder: FormBuilder,
    private proxy: Proxy,
    public util: Util,
    public storage: Storage,
    public app: App,
    public menu: MenuController,
    private navParams: NavParams,
    private pages: Pages,
    private constantes: Constantes,
    private events: Events) {

    let me = this;

    me.navCtrl = app.getActiveNav();

    me.autenticacao = me.formBuilder.group({
      login: [me.storage.get(me.constantes.LOGIN_USUARIO), Validators.compose([Validators.required, Validators.minLength(3)])],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      loginValido: false
    });

    if (navParams.get('logarViaEmail')) {

      let autenticacaoValues = {
        login: navParams.get('login'),
        senha: navParams.get('key'),
        tipoLogin: 'linkedin'
      }

      me.efeturarLogin(autenticacaoValues);

    }

  }

  /**
   * função responsavel por comunicar com o servidor e realizar o login
   * @param autenticacaoValues
   */
  public efeturarLogin(autenticacaoValues, senhaStorage?: string,loginStorage?: string) {
    var me = this;

    let senha = senhaStorage ? senhaStorage : me.util.gerarMd5(autenticacaoValues.senha);
    let login = loginStorage ? loginStorage : autenticacaoValues.login;

    var parametros = {
      login: login,
      senha: senha
    }

    let sucesso = function (obj) {

      me.storage.set(me.constantes.TICKET_ACESSO, obj.ticketAcesso);
      me.storage.set(me.constantes.NOME_USUARIO, obj.nomeUsuario);
      me.storage.set(me.constantes.LOGIN_USUARIO, login);

      /**
       * Registra o evento carregarMenu, que será capturado pelo app.component.ts
       */
      me.events.publish('menu:carregarMenu');

      //Se a autenticacao for via link, vai para a pagina de seguranca...
      if (autenticacaoValues.tipoLogin == 'linkedin') {

      } else {
        me.navCtrl.setRoot(me.pages.HOME);
        me.navCtrl.popToRoot();

      }

      me.countFalha = 0;
    }

    let falha = function (obj) {
      me.util.alerta(obj.mensagem);

      me.countFalha++;

    }

    me.proxy.post('autenticacaoService/login', parametros, sucesso, falha)
  }

  /**
   * função para chamar a tela de cadastro
   * 
   */
  public novoCadastro() {

  }


  public validarFormulario() {
    var me = this;

    let autenticacaoValues = me.autenticacao.value;

    me.efeturarLogin(autenticacaoValues);

  }

}