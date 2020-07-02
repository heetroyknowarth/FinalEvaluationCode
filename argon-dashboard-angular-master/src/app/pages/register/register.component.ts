import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import { AppConstants } from 'src/app/app.constants';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  authUser;
  name='';
  emailAddress = '';
  password = '';
  user: any;
  constructor(private router: Router,private httpClient: HttpClient) {}
  ngOnInit() {
    if(localStorage.getItem('auth_token'))
    {
      this.router.navigate(['/dashboard']);
    }
    else
    {
      this.router.navigate(['/register']);
    }
  }

  register(){
    this.authUser = {
      name: this.name,
      email: this.emailAddress,
      password: this.password
    };
    this.httpClient.post(`${AppConstants.API_ENDPOINT}/register`,this.authUser).subscribe(
        (res: any) => {
          if (res) {
            this.router.navigate(['/#/login']);
           console.log("Register Success");
          } else {
            console.log("error");
          }

        }, (error) => {
        }
    );
  }

}
