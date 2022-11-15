import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineryReportingDashboardComponent } from './machinery-reporting-dashboard.component';

describe('MachineryReportingDashboardComponent', () => {
  let component: MachineryReportingDashboardComponent;
  let fixture: ComponentFixture<MachineryReportingDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachineryReportingDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineryReportingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
