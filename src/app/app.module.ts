import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DemoMaterialModule } from './material-module/material-module.module';

import { AppComponent, EnumToArrayPipe } from './app.component';
import { ConnectivityService } from './shared/connectivity.service';
import { AthleteDataComponent } from './athlete-data/athlete-data.component';
import { ListActivityComponent } from './list-activity/list-activity.component';
import { MapComponent } from './map/map.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DemoMaterialModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    AthleteDataComponent,
    ListActivityComponent,
    MapComponent,
    EnumToArrayPipe
  ],
  providers: [
    ConnectivityService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
