import { Injectable } from '@angular/core';

@Injectable()
export class Mensagem {

	constructor() { }

	/* MENSAGENS ALERTAS*/
	public DADOS_SALVO_SUCESSO: string = 'DADOS SALVOS COM SUCESSO.';
	public ATENCAO: string = 'ATENÇÃO';
	public EMAIL_SUCESSO: string = 'UMA NOVA SENHA FOI GERADA. ACESSE SEU E-MAIL PARA RECUPERÁ-LA.';
	public SUCESSO: string = 'SUCESSO';
	public VERIFIQUE_CONEXAO_INTERNET: string = 'VOCÊ NÃO ESTA CONECTADO À INTERNET. POR FAVOR, VERIFIQUE E TENTE NOVAMENTE.';
	public SEM_CONEXAO: string = 'SEM CONEXÃO';
	public CARREGANDO: string = 'CARREGANDO';
	public NAO_FOI_POSSIVEL_ESTABELECER_CONEXAO_SERVIDOR: string = 'NÃO FOI POSSÍVEL ESTABELECER CONEXÃO COM O SERVIDOR.';

	
} 