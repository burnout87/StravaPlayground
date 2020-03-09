import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { WebSocketService } from './shared/web-socket.service';
import { AthleteDataComponent } from './athlete-data/athlete-data.component';
import { ListActivityComponent } from './list-activity/list-activity.component';
import { MapComponent } from './map/map.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgbModule
  ],
  declarations: [
    AppComponent,
    AthleteDataComponent,
    ListActivityComponent,
    MapComponent
  ],
  providers: [WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
