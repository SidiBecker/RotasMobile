import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, IonicPageModule, NavController } from 'ionic-angular';

import { RotasMobile } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CadastrosPage } from '../pages/cadastros/cadastros';
import { EditContactPage } from '../pages/edit-contact/edit-contact';
import { ContactProvider } from '../providers/contact/contact';
import { DatePipe } from '@angular/common';
import { IonicStorageModule } from '@ionic/storage';
import { EditPresencaPage } from '../pages/edit-presenca/edit-presenca';
import { SobrePage } from '../pages/sobre/sobre';
import { TurmaProvider } from '../providers/turma/turma';
import { ConfigPage } from '../pages/config/config';
import { TurmasPage } from '../pages/turmas/turmas';
import { CadastroTurmasPage } from '../pages/cadastro-turmas/cadastro-turmas';
import { ConfigProvider } from '../providers/config/config';
import { UtilProvider } from '../providers/util/util';

@NgModule({
  declarations: [
    RotasMobile,
    HomePage,
    ListPage,
    CadastrosPage,
    EditContactPage,
    EditPresencaPage,
    SobrePage,
    ConfigPage,
    TurmasPage,
    CadastroTurmasPage
  ],
  imports: [     
    BrowserModule,
    IonicModule.forRoot(RotasMobile),
    IonicPageModule.forChild(ListPage),
    IonicStorageModule.forRoot()
  ], 
  bootstrap: [IonicApp],
  entryComponents: [
    RotasMobile, 
    HomePage,
    ListPage,
    CadastrosPage,
    EditContactPage,
    EditPresencaPage,
    SobrePage,
    ConfigPage,
    TurmasPage,
    CadastroTurmasPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatePipe,
    ContactProvider,
    TurmaProvider, 
    ConfigProvider,
    UtilProvider
  ]
})
export class AppModule {}
