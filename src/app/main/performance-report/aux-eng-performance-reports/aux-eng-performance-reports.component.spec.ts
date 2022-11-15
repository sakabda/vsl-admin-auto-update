import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuxEngPerformanceReportsComponent } from './aux-eng-performance-reports.component';

describe('AuxEngPerformanceReportsComponent', () => {
  let component: AuxEngPerformanceReportsComponent;
  let fixture: ComponentFixture<AuxEngPerformanceReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuxEngPerformanceReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuxEngPerformanceReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
