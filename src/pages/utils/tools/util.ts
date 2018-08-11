import { AlertController, ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable()
export class Util {

	currencyPrecision: number = 2;
	currencySign: string = 'R$ ';
	decimalSeparator: string = ',';
	thousandSeparator: string = '.';

	constructor(
		public alertController: AlertController,
		private toastCtrl: ToastController,
	) { }

	public alerta(mensagem: string, titulo?: string, ) {
		this.alertController.create({
			title: titulo != null ? titulo : 'ATENÇÃO',
			subTitle: mensagem,
			buttons: ['OK']
		}).present();
	}

	public msgToast(text) {
		let toast = this.toastCtrl.create({
			message: text,
			duration: 3000,
			position: 'top'
		});
		toast.present();
	}

	/*
	 calc_digitos_posicoes
	 
	 Multiplica dígitos vezes posições
	 
	 @param string digitos Os digitos desejados
	 @param string posicoes A posição que vai iniciar a regressão
	 @param string soma_digitos A soma das multiplicações entre posições e dígitos
	 @return string Os dígitos enviados concatenados com o último dígito
	*/
	public calc_digitos_posicoes(digitos, posicoes = 10, soma_digitos = 0) {

		// Garante que o valor é uma string
		digitos = digitos.toString();

		// Faz a soma dos dígitos com a posição
		// Ex. para 10 posições:
		//   0    2    5    4    6    2    8    8   4
		// x10   x9   x8   x7   x6   x5   x4   x3  x2
		//   0 + 18 + 40 + 28 + 36 + 10 + 32 + 24 + 8 = 196
		for (var i = 0; i < digitos.length; i++) {
			// Preenche a soma com o dígito vezes a posição
			soma_digitos = soma_digitos + (digitos[i] * posicoes);

			// Subtrai 1 da posição
			posicoes--;

			// Parte específica para CNPJ
			// Ex.: 5-4-3-2-9-8-7-6-5-4-3-2
			if (posicoes < 2) {
				// Retorno a posição para 9
				posicoes = 9;
			}
		}

		// Captura o resto da divisão entre soma_digitos dividido por 11
		// Ex.: 196 % 11 = 9
		soma_digitos = soma_digitos % 11;

		// Verifica se soma_digitos é menor que 2
		if (soma_digitos < 2) {
			// soma_digitos agora será zero
			soma_digitos = 0;
		} else {
			// Se for maior que 2, o resultado é 11 menos soma_digitos
			// Ex.: 11 - 9 = 2
			// Nosso dígito procurado é 2
			soma_digitos = 11 - soma_digitos;
		}

		// Concatena mais um dígito aos primeiro nove dígitos
		// Ex.: 025462884 + 2 = 0254628842
		var cpf = digitos + soma_digitos;

		// Retorna
		return cpf;

	} // calc_digitos_posicoes

	/*	 
	 * Valida CPF
	 
	 Valida se for CPF
	 
	 @param  string cpf O CPF com ou sem pontos e traço
	 @return bool True para CPF correto - False para CPF incorreto
	*/
	public valida_cpf(valor) {

		// Garante que o valor é uma string
		valor = valor.toString();

		// Remove caracteres inválidos do valor
		valor = this.replaceNaoNumeros(valor);


		// Captura os 9 primeiros dígitos do CPF
		// Ex.: 02546288423 = 025462884
		var digitos = valor.substr(0, 9);

		// Faz o cálculo dos 9 primeiros dígitos do CPF para obter o primeiro dígito
		var novo_cpf = this.calc_digitos_posicoes(digitos);

		// Faz o cálculo dos 10 dígitos do CPF para obter o último dígito
		novo_cpf = this.calc_digitos_posicoes(novo_cpf, 11);

		// Verifica se o novo CPF gerado é idêntico ao CPF enviado
		if (novo_cpf === valor) {
			// CPF válido
			return true;
		} else {
			// CPF inválido
			return false;
		}

	} // valida_cpf

	/*
	 valida_cnpj
	 
	 Valida se for um CNPJ
	 
	 @param string cnpj
	 @return bool true para CNPJ correto
	*/
	public valida_cnpj(valor) {

		// Garante que o valor é uma string
		valor = valor.toString();

		// Remove caracteres inválidos do valor
		valor = this.replaceNaoNumeros(valor);


		// O valor original
		var cnpj_original = valor;

		// Captura os primeiros 12 números do CNPJ
		var primeiros_numeros_cnpj = valor.substr(0, 12);

		// Faz o primeiro cálculo
		var primeiro_calculo = this.calc_digitos_posicoes(primeiros_numeros_cnpj, 5);

		// O segundo cálculo é a mesma coisa do primeiro, porém, começa na posição 6
		var segundo_calculo = this.calc_digitos_posicoes(primeiro_calculo, 6);

		// Concatena o segundo dígito ao CNPJ
		var cnpj = segundo_calculo;

		// Verifica se o CNPJ gerado é idêntico ao enviado
		if (cnpj === cnpj_original) {
			return true;
		}

		// Retorna falso por padrão
		return false;

	} // valida_cnpj


	/**
	 * Formata o número do documento e valida o mesmo. Se o valor informado, excluindo
	 * os caracteres especiais, for menor ou igual a 11, irá preencher com zeros à esquerda
	 * e formatar conforme máscara do cpf. Se for menor ou igual a 14 e maior que 11,
	 * irá formatar conforme máscara do cnpj. Se for maior que 14, não irá formatar.
	 * 
	 * @param valor numero do documento que será formatado e validado
	 * @returns objeto contendo valor formatado e flag dizendo se o número é válido ou não
	 */
	public formata_cpf_cnpj(valor) {
		// Remove caracteres inválidos do valor
		valor = this.replaceNaoNumeros(valor);
		var tamanho = valor.length;

		var valorFormado: string;
		var valido: boolean;
		var formatado: string;
		var valorPadLeft: string;

		if (tamanho <= 11) {
			valorPadLeft = valor.padStart(11, "0");

			formatado = valorPadLeft.substr(0, 3) + '.';
			formatado += valorPadLeft.substr(3, 3) + '.';
			formatado += valorPadLeft.substr(6, 3) + '-';
			formatado += valorPadLeft.substr(9, 2);

			valido = this.valida_cpf(valorPadLeft);
			valorFormado = formatado;
		} else if (tamanho > 11 && tamanho <= 14) {
			valorPadLeft = valor.padStart(14, "0");

			formatado = valorPadLeft.substr(0, 2) + '.';
			formatado += valorPadLeft.substr(2, 3) + '.';
			formatado += valorPadLeft.substr(5, 3) + '/';
			formatado += valorPadLeft.substr(8, 4) + '-';
			formatado += valorPadLeft.substr(12, 2);

			valido = this.valida_cnpj(valorPadLeft);
			valorFormado = formatado;
		} else {
			valido = false;
			valorFormado = valor;
		}

		return {
			documentoValido: valido,
			documentoFormato: valorFormado
		}
	}

	/**
	 * Faz o replace de todos os caracteres de uma string que não forem numéricos.
	 * @param valor => String
	 *  @returns string contendo somente caracteres numéricos
	 */
	public replaceNaoNumeros(valor: string) {
		return valor.replace(/[^0-9]/g, '');
	}

	public formataCEP(cep) {
		var valor = (cep != null) ? cep.replace(/[^0-9]/g, '') : 0;
		var formatado = '';

		if (valor.length === 8)
			formatado = cep.substring(0, 2) + '.' + cep.substring(2, 5) + '-' + cep.substring(5, 8);
		else
			formatado = cep;

		return formatado;
	}


	public isArray(objeto: any) {
		return Array.isArray(objeto);
	}

	public isNullOrEmpty(valor) {
		return valor == null || valor == '';
	}

	public isEmpty(array: Array<any>): boolean {
		return array.length == 0;
	}
	/**Gerar md5
		 * 
		 * Função que gera um hash md5 do valor passado, concatenando a secret key
		 * 
		 * @param string valor Valor que é recebido por parâmetro
		 * @returns string md5 Hash md5
		 */
	public gerarMd5(valor) {
		return Md5.hashStr('Sysmo$#_clpfcc' + valor).toString();
	}

} 