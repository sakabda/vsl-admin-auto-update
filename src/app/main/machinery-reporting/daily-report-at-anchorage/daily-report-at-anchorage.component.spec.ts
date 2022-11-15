import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyReportAtAnchorageComponent } from './daily-report-at-anchorage.component';

describe('DailyReportAtAnchorageComponent', () => {
  let component: DailyReportAtAnchorageComponent;
  let fixture: ComponentFixture<DailyReportAtAnchorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyReportAtAnchorageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyReportAtAnchorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
