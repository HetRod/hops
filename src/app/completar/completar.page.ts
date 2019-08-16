import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../users/shared/general.services';



@Component({
  selector: 'app-completar',
  templateUrl: './completar.page.html',
  styleUrls: ['./completar.page.scss'],
})
export class CompletarPage implements OnInit {

  public evento: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private  authService:  AuthService

  ) { }

  ngOnInit() {
    this.evento = this.router.getCurrentNavigation().extras.state;
    console.log(this.evento);
    this.completeForm.reset();
  }

  login(form){
    console.log(form);
    // this.authService.login(form.value).subscribe((res)=>{
    //   this.router.navigateByUrl('home');
    // });
  }

  completeForm = new FormGroup({
    horainicio: new FormControl('', [Validators.required]),
    horafin: new FormControl('', [Validators.required]),
    observaciones: new FormControl('', [Validators.required]),
    destino: new FormControl('', [Validators.required])
  });

  back(evento){
    //console.log(evento);
    this.router.navigate(['/evendetail'],{ state: {evento: evento } });
  }

  

}
