import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';


const API_URL = environment.api_url;

@Injectable()
export class AuthService {
    public isLoggedIn: boolean;
    public URL:any;
    userData: any;

    constructor(
      public http: HttpClient,
      private router: Router,
      private storage: Storage) { }

     public login(credentials: any): Observable<any> {
      let data = {
        username: credentials.username,
        password: credentials.password
      };

      return this.http
      .post(`http://54.233.178.103/Hops-Api-noti/Eventos/Login/Login.php`, data).pipe(
         map((response: any) => {
            // console.log(response);
            // let idrol = response.idrol;
            // console.log(idrol);
            // this.saveTokenLocalStorage(idrol);
            // return idrol;
            this.saveUserDataLocalStorage(response.userData);
            return response;

         }),catchError(this.handleError)
      );
    }

    public recuperar(credentials: any): any {
      let data = {
        username: credentials.username,
        password: credentials.password
      };

      return this.http
      .post(`http://54.233.178.103/Hops-Api-noti/Eventos/Login/Recupera.php`, data).pipe(
         map((response: any) => {
            return response;
         }),catchError(this.handleError)
      );
    }

    /*
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
    }*/

    public cancelar (id: any):any{
      this.URL = "http://54.233.178.103/Hops-Api-noti/Eventos/CancelarEvento.php?id=" + id;
     
      return this.http
      .get(this.URL,id).pipe(
        map((response: any) => {
           
           return response;

        }),catchError(this.handleError)
     );
    }

    public completar(credentials: any):any{
      let data = {
        idevento: credentials.idevento,
        idempresa: credentials.idempresa,
        horainicio: credentials.horainicio,
        fechainicio: credentials.fechainicio.substring(0,10),
        horafin: credentials.horafin,
        fechafin: credentials.fechafin.substring(0,10),
        observaciones: credentials.observaciones,
        destino: credentials.destino
      };

      //  console.log(data.horainicio);
      //  console.log(data.fechainicio);
      //  console.log(data.horafin);
      //  console.log(data.fechafin);
      //  console.log(data.observaciones);
      //  console.log(data.destino);

      //this.URL = "http://54.233.178.103/Hops-Api-noti/Eventos/ConfirmarEvento.php?id=1187&obs=aa&hi=2019-08-02 02:00&hf=2019-08-02 04:00&destino=1";

    this.URL = "http://54.233.178.103/Hops-Api-noti/Eventos/ConfirmarEvento.php?id=" +data.idevento+"&obs="+ data.observaciones +"&hi=" + data.fechainicio +" "+ data.horainicio + "&hf="  + data.fechafin +" "+ data.horafin + "&destino=" + data.destino;

    // console.log(this.URL);
    //  return true;
      return this.http
      .get(this.URL).pipe(
        map((response: any) => {
           
           return response;

        }),catchError(this.handleError)
      );
     }

    public eventsLoad(credentials: any): Observable<any> {
      let data = {
        numdoc: credentials.numdoc,
        open: false, 
        rol: credentials.rol,
        orgs: credentials.orgs,
        ano: credentials.año,
        mes:credentials.mes
      };
     
      console.log(data);
      return this.http
      .post(`http://54.233.178.103/Hops-Api-noti/Eventos/CargarEvento.php`, data).pipe(
        map((response: any) => {
           // console.log(response);
           return response;

        }),catchError(this.handleError)
     );
      ;
      // const response: any = {
      //     eventos: [
      //       {
      //         0: '10',
      //         1: 'Sala1',
      //         2: '2',
      //         3: 'CC:1018507596',
      //         4: 'Santiago Gamez ',
      //         5: '8',
      //         6: '2019/08/02 00:00:00',
      //         7: '2019/08/02 11:30:01',
      //         8: '2019/08/02 12:30:00',
      //         9: '2',
      //         10: '1145',
      //         11: '12',
      //         12: 'prueba',
      //         13: '211212',
      //         14: 'no necesario',
      //         15: '0',
      //         16: 'OBTENCION DE CORAZONPULMON SOD',
      //         17: 'Maria luisaSegovia,RamonPerez',
      //         idespaciofisico: '10',
      //         espaciofisico: 'Sala1',
      //         idpaciente: '2',
      //         ccpaciente: 'CC:1018507596',
      //         paciente: 'Santiago Gamez ',
      //         MONTHfecha: '8',
      //         fechaevento: '2019/08/02 00:00:00',
      //         fechahorainicio: '2019/08/02 11:30:01',
      //         fechahorafin: '2019/08/02 12:30:00',
      //         estado: '2',
      //         idevento: '1145',
      //         idconvenio: '12',
      //         diagnostico: 'prueba',
      //         tel_acompanante: '211212',
      //         req_adicionales: 'no necesario',
      //         pro_vpa: '0',
      //         procedimientos: 'OBTENCION DE CORAZONPULMON SOD',
      //         cirujanos: 'Maria luisaSegovia,RamonPerez'
      //       },
      //       {
      //         0: '16',
      //         1: 'Sala 4 (Ortopedia)',
      //         2: null,
      //         3: null,
      //         4: null,
      //         5: '8',
      //         6: '2019/08/02 00:00:00',
      //         7: '2019/08/02 07:00:01',
      //         8: '2019/08/02 10:00:00',
      //         9: '4',
      //         10: '1144',
      //         11: null,
      //         12: null,
      //         13: null,
      //         14: null,
      //         15: null,
      //         16: null,
      //         17: null,
      //         idespaciofisico: '16',
      //         espaciofisico: 'Sala 4 (Ortopedia)',
      //         idpaciente: null,
      //         ccpaciente: null,
      //         paciente: null,
      //         MONTHfecha: '8',
      //         fechaevento: '2019/08/02 00:00:00',
      //         fechahorainicio: '2019/08/02 07:00:01',
      //         fechahorafin: '2019/08/02 10:00:00',
      //         estado: '4',
      //         idevento: '1144',
      //         idconvenio: null,
      //         diagnostico: null,
      //         tel_acompanante: null,
      //         req_adicionales: null,
      //         pro_vpa: null,
      //         procedimientos: 'operacion pulmon',
      //         cirujanos: null
      //       }
      //     ]
      //   };

      // return response;
    }

    public orgLoad(credentials: any): any {
      const response: any = {        
          userDataOrg: [
              {
                  idempresa: '2',
                  0: '2',
                  nombreempresa: 'Medicina y Cirugia Plastica Lta.',
                  1: 'Medicina y Cirugia Plastica Lta.'
              },
              {
                  idempresa: '3',
                  0: '3',
                  nombreempresa: 'Fundación FaceArt',
                  1: 'Fundación FaceArt'
              },
              {
                  idempresa: '4',
                  0: '4',
                  nombreempresa: 'Fixed With Surgery S.A',
                  1: 'Fixed With Surgery S.A'
              },
              {
                  idempresa: '5',
                  0: '5',
                  nombreempresa: 'Clinica Traumatologia y Cirugia IPS',
                  1: 'Clinica Traumatologia y Cirugia IPS'
              },
              {
                  idempresa: '6',
                  0: '6',
                  nombreempresa: 'NexGen Alternative Medicine',
                  1: 'NexGen Alternative Medicine'
              }
          ]
      };

      return response;

    }

    public logout(): any {
     
      return this.storage.remove('app.userData').then(() => {
        this.router.navigate(['/home']);
      });
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