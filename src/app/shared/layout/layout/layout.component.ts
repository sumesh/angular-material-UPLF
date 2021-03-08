import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { MatDrawerMode } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  sideNavOpened = true;
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
        }
        this.sideNavMode = 'over';
      } else {
        this.sideNavOpened = false;
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