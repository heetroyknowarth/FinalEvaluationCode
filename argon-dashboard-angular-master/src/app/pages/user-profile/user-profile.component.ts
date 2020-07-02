import { Component, OnInit, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constants';
import { HttpClient,HTTP_INTERCEPTORS } from '@angular/common/http';
 import { InterceptorService } from '../../interceptor.service';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
@NgModule({
  providers: [
     { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },    
  ],
})
export class UserProfileComponent implements OnInit {

  constructor(private router: Router,private httpClient: HttpClient) { }
  username="";
  displayData: any;
  imagePath: string;
  imgURL: any;
  message: string;
  selected_img;
  uploadStatus;

  ngOnInit() {
    if(localStorage.getItem('auth_token'))
    {
      // this.userFetch();
      this.router.navigate(['/user-profile']);
    }
    else
    {
      this.router.navigate(['/login']);
    }
  }
  userFetch(){
    

    //var headers_object = new HttpHeaders().set("Authorization", "Bearer " + token);
    this.httpClient.post(`${AppConstants.API_ENDPOINT}/fetchUser`,"").subscribe(
        (res: any) => {
          if (res) {
            this.username=res.name;
           console.log("User Success"+res.name);
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



  onchange(files, event) {
    if (files.length == 0) {
      return;
    }
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
  //   this.toastr.error(' Only images are supported ', 'Oops!');
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
    this.httpClient.post(`${AppConstants.API_ENDPOINT}/update`,formdata).subscribe(
      (response) => {
        // this.userprofileservice.userProfile.next(true);
     //   this.toastr.success('Updated successfully', 'Success!');
      },
      (error) => {
        //this.toastr.error(' Something went wrong ', 'Oops!');

      }
    );
  }

  // ngOnInit() {
  //   this.userprofileservice.display().subscribe(
  //     (response: DisplayClass) => {
  //       this.displayData = response;
  //     }
  //   );
  // }

  onUpdatePassword() {
    this.router.navigate(['rimscp/update-password']);
  }

}
