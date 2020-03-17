import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { AppComponent, EnumToArrayPipe } from './app.component';
import { ConnectivityService } from './shared/connectivity.service';
import { AthleteDataComponent } from './athlete-data/athlete-data.component';
import { ListActivityComponent } from './list-activity/list-activity.component';
import { MapComponent } from './map/map.component';
import { AppRoutingModule } from './app-routing.module';
import { LoaderComponent } from './loader/loader.component';
import { LoaderService } from './loader.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    LoaderComponent
  ],
  declarations: [
    AppComponent,
    AthleteDataComponent,
    ListActivityComponent,
    MapComponent,
    EnumToArrayPipe,
    LoaderComponent
  ],
  providers: [LoaderService, ConnectivityService],
  bootstrap: [AppComponent]
})
export class AppModule { }
