import { Component, ViewChild, Injectable } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, Navbar } from 'ionic-angular';
import { ContactProvider, Contact } from '../../providers/contact/contact';
import { TurmaProvider, TurmaList } from '../../providers/turma/turma';
import { FormGroup, FormBuilder, FormControl, Validators } from '../../../node_modules/@angular/forms';
import { UtilProvider } from '../../providers/util/util';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-edit-contact',
  templateUrl: 'edit-contact.html',

})

export class EditContactPage {

  @ViewChild(Navbar) navBar: Navbar;

  formularioAluno: FormGroup;

  validation_messages = {
    'name': [
      { type: 'required', message: '*Informe o nome do aluno.' }
    ],
    'curso': [
      { type: 'required', message: '*Informe o curso do aluno.' }
    ],
    'turma': [
      { type: 'required', message: '*Informe o grupo que pertence.' }
    ],
    'phone': [
      { type: 'required', message: '*Informe o telefone do aluno.' }
    ],
    'presencaPadrao': [
      { type: 'required', message: '*Informe a presença padrão do aluno.' }
    ]
  }

  mostrarDias: boolean;
  mostrarDeslocamento: boolean;

  model: Contact;
  key: string;
  curso = ['ADMINISTRAÇÃO',
    'AGRONOMIA',
    'ARQUITETURA E URBANISMO',
    'CIÊNCIAS CONTÁBEIS',
    'DIREITO',
    'EDUCAÇÃO FÍSICA',
    'ENGENHARIA CIVIL',
    'ENGENHARIA DE PRODUÇÃO',
    'GESTÃO DA TECNOLOGIA DA INFORMAÇÃO',
    'MEDICINA VETERINÁRIA',
    'ODONTOLOGIA',
    'PEDAGOGIA',
    'TECNOLOGIA EM ALIMENTOS'];

  botoesSelecionar = {
    cssClass: 'remove-cancel'
  };

  turmas: TurmaList[];

  currentDate = new Date();
  weekdays = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
  dia = this.weekdays[this.currentDate.getDay()];

  presencas = ['Só Ida', 'Só Volta', 'Ida e Volta', 'Sazonalmente'];

  constructor(public storage: Storage, public util: UtilProvider, public navCtrl: NavController, public formBuilder: FormBuilder, public navParams: NavParams, public alerCtrl: AlertController, private contactProvider: ContactProvider, private toast: ToastController, private turmaProvider: TurmaProvider) {

    if (this.navParams.data.contact && this.navParams.data.key) {

      this.model = this.navParams.data.contact;

      this.key = this.navParams.data.key;
    } else {
      this.model = new Contact();
    }
    let parametro = this.model;

    this.formularioAluno = this.formBuilder.group({

      name: new FormControl(parametro.name, Validators.required),
      curso: new FormControl(parametro.curso, Validators.required),
      turma: new FormControl(parametro.turma, Validators.required),
      phone: new FormControl(parametro.phone, Validators.required),
      email: new FormControl(parametro.email),
      presencaPadrao: new FormControl(parametro.presencaPadrao, Validators.required)
    });
    
    if (this.model.presencaPadrao != null) {

      if (this.model.presencaPadrao.match("Sazonalmente")) {

        this.mostrarDias = true;
        this.mostrarDeslocamento = true;
      } else {
        this.mostrarDias = false;
        this.mostrarDeslocamento = false;
      }
      console.log(this.mostrarDias + '<== mostrar dias')
    }

  }
  ionViewDidEnter() {
    

    this.turmaProvider.getAll()
      .then((result) => {

        this.turmas = result.filter(x => (x.turma.tipo == "turma"));

      });
  }

  ionViewDidLoad() {

    this.navBar.backButtonClick = () => {
      this.navCtrl.pop();

      this.util.mostrarLoading();
    };

  }
  verificarPresenca(item) {
    
    console.log('presença ==> ' + item);
    if (item.match("Sazonalmente")) {
      this.mostrarDias = true;
      this.mostrarDeslocamento = true;
    } else {
      this.mostrarDias = false;
      this.mostrarDeslocamento = false;
    }
  }

  parametros() {
    let valores = this.formularioAluno.value;
    let aluno = this.model;
    let telefone : string;

    aluno.name = valores.name;
    aluno.curso = valores.curso;
    aluno.turma = valores.turma;
    aluno.phone = valores.phone;
    aluno.presencaPadrao = valores.presencaPadrao;
    aluno.email = valores.email;
    aluno.diasSazonais = this.model.diasSazonais;

    if (aluno.diasSazonais == null) {
      aluno.diasSazonais = [];
    }

    if (aluno.presencaSazonal == null) {
      aluno.presencaSazonal = "";
    }

    if(aluno.phone != null){
      telefone = aluno.phone.toString().replace(/\s/g, "");
    }
    //fazer validações de campo vazio
    console.log(aluno);
    if (aluno.name == null || aluno.name == " ") {
      this.alerta("Nome");
    } else if (aluno.curso == null || aluno.curso == []) {
      this.alerta("Curso");
    } else if (aluno.turma == null || aluno.turma == " ") {
      this.alerta("Grupo");
    } else if (aluno.phone == null) {
      this.alerta("Telefone");
    } else if (telefone.length < 10) {
      this.alerta("telefone invalido");
    } else if ((aluno.email != null && aluno.email != "") && !(aluno.email.match("@") && aluno.email.includes("."))) {
      this.alerta("email");
    } else if (aluno.presencaPadrao == null || aluno.presencaPadrao == " ") {
      this.alerta("Presença padrão");
    } else if (aluno.presencaPadrao.match("Sazonalmente")) {
      if (aluno.diasSazonais.length == 0) {
        this.alerta("de dias que irá ");
      }
      else if (aluno.presencaSazonal.length == 0) {
        this.alerta("deslocamento");
      }
      else {
        this.save();
      }
    }
    else {
      this.model.presencaSazonal = "";
      this.save();
    }


  }


  alerta(campo) {
    if (!campo.match("de dias que irá") && !campo.match("deslocamento") && !campo.match("email") && !campo.match("telefone invalido"))  {

      const alert = this.alerCtrl.create({
        title: 'Campo inválido!',
        subTitle: '<br>O campo <strong>' + campo + '</strong> não pode ser vazio!',
        buttons: ['Ok']
      });
      alert.present();

    } else if (campo.match("de dias que irá")) {
      const alert = this.alerCtrl.create({
        title: 'Campo inválido!',
        subTitle: '<br>Se a presença for Sazonal, escolha os dias que o aluno irá!<br> <br>Se não, escolha um outro tipo de presença padrão!',
        buttons: ['Ok']
      });


      alert.present();
    } else if (campo.match("deslocamento")){
      const alert = this.alerCtrl.create({
        title: 'Campo inválido!',
        subTitle: '<br>Escolha o deslocamento que o aluno irá utilizar nos dias definidos!<br> <br>Se não, escolha um outro tipo de presença padrão!',
        buttons: ['Ok']
      });

      alert.present();
    }else if (campo.match("email")){
      const alert = this.alerCtrl.create({
        title: 'Campo inválido!',
        subTitle: '<br>O formato do e-mail informado é inválido! <br><br>Informe um email válido. <br><br> Exemplo: email@aluno.com',
        buttons: ['Ok']
      });

      alert.present();
    }else if (campo.match("telefone invalido")){
      const alert = this.alerCtrl.create({
        title: 'Campo inválido!',
        subTitle: '<br>Telefone infomado inválido! <br><br> Informe o DDD + Número. <br><br> Exemplo: 49 9 1122 3344',
        buttons: ['Ok']
      });

      alert.present();
    }
  }


  escolherEmbarques(item) {

    item = this.model;
    let ida = false;
    let volta = false;
    let idaVolta = false

    

    if (this.key == null && item.presencaSazonal == null) {
      this.model.presenca = "";
      this.model.presencaSazonal = "";
    }

    if (item.presencaSazonal.match("Só Ida")) {
      ida = true;
    } else if (item.presencaSazonal.match("Só Volta")) {
      volta = true;
    } else if (item.presencaSazonal.match("Ida e Volta")) {
      idaVolta = true;
    }


    let alert = this.alerCtrl.create();
    alert.setTitle('Presença para os dias');

    alert.addInput({
      type: 'radio',
      label: 'Só Ida',
      value: 'Só Ida',
      checked: ida

    });

    alert.addInput({
      type: 'radio',
      label: 'Só Volta',
      value: 'Só Volta',
      checked: volta
    });

    alert.addInput({
      type: 'radio',
      label: 'Ida e Volta',
      value: 'Ida e Volta',
      checked: idaVolta
    });

    alert.addButton({
      text: 'Ok',
      handler: data => {
        console.log('Radio data:', data);
        
        if (data != null) {
          if (item.presencaSazonal != data) {

            this.model.presencaSazonal = data;

          }
        }

      }
    });
    alert.present();
  }


  diasPadroes() {

    if (this.key == null && this.model.diasSazonais == null) {
      this.model.diasSazonais = [];
    }

    let alert = this.alerCtrl.create();
    alert.setTitle('Escolher dias padrões');

    let segunda = false;
    let terca = false;
    let quarta = false;
    let quinta = false;
    let sexta = false;
    

    if (this.model.diasSazonais != null) {
      if (this.model.diasSazonais.indexOf('Segunda-Feira') > -1) {
        segunda = true;
      }
      if (this.model.diasSazonais.indexOf('Terça-Feira') > -1) {
        terca = true;
      } if (this.model.diasSazonais.indexOf('Quarta-Feira') > -1) {
        quarta = true;
      } if (this.model.diasSazonais.indexOf('Quinta-Feira') > -1) {
        quinta = true;
      } if (this.model.diasSazonais.indexOf('Sexta-Feira') > -1) {
        sexta = true;
      }
    }

    alert.addInput({
      type: 'checkbox',
      label: this.weekdays[1],
      value: this.weekdays[1],
      checked: segunda,


    });

    alert.addInput({
      type: 'checkbox',
      label: this.weekdays[2],
      value: this.weekdays[2],
      checked: terca
    });
    alert.addInput({
      type: 'checkbox',
      label: this.weekdays[3],
      value: this.weekdays[3],
      checked: quarta
    });
    alert.addInput({
      type: 'checkbox',
      label: this.weekdays[4],
      value: this.weekdays[4],
      checked: quinta
    });
    alert.addInput({
      type: 'checkbox',
      label: this.weekdays[5],
      value: this.weekdays[5],
      checked: sexta
    });

    alert.addButton({
      text: 'Ok',
      handler: data => {
        console.log('Radio data:', data);
        this.model.diasSazonais = data;
      }
    });
    alert.present();
  }


  save() {



    this.model.presenca = this.model.presencaPadrao;
    this.model.mudancaPresenca = false;

    this.saveContact();

    this.storage.set("turmaSelecionada", this.model.turma.trim());
    
    this.toast.create({ message: 'Aluno ' + this.model.name + ' salvo.', duration: 1500, position: 'botton' }).present();
    this.navCtrl.pop();
    this.util.mostrarLoading();


  }

  private saveContact() {
    
    if (this.key) {
      return this.contactProvider.update(this.key, this.model);
    } else {
      this.model.embarque = false;
      this.model.tipo = "aluno";
      /* this.model.visivel = true; */
      return this.contactProvider.insert(this.model);
    }
  }

}