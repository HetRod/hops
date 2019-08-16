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
    console.log(this.evento);
  }

  cancel(id,idempresa){
    console.log(id);
    this.presentAlertConfirm(id,idempresa);
    
  }

  back(id){
   
    let data:string = id;
    this.router.navigate(['/company'],{ state: { data} });
  }

  complete(evento){
    console.log(evento);
    this.router.navigate(['/completar'],{ state: {evento: evento } });
  }



  async presentAlertConfirm(id,idempresa) {

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
              console.log(response);
              this.presentAlert("Éxito!!","El evento ha sido cancelado");
              let data:string = idempresa;
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
