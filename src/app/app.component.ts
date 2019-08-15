import { Component } from '@angular/core';
// Importamos el objeto de eventos que pertenece a angular
import { AlertController, Events } from '@ionic/angular';
import {
  Router
} from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './users/shared/general.services';
import { Storage } from '@ionic/storage';

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
       title: 'Notificaciones',
       url: '/list',
       icon: 'notifications'
     }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private authService: AuthService,
    public alertController: AlertController,
    public router:Router,
    // Declaro la variable de eventos
    public events: Events,
    private storage : Storage,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
    // Me suscribo a un evento llamado user_login, este evento puede ser emitito por cualquier otro componente 
    this.events.subscribe('user_login', () => {
      //Si el evento sucede hago lo que quiera
      this.loggedIn();
    });

  }

  loggedIn() {
    //En particular quiero inicializar mi data del menu
    console.log("Usuario loggeado");
    this.initData();
  }

  
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
     
    });
  }

  //cierro la sesion elimino el objeto del storage pero lo seteo con valores vacios para evitar el log que explotaba
  _destroySesion(){
    this.storage.remove('app.userData').then(()=>{
      //this.data = {};
      this.resetData();
      this.router.navigate(['/home'],{replaceUrl:true});
    })
  }

  initData(){
    this.authService.getUserData().then(userData => {
      this.data = {
        nombres: userData.nombres,
        apellidos: userData.apellidos,
        rol: userData.idrol,
        nombreempresa: userData.nombreempresa
      };
    });
  }

  // Limpio y seteo el objeto vacio en el storage
  resetData(){
    let data_clear = {
      nombres: '',
      apellidos: '',
      rol: '',
      nombreempresa: ''
    };
    this.data = data_clear;
    this.storage.set('app.userData', data_clear);
  }
}
