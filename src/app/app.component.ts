import { Component, ViewChild } from '@angular/core';
import { Platform, App, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { CadastrosPage } from '../pages/cadastros/cadastros';
import { SobrePage } from '../pages/sobre/sobre';
import { ConfigPage } from '../pages/config/config';
import { TurmasPage } from '../pages/turmas/turmas';

@Component({
  
  templateUrl: 'app.html'

})
export class RotasMobile {
  @ViewChild('content') nav: NavController;

  rootPage = HomePage;

  pages: Array<{ title: string, component: any, icon: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public app: App) {

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

      this.statusBar.styleDefault();

      this.splashScreen.hide();

    });
  }

  openPage(page) {

    //this.nav.pop();
    this.nav.setRoot(page.component);
    debugger
    //this.nav.push(page.component);
  }
}
