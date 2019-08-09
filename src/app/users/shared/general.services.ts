import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';

const API_URL = environment.api_url;

@Injectable()

export class AuthService {
    public isLoggedIn: boolean;

    constructor( 
      private http: HttpClient,
      private storage: Storage) { }

    public login(credentials: any): Observable<any> {
      let data = {
        username: credentials.phone_number,
        password: credentials.password
      };

      return this.http
      .post(`${API_URL}/login/`, data).pipe(
         map((response:any) => {
           let idrol = response.idrol;
           this.saveTokenLocalStorage(idrol);
           return idrol;

         }),catchError(this.handleError)
      );
    }

    public saveTokenLocalStorage(token: any): Promise<any> {
      return this.storage.set('app.token', token);
    }

   
    public handleError(error: any) {
        console.log(error)
        if (error.error.non_field_errors){
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