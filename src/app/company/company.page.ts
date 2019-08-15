import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from '../users/shared/general.services';
import { LoadingController } from '@ionic/angular';
import { Routes, RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {

  public date: Date = new Date();
  public events: any[];
  

  constructor(
    public loadingController: LoadingController,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    
  }

  public loading;

  async dismissLoading() {
    await this.loading.dismiss();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Cargando Eventos...',
      duration: 7000
    });
    await this.loading.present();
  }

  getEvents(date){
    this.authService.eventsLoad(date).subscribe(
      response => {
          this.events = response.eventos;
          this.dismissLoading();
      },
      error => {
        console.log(error.text);
      }
    );
  }

  getUserInfo(){
    
    this.authService.getUserData().then(userData => {
    
      let data: any = {
        numdoc: userData.numerodocumento,
        open: false,
        rol: userData.idrol,
        orgs: userData.idempresa,
        año: this.date.getFullYear(),
        mes: this.date.getMonth() + 1
      };

      this.getEvents(data);
    
    });
  }

  ionViewWillEnter() {
    this.presentLoading();
    this.getUserInfo();
  }

  detalles(evento){
    //console.log(evento);
    this.router.navigate(['/evendetail'],{ state: {evento: evento } });
  }

  previous(date){
    console.log(date);
    //let month :any = date.getMonth();
    // this.authService.getUserData().then(userData => {
    
    //   let data: any = {
    //     numdoc: userData.numerodocumento,
    //     open: false,
    //     rol: userData.idrol,
    //     orgs: userData.idempresa,
    //     año: this.date.getFullYear(),
    //     mes: month
    //   };

    //   this.authService.eventsLoad(data).subscribe(
    //     response => {
    //       console.log(response);
    //         this.events = response.eventos;
    //         this.dismissLoading();
    //     },
    //     error => {
    //       console.log(error.text);
    //     }
    //   );
      
      

    
    // });
    
  }
}
