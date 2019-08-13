import { Component } from '@angular/core';

import { AlertController } from '@ionic/angular';
import {
  Router
} from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './users/shared/general.services';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public date: Date = new Date();
  public data: any;
  
  public appPages = [
    {
      title: 'Inicio',
      url: '/company',
      icon: 'home'
    },
    {
      title: 'Chat',
      url: '/list',
      icon: 'chatbubbles'
    },
    {
      title: 'Cerrar Sesión',
      url: '/home',
      icon: 'exit'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private authService: AuthService,
    public alertController: AlertController,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.authService.getUserData().then(userData => {
        this.data = {
          nombres: userData.nombres,
          apellidos: userData.apellidos,
          rol: userData.idrol,
          nombreempresa: userData.nombreempresa
        };
      });
    });
  }
}
