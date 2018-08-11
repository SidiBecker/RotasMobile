import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { App } from 'ionic-angular';
import { LoadingController } from 'ionic-angular/index';

import 'rxjs/Rx';
import 'rxjs/add/operator/timeout';
import { Storage } from '../../storage';
import { Util } from '../../pages/utils/tools/util';
import { Constantes } from '../../pages/utils/tools/constantes';
import { Mensagem } from '../../pages/utils/tools/mensagem';
import { Network } from '@ionic-native/network';


@Injectable()
export class Proxy {

  /**
   * Tempo em milisegundos do timeout da requisição.
   */
  public defaultTimeout: number = 30 * 1000;

  public conectado: boolean;

  constructor(
    public http: Http,
    public storage: Storage,
    public app: App,
    public util: Util,
    private loadingCtrl: LoadingController,
    public constantes: Constantes,
    private mensagem: Mensagem,
    private network: Network) {

    var me = this;
    me.network.onConnect().subscribe(() => {
      me.conectado = true;
    });

    me.network.onDisconnect().subscribe(() => {
      me.conectado = false;
    });
  }

  /** 
   * Cria o popup de loading
  */
  criarPopupLoading() {
    return this.loadingCtrl.create({
      content: this.mensagem.CARREGANDO
    });
  }

  possuiConexao() {
    var me = this;
    if (!me.conectado && !me.constantes.DESENVOLVIMENTO) {
      me.util.msgToast(me.mensagem.VERIFIQUE_CONEXAO_INTERNET);

      return false;
    }
    return true;
  }

  /**
   * Realiza uma requisição POST.
   * @param servico String caminho do serviço
   * @param parametros Objeto com os parâmetros
   * @param parametroSucesso Função de sucesso da requisição
   * @param parametroFalha Função de falha da requisição
   * @param esconderLoading Boolean (OPCIONAL) TRUE para esconder o loading
   */
  post(servico, parametros, parametroSucesso, parametroFalha, esconderLoading?: boolean, timeout?:number) {
    var me = this;

    if (!me.possuiConexao()) {
      return;
    }

    let loadingPopup;
    esconderLoading = esconderLoading == undefined ? false : esconderLoading;

    if (!esconderLoading) {
      loadingPopup = this.criarPopupLoading();
      loadingPopup.present();
    }

    let options = this.getOptions();
    let body = JSON.stringify(parametros);
    var url = this.storage.get(this.constantes.ENDERECO_REQUISICAO) + servico;
debugger
    return this.http.post(url, body, options).timeout(timeout == undefined ? me.defaultTimeout :timeout )
      .toPromise().then(
        sucesso => me.sucessoRequisicao(sucesso, parametroSucesso, loadingPopup),
        falha => me.falhaRequisicao(falha, parametroFalha, loadingPopup)
      );
  }

  /**
   * Realiza uma requisição DELETE.
   * @param servico String caminho do serviço
   * @param parametros Json com os parâmetros
   * @param parametroSucesso Função de sucesso da requisição
   * @param parametroFalha Função de falha da requisição
   * @param esconderLoading Boolean (OPCIONAL) TRUE para esconder o loading
   */
  delete(servico, parametros, parametroSucesso, parametroFalha, esconderLoading?: boolean) {
    var me = this;

    if (!me.possuiConexao()) {
      return;
    }

    let loadingPopup;
    esconderLoading = esconderLoading == undefined ? false : esconderLoading;

    if (!esconderLoading) {
      loadingPopup = this.criarPopupLoading();
      loadingPopup.present();
    }

    let options = this.getOptions();

    var url: string = this.storage.get(this.constantes.ENDERECO_REQUISICAO) + servico;

    if (parametros != null) {
      url += '?jsonParametros=' + encodeURIComponent(JSON.stringify(parametros));
    }

    return this.http.delete(url, options).timeout(me.defaultTimeout)
      .toPromise().then(
        sucesso => me.sucessoRequisicao(sucesso, parametroSucesso, loadingPopup),
        falha => me.falhaRequisicao(falha, parametroFalha, loadingPopup)
      );
  }

  /**
   * Realiza uma requisição GET.
   * @param servico String caminho do serviço
   * @param parametros String ou Integer valor do parâmetro
   * @param parametroSucesso Função de sucesso da requisição
   * @param parametroFalha Função de falha da requisição
   * @param esconderLoading Boolean (OPCIONAL) TRUE para esconder o loading
   */
  get(servico, parametros, parametroSucesso, parametroFalha, esconderLoading?: boolean) {
    var me = this;

    if (!me.possuiConexao()) {
      return;
    }

    let loadingPopup;
    esconderLoading = esconderLoading == undefined ? false : esconderLoading;

    if (!esconderLoading) {
      loadingPopup = this.criarPopupLoading();
      loadingPopup.present();
    }

    let options = this.getOptions();

    var urlServer: string = this.storage.get(this.constantes.ENDERECO_REQUISICAO);
    let urlServico = urlServer + servico;

    if (parametros != null) {
      urlServico += '?jsonParametros=' + encodeURIComponent(JSON.stringify(parametros));
    }

    return this.http.get(urlServico, options).timeout(me.defaultTimeout)
      .toPromise().then(
        sucesso => me.sucessoRequisicao(sucesso, parametroSucesso, loadingPopup),
        falha => me.falhaRequisicao(falha, parametroFalha, loadingPopup)
      );
  }

  /**
   * Realiza uma requisição PUT.
   * @param servico String caminho do serviço
   * @param parametros Objeto com os parâmetros
   * @param parametroSucesso Função de sucesso da requisição
   * @param parametroFalha Função de falha da requisição
   * @param esconderLoading Boolean (OPCIONAL) TRUE para esconder o loading
   */
  put(servico, parametros, parametroSucesso, parametroFalha, esconderLoading?: boolean) {
    var me = this;

    if (!me.possuiConexao()) {
      return;
    }

    let loadingPopup;
    esconderLoading = esconderLoading == undefined ? false : esconderLoading;

    if (!esconderLoading) {
      loadingPopup = this.criarPopupLoading();
      loadingPopup.present();
    }

    let options = this.getOptions();
    let body = JSON.stringify(parametros);

    var urlServer: string = this.storage.get(this.constantes.ENDERECO_REQUISICAO);
    let urlServico = urlServer + servico;

    return this.http.put(urlServico, body, options).timeout(me.defaultTimeout)
      .toPromise().then(
        sucesso => me.sucessoRequisicao(sucesso, parametroSucesso, loadingPopup),
        falha => me.falhaRequisicao(falha, parametroFalha, loadingPopup)
      );
  }

  /**
   * função que faz o tratamento padrão nas falhas de requisição.
   * @param falha 
   * @param parametroFalha 
   */
  reponseFalha(falha, parametroFalha?) {
    var me = this;

    // Se ocorreu erro de timeout, retorna o alerta da função alertaFalhaConexaoServidor.
    if (falha.name === "TimeoutError") {
      this.alertaFalhaConexaoServidor();
      return;
    }

    switch (falha.status) {
      case 401:
        this.util.alerta(falha.json().mensagem);
        this.storage.set(me.constantes.TICKET_ACESSO, '');
        //this.app.getRootNav().setRoot(me.pages.AUTENTICACAO);
        break;
      case 405:
      case 404:
      case 0:
        me.alertaFalhaConexaoServidor();
        break;
      default:
        parametroFalha(falha.json());
    }
  }

  /**
   * Função para montar os OPTIONS da requisição.
   */
  getOptions() {
    return new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'sistema': 1,
        'ticketAcesso': this.storage.get(this.constantes.TICKET_ACESSO)
      })
    });
  }

  /** 
   * Alerta padrão quando houve falha de conexão com o servidor.
  */
  alertaFalhaConexaoServidor() {
    return this.util.alerta(this.mensagem.NAO_FOI_POSSIVEL_ESTABELECER_CONEXAO_SERVIDOR);
  }

  /**
   * Sucesso padrão das requisições: esconder a máscara de carregando e
   * chamar a função passada por parâmetro com o valor retornado da requisição.
   * @param sucesso Valor retornado pelo serviço
   * @param parametroSucesso Função de sucesso recebida por parâmetro
   * @param loadingPopup Máscara de carregamento (para destruir a mesma)
   */
  sucessoRequisicao(sucesso, parametroSucesso, loadingPopup) {
    if (loadingPopup != undefined) {
      loadingPopup.dismiss();
    }

    if (parametroSucesso != null) {
      parametroSucesso(sucesso.json());
    }
  }

  /**
   * Falha padrão das requisições: esconder a máscara de carregando e
   * chamar a função passada por parâmetro com o valor retornado da requisição.
   * @param falha Valor retornado pelo serviço
   * @param parametroFalha Função de falha recebida por parâmetro
   * @param loadingPopup Máscara de carregamento (para destruir a mesma)
   */
  falhaRequisicao(falha, parametroFalha, loadingPopup) {
    if (loadingPopup != undefined) {
      loadingPopup.dismiss();
    }

    if (falha.status == 401) {
      this.reponseFalha(falha);
      return;
    }
    
    if (parametroFalha != null) {
      this.reponseFalha(falha, parametroFalha);
    }
  }
}
