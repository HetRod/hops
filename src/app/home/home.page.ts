import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Routes, RouterModule, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from '../users/shared/general.services';
import { LoadingController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public item: boolean;
  public date: Date = new Date();
  public auth: {};
  public user
  private storage:Storage
  public errorMsg: string = 'Error Message.';
  public listOrg: any[] = [];
  public token: string;
  
  
  ngOnInit() {
    this.item = false;
    this.loginForm.reset();

    
    
  }

  public loading;
  public org;
 
  

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  
 
  constructor(
    public events: Events,
    public loadingController: LoadingController,
    private authService: AuthService,
    private router: Router,
    public alertController: AlertController,
    private fcm: FCM
  ) {}

  async presentAlert(header, message) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: '',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async dismissLoading() {
    await this.loading.dismiss();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Por favor espere...',
      duration: 5000
    });
    await this.loading.present();
  }

  public login() {
    
    let credentials = {
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value
    };

    this.presentLoading();
    this.authService.login(credentials).subscribe(
      response => {
        
        this.fcm.getToken().then(token => {
          this.token=token;
          console.log(token);
            this.presentAlert("token",token);
         
        });

        this.fcm.onTokenRefresh().subscribe(token => {
          this.token=token;
          console.log(token);
          this.presentAlert("tok",token);
        });

        let dataNoti = {
          idusuario: response.userData.idusuario,
          token: this.token
        };

        this.authService.saveTokenBD(dataNoti).subscribe(
          response2 => {
           // console.log(token);
            this.presentAlert("to",this.token);
          },
          error => {
            console.log(error);
         //   this.presentAlert("Error","El correo no existe");
          }
        );

        // this.fcm.onNotification().subscribe(data => {
        //   console.log(data);
        //   if (data.wasTapped) {
        //     console.log('Received in background');
        //     this.router.navigate([data.landing_page, data.price]);
        //   } else {
        //     console.log('Received in foreground');
        //     this.router.navigate([data.landing_page, data.price]);
        //   }
        // });

        this.authService.saveUserDataLocalStorage(response.userData).then(()=>{
          //Publico el evento user_login que ya se que app.component lo esta escuchando
          this.events.publish('user_login');
        });
        let idrol = response.userData.idrol
        if (idrol === '2'){
          let data = {
            idempresa: response.userData.idempresa,
            mes: this.date.getMonth() + 1,
            ano: this.date.getFullYear()
          };
        //  let data:string = response.userData.idempresa;
          this.router.navigate(['/company'],{ state: { data} });
          console.log(response.userData);
          this.dismissLoading();
        }else if((idrol === '3') ||(idrol === '4')) {
          this.dismissLoading();
          let response2 = this.authService.orgLoad(credentials).subscribe(
            response2 => {
             for (let i=0; i<response2.userDataOrg.length; i++ ){
                this.listOrg[i] = {
                  name: response2.userDataOrg[i].nombreempresa,
                  type: 'radio',
                  label: response2.userDataOrg[i].nombreempresa,
                  value: response2.userDataOrg[i].idempresa
                }

              }
              //this.org =response2.value;
              this.presentAlertRadio();
            },
            error => {
              console.log(error);
           //   this.presentAlert("Error","El correo no existe");
            }
          );
          // let response2 = this.authService.orgLoad(credentials);
          // console.log(response2.userDataOrg)
          // // for (let i=0; i<response2.userDataOrg.length; i++ ){
          //   this.listOrg[i] = {
          //     name: response2.userDataOrg[i].nombreempresa,
          //     type: 'radio',
          //     label: response2.userDataOrg[i].nombreempresa,
          //     value: response2.userDataOrg[i].idempresa
          //   }

          // }
          // this.org =response2.value;
          //this.presentAlertRadio();
        }
       
        // this.dismissLoading();
        // this.router.navigate(['/company/']);
        // this.dismissLoading();
      },
      error => {
        console.log(error.text);
        this.dismissLoading();
        this.presentAlert("Ops..Tenemos problemas para iniciar sesión","Solicitud incorrecta en usuario y/o contraseña")
      }
    );
   
  }

  async presentAlertRadio() {
    
    const alert = await this.alertController.create({
      header: 'Seleccione una Empresa',
      inputs: this.listOrg,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data2:string) => {
            let data = {
              idempresa: data2,
              mes: this.date.getMonth() + 1,
              ano: this.date.getFullYear()
            };
            this.router.navigate(['/company'],{ state: {data } });
            //console.log(data);
          }
        }
      ]
    });

    await alert.present();
  }

  forgot(){
    let credentials = {
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value
    };

   if(credentials.username == null){
      this.presentAlert("Error!!","Debe ingresar su usuario o correo para recuperar la contraseña");
      
   }else{
    
      this.authService.recuperar(credentials).subscribe(
        response => {
          this.presentAlert("Hecho!!","Se le ha enviado un correo");
        },
        error => {
          console.log(error);
          this.presentAlert("Error","El correo no existe");
        }
      );
      
   }
  }


 

}
