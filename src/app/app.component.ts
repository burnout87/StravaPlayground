import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from './shared/web-socket.service';
import { Subject } from 'rxjs';
import { Athlete } from './shared/Athlete';
import { Activity } from './shared/Activity';
import * as P from 'polyline-encoded';
import { MapComponent } from './map/map.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private windowHandleAuth;
  private stateTitle = "Authorize/authenticate!!!";
  private state = "main";
  private messages: Subject<any>;
  private authSent: boolean;
  private athleteData: Athlete = null;
  private athleteActivities: Array<Activity> = new Array();
  private bc = new BroadcastChannel('tabsCommChannel');
  private activityToPlot:Activity;

  @ViewChild(MapComponent, {static: false})
  private mapComp: MapComponent;
  
  constructor(private activatedRoute: ActivatedRoute, 
    private wsService: WebSocketService) {
    this.bc.addEventListener('message', (event) => {
      this.processMsgBC(event.data);
    });
   }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if(params['code'] && params['scope']) {
        // we are on the authorizatin page
        this.state = 'authorized';
        const code = params['code'];
        const scope = params['scope'];
        const state = params['state'];
        
        this.stateTitle = "Authorized!"

        let obj = JSON.stringify( {
          "code": code,
          "scope": scope,
          "state": state,
          "stateTitle": this.stateTitle
        });
        this.bc.postMessage(obj);
        window.close();
      } 
      else {
        // not on the authorization page, let's check the authorization state
        this.getAuthorizationState();
      }
    });
  }

  processMsgBC(message:any) {
    var msg = JSON.parse(message);
    this.stateTitle = msg.stateTitle;
    if(this.state == "authorization" && msg.state == "authorized") {
      // user has authorized, and the requests now the access token
      this.state = msg.state;
      if(msg.code != null && msg.state != null && msg.scope != null)
        this.getBearerToken(msg.code, msg.state, msg.scope);
    }
  }

  getAuthorizationState() {
    this.wsService.getAuthorizationState()
      .subscribe((data) => {
        this.state = data.state;
        if(this.state == "authorized")
        {
          this.stateTitle = "Authorized!";
          // let's query athlete data
          this.getAthleteInfo();
          this.updateAthleteActivitiesList();
        } else if(this.state == "expired" ) {
          this.stateTitle = "Expired!";
        } else if(this.state == "non-authorized" ) {
          this.stateTitle = "Non authorized";
          // require authorization
        }
      });
  }

  authorize() {
    this.wsService.authorize()
      .subscribe((data: string) => {
        this.windowHandleAuth = window.open(data, 'OAuth2 Login', "width=500, height=600, left=0, top=0");
        this.state = "authorization";
      });
  }

  refreshToken() {
    this.wsService.refreshToken()
      .subscribe((data) => {
        if(data.message != "Bad Request")
          this.state = "refreshing";
      });
  }

  getAthleteInfo() {
    this.wsService.getAthleteInfo()
      .subscribe((data) => {
        this.athleteData = new Athlete(
          data.id,
          data.username,
          data.firstname,
          data.lastname,
          data.city,
          data.state,
          data.country
        );
    });
  }

  getBearerToken(code: string, state: string, scope: string) {
    this.wsService.getBearerToken(code, state, scope)
      .subscribe((data) => {
        this.athleteData = new Athlete(
          data.athlete.id,
          data.athlete.username,
          data.athlete.firstname,
          data.athlete.lastname,
          data.athlete.city,
          data.athlete.state,
          data.athlete.country
        );
      });
  }

  updateAthleteActivitiesList() {
    this.wsService.getAthleteActivitiesLastMonth()
      .subscribe((data) => {
        this.athleteActivities.length = 0;
        data.forEach((element: any)  => {
          if(element.map.summary_polyline != null) {
            var encodedMap: any = P.decode(element.map.summary_polyline);
          }
          this.athleteActivities.push(new Activity(
            element.id, element.name, element.distance, element.moving_time,
            element.elapsed_time, element.total_elevation_gain, element.type,
            element.workout_type, element.start_date, element.start_date,
            element.timezone, element.number, element.start_latlng, 
            element.end_latlng, element.loation_city, element.locatio_state,
            element.location_country,
            encodedMap
          ));
        });
    });
  }

  updateActivityToPlot(activity: Activity) {
    this.activityToPlot = activity;
  }

  plotActivitiesAreaLastMonth() {
    this.mapComp.cleanMap();
    this.athleteActivities.forEach((activity:Activity) => {
      if(activity.encodedMap != null)
        this.mapComp.checkActivityVisible(activity);
    });
  }

}
