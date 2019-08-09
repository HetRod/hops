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
    // this.utils.submitEventGA('Login', 'click', 'Login click');
    this.presentLoading();

   

    let credentials = {
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value
    };

    this.authService.login(credentials).subscribe(
      response => {
        console.log(response);
        this.router.navigate(['/company/']);
        this.dismissLoading();
      },
      error => {
        this.dismissLoading();
        this.presentAlert("Ops..Tenemos problemas para iniciar sesión",error)
      }
    );

     
     

  
  
  }


 

}
