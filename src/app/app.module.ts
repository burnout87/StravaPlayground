import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WebSocketService } from './shared/web-socket.service';
import { AthleteDataComponent } from './athlete-data/athlete-data.component';
import { ListActivityComponent } from './list-activity/list-activity.component';
import { MapComponent } from './map/map.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    AthleteDataComponent,
    ListActivityComponent,
    MapComponent,
    AuthorizationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
