import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyReportAtSeaComponent } from './daily-report-at-sea.component';

describe('DailyReportAtSeaComponent', () => {
  let component: DailyReportAtSeaComponent;
  let fixture: ComponentFixture<DailyReportAtSeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyReportAtSeaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyReportAtSeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
