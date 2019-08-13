import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Routes, RouterModule, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from '../users/shared/general.services';
import { LoadingController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { Events } from '@ionic/angular';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public item: boolean;
  public auth: {};
  public errorMsg: string = 'Error Message.';
  public listOrg: any[] = []

  ngOnInit() {
    this.item = false;
    this.loginForm.reset();
  }

  public loading;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

 
  constructor(
    public loadingController: LoadingController,
    private authService: AuthService,
    private router: Router,
    public alertController: AlertController
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
      duration: 7000
    });
    await this.loading.present();
  }

  public login() {
     this.presentLoading();

    let credentials = {
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value
    };

   
    this.authService.login(credentials).subscribe(
      response => {
        console.log(response);
        let idrol = response.userData.idrol
        if (idrol === '2'){
          this.router.navigate(['/company/']);
          this.dismissLoading();
        }else if(idrol === '3') {
          let response2 = this.authService.orgLoad(credentials)
          console.log(response2.userDataOrg)
          for (let i=0; i<response2.userDataOrg.length; i++ ){
            this.listOrg[i] = {
              name: response2.userDataOrg[i].nombreempresa,
              type: 'radio',
              label: response2.userDataOrg[i].nombreempresa,
              value: response2.userDataOrg[i].idempresa
            }
          }
          this.presentAlertRadio();
        }
        // this.router.navigate(['/company/']);
        //this.dismissLoading();
      },
      error => {
        this.dismissLoading();
        this.presentAlert("Ops..Tenemos problemas para iniciar sesión",error)
      }
    );

    // let response: any = this.authService.login(credentials);
    // let idrol = response.userData.idrol
    // if (idrol === '2'){
    //   this.router.navigate(['/company/']);
    // }else{
    //   let response2 = this.authService.orgLoad(credentials)
    //   console.log(response2.userDataOrg)
    //   for (let i=0; i<response2.userDataOrg.length; i++ ){
    //     this.listOrg[i] = {
    //       name: response2.userDataOrg[i].nombreempresa,
    //       type: 'radio',
    //       label: response2.userDataOrg[i].nombreempresa,
    //       value: response2.userDataOrg[i].idempresa
    //     }
    //   }
    //  this.presentAlertRadio();
   // }
    
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
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data:string) => {
            this.router.navigate(['/company/'+ data]);
            console.log(data);
          }
        }
      ]
    });

    await alert.present();
  }


 

}
