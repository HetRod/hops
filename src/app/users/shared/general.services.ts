import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

const API_URL = environment.api_url;

@Injectable()
export class AuthService {
    public isLoggedIn: boolean;

    constructor(
      public http: HttpClient,
      private storage: Storage) { }

    // public login(credentials: any): Observable<any> {
    //   let data = {
    //     username: credentials.username,
    //     password: credentials.password
    //   };

    //   return this.http
    //   .post(`http://54.233.178.103/api/index.php/login`, data).pipe(
    //      map((response: any) => {
    //        console.log(response);
    //        let idrol = response.idrol;
    //        this.saveTokenLocalStorage(idrol);
    //        return idrol;

    //      }),catchError(this.handleError)
    //   );
    // }

    public login(credentials: any): any {
      let response: any = {
        userData: {
          idusuario: '8',
          idrol: '2',
          nombres: 'usuario',
          apellidos: 'Administrador',
          correoelectronico: 'edgar.castillo@nexgen-soluciones.com',
          usuario: 'admin',
          idempresa: '3',
          nombreempresa: 'Fundación FaceArt',
          numerodocumento: '1018765432',
          token: '6f927d7fbba48734cdb9a8b1734269e6954ff9f65d7f140e56d08d35adf0d117'
        }
      };

      this.saveUserDataLocalStorage(response.userData);
      return response;
    }

    public eventsLoad(credentials: any): any {
      const response: any = {
          eventos: [
            {
              0: '10',
              1: 'Sala1',
              2: '2',
              3: 'CC:1018507596',
              4: 'Santiago Gamez ',
              5: '8',
              6: '2019/08/02 00:00:00',
              7: '2019/08/02 11:30:01',
              8: '2019/08/02 12:30:00',
              9: '2',
              10: '1145',
              11: '12',
              12: 'prueba',
              13: '211212',
              14: 'no necesario',
              15: '0',
              16: 'OBTENCION DE CORAZONPULMON SOD',
              17: 'Maria luisaSegovia,RamonPerez',
              idespaciofisico: '10',
              espaciofisico: 'Sala1',
              idpaciente: '2',
              ccpaciente: 'CC:1018507596',
              paciente: 'Santiago Gamez ',
              MONTHfecha: '8',
              fechaevento: '2019/08/02 00:00:00',
              fechahorainicio: '2019/08/02 11:30:01',
              fechahorafin: '2019/08/02 12:30:00',
              estado: '2',
              idevento: '1145',
              idconvenio: '12',
              diagnostico: 'prueba',
              tel_acompanante: '211212',
              req_adicionales: 'no necesario',
              pro_vpa: '0',
              procedimientos: 'OBTENCION DE CORAZONPULMON SOD',
              cirujanos: 'Maria luisaSegovia,RamonPerez'
            },
            {
              0: '16',
              1: 'Sala 4 (Ortopedia)',
              2: null,
              3: null,
              4: null,
              5: '8',
              6: '2019/08/02 00:00:00',
              7: '2019/08/02 07:00:01',
              8: '2019/08/02 10:00:00',
              9: '4',
              10: '1144',
              11: null,
              12: null,
              13: null,
              14: null,
              15: null,
              16: null,
              17: null,
              idespaciofisico: '16',
              espaciofisico: 'Sala 4 (Ortopedia)',
              idpaciente: null,
              ccpaciente: null,
              paciente: null,
              MONTHfecha: '8',
              fechaevento: '2019/08/02 00:00:00',
              fechahorainicio: '2019/08/02 07:00:01',
              fechahorafin: '2019/08/02 10:00:00',
              estado: '4',
              idevento: '1144',
              idconvenio: null,
              diagnostico: null,
              tel_acompanante: null,
              req_adicionales: null,
              pro_vpa: null,
              procedimientos: 'operacion teta',
              cirujanos: null
            }
          ]
        };

      return response;
    }

    public getUserData(): Promise<any> | any {
      return this.storage.get('app.userData').then(val => {
        const userData = val;
        return userData;
      });
    }

    public saveTokenLocalStorage(token: any): Promise<any> {
      return this.storage.set('app.token', token);
    }

    public saveUserDataLocalStorage(userData: any): Promise<any> {
      return this.storage.set('app.userData', userData);
    }

    public handleError(error: any) {
        console.log(error);
        if (error.error.non_field_errors) {
          return throwError(error.error.non_field_errors.pop());
        }
        let errorResponse;
        Object.keys(error.error).forEach(key => {
          let errorMsg = error.error[key].pop();
          errorResponse = `${key}: ${errorMsg}`;
          return throwError(errorResponse);
        });
        return throwError(errorResponse);
      }
}