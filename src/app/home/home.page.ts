import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Routes, RouterModule, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AlertController, NavController } from '@ionic/angular';

import { LoadingController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { Events } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public loading;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

 
  constructor(
    public loadingController: LoadingController,
   
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

      this.router.navigate(['/company/']);
      this.dismissLoading();
     

  
  
  }


 

}
