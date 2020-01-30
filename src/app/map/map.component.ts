import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Input } from '@angular/core';
import * as L from 'leaflet';
import { Activity } from '../shared/Activity';
import { Subject } from 'rxjs';
import * as P from 'polyline-encoded';

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
      this.plotMarker(data.activityToPlot.currentValue.start_latlng);
      this.plotPolyline(data.activityToPlot.currentValue.map.summary_polyline);
    });
  }


  public cleanMap() {
    for(var i in this.map._layers) {
      if(this.map._layers[i]._path != undefined) {
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
      center: [ 39.8282, -98.5795 ],
      zoom: 13
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
    var width = this.map.getBounds().getEast() - this.map.getBounds().getWest();
    var height = this.map.getBounds().getNorth() - this.map.getBounds().getSouth();
  }

  public checkPolylineVisible(polylineCoords: any, startMarkerCoords: any) {
    var pol:any = L.polyline(
      polylineCoords,
      {
          color: 'blue',
          weight: 2,
          opacity: .7,
          lineJoin: 'round'
      });
    if (this.map.getBounds().intersects( pol.getBounds() )) {
      pol.addTo(this.map);
      this.plotMarker(startMarkerCoords);
    }
  }

  public plotMarker(marker: any) {
    if(marker != null) {
      var marker = L.marker(marker);
      marker.addTo(this.map);
      // this.map.panTo(marker._latlng, 15);
    }
  }

  public plotPolyline(polylineCoords: any) {
    if(polylineCoords != null) {
      // var coordinates = P.decode(polyline);
      L.polyline(
        polylineCoords,
        {
            color: 'blue',
            weight: 2,
            opacity: .7,
            lineJoin: 'round'
        }).addTo(this.map);
      }
  }

}
