webpackJsonp([6],{

/***/ 109:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_contact_contact__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_turma_turma__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_config_config__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_util_util__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var ListPage = /** @class */ (function () {
    function ListPage(menuCtrl, app, plat, util, configProvider, storage, navCtrl, contactProvider, alerCtrl, turmaProvider, navParams, toast) {
        this.menuCtrl = menuCtrl;
        this.app = app;
        this.plat = plat;
        this.util = util;
        this.configProvider = configProvider;
        this.storage = storage;
        this.navCtrl = navCtrl;
        this.contactProvider = contactProvider;
        this.alerCtrl = alerCtrl;
        this.turmaProvider = turmaProvider;
        this.navParams = navParams;
        this.toast = toast;
        this.currentDate = new Date();
        this.weekdays = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
        this.dia = this.weekdays[this.currentDate.getDay()];
    }
    ListPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.storage.ready().then(function () {
            _this.turmaProvider.getAll()
                .then(function (result) {
                _this.listaTurmas = result.filter(function (x) { return (x.turma.tipo == "turma"); });
                if (_this.listaTurmas.length == 0) {
                    _this.mostrarTurmas = false;
                }
                else {
                    _this.mostrarTurmas = true;
                }
            });
            _this.storage.get("turmaSelecionada").then(function (val) {
                _this.turmaSelecionada = val;
            });
            _this.contactProvider.getAll()
                .then(function (result) {
                _this.contacts = result.filter(function (x) { return (x.contact.tipo == "aluno" && (x.contact.turma.indexOf(_this.turmaSelecionada) > 1 || x.contact.turma.match(_this.turmaSelecionada))); });
                _this.contacts = _this.contacts.filter(function (x) { return (((x.contact.diasSazonais.indexOf(_this.dia.toString()) > -1) && !(x.contact.presenca.match("Não Irá"))) ||
                    ((x.contact.presenca.match("Ida") || x.contact.presenca.match("Volta")) && (!(x.contact.presencaPadrao.match("Sazonalmente")) || x.contact.mudancaPresenca == true))); });
                _this.contacts.forEach(function (aluno) {
                    if (aluno.contact.mudancaPresenca == false) {
                        if (aluno.contact.presencaPadrao.match("Sazonalmente") && aluno.contact.diasSazonais.indexOf(_this.dia.toString()) > -1) {
                            aluno.contact.presenca = aluno.contact.presencaSazonal;
                        }
                        else if (aluno.contact.presencaPadrao.match("Sazonalmente") && !(aluno.contact.diasSazonais.indexOf(_this.dia.toString()) > -1)) {
                            aluno.contact.presenca = "Não Irá - Esse dia não está cadastrado para este aluno!";
                        }
                    }
                });
                _this.indefinidos = _this.contacts.filter(function (x) { return (x.contact.embarque == false); });
                _this.definidos = _this.contacts.filter(function (x) { return (x.contact.embarque == true); });
                _this.contatosDefinidos = _this.definidos;
                _this.contatosIndefinidos = _this.indefinidos;
                if (_this.contatosDefinidos.length == 0) {
                    _this.mostrarMsgConcluidos = true;
                }
                else {
                    _this.mostrarMsgConcluidos = false;
                }
                if (_this.contatosIndefinidos.length == 0) {
                    _this.mostrarMsgPendentes = true;
                }
                else {
                    _this.mostrarMsgPendentes = false;
                }
                if (_this.contacts.length == 0) {
                    _this.mostrarMsgAlunos = true;
                }
                else {
                    _this.mostrarMsgAlunos = false;
                }
            });
            _this.configProvider.getAll()
                .then(function (result) {
                _this.configs = result.filter(function (x) { return (x.config.tipo == "config" && x.config.name == "Página de Entradas"); });
                _this.configs.forEach(function (x) {
                    _this.ativo = x.config.ativo;
                });
            });
        });
        this.util.esconderLoading();
    };
    ListPage.prototype.recarregarPagina = function () {
        this.ionViewDidEnter();
    };
    ListPage.prototype.save = function (item, contato) {
        var _this = this;
        this.model = contato;
        this.key = item.key;
        var confirm = this.alerCtrl.create({
            title: 'ATENÇÃO',
            message: 'Deseja mesmo mudar a entrada do aluno ' + item.contact.name + '?',
            buttons: [
                {
                    text: 'Não',
                    handler: function () {
                        _this.ionViewDidEnter();
                    }
                },
                {
                    text: 'Sim',
                    handler: function () {
                        _this.model.embarque = !_this.model.embarque;
                        _this.util.mostrarLoading();
                        _this.saveContact();
                        if (_this.model.embarque == true) {
                            var index = _this.model.name.indexOf(' ');
                            if (index > -1) {
                                _this.toast.create({ message: 'Entrada atribuída para ' + _this.model.name.substring(0, index), duration: 3000, position: 'botton' }).present();
                            }
                            else {
                                _this.toast.create({ message: 'Entrada atribuída para ' + _this.model.name, duration: 3000, position: 'botton' }).present();
                            }
                        }
                        else {
                            var index = _this.model.name.indexOf(' ');
                            if (index > -1) {
                                _this.toast.create({ message: 'Entrada removida para ' + _this.model.name.substring(0, index), duration: 3000, position: 'botton' }).present();
                            }
                            else {
                                _this.toast.create({ message: 'Entrada removida para ' + _this.model.name, duration: 3000, position: 'botton' }).present();
                            }
                        }
                        _this.ionViewDidEnter();
                    }
                }
            ],
        });
        confirm.present();
    };
    ListPage.prototype.mostrarPresenca = function (item) {
        if (item.contact.mudancaPresenca == false) {
            if (item.contact.presencaPadrao.match("Sazonalmente") && item.contact.diasSazonais.indexOf(this.dia.toString()) > -1) {
                item.contact.presenca = item.contact.presencaSazonal;
            }
        }
        var alert = this.alerCtrl.create({
            title: item.contact.name,
            message: 'Presença para este dia: ' + item.contact.presenca,
            buttons: ['Ok']
        });
        alert.present();
    };
    ListPage.prototype.saveContact = function () {
        if (this.key) {
            return this.contactProvider.update(this.key, this.model);
        }
        else {
            return this.contactProvider.insert(this.model);
        }
    };
    ListPage.prototype.filterItems = function (ev) {
        var val = ev.target.value;
        if (val && val.trim() !== '') {
            this.contatosDefinidos = this.definidos.filter(function (item) {
                return item.contact.name.toLowerCase().includes(val.toLowerCase());
            });
            this.contatosIndefinidos = this.indefinidos.filter(function (item) {
                return item.contact.name.toLowerCase().includes(val.toLowerCase());
            });
        }
        else {
            this.contatosDefinidos = this.definidos;
            this.contatosIndefinidos = this.indefinidos;
        }
    };
    ListPage.prototype.mudarTurma = function () {
        //this.turmaProvider.updateSelecionada(this.turmaSelecionada);
        this.storage.set('turmaSelecionada', this.turmaSelecionada);
        this.ionViewDidEnter();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('content'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */])
    ], ListPage.prototype, "nav", void 0);
    ListPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-list',template:/*ion-inline-start:"C:\Dsv\dsv-git\RotasMobile\src\pages\list\list.html"*/'<ion-header>\n\n  <ion-toolbar color="uceff" #content>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>\n\n      <ion-grid>\n\n        <ion-row>\n\n          <ion-col class="titulo">Entradas</ion-col>\n\n          <ion-col>\n\n            <img align="right" class="title-image" src="src=../../assets/imgs/logo.png" />\n\n          </ion-col>\n\n        </ion-row>\n\n      </ion-grid>\n\n    </ion-title>\n\n  </ion-toolbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n\n\n  <ion-card *ngIf="ativo==true && mostrarMsgAlunos == false">\n\n    <ion-card-content align="center">\n\n      <h2>\n\n        <strong>Dicas</strong>\n\n      </h2>\n\n      Lista de alunos que têm presença para hoje, {{dia}}\n\n      <br>\n\n      <br> Clique no aluno para ver sua presença atual!\n\n      <br>\n\n      <br> Para excluir todas as entradas, volte para a Home do aplicativo e clique em "Restaurar Entradas".\n\n    </ion-card-content>\n\n  </ion-card>\n\n\n\n\n\n  <ion-list *ngIf="mostrarTurmas == true">\n\n    <ion-item>\n\n      <ion-label>Escolha o grupo de alunos</ion-label>\n\n      <ion-select interface="popover" [(ngModel)]="turmaSelecionada" (ionChange)="mudarTurma()">\n\n        <ion-option value="{{item.turma.nomeTurma}}" *ngFor="let item of listaTurmas">{{item.turma.nomeTurma}}</ion-option>\n\n      </ion-select>\n\n    </ion-item>\n\n  </ion-list>\n\n\n\n  <ion-searchbar *ngIf="mostrarMsgAlunos == false" placeholder="Pesquisar Aluno" showCancelButton color="danger" (ionInput)="filterItems($event)"></ion-searchbar>\n\n\n\n  <ion-list *ngIf="mostrarMsgAlunos == false">\n\n    <ion-item-group>\n\n      <ion-item-divider color="uceff">Pendentes</ion-item-divider>\n\n      <ion-grid *ngIf="mostrarMsgPendentes == false">\n\n        <ion-row *ngFor="let item of contatosIndefinidos">\n\n          <ion-col col-1 *ngIf="item.contact.presenca.match(\'Só Ida\')">\n\n            <ion-icon class="ida" small name="return-right"></ion-icon>\n\n          </ion-col>\n\n          <ion-col col-1 *ngIf="item.contact.presenca.match(\'Só Volta\')">\n\n            <ion-icon class="volta" small name="return-left"></ion-icon>\n\n          </ion-col>\n\n          <ion-col col-1 *ngIf="item.contact.presenca.match(\'Ida e Volta\')">\n\n            <ion-icon class="idaVolta" name="swap"></ion-icon>\n\n          </ion-col>\n\n\n\n          <ion-col col-11>\n\n            <ion-item ng-model="model" (click)="mostrarPresenca(item)">\n\n              <ion-label>{{item.contact.name}}</ion-label>\n\n              <ion-toggle color="laranja" class="botao" *ngIf="item.contact.embarque == true" value="item.contact.embarque" checked="true"\n\n                (ionChange)="save(item, item.contact)"></ion-toggle>\n\n              <ion-toggle class="botao" *ngIf="item.contact.embarque != true" value="item.contact.embarque" checked="false" (ionChange)="save(item, item.contact)"></ion-toggle>\n\n            </ion-item>\n\n          </ion-col>\n\n        </ion-row>\n\n        <br>\n\n      </ion-grid>\n\n    </ion-item-group>\n\n    <ion-card *ngIf="mostrarMsgPendentes == true">\n\n      <ion-card-content align="center">\n\n        <h2>Nenhum aluno pendente!</h2>\n\n      </ion-card-content>\n\n    </ion-card>\n\n  </ion-list>\n\n\n\n\n\n\n\n  <ion-list *ngIf="mostrarMsgAlunos == false">\n\n    <ion-item-group>\n\n      <ion-item-divider color="laranja">Concluídos</ion-item-divider>\n\n      <ion-grid *ngIf="mostrarMsgConcluidos == false">\n\n        <ion-row *ngFor="let item of contatosDefinidos">\n\n          <ion-col col-1 *ngIf="item.contact.presenca.match(\'Só Ida\')">\n\n            <ion-icon class="ida" small name="return-right"></ion-icon>\n\n          </ion-col>\n\n          <ion-col col-1 *ngIf="item.contact.presenca.match(\'Só Volta\')">\n\n            <ion-icon class="volta" small name="return-left"></ion-icon>\n\n          </ion-col>\n\n          <ion-col col-1 *ngIf="item.contact.presenca.match(\'Ida e Volta\')">\n\n            <ion-icon class="idaVolta" name="swap"></ion-icon>\n\n          </ion-col>\n\n\n\n          <ion-col col-11>\n\n\n\n            <ion-item ng-model="model" (click)="mostrarPresenca(item)">\n\n              <ion-label>{{item.contact.name}}</ion-label>\n\n\n\n              <ion-toggle color="laranja" class="botao" *ngIf="item.contact.embarque == true" value="item.contact.embarque" checked="true"\n\n                (ionChange)="save(item, item.contact)"></ion-toggle>\n\n              <ion-toggle class="botao" *ngIf="item.contact.embarque != true" value="item.contact.embarque" checked="false" (ionChange)="save(item, item.contact)"></ion-toggle>\n\n            </ion-item>\n\n          </ion-col>\n\n        </ion-row>\n\n        <br>\n\n        <br>\n\n        <br>\n\n      </ion-grid>\n\n      <ion-card *ngIf="mostrarMsgConcluidos == true">\n\n        <ion-card-content align="center">\n\n          <h2>Nenhum aluno concluído!</h2>\n\n        </ion-card-content>\n\n      </ion-card>\n\n    </ion-item-group>\n\n\n\n  </ion-list>\n\n\n\n  <ion-item-group *ngIf="mostrarMsgAlunos == true && mostrarTurmas == true">\n\n    <br>\n\n    <br>\n\n    <br>\n\n    <ion-card>\n\n      <ion-card-content align="center">\n\n        <h2>\n\n          <strong>Nenhum aluno encontrado!</strong>\n\n          <br>\n\n        </h2>\n\n        <p>Verifique se um grupo está selecionado e que este contém alunos cadastrados com presença para hoje.</p>\n\n      </ion-card-content>\n\n    </ion-card>\n\n  </ion-item-group>\n\n\n\n  <ion-item-group *ngIf="mostrarTurmas == false">\n\n      <br>\n\n      <br>\n\n      <br>\n\n      <ion-card>\n\n        <ion-card-content align="center">\n\n          <h2>\n\n            <strong>Nenhum grupo Cadastrado!</strong>\n\n            <br>\n\n            <br>\n\n          </h2>\n\n          <p>Para fazer o uso adequado do aplicativo, cadastre um grupo em Menu / Grupos.</p>\n\n        </ion-card-content>\n\n      </ion-card>\n\n    </ion-item-group>\n\n\n\n</ion-content>'/*ion-inline-end:"C:\Dsv\dsv-git\RotasMobile\src\pages\list\list.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* MenuController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */], __WEBPACK_IMPORTED_MODULE_6__providers_util_util__["a" /* UtilProvider */], __WEBPACK_IMPORTED_MODULE_5__providers_config_config__["b" /* ConfigProvider */], __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_contact_contact__["b" /* ContactProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_3__providers_turma_turma__["b" /* TurmaProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ToastController */]])
    ], ListPage);
    return ListPage;
}());

//# sourceMappingURL=list.js.map

/***/ }),

/***/ 110:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CadastrosPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_contact_contact__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__edit_contact_edit_contact__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__edit_presenca_edit_presenca__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_turma_turma__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_storage__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_config_config__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__cadastro_turmas_cadastro_turmas__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_util_util__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var CadastrosPage = /** @class */ (function () {
    function CadastrosPage(util, app, configProvider, storage, navCtrl, contactProvider, navParams, toast, alerCtrl, turmaProvider) {
        this.util = util;
        this.app = app;
        this.configProvider = configProvider;
        this.storage = storage;
        this.navCtrl = navCtrl;
        this.contactProvider = contactProvider;
        this.navParams = navParams;
        this.toast = toast;
        this.alerCtrl = alerCtrl;
        this.turmaProvider = turmaProvider;
        this.currentDate = new Date();
        this.weekdays = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
        this.dia = this.weekdays[this.currentDate.getDay()];
        this.verificadorNaoIra = false;
    }
    CadastrosPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.contatos = [];
        this.storage.ready().then(function () {
            _this.turmaProvider.getAll()
                .then(function (result) {
                _this.listaTurmas = result.filter(function (x) { return (x.turma.tipo == "turma"); });
                if (_this.listaTurmas.length == 0) {
                    _this.mostrarTurmas = false;
                }
                else {
                    _this.mostrarTurmas = true;
                }
            });
            _this.storage.get("turmaSelecionada").then(function (val) {
                _this.turmaSelecionada = val;
            });
            _this.contactProvider.getAll()
                .then(function (result) {
                _this.contacts = result.filter(function (x) { return (x.contact.tipo == "aluno" && (x.contact.turma.indexOf(_this.turmaSelecionada) > 1 || x.contact.turma.match(_this.turmaSelecionada))); });
                _this.contatos = _this.contacts;
                _this.contatos.forEach(function (aluno) {
                    if (aluno.contact.mudancaPresenca == false) {
                        if (aluno.contact.presencaPadrao.match("Sazonalmente") && aluno.contact.diasSazonais.indexOf(_this.dia.toString()) > -1) {
                            aluno.contact.presenca = aluno.contact.presencaSazonal;
                        }
                        else if (aluno.contact.presencaPadrao.match("Sazonalmente") && !(aluno.contact.diasSazonais.indexOf(_this.dia.toString()) > -1)) {
                            aluno.contact.presenca = "Não Irá - Esse dia não está cadastrado para este aluno!";
                        }
                    }
                });
                if (_this.contatos == [] || _this.contatos.length == 0) {
                    _this.mostrarMsgNenhumCadastro = true;
                }
                else {
                    _this.mostrarMsgNenhumCadastro = false;
                }
            });
            _this.configProvider.getAll()
                .then(function (result) {
                _this.configs = result.filter(function (x) { return (x.config.tipo == "config" && x.config.name == "Página de Cadastros"); });
                _this.configs.forEach(function (x) {
                    _this.ativo = x.config.ativo;
                });
            });
        });
        this.util.esconderLoading();
    };
    CadastrosPage.prototype.ionViewWillLeave = function () {
        this.contatos = [];
    };
    CadastrosPage.prototype.ionViewDidLoad = function () {
        this.contacts = [];
    };
    CadastrosPage.prototype.adicionarAluno = function () {
        var _this = this;
        var nav = this.navCtrl;
        this.turmaProvider.getAll()
            .then(function (result) {
            _this.listaTurmas = result.filter(function (x) { return (x.turma.tipo == "turma"); });
            if (_this.listaTurmas.length == 0) {
                _this.cadastrarTurma();
            }
            else {
                var aluno = new __WEBPACK_IMPORTED_MODULE_2__providers_contact_contact__["a" /* Contact */]();
                aluno.turma = _this.turmaSelecionada;
                nav.push(__WEBPACK_IMPORTED_MODULE_3__edit_contact_edit_contact__["a" /* EditContactPage */], { key: null, contact: aluno });
            }
        });
    };
    CadastrosPage.prototype.cadastrarTurma = function () {
        var _this = this;
        var alert = this.alerCtrl.create({
            title: 'ATENÇÃO!',
            subTitle: '<br> Cadastre um grupo!<br><br> (Ex.: Matutino, Vespertino, Noturno...)<br><br> Ele é necessário para o cadastro de alunos e utilização desse aplicativo! <br><br> Crie sempre grupos com <strong>nomes diferentes</strong>!',
            buttons: [
                {
                    text: 'Cadastrar',
                    handler: function () {
                        _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__cadastro_turmas_cadastro_turmas__["a" /* CadastroTurmasPage */]);
                    }
                }
            ]
        });
        alert.present();
    };
    CadastrosPage.prototype.editContact = function (item) {
        var nav = this.navCtrl;
        nav.push(__WEBPACK_IMPORTED_MODULE_3__edit_contact_edit_contact__["a" /* EditContactPage */], { key: item.key, contact: item.contact });
    };
    CadastrosPage.prototype.editPresenca = function (item) {
        var nav = this.navCtrl;
        nav.push(__WEBPACK_IMPORTED_MODULE_4__edit_presenca_edit_presenca__["a" /* EditPresencaPage */], { key: item.key, contact: item.contact });
    };
    CadastrosPage.prototype.removeContact = function (item) {
        var _this = this;
        this.contactProvider.remove(item.key)
            .then(function () {
            // Removendo do array de items
            var index = _this.contacts.indexOf(item);
            _this.contacts.splice(index, 1);
            _this.toast.create({ message: 'Aluno ' + item.contact.name + ' removido.', duration: 1500, position: 'botton' }).present();
            _this.util.mostrarLoading();
            _this.ionViewDidEnter();
        });
    };
    CadastrosPage.prototype.doConfirm = function (item) {
        var _this = this;
        var confirm = this.alerCtrl.create({
            title: 'ATENÇÃO',
            message: 'Deseja mesmo remover o aluno ' + item.contact.name + '?',
            buttons: [
                {
                    text: 'Não',
                    handler: function () {
                    }
                },
                {
                    text: 'Sim',
                    handler: function () {
                        _this.removeContact(item);
                    }
                }
            ]
        });
        confirm.present();
    };
    CadastrosPage.prototype.mostrarPresenca = function (item) {
        if (item.contact.mudancaPresenca == false) {
            if (item.contact.presencaPadrao.match("Sazonalmente") && item.contact.diasSazonais.indexOf(this.dia.toString()) > -1) {
                item.contact.presenca = item.contact.presencaSazonal;
            }
            else if (item.contact.presencaPadrao.match("Sazonalmente") && !(item.contact.diasSazonais.indexOf(this.dia.toString()) > -1)) {
                item.contact.presenca = "Não Irá - " + this.dia + " não está cadastrado para este aluno!";
            }
        }
        var alert = this.alerCtrl.create({
            title: item.contact.name,
            message: 'Presença para hoje, ' + this.dia + ': <br><br><h5 align="center">' + item.contact.presenca + "</h5>",
            buttons: ['Ok']
        });
        alert.present();
    };
    CadastrosPage.prototype.filterItems = function (ev) {
        var val = ev.target.value;
        if (val && val.trim() !== '') {
            this.contatos = this.contacts.filter(function (item) {
                return item.contact.name.toLowerCase().includes(val.toLowerCase());
            });
        }
        else {
            this.contatos = this.contacts;
        }
    };
    CadastrosPage.prototype.mudarTurma = function () {
        this.contacts = [];
        this.storage.set('turmaSelecionada', this.turmaSelecionada);
        this.ionViewDidEnter();
    };
    CadastrosPage.prototype.detalhes = function (aluno) {
        var semEmail = false;
        if (aluno.email == null || aluno.email == "") {
            semEmail = true;
            aluno.email = 'Não informado!';
        }
        var alert = this.alerCtrl.create({
            title: aluno.name,
            subTitle: '<br> Telefone: ' + aluno.phone + '<br><br>' + 'Curso: ' + aluno.curso + '<br><br>' + 'Grupo: ' + aluno.turma + '<br><br>' + 'Email: ' + aluno.email,
            buttons: ['Fechar']
        });
        alert.present();
        if (semEmail == true) {
            aluno.email = "";
        }
    };
    CadastrosPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-cadastros',template:/*ion-inline-start:"C:\Dsv\dsv-git\RotasMobile\src\pages\cadastros\cadastros.html"*/'<ion-header>\n\n  <ion-toolbar color="uceff" hideBackButton="false">\n\n    <button ion-button show menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>\n\n      <ion-grid>\n\n        <ion-row>\n\n          <ion-col class="titulo">Alunos</ion-col>\n\n          <ion-col>\n\n            <img align="right" class="title-image" src="src=../../assets/imgs/logo.png" />\n\n          </ion-col>\n\n        </ion-row>\n\n      </ion-grid>\n\n    </ion-title>\n\n  </ion-toolbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n\n\n  <ion-card *ngIf="ativo==true && mostrarMsgNenhumCadastro == false">\n\n    <ion-card-content align="center">\n\n      <h2>\n\n        <strong>Dicas</strong>\n\n      </h2>\n\n      Arraste o aluno para a direita para mostrar as opções!\n\n      <br>\n\n      <br>Arraste o aluno para a esquerda para detalhá-lo!\n\n      <br>\n\n      <br> Clique no aluno para ver sua presença atual!\n\n    </ion-card-content>\n\n  </ion-card>\n\n\n\n  <ion-list *ngIf="mostrarTurmas == true">\n\n    <ion-item>\n\n      <ion-label>Escolha o grupo de alunos</ion-label>\n\n      <ion-select interface="popover" [(ngModel)]="turmaSelecionada" (ionChange)="mudarTurma()">\n\n        <ion-option class="turma" value="{{item.turma.nomeTurma}}" *ngFor="let item of listaTurmas">{{item.turma.nomeTurma}}</ion-option>\n\n      </ion-select>\n\n    </ion-item>\n\n  </ion-list>\n\n\n\n  <ion-searchbar *ngIf="mostrarMsgNenhumCadastro == false" placeholder="Pesquisar" showCancelButton color="danger" (ionInput)="filterItems($event)"></ion-searchbar>\n\n  \n\n  \n\n  <br>\n\n  <ion-list>\n\n    <ion-item-sliding *ngFor="let item of contatos">\n\n      <ion-item (click)="mostrarPresenca(item)">\n\n        <ion-grid>\n\n          <ion-row>\n\n            <ion-col col-2 *ngIf="item.contact.presenca.match(\'Só Ida\')">\n\n              <ion-icon class="ida" small name="return-right"></ion-icon>\n\n            </ion-col>\n\n            <ion-col col-2 *ngIf="item.contact.presenca.match(\'Só Volta\')">\n\n              <ion-icon class="volta" small name="return-left"></ion-icon>\n\n            </ion-col>\n\n            <ion-col col-2 *ngIf="item.contact.presenca.match(\'Ida e Volta\')">\n\n              <ion-icon class="idaVolta" name="swap"></ion-icon>\n\n            </ion-col>\n\n            <ion-col col-2 *ngIf="item.contact.presenca.match(\'Não Irá\')">\n\n              <ion-icon class="nao" name="close-circle"></ion-icon>\n\n            </ion-col>\n\n            <ion-col col-10>\n\n              <h2>{{item.contact.name}} </h2>\n\n              <p style="overflow: hidden;">{{item.contact.curso}}</p>\n\n            </ion-col>\n\n          </ion-row>\n\n        </ion-grid>\n\n      </ion-item>\n\n\n\n\n\n      <ion-item-options side="left">\n\n\n\n        <button ion-button color="laranja" icon-start (click)="editPresenca(item)">\n\n          <ion-icon name="checkmark-circle-outline"></ion-icon>\n\n          Presença\n\n        </button>\n\n\n\n        <button ion-button outline color="laranja" icon-start (click)="editContact(item)">\n\n          <ion-icon name="person"></ion-icon>\n\n          Editar\n\n        </button>\n\n\n\n        <button ion-button color="uceff" icon-start (click)="doConfirm(item)">\n\n          <ion-icon name="trash"></ion-icon>\n\n          Deletar\n\n        </button>\n\n\n\n\n\n      </ion-item-options>\n\n      <ion-item-options side="right">\n\n        <button ion-button color="laranja" icon-start (click)="detalhes(item.contact)">\n\n          <ion-icon name="eye"></ion-icon>\n\n          Detalhes\n\n        </button>\n\n      </ion-item-options>\n\n    </ion-item-sliding>\n\n  </ion-list>\n\n\n\n  <ion-card *ngIf="mostrarMsgNenhumCadastro == true && mostrarTurmas == true">\n\n    <ion-card-content align="center">\n\n      <h2>\n\n        <strong>Nenhum aluno encontrado!</strong>\n\n      </h2>\n\n      <br>\n\n      <p>Verifique se o grupo contendo os alunos está selecionado.</p>\n\n      <p>Caso queira cadastrar um aluno, clique no botão localizado canto inferior direito.</p>\n\n    </ion-card-content>\n\n  </ion-card>\n\n\n\n  <ion-item-group *ngIf="mostrarTurmas == false">\n\n      <br>\n\n      <ion-card>\n\n        <ion-card-content align="center">\n\n          <h2>\n\n            <strong>Nenhum grupo Cadastrado!</strong>\n\n            <br>\n\n            <br>\n\n          </h2>\n\n          <p>Para fazer o uso adequado do aplicativo, cadastre um grupo em Menu / Grupos.</p>\n\n        </ion-card-content>\n\n      </ion-card>\n\n    </ion-item-group>\n\n\n\n\n\n  <br>\n\n  <br>\n\n  <br>\n\n\n\n  <ion-fab right bottom (click)="adicionarAluno()">\n\n    <button ion-fab color="laranja">\n\n      <ion-icon name="add"></ion-icon>\n\n    </button>\n\n  </ion-fab>\n\n\n\n</ion-content>'/*ion-inline-end:"C:\Dsv\dsv-git\RotasMobile\src\pages\cadastros\cadastros.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_9__providers_util_util__["a" /* UtilProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */], __WEBPACK_IMPORTED_MODULE_7__providers_config_config__["b" /* ConfigProvider */], __WEBPACK_IMPORTED_MODULE_6__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_contact_contact__["b" /* ContactProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_5__providers_turma_turma__["b" /* TurmaProvider */]])
    ], CadastrosPage);
    return CadastrosPage;
}());

//# sourceMappingURL=cadastros.js.map

/***/ }),

/***/ 111:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConfigPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__turmas_turmas__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_storage__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_config_config__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_util_util__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/**
 * Generated class for the ConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ConfigPage = /** @class */ (function () {
    function ConfigPage(util, loadingCtrl, alerCtrl, configProvider, storage, navCtrl, navParams) {
        var _this = this;
        this.util = util;
        this.loadingCtrl = loadingCtrl;
        this.alerCtrl = alerCtrl;
        this.configProvider = configProvider;
        this.storage = storage;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        storage.get("quantidadeConfig").then(function (val) {
            _this.quantidadeConfig = val;
        });
    }
    ConfigPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.storage.ready().then(function () {
            _this.carregarConfigs();
        });
        this.util.esconderLoading();
    };
    ConfigPage.prototype.carregarConfigs = function () {
        var _this = this;
        this.configProvider.getAll()
            .then(function (result) {
            _this.configs = result.filter(function (x) { return (x.config.tipo == "config"); });
        });
    };
    ConfigPage.prototype.acessar = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__turmas_turmas__["a" /* TurmasPage */]);
        this.util.mostrarLoading();
    };
    ConfigPage.prototype.mudarConfig = function (item) {
        item.config.ativo = !item.config.ativo;
        return this.configProvider.update(item.key, item.config);
    };
    ConfigPage.prototype.mostrarFuncao = function (item) {
        var alert = this.alerCtrl.create({
            title: item.config.name,
            message: item.config.descricao,
            buttons: ['Ok']
        });
        alert.present();
    };
    ConfigPage.prototype.chavesPadroes = function (item) {
        this.key = ('Config cod.: ' + (this.quantidadeConfig + 1));
        item.ativo = true;
        item.tipo = "config";
    };
    ConfigPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-config',template:/*ion-inline-start:"C:\Dsv\dsv-git\RotasMobile\src\pages\config\config.html"*/'<ion-header>\n\n  <ion-toolbar color="uceff">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>\n\n      <ion-grid>\n\n        <ion-row>\n\n          <ion-col class="titulo">Configurações</ion-col>\n\n          <ion-col>\n\n            <img align="right" class="title-image" src="src=../../assets/imgs/logo.png" />\n\n          </ion-col>\n\n        </ion-row>\n\n      </ion-grid>\n\n    </ion-title>\n\n  </ion-toolbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content padding>\n\n  <ion-card>\n\n    <ion-card-content>\n\n      <h2>Configurar Grupos</h2>\n\n      <br>\n\n      <p>Cadastre Grupos de alunos que utilizam esse ônibus ao passar do dia. Exemplo: O matutino, verspertino e noturno.</p>\n\n      <br>\n\n      <button color="laranja" ion-button block (click)="acessar()">Grupos Cadastrados</button>\n\n    </ion-card-content>\n\n  </ion-card>\n\n\n\n  <ion-card>\n\n    <ion-card-content>\n\n      <h2>Ativar ou Desativar Dicas</h2>\n\n      <br>\n\n      <p>Ative ou Desative as dicas clicando em seu botão.\n\n        <br>Clique em cima de uma dica para ver a sua função!</p>\n\n      <br>\n\n      <ion-list>\n\n        <ion-item *ngFor="let item of configs" (click)="mostrarFuncao(item)">\n\n\n\n          <ion-label>{{item.config.name}}</ion-label>\n\n          <ion-toggle color="laranja" value="PaginaCadastro" class="botao" checked="{{item.config.ativo}}" (ionChange)="mudarConfig(item)"></ion-toggle>\n\n\n\n        </ion-item>\n\n      </ion-list>\n\n    </ion-card-content>\n\n  </ion-card>\n\n</ion-content>'/*ion-inline-end:"C:\Dsv\dsv-git\RotasMobile\src\pages\config\config.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5__providers_util_util__["a" /* UtilProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_4__providers_config_config__["b" /* ConfigProvider */], __WEBPACK_IMPORTED_MODULE_3__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */]])
    ], ConfigPage);
    return ConfigPage;
}());

//# sourceMappingURL=config.js.map

/***/ }),

/***/ 112:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SobrePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the SobrePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var SobrePage = /** @class */ (function () {
    function SobrePage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    SobrePage.prototype.ionViewDidLoad = function () {
    };
    SobrePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-sobre',template:/*ion-inline-start:"C:\Dsv\dsv-git\RotasMobile\src\pages\sobre\sobre.html"*/'<ion-header>\n\n  <ion-toolbar color="uceff">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>\n\n      <ion-grid>\n\n        <ion-row>\n\n          <ion-col class="titulo">Sobre</ion-col>\n\n        </ion-row>\n\n      </ion-grid>\n\n    </ion-title>\n\n  </ion-toolbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content padding>\n\n\n\n  <ion-card>\n\n    <ion-card-content>\n\n      <img class="logo" src="src=../../assets/imgs/logo_dark.png" />\n\n      O Programa Rotas é destinado a auxiliar financeiramente os acadêmicos que residem fora de Itapiranga e/ou de Chapecó, em cidades pertencentes ao Programa, que necessitam de transporte coletivo em seu deslocamento até a Instituição.\n\n      <br>\n\n      <br>Este aplicativo tem como objetivo auxiliar esse programa no gerenciamento dos presentes e ausentes em\n\n      um determinado ônibus!\n\n      <br>\n\n      <br> Aplicativo projetado e desenvolvido por acadêmicos do 4° semestre do curso de Gestão da Tecnologia da Informação:\n\n      <br>\n\n      <br> Sidnei Luiz Becker - Desenvolvimento\n\n      <br> Luis Felipe Royer - Design\n\n      <br> Maiquel Krügel - Documentação\n\n      <br> Pedro Henrique Schuster - Documentação\n\n      <br>\n\n      <br>\n\n      <br>Versão do App: 1.0.2 - 04/12/2018\n\n    </ion-card-content>\n\n  </ion-card>\n\n</ion-content>'/*ion-inline-end:"C:\Dsv\dsv-git\RotasMobile\src\pages\sobre\sobre.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */]])
    ], SobrePage);
    return SobrePage;
}());

//# sourceMappingURL=sobre.js.map

/***/ }),

/***/ 121:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 121;

/***/ }),

/***/ 163:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/cadastro-turmas/cadastro-turmas.module": [
		288,
		5
	],
	"../pages/cadastros/cadastros.module": [
		284,
		4
	],
	"../pages/config/config.module": [
		285,
		3
	],
	"../pages/edit-presenca/edit-presenca.module": [
		286,
		2
	],
	"../pages/sobre/sobre.module": [
		287,
		1
	],
	"../pages/turmas/turmas.module": [
		289,
		0
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 163;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 20:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UtilProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var UtilProvider = /** @class */ (function () {
    function UtilProvider(app, loadingCtrl, menuCtrl, alertCtrl, platform) {
        this.app = app;
        this.loadingCtrl = loadingCtrl;
        this.menuCtrl = menuCtrl;
        this.alertCtrl = alertCtrl;
        this.platform = platform;
    }
    UtilProvider.prototype.mostrarLoading = function () {
        if (!this.loading) {
            this.loading = this.loadingCtrl.create({
                content: 'Carregando ...',
                cssClass: 'loading'
            });
            this.loading.present();
        }
    };
    UtilProvider.prototype.esconderLoading = function () {
        if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('content'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */])
    ], UtilProvider.prototype, "nav", void 0);
    UtilProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* MenuController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */]])
    ], UtilProvider);
    return UtilProvider;
}());

//# sourceMappingURL=util.js.map

/***/ }),

/***/ 209:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_contact_contact__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__list_list__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_config_config__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__turmas_turmas__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_util_util__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var HomePage = /** @class */ (function () {
    function HomePage(util, storage, navCtrl, contactProvider, alerCtrl, navParams, toast) {
        this.util = util;
        this.storage = storage;
        this.navCtrl = navCtrl;
        this.contactProvider = contactProvider;
        this.alerCtrl = alerCtrl;
        this.navParams = navParams;
        this.toast = toast;
    }
    HomePage.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.storage.ready().then(function () {
            _this.storage.get("quantidadeConfig").then(function (val) {
                _this.quantidadeConfig = val;
            });
            _this.storage.get("cargaConfig").then(function (val) {
                _this.cargaConfig = val;
                if (_this.cargaConfig != true && !(_this.quantidadeConfig > 0)) {
                    _this.storage.ready().then(function () {
                        _this.cargaConfigs();
                        _this.storage.set("cargaConfig", true);
                    });
                }
            });
        });
    };
    HomePage.prototype.cadastrarTurma = function () {
        var _this = this;
        var alert = this.alerCtrl.create({
            title: 'ATENÇÃO!',
            subTitle: '<br> Cadastre uma turma!<br><br> (Ex.: Matutina, Vespertina, Noturna...)<br><br> Ela é necessaria para o cadastro de alunos e utilização desse aplicativo! <br><br> Crie sempre turmas com <strong>nomes diferentes</strong>!',
            buttons: [
                {
                    text: 'Cadastrar',
                    handler: function () {
                        _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__turmas_turmas__["a" /* TurmasPage */]);
                    }
                }
            ]
        });
        alert.present();
    };
    HomePage.prototype.cargaConfigs = function () {
        this.config = new __WEBPACK_IMPORTED_MODULE_5__providers_config_config__["a" /* Config */]();
        this.config.name = "Página de Cadastros";
        this.config.descricao = "Dicas localizadas na página dos alunos cadastrados. <br><br> Menu/Cadastro de Alunos";
        this.chavesPadroes(this.config);
        this.salvarConfig(this.key, this.config);
        this.config = new __WEBPACK_IMPORTED_MODULE_5__providers_config_config__["a" /* Config */]();
        this.config.name = "Página de Entradas";
        this.config.descricao = "Dicas localizadas na página de entradas/embarques dos alunos cadastrados para o dia atual. <br><br>Menu/Definir Entradas";
        this.chavesPadroes(this.config);
        this.salvarConfig(this.key, this.config);
        this.cargaConfig = true;
    };
    HomePage.prototype.chavesPadroes = function (item) {
        this.key = ('Config cod.: ' + (this.quantidadeConfig + 1));
        item.ativo = true;
        item.tipo = "config";
    };
    HomePage.prototype.salvarConfig = function (key, valor) {
        this.storage.set(key, valor);
        this.storage.set("quantidadeConfig", this.quantidadeConfig + 1);
        this.quantidadeConfig += 1;
    };
    HomePage.prototype.excluirEmbarques = function () {
        var _this = this;
        var confirm = this.alerCtrl.create({
            title: 'ATENÇÃO',
            message: 'Esse processo irá restaurar as presenças diárias para seu padrão e excluir todas as entradas!<br><br>' +
                'Aconselhável executar esse processo apenas quando não houver mais alunos pendentes.<br><br>' +
                'Deseja executá-lo agora?',
            buttons: [
                {
                    text: 'Não',
                    handler: function () {
                    }
                },
                {
                    text: 'Sim',
                    handler: function () {
                        _this.contactProvider.updateEmbarque();
                        _this.toast.create({ message: 'Entradas removidas e presenças restauradas para todos os alunos!', duration: 4000, position: 'botton' }).present();
                    }
                }
            ]
        });
        confirm.present();
    };
    HomePage.prototype.definirEmbarques = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__list_list__["a" /* ListPage */]);
        this.util.mostrarLoading();
    };
    HomePage.prototype.mudarTurma = function () {
        this.storage.set('turmaSelecionada', this.turmaSelecionada);
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"C:\Dsv\dsv-git\RotasMobile\src\pages\home\home.html"*/'<ion-header>\n\n  <ion-toolbar color="uceff" hideBackButton="false">\n\n    <button ion-button show menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>\n\n      <ion-grid>\n\n        <ion-row>\n\n          <ion-col class="tituloHeader">Home</ion-col>\n\n          <!-- <ion-col>\n\n            <img align="right" class="title-image" src="src=../../assets/imgs/logo.png" />\n\n          </ion-col> -->\n\n        </ion-row>\n\n      </ion-grid>\n\n    </ion-title>\n\n\n\n  </ion-toolbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <br>\n\n  <br>\n\n  <h1 class="titulo">Rotas Mobile</h1>\n\n  <br>\n\n  <img class="logo" src="src=../../assets/imgs/logo_dark.png">\n\n  <br>\n\n  <br>\n\n  <br>\n\n  <br>\n\n  <button class="botao" round ion-button (click)="definirEmbarques()">Definir Presenças</button>\n\n  <br>\n\n  <button class="botao2" round ion-button outline (click)="excluirEmbarques()">Restaurar Entradas</button>\n\n\n\n</ion-content>'/*ion-inline-end:"C:\Dsv\dsv-git\RotasMobile\src\pages\home\home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_7__providers_util_util__["a" /* UtilProvider */], __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_contact_contact__["b" /* ContactProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ToastController */]])
    ], HomePage);
    return HomePage;
}()); /*  */

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 210:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(233);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 23:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ContactProvider; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Contact; });
/* unused harmony export ContactList */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map__ = __webpack_require__(164);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(17);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



var ContactProvider = /** @class */ (function () {
    function ContactProvider(storage) {
        this.storage = storage;
    }
    ContactProvider.prototype.insert = function (contact) {
        var _this = this;
        this.getAll()
            .then(function (result) {
            _this.contacts = result.filter(function (x) { return (x.contact.tipo == "aluno"); });
            _this.storage.get("seq_alunos").then(function (val) {
                _this.seq = val;
                if (_this.seq == null) {
                    _this.seq = 0;
                }
                _this.storage.set("seq_alunos", _this.seq + 1);
                var key = ('Aluno cod.: ' + (_this.seq + 1));
                return _this.save(key, contact);
            });
        });
    };
    ContactProvider.prototype.update = function (key, contact) {
        return this.save(key, contact);
    };
    ContactProvider.prototype.updateEmbarque = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var contacts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        contacts = [];
                        return [4 /*yield*/, this.storage.forEach(function (value, key, iterationNumber) {
                                var contact = new ContactList();
                                contact.key = key;
                                contact.contact = value;
                                if (contact.contact.tipo == "aluno") {
                                    contact.contact.embarque = false;
                                    contact.contact.presenca = contact.contact.presencaPadrao;
                                    if (contact.contact.mudancaPresenca == true && contact.contact.presencaPadrao.match("Sazonalmente")) {
                                        contact.contact.presenca = contact.contact.presencaSazonal;
                                    }
                                    contact.contact.mudancaPresenca = false;
                                    contacts.push(contact);
                                    _this.save(key, value);
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContactProvider.prototype.updateTurma = function (nomeAntigo, nomeNovo) {
        var _this = this;
        var contacts = [];
        return this.storage.forEach(function (value, key, iterationNumber) {
            var contact = new ContactList();
            contact.key = key;
            contact.contact = value;
            if (contact.contact.tipo == "aluno") {
                if (contact.contact.turma.match(nomeAntigo)) {
                    contact.contact.turma = contact.contact.turma.replace(nomeAntigo, nomeNovo);
                }
                contacts.push(contact);
                _this.save(key, value);
            }
        })
            .then(function () {
            return Promise.resolve(contacts);
        })
            .catch(function (error) {
            return Promise.reject(error);
        });
    };
    ContactProvider.prototype.save = function (key, contact) {
        return this.storage.set(key, contact);
    };
    ContactProvider.prototype.remove = function (key) {
        return this.storage.remove(key);
    };
    ContactProvider.prototype.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contacts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        contacts = [];
                        return [4 /*yield*/, this.storage.forEach(function (value, key, iterationNumber) {
                                var contact = new ContactList();
                                contact.key = key;
                                contact.contact = value;
                                contacts.push(contact);
                            })
                                .then(function () {
                                return Promise.resolve(contacts);
                            })
                                .catch(function (error) {
                                return Promise.reject(error);
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContactProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */]])
    ], ContactProvider);
    return ContactProvider;
}());

var Contact = /** @class */ (function () {
    function Contact() {
        this.mudancaPresenca = false; //true quando a presenca foi mudada
    }
    return Contact;
}());

var ContactList = /** @class */ (function () {
    function ContactList() {
    }
    return ContactList;
}());

//# sourceMappingURL=contact.js.map

/***/ }),

/***/ 233:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(276);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_list_list__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_status_bar__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_splash_screen__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_cadastros_cadastros__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_edit_contact_edit_contact__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__providers_contact_contact__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__angular_common__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_storage__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_edit_presenca_edit_presenca__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_sobre_sobre__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__providers_turma_turma__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_config_config__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_turmas_turmas__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_cadastro_turmas_cadastro_turmas__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__providers_config_config__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__providers_util_util__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





















var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* RotasMobile */],
                __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_list_list__["a" /* ListPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_cadastros_cadastros__["a" /* CadastrosPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_edit_contact_edit_contact__["a" /* EditContactPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_edit_presenca_edit_presenca__["a" /* EditPresencaPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_sobre_sobre__["a" /* SobrePage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_config_config__["a" /* ConfigPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_turmas_turmas__["a" /* TurmasPage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_cadastro_turmas_cadastro_turmas__["a" /* CadastroTurmasPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["e" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* RotasMobile */], {}, {
                    links: [
                        { loadChildren: '../pages/cadastros/cadastros.module#CadastrosPageModule', name: 'CadastrosPage', segment: 'cadastros', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/config/config.module#ConfigPageModule', name: 'ConfigPage', segment: 'config', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/edit-presenca/edit-presenca.module#EditPresencaPageModule', name: 'EditPresencaPage', segment: 'edit-presenca', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/sobre/sobre.module#SobrePageModule', name: 'SobrePage', segment: 'sobre', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/cadastro-turmas/cadastro-turmas.module#CadastroTurmasPageModule', name: 'CadastroTurmasPage', segment: 'cadastro-turmas', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/turmas/turmas.module#TurmasPageModule', name: 'TurmasPage', segment: 'turmas', priority: 'low', defaultHistory: [] }
                    ]
                }),
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_5__pages_list_list__["a" /* ListPage */]),
                __WEBPACK_IMPORTED_MODULE_12__ionic_storage__["a" /* IonicStorageModule */].forRoot()
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* RotasMobile */],
                __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_list_list__["a" /* ListPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_cadastros_cadastros__["a" /* CadastrosPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_edit_contact_edit_contact__["a" /* EditContactPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_edit_presenca_edit_presenca__["a" /* EditPresencaPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_sobre_sobre__["a" /* SobrePage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_config_config__["a" /* ConfigPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_turmas_turmas__["a" /* TurmasPage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_cadastro_turmas_cadastro_turmas__["a" /* CadastroTurmasPage */],
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_6__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_7__ionic_native_splash_screen__["a" /* SplashScreen */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_11__angular_common__["d" /* DatePipe */],
                __WEBPACK_IMPORTED_MODULE_10__providers_contact_contact__["b" /* ContactProvider */],
                __WEBPACK_IMPORTED_MODULE_15__providers_turma_turma__["b" /* TurmaProvider */],
                __WEBPACK_IMPORTED_MODULE_19__providers_config_config__["b" /* ConfigProvider */],
                __WEBPACK_IMPORTED_MODULE_20__providers_util_util__["a" /* UtilProvider */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 276:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RotasMobile; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_list_list__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_cadastros_cadastros__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_sobre_sobre__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_config_config__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_turmas_turmas__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_edit_contact_edit_contact__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_cadastro_turmas_cadastro_turmas__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_edit_presenca_edit_presenca__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__providers_util_util__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};














var RotasMobile = /** @class */ (function () {
    function RotasMobile(util, loadingCtrl, menuCtrl, alertCtrl, platform, statusBar, splashScreen, app) {
        this.util = util;
        this.loadingCtrl = loadingCtrl;
        this.menuCtrl = menuCtrl;
        this.alertCtrl = alertCtrl;
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.app = app;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */];
        this.initializeApp();
        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Home', component: __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */], icon: 'ios-home' },
            { title: 'Cadastro de Alunos', component: __WEBPACK_IMPORTED_MODULE_6__pages_cadastros_cadastros__["a" /* CadastrosPage */], icon: 'people' },
            { title: 'Definir Entradas', component: __WEBPACK_IMPORTED_MODULE_5__pages_list_list__["a" /* ListPage */], icon: 'done-all' },
            { title: 'Grupos', component: __WEBPACK_IMPORTED_MODULE_9__pages_turmas_turmas__["a" /* TurmasPage */], icon: 'timer' },
            { title: 'Configurar Aplicativo', component: __WEBPACK_IMPORTED_MODULE_8__pages_config_config__["a" /* ConfigPage */], icon: 'ios-options' },
            { title: 'Sobre', component: __WEBPACK_IMPORTED_MODULE_7__pages_sobre_sobre__["a" /* SobrePage */], icon: 'ios-information-circle' }
        ];
    }
    RotasMobile.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */]);
            _this.statusBar.styleDefault();
            _this.statusBar.overlaysWebView(false);
            _this.statusBar.backgroundColorByHexString('#000000');
            _this.platform.registerBackButtonAction(function () {
                var pagina = _this.nav.getActive();
                var nav = _this.app._appRoot._getActivePortal() || _this.app.getActiveNav();
                var activeView = nav.getActive();
                if (!_this.menuCtrl.isOpen()) {
                    if (activeView.isOverlay) {
                        activeView.dismiss();
                        if (pagina.instance instanceof __WEBPACK_IMPORTED_MODULE_5__pages_list_list__["a" /* ListPage */]) {
                            _this.nav.push((_this.nav.getActive().component));
                            _this.util.mostrarLoading();
                        }
                    }
                    else if (pagina.instance instanceof __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */]) {
                        var alert_1 = _this.alertCtrl.create({
                            title: 'Fechar o App',
                            message: 'Deseja sair do app?',
                            buttons: [{
                                    text: 'Cancelar',
                                    role: 'cancel',
                                    handler: function () {
                                    }
                                }, {
                                    text: 'Sair',
                                    handler: function () {
                                        _this.platform.exitApp(); // Close this application
                                    }
                                }]
                        });
                        alert_1.present();
                    }
                    else if (pagina.instance instanceof __WEBPACK_IMPORTED_MODULE_10__pages_edit_contact_edit_contact__["a" /* EditContactPage */] ||
                        pagina.instance instanceof __WEBPACK_IMPORTED_MODULE_11__pages_cadastro_turmas_cadastro_turmas__["a" /* CadastroTurmasPage */] ||
                        pagina.instance instanceof __WEBPACK_IMPORTED_MODULE_12__pages_edit_presenca_edit_presenca__["a" /* EditPresencaPage */]) {
                        _this.nav.pop();
                        _this.util.mostrarLoading();
                    }
                    else {
                        _this.nav.popToRoot();
                    }
                }
                else {
                    _this.menuCtrl.close();
                }
            });
            _this.splashScreen.hide();
        });
    };
    RotasMobile.prototype.openPage = function (page) {
        var view = this.nav.getActive();
        if (page.component.name == view.component.name) {
            this.menuCtrl.close();
        }
        else {
            this.nav.push(page.component);
            if (page.component.name == "CadastrosPage" ||
                page.component.name == "ConfigPage" ||
                page.component.name == "TurmasPage" ||
                page.component.name == "ListPage") {
                this.util.mostrarLoading();
            }
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('content'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */])
    ], RotasMobile.prototype, "nav", void 0);
    RotasMobile = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\Dsv\dsv-git\RotasMobile\src\app\app.html"*/'<ion-menu [content]="content">\n\n  <ion-header>\n\n    <ion-toolbar color="uceff">\n\n      <ion-title>\n\n        <ion-grid>\n\n          <ion-row>\n\n            <ion-col class="titulo">Menu</ion-col>\n\n            <ion-col>\n\n              <img class="title-image" height="20px" src="src=../../assets/imgs/logo.png" />\n\n            </ion-col>\n\n          </ion-row>\n\n        </ion-grid>\n\n      </ion-title>\n\n    </ion-toolbar>\n\n  </ion-header>\n\n\n\n  <ion-content>\n\n    <ion-list no-lines>     \n\n        <button class="menus" menuToggle ion-item *ngFor="let p of pages" (click)="openPage(p)">         \n\n            <ion-icon name="{{p.icon}}" item-start></ion-icon>{{p.title}}  \n\n        </button>\n\n        <br>\n\n    </ion-list>\n\n  </ion-content>\n\n\n\n</ion-menu>\n\n\n\n<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n\n<ion-nav [root]="rootPage" #content></ion-nav>'/*ion-inline-end:"C:\Dsv\dsv-git\RotasMobile\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_13__providers_util_util__["a" /* UtilProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* MenuController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */]])
    ], RotasMobile);
    return RotasMobile;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 36:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return TurmaProvider; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Turma; });
/* unused harmony export TurmaList */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map__ = __webpack_require__(164);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__contact_contact__ = __webpack_require__(23);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




/*
  Generated class for the TurmaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var TurmaProvider = /** @class */ (function () {
    function TurmaProvider(storage, alunos) {
        this.storage = storage;
        this.alunos = alunos;
    }
    TurmaProvider.prototype.insert = function (turma) {
        var _this = this;
        this.getAll()
            .then(function (result) {
            _this.turmas = result.filter(function (x) { return (x.turma.tipo == "turma"); });
            _this.storage.get("seq_grupo").then(function (val) {
                _this.seq = val;
                if (_this.seq == null) {
                    _this.seq = 0;
                }
                _this.storage.set("seq_grupo", _this.seq + 1);
                var key = ('Turma cod.: ' + (_this.seq + 1));
                return _this.save(key, turma);
            });
        });
    };
    TurmaProvider.prototype.update = function (key, turma) {
        return this.save(key, turma);
    };
    TurmaProvider.prototype.save = function (key, turma) {
        return this.storage.set(key, turma);
    };
    TurmaProvider.prototype.remove = function (key, nomeTurma) {
        var _this = this;
        this.alunos.getAll().then(function (result) {
            _this.listaAlunos = result;
            _this.listaAlunos = _this.listaAlunos.filter(function (x) { return (x.contact.tipo == "aluno"); }); // && x.contact.turma == nomeTurma.trim()));
            _this.listaAlunos.forEach(function (x) {
                if (x.contact.turma.trim() == nomeTurma) {
                    _this.alunos.remove(x.key);
                }
            });
        });
        return this.storage.remove(key);
    };
    TurmaProvider.prototype.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var turmas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        turmas = [];
                        return [4 /*yield*/, this.storage.forEach(function (value, key, iterationNumber) {
                                var turma = new TurmaList();
                                turma.key = key;
                                turma.turma = value;
                                turmas.push(turma);
                            })
                                .then(function () {
                                return Promise.resolve(turmas);
                            })
                                .catch(function (error) {
                                return Promise.reject(error);
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TurmaProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_3__contact_contact__["b" /* ContactProvider */]])
    ], TurmaProvider);
    return TurmaProvider;
}());

var Turma = /** @class */ (function () {
    function Turma() {
    }
    return Turma;
}());

var TurmaList = /** @class */ (function () {
    function TurmaList() {
    }
    return TurmaList;
}());

//# sourceMappingURL=turma.js.map

/***/ }),

/***/ 45:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ConfigProvider; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Config; });
/* unused harmony export ConfigList */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_storage__ = __webpack_require__(17);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


var ConfigProvider = /** @class */ (function () {
    function ConfigProvider(storage) {
        var _this = this;
        this.storage = storage;
        storage.get("quantidadeConfig").then(function (val) {
            _this.quantidadeConfig = val;
        });
    }
    ConfigProvider.prototype.insert = function (config) {
        var key = ('Config cod.: ' + (this.quantidadeConfig + 1));
        this.save(key, config);
    };
    ;
    ConfigProvider.prototype.update = function (key, config) {
        return this.save(key, config);
    };
    ConfigProvider.prototype.save = function (key, config) {
        this.storage.set(key, config);
    };
    ConfigProvider.prototype.remove = function (key) {
        return this.storage.remove(key);
    };
    ConfigProvider.prototype.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var configuracoes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        configuracoes = [];
                        return [4 /*yield*/, this.storage.forEach(function (value, key, iterationNumber) {
                                var configs = new ConfigList();
                                configs.key = key;
                                configs.config = value;
                                configuracoes.push(configs);
                            })
                                .then(function () {
                                return Promise.resolve(configuracoes);
                            })
                                .catch(function (error) {
                                return Promise.reject(error);
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ConfigProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ionic_storage__["b" /* Storage */]])
    ], ConfigProvider);
    return ConfigProvider;
}());

var Config = /** @class */ (function () {
    function Config() {
    }
    return Config;
}());

var ConfigList = /** @class */ (function () {
    function ConfigList() {
    }
    return ConfigList;
}());

//# sourceMappingURL=config.js.map

/***/ }),

/***/ 46:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CadastroTurmasPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_turma_turma__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_contact_contact__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__node_modules_angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_util_util__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







/**
 * Generated class for the CadastroTurmasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var CadastroTurmasPage = /** @class */ (function () {
    function CadastroTurmasPage(menuCtrl, util, storage, alerCtrl, formBuilder, navCtrl, navParams, turmaProvider, contactProvider, toast) {
        var _this = this;
        this.menuCtrl = menuCtrl;
        this.util = util;
        this.storage = storage;
        this.alerCtrl = alerCtrl;
        this.formBuilder = formBuilder;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.turmaProvider = turmaProvider;
        this.contactProvider = contactProvider;
        this.toast = toast;
        this.validation_messages = {
            'nomeTurma': [
                { type: 'required', message: '*Informe o nome do Grupo.' }
            ]
        };
        if (this.navParams.data.value && this.navParams.data.key) {
            this.model = this.navParams.data.value;
            this.key = this.navParams.data.key;
            this.nomeAntigo = this.model.nomeTurma.toString();
            this.mostrarAlunos = true;
        }
        else {
            this.model = new __WEBPACK_IMPORTED_MODULE_2__providers_turma_turma__["a" /* Turma */]();
            this.mostrarAlunos = false;
        }
        var parametro = this.model;
        this.formularioTurma = this.formBuilder.group({
            nomeTurma: new __WEBPACK_IMPORTED_MODULE_4__node_modules_angular_forms__["b" /* FormControl */](parametro.nomeTurma, __WEBPACK_IMPORTED_MODULE_4__node_modules_angular_forms__["g" /* Validators */].required)
        });
        this.storage.get("turmaSelecionada").then(function (val) {
            _this.turmaSelecionada = val;
        });
    }
    CadastroTurmasPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.navBar.backButtonClick = function () {
            _this.navCtrl.pop();
            _this.util.mostrarLoading();
        };
    };
    CadastroTurmasPage.prototype.ionViewDidLeave = function () {
    };
    CadastroTurmasPage.prototype.save = function () {
        var _this = this;
        var valores = this.formularioTurma.value;
        var turma = this.model;
        if (turma.nomeTurma == this.turmaSelecionada) {
            this.storage.set("turmaSelecionada", valores.nomeTurma);
        }
        turma.nomeTurma = valores.nomeTurma;
        this.turmaProvider.getAll().then(function (result) {
            result = result.filter(function (x) { return (x.turma.tipo == "turma" && x.key != _this.key && x.turma.nomeTurma.toLowerCase() == turma.nomeTurma.toLowerCase()); });
            if (result.length > 0) {
                _this.mostrarMsgNomeTurma(turma.nomeTurma);
            }
            else {
                _this.saveTurma();
            }
        });
        if (turma.nomeTurma == "" || turma.nomeTurma == null) {
            var alert_1 = this.alerCtrl.create({
                title: 'Campo inválido!',
                subTitle: '<br>O nome do grupo não pode ser vazio!',
                buttons: ['Ok']
            });
            alert_1.present();
        }
    };
    CadastroTurmasPage.prototype.mostrarMsgNomeTurma = function (nome) {
        var alert = this.alerCtrl.create({
            title: 'Campo inválido!',
            subTitle: '<br>Já existe um grupo com o nome <strong>' + nome + '</strong>!<br><br> Por favor, escolha outro.',
            buttons: ['Ok']
        });
        alert.present();
    };
    CadastroTurmasPage.prototype.saveTurma = function () {
        var _this = this;
        if (this.key) {
            this.turmaProvider.update(this.key, this.model);
            this.contactProvider.updateTurma(this.nomeAntigo, this.model.nomeTurma);
        }
        else {
            this.model.tipo = "turma";
            this.turmaProvider.insert(this.model);
        }
        this.toast.create({ message: 'Grupo ' + this.model.nomeTurma + ' salvo.', duration: 1500, position: 'botton' }).present();
        this.storage.ready().then(function () {
            _this.navCtrl.pop();
            _this.util.mostrarLoading();
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Navbar */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Navbar */])
    ], CadastroTurmasPage.prototype, "navBar", void 0);
    CadastroTurmasPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-cadastro-turmas',template:/*ion-inline-start:"C:\Dsv\dsv-git\RotasMobile\src\pages\cadastro-turmas\cadastro-turmas.html"*/'<ion-header>\n\n  <ion-navbar color="uceff">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>\n\n      <ion-grid>\n\n        <ion-row>\n\n          <ion-col class="titulo">Cadastro de Grupo</ion-col>\n\n          <ion-col>\n\n            <img align="right" class="title-image" src="src=../../assets/imgs/logo.png" />\n\n          </ion-col>\n\n        </ion-row>\n\n      </ion-grid>\n\n    </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content padding>\n\n\n\n\n\n  <ion-card *ngIf="mostrarAlunos == true">\n\n    <ion-card-content align="center">\n\n      <p *ngIf="model.quantidadeAlunos > 1"> Há {{model.quantidadeAlunos}} alunos cadastrados neste grupo.</p>\n\n      <p *ngIf="model.quantidadeAlunos == 1">Há {{model.quantidadeAlunos}} aluno cadastrado neste grupo.</p>\n\n      <p *ngIf="model.quantidadeAlunos == 0">Nenhum aluno está cadastrado neste grupo.</p>\n\n    </ion-card-content>\n\n  </ion-card>\n\n\n\n  <form [formGroup]="formularioTurma" #formulario="ngForm">\n\n    <ion-item>\n\n      <ion-label floating>Nome</ion-label>\n\n      <ion-input type="text" name="nomeTurma" formControlName="nomeTurma" clearInput></ion-input>\n\n    </ion-item>\n\n    <div>\n\n      <ng-container *ngFor="let validation of validation_messages.nomeTurma">\n\n        <div class="error-message" *ngIf="formularioTurma.get(\'nomeTurma\').hasError(validation.type) && (formularioTurma.get(\'nomeTurma\').dirty || formularioTurma.get(\'nomeTurma\').touched)">\n\n          {{ validation.message }}\n\n        </div>\n\n      </ng-container>\n\n    </div>\n\n\n\n  </form>\n\n  <br>\n\n  <br>\n\n  <button color="laranja" ion-button block (click)="save()">Salvar</button>\n\n\n\n</ion-content>'/*ion-inline-end:"C:\Dsv\dsv-git\RotasMobile\src\pages\cadastro-turmas\cadastro-turmas.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* MenuController */], __WEBPACK_IMPORTED_MODULE_6__providers_util_util__["a" /* UtilProvider */], __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_4__node_modules_angular_forms__["a" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_turma_turma__["b" /* TurmaProvider */], __WEBPACK_IMPORTED_MODULE_3__providers_contact_contact__["b" /* ContactProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ToastController */]])
    ], CadastroTurmasPage);
    return CadastroTurmasPage;
}());

//# sourceMappingURL=cadastro-turmas.js.map

/***/ }),

/***/ 47:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TurmasPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_turma_turma__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__cadastro_turmas_cadastro_turmas__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_util_util__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_contact_contact__ = __webpack_require__(23);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var TurmasPage = /** @class */ (function () {
    function TurmasPage(util, storage, navCtrl, navParams, alunos, turmaProvider, alerCtrl, toast) {
        this.util = util;
        this.storage = storage;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alunos = alunos;
        this.turmaProvider = turmaProvider;
        this.alerCtrl = alerCtrl;
        this.toast = toast;
    }
    TurmasPage.prototype.ionViewDidLoad = function () {
    };
    TurmasPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.storage.ready().then(function () {
            _this.turmaProvider.getAll()
                .then(function (result) {
                _this.turmas = result.filter(function (x) { return (x.turma.tipo == "turma"); });
                if (_this.turmas.length == 0) {
                    _this.mostrarMsgVazio = true;
                }
                else {
                    _this.mostrarMsgVazio = false;
                }
                _this.turmas.forEach(function (x) {
                    _this.alunos.getAll().then(function (result) {
                        _this.listaAlunos = result;
                        _this.listaAlunos = _this.listaAlunos.filter(function (x) { return (x.contact.tipo == "aluno"); });
                        var turma = x.turma;
                        var quantidade = _this.listaAlunos.filter(function (x) { return (x.contact.turma.toString().match(turma.nomeTurma.toString())); }).length;
                        turma.quantidadeAlunos = quantidade;
                        _this.turmaProvider.update(x.key, turma);
                    });
                });
            });
        });
        this.util.esconderLoading();
    };
    TurmasPage.prototype.adicionarTurma = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__cadastro_turmas_cadastro_turmas__["a" /* CadastroTurmasPage */]);
    };
    TurmasPage.prototype.editarTurma = function (item) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__cadastro_turmas_cadastro_turmas__["a" /* CadastroTurmasPage */], { key: item.key, value: item.turma });
    };
    TurmasPage.prototype.doConfirm = function (item) {
        var _this = this;
        var confirm = this.alerCtrl.create({
            title: 'ATENÇÃO',
            subTitle: '<br>Este processo irá <strong>deletar todos os alunos</strong> referentes à este grupo! <br><br> Deseja mesmo remover o grupo ' + item.turma.nomeTurma + '?',
            buttons: [
                {
                    text: 'Não',
                    handler: function () {
                    }
                },
                {
                    text: 'Sim',
                    handler: function () {
                        _this.remover(item);
                    }
                }
            ]
        });
        confirm.present();
    };
    TurmasPage.prototype.remover = function (item) {
        var _this = this;
        if (item.turma.nomeTurma == this.turmaSelecionada) {
            this.storage.set("turmaSelecionada", "SEM_TURMA_SELECIONADA");
        }
        this.turmaProvider.remove(item.key, item.turma.nomeTurma)
            .then(function () {
            // Removendo do array de items
            var index = _this.turmas.indexOf(item);
            _this.turmas.splice(index, 1);
            _this.toast.create({ message: 'Grupo ' + item.turma.nomeTurma + ' removido.', duration: 1500, position: 'botton' }).present();
        });
    };
    TurmasPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-turmas',template:/*ion-inline-start:"C:\Dsv\dsv-git\RotasMobile\src\pages\turmas\turmas.html"*/'<ion-header>\n\n  <ion-toolbar color="uceff">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>\n\n      <ion-grid>\n\n        <ion-row>\n\n          <ion-col class="titulo">Grupos</ion-col>\n\n          <ion-col >\n\n            <img align="right" class="title-image" src="src=../../assets/imgs/logo.png" />\n\n          </ion-col>\n\n        </ion-row>\n\n      </ion-grid>\n\n    </ion-title>\n\n  </ion-toolbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content padding>\n\n\n\n    <ion-card *ngIf="mostrarMsgVazio == false">\n\n        <ion-card-content align="center">\n\n          Arraste o grupo para a direita para mostrar as opções!\n\n          \n\n        </ion-card-content>\n\n      </ion-card>\n\n\n\n      <ion-card *ngIf="mostrarMsgVazio == true">\n\n          <ion-card-content align="center">\n\n            Nenhum grupo cadastrado!        \n\n          </ion-card-content>\n\n        </ion-card>\n\n\n\n  <ion-list>\n\n\n\n    <ion-item-sliding *ngFor="let item of turmas">\n\n      <ion-item>\n\n        <h2>{{item.turma.nomeTurma}} </h2>\n\n        <p *ngIf="item.turma.quantidadeAlunos > 1">{{item.turma.quantidadeAlunos}} alunos cadastrados.</p>\n\n        <p *ngIf="item.turma.quantidadeAlunos == 1">{{item.turma.quantidadeAlunos}} aluno cadastrado.</p>\n\n        <p *ngIf="item.turma.quantidadeAlunos == 0">Nenhum aluno cadastrado.</p>  \n\n      </ion-item>\n\n\n\n\n\n      <ion-item-options side="left">\n\n\n\n        <button ion-button color="laranja" icon-start (click)="editarTurma(item)">\n\n          <ion-icon name="checkmark-circle-outline"></ion-icon>\n\n          Editar Turma\n\n        </button>\n\n\n\n        <button ion-button color="uceff" icon-start (click)="doConfirm(item)">\n\n            <ion-icon name="trash"></ion-icon>\n\n            Deletar\n\n          </button>\n\n      </ion-item-options>\n\n    </ion-item-sliding>\n\n  </ion-list>\n\n\n\n\n\n\n\n  <ion-fab right bottom (click)="adicionarTurma()">\n\n    <button ion-fab color="laranja">\n\n      <ion-icon name="add"></ion-icon>\n\n    </button>\n\n  </ion-fab>\n\n</ion-content>'/*ion-inline-end:"C:\Dsv\dsv-git\RotasMobile\src\pages\turmas\turmas.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5__providers_util_util__["a" /* UtilProvider */], __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_6__providers_contact_contact__["b" /* ContactProvider */], __WEBPACK_IMPORTED_MODULE_2__providers_turma_turma__["b" /* TurmaProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ToastController */]])
    ], TurmasPage);
    return TurmasPage;
}());

//# sourceMappingURL=turmas.js.map

/***/ }),

/***/ 57:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditPresencaPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_contact_contact__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_util_util__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var EditPresencaPage = /** @class */ (function () {
    function EditPresencaPage(util, navCtrl, navParams, alerCtrl, toast, contactProvider) {
        this.util = util;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alerCtrl = alerCtrl;
        this.toast = toast;
        this.contactProvider = contactProvider;
        this.currentDate = new Date();
        this.weekdays = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
        this.dia = this.weekdays[this.currentDate.getDay()];
        if (this.navParams.data.contact && this.navParams.data.key) {
            this.model = this.navParams.data.contact;
            this.key = this.navParams.data.key;
            if (this.model.mudancaPresenca == false) {
                if (this.model.presencaPadrao.match("Sazonalmente") && this.model.diasSazonais.indexOf(this.dia.toString()) > -1) {
                    this.model.presenca = this.model.presencaSazonal;
                }
                else if (this.model.presencaPadrao.match("Sazonalmente") && !(this.model.diasSazonais.indexOf(this.dia.toString()) > -1)) {
                    this.model.presenca = "Não Irá - " + this.dia + " não está cadastrado para este aluno!";
                }
            }
        }
        else {
            this.model = new __WEBPACK_IMPORTED_MODULE_2__providers_contact_contact__["a" /* Contact */]();
        }
    }
    EditPresencaPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.navBar.backButtonClick = function () {
            _this.navCtrl.pop();
            _this.util.mostrarLoading();
        };
    };
    EditPresencaPage.prototype.editar = function (item) {
        var _this = this;
        var ida = false;
        var volta = false;
        var idaVolta = false;
        var naoIra = false;
        var alert = this.alerCtrl.create();
        alert.setTitle('Controle de Entradas');
        if (item.presenca.match("Só Ida")) {
            ida = true;
        }
        else if (item.presenca.match("Só Volta")) {
            volta = true;
        }
        else if (item.presenca.match("Ida e Volta")) {
            idaVolta = true;
        }
        else if (item.presenca.match("Não Irá")) {
            naoIra = true;
        }
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
        if (!this.model.presenca.match("Sazonalmente")) {
            alert.addInput({
                type: 'radio',
                label: 'Não Irá',
                value: 'Não Irá',
                checked: naoIra
            });
        }
        alert.addButton('Cancelar');
        alert.addButton({
            text: 'Ok',
            handler: function (data) {
                _this.model.presenca = data;
                _this.model.mudancaPresenca = true;
                _this.save(_this.model);
            }
        });
        alert.present();
    };
    EditPresencaPage.prototype.save = function (item) {
        this.saveContact();
        this.util.mostrarLoading();
        var index = item.name.indexOf(' ');
        if (index > -1) {
            this.toast.create({ message: 'Presença para esta ' + this.dia + ' redefinida para ' + item.name.substring(0, index) + '!', duration: 3000, position: 'botton' }).present();
        }
        else {
            this.toast.create({ message: 'Presença para esta ' + this.dia + ' redefinida para ' + item.name + '!', duration: 3000, position: 'botton' }).present();
        }
        this.util.esconderLoading();
    };
    EditPresencaPage.prototype.saveContact = function () {
        if (this.key) {
            return this.contactProvider.update(this.key, this.model);
        }
        else {
            return this.contactProvider.insert(this.model);
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Navbar */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Navbar */])
    ], EditPresencaPage.prototype, "navBar", void 0);
    EditPresencaPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-edit-presenca',template:/*ion-inline-start:"C:\Dsv\dsv-git\RotasMobile\src\pages\edit-presenca\edit-presenca.html"*/'<!--\n\n  Generated template for the EditPresencaPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n\n\n  <ion-navbar color="uceff">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>\n\n      <ion-grid>\n\n        <ion-row>\n\n          <ion-col class="titulo">Editar Presença</ion-col>\n\n          <ion-col>\n\n            <img align="right" class="title-image" src="src=../../assets/imgs/logo.png" />\n\n          </ion-col>\n\n        </ion-row>\n\n      </ion-grid>\n\n    </ion-title>\n\n  </ion-navbar>\n\n\n\n</ion-header>\n\n\n\n\n\n<ion-content padding>\n\n  <ion-card class="conteudo">\n\n\n\n    <ion-card-header ng-model="model">\n\n      <h1>{{model.name}}</h1>\n\n    </ion-card-header>\n\n\n\n    <ion-card-content ng-model="model">\n\n      <p>{{model.curso}}</p>\n\n      <p>{{model.phone}}</p>\n\n      <br>\n\n      <h1 align="center">Presença para hoje, {{dia}}: {{model.presenca}}</h1>\n\n    </ion-card-content>\n\n\n\n    <button align="center" color="laranja" class="botao" ion-button round (click)="editar(model)">Editar Presença</button>\n\n\n\n  </ion-card>\n\n\n\n</ion-content>'/*ion-inline-end:"C:\Dsv\dsv-git\RotasMobile\src\pages\edit-presenca\edit-presenca.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__providers_util_util__["a" /* UtilProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ToastController */], __WEBPACK_IMPORTED_MODULE_2__providers_contact_contact__["b" /* ContactProvider */]])
    ], EditPresencaPage);
    return EditPresencaPage;
}());

//# sourceMappingURL=edit-presenca.js.map

/***/ }),

/***/ 86:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditContactPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_contact_contact__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_turma_turma__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__node_modules_angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_util_util__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_storage__ = __webpack_require__(17);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var EditContactPage = /** @class */ (function () {
    function EditContactPage(storage, util, navCtrl, formBuilder, navParams, alerCtrl, contactProvider, toast, turmaProvider) {
        this.storage = storage;
        this.util = util;
        this.navCtrl = navCtrl;
        this.formBuilder = formBuilder;
        this.navParams = navParams;
        this.alerCtrl = alerCtrl;
        this.contactProvider = contactProvider;
        this.toast = toast;
        this.turmaProvider = turmaProvider;
        this.validation_messages = {
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
        };
        this.curso = ['ADMINISTRAÇÃO',
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
        this.botoesSelecionar = {
            cssClass: 'remove-cancel'
        };
        this.currentDate = new Date();
        this.weekdays = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
        this.dia = this.weekdays[this.currentDate.getDay()];
        this.presencas = ['Só Ida', 'Só Volta', 'Ida e Volta', 'Sazonalmente'];
        if (this.navParams.data.contact && this.navParams.data.key) {
            this.model = this.navParams.data.contact;
            this.key = this.navParams.data.key;
        }
        else {
            this.model = new __WEBPACK_IMPORTED_MODULE_2__providers_contact_contact__["a" /* Contact */]();
        }
        var parametro = this.model;
        this.formularioAluno = this.formBuilder.group({
            name: new __WEBPACK_IMPORTED_MODULE_4__node_modules_angular_forms__["b" /* FormControl */](parametro.name, __WEBPACK_IMPORTED_MODULE_4__node_modules_angular_forms__["g" /* Validators */].required),
            curso: new __WEBPACK_IMPORTED_MODULE_4__node_modules_angular_forms__["b" /* FormControl */](parametro.curso, __WEBPACK_IMPORTED_MODULE_4__node_modules_angular_forms__["g" /* Validators */].required),
            turma: new __WEBPACK_IMPORTED_MODULE_4__node_modules_angular_forms__["b" /* FormControl */](parametro.turma, __WEBPACK_IMPORTED_MODULE_4__node_modules_angular_forms__["g" /* Validators */].required),
            phone: new __WEBPACK_IMPORTED_MODULE_4__node_modules_angular_forms__["b" /* FormControl */](parametro.phone, __WEBPACK_IMPORTED_MODULE_4__node_modules_angular_forms__["g" /* Validators */].required),
            email: new __WEBPACK_IMPORTED_MODULE_4__node_modules_angular_forms__["b" /* FormControl */](parametro.email),
            presencaPadrao: new __WEBPACK_IMPORTED_MODULE_4__node_modules_angular_forms__["b" /* FormControl */](parametro.presencaPadrao, __WEBPACK_IMPORTED_MODULE_4__node_modules_angular_forms__["g" /* Validators */].required)
        });
        if (this.model.presencaPadrao != null) {
            if (this.model.presencaPadrao.match("Sazonalmente")) {
                this.mostrarDias = true;
                this.mostrarDeslocamento = true;
            }
            else {
                this.mostrarDias = false;
                this.mostrarDeslocamento = false;
            }
        }
    }
    EditContactPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.turmaProvider.getAll()
            .then(function (result) {
            _this.turmas = result.filter(function (x) { return (x.turma.tipo == "turma"); });
        });
    };
    EditContactPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.navBar.backButtonClick = function () {
            _this.navCtrl.pop();
            _this.util.mostrarLoading();
        };
    };
    EditContactPage.prototype.verificarPresenca = function (item) {
        if (item.match("Sazonalmente")) {
            this.mostrarDias = true;
            this.mostrarDeslocamento = true;
        }
        else {
            this.mostrarDias = false;
            this.mostrarDeslocamento = false;
        }
    };
    EditContactPage.prototype.parametros = function () {
        var valores = this.formularioAluno.value;
        var aluno = this.model;
        var telefone;
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
        if (aluno.phone != null) {
            telefone = aluno.phone.toString().replace(/\s/g, "");
        }
        //fazer validações de campo vazio
        if (aluno.name == null || aluno.name == " ") {
            this.alerta("Nome");
        }
        else if (aluno.curso == null || aluno.curso == []) {
            this.alerta("Curso");
        }
        else if (aluno.turma == null || aluno.turma == " ") {
            this.alerta("Grupo");
        }
        else if (aluno.phone == null) {
            this.alerta("Telefone");
        }
        else if (telefone.length < 10) {
            this.alerta("telefone invalido");
        }
        else if ((aluno.email != null && aluno.email != "") && !(aluno.email.match("@") && aluno.email.includes("."))) {
            this.alerta("email");
        }
        else if (aluno.presencaPadrao == null || aluno.presencaPadrao == " ") {
            this.alerta("Presença padrão");
        }
        else if (aluno.presencaPadrao.match("Sazonalmente")) {
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
    };
    EditContactPage.prototype.alerta = function (campo) {
        if (!campo.match("de dias que irá") && !campo.match("deslocamento") && !campo.match("email") && !campo.match("telefone invalido")) {
            var alert_1 = this.alerCtrl.create({
                title: 'Campo inválido!',
                subTitle: '<br>O campo <strong>' + campo + '</strong> não pode ser vazio!',
                buttons: ['Ok']
            });
            alert_1.present();
        }
        else if (campo.match("de dias que irá")) {
            var alert_2 = this.alerCtrl.create({
                title: 'Campo inválido!',
                subTitle: '<br>Se a presença for Sazonal, <strong>escolha os dias que o aluno irá</strong>!<br> <br>Se não, escolha um outro tipo de presença padrão!',
                buttons: ['Ok']
            });
            alert_2.present();
        }
        else if (campo.match("deslocamento")) {
            var alert_3 = this.alerCtrl.create({
                title: 'Campo inválido!',
                subTitle: '<br><strong>Escolha o deslocamento que o aluno irá utilizar</strong> nos dias definidos!<br> <br>Se não, escolha um outro tipo de presença padrão!',
                buttons: ['Ok']
            });
            alert_3.present();
        }
        else if (campo.match("email")) {
            var alert_4 = this.alerCtrl.create({
                title: 'Campo inválido!',
                subTitle: '<br>O formato do e-mail informado é inválido! <br><br>Informe um email válido. <br><br> Exemplo: email@aluno.com',
                buttons: ['Ok']
            });
            alert_4.present();
        }
        else if (campo.match("telefone invalido")) {
            var alert_5 = this.alerCtrl.create({
                title: 'Campo inválido!',
                subTitle: '<br>Telefone infomado inválido! <br><br> Informe o DDD + Número. <br><br> Exemplo: 49 9 1122 3344',
                buttons: ['Ok']
            });
            alert_5.present();
        }
    };
    EditContactPage.prototype.escolherEmbarques = function (item) {
        var _this = this;
        item = this.model;
        var ida = false;
        var volta = false;
        var idaVolta = false;
        if (this.key == null && item.presencaSazonal == null) {
            this.model.presenca = "";
            this.model.presencaSazonal = "";
        }
        if (item.presencaSazonal.match("Só Ida")) {
            ida = true;
        }
        else if (item.presencaSazonal.match("Só Volta")) {
            volta = true;
        }
        else if (item.presencaSazonal.match("Ida e Volta")) {
            idaVolta = true;
        }
        var alert = this.alerCtrl.create();
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
            handler: function (data) {
                if (data != null) {
                    if (item.presencaSazonal != data) {
                        _this.model.presencaSazonal = data;
                    }
                }
            }
        });
        alert.present();
    };
    EditContactPage.prototype.diasPadroes = function () {
        var _this = this;
        if (this.key == null && this.model.diasSazonais == null) {
            this.model.diasSazonais = [];
        }
        var alert = this.alerCtrl.create();
        alert.setTitle('Escolher dias padrões');
        var segunda = false;
        var terca = false;
        var quarta = false;
        var quinta = false;
        var sexta = false;
        if (this.model.diasSazonais != null) {
            if (this.model.diasSazonais.indexOf('Segunda-Feira') > -1) {
                segunda = true;
            }
            if (this.model.diasSazonais.indexOf('Terça-Feira') > -1) {
                terca = true;
            }
            if (this.model.diasSazonais.indexOf('Quarta-Feira') > -1) {
                quarta = true;
            }
            if (this.model.diasSazonais.indexOf('Quinta-Feira') > -1) {
                quinta = true;
            }
            if (this.model.diasSazonais.indexOf('Sexta-Feira') > -1) {
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
            handler: function (data) {
                _this.model.diasSazonais = data;
            }
        });
        alert.present();
    };
    EditContactPage.prototype.save = function () {
        this.model.presenca = this.model.presencaPadrao;
        this.model.mudancaPresenca = false;
        this.saveContact();
        this.storage.set("turmaSelecionada", this.model.turma.trim());
        this.toast.create({ message: 'Aluno ' + this.model.name + ' salvo.', duration: 1500, position: 'botton' }).present();
        this.navCtrl.pop();
        this.util.mostrarLoading();
    };
    EditContactPage.prototype.saveContact = function () {
        if (this.key) {
            return this.contactProvider.update(this.key, this.model);
        }
        else {
            this.model.embarque = false;
            this.model.tipo = "aluno";
            /* this.model.visivel = true; */
            return this.contactProvider.insert(this.model);
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Navbar */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Navbar */])
    ], EditContactPage.prototype, "navBar", void 0);
    EditContactPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-edit-contact',template:/*ion-inline-start:"C:\Dsv\dsv-git\RotasMobile\src\pages\edit-contact\edit-contact.html"*/'<ion-header>\n\n  <ion-navbar color="uceff">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>\n\n      <ion-grid>\n\n        <ion-row>\n\n          <ion-col class="titulo">Cadastro de Aluno</ion-col>\n\n          <ion-col>\n\n            <img align="right" class="title-image" src="src=../../assets/imgs/logo.png" />\n\n          </ion-col>\n\n        </ion-row>\n\n      </ion-grid>\n\n    </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n\n\n  <form [formGroup]="formularioAluno" (ngSubmit)="salvar()" #formulario="ngForm">\n\n\n\n    <ion-item>\n\n      <ion-label floating>Nome *</ion-label>\n\n      <ion-input type="text" name="name" formControlName="name" clearInput></ion-input>\n\n    </ion-item>\n\n\n\n    <div>\n\n      <ng-container *ngFor="let validation of validation_messages.name">\n\n        <div class="error-message" *ngIf="formularioAluno.get(\'name\').hasError(validation.type) && (formularioAluno.get(\'name\').dirty || formularioAluno.get(\'name\').touched)">\n\n          {{ validation.message }}\n\n        </div>\n\n      </ng-container>\n\n    </div>\n\n\n\n    <ion-item>\n\n      <ion-label floating>Curso *</ion-label>\n\n      <ion-select  cancelText="Cancelar" type="text" name="curso" formControlName="curso"> \n\n        <ion-option *ngFor="let item of curso">\n\n          {{item}}\n\n        </ion-option>\n\n      </ion-select>\n\n    </ion-item>\n\n\n\n    <div>\n\n      <ng-container *ngFor="let validation of validation_messages.curso">\n\n        <div class="error-message" *ngIf="formularioAluno.get(\'curso\').hasError(validation.type) && (formularioAluno.get(\'curso\').dirty || formularioAluno.get(\'curso\').touched)">\n\n          {{ validation.message }}\n\n        </div>\n\n      </ng-container>\n\n    </div>\n\n\n\n    <ion-item>\n\n      <ion-label floating>Grupo *</ion-label>\n\n      <ion-select cancelText="Cancelar" required type="text" name="turma" formControlName="turma">\n\n        <ion-option *ngFor="let item of turmas">\n\n          {{item.turma.nomeTurma}}\n\n        </ion-option>\n\n      </ion-select>\n\n    </ion-item>\n\n\n\n    <div>\n\n      <ng-container *ngFor="let validation of validation_messages.turma">\n\n        <div class="error-message" *ngIf="formularioAluno.get(\'turma\').hasError(validation.type) && (formularioAluno.get(\'turma\').dirty || formularioAluno.get(\'turma\').touched)">\n\n          {{ validation.message }}\n\n        </div>\n\n      </ng-container>\n\n    </div>\n\n\n\n    <ion-item>\n\n      <ion-label floating>Telefone *</ion-label>\n\n      <ion-input type="tel" name="phone" formControlName="phone" clearInput></ion-input>\n\n    </ion-item>\n\n\n\n    <div>\n\n      <ng-container *ngFor="let validation of validation_messages.phone">\n\n        <div class="error-message" *ngIf="formularioAluno.get(\'phone\').hasError(validation.type) && (formularioAluno.get(\'phone\').dirty || formularioAluno.get(\'phone\').touched)">\n\n          {{ validation.message }}\n\n        </div>\n\n      </ng-container>\n\n    </div>\n\n\n\n\n\n    <ion-item>\n\n      <ion-label floating>E-mail</ion-label>\n\n      <ion-input type="email" name="name" formControlName="email" clearInput></ion-input>\n\n    </ion-item>\n\n\n\n\n\n    <ion-item>\n\n      <ion-label floating>Presença Padrão *</ion-label>\n\n      <ion-select cancelText="Cancelar" required type="text" name="presenca" formControlName="presencaPadrao" value="presenca" (ionChange)="verificarPresenca($event)">\n\n        <ion-option *ngFor="let item of presencas">\n\n          {{item}}\n\n        </ion-option>\n\n      </ion-select>\n\n    </ion-item>\n\n\n\n\n\n    <div>\n\n      <ng-container *ngFor="let validation of validation_messages.presencaPadrao">\n\n        <div class="error-message" *ngIf="formularioAluno.get(\'presencaPadrao\').hasError(validation.type) && (formularioAluno.get(\'presencaPadrao\').dirty || formularioAluno.get(\'presencaPadrao\').touched)">\n\n          {{ validation.message }}\n\n        </div>\n\n      </ng-container>\n\n    </div>\n\n\n\n  </form>\n\n  <br>\n\n\n\n  <button ion-button block outline color="laranja" *ngIf="mostrarDias == true" (click)="diasPadroes()">\n\n    Escolher Dias *\n\n  </button>\n\n\n\n  <button ion-button block outline color="laranja" *ngIf="mostrarDeslocamento == true" (click)="escolherEmbarques()">\n\n    Escolher Deslocamento *\n\n  </button>\n\n  \n\n  <br>\n\n  <button color="laranja" ion-button block (click)="parametros()">Salvar</button>\n\n\n\n\n\n\n\n\n\n</ion-content>'/*ion-inline-end:"C:\Dsv\dsv-git\RotasMobile\src\pages\edit-contact\edit-contact.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_5__providers_util_util__["a" /* UtilProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_4__node_modules_angular_forms__["a" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_2__providers_contact_contact__["b" /* ContactProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ToastController */], __WEBPACK_IMPORTED_MODULE_3__providers_turma_turma__["b" /* TurmaProvider */]])
    ], EditContactPage);
    return EditContactPage;
}());

//# sourceMappingURL=edit-contact.js.map

/***/ })

},[210]);
//# sourceMappingURL=main.js.map