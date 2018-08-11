import { Injectable } from '@angular/core';

@Injectable()
export class Enumerador {

	constructor() { }

	public PESQUISA_TERMO: number = 1;
	public PESQUISA_PRODUTO: number = 2;
	public PESQUISA_DESCRICAO_PRODUTO: number = 3;
	public EXIBICAO_GRID: number = 1;
	public EXIBICAO_LISTA: number = 2;
	public ESPACO_BANNER_TOPO: number = 1;


	//Doc: https://ionicframework.com/docs/api/components/grid/Grid/
	public LARGURA_COL_SM: number = 576;
	public LARGURA_COL_MD: number = 768;
	public LARGURA_COL_LG: number = 992;
	public LARGURA_COL_XL: number = 1200;

	public COL: string = 'col';
	public COL_SM: string = 'col-sm';
	public COL_MD: string = 'col-md';
	public COL_LG: string = 'col-lg';
	public COL_XL: string = 'col-xl';

	public MAIS_VENDIDOS: number = 1;
	public MENOR_PRECO: number = 2;
	public MAIOR_PRECO: number = 3;
	public FAVORITOS: number = 4;
} 