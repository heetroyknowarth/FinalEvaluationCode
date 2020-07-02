import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class JWtInterceptor implements HttpInterceptor {
      constructor() {}
      intercept(request: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {
    
        let token='Bearer '+localStorage.getItem('auth_token');
        // console.log("YEs call "+token);
        if(token){
         request= request.clone({
          setHeaders:{
            Authorization: token
          }
        })}
        return next.handle(request);
   
  }
}