import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BunkerStockReportingDashboardComponent } from './bunker-stock-reporting-dashboard.component';

describe('BunkerStockReportingDashboardComponent', () => {
  let component: BunkerStockReportingDashboardComponent;
  let fixture: ComponentFixture<BunkerStockReportingDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BunkerStockReportingDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BunkerStockReportingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
