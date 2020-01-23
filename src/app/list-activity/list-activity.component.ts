import { Component, Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Activity } from '../shared/Activity';

@Component({
  selector: 'app-list-activity',
  templateUrl: './list-activity.component.html',
  styleUrls: ['./list-activity.component.css']
})
export class ListActivityComponent {

  @Output() athleteActivitiesLoad = new EventEmitter();
  @Output() athleteActivityPlotEvent = new EventEmitter<Activity>();

  @Input() athleteActivities: Array<Activity> = new Array();

  constructor() { }
}
