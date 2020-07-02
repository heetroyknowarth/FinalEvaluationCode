import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from 'src/app/app.constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;

  constructor(private router: Router,private httpClient: HttpClient) { }

  ngOnInit() {

    if(localStorage.getItem('auth_token'))
    {
      //this.userFetch();
      this.router.navigate(['/dashboard']);
    }
    else
    {
      this.router.navigate(['/login']);
    }

    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];


    var chartOrders = document.getElementById('chart-orders');

    parseOptions(Chart, chartOptions());


    var ordersChart = new Chart(chartOrders, {
      type: 'bar',
      options: chartExample2.options,
      data: chartExample2.data
    });

    var chartSales = document.getElementById('chart-sales');

    this.salesChart = new Chart(chartSales, {
			type: 'line',
			options: chartExample1.options,
			data: chartExample1.data
		});
  }





  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
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
