import { Injectable } from '@angular/core';

@Injectable()
export class Constantes {

    constructor() { }


    /*aplicacao*/
    public DESENVOLVIMENTO: boolean = true;
    public VERSAO_APLICATIVO: string = '1.00.00.000';

    /*Social Sharing - Compartilhar Aplicativo
    É possível definir informações que serão apresentadas no compartilhamento do aplicativo em rede s sociais
    NOME_APP: Nome do aplicativo*/
    public NOME_APP: string = 'Sysmo Devops';

    /*Endereços */
    public ENDERECO_CLIENTE: string = 'http://localhost:8080';

    /*chaves storage*/
    public ENDERECO_REQUISICAO: string = 'enderecoRequisicao';
    public TICKET_ACESSO: string = 'ticketAcesso';
    public LOGIN_SENHA: string = 'loginSenha';
    public LOGIN_USUARIO: string = 'login';
    public FLAG_BIOMETRIA: string = 'flagBiometria';
    public NOME_USUARIO: string = 'nomeUsuario';
    public IMAGEM_USUARIO: string = 'imagemUsuario';
    public CONCLUSAO_CADASTRO: string = 'conclusaoCadastro';
    public PONTOS_LIBERADOS: string = 'pontosLiberados';
    public PONTOS_RESGATADOS: string = 'pontosResgatados';
    public SALDO_PONTOS: string = 'saldoPontos';
    public EMPRESA_SELECIONADA: string = 'lojaPreferencia';

    /*CONFIGURAÇÕES COMPARTILHAR E ONESIGNAL */
    public CHAVES_CONFIGURACAO = 'chavesConfiguracao';
    public VER_APRESENTACAO: string = 'verAplicacao';

    /*Caminho imagem Avatar.png (imagem padrão para foto do usuário)*/
    public CAMINHO_AVATAR_PNG: string = 'assets/img/Avatar.png';

    public CAMINHO_IMAGEM_PADRAO_PEQUENA: string = 'assets/img/padrao/pequena.png';
    public CAMINHO_IMAGEM_PADRAO_MEDIA: string = 'assets/img/padrao/media.png';
    public CAMINHO_IMAGEM_PADRAO_GRANDE: string = 'assets/img/padrao/grande.png';

    /*Ações linha do tempo */
    public LOGIN = 1;
    public LOGOFF = 2;
    public COMPARTILHAMENTO_REDE_SOCIAL = 3;
    public COMPARTILHAMENTO_PRODUTO = 4;
    public ALTERACAO_PERFIL = 5;
    public CADASTROU_PRE_CADASTRO = 6;
    public CADASTROU_PERFIL = 7;
    public INSTALACAO_APLICATIVO = 8

    /*CHAVES ONESIGNAL */
    public ONESIGNAL_APPID = '1296b582-be94-4b2b-b327-fc440d15febf';
    public ONESIGNAL_GOOGLE_PROJECT_NUMBER = '214741060402';

    /**Cores padrões do App para acessar pelo TypeScript */
    public COLOR_PRIMARY: string = '#2980B9';
    public COLOR_SECONDARY: string = '#63ACDD';
    public COLOR_DARK_1: string = '#474747';
    public COLOR_DARK_2: string = '#334551';
    public COLOR_LIGHT_1: string = '#FFFFFF';
    public COLOR_LIGHT_2: string = '#E6E6E6';
    public COLOR_LIGHT_3: string = '#858585';
    public COLOR_BACKGOUND_1: string = '#F6F6F6';

} 