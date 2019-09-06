import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
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
      .post(`https://cors-anywhere.herokuapp.com/http://54.233.178.103/Hops-Api-noti/Eventos/Login/Login.php`, data).pipe(
         map((response: any) => {
             console.log(response);
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
      .post(`https://cors-anywhere.herokuapp.com/http://54.233.178.103/Hops-Api-noti/Eventos/Login/Recupera.php`, data).pipe(
         map((response: any) => {
            return response;
         }),catchError(this.handleError)
      );
    }

  
    public cancelar (id: any):any{
      this.URL = "https://cors-anywhere.herokuapp.com/http://54.233.178.103/Hops-Api-noti/Eventos/CancelarEvento.php?id=" + id;
     
      return this.http
      .get(this.URL,id).pipe(
        map((response: any) => {

       
           
           return response;


        }),catchError(this.handleError)
     );
    }

    public showEvento (id:any):any{
      this.URL = "https://cors-anywhere.herokuapp.com/http://54.233.178.103/Hops-Api-noti/Eventos/VerEvento.php?id=" + id;
     
      return this.http
      .get(this.URL,id).pipe(
        map((response: any) => {
           return response;
        }),catchError(this.handleError)
     );
    }

    public notiCancel (data:any):any{
     // console.log(data);
     
      return this.http
      .post(`https://cors-anywhere.herokuapp.com/http://54.233.178.103/Hops-Api-noti/Eventos/Notificacion/NotiUpdate.php`, data).pipe(
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

      this.URL = "https://cors-anywhere.herokuapp.com/http://54.233.178.103/Hops-Api-noti/Eventos/ConfirmarEvento.php?id=" +data.idevento+"&obs="+ data.observaciones +"&hi=" + data.fechainicio +" "+ data.horainicio + "&hf="  + data.fechafin +" "+ data.horafin + "&destino=" + data.destino;
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
      .post(`https://cors-anywhere.herokuapp.com/http://54.233.178.103/Hops-Api-noti/Eventos/CargarEvento.php`, data).pipe(
        map((response: any) => {
           console.log(response);
           return response;

        }),catchError(this.handleError)
     );
      
    
    }

    public orgLoad(credentials: any): any {

      let data = {
        username: credentials.username,
        password: credentials.password
      };
      console.log(data);
      return this.http
      .post(`https://cors-anywhere.herokuapp.com/http://54.233.178.103/Hops-Api-noti/Eventos/OrgBusqueda.php`, data).pipe(
         map((response: any) => {
            console.log(response);
            return response;
         }),catchError(this.handleError)
      );
    }

   

    public saveTokenBD(data:any) : any{
      return this.http
      .post(`https://cors-anywhere.herokuapp.com/http://54.233.178.103/Hops-Api-noti/Eventos/Login/SaveToken.php`, data).pipe(
         map((response: any) => {
            // console.log(response);
            // return response;
         })
      );
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

    public notificacionFCM(notificacion){
      var link ="https://cors-anywhere.herokuapp.com/https://fcm.googleapis.com/fcm/send";
      var key= "AIzaSyAXMoWA60pQ67qIARiBRDbeS_9Ci1i8JZc";

      var data={
        "to": notificacion.token,
        "notification": {
          "title": notificacion.title,
          "body": notificacion.body,
          "sound": "default",
          "click_action": "FCM_PLUGIN_ACTIVITY",
          "icon": "fcm_push_icon"
        },
        "data": {
          "title": notificacion.title,
          "body": notificacion.body
        },
      }

      let headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'key='+key
      });
    
     

      return this.http.post(link,data, { headers: headers })
      .pipe(map((response: any) => {
      
      }),catchError(this.handleError));
    
    }
      
}