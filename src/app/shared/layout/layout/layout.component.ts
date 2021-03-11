import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  // @ViewChild('sidemenu') snav: MatSidenav;;
  // @ViewChild('sidemenu') snavright: MatSidenav;;
  sideNavOpened = true;
  rightsideNavOpened=false;
  sideNavMode: MatDrawerMode = 'over';
  toolBarHeight = 64;
  buckettypeval='ML';
  servicelineval='0';
  searchfilterval='All';
  private readonly mediaWatcher: Subscription;
  constructor(media: MediaObserver) {
    this.mediaWatcher = media.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'sm' || change.mqAlias === 'xs') {
        if (this.sideNavOpened) {
          this.sideNavOpened = false;
          this.rightsideNavOpened=false;
        }
        this.sideNavMode = 'over';
      } else {
        this.sideNavOpened = false;
        this.rightsideNavOpened=false;
        this.sideNavMode = 'over';
      }
      if (change.mqAlias === 'xs') {
        this.toolBarHeight = 56;
      } else {
        this.toolBarHeight = 64;
      }
    });
  }
  ngOnInit() { }

  ngOnDestroy(): void {
    this.mediaWatcher.unsubscribe();
  }
}
