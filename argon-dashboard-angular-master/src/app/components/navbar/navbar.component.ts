import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {HttpEvent,HttpInterceptor,HttpHandler,HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppConstants } from 'src/app/app.constants';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  authUser;
  data;
  username="";
  name="";
  image="";
  displayData: any;
  imagePath: string;
  imgURL: any;
  message: string;
  selected_img;
  uploadStatus;
  public listTitles: any[];
  public location: Location;
  constructor(location: Location,  private element: ElementRef, private router: Router,private httpClient: HttpClient) {
    this.location = location;
  }
  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    this.userFetch();
  }
  getTitle(){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
        titlee = titlee.slice( 1 );
    }

    for(var item = 0; item < this.listTitles.length; item++){
        if(this.listTitles[item].path === titlee){
            return this.listTitles[item].title;
        }
    }
    return 'Dashboard';
  }

  onchange(files, event) {
    if (files.length == 0) {
      return;
    }
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
    this.selected_img = event.target.files[0];
    this.onUpload();
  }

  onUpload() {
    const formdata = new FormData();
    formdata.append('avatar', this.selected_img, this.selected_img.name);
    console.log(formdata);
    this.httpClient.post(`${AppConstants.API_ENDPOINT}/update`,formdata).subscribe(
      (response) => {
        this.userFetch();
      },
      (error) => {
      }
    );
  }

  updateName(){
    this.authUser = {
      name: this.name
    };
    console.log(this.authUser)
    this.httpClient.post(`${AppConstants.API_ENDPOINT}/username`,this.authUser).subscribe(
      (res: any) => {
        if (res) {
          this.userFetch();
        } else {
          console.log("error");
        }

      }, (error) => {
      }
    );
  }

  userFetch(){
    this.httpClient.post(`${AppConstants.API_ENDPOINT}/fetchUser`,"").subscribe(
        (res: any) => {
          if (res) {
            this.username=res.name;
            this.image=res.custom_avatar;
          } else {
            console.log("error");
          }
      }, (error) => {
        }
    );
  }
  onLogout() {
    this.httpClient.get(`${AppConstants.API_ENDPOINT}/logout`).subscribe(
      (res: any) => {
        if (res) {
         console.log("User Success"+res);
         localStorage.clear();
         this.router.navigate(['/login']);
        } else {
          console.log("error");
        }

      }, (error) => {
      }
  );
 
  }

}
