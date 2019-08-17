import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../users/shared/general.services';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-completar',
  templateUrl: './completar.page.html',
  styleUrls: ['./completar.page.scss'],
})
export class CompletarPage implements OnInit {

  public evento: any;
 

  ngOnInit() {
    this.evento = this.router.getCurrentNavigation().extras.state;
    console.log(this.evento);
    this.loginForm.reset();
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
    private router: Router,
    private  authService:  AuthService
  ) {}

 


  public login() {
  

  //  let credentials = {
  //   horainicio: this.loginForm.get('horainicio').value,
  //   fechainicio: this.loginForm.get('fechainicio').value,
  //   horafin: this.loginForm.get('horafin').value,
  //   fechafin: this.loginForm.get('fechafin').value,
  //   observaciones: this.loginForm.get('observaciones').value,
  //   destino: this.loginForm.get('destino').value
    
  //  };

  //  console.log(credentials.horainicio.substring(11,16));
  //  console.log(credentials.fechainicio.substring(0,10));
  //  console.log(credentials.horafin);
  //  console.log(credentials.fechafin);
  //  console.log(credentials.observaciones);
  //  console.log(credentials.destino);

   this.authService.completar().subscribe(
    response =>{
      console.log(response);
     
      
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
