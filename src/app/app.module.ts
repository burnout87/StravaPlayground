import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { WebSocketService } from './shared/web-socket.service';
import { AthleteDataComponent } from './athlete-data/athlete-data.component';

@NgModule({
  declarations: [
    AppComponent,
    AthleteDataComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([])
  ],
  providers: [WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
