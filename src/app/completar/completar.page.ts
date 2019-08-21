import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../users/shared/general.services';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';


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

  loginForm = new FormGroup({
    horainicio: new FormControl('', [Validators.required]),
    fechainicio: new FormControl('', [Validators.required]),
    horafin: new FormControl('', [Validators.required]),
    fechafin: new FormControl('', [Validators.required]),
    observaciones: new FormControl('', [Validators.required]),
    destino: new FormControl('', [Validators.required])
  });

  constructor(
    private route: ActivatedRoute,
    public alertController: AlertController,
    private router: Router,
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



  public login(id: any, idempresa:any) {
  

   let credentials = {
      idevento: id,
      idempresa: idempresa,
      horainicio: this.loginForm.get('horainicio').value,
      fechainicio: this.loginForm.get('fechainicio').value,
      horafin: this.loginForm.get('horafin').value,
      fechafin: this.loginForm.get('fechafin').value,
      observaciones: this.loginForm.get('observaciones').value,
      destino: this.loginForm.get('destino').value
    
   };

  //  console.log(credentials.horainicio);
  //  console.log(credentials.fechainicio);
  //  console.log(credentials.horafin);
  //  console.log(credentials.fechafin);
  //  console.log(credentials.observaciones);
  //  console.log(credentials.destino);



    this.authService.completar(credentials).subscribe(
      response =>{
        console.log(response);
        this.presentAlert("Éxito!!","El evento ha sido completado");
        let data:string = credentials.idempresa;
        this.router.navigate(['/company'],{ state: { data} });

  
      // this.router.navigate(['/company'],{ state: { data} });

      },error => {
        console.log(error.text);
      
      }
    );

  }


  back(evento){
    //console.log(evento);
   this.router.navigate(['/evendetail'],{ state: {evento: evento } });
  }

  

}
