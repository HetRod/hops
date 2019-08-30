import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from '../users/shared/general.services';
import { LoadingController } from '@ionic/angular';
import { Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {
  public argumentos = null
  public date: Date = new Date();
  public events: any[];
  public datos:any;
  public mes:any;
  public year:any;
  public info:any;
  
  monthNames = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
  "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
  ];
  

  constructor(
   
    public loadingController: LoadingController,
    private authService: AuthService,
    private router: Router
    
  ) {}

  ngOnInit() {
    this.argumentos = this.router.getCurrentNavigation().extras.state;
    //console.log(this.argumentos); 
   
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

    //console.log(date);

    this.authService.eventsLoad(date).subscribe(
      response => {
          this.events = response.eventos;
          this.datos = this.monthNames[(date.mes -1)];
          
          this.mes =(date.mes);
          this.year=(date.año);

          
          if(this.events == null){
            this.info=response.error.text;
          }else{
            this.info="";
          }
          
          this.dismissLoading();
          //console.log(response.eventos);
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
        orgs: this.argumentos.data.idempresa,
        año: this.argumentos.data.ano,
        mes: this.argumentos.data.mes
      };
      //console.log(data);
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

  previous(mes_ant,year_ant){

  
    if(mes_ant==1){
      mes_ant=13;
      year_ant=year_ant-1;
    }

    this.authService.getUserData().then(userData => {
    
      let data: any = {
        numdoc: userData.numerodocumento,
        open: false,
        rol: userData.idrol,
        orgs: this.argumentos.data.idempresa,
        año: year_ant,
        mes: mes_ant-1,
      };
    //  console.log(data);
      this.getEvents(data);
    
    });
   
  }

  siguiente(mes_ant,year_ant){

    if(mes_ant==12){
      mes_ant=0;
      year_ant=year_ant+1;
    }

    this.authService.getUserData().then(userData => {
    
      let data: any = {
        numdoc: userData.numerodocumento,
        open: false,
        rol: userData.idrol,
        orgs: this.argumentos.data.idempresa,
        año: year_ant,
        mes: mes_ant+1,
      };
      //console.log(data);
      this.getEvents(data);
    
    });
   
  }
}