import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceReportDashboardComponent } from './performance-report-dashboard.component';

describe('PerformanceReportDashboardComponent', () => {
  let component: PerformanceReportDashboardComponent;
  let fixture: ComponentFixture<PerformanceReportDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformanceReportDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceReportDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
