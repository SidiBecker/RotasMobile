import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { CadastrosPage } from '../pages/cadastros/cadastros';
import { EditContactPage } from '../pages/edit-contact/edit-contact';
import { SobrePage } from '../pages/sobre/sobre';
 
@Component({
  templateUrl: 'app.html'
}) 
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any, icon: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage, icon: 'ios-home'},
      { title: 'Alunos', component: CadastrosPage, icon: 'people'},
      { title: 'Definir Embarques', component: ListPage, icon: 'done-all' },
      {title: 'Sobre', component: SobrePage, icon: 'ios-information-circle'}   
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
    this.nav.setRoot(page.component);
    //this.nav.push(page.component);
  }
}
