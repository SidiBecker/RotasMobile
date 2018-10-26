import { Component, ViewChild } from '@angular/core';
import { Platform, App, NavController, ViewController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { CadastrosPage } from '../pages/cadastros/cadastros';
import { SobrePage } from '../pages/sobre/sobre';
import { ConfigPage } from '../pages/config/config';
import { TurmasPage } from '../pages/turmas/turmas';
import { EditContactPage } from '../pages/edit-contact/edit-contact';
import { CadastroTurmasPage } from '../pages/cadastro-turmas/cadastro-turmas';
import { EditPresencaPage } from '../pages/edit-presenca/edit-presenca';

@Component({

  templateUrl: 'app.html'

})
export class RotasMobile {
  @ViewChild('content') nav: NavController;

  rootPage = HomePage;

  pages: Array<{ title: string, component: any, icon: any }>;

  constructor(public alertCtrl: AlertController, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public app: App) {

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      //{ title: 'Home', component: HomePage, icon: 'ios-home' },
      { title: 'Alunos', component: CadastrosPage, icon: 'people' },
      { title: 'Definir Entradas', component: ListPage, icon: 'done-all' },
      { title: 'Turmas', component: TurmasPage, icon: 'timer' },
      { title: 'Configurar Aplicativo', component: ConfigPage, icon: 'ios-options' },
      { title: 'Sobre', component: SobrePage, icon: 'ios-information-circle' }

    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.nav.setRoot(HomePage);

      this.statusBar.styleDefault();

      this.splashScreen.hide();


      this.platform.registerBackButtonAction(() => {
        let view = this.nav.getActive();

        if (view.instance instanceof HomePage) {

          const alert = this.alertCtrl.create({
            title: 'Fechar o App',
            message: 'Deseja sair do app?',
            buttons: [{
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                console.log('Application exit prevented!');
              }
            }, {
              text: 'Sair',
              handler: () => {
                this.platform.exitApp(); // Close this application
              }
            }]
          });
          alert.present();
        }


        if (view.instance instanceof EditContactPage ||
          view.instance instanceof CadastroTurmasPage ||
          view.instance instanceof EditPresencaPage) {
          this.nav.pop();
        } else {
          this.nav.popToRoot();
        }


      });

    });
  }

  openPage(page) {

    //this.nav.pop();
    this.nav.push(page.component);
    debugger
    //this.nav.push(page.component);
  }
}
