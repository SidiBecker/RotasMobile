import { Injectable } from '@angular/core';

@Injectable()
export class Storage {

    public get(chave: string) {
        var valor = localStorage.getItem(chave);
        return valor == null ? '' : valor;
    }

    public set(chave: string, valor: string) {
        return localStorage.setItem(chave, valor);
    }

} 