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

  ionViewWillEnter() {
    this.authService.getUserData().then(userData => {
    
      let data: any = {
        numdoc: userData.numerodocumento,
        open: false,
        rol: userData.idrol,
        orgs: userData.idempresa,
        año: this.date.getFullYear(),
        mes: this.date.getMonth() + 1
      };

      let response: any = this.authService.eventsLoad(data);

      this.events = response.eventos;
<<<<<<< HEAD
      //  console.log(this.events);
      //   console.log(response);
=======
      // console.log(this.events);
      //  console.log(response);
>>>>>>> 89344f4ca7ddf2b5834cdb2e3269ea55499b408e
    });
  }

  detalles(evento){
    console.log(evento);
    this.router.navigate(['/evendetail'],{ state: {evento: evento } });
  }
}
