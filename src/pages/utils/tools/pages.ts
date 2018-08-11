import { Injectable } from '@angular/core';

@Injectable()
export class Pages {

    /** 
     * Arquivo que contém o nome de todas as pages do aplicativo.
     * Utilizado em questão do lazy loading, para que não seja
     * utilizada uma string representando o nome da page, mas sim, uma constante.
     * 
    */
    constructor() { }

    HOME: string = "HomePage";
    LIST: string = "ListPage";
    LISTA_CLIENTE: string = "ListaClientePage";
    AUTENTICACAO: string = "AutenticacaoPage";
    
} 