import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-evendetail',
  templateUrl: './evendetail.page.html',
  styleUrls: ['./evendetail.page.scss'],
})
export class EvendetailPage implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    let evento = this.router.getCurrentNavigation().extras.state;
    
    console.log(evento.evento);
    
  }



}
