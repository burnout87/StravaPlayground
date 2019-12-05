import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteDataComponent } from './athlete-data.component';

describe('AthleteDataComponent', () => {
  let component: AthleteDataComponent;
  let fixture: ComponentFixture<AthleteDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
