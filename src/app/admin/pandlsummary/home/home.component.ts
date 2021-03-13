import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlSummary } from 'src/app/models';
import { MasterDataService } from 'src/app/_services';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  summarylist: Array<PlSummary> = []
  role?: string = '';
  lastupdated: Date = new Date();
  subscription1!: Subscription;
    servicelineid:string="8";

  constructor(private sessionservice: MasterDataService) {
    this.subscription1 = this.sessionservice.commonSessionObjs.subscribe(r => {
      console.log('contructor', r,this.sessionservice.commonSession);
      this.getRole();
    });
  }

  getRole() {
    this.role = this.sessionservice.commonSession.Role?.rolename;
    this.lastupdated = new Date();
  }

  onServicelineChanged(sid:any)
  {
    console.log("PNL ", sid);
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
  }

  ngOnInit() {
    this.summarylist = [
      {

        head: 'Total FY 2021 (A+B)',
        showcap: false,
        data: [{ desc: 'Rev $', value: 11986545123.32, status: '' }, { desc: 'Cost $', value: 11986545123.32, status: '' }, { desc: 'CP %', value: 23.32, status: '' }]
      },
      {

        head: 'YTD Actuals (A)',
        showcap: false,
        data: [{ desc: 'Rev $', value: 11986545123.32, status: '' }, { desc: 'Cost $', value: 11986545123.32, status: '' }, { desc: 'CP %', value: 23.32, status: '' }]
      },
      {

        head: 'Forecast (C+D)',
        showcap: false,
        data: [{ desc: 'Rev $', value: 11986545123.32, status: '' }, { desc: 'Cost $', value: 11986545123.32, status: '' }, { desc: 'CP %', value: 23.32, status: '' }]
      },
      {

        head: 'System Predictoin (C)',
        showcap: false,
        data: [{ desc: 'Rev $', value: 11986545123.32, status: '' }, { desc: 'Cost $', value: 11986545123.32, status: '' }, { desc: 'CP %', value: 23.32, status: '' }]
      },
      {

        head: 'Adjustment (DB)',
        showcap: true,
        data: [{ desc: 'Rev $', value: 11986545123.32, status: 'green' }, { desc: 'Cost $', value: 11986545123.32, status: 'amber' }, { desc: 'CP %', value: 23.32, status: '' }],
        cap: [{ desc: 'Revenue', value: 30.32 }, { desc: 'Cost', value: 25.32 }]
      }
    ];
  }
}
