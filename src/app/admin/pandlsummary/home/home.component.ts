import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlSummary } from 'src/app/models';
import { MasterDropdown } from 'src/app/_models';
import { MasterDataService } from 'src/app/_services';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  summarylist: Array<PlSummary> = [];
  servicelineid: string = "0";

  bucketlist: Array<MasterDropdown> = [];
  bucketTypeID: string = '';
  role?: string = '';
  lastupdated: Date = new Date();
  subscription1!: Subscription;


  constructor(private sessionservice: MasterDataService) {
    this.subscription1 = this.sessionservice.commonSessionObjs.subscribe(r => {
      console.log('contructor', r, this.sessionservice.commonSession);
      this.getRole();
    });
  }

  getRole() {
    this.role = this.sessionservice.commonSession.Role?.rolename;
    this.lastupdated = new Date();
  }

  onServicelineChanged(sid: any) {
    console.log("PNL ", sid);
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
  }

  ngOnInit() {
    this.bindData();
  }

  bindData() {
    this.sessionservice.getBucketType({ horzid: this.servicelineid }).subscribe(s => {
      this.bucketlist = s;
      if (this.bucketlist && this.bucketlist.length > 0) {
        this.bucketTypeID = this.bucketlist.find(f => f.isdefault == true)?.id || '';
      }
    });

    this.sessionservice.getPandLSummary({ horzid: this.servicelineid }).subscribe(s => {
      this.summarylist = s;
    });
  }
}
