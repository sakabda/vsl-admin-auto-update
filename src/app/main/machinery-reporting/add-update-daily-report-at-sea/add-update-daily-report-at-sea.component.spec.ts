import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateDailyReportAtSeaComponent } from './add-update-daily-report-at-sea.component';

describe('AddUpdateDailyReportAtSeaComponent', () => {
  let component: AddUpdateDailyReportAtSeaComponent;
  let fixture: ComponentFixture<AddUpdateDailyReportAtSeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateDailyReportAtSeaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateDailyReportAtSeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
