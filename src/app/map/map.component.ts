import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Input } from '@angular/core';
import * as L from 'leaflet';
import { Activity } from '../shared/Activity';
import { Subject } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map;
  private onChanges = new Subject<SimpleChanges>();
  // There are two ways of detecting and acting up on when an input changes in the child component
  @Input() activityToPlot:Activity;

  constructor() { }

  ngOnInit() {
    this.onChanges.subscribe((data:SimpleChanges)=>{
      this.cleanMap();
      // this.plotMarker(data.activityToPlot.currentValue.start_latlng);
      // this.plotPolyline(data.activityToPlot.currentValue.map.summary_polyline);
    });
  }


  public cleanMap() {
    for(var i in this.map._layers) {
      if(this.map._layers[i] instanceof L.Polyline|| this.map._layers[i] instanceof L.Marker ) {
        try {
          this.map.removeLayer(this.map._layers[i]);
        }
        catch(e) {
            console.log("problem with " + e + this.map._layers[i]);
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.onChanges.next(changes);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [ 49.353756, 11.967361 ],
      zoom: 5
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);
    this.map.on('moveend', (e: any)=> {
      this.getMapBounds();
    })
  }

  getMapBounds() {
    // var width = this.map.getBounds().getEast() - this.map.getBounds().getWest();
    // var height = this.map.getBounds().getNorth() - this.map.getBounds().getSouth();

    return this.map.getBounds();
  }

  public checkPlotVisible(plot: any) {
    var pol:any = L.polyline(plot);
    return this.map.getBounds().intersects( pol.getBounds() );
  }

  public plotActivity(activity: Activity) {
    var pol:any = L.polyline(
      activity.decodedMap,
      {
          color: 'blue',
          weight: 2,
          opacity: .7,
          lineJoin: 'round'
      });
    pol.on('mouseover', function() {
      this.setStyle({
        weight: 6
      });
    });
    pol.on('mouseout', function() {
      this.setStyle({
        weight: 2
      });
    });
    pol.addTo(this.map);
    var marker = L.marker(activity.start_latlng);
    marker.on('mouseover', function() {
      pol.setStyle({ weight: 6});
    });
    marker.on('mouseout', function() {
      pol.setStyle({ weight: 2});
    });
    //marker.options = activity;
    marker.addTo(this.map);
    marker.bindPopup("<b><a href=\"https://www.strava.com/activities/" + activity.id + "\" target=\"_blank\">" + activity.name + "</a></b><br>" + moment(activity.start_date_local).format("dddd, MMMM Do YYYY, h:mm:ss a"));
  }

}
