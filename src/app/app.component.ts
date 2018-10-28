import { Component, ViewChild } from '@angular/core';
import { Platform, App, NavController, AlertController, MenuController, LoadingController } from 'ionic-angular';
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
import { UtilProvider } from '../providers/util/util';

@Component({

  templateUrl: 'app.html'

})
export class RotasMobile {
  @ViewChild('content') nav: NavController;

  rootPage = HomePage;

  pages: Array<{ title: string, component: any, icon: any }>;

  constructor(public util: UtilProvider, public loadingCtrl: LoadingController, public menuCtrl: MenuController, public alertCtrl: AlertController, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public app: App) {

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage, icon: 'ios-home' },
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

        let pagina = this.nav.getActive();

        let nav = this.app._appRoot._getActivePortal() || this.app.getActiveNav();
        let activeView = nav.getActive();

        if (!this.menuCtrl.isOpen()) {
          if (pagina.instance instanceof HomePage) {

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

          if (activeView.isOverlay) {
           
              activeView.dismiss();

          }
          else if (pagina.instance instanceof EditContactPage ||
            pagina.instance instanceof CadastroTurmasPage ||
            pagina.instance instanceof EditPresencaPage) {
            this.nav.pop();
            this.util.mostrarLoading();
          } else {
            this.nav.popToRoot();
          }
        } else {
          this.menuCtrl.close();
        }



      });

    });
  }

  openPage(page) {
    debugger

    let view = this.nav.getActive();

    if (page.component.name == view.component.name) {
      this.menuCtrl.close();
    } else {
      this.nav.push(page.component);
      if (page.component.name == "CadastrosPage" ||
        page.component.name == "ConfigPage" ||
        page.component.name == "TurmasPage" ||
        page.component.name == "ListPage") {
        this.util.mostrarLoading();
      }
    }

  }
}
