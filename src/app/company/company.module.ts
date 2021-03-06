import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';


import { IonicModule } from '@ionic/angular';

import { CompanyPage } from './company.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyPage
  }
];

registerLocaleData(localeEsAr, 'es-Ar');

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CompanyPage],

})
export class CompanyPageModule {}
