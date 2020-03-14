import { Component, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from './shared/web-socket.service';
import { Subject } from 'rxjs';
import { Athlete } from './shared/Athlete';
import { Activity, Type } from './shared/Activity';
import * as P from 'polyline-encoded';
import { MapComponent } from './map/map.component';
import * as moment from 'moment';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Pipe({name: 'enumToArray'})
export class EnumToArrayPipe implements PipeTransform {
  transform(value) : Object {
     return Object.keys(value).filter(e => !isNaN(+e)).map(o => { return {index: +o, name: value[o], value: value[o]}});
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public retrievingActivities = false;
  public calendarStart: NgbDateStruct;
  public calendarEnd: NgbDateStruct;
  public activityToPlot:Activity;
  
  private stateTitle = "Authorize/authenticate!!!";
  private stateAuthorization = "main";
  private windowHandleAuth;
  private messages: Subject<any>;
  private authSent: boolean;
  private athleteData: Athlete = null;
  private athleteActivities: Array<Activity> = new Array();
  private bc = new BroadcastChannel('tabsCommChannel');
  private lastDateSelected: moment.Moment;
  private types = Type;
  private keyTypes;

  @ViewChild(MapComponent)
  private mapComp: MapComponent;
  


  constructor(private activatedRoute: ActivatedRoute, 
    private wsService: WebSocketService) {
    this.keyTypes = Object.keys(this.types)
      .filter(e => !isNaN(+e))
      .map(o => { 
        if(this.types[o] == 'None')
          return {index: +o, name: this.types[o], value: ''}
        else
          return {index: +o, name: this.types[o], value: this.types[o]}
      });
    this.bc.addEventListener('message', (event) => {
      this.processMsgBC(event.data);
    });
   }

   get stateTitleValue() {
     return this.stateTitle;
   }

   get stateAuthorizationValue() {
     return this.stateAuthorization;
   }

   get athleteDataValue() {
     return this.athleteData;
   }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if(params['code'] && params['scope']) {
        // we are on the authorizatin page
        this.stateAuthorization = 'authorized';
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
    if(this.stateAuthorization == "authorization" && msg.state == "authorized") {
      // user has authorized, and the requests now the access token
      this.stateAuthorization = msg.state;
      if(msg.code != null && msg.state != null && msg.scope != null)
        this.getBearerToken(msg.code, msg.state, msg.scope);
    }
  }

  getAuthorizationState() {
    this.wsService.getAuthorizationState()
      .subscribe((data) => {
        this.stateAuthorization = data.state;
        if(this.stateAuthorization == "authorized")
        {
          this.stateTitle = "Authorized!";
          // let's query athlete data
          this.getAthleteInfo();
          // this.updateAthleteActivitiesList();
        } else if(this.stateAuthorization == "expired" ) {
          this.stateTitle = "Expired!";
        } else if(this.stateAuthorization == "non-authorized" ) {
          this.stateTitle = "Non authorized";
          // require authorization
        }
      });
  }

  authorize() {
    this.wsService.authorize()
      .subscribe((data: string) => {
        this.windowHandleAuth = window.open(data, 'OAuth2 Login', "width=500, height=600, left=0, top=0");
        this.stateAuthorization = "authorization";
      });
  }

  refreshToken() {
    this.wsService.refreshToken()
      .subscribe((data) => {
        if(data.message != "Bad Request")
          this.stateAuthorization = "refreshing";
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

  updateAthleteActivitiesList(beginning: moment.Moment, end: moment.Moment ) {
    // by default, just look two months back
    
    this.retrievingActivities = true;
    try {
      this.wsService.getAthleteActivitiesIntersectionArea(beginning, end, this.mapComp.getMapBounds()).subscribe((data) => {
          if(data.length > 0) {
            this.athleteActivities.length = 0;
            this.mapComp.cleanMap();
            data.forEach((element: any)  => {
              // decode the encoded map
               if(element.map.summary_polyline_decoded != null) {
                // if the map is available and is successfully encoded
                // if(this.mapComp.checkPlotVisible(element.map.summary_polyline_decoded)) {
                  // create a new activity
                  var act : Activity = new Activity (
                    element.id, element.name, element.distance, element.moving_time,
                    element.elapsed_time, element.total_elevation_gain, element.type,
                    element.workout_type, element.start_date, element.start_date,
                    element.timezone, element.number, element.start_latlng, 
                    element.end_latlng, element.loation_city, element.locatio_state,
                    element.location_country,
                    element.map.summary_polyline_decoded
                  );
                  this.athleteActivities.push(act);
                  this.mapComp.plotActivity(act);
                }
              // }
            });
          }
          
        });
    } finally {
      this.retrievingActivities = false;
    }
  }

  updateActivityToPlot(activity: Activity) {
    this.activityToPlot = activity;
  }

  plotActivitiesAreaSinceTimeSelected() {
    if(this.calendarEnd) {
      var dateEndSelected = moment().year(this.calendarEnd.year).month(this.calendarEnd.month - 1).date(this.calendarEnd.day);
      if(dateEndSelected.isAfter(moment()))
        dateEndSelected = moment();
    }
    else
      var dateEndSelected = moment();
    if(this.calendarStart) {
      var dateBeginSelected = moment().year(this.calendarStart.year).month(this.calendarStart.month - 1).date(this.calendarStart.day);
      if(dateBeginSelected.isAfter(moment()))
        dateBeginSelected = moment().subtract(2, 'months');
    }
    else
      var dateBeginSelected = moment().subtract(2, 'months');
    if(dateBeginSelected.isBefore(dateEndSelected))
      this.updateAthleteActivitiesList(dateBeginSelected, dateEndSelected);
    else
      alert("Dates are not valid"); 
  }

}
