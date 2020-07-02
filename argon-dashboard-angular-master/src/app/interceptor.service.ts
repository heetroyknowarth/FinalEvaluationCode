import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor() { }
  intercept(req,next){
    let token='Bearer '+localStorage.getItem('auth_token');
    console.log("YEs call "+token);
    if(token){
     req = req.clone({
      setHeaders:{
        Authorization: token
      }
    })}
    return next.handle(req);
  }
}
