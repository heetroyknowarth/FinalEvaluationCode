import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from 'src/app/app.constants';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss']
})
export class IconsComponent implements OnInit {

  public copy: string;
  constructor(private router: Router,private httpClient: HttpClient) { }

  ngOnInit() {
    this.userFetch();
  }

  userFetch(){
    

    //var headers_object = new HttpHeaders().set("Authorization", "Bearer " + token);
    this.httpClient.post(`${AppConstants.API_ENDPOINT}/fetchUser`,"").subscribe(
        (res: any) => {
          if (res) {
            // this.username=res.name;
            // this.image=res.custom_avatar;
           console.log("User Success "+res.name);
          } else {
            console.log("error");
            // this.toastr.error(' Invalid Credentials ', 'Oops!');

          }

        }, (error) => {
          //this.toastr.error(' Something Went Wrong ', 'Oops!');
          //this._snackBar.errorSnackBar('Invalid Credentials ', '');
        }
    );
  }
}
