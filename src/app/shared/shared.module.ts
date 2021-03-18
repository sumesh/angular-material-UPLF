import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RouterTabs } from './router-tab/router-tabs.directive';
import { RouterTab } from './router-tab/router-tab.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ServicelineComponent } from './serviceline/serviceline.component';
import { CallbackPipe } from './filter/callback.filter';
import { GridComponent } from './grid/grid.component';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    RouterModule, 
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,

    //Material
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,  
    MatRadioModule,
    MatButtonModule,
  ],

  declarations: [
    PageNotFoundComponent,
    ServicelineComponent,
    GridComponent,
    RouterTabs,
    RouterTab ,
    CallbackPipe   
  ],
  exports: [
    CommonModule,
    RouterModule, 
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    PageNotFoundComponent,
    RouterTabs,
    RouterTab,
    ServicelineComponent,
    GridComponent,
    CallbackPipe
  ]
})
export class SharedModule { }
