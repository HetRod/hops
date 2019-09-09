import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../users/shared/general.services';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';




@Component({
  selector: 'app-completar',
  templateUrl: './completar.page.html',
  styleUrls: ['./completar.page.scss'],
})
export class CompletarPage implements OnInit {

  public evento: any;
  public fechaini:any;
  public horaini:any;
  public fechafin:any;
  public horafin:any;
  public data:any;
 
 

  ngOnInit() {
    this.evento = this.router.getCurrentNavigation().extras.state;
    //console.log(this.evento);
    this.loginForm.reset();
    this.fechaini = this.evento.evento.fechahorainicio.split(" ")[0];
    this.horaini = this.evento.evento.fechahorainicio.split(" ")[1];
    this.horaini = this.horaini.substring(0,5);
    this.fechafin = this.evento.evento.fechahorafin.split(" ")[0];
    this.horafin = this.evento.evento.fechahorafin.split(" ")[1];
    this.horafin = this.horafin.substring(0,5);
    //console.log(this.fechaini);
  }

  public loading;

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    
  }

  loginForm = new FormGroup({
    horainicio: new FormControl('', [Validators.required]),
    fechainicio: new FormControl('', [Validators.required]),
    horafin: new FormControl('', [Validators.required]),
    fechafin: new FormControl('', [Validators.required]),
    observaciones: new FormControl('', [Validators.required]),
    destino: new FormControl('', [Validators.required])
  });

  constructor(
    public loadingController: LoadingController,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private router: Router,
    public menuCtrl: MenuController,
    private  authService:  AuthService
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

  async presentLoading(idempresa:any) {
   
    this.loading = await this.loadingController.create({
      message: 'El evento ha sido completado',
      duration: 4000
    });
   
    await this.loading.present();
    let data:string = idempresa;
    this.router.navigate(['/company'],{ state: { data} });
  }



  async presentAlertConfirm(idempresa:any) {

    const alert = await this.alertController.create({
      header: 'Éxito:',
      message: 'El evento ha sido completado',
      
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          let data:string = idempresa;
          this.router.navigate(['/company'],{ state: { data} });
        }
      }]
    });
    await alert.present();
   
  }



  public login(id: any, idempresa:any) {
  

   let credentials = {
      idevento: id,
      idempresa: idempresa,
      horainicio: this.loginForm.get('horainicio').value,
      fechainicio: this.loginForm.get('fechainicio').value.substring(0,10),
      horafin: this.loginForm.get('horafin').value,
      fechafin: this.loginForm.get('fechafin').value.substring(0,10),
      observaciones: this.loginForm.get('observaciones').value,
      destino: this.loginForm.get('destino').value
    
   };

  

 
    if((credentials.observaciones == null)||(credentials.destino == null)){
      this.presentAlert("Error!!","Por favor ingrese todos los campos para completar el evento");  
    }else{
      if(credentials.fechainicio == credentials.fechafin){
        if(credentials.horainicio == credentials.horafin){
          this.presentAlert("Error","La Horas de inicio y fin no pueden ser iguales");  
        }else{
          if(credentials.horainicio > credentials.horafin){
            this.presentAlert("Error","La hora final no puede menor a la hora inicial"); 
          }else{
            this.authService.completar(credentials).subscribe(
              response =>{
               // console.log(response);


                this.authService.showEvento(credentials.idevento).subscribe(
                  response2 => {
                    response2.estadonew=3;
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

                // this.presentAlert("Éxito!!","El evento ha sido completado");
                   this.presentAlertConfirm(credentials.idempresa);
                 // this.presentLoading(credentials.idempresa);

                
        
              },error => {
                console.log(error.text);
              
              }
            );
          }
        }
      
      }else{
        if(credentials.fechafin < credentials.fechainicio){
          this.authService.completar(credentials).subscribe(
            response =>{
             // console.log(response);
             this.presentAlertConfirm(credentials.idempresa);
      
        
            // this.router.navigate(['/company'],{ state: { data} });
      
            },error => {
              console.log(error.text);
            
            }
          );
        }else{
          this.presentAlert("Error","La fecha final no puede menor a la fecha inicial"); 
        }

      }
    }
   
   

  }





  back(evento){
    //console.log(evento);
   this.router.navigate(['/evendetail'],{ state: {evento: evento } });
  }

  

}
