import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-athlete-data',
  templateUrl: './athlete-data.component.html',
  styleUrls: ['./athlete-data.component.css']
})
export class AthleteDataComponent implements OnInit {
  @Input() athleteData;
  constructor() { }

  ngOnInit() {
  }

}
