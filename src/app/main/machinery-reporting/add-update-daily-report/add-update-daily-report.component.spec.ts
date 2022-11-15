import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateDailyReportComponent } from './add-update-daily-report.component';

describe('AddUpdateDailyReportComponent', () => {
  let component: AddUpdateDailyReportComponent;
  let fixture: ComponentFixture<AddUpdateDailyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateDailyReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateDailyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
