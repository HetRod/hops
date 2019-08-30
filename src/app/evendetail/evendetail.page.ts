import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../users/shared/general.services';


@Component({
  selector: 'app-evendetail',
  templateUrl: './evendetail.page.html',
  styleUrls: ['./evendetail.page.scss'],
})
export class EvendetailPage implements OnInit {

  public evento: any;
  public data:any;
  

  constructor(
    private router: Router,
    public alertController: AlertController,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  async presentAlert(header, message) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: '',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  ngOnInit() {
    this.evento = this.router.getCurrentNavigation().extras.state;
    //console.log(this.evento);
  }

  cancel(id,idempresa,mes,ano){
    //console.log(id);
    this.presentAlertConfirm(id,idempresa,mes,ano);
    
  }

  back(id,mes,ano){
   
    let data = {
      idempresa: id
    
    };
    //console.log(data);
    this.router.navigate(['/company'],{ state: { data} });
  }

  complete(evento){
    //console.log(evento);
    this.router.navigate(['/completar'],{ state: {evento: evento } });
  }



  async presentAlertConfirm(id,idempresa,mes,ano) {

    const alert = await this.alertController.create({
      header: 'Estimado Usuario:',
      message: '¿Está seguro que quiere cancelar este evento?',
      buttons: [{
        text: 'Cancelar',
        role: 'cancelar',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Aceptar',
        handler: () => {
          this.authService.cancelar(id).subscribe(
            response =>{

              this.authService.showEvento(id).subscribe(
                response2 => {
                  response2.estadonew=5;
                  response2.idpaciente = response2.idpacientes;
                 // console.log(response2);
                  this.data = response2;

                  // funciona pero se comenta para no mandar mensajes
                  // this.authService.notiCancel(this.data).subscribe(
                  //   response3 => {
                     
                  //     console.log(response3);
    
                  //   },
                  //   error => {
                  //     console.log(error);
                  //    // this.presentAlert("Error","");
                  //   }
                  // );
          
                },
                error => {
                  console.log(error);
                 // this.presentAlert("Error","");
                }
              );

            

              //console.log(response);
              this.presentAlert("Éxito!!","El evento ha sido cancelado");
              let data = {
                idempresa: idempresa
               
              };
              this.router.navigate(['/company'],{ state: { data} });

            },error => {
              console.log(error.text);
             
            }
          );
        }
      }]
    });
    await alert.present();
  }
  



}
