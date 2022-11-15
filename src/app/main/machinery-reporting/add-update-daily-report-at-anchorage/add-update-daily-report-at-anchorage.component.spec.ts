import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateDailyReportAtAnchorageComponent } from './add-update-daily-report-at-anchorage.component';

describe('AddUpdateDailyReportAtAnchorageComponent', () => {
  let component: AddUpdateDailyReportAtAnchorageComponent;
  let fixture: ComponentFixture<AddUpdateDailyReportAtAnchorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateDailyReportAtAnchorageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateDailyReportAtAnchorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
